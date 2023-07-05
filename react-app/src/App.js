'use client'

import { useEffect, useState } from 'react'
import ChatView from './components/chat_view'
import SysLog from './components/sys_log'
import Typewriter from './components/typewriter'

import styles from './page.module.css'
import { initializeSocket } from './socket'

export default function Smack () {
  const [socket, setSocket] = useState(null)
  const [messages, setMessages] = useState([])
  const [logs, setLogs] = useState([])
  const updateLog = item => setLogs(curr => [...curr, item])
  useEffect(initializeSocket({ setMessages, setSocket }), [])
  return (
    <main className={styles.main}>
      <div className={styles.horizontal}>
        <SysLog logs={logs} />
        <ChatView messages={messages} />
      </div>
      <Typewriter log={updateLog} socket={socket} />
    </main>
  )
}
