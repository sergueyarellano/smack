import { useEffect } from 'react'
import { flushSync } from 'react-dom'
import { logTypes } from './dataFormats'
import { emit } from './network/socket'
import { emitter } from './network/events'
import cmd from './programs'

export default function useExecCommands ({ command, setPrograms, logTty, clearTerminal }) {
  useEffect(() => {
    const onLog = function (value) {
      if (typeof value === 'object') {
        // TODO: we force dom update because batching 2 hook calls is not working
        // and logs were lost. We think it's a thing of react 18
        flushSync(() => logTty(value))
      } else {
        flushSync(logTty({ value, type: logTypes.INFO }))
      }
    }
    // we use a listener for log events, so we can force update the DOM each time
    emitter.on('log', onLog)
    /**
     * cmd accepts:
     * log: function, in react we need an emitter for logs since a dispatcher would not render several times
     */
    command && cmd({
      ...command,
      log: emitter.emit.bind(emitter, 'log'),
      setPrograms,
      emit,
      clearTerminal
    })
    return () => {
      emitter.off('log', onLog)
    }
  }, [command, logTty, setPrograms, clearTerminal])
}
