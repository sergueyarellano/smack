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
import Terminal from './components/terminal'

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
  const [isTerminalVisible, toggleTerminalVisibility] = useState(true)

  // initialize WS connection and pass connect and event handlers
  useEffect(() => {
    initWebSocket({ dispatchMessage: receiveMessage, dispatchEventConnected })
    return () => cleanSocketEvents()
  }, [])

  // initialize key press events
  useEffect(() => {
    const onKeyDown = (e) => {
      e.code === 'KeyK' && e.metaKey && toggleTerminalVisibility(isVisible => !isVisible)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  // Emit egressMessages
  useEffect(() => {
    (isConnected && egressMessage) && emit(fmtMessage(egressMessage))
  }, [egressMessage, isConnected])

  // execute commands
  useEffect(() => { command && cmd(command, { dispatchSyslogStdin, dispatchVideoStreams }) }, [command])

  return (
    <main className={styles.main}>

      <Terminal
        isVisible={isTerminalVisible}
        isConnected={isConnected}
        syslogStdin={syslogStdin}
        dispatchCommand={dispatchCommand}
        sendMessage={sendMessage}
      />

      <VideoConfView localStream={localStream} remoteStream={remoteStream} />
    </main>
  )
}
