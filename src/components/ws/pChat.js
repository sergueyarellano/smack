import Output from './pChat.output'
import Input from './pChat.input'
import style from './pChat.module.css'
import { useContext, useEffect, useState } from 'react'
import { VideoCallContext } from '../../VideoCallContext'

export default function PChat ({ withUser, sendMessage, messages, goBack, me }) {
  const { setVideocall, socket } = useContext(VideoCallContext)
  const [activeVideoCall, setActiveVideoCall] = useState(false)

  useEffect(() => {
    const onVideoCall = (call) => {
      if (!call.initiator) {
        setActiveVideoCall(false) // pulse icon
        setVideocall({ initiator: true, withUser: withUser.userID })
      } else {
        setActiveVideoCall(true) // pulse icon
      }
      // TODO: 2
    }
    socket.on('video call', onVideoCall)
    return () => {
      console.log('socket off')
      socket.off('video call', onVideoCall)
    }
  }, [])
  return (
    <div className={style.main}>
      <Output messages={messages} />
      <Input
        sendMessage={sendMessage}
        userID={withUser.userID}
      />
      <label className={style.username}>{withUser.username}</label>
      <label
        className={`${style.videocam} material-symbols-outlined ${activeVideoCall ? style.pulse : ''}`}
        onClick={() => {
          if (!activeVideoCall) {
            // TODO: 1
            // if we initiate the call
            socket.emit('video call', { to: withUser.userID, initiator: true })
            setActiveVideoCall(true)
          } else {
            // TODO: 3
            // accept incoming call
            setVideocall({ initiator: false, withUser: withUser.userID })
            socket.emit('video call', { to: withUser.userID, initiator: false })
            setActiveVideoCall(false)
          }
        }}
      >Videocam
      </label>
      <label onClick={goBack} className={`${style.userList} material-symbols-outlined`}>sort_by_alpha</label>
    </div>
  )
}
