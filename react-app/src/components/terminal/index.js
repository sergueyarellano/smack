import Output from './output'
import Typewriter from './tty'
import styles from './index.module.css'
import Draggable from 'react-draggable'
import { useState } from 'react'

// TODO: cool feature would be to remember history and reselect messages and commands
export default function Terminal ({ isVisible, isConnected, ttyStdout, dispatchCommand, sendMessage, logTty, cleared }) {
  const [clicked, setClicked] = useState(0)

  return (
    <Draggable>
      <div onClick={() => setClicked((prev) => ++prev)} className={`${isVisible ? styles.main : styles.notVisible}`}>
        <label className={`${isConnected ? styles.isConnected : styles.isNotConnected} ${styles.statusConnected}`}>
          ws
        </label>
        <Output stdout={ttyStdout} cleared={cleared} />
        <Typewriter dispatchCommand={dispatchCommand} dispatchMessage={sendMessage} logTty={logTty} isVisible={isVisible} clicked={clicked} />
      </div>
    </Draggable>
  )
}
