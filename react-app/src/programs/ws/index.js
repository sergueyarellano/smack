import { initWebSocket } from './socket'
import help from './help.json'
import { literals } from './literals'
export const Name = literals.PROGRAM_NAME

let socket

export function exec ({ args, log, logE, onHelp, onView, onClose }) {
  if (args._[0] === 'help') {
    return onHelp(help.commands)
  }
  if (args.u) {
    // option has to come with a username, not as a flag
    if (typeof args.u === 'boolean') {
      return logE(literals.USERNAME_NOT_PROVIDED)
    }
    // if the socket is not initialized, set a user and connect
    if (!socket) {
      socket = initWebSocket(log)
      socket.auth = { username: args.u }
      socket.connect()
      return onView()
    }

    // TODO: user wants to change the name, we would have to broadcast the change
    return logE(literals.RESET_USERNAME)
  }

  if (args.m) {
    if (socket) return socket.emit('message', args._.join(' '))
    return logE(literals.ARG_NOT_ENABLED)
  }

  if (args.c) {
    return onClose()
  }
  logE(literals.ARG_NOT_PROVIDED)
}
