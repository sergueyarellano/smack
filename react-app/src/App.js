import { useEffect, useReducer, useState, Fragment } from 'react'
import { flushSync } from 'react-dom'
import styles from './page.module.css'
import { initWebSocket, cleanSocketEvents, emit } from './network/socket'
import { fmtMessage, logTypes } from './dataFormats'

import cmd from './programs'
import {
  getDispatchers,
  initialSmackState,
  smackReducer
} from './reducers/smackReducer'
import Terminal from './components/terminal'
import { emitter } from './network/events'

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
    (isConnected && egressMessage) && emit({ message: fmtMessage(egressMessage) })
  }, [egressMessage, isConnected])

  // execute commands
  useEffect(() => {
    const onLog = function (value) {
      if (typeof value === 'object') {
        // TODO: we force dom update because batching 2 hook calls is not working
        // and logs were lost. We think it's a thing of react 18
        flushSync(() => logTty(value))
      } else {
        flushSync(logTty({ value, type: logTypes.INFO }))
      }
    }
    // we use a listener for log events, so we can force update the DOM each time
    emitter.on('log', onLog)
    /**
     * cmd accepts:
     * log: function, in react we need an emitter for logs since a dispatcher would not render several times
     */
    command && cmd({
      ...command,
      log: emitter.emit.bind(emitter, 'log'),
      setPrograms,
      emit
    })
    return () => {
      emitter.off('log', onLog)
    }
  }, [command])

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
