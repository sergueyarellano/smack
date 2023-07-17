import { logTypes } from '../dataFormats'

export default function cmd ({ command, parsed, raw, setPrograms, logTty }) {
  // lazy load new modules when a command is triggered
  // TODO: if needed we could use React.Suspense
  const programs = {
    help: () => import('./help').then(module => module.exec(logTty)),
    rtc: () => import('./rtc').then(module => module.exec({ parsed, setPrograms, logTty })),
    default: () => logTty([{ value: 'not a command', type: logTypes.ERROR }])
  }
  const program = programs[command] || programs.default
  program()
}
