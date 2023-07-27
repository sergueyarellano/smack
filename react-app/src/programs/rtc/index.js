import { initConfigRTC, setUpMediaSources, sendOffer, sendAnswer, closeRTC } from './api'
import { literals } from './literals'
import help from './help.json'
import VideoConfView from './view'
export const View = VideoConfView
export const Name = literals.PROGRAM_NAME

export async function exec ({ args, log, onMediaSources, onClose, onHelp }) {
  if (args._[0] === 'help') {
    onHelp(help)
  } else if (args.o) {
    const rtcConfig = initConfigRTC()
    // important to await for camera permissions before sending offer or answer
    await setUpMediaSources(rtcConfig.pc).then(onMediaSources)
    sendOffer(rtcConfig)
      .then((callId) => log(literals.OFFER_SENT(callId)))
  } else if (args.a) {
    const rtcConfig = initConfigRTC()
    await setUpMediaSources(rtcConfig.pc).then(onMediaSources)
    sendAnswer(rtcConfig, args.a)
      .then((callId) => log(literals.ANSWER_SENT(callId)))
  } else if (args.c) {
    closeRTC()
    onClose()
    log(literals.CLOSE)
  } else {
    log(literals.NO_ARGUMENTS)
  }
}
