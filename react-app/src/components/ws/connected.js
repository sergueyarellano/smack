import { useEffect, useState } from 'react'
import style from './connected.module.css'
import { initWebSocket } from './socket'
import PChat from './pChat'

export default function ConnectedUsers ({ me }) {
  const [users, setUsers] = useState([])
  /**
   * users: [{userID, username, self}]
   */

  const [pChat, setPChat] = useState()
  const [egressMessage, sendMessage] = useState()
  const [socket, setSocket] = useState()

  useEffect(() => {
    // register our username in the current socket and connect
    const socket = initWebSocket({ log: console.log, logE: console.error, setUsers, users })
    socket.auth = { username: me }
    socket.connect()
    setSocket(socket)
    return () => socket.offAny()
  }, [])

  useEffect(() => {
    if (socket) {
      socket.emit('private message', {
        content: egressMessage.content,
        to: egressMessage.userID
      })
      // save message locally
      setUsers(prev => {
        /**
         * prev: [{userID, messages, username}]
         */
        return prev.map(user => {
          if (user.userID === egressMessage.userID) {
            const newMessages = user.messages || []
            return { ...user, messages: [...newMessages, { content: egressMessage.content, fromSelf: true }] }
          }
          return user
        })
      })
    }
  }, [egressMessage])
  return pChat
    ? <PChat
        withUser={pChat}
        messages={users.find(user => user.userID === pChat.userID).messages}
        sendMessage={sendMessage}
        goBack={() => setPChat()}
      />
    : <ActiveUsers users={users} setPChat={setPChat} />
}

const ActiveUsers = ({ users, setPChat }) => {
  return (
    <ul className={style.ul}>
      {users.map((user, key) =>
        <button
          key={key}
          name={user.username}
          onClick={() => setPChat(user)}
          className={style.button}
        ><span className='material-symbols-outlined'>face</span>{user.username} {user.self && '(me)'}
        </button>
      )}
    </ul>
  )
}
