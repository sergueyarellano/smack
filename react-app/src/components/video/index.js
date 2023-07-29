import { useEffect, useRef } from 'react'

export default function Video ({ srcObject, ...props }) {
  const refVideo = useRef(null)

  useEffect(() => {
    const rVid = refVideo.current
    if (!refVideo.current) return
    refVideo.current.srcObject = srcObject
    return () => {
      rVid.srcObject = null
    }
  }, [srcObject])

  return <video ref={refVideo} {...props} />
}
