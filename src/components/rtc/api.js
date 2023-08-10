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
  // remoteStreams.forEach((stream, i) => {
  //   remoteStreams[i] = null
  // })
}

export async function peer () {
  const servers = {
    iceServers: [{ url: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:global.stun.twilio.com:3478' },
      {
        urls: 'turn:44.203.7.211:3478',
        username: 'smack',
        credential: 'smack'
      },
      { url: 'stun:stun1.l.google.com:19302' },
      { url: 'stun:stun2.l.google.com:19302' },
      { url: 'stun:stun3.l.google.com:19302' },
      { url: 'stun:stun4.l.google.com:19302' }
    ],
    iceCandidatePoolSize: 10
  }

  // Global State
  pc = new window.RTCPeerConnection(servers)

  return pc
}

export async function setUpMediaSources ({ pc, setStream }) {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  remoteStream = new window.MediaStream()
  // Push tracks from local stream to peer connection
  localStream.getTracks().forEach((track) => {
    pc.addTrack(track, localStream)
  })

  // Pull tracks from remote stream, add to video stream
  pc.ontrack = ({ track, streams }) => {
    streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track)
    })
  }

  setStream([{ self: true, src: localStream }, { self: false, src: remoteStream }])
}

export async function sendOffer ({ pc, socket, to }) {
  pc.oniceconnectionstatechange = () => {
    if (pc.iceConnectionState === 'failed') {
      pc.restartIce()
    }
  }
  // Get candidates for caller, save to db
  pc.onicecandidate = (event) => {
    event.candidate && socket.emit('rtc offer candidates', { content: event.candidate, to })
  }

  // Create offer SDP
  const offerDescription = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true })
  await pc.setLocalDescription(offerDescription)
  const offer = { sdp: offerDescription.sdp, type: offerDescription.type }
  socket.emit('rtc offer', { content: offer, to })

  // Listen for remote answer SDP
  socket.on('rtc answer', (answer) => {
    const answerDescription = new window.RTCSessionDescription(answer.content)
    pc.setRemoteDescription(answerDescription)
  })

  // When answered, add ICE candidates to peer connection
  socket.on('rtc answer candidates', (candidates) => {
    const candidate = new window.RTCIceCandidate(candidates.content)
    pc.addIceCandidate(candidate)
  })
}

export async function sendAnswer ({ pc, socket, to }) {
  // get SDP from signaling db
  socket.on('rtc offer', async (offer) => {
    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === 'failed') {
        pc.restartIce()
      }
    }
    pc.onicecandidate = (event) => {
      event.candidate && socket.emit('rtc answer candidates', { content: event.candidate, to })
    }

    pc.setRemoteDescription(new window.RTCSessionDescription(offer.content))
    // send SDP to db signaling
    const answerDescription = await pc.createAnswer()
    await pc.setLocalDescription(answerDescription)
    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp
    }
    socket.emit('rtc answer', { content: answer, to })
  })

  // ICE
  socket.on('rtc offer candidates', (candidates) => {
    const candidate = new window.RTCIceCandidate(candidates.content)
    pc.addIceCandidate(candidate)
  })
}
