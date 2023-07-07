import moment from 'moment'
import style from './index.module.css'
import { useEffect, useState } from 'react'

export default function ChatView ({ ingressMessage }) {
  // TODO: diff wether it's us or them by creating a ref, use a check mark when message sent
  // TODO: our messages to the right, theirs to the left

  const [messages, setMessage] = useState([])
  useEffect(() => {
    ingressMessage && setMessage((prev) => [...prev, ingressMessage])
  }, [ingressMessage])
  return <ul className={style.main}>{messages?.map(composeChatItem)}</ul>
}

function composeChatItem (item, index) {
  return <ChatItem key={index} {...item} />
}

function ChatItem (props) {
  const { author, message, timestamp } = props
  const ts = moment(timestamp).format('YYYY-MM-DD HH:mm')
  return <li className={style.message}>{`${author} [${ts}]: ${message}`}</li>
}
