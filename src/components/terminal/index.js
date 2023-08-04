import Output from './output'
import Typewriter from './tty'
import Window from '../window'
import styles from './index.module.css'
// TODO: if this is an interface for programs, how should a visual interface look like?
export default function Terminal ({ isVisible, ttyStdout, dispatchCommand, logTty, cleared }) {
  return (
    <Window title='commander' isVisible={isVisible} column='1' row='3'>
      <div className={styles.main}>
        <Output stdout={ttyStdout} cleared={cleared} />
        <Typewriter
          dispatchCommand={dispatchCommand}
          logTty={logTty}
          isVisible={isVisible}
        />
      </div>
    </Window>
  )
}
