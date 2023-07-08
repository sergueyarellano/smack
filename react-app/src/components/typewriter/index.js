import styles from './index.module.css'
import { cmdParser } from '../../cli'
import { useEffect, useRef } from 'react'

// TODO: cool feature would be to remember history and reselect messages and commands
export default function Typewriter ({ dispatchCommand, dispatchMessage }) {
  // get input reference to focus on input because react re-renders many times
  // so cannot use autofocus HTML property
  const ref = useRef(null)
  useEffect(() => {
    ref.current.focus()
  }, [])
  return (
    <form className={styles.main} onSubmit={onSubmitWithProps({ dispatchCommand, dispatchMessage })}>
      <input
        type='text'
        className={styles.input}
        ref={ref}
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
      // TODO: shift is a side effect
      dispatchCommand({ command: parsed._.shift(), parsed })
    } else {
      // TODO: I don't think TY should know the author
      dispatchMessage({ author: 'me', message: inputValue })
    }
    // clear the CLI
    e.target[0].value = ''
  }
}
