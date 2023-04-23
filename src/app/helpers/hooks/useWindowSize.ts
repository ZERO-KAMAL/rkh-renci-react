import { useEffect, useState } from 'react'

// Tailwind css responsive device breakpoints
export const Breakpoint = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
}

interface props {
  width: undefined | number
  height: undefined | number
}

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<props>({
    width: undefined,
    height: undefined,
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}
