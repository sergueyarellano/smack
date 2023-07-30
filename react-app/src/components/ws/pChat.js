import Output from './pChat.output'
import Input from './pChat.input'
import style from './pChat.module.css'

export default function PrivateChatView ({ pChatWith, sendMessage, messages }) {
  return (
    <div className={style.main}>
      <Output messages={messages} pChatWith={pChatWith} />
      <label className={style.label}>{pChatWith.username + ' <'}</label>
      <Input sendMessage={sendMessage} pChatWith={pChatWith} />
    </div>
  )
}
