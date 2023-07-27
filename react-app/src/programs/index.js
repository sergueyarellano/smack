import { logTypes } from '../dataFormats'

export default function cmd ({ command, parsed, setPrograms, log, clearTerminal }) {
  // lazy load new modules when a command is triggered
  // TODO: if needed we could use React.Suspense
  const programs = {
    help: () => import('./help').then(module => module.exec(log)),
    clear: () => clearTerminal(),
    rtc: () => import('./rtc').then(module => module.exec({
      args: parsed,
      onHelp: onHelp(log),
      onView: (props) =>
        setPrograms({ view: <module.View {...props} />, name: module.Name, type: 'add' }),
      onClose: () => setPrograms({ name: module.Name, type: 'delete' }),
      log
    })),
    ws: () => import('./ws').then(module => module.exec({
      // TODO: one can see a pattern here
      args: parsed,
      onHelp: onHelp(log),
      onView: (props) =>
        setPrograms({ view: <module.View {...props} />, name: module.Name, type: 'add' }),
      // TODO: onClose should terminate sockets, connections, listeners, etc
      onClose: () => setPrograms({ name: module.Name, type: 'delete' }),
      log,
      logE: (msg) => {
        log({ value: msg, type: logTypes.ERROR })
      }
    })),
    default: () => log([{ value: 'not a command', type: logTypes.ERROR }])
  }

  // TODO: rtc should create the view here and send streams separatedly?
  const program = programs[command] || programs.default
  program()
}

function onHelp (log) {
  return (help) => log([help.reduce((acc, { command, description }) => {
    return acc.concat(
      { value: command, type: logTypes.HELP_COMMAND },
      { value: description, type: logTypes.HELP_DESCRIPTION }
    )
  }, [])])
}
