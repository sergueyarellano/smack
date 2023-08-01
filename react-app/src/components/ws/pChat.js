import Output from './pChat.output'
import Input from './pChat.input'
import style from './pChat.module.css'

export default function PChat ({ withUser, sendMessage, messages, goBack }) {
  return (
    <div className={style.main}>
      <Output messages={messages} />
      <Input sendMessage={sendMessage} userID={withUser.userID} />
      <label className={style.username}>{withUser.username}</label>
      <label className={`${style.videocam} material-symbols-outlined`}>Videocam</label>
      <label onClick={goBack} className={`${style.userList} material-symbols-outlined`}>sort_by_alpha</label>
    </div>
  )
}
