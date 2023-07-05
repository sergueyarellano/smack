import { io } from 'socket.io-client'

export { initializeSocket }

function initializeSocket ({ setMessages, setSocket }) {
  return () => {
    const socket = io('http://localhost:3001')
    socket.on('connect', onSocketConnection)
    socket.on('chat-message', onMessageReceived(setMessages))
    setSocket(socket)
    if (socket) return () => socket.disconnect()
  }
}
function onMessageReceived (setMessages) {
  return msg => {
    const message = {
      author: msg.author,
      message: msg.message,
      timestamp: msg.timestamp
    }
    setMessages(curr => [...curr, message])
  }
}
function onSocketConnection () {
  console.log('connected to socket')
}
