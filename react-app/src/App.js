import { Fragment } from 'react'
import styles from './page.module.css'
import Terminal from './components/terminal'
import useExecCommands from './app.hook.execCommands'
import useKeyPressEvents from './app.hook.keyPressEvents'
import useInitSocket from './app.hook.initSocket'
import useSmackReducer from './app.hook.reducer'

export default function Smack () {
  const [{ isConnected, command, ttyStdout, isTerminalVisible, programs, termCleared },
    {
      dispatchEventConnected,
      dispatchCommand,
      receiveMessage,
      sendMessage,
      logTty,
      toggleTerminalVisibility,
      setPrograms,
      clearTerminal
    }] = useSmackReducer()

  useInitSocket({ receiveMessage, dispatchEventConnected })
  useKeyPressEvents({ toggleTerminalVisibility })
  useExecCommands({ command, setPrograms, logTty, clearTerminal })

  return (
    <main className={styles.main}>

      <Terminal
        cleared={termCleared}
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
