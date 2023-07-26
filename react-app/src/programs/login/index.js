import { logTypes } from '../../dataFormats'

export function exec ({ log, emit, parsed }) {
  log({ value: 'this is login', type: logTypes.INFO })
  emit({
    name: parsed._[0],
    date: Date.now(),
    id: 0,
    type: 'username'
  })
}
