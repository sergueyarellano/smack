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

  useKeyPressEvents({ toggleTerminalVisibility })
  useExecCommands({ command, setPrograms, logTty, clearTerminal })
  const activePrograms = programs.map((program, key) => {
    const Prog = lazy(() => import(`./components/${program.name}`))
    return (
      <Suspense key={key} fallback={<div>Loading...</div>}>
        <Prog {...program.props} />
      </Suspense>
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
