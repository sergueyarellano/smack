import { fmtMessage } from '../dataFormats'

export const smackAction = {
  SET_CONNECTED: 'CONNECT',
  RECEIVE_MESSAGE: 'RECEIVE_MESSAGE',
  SEND_MESSAGE: 'SEND_MESSAGE',
  SET_SYSLOG: 'SET_SYSLOG',
  SET_COMMAND: 'SET_COMMAND',
  SET_USERS: 'SET_USERS'
}
export const initialSmackState = {
  isConnected: false,
  command: null,
  egressMessage: null,
  ingressMessage: null,
  syslogStdin: null
}
export function smackReducer (state, action) {
  switch (action.type) {
    case smackAction.SET_CONNECTED:
      return { ...state, isConnected: true }
    case smackAction.SET_COMMAND:
      return { ...state, command: action.payload }
    case smackAction.SEND_MESSAGE:
      return { ...state, egressMessage: action.payload }
    case smackAction.SET_SYSLOG:
      return { ...state, syslogStdin: action.payload }
    case smackAction.RECEIVE_MESSAGE:
      return { ...state, ingressMessage: action.payload }
    default:
      return state
  }
}
export function getDispatchers (dispatch) {
  return {
    dispatchCommand: cmd => dispatch({ type: smackAction.SET_COMMAND, payload: cmd }),
    receiveMessage: msg => dispatch({ type: smackAction.RECEIVE_MESSAGE, payload: fmtMessage(msg) }),
    sendMessage: msg => dispatch({ type: smackAction.SEND_MESSAGE, payload: fmtMessage(msg) }),
    dispatchEventConnected: () => dispatch({ type: smackAction.SET_CONNECTED }),
    dispatchSyslogStdin: (stdin) => dispatch({ type: smackAction.SET_SYSLOG, payload: stdin })
  }
}
