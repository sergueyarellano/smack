import { useEffect, useReducer, useState, Fragment } from 'react'
import styles from './page.module.css'
import { initWebSocket, cleanSocketEvents, emit } from './network/socket'
import { fmtMessage } from './dataFormats'
import cmd from './programs'
import {
  getDispatchers,
  initialSmackState,
  smackReducer
} from './reducers/smackReducer'
// import { cmd } from './cli'
import Terminal from './components/terminal'

export default function Smack () {
  const [{
    isConnected,
    egressMessage,
    ingressMessage,
    command,
    ttyStdout
  }, dispatch] = useReducer(smackReducer, initialSmackState)
  const {
    dispatchEventConnected,
    dispatchCommand,
    receiveMessage,
    sendMessage,
    logTty
  } = getDispatchers(dispatch)

  const [isTerminalVisible, toggleTerminalVisibility] = useState(true)
  const [programs, setPrograms] = useState([])
  // initialize WS connection and pass connect and event handlers
  useEffect(() => {
    // TODO: websockets should be used for RTC signaling and to see who is connected
    // RTC data channels can be used for chat
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
  useEffect(() => { command && cmd({ ...command, logTty, setPrograms }) }, [command])

  return (
    <main className={styles.main}>

      <Terminal
        isVisible={isTerminalVisible}
        isConnected={isConnected}
        ttyStdout={ttyStdout}
        dispatchCommand={dispatchCommand}
        logTty={logTty}
        sendMessage={sendMessage}
      />
      {programs.map((program, i) => <Fragment key={i}>{program.view}</Fragment>)}
    </main>
  )
}
