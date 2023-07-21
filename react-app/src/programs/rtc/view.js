import { useEffect, useRef } from 'react'
import style from './view.module.css'
import Draggable from 'react-draggable'

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
      <Draggable>
        <video className={style.vid} id='webcamVideo' autoPlay playsInline muted ref={refLocal} />
      </Draggable>
      <Draggable>
        <video className={style.vid} id='remoteVideo' autoPlay playsInline ref={refRemote} />
      </Draggable>
    </div>
  )
}
