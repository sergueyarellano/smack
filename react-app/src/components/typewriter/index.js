'use client'
import styles from './index.module.css'
import { cmdParser } from './cli'

export default function Typewriter ({ dispatchCommand, dispatchMessage }) {
  return (
    <form className={styles.main} onSubmit={onSubmitWithProps({ dispatchCommand, dispatchMessage })}>
      <input
        type='text'
        className={styles.input}
      />
    </form>
  )
}

function onSubmitWithProps ({ dispatchCommand, dispatchMessage }) {
  return e => {
    e.preventDefault()

    const inputValue = e.target[0].value
    if (inputValue.startsWith('/')) {
      const parsed = cmdParser(inputValue)
      dispatchCommand({ command: inputValue, parsed })
    } else {
      dispatchMessage({ author: 'me', message: inputValue })
    }
    // clear the CLI
    e.target[0].value = ''
  }
}
