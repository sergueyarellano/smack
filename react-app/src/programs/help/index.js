import help from './help.json'
import rtc from '../rtc/help.json'
import ws from '../ws/help.json'
import clear from '../clear/help.json'
import { logTypes } from '../../dataFormats'
export function exec (log) {
  /**
   * Add new command description here. TODO: automate
   */

  log([
    { value: 'use `<program> help` to know more about a program', type: logTypes.COMMAND },
    mapDescription(help),
    mapDescription(rtc),
    mapDescription(ws),
    mapDescription(clear)
  ])
}

function mapDescription ({ name, description }) {
  return [
    { value: name, type: logTypes.HELP_COMMAND },
    { value: description, type: logTypes.HELP_DESCRIPTION }
  ]
}
