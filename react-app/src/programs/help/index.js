import rtcHelp from '../rtc/help.json'
import { logTypes } from '../../dataFormats'
export function exec (logTty) {
  /**
   * Add new command description here. TODO: automate
   */
  const rtcUsage = getCommandList(rtcHelp)

  logTty([
    ...rtcUsage
  ])
}

function getCommandList (commands) {
  return commands.map(({ command, description }) => [
    { value: command, type: logTypes.HELP_COMMAND },
    { value: description, type: logTypes.HELP_DESCRIPTION }
  ])
}
