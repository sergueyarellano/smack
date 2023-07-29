import Video from '../video'
import style from './view.module.css'
import Window from '../window'

export default function VideoConfView ({ localStream, remoteStreams = [] }) {
  return (
    <Window title='rtc call' position='topLeft'>
      <div className={style.main}>
        <Video className={style.vid} id='webcamVideo' autoPlay playsInline muted srcObject={localStream} />
        {remoteStreams.map((stream, key) => <Video className={style.vid} key={key} id='remoteVideo' autoPlay playsInline srcObject={stream} />)}
      </div>
    </Window>
  )
}
