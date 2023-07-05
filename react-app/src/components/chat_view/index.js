import moment from 'moment'
import style from './index.module.css'

export default function ChatView ({ messages }) {
  const composeChatItem = (item, index) => <ChatItem key={index} {...item} />
  return <ul className={style.main}>{messages.map(composeChatItem)}</ul>
}
function ChatItem (props) {
  const { author, message, timestamp } = props
  const ts = moment(timestamp).format('YYYY-MM-DD HH:mm')
  return <li className={style.message}>{`${author} [${ts}]: ${message}`}</li>
}
