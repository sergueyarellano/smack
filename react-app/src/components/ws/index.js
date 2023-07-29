import Window from '../window'
import style from './view.module.css'

export default function WSView ({ users }) {
  return (
    <Window title='rtc call' position='bottomRight'>

      <div className={style.main}>
        this is WS view
      </div>
    </Window>
  )
}
