import { useEffect, useReducer } from 'react'
import ChatView from './components/chat_view'
import SysLog from './components/sys_log'
import Ty from './components/typewriter'
import styles from './page.module.css'
import { initWebSocket, cleanSocketEvents, emit } from './network/socket'
import { fmtMessage } from './dataFormats'
import {
  getDispatchers,
  initialSmackState,
  smackReducer
} from './reducers/smackReducer'

export default function Smack () {
  // TODO: when command is not a new one, how to avoid Syslog rerender?
  const [{ isConnected, egressMessage, ingressMessage, commands }, dispatch] = useReducer(smackReducer, initialSmackState)

  const { dispatchEventConnected, dispatchCommand, receiveMessage, sendMessage } = getDispatchers(dispatch)

  // initialize WS connection and pass connect and event handlers
  useEffect(() => {
    initWebSocket({ dispatchMessage: receiveMessage, dispatchEventConnected })
    return () => cleanSocketEvents()
  }, [])

  // Emit egressMessages
  useEffect(() => {
    (isConnected && egressMessage) && emit(fmtMessage(egressMessage))
  }, [egressMessage, isConnected])

  return (
    <main className={styles.main}>
      <div className={styles.horizontal}>
        <SysLog commands={commands} isConnected={isConnected} />
        <ChatView ingressMessage={ingressMessage} />
      </div>
      <Ty dispatchCommand={dispatchCommand} dispatchMessage={sendMessage} />
    </main>
  )
}
