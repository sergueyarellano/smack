import { io } from 'socket.io-client'

function initWebSocket ({ log, logE, setUsers, users }) {
  const socket = io('http://localhost:6503', { autoConnect: false })
  // socket = io('https://staging.ackws.net/')

  // Get a new Id for the client if needed
  // const myId = window.localStorage.getItem('socketSessionID')
  // const isExpiredId = !myId || checkExpiration(myId)
  // isExpiredId && socket.emit('requestId')

  socket.on('connect', () => {
    setUsers(prev => prev.map(user => {
      if (user.self) {
        user.connected = true
      }
      return user
    }))
  })

  socket.on('disconnect', () => {
    setUsers(prev => prev.map(user => {
      if (user.self) {
        user.connected = false
      }
      return user
    }))
  })
  // upon connection we receive all users and add it to the pool
  socket.on('connect_error', (err) => logE('invalid username', err))
  socket.on('users', (users) => {
    // identify current user
    users.forEach((user) => { user.self = user.userID === socket.id })

    // put the current user first, and then sort by username
    /**
     * connectedUsers: [{userID, username, self}]
     */
    const connectedUsers = users.sort((a, b) => {
      if (a.self) return -1
      if (b.self) return 1
      if (a.username < b.username) return -1
      return a.username > b.username ? 1 : 0
    })
    setUsers(connectedUsers)
  })
  // when a new user connects, we add it to existing pool of users
  socket.on('user connected', (user) => { setUsers(prev => [...prev, user]) })
  socket.on('private message', ({ content, from }) => {
    setUsers(prev => {
      return prev.map(user => {
        if (user.userID === from) {
          // add new incomming
          const messages = user.messages || []
          return { ...user, messages: messages.concat({ content, fromSelf: false }) }
        }
        return user
      })
    })
  })
  socket.on('disconnect', () => {})
  socket.on('message', () => {})
  socket.on('id', (myId) => {
    // we requested an Id and we set it locally
    const aDayInMs = 86400000
    window.localStorage.setItem('socketSessionID', JSON.stringify({ id: myId, expires: Date.now() + aDayInMs }))
  })
  socket.onAny((event, ...args) => {
    console.log('any', event, args)
  })
  return socket
}

function cleanSocketEvents (socket) {
  socket.off('connect', () => {})
  socket.off('chat-message', () => {})
}

function checkExpiration (id) {
  return JSON.parse(id).expires < Date.now()
}
export { initWebSocket, cleanSocketEvents }
