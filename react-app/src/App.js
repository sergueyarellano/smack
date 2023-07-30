import { Suspense, lazy } from 'react'
import styles from './page.module.css'
import Terminal from './components/terminal'
import useExecCommands from './app.hook.execCommands'
import useKeyPressEvents from './app.hook.keyPressEvents'
import useSmackReducer from './app.hook.reducer'

export default function Smack () {
  const [{ isConnected, command, ttyStdout, isTerminalVisible, programs, termCleared },
    {
      dispatchCommand,
      logTty,
      toggleTerminalVisibility,
      setPrograms,
      clearTerminal
    }] = useSmackReducer()
  console.log('TCL: Smack -> programs', programs)

  useKeyPressEvents({ toggleTerminalVisibility })
  useExecCommands({ command, setPrograms, logTty, clearTerminal })
  const activePrograms = programs.map((program, key) => {
    const Prog = program.View
    return (
      <Prog key={key} {...program.props} />
    )
  })
  return (
    <main className={styles.main}>

      <Terminal
        cleared={termCleared}
        isVisible={isTerminalVisible}
        isConnected={isConnected}
        ttyStdout={ttyStdout}
        dispatchCommand={dispatchCommand}
        logTty={logTty}
      />
      {activePrograms}
    </main>
  )
}
