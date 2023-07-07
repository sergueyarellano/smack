import { useEffect, useReducer } from 'react'
import ChatView from './components/chat_view'
import SysLog from './components/sys_log'
import Ty from './components/typewriter'
import styles from './page.module.css'
import { initWebSocket, cleanSocketEvents, emit } from './network/socket'
import { fmtMessage } from './dataFormats'
import {
  initialSmackState,
  smackAction,
  smackReducer
} from './reducers/smackReducer'

export default function Smack () {
  // TODO: when command is not a new one, how to avoid Syslog rerender?
  const [state, dispatch] = useReducer(smackReducer, initialSmackState)
  const dispatchCommand = cmd =>
    dispatch({ type: smackAction.SET_COMMAND, payload: cmd })
  const handleMsg = type => msg => dispatch({ type, payload: fmtMessage(msg) })
  const receiveMessage = handleMsg(smackAction.RECEIVE_MESSAGE)
  const sendMessage = handleMsg(smackAction.SEND_MESSAGE)

  // initialize WS connection and pass connect and event handlers
  useEffect(() => {
    initWebSocket({
      dispatchMessage: msg => receiveMessage(msg),
      dispatchEventConnected: () =>
        dispatch({ type: smackAction.SET_CONNECTED })
    })
    return () => cleanSocketEvents()
  }, [])

  // Emit egressMessages
  useEffect(() => {
    if (state.isConnected && state.egressMessage) {
      emit(fmtMessage(state.egressMessage))
    }
  }, [state.egressMessage, state.isConnected])

  return (
    <main className={styles.main}>
      <div className={styles.horizontal}>
        <SysLog commands={state.commands} isConnected={state.isConnected} />
        <ChatView ingressMessage={state.ingressMessage} />
      </div>
      <Ty dispatchCommand={dispatchCommand} dispatchMessage={sendMessage} />
    </main>
  )
}
