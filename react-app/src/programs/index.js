import { logTypes } from '../dataFormats'

export default function cmd ({ command, parsed, setPrograms, log, clearTerminal }) {
  const programs = {
    help: () => import('./help').then(module => module.exec(log)),
    clear: () => clearTerminal(),
    rtc: () => import('./rtc').then(onModuleLoaded({ args: parsed, log, setPrograms, path: 'rtc' })),
    ws: () => import('./ws').then(onModuleLoaded({ args: parsed, log, setPrograms })),
    default: () => log([{ value: 'not a command', type: logTypes.ERROR }])
  }

  const program = programs[command] || programs.default
  program()
}

function onModuleLoaded ({ args, log, setPrograms }) {
  return module => module.exec({
    args,
    onHelp: onHelp(log),
    onView: (props) =>
      // TODO: separate views from programs
      setPrograms({ name: module.Name, type: 'add', props, View: module.View }),
    onStream: (props) =>
      setPrograms({ name: module.Name, type: 'update_props', props }),
    onClose: () => setPrograms({ name: module.Name, type: 'delete' }),
    log,
    logE: (msg) => log({ value: msg, type: logTypes.ERROR })

  })
}

function onHelp (log) {
  return (help) => log([help.reduce((acc, { command, description }) => {
    return acc.concat(
      { value: command, type: logTypes.HELP_COMMAND },
      { value: description, type: logTypes.HELP_DESCRIPTION }
    )
  }, [])])
}
