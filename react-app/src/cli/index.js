import minimist from 'minimist'
import { initConfigRTC, setUpMediaSources, sendOffer, sendAnswer } from '../network/rtc'

const COMMAND_NAMES = {
  HELP: 'help',
  RTC: 'rtc'
}

const commands = new Map()
commands.set(COMMAND_NAMES.HELP, [{ command: '/help', description: 'this is help' }])
commands.set(COMMAND_NAMES.RTC, [
  { command: '/rtc -o', description: 'sends an rtc offer, outputs a <callId>' },
  { command: '/rtc -a <callId>', description: 'sends an rtc answer to <callId>, joins the call' }
])

const commandList = getCommandList(commands)

export function cmdParser (val) {
  const withoutSlash = val.substring(1)

  // minimist expects an array
  return minimist(withoutSlash.split(/\s/))
}

export async function cmd ({ command, parsed }, { dispatchSyslogStdin, dispatchVideoStreams }) {
  // consider using yargs
  switch (command) {
    case COMMAND_NAMES.HELP: {
      dispatchSyslogStdin([`/${command}`].concat(commandList))
      break
    }
    case COMMAND_NAMES.RTC: {
      if (parsed.o) {
        const rtcConfig = initConfigRTC()
        await setUpMediaSources(rtcConfig.pc).then(dispatchVideoStreams)
        sendOffer(rtcConfig).then(callId => dispatchSyslogStdin([`<callId> ${callId}`]))
        dispatchSyslogStdin([`/${command} -o`].concat('SDP offer sent...\nwaiting for remote ICE candidates...'))
      }
      if (parsed.a) {
        console.log('TCL: cmd -> parsed.a', parsed.a)
        const rtcConfig = initConfigRTC()
        await setUpMediaSources(rtcConfig.pc).then(dispatchVideoStreams)
        sendAnswer(parsed.a, rtcConfig).then(() => dispatchSyslogStdin([`answering to <callId> ${parsed.a}...`]))
        dispatchSyslogStdin([`/${command}`].concat('SDP answer sent...\nwaiting for remote ICE candidates...'))
      }
      break
    }
    default:
      dispatchSyslogStdin([`${command} is not a command`])
      break
  }
}

function getCommandList (commands) {
  const list = []
  list.push('Commands')
  for (const [cmd, usage] of commands) {
    for (const val of usage) {
      list.push(`  ${val.command}\t\t${val.description}`)
    }
  }
  return list
}
