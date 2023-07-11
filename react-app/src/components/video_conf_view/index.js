import { useEffect, useRef } from 'react'
import style from './index.module.css'

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
    <div className={style.main}>
      <video className={style.vid} id='webcamVideo' autoPlay playsInline muted ref={refLocal} />
      <video className={style.vid} id='remoteVideo' autoPlay playsInline ref={refRemote} />
    </div>
  )
}
