import { useEffect, useReducer, useState } from 'react'
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
import { cmd } from './cli'
import VideoConfView from './components/video_conf_view'

export default function Smack () {
  const [{
    isConnected,
    egressMessage,
    ingressMessage,
    command,
    syslogStdin
  }, dispatch] = useReducer(smackReducer, initialSmackState)
  const {
    dispatchEventConnected,
    dispatchCommand,
    receiveMessage,
    sendMessage,
    dispatchSyslogStdin
  } = getDispatchers(dispatch)

  const [[localStream, remoteStream], dispatchVideoStreams] = useState([])
  // initialize WS connection and pass connect and event handlers
  useEffect(() => {
    initWebSocket({ dispatchMessage: receiveMessage, dispatchEventConnected })
    return () => cleanSocketEvents()
  }, [])

  // Emit egressMessages
  useEffect(() => {
    (isConnected && egressMessage) && emit(fmtMessage(egressMessage))
  }, [egressMessage, isConnected])

  // execute commands
  useEffect(() => { command && cmd(command, { dispatchSyslogStdin, dispatchVideoStreams }) }, [command])

  return (
    <main className={styles.main}>
      <div className={styles.horizontal}>
        <SysLog stdin={syslogStdin} isConnected={isConnected} />
        {/* <ChatView ingressMessage={ingressMessage} /> */}
        <VideoConfView localStream={localStream} remoteStream={remoteStream} />
      </div>
      <Ty dispatchCommand={dispatchCommand} dispatchMessage={sendMessage} />
    </main>
  )
}
