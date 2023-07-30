import { useState } from 'react'
import Window from '../window'
import style from './view.module.css'

export default function ProgramSelector ({ setPrograms }) {
  const [list, setList] = useState(
    [
      { name: 'RTC', disabled: false },
      { name: 'WS', disabled: false }
    ])
  return (
    <Window title='Program selector'>

      <div className={style.main}>
        {list.map((program, key) => {
          return (
            <button
              key={key}
              name={program.name}
              disabled={program.disabled}
              onClick={(e) => {
                const targetName = e.target.name
                setPrograms(prev => [...prev, { name: targetName }])
                setList((prev) => prev.map(item => item.name === targetName ? { ...item, disabled: !item.disabled } : item))
              }}
            >
              {program.name}
            </button>
          )
        })}
      </div>
    </Window>
  )
}
