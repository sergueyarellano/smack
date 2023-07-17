export const fmtMessage = (msg) => ({
  author: msg.author,
  message: msg.message,
  timestamp: msg.timestamp || Date.now()
})

export const logTypes = {
  HELP_COMMAND: 'helpCommandLog',
  HELP_DESCRIPTION: 'helpDescriptionLog',
  COMMAND: 'commandLog',
  INFO: 'infoLog',
  ERROR: 'errorLog'
}
