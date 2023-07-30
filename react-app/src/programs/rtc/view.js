import Video from '../../components/video'
import style from './view.module.css'
import Window from '../../components/window'

export default function VideoConfView ({ localStream, remoteStreams = [] }) {
  return (
    <Window title='rtc call' row='1' column='4'>
      <div className={`${style.main} ${style.glassmorphism}`}>
        <Video className={style.vid} id='webcamVideo' autoPlay playsInline muted srcObject={localStream} />
        {remoteStreams.map((stream, key) => <Video className={style.vid} key={key} id='remoteVideo' autoPlay playsInline srcObject={stream} />)}
      </div>
    </Window>
  )
}
