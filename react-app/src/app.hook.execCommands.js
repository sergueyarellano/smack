import { useEffect } from 'react'
import { flushSync } from 'react-dom'
import { logTypes } from './dataFormats'
import { emitter } from './network/events'
import cmd from './programs'

export default function useExecCommands ({ command, setPrograms, logTty, clearTerminal }) {
  useEffect(() => {
    const [log, onLog] = getLog(logTty)
    command && cmd({ ...command, log, setPrograms, clearTerminal })
    return () => {
      emitter.off('log', onLog)
    }
  }, [command, logTty, setPrograms, clearTerminal])
}

function getLog (logTty) {
  const onLog = function (value) {
    if (typeof value === 'object') {
      // TODO: we force dom update because batching 2 hook calls is not working
      // and logs were lost. We think it's a thing of react 18
      flushSync(() => logTty(value))
    } else {
      flushSync(() => logTty({ value, type: logTypes.INFO }))
    }
  }
  emitter.on('log', onLog)

  return [emitter.emit.bind(emitter, 'log'), onLog]
}
