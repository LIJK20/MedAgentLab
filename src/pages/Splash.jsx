import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'

import NeuralBrain from '../scenes/NeuralBrain.jsx'

// Splash — independent dark-mode entry route ("/").
//
// Three layers, stacked back-to-front:
//   1) <Canvas> WebGL scene (NeuralBrain particles + Bloom postprocess)
//   2) Radial vignette overlay (pure CSS, no GPU cost) — pulls focus to center
//   3) HTML overlay (Title + Subtitle + glassmorphism CTA)
//
// Why fixed full-screen wrapper (not min-h-screen):
//   The global body background is paper-white. The wrapper paints true black
//   and isolates the splash from the editorial palette + grain overlay leaks.
//
// Bloom config rationale:
//   Keep glow cinematic but bounded. The particle shader already emits soft
//   discs, so Bloom should lift bright clusters instead of washing out the page.

const SCENE_BG = '#020617'

function Scene({ paused }) {
  return (
    <>
      <color attach="background" args={[SCENE_BG]} />
      <fog attach="fog" args={[SCENE_BG, 6, 14]} />

      <Suspense fallback={null}>
        <NeuralBrain paused={paused} />
      </Suspense>

      <EffectComposer multisampling={0} disableNormalPass>
        <Bloom
          intensity={0.75}
          luminanceThreshold={0.28}
          luminanceSmoothing={0.32}
          mipmapBlur
          radius={0.62}
        />
      </EffectComposer>
    </>
  )
}

// OverlayUI — DOM layer. Sits above the canvas; pointer-events isolated to
// the CTA only, so the canvas remains interactable for any future controls.
function OverlayUI() {
  const reduceMotion = useReducedMotion()

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: reduceMotion ? 0 : 0.18, delayChildren: 0.15 },
    },
  }
  const item = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center"
    >
      <motion.p
        variants={item}
        className="mb-6 font-mono text-[0.72rem] uppercase tracking-[0.42em] text-[#dffcff]"
        style={{
          textShadow:
            '0 1px 8px rgba(0, 0, 0, 0.85), 0 0 14px rgba(0, 242, 254, 0.35)',
        }}
      >
        <span className="inline-block h-1.5 w-1.5 -translate-y-[2px] rounded-full bg-[#00f2fe] shadow-[0_0_10px_rgba(0,242,254,0.9)] align-middle" />
        <span className="ml-3">Medical · Artificial Intelligence · Lab</span>
      </motion.p>

      <motion.h1
        variants={item}
        className="select-none font-sans font-extrabold leading-none tracking-[-0.04em] text-white"
        style={{
          fontSize: 'clamp(3.4rem, 10.5vw, 9rem)',
          textShadow:
            '0 2px 18px rgba(0, 0, 0, 0.72), 0 0 18px rgba(0, 242, 254, 0.22), 0 0 60px rgba(0, 242, 254, 0.12), 0 0 120px rgba(79, 172, 254, 0.10)',
        }}
      >
        MedAgentLab
      </motion.h1>

      <motion.p
        variants={item}
        className="mt-6 max-w-2xl text-base font-medium tracking-[0.18em] text-[#e8ffff] sm:text-lg"
        style={{
          textShadow:
            '0 1px 10px rgba(0, 0, 0, 0.9), 0 0 16px rgba(79, 172, 254, 0.42)',
        }}
      >
        医学人工智能实验室 · 让大模型在临床中安全落地
      </motion.p>

      <motion.div variants={item} className="mt-12 pointer-events-auto">
        <CtaButton />
      </motion.div>

      <motion.div
        variants={item}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 font-mono text-[0.65rem] uppercase tracking-[0.4em] text-[#bdf7ff]/80"
        style={{
          textShadow: '0 1px 8px rgba(0, 0, 0, 0.85)',
        }}
      >
        scroll · enter · explore
      </motion.div>
    </motion.div>
  )
}

// CtaButton — react-router <Link> wrapped in motion. Glassmorphism shell.
//
// Two-layer glow: outer drop-shadow on hover + inner radial via gradient bg
// that intensifies on hover. Border alpha steps 0.40 → 0.85 to sell focus.
function CtaButton() {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="group relative inline-block"
    >
      <Link
        to="/home"
        className="
          relative inline-flex items-center gap-3 rounded-full
          border border-[rgba(0,242,254,0.40)]
          bg-[rgba(0,242,254,0.08)]
          px-9 py-3.5
          text-sm font-medium uppercase tracking-[0.22em] text-white
          backdrop-blur-md
          transition-[background-color,border-color,box-shadow] duration-300 ease-out
          hover:border-[rgba(0,242,254,0.85)]
          hover:bg-[rgba(0,242,254,0.16)]
          hover:shadow-[0_0_28px_rgba(0,242,254,0.45),0_0_60px_rgba(79,172,254,0.20)]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f2fe] focus-visible:ring-offset-2 focus-visible:ring-offset-[#020617]
        "
      >
        <span>了解我们</span>
        <span
          aria-hidden
          className="inline-block translate-x-0 transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      </Link>
    </motion.div>
  )
}

export default function Splash() {
  // Pause cue: when window is hidden, freeze the brain frame loop. Saves
  // GPU when user tabs away on the splash. NeuralBrain consumes `paused`.
  const [paused, setPaused] = useState(
    () => typeof document !== 'undefined' && document.hidden
  )

  useEffect(() => {
    // Tag <body> so styles.css can override paper-grain + bg without
    // polluting the editorial routes. Cleaned on unmount → /home is safe.
    document.body.classList.add('splash-active')

    const onVisibility = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      document.body.classList.remove('splash-active')
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#020617] text-white">
      {/* WebGL layer */}
      <Canvas
        className="absolute inset-0 z-0"
        camera={{ position: [0, 0, 4.4], fov: 50, near: 0.1, far: 60 }}
        dpr={[1, 1.75]}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <Scene paused={paused} />
      </Canvas>

      {/* Vignette + chromatic spill — pure CSS, sits between canvas and DOM. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0) 38%, rgba(0,0,0,0.55) 78%, rgba(0,0,0,0.85) 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 mix-blend-screen opacity-40"
        style={{
          background:
            'radial-gradient(circle at 50% 55%, rgba(0,242,254,0.08), transparent 55%)',
        }}
      />

      {/* DOM overlay */}
      <OverlayUI />
    </div>
  )
}
