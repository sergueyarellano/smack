import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDoc, updateDoc, setDoc, doc, onSnapshot } from 'firebase/firestore'

let pc, localStream, remoteStream

export function closeRTC () {
  pc.ontrack = null
  pc.onnicecandidate = null
  pc.oniceconnectionstatechange = null
  pc.onsignalingstatechange = null
  pc.onicegatheringstatechange = null
  pc.onnotificationneeded = null
  pc.close()
  pc = null
  localStream.getTracks().forEach(track => {
    track.stop()
  })
  localStream = null
  remoteStream = null

  // TODO: dispatch close event to video call component
}

export function initConfigRTC () {
  const firebaseConfig = {
    apiKey: 'AIzaSyBJ3Y9VuXhtpsZLiMyEIZ89Pq6WxMsm23g',
    authDomain: 'signal-server-e9263.firebaseapp.com',
    projectId: 'signal-server-e9263',
    storageBucket: 'signal-server-e9263.appspot.com',
    messagingSenderId: '335901369645',
    appId: '1:335901369645:web:b1fb94ff19429ca6ab9fa4'
  }

  const app = initializeApp(firebaseConfig)

  const firestore = getFirestore(app)

  const servers = {
    iceServers: [{
      url: 'stun:stun.l.google.com:19302'
    }, {
      urls: 'stun:global.stun.twilio.com:3478'
    }, {
      url: 'stun:stun1.l.google.com:19302'
    }, {
      url: 'stun:stun2.l.google.com:19302'
    }, {
      url: 'stun:stun3.l.google.com:19302'
    }, {
      url: 'stun:stun4.l.google.com:19302'
    }],
    iceCandidatePoolSize: 10
  }

  // Global State
  pc = new window.RTCPeerConnection(servers)

  return { pc, firestore }
}

export async function setUpMediaSources (pc) {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  remoteStream = new window.MediaStream()

  // Push tracks from local stream to peer connection
  localStream.getTracks().forEach((track) => {
    pc.addTrack(track, localStream)
  })

  // Pull tracks from remote stream, add to video stream
  // TODO: not firing yet for the one who accepts the call
  pc.ontrack = (event) => {
    console.log('TCL: pc.ontrack -> event', event)
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track)
    })
  }
  return [localStream, remoteStream]
}

export async function sendOffer ({ firestore, pc }) {
  // Reference Firestore collections for signaling
  const callDoc = doc(collection(firestore, 'calls'))
  const offerCandidates = collection(firestore, `calls/${callDoc.id}/offerCandidates`)
  const answerCandidates = collection(firestore, `calls/${callDoc.id}/answerCandidates`)

  // Get candidates for caller, save to db
  pc.onicecandidate = (event) => {
    event.candidate && addDoc(offerCandidates, event.candidate.toJSON())
  }

  // Create offer SDP
  const offerDescription = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true })
  await pc.setLocalDescription(offerDescription)
  const offer = { sdp: offerDescription.sdp, type: offerDescription.type }
  await setDoc(callDoc, { offer })

  // Listen for remote answer SDP
  onSnapshot(callDoc, { next: handleSignalFromRemote, error: console.error })
  function handleSignalFromRemote (snapshot) {
    const data = snapshot.data()
    if (!pc.currentRemoteDescription && data?.answer) {
      const answerDescription = new window.RTCSessionDescription(data.answer)
      pc.setRemoteDescription(answerDescription)
    }
  }

  // When answered, add ICE candidates to peer connection
  onSnapshot(answerCandidates, { next: addRemoteCandidate, error: console.error })
  function addRemoteCandidate (snapshot) {
    snapshot.docChanges().forEach(async (change) => {
      if (change.type === 'added') {
        const candidate = new window.RTCIceCandidate(change.doc.data())
        await pc.addIceCandidate(candidate)
      }
    })
  }
  return callDoc.id
}

export async function sendAnswer (callId, { firestore, pc }) {
  // reference firestore collections for signaling
  const callDoc = doc(collection(firestore, 'calls'), callId)
  const offerCandidates = collection(firestore, `calls/${callDoc.id}/offerCandidates`)
  const answerCandidates = collection(firestore, `calls/${callDoc.id}/answerCandidates`)

  pc.onicecandidate = (event) => {
    event.candidate && addDoc(answerCandidates, event.candidate.toJSON())
  }

  // get SDP from signaling db
  const callData = (await getDoc(callDoc)).data()
  const offerDescription = callData.offer
  await pc.setRemoteDescription(new window.RTCSessionDescription(offerDescription))

  // send SDP to db signaling
  const answerDescription = await pc.createAnswer()
  await pc.setLocalDescription(answerDescription)
  const answer = {
    type: answerDescription.type,
    sdp: answerDescription.sdp
  }
  await updateDoc(callDoc, { answer })

  // ICE
  onSnapshot(offerCandidates, { next: addRemoteCandidate, error: console.error })

  function addRemoteCandidate (snapshot) {
    snapshot.docChanges().forEach(async (change) => {
      if (change.type === 'added') {
        const data = change.doc.data()
        console.log('TCL: addRemoteCandidate -> data', data)
        await pc.addIceCandidate(new window.RTCIceCandidate(data))
      }
    })
  }
}

function sleep (ms) {
  return new Promise((resolve, reject) => setTimeout(resolve, ms))
}
