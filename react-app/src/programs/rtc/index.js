import { initConfigRTC, setUpMediaSources, sendOffer, sendAnswer, closeRTC } from './api'
import { literals } from './literals'
import help from './help.json'
export const Name = literals.PROGRAM_NAME

export async function exec ({ args, log, onView, onClose, onHelp, onStream }) {
  if (args._[0] === 'help') {
    onHelp(help.commands)
  } else if (args.o) {
    const rtcConfig = initConfigRTC()
    // important to await for camera permissions before sending offer or answer
    await setUpMediaSources(rtcConfig.pc, onStream).then(onView)
    sendOffer(rtcConfig)
      .then((callId) => log(literals.OFFER_SENT(callId)))
  } else if (args.a) {
    const rtcConfig = initConfigRTC()
    await setUpMediaSources(rtcConfig.pc, onStream).then(onView)
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
