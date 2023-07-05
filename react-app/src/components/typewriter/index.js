'use client'
import { useState } from 'react'
import styles from './index.module.css'
import { cmdParser } from './cli'

export default function Typewriter (props) {
  const { log, socket } = props
  const [command, setCommand] = useState('')
  const [username, setUsername] = useState(null)
  const onChange = onChangeInput({ setCommand })
  const onSubmit = onSubmitCommand({
    socket,
    command,
    setCommand,
    username,
    setUsername,
    log
  })
  return (
    <form className={styles.main} onSubmit={onSubmit}>
      <input
        type='text'
        placeholder='Input command'
        value={command}
        onChange={onChange}
        className={styles.input}
      />
    </form>
  )
}
function composeChatMessage (input, author) {
  const timestamp = new Date()
  const message = input.join(' ').replace('smack', '')
  return { author, message, timestamp }
}
function isEmptyCommand (command) {
  const keys = Object.keys(command)
  const totalKeys = keys.length
  const totalArgs = command._.length
  return totalKeys === 1 && totalArgs === 1
}
function onChangeInput ({ setCommand }) {
  return e => {
    e.preventDefault()
    setCommand(e.target.value)
  }
}
function onSubmitCommand (props) {
  return e => {
    e.preventDefault()
    const { log, command, username, setUsername, setCommand, socket } = props
    log({ type: 'LOG', message: command })
    const parsedCmd = cmdParser(command)
    setCommand('')
    if (isEmptyCommand(parsedCmd)) return
    if (username === null && parsedCmd?.u !== undefined) {
      setUsername(parsedCmd.u)
      log({ type: 'SUCCESS', message: `Username set to '${parsedCmd.u}'` })
      socket.emit('chat-message', {
        author: 'BOT',
        message: `${parsedCmd.u} has joined the chat.`,
        timestamp: new Date()
      })
      return
    }
    const chatMessage = composeChatMessage(parsedCmd._, username)
    if (username === null && chatMessage !== null) {
      const message = 'Select username using /smack -u command.'
      log({ type: 'ERROR', message })
      return
    }
    chatMessage !== null && socket.emit('chat-message', chatMessage)
  }
}
