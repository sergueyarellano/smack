import { useEffect, useState } from 'react'
import style from './connected.module.css'
import { initWebSocket } from './socket'
import ChatView from './pChat'

const ActiveUsers = ({ users, setChatView }) => {
  return (
    <ul className={style.ul}>
      {users.map((el, key) =>
        <button
          key={key}
          name={el.username}
          onClick={onUserSelect({ ...el, setChatView })}
          className={style.button}
        ><span className='material-symbols-outlined'>face</span>{el.username} {el.self && '(me)'}
        </button>
      )}
    </ul>
  )
}

function onUserSelect ({ userID, username, setChatView }) {
  return e => {
    setChatView({ userID, username })
  }
}

export default function ConnectedUsers ({ me }) {
  const [users, setUsers] = useState([])
  const [pChatWith, setChatView] = useState()
  const [messages, setMessage] = useState({})
  const [egressMessage, sendMessage] = useState()
  const [socket, setSocket] = useState()

  useEffect(() => {
    const socket = initWebSocket({ log: console.log, logE: console.error, setUsers })
    socket.auth = { username: me }
    socket.connect()
    setSocket(socket)
  }, [])

  useEffect(() => {
    if (socket) {
      console.log('TCL: ConnectedUsers -> egressMessage', egressMessage)
      socket.emit('private message', {
        content: egressMessage.content,
        to: egressMessage.userID
      })
      setMessage(prev => {
        const newState = {}

        if (!prev[egressMessage.userID]) {
          newState[egressMessage.userID] = [{ content: egressMessage.content, fromSelf: true }]
        } else {
          newState[egressMessage.userID] = [...prev[egressMessage.userID], { content: egressMessage.content, fromSelf: true }]
        }

        return newState
      })
    }
  }, [egressMessage])
  return pChatWith
    ? <ChatView pChatWith={pChatWith} messages={messages !== null ? messages[pChatWith.userID] : []} sendMessage={sendMessage} />
    : <ActiveUsers users={users} setChatView={setChatView} />
}
