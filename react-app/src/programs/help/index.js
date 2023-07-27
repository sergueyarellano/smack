import rtcDescription from '../rtc/description.json'
import loginDescription from '../login/description.json'
import { logTypes } from '../../dataFormats'
export function exec (log) {
  /**
   * Add new command description here. TODO: automate
   */
  const rtcUsage = mapDescription(rtcDescription)
  const loginUsage = mapDescription(loginDescription)

  log([
    { value: 'use `<program> help` to know more about a program', type: logTypes.COMMAND },
    rtcUsage,
    loginUsage
  ])
}

function mapDescription ({ name, description }) {
  return [
    { value: name, type: logTypes.HELP_COMMAND },
    { value: description, type: logTypes.HELP_DESCRIPTION }
  ]
}
