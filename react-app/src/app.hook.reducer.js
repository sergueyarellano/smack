import { useCallback, useReducer } from 'react'
import { fmtMessage } from './dataFormats'

const smackAction = {
  SET_CONNECTED: 'CONNECT',
  RECEIVE_MESSAGE: 'RECEIVE_MESSAGE',
  SEND_MESSAGE: 'SEND_MESSAGE',
  SET_SYSLOG: 'SET_SYSLOG',
  SET_COMMAND: 'SET_COMMAND',
  SET_USERS: 'SET_USERS',
  TOGGLE_TERMINAL_VISIBILITY: 'TOGGLE_TERMINAL_VISIBILITY',
  ADD_PROGRAM: 'ADD_PROGRAM',
  DELETE_PROGRAM: 'DELETE_PROGRAM'
}
const initialSmackState = {
  isConnected: false,
  command: null,
  egressMessage: null,
  ingressMessage: null,
  ttyStdout: null,
  isTerminalVisible: true,
  programs: []
}
function smackReducer (state, action) {
  switch (action.type) {
    case smackAction.SET_CONNECTED:
      return { ...state, isConnected: action.payload }
    case smackAction.SET_COMMAND:
      return { ...state, command: action.payload }
    case smackAction.SEND_MESSAGE:
      return { ...state, egressMessage: action.payload }
    case smackAction.SET_SYSLOG:
      return { ...state, ttyStdout: action.payload }
    case smackAction.RECEIVE_MESSAGE:
      return { ...state, ingressMessage: action.payload }
    case smackAction.TOGGLE_TERMINAL_VISIBILITY:
      return { ...state, isTerminalVisible: !state.isTerminalVisible }
    case smackAction.ADD_PROGRAM:
      return { ...state, programs: [...state.programs, action.payload] }
    case smackAction.DELETE_PROGRAM:
      return { ...state, programs: state.programs.filter(({ name }) => name !== action.payload.name) }
    default:
      return state
  }
}

export default function useSmackReducer () {
  const [state, dispatch] = useReducer(smackReducer, initialSmackState)
  const dispatchers = {
    dispatchCommand: useCallback(cmd =>
      dispatch({ type: smackAction.SET_COMMAND, payload: cmd }), [dispatch]),
    receiveMessage: useCallback(msg =>
      dispatch({ type: smackAction.RECEIVE_MESSAGE, payload: fmtMessage(msg) }), [dispatch]),
    sendMessage: useCallback(msg =>
      dispatch({ type: smackAction.SEND_MESSAGE, payload: fmtMessage(msg) }), [dispatch]),
    dispatchEventConnected: useCallback((bool) =>
      dispatch({ type: smackAction.SET_CONNECTED, payload: bool }), [dispatch]),
    logTty: useCallback((stdin) =>
      dispatch({ type: smackAction.SET_SYSLOG, payload: stdin }), [dispatch]),
    toggleTerminalVisibility: useCallback((isVisible) =>
      dispatch({ type: smackAction.TOGGLE_TERMINAL_VISIBILITY }), [dispatch]),
    setPrograms: useCallback(({ type, name, view }) => {
      dispatch({
        type: type === 'add'
          ? smackAction.ADD_PROGRAM
          : smackAction.DELETE_PROGRAM,
        payload: { name, view }
      })
    }, [dispatch])
  }
  return [state, dispatchers]
}
