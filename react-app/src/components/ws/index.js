import { useState } from 'react'
import Window from '../window'
import InputName from './name.js'
import ConnectedUsers from './connected'

export default function WSView () {
  const [me, setMe] = useState(null)

  return (
    <Window title='' row='2' column='2'>
      {me === null
        ? <InputName setMe={setMe} />
        : <ConnectedUsers me={me} />}
    </Window>
  )
}
