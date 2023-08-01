import { Fragment, useEffect, useRef } from 'react'
import style from './pChat.output.module.css'

export default function Output ({ messages = [] }) {
  console.log('TCL: messages', messages)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Scroll to bottom
    setTimeout(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, 0)
  }, [messages])

  return (
    <div className={style.logList}>
      {messages.map((message, key) =>
        <Fragment key={key}>
          {message.fromSelf
            ? <pre className={style.fromSelf}>{message.content}</pre>
            : <pre className={style.fromNotSelf}>{message.content}</pre>}
        </Fragment>
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}
