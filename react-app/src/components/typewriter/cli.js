import minimist from 'minimist'

export function cmdParser (val) {
  const withoutSlash = val.substring(1)

  // minimist expects an array
  return minimist(withoutSlash.split(/\s/))
}
