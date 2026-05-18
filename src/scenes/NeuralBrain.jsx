import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// NeuralBrain — pure-code generated, GPU-shaded particle brain.
//
// Composition (three layered Points objects, all additive-blended for bloom):
//   1) Cortex    — 18,000 particles. Two ellipsoidal hemispheres with wrinkle
//                  noise + shell bias. The macroscopic shape readers see.
//   2) Halo      — 6,000  particles. Sparse outer cloud, atmospheric depth.
//   3) Starfield — 2,500  particles. Far parallax dust.
//
// Why a custom ShaderMaterial (vs pointsMaterial)?
//   - Per-particle pulsing phase (random offset attribute) — no global flicker.
//   - gl_PointSize modulated by both pulse and depth in one pass.
//   - Soft circular fragment with brightening core — required for clean Bloom.
//
// Performance: ~26k particles total, no per-frame allocations, two uniforms
// touched per frame. depthWrite=false + AdditiveBlending = no opaque sort cost.

const vertexShader = `
  uniform float uTime;
  uniform float uSize;
  attribute float aPhase;
  attribute float aScale;
  varying float vPulse;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    float pulse = 0.5 + 0.5 * sin(uTime * 0.9 + aPhase);
    vPulse = pulse;

    float depthScale = 4.5 / -mvPosition.z;
    gl_PointSize = clamp(uSize * aScale * (0.75 + 0.55 * pulse) * depthScale, 1.0, 9.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vPulse;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float falloff = smoothstep(0.5, 0.0, d);
    float core    = smoothstep(0.22, 0.0, d);

    vec3 col = mix(uColorB, uColorA, vPulse);
    col += core * 0.18;

    gl_FragColor = vec4(col, falloff * (0.16 + 0.46 * vPulse));
  }
`

// generateBrain — two ellipsoidal hemispheres with shell bias + wrinkle noise.
//
// 72% of particles live on a thin radial shell (r in [0.86, 1.0]) so the
// silhouette reads as a brain surface, not a fuzz ball. 28% scatter inside
// for internal "thinking" depth. Triple-trig pseudo-noise on (theta, phi)
// gives gyrus/sulcus-like radial perturbation without an extra dep. Hemispheres
// offset on x by +-0.42 so the central fissure is visible. Particles near the
// midline get pulled inward to suggest a corpus-callosum bridge.
function generateBrain(count) {
  const positions = new Float32Array(count * 3)
  const phases = new Float32Array(count)
  const scales = new Float32Array(count)

  const a = 1.00
  const b = 0.86
  const c = 0.74

  for (let i = 0; i < count; i++) {
    const side = Math.random() < 0.5 ? -1 : 1

    const u = Math.random()
    const v = Math.random()
    const theta = 2 * Math.PI * u
    const phi = Math.acos(2 * v - 1)

    const isShell = Math.random() < 0.72
    const r = isShell
      ? 0.86 + 0.14 * Math.random()
      : 0.18 + 0.66 * Math.random()

    const wrinkle =
      0.075 * Math.sin(theta * 5.7) * Math.cos(phi * 4.2) +
      0.045 * Math.sin(theta * 9.3 + 1.2) * Math.sin(phi * 7.1) +
      0.025 * Math.cos(theta * 13.1) * Math.cos(phi * 10.5 + 0.5)

    const rEff = r + (isShell ? wrinkle : wrinkle * 0.35)

    let x = side * 0.42 + rEff * a * Math.sin(phi) * Math.cos(theta)
    let y = rEff * b * Math.cos(phi)
    let z = rEff * c * Math.sin(phi) * Math.sin(theta)

    z *= 0.94

    if (Math.abs(y) < 0.15 && Math.abs(z) < 0.20) {
      x *= 0.88
    }

    positions[i * 3 + 0] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z

    phases[i] = Math.random() * Math.PI * 2
    scales[i] = isShell
      ? 0.75 + Math.random() * 0.55
      : 0.40 + Math.random() * 0.40
  }

  const geom = new THREE.BufferGeometry()
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geom.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
  geom.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
  return geom
}

// generateHalo — sparse outer cloud (radius ~1.6 to 2.6).
function generateHalo(count) {
  const positions = new Float32Array(count * 3)
  const phases = new Float32Array(count)
  const scales = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const u = Math.random()
    const v = Math.random()
    const theta = 2 * Math.PI * u
    const phi = Math.acos(2 * v - 1)

    const r = 1.55 + Math.random() * 1.05

    positions[i * 3 + 0] = r * 1.10 * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * 0.95 * Math.cos(phi)
    positions[i * 3 + 2] = r * 0.85 * Math.sin(phi) * Math.sin(theta)

    phases[i] = Math.random() * Math.PI * 2
    scales[i] = 0.20 + Math.random() * 0.35
  }

  const geom = new THREE.BufferGeometry()
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geom.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
  geom.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
  return geom
}

// generateStars — uniform far cube. Not rotated with the brain; the parallax
// between brain rotation and static stars sells the depth.
function generateStars(count) {
  const positions = new Float32Array(count * 3)
  const phases = new Float32Array(count)
  const scales = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 22
    positions[i * 3 + 1] = (Math.random() - 0.5) * 14
    positions[i * 3 + 2] = -6 - Math.random() * 8

    phases[i] = Math.random() * Math.PI * 2
    scales[i] = 0.10 + Math.random() * 0.20
  }

  const geom = new THREE.BufferGeometry()
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geom.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
  geom.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
  return geom
}

const COLOR_TECH_BLUE = '#00f2fe'
const COLOR_MED_CYAN = '#4facfe'

function makeUniforms(size, colorA = COLOR_TECH_BLUE, colorB = COLOR_MED_CYAN) {
  return {
    uTime: { value: 0 },
    uSize: { value: size },
    uColorA: { value: new THREE.Color(colorA) },
    uColorB: { value: new THREE.Color(colorB) },
  }
}

export default function NeuralBrain({ paused = false }) {
  const brainGroup = useRef()
  const cortexMat = useRef()
  const haloMat = useRef()
  const starsMat = useRef()

  const cortexGeom = useMemo(() => generateBrain(18000), [])
  const haloGeom = useMemo(() => generateHalo(6000), [])
  const starsGeom = useMemo(() => generateStars(2500), [])

  const cortexUniforms = useMemo(() => makeUniforms(7.2), [])
  const haloUniforms = useMemo(
    () => makeUniforms(4.8, '#7fdcff', '#4facfe'),
    []
  )
  const starsUniforms = useMemo(
    () => makeUniforms(2.4, '#cdeaff', '#5fa8ff'),
    []
  )

  useFrame((state, delta) => {
    if (paused) return
    const t = state.clock.elapsedTime

    if (cortexMat.current) cortexMat.current.uniforms.uTime.value = t
    if (haloMat.current) haloMat.current.uniforms.uTime.value = t * 0.7
    if (starsMat.current) starsMat.current.uniforms.uTime.value = t * 0.4

    if (brainGroup.current) {
      // Slow Y rotation (~4.6 deg/s): contemplative, not dizzy.
      brainGroup.current.rotation.y += delta * 0.08
      brainGroup.current.rotation.x = Math.sin(t * 0.27) * 0.07
      brainGroup.current.rotation.z = Math.cos(t * 0.18) * 0.04
    }
  })

  return (
    <>
      <group ref={brainGroup}>
        <points geometry={cortexGeom}>
          <shaderMaterial
            ref={cortexMat}
            uniforms={cortexUniforms}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>

        <points geometry={haloGeom}>
          <shaderMaterial
            ref={haloMat}
            uniforms={haloUniforms}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>

      <points geometry={starsGeom}>
        <shaderMaterial
          ref={starsMat}
          uniforms={starsUniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  )
}
