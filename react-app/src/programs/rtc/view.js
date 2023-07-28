import { useEffect, useRef } from 'react'
import style from './view.module.css'
import Window from '../../components/window'

export default function VideoConfView ({ localStream, remoteStream }) {
  const refLocal = useRef(null)
  const refRemote = useRef(null)
  useEffect(() => {
    if (refLocal?.current) {
      refLocal.current.srcObject = localStream
    }
  }, [localStream])
  useEffect(() => {
    if (refLocal?.current) {
      refRemote.current.srcObject = remoteStream
    }
  }, [remoteStream])
  return (

    <Window title='rtc call' position='topLeft'>
      <div className={style.main}>
        <video className={style.vid} id='webcamVideo' autoPlay playsInline muted ref={refLocal} />
        <video className={style.vid} id='remoteVideo' autoPlay playsInline ref={refRemote} />
      </div>
    </Window>
  )
}
