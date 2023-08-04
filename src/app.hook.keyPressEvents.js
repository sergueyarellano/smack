import { useEffect } from 'react'

export default function useKeyPressEvents ({ toggleTerminalVisibility }) {
  useEffect(() => {
    const onKeyDown = (e) => {
      e.code === 'KeyK' && e.metaKey && toggleTerminalVisibility()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [toggleTerminalVisibility])
}
