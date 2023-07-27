import help from './description.json'
import rtc from '../rtc/description.json'
import login from '../login/description.json'
import clear from '../clear/description.json'
import { logTypes } from '../../dataFormats'
export function exec (log) {
  /**
   * Add new command description here. TODO: automate
   */

  log([
    { value: 'use `<program> help` to know more about a program', type: logTypes.COMMAND },
    mapDescription(help),
    mapDescription(rtc),
    mapDescription(login),
    mapDescription(clear)
  ])
}

function mapDescription ({ name, description }) {
  return [
    { value: name, type: logTypes.HELP_COMMAND },
    { value: description, type: logTypes.HELP_DESCRIPTION }
  ]
}
