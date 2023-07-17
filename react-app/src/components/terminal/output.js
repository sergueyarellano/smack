import { useEffect, useRef, useState } from 'react'
import style from './output.module.css'

export default function Output ({ stdout, rawCommand }) {
  const [log, setLog] = useState([])
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const newStdout = Array.isArray(stdout) ? stdout : [stdout]
    // store the incoming log and scroll to the bottom
    stdout && setLog((prev) => [...prev, ...newStdout])
    rawCommand && setLog((prev) => [...prev, rawCommand])

    // Scroll to bottom
    setTimeout(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, 0)
  }, [stdout, rawCommand])
  return (
    <div className={style.logList}>
      {log.map(composeLogItem)}
      <div ref={messagesEndRef} />
    </div>
  )
}
function composeLogItem (row, index) {
  // logs can come like [ {value, type}, [{value,type}, {value, type}] ]
  let item
  // if it's an array we will create columns
  if (Array.isArray(row)) {
    item = (
      <div key={index} className={style.columns}>
        {row.map(({ value, type }, i) => <pre key={index + i} className={style[type]}>{value}</pre>)}
      </div>
    )
  } else {
    // Otherwise it's just a single item
    item = <pre className={style[row.type]} key={index}>{row.value}</pre>
  }
  return item
}
