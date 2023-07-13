import { useEffect, useRef, useState } from 'react'
import style from './index.module.css'

// const logStyle = {
//   ERROR: style.errorLog,
//   LOG: style.defaultLog,
//   SUCCESS: style.successLog
// }
export default function SysLog ({ stdin }) {
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
    <div className={style.logList}>
      {log.map(composeLogItem)}
      <div ref={messagesEndRef} />
    </div>
  )
}
function composeLogItem (row, index) {
  let item
  if (Array.isArray(row)) {
    item = (
      <div key={index} className={style.columns}>
        <pre className={style[row[0].type]}>{row[0].value}</pre>
        <pre className={style[row[1].type]}>{row[1].value}</pre>
      </div>
    )
  } else {
    item = <pre className={style[row.type]} key={index}>{row.value}</pre>
  }
  return item
}
