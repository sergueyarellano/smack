import styles from './page.module.css'
import ProgramSelector from './components/selector'
import { Suspense, lazy, useState } from 'react'
import { VideoCallContext } from './VideoCallContext'
import VideoConfView from './components/rtc'

const availablePrograms = {
  RTC: lazy(() => import('./components/rtc')),
  WS: lazy(() => import('./components/ws'))
}

export default function Smack () {
  const [videoCall, setVideocall] = useState(null)
  const [programs, setPrograms] = useState([])
  const [socket, setSocket] = useState(null)

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
      <VideoCallContext.Provider value={{ setVideocall, videoCall, socket, setSocket }}>
        <ProgramSelector setPrograms={setPrograms} />
        {activePrograms}
        {videoCall && <VideoConfView />}
      </VideoCallContext.Provider>
    </main>
  )
}
