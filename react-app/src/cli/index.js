import minimist from 'minimist'

const COMMAND_NAMES = {
  HELP: 'help'
}

const commands = new Map()
commands.set(COMMAND_NAMES.HELP, { description: 'this is help', usage: '/help' })

const commandList = getCommandList(commands)

export function cmdParser (val) {
  const withoutSlash = val.substring(1)

  // minimist expects an array
  return minimist(withoutSlash.split(/\s/))
}

export function cmd ({ command, parsed }, dispatchSyslogStdin) {
  // consider using yargs
  switch (command) {
    case COMMAND_NAMES.HELP: {
      dispatchSyslogStdin(commandList)
      break
    }
    default:
      dispatchSyslogStdin([`${command} is not a command`])
      break
  }
}

function getCommandList (commands) {
  const list = []
  for (const [cmd, value] of commands) {
    list.push('Commands')
    list.push(`  ${value.usage} description: ${value.description}`)
    // list.push(`description: ${value.description}`)
  }
  return list
}
