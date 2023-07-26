import { logTypes } from '../dataFormats'

export default function cmd ({ command, parsed, setPrograms, log, emit }) {
  // lazy load new modules when a command is triggered
  // TODO: if needed we could use React.Suspense
  const programs = {
    help: () => import('./help').then(module => module.exec(log)),
    rtc: () => import('./rtc').then(module => module.exec({
      args: parsed,
      onMediaSources: (videoStreams) =>
        setPrograms((prev) =>
          [...prev, { view: <module.View {...videoStreams} />, name: module.Name }]),
      onClose: () => setPrograms((prev) =>
        prev.filter(({ name }) => name !== module.Name)
      ),
      onHelp: (help) => log(help.reduce((acc, { command, description }) => {
        return acc.concat(
          { value: command, type: logTypes.HELP_COMMAND },
          { value: description, type: logTypes.HELP_DESCRIPTION }
        )
      }, [])),
      log
    })),
    login: () => import('./login').then(module => module.exec({ log, emit, parsed })),
    default: () => log([{ value: 'not a command', type: logTypes.ERROR }])
  }

  // TODO: rtc should create the view here and send streams separatedly?
  const program = programs[command] || programs.default
  program()
}
