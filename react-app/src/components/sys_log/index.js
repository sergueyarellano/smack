import { useEffect, useState } from 'react'
import style from './index.module.css'

const logStyle = {
  ERROR: style.errorLog,
  LOG: style.defaultLog,
  SUCCESS: style.successLog
}
export default function SysLog ({ stdin, isConnected }) {
  const [log, setLog] = useState([])

  useEffect(() => {
    stdin && setLog((prev) => [...prev, ...stdin])
  }, [stdin])
  return (
    <div className={style.main}>
      <label style={{ color: isConnected ? 'green' : 'red' }}>
        Web socket {isConnected ? 'connected' : 'disconnected'}
      </label>
      <ul className={style.logList}>{log.map(composeLogItem)}</ul>
    </div>
  )
}
function composeLogItem (value, index) {
  return <li key={index}>{value}</li>
}
