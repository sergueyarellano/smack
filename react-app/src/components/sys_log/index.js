import { useEffect, useRef, useState } from 'react'
import style from './index.module.css'

const logStyle = {
  ERROR: style.errorLog,
  LOG: style.defaultLog,
  SUCCESS: style.successLog
}
export default function SysLog ({ stdin, isConnected }) {
  const [log, setLog] = useState([])
  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    // does not work properly without setTimeout next tick
    setTimeout(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, 0)
  }
  useEffect(() => {
    // store the incoming log and scroll to the bottom
    stdin && setLog((prev) => [...prev, ...stdin])
    scrollToBottom()
  }, [stdin])
  return (
    <div className={style.main}>
      <label style={{ color: isConnected ? 'green' : 'red' }}>
        Web socket {isConnected ? 'connected' : 'disconnected'}
      </label>
      <ul className={style.logList}>
        {log.map(composeLogItem)}
        <div ref={messagesEndRef} />
      </ul>

    </div>
  )
}
function composeLogItem (value, index) {
  return <pre key={index}>{value}</pre>
}
