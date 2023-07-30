import styles from './pChat.input.module.css'
import { useEffect, useRef, useState } from 'react'

// TODO: cool feature would be to remember history and reselect messages and commands
export default function Input ({ sendMessage, pChatWith }) {
  const [history, setHistory] = useState([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  // get input reference to focus on input because react re-renders many times
  // so cannot use autofocus HTML property
  const ref = useRef(null)

  // everyTime we search up or down in history, the text gets selected
  useEffect(() => {
    // TODO: If I don't wait till the next tick, it does not select the text
    setTimeout(() => { ref.current.select() }, 0)
  }, [currentIndex])

  return (
    <form
      className={styles.main}
      onSubmit={onSubmitWithProps({ sendMessage, setCurrentIndex, setHistory, pChatWith })}
    >
      <label className={styles.prompt}>{'>'}</label>
      <input
        type='text'
        className={styles.input}
        ref={ref}
        onKeyDown={onKeyDown({ history, currentIndex, setCurrentIndex })}
      />
    </form>
  )
}

function onSubmitWithProps ({ sendMessage, setCurrentIndex, setHistory, pChatWith }) {
  return e => {
    e.preventDefault()

    const inputValue = e.target[0].value
    if (e.target[0].value.length > 0) {
      sendMessage({ content: inputValue, userID: pChatWith.userID })
    }
    // clear the CLI
    e.target[0].value = ''
    // reset history search
    setCurrentIndex(-1)
    // add the value to history
    !!inputValue && setHistory((prev) => [...prev, inputValue])
  }
}
function onKeyDown ({ history, currentIndex, setCurrentIndex }) {
  return (e) => {
    const lastElementIndex = history.length - 1
    if (e.code === 'ArrowUp') {
      if (currentIndex < 0 && history.length > 0) {
        // the first time we search, the computed index will be the last in the list
        e.target.value = history[lastElementIndex]
        setCurrentIndex(lastElementIndex)
      } else if (currentIndex - 1 >= 0) {
        // next computed index has to be between array indexed elements or we would get undefined
        e.target.value = history[currentIndex - 1]
        setCurrentIndex(currentIndex - 1)
      }
    }
    if (e.code === 'ArrowDown' && currentIndex >= 0) {
      // next computed index has to be between array indexed elements or we would get undefined
      if (currentIndex + 1 <= lastElementIndex) {
        e.target.value = history[currentIndex + 1]
        setCurrentIndex(currentIndex + 1)
      }
    }
  }
}
