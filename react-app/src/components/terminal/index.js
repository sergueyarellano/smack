import Output from './output'
import Typewriter from './tty'
import Window from '../window'
import styles from './index.module.css'
// TODO: if this is an interface for programs, how should a visual interface look like?
export default function Terminal ({ isVisible, ttyStdout, dispatchCommand, sendMessage, logTty, cleared }) {
  return (
    <Window title='commander 1.0' isVisible={isVisible}>
      <div className={styles.main}>
        <Output stdout={ttyStdout} cleared={cleared} />
        <Typewriter
          dispatchCommand={dispatchCommand}
          dispatchMessage={sendMessage}
          logTty={logTty}
          isVisible={isVisible}
        />
      </div>
    </Window>
  )
}
