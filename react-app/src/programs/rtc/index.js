import { logTypes } from '../../dataFormats'
import { initConfigRTC, setUpMediaSources, sendOffer, sendAnswer, closeRTC } from './api'
import { literals } from './literals'
import VideoConfView from './view'

export async function exec ({ parsed, setPrograms, logTty }) {
  if (parsed.o) {
    const rtcConfig = initConfigRTC()
    // important to await for camera permissions before sending offer or answer
    await getMediaSources(rtcConfig, setPrograms)
    sendOffer(rtcConfig).then(logCallId(literals.OFFER_SENT, logTty))
  } else if (parsed.a) {
    const rtcConfig = initConfigRTC()
    await getMediaSources(rtcConfig, setPrograms)
    sendAnswer(rtcConfig, parsed.a).then(logCallId(literals.ANSWER_SENT, logTty))
  } else if (parsed.c) {
    closeRTC()
    setPrograms(removeProgramFromList(literals.PROGRAM_NAME))
    logTty({ value: literals.CLOSE, type: logTypes.INFO })
  } else {
    logTty({ value: literals.NO_ARGUMENTS, type: logTypes.INFO })
  }
}

function logCallId (getLiteral, logTty) {
  return callId => logTty([{ value: getLiteral(callId), type: logTypes.INFO }])
}

function getMediaSources (rtcConfig, setPrograms) {
  return setUpMediaSources(rtcConfig.pc)
    .then(addProgramToList)
    .then(setPrograms)
}

// TODO: these functions could be generic
function addProgramToList ([localStream, remoteStream]) {
  // return (prev) => [...prev, { name: 'Video p2p', path: 'video_conf_view', props: { localStream, remoteStream } }]
  return (prev) => [
    ...prev,
    {
      name: literals.PROGRAM_NAME,
      view: <VideoConfView localStream={localStream} remoteStream={remoteStream} />
    }
  ]
}

function removeProgramFromList (programName) {
  return (prev) => prev.filter(({ name }) => name !== literals.PROGRAM_NAME)
}
