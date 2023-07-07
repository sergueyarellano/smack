export const smackAction = {
  SET_CONNECTED: 'SET_CONNECTED',
  SET_COMMAND: 'SET_COMMAND',
  SEND_MESSAGE: 'SEND_MESSAGE',
  RECEIVE_MESSAGE: 'RECEIVE_MESSAGE'
}
export const initialSmackState = {
  isConnected: null,
  commands: [],
  egressMessage: undefined,
  ingressMessage: undefined
}
export function smackReducer (state, action) {
  switch (action.type) {
    case smackAction.SET_CONNECTED:
      return { ...state, isConnected: true }
    case smackAction.SET_COMMAND:
      return { ...state, commands: [...state.commands, action.payload] }
    case smackAction.SEND_MESSAGE: {
      return { ...state, egressMessage: action.payload }
    }
    case smackAction.RECEIVE_MESSAGE:
      return { ...state, ingressMessage: action.payload }
  }
}
