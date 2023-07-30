import { io } from 'socket.io-client'

let connectedUsers

function initWebSocket ({ log, logE, setUsers }) {
  const socket = io('http://localhost:6503', { autoConnect: false })

  // Get a new Id for the client if needed
  const myId = window.localStorage.getItem('socketSessionID')
  const isExpiredId = !myId || checkExpiration(myId)
  isExpiredId && socket.emit('requestId')

  // socket = io('https://staging.ackws.net/')
  socket.on('connect', () => { log(`connected as ${socket.auth.username}`) })
  socket.on('users', (users) => {
    // identify current user
    users.forEach((user) => { user.self = user.userID === socket.id })

    // put the current user first, and then sort by username
    connectedUsers = users.sort((a, b) => {
      if (a.self) return -1
      if (b.self) return 1
      if (a.username < b.username) return -1
      return a.username > b.username ? 1 : 0
    })
    setUsers(connectedUsers)
    log(`users connected:\n${connectedUsers.map(({ username }) => username).join()}`)
  })
  socket.on('user connected', (user) => {
    connectedUsers.push(user)
    log(`user ${user.username} is here too`)
  })
  socket.on('connect_error', (err) => logE('invalid username', err))
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
