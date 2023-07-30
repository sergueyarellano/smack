import Window from '../../components/window'
import style from './view.module.css'

export default function WSView ({ users }) {
  return (
    <Window title='ws'>

      <div className={style.main}>
        this is WS view
      </div>
    </Window>
  )
}
