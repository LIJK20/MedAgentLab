import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Neural particle field — restrained, single-accent.
 * Design intent:
 *   - Off-center on canvas (asymmetry, breaks the grid)
 *   - Ink-on-paper density at rest, single cyan accent on synaptic edges
 *   - 240 nodes / proximity edges (≤ ~360 lines) — performance budget for mobile
 *   - Subtle Y-axis rotation + cursor parallax; no decorative micro-motion
 */

const NODE_COUNT = 240
const LINK_DIST = 0.78
const FIELD_RADIUS = 3.6

function buildNodes(seed = 1) {
  // Deterministic pseudo-random in a slightly oblate sphere (brain-like silhouette).
  let s = seed
  const rand = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  const positions = new Float32Array(NODE_COUNT * 3)
  for (let i = 0; i < NODE_COUNT; i++) {
    const u = rand() * 2 - 1
    const t = rand() * Math.PI * 2
    const r = FIELD_RADIUS * Math.cbrt(rand())
    const sq = Math.sqrt(1 - u * u)
    positions[i * 3 + 0] = r * sq * Math.cos(t) * 1.15
    positions[i * 3 + 1] = r * u * 0.9
    positions[i * 3 + 2] = r * sq * Math.sin(t) * 0.85
  }
  return positions
}

function buildEdges(positions) {
  const edges = []
  const n = positions.length / 3
  const d2 = LINK_DIST * LINK_DIST
  for (let i = 0; i < n; i++) {
    const ax = positions[i * 3]
    const ay = positions[i * 3 + 1]
    const az = positions[i * 3 + 2]
    for (let j = i + 1; j < n; j++) {
      const bx = positions[j * 3]
      const by = positions[j * 3 + 1]
      const bz = positions[j * 3 + 2]
      const dx = ax - bx
      const dy = ay - by
      const dz = az - bz
      const dist2 = dx * dx + dy * dy + dz * dz
      if (dist2 < d2) edges.push(ax, ay, az, bx, by, bz)
    }
  }
  return new Float32Array(edges)
}

function Field() {
  const groupRef = useRef()
  const pointsRef = useRef()
  const linesRef = useRef()

  const { positions, edgePositions } = useMemo(() => {
    const positions = buildNodes(7)
    const edgePositions = buildEdges(positions)
    return { positions, edgePositions }
  }, [])

  const pointGeom = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [positions])

  const lineGeom = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(edgePositions, 3))
    return g
  }, [edgePositions])

  useFrame((state, dt) => {
    const t = state.clock.getElapsedTime()
    const { x: mx, y: my } = state.pointer

    if (groupRef.current) {
      // Slow rotation as primary motion. Mouse parallax is intentionally subtle.
      groupRef.current.rotation.y += dt * 0.06
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        my * 0.18,
        0.04
      )
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        mx * 0.35,
        0.04
      )
    }
    if (pointsRef.current) {
      // Single restrained "pulse" — opacity, not size.
      pointsRef.current.material.opacity = 0.55 + Math.sin(t * 0.8) * 0.08
    }
    if (linesRef.current) {
      linesRef.current.material.opacity = 0.18 + Math.sin(t * 0.5) * 0.05
    }
  })

  return (
    <group ref={groupRef} position={[0.6, 0.05, 0]}>
      <points ref={pointsRef} geometry={pointGeom}>
        <pointsMaterial
          size={0.028}
          color="#0A1628"
          sizeAttenuation
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      </points>

      <lineSegments ref={linesRef} geometry={lineGeom}>
        <lineBasicMaterial
          color="#00B8D4"
          transparent
          opacity={0.22}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  )
}

export default function NeuralField() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 6.4], fov: 42, near: 0.1, far: 50 }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.4} />
      <Field />
    </Canvas>
  )
}
