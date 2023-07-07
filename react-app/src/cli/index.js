import minimist from 'minimist'

const COMMAND_NAMES = {
  HELP: 'help',
  P2P: 'p2p'
}

const commands = new Map()
commands.set(COMMAND_NAMES.HELP, [{ command: '/help', description: 'this is help' }])

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
  list.push('Commands')
  for (const [cmd, usage] of commands) {
    for (const val of usage) {
      list.push(`  ${val.command}\t\t${val.description}`)
    }
  }
  return list
}
