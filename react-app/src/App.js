import styles from './page.module.css'
import ProgramSelector from './components/selector'
import { Suspense, lazy, useState } from 'react'

const availablePrograms = {
  RTC: lazy(() => import('./components/rtc')),
  WS: lazy(() => import('./components/ws'))
}

export default function Smack () {
  const [programs, setPrograms] = useState([])
  const activePrograms = programs.map((program, key) => {
    const Prog = availablePrograms[program.name]
    return (
      <Suspense key={key} fallback={<div>Loading...</div>}>
        <Prog />
      </Suspense>
    )
  })
  return (
    <main className={styles.main}>
      <ProgramSelector setPrograms={setPrograms} />
      {activePrograms}
    </main>
  )
}
