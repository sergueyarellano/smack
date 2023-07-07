export const fmtMessage = (msg) => ({
  author: msg.author,
  message: msg.message,
  timestamp: msg.timestamp || Date.now()
})
