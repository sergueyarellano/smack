import { initWebSocket } from './socket'
import help from './help.json'
import view from './view'
import { literals } from './literals'
export const View = view
export const Name = literals.PROGRAM_NAME

let socket

export function exec ({ args, log, logE, onHelp, onView, onClose }) {
  if (args._[0] === 'help') {
    onHelp(help)
  } else if (args.u) {
    // option has to come with a username, not as a flag
    if (typeof args.u === 'boolean') {
      logE(literals.USERNAME_NOT_PROVIDED)
    } else {
      // if the socket is not initialized, set a user and connect
      if (!socket) {
        socket = initWebSocket(log)
        socket.auth = { username: args.u }
        socket.connect()
        onView()
      } else {
        // TODO: user wants to change the name, we would have to broadcast the change
        logE(literals.RESET_USERNAME)
      }
    }
  } else if (socket) {
    if (args.m) {
      socket.emit('message', args._.join(' '))
    }
  } else {
    logE(literals.ARG_NOT_ENABLED)
  }
  if (args.c) {
    onClose()
  }
}
