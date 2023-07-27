import { useEffect } from 'react'
import { cleanSocketEvents, initWebSocket } from './network/socket'

export default function useInitSocket ({ receiveMessage, dispatchEventConnected }) {
  useEffect(() => {
    // TODO: websockets should be used for RTC signaling and to see who is connected
    // RTC data channels can be used for chat
    initWebSocket({ dispatchMessage: receiveMessage, dispatchEventConnected })
    return () => cleanSocketEvents()
  }, [receiveMessage, dispatchEventConnected])
}
