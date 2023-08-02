import Video from '../video'
import style from './view.module.css'
import Window from '../window'
import { useContext, useEffect, useState } from 'react'
import { initConfigRTC, sendAnswer, sendOffer, setUpMediaSources } from './api'
import { VideoCallContext } from '../../VideoCallContext'

export default function VideoConfView () {
  const { videoCall, socket } = useContext(VideoCallContext)
  const [streams, setStream] = useState([])
  useEffect(() => {
    initConfigRTC()
      .then(({ pc, firestore }) =>
        setUpMediaSources({ pc, setStream })
          .then(() => videoCall.initiator
            ? sendOffer({ pc, socket, to: videoCall.withUser })
            : sendAnswer({ pc, socket, to: videoCall.withUser }))
      )
  }, [])
  return (
    <Window title='rtc call' row='1' column='4'>
      <div className={`${style.main} ${style.glassmorphism}`}>
        {streams.map(({ src, self }, key) => {
          if (self) {
            return <Video className={style.vid} key={key} id='webcamVideo' autoPlay playsInline muted srcObject={src} />
          }
          return <Video className={style.vid} key={key} id='remoteVideo' autoPlay playsInline srcObject={src} />
        })}
      </div>
    </Window>
  )
}
