import { io } from 'socket.io-client'

let socket, onChatMessage, onSocketConnection

function initWebSocket ({ dispatchMessage, dispatchEventConnected }) {
  // socket = io('https://staging.ackws.net/')
  socket = io('http://localhost:6503')
  onChatMessage = dispatchMessage
  onSocketConnection = dispatchEventConnected
  const isConnected = true
  socket.on('connect', onSocketConnection.bind(null, isConnected))
  socket.on('disconnect', onSocketConnection.bind(null, !isConnected))
  socket.on('chat-message', onChatMessage)
  socket.on('id', (msg) => { console.log('my id', msg) })
}

function cleanSocketEvents () {
  socket.off('connect', onSocketConnection)
  socket.off('chat-message', onChatMessage)
}

function emit (msg) {
  socket.emit(msg.type, msg)
}

export { initWebSocket, cleanSocketEvents, emit }
