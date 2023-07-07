import { io } from 'socket.io-client'

let socket, onChatMessage, onSocketConnection

function initWebSocket ({ dispatchMessage, dispatchEventConnected }) {
  socket = io('http://localhost:3001')
  onChatMessage = dispatchMessage
  onSocketConnection = dispatchEventConnected
  socket.on('connect', onSocketConnection)
  socket.on('chat-message', onChatMessage)
}

function cleanSocketEvents () {
  socket.off('connect', onSocketConnection)
  socket.off('chat-message', onChatMessage)
}

function emit (message) {
  socket.emit('chat-message', message)
}

export { initWebSocket, cleanSocketEvents, emit }
