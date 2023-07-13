import SysLog from '../sys_log'
import Typewriter from '../typewriter'
import styles from './index.module.css'

// TODO: cool feature would be to remember history and reselect messages and commands
export default function Terminal ({ isConnected, syslogStdin, dispatchCommand, sendMessage }) {
  return (
    <div className={styles.main}>
      <label className={`${isConnected ? styles.isConnected : styles.isNotConnected} ${styles.statusConnected}`}>
        ws
      </label>
      <SysLog stdin={syslogStdin} />
      <Typewriter dispatchCommand={dispatchCommand} dispatchMessage={sendMessage} />
    </div>
  )
}
