import { useCallback, useReducer } from 'react'

const smackAction = {
  LOG_TERM: 'LOG_TERM',
  SET_COMMAND: 'SET_COMMAND',
  TOGGLE_TERMINAL_VISIBILITY: 'TOGGLE_TERMINAL_VISIBILITY',
  ADD_PROGRAM: 'ADD_PROGRAM',
  DELETE_PROGRAM: 'DELETE_PROGRAM',
  UPDATE_PROPS: 'UPDATE_PROPS',
  CLEAR_TERMINAL: 'CLEAR_TERMINAL'
}
const initialSmackState = {
  isConnected: false,
  command: null,
  egressMessage: null,
  ingressMessage: null,
  ttyStdout: null,
  isTerminalVisible: true,
  programs: [],
  termCleared: 0
}
function smackReducer (state, action) {
  switch (action.type) {
    case smackAction.CLEAR_TERMINAL:
      return { ...state, termCleared: ++state.termCleared }
    case smackAction.SET_COMMAND:
      return { ...state, command: action.payload }
    case smackAction.LOG_TERM:
      return { ...state, ttyStdout: action.payload }
    case smackAction.TOGGLE_TERMINAL_VISIBILITY:
      return { ...state, isTerminalVisible: !state.isTerminalVisible }
    case smackAction.ADD_PROGRAM:
      return { ...state, programs: [...state.programs, action.payload] }
    case smackAction.DELETE_PROGRAM:
      return { ...state, programs: state.programs.filter(({ name }) => name !== action.payload.name) }
    case smackAction.UPDATE_PROPS:
      return {
        ...state,
        programs: state.programs.map(({ name, props }) => {
          if (name === action.payload.name) {
            return { name, props: { ...props, ...action.payload.props } }
          }
          return { name, props }
        })
      }
    default:
      return state
  }
}

export default function useSmackReducer () {
  const [state, dispatch] = useReducer(smackReducer, initialSmackState)
  const dispatchers = {
    clearTerminal: useCallback(() =>
      dispatch({ type: smackAction.CLEAR_TERMINAL }), [dispatch]),
    dispatchCommand: useCallback(cmd =>
      dispatch({ type: smackAction.SET_COMMAND, payload: cmd }), [dispatch]),
    dispatchEventConnected: useCallback((bool) =>
      dispatch({ type: smackAction.SET_CONNECTED, payload: bool }), [dispatch]),
    logTty: useCallback((stdin) =>
      dispatch({ type: smackAction.LOG_TERM, payload: stdin }), [dispatch]),
    toggleTerminalVisibility: useCallback((isVisible) =>
      dispatch({ type: smackAction.TOGGLE_TERMINAL_VISIBILITY }), [dispatch]),
    setPrograms: useCallback((props) => {
      if (props.type === 'add') {
        dispatch({ type: smackAction.ADD_PROGRAM, payload: props })
      } else if (props.type === 'delete') {
        dispatch({ type: smackAction.DELETE_PROGRAM, payload: props })
      } else if (props.type === 'update_props') {
        dispatch({ type: smackAction.UPDATE_PROPS, payload: props })
      }
    }, [dispatch])
  }
  return [state, dispatchers]
}
