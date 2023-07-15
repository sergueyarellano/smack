import minimist from 'minimist'
import { initConfigRTC, setUpMediaSources, sendOffer, sendAnswer, closeRTC } from '../network/rtc'

const COMMAND_NAMES = {
  HELP: 'help',
  RTC: 'rtc'
}

const commands = new Map()
commands.set(COMMAND_NAMES.HELP, [{ command: 'help', description: 'this is help' }])
commands.set(COMMAND_NAMES.RTC, [
  { command: 'rtc -o', description: 'sends an rtc offer, outputs a <callId>' },
  { command: 'rtc -a <callId>', description: 'sends an rtc answer to <callId>, joins the call' },
  { command: 'rtc -c', description: 'closes the call, hangs up' }
])

const commandList = getCommandList(commands)

export function cmdParser (val) {
  // minimist expects an array
  return minimist(val.split(/\s/))
}

export async function cmd ({ command, parsed, raw }, { dispatchSyslogStdin, dispatchVideoStreams }) {
  // consider using yargs
  const syncLogs = [{ value: `> ${raw}`, type: 'commandLog' }]
  switch (command) {
    case COMMAND_NAMES.HELP: {
      syncLogs.push(...commandList)
      break
    }
    case COMMAND_NAMES.RTC: {
      if (parsed.o) {
        const rtcConfig = initConfigRTC()
        await setUpMediaSources(rtcConfig.pc).then(dispatchVideoStreams)
        sendOffer(rtcConfig).then(callId => dispatchSyslogStdin([{ value: `<callId> ${callId}`, type: 'infoLog' }]))
        syncLogs.push({ value: 'SDP offer sent...\nwaiting for remote ICE candidates...', type: 'infoLog' })
      } else if (parsed.a) {
        const rtcConfig = initConfigRTC()
        await setUpMediaSources(rtcConfig.pc).then(dispatchVideoStreams)
        sendAnswer(parsed.a, rtcConfig).then(() => dispatchSyslogStdin([{ value: `answering to <callId> ${parsed.a}...`, type: 'infoLog' }]))
        syncLogs.push({ value: 'SDP offer sent...\nwaiting for remote ICE candidates...', type: 'infoLog' })
      } else if (parsed.c) {
        closeRTC()
        syncLogs.push({ value: 'Closing rtc video call', type: 'infoLog' })
      }

      if (syncLogs.length === 1) {
        syncLogs.push({ value: 'You have to specify at least one argument', type: 'errorLog' })
      }
      break
    }
    default:
      syncLogs.push({ value: `${command} is not a command`, type: 'errorLog' })
      break
  }
  console.log('TCL: cmd -> syncLogs', syncLogs)
  dispatchSyslogStdin(syncLogs)
}

function getCommandList (commands) {
  const list = []
  list.push({ value: 'Commands', type: 'infoLog' }, { value: '--------', type: 'infoLog' })
  for (const [cmd, usage] of commands) {
    for (const { command, description } of usage) {
      // list.push(`${val.command}\t\t${val.description}`)
      list.push([{ value: command, type: 'helpCommandLog' }, { value: description, type: 'helpDescriptionLog' }])
    }
  }
  return list
}
