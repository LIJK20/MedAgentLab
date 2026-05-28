import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'

import Splash from './pages/Splash.jsx'
import Home from './pages/Home.jsx'
import TrackDetail from './pages/TrackDetail.jsx'

// App — top-level router. Two routes only:
//   /        → Splash (3D entry)
//   /home    → Home   (original editorial site)
// Anything else funnels back to the splash so deep links don't 404.
export default function App() {
  return (
    <>
      <HashScroller />
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/tracks/:slug" element={<TrackDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

function HashScroller() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) return

    const id = decodeURIComponent(hash.slice(1))
    const frame = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ block: 'start' })
    })

    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])

  return null
}
