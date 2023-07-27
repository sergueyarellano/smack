import Output from './output'
import Typewriter from './tty'
import styles from './index.module.css'

// TODO: cool feature would be to remember history and reselect messages and commands
export default function Terminal ({ isVisible, isConnected, ttyStdout, dispatchCommand, sendMessage, logTty, cleared }) {
  return (
    <div className={`${isVisible ? styles.main : styles.notVisible}`}>
      <label className={`${isConnected ? styles.isConnected : styles.isNotConnected} ${styles.statusConnected}`}>
        ws
      </label>
      <Output stdout={ttyStdout} cleared={cleared} />
      <Typewriter dispatchCommand={dispatchCommand} dispatchMessage={sendMessage} logTty={logTty} isVisible={isVisible} />
    </div>

  )
}
