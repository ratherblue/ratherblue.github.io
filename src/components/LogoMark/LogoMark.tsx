import { useEffect, useRef, useState, type AnimationEvent, type TransitionEvent } from 'react'
import { CIRCUIT_HIT } from '../GridSweep/GridSweep'
import styles from './LogoMark.module.scss'

// How far the logo turns each time it's hit. It stays where it stops, so the turns add up.
const TURN = 45
// Kept outside the component so the logo is still at the same angle after visiting another page.
let savedAngle = 0

// The large home page logo, inlined from public/logo.svg so its parts can animate. When the backdrop's
// circuit pulse runs into it, it powers up: its rings turn a little further, in opposite
// directions, while it glows and the outer ring charges.
export default function LogoMark({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null)
  const [angle, setAngle] = useState(savedAngle)
  const [powered, setPowered] = useState(false)
  // Hits while the logo is still turning are ignored: retargeting the transition mid-turn makes it stutter.
  const turning = useRef(false)

  useEffect(() => {
    const svg = ref.current
    if (!svg) return
    const powerUp = () => {
      if (turning.current) return
      turning.current = true
      savedAngle += TURN
      setAngle(savedAngle)
      setPowered(true)
    }
    svg.addEventListener(CIRCUIT_HIT, powerUp)
    return () => svg.removeEventListener(CIRCUIT_HIT, powerUp)
  }, [])

  // The glow on the svg itself marks the end of the sequence; children's animations bubble up too.
  const onAnimationEnd = (e: AnimationEvent<SVGSVGElement>) => {
    if (e.target === e.currentTarget) setPowered(false)
  }

  // Both rings turn for the same time, so the first to finish ends the turn.
  const onTransitionEnd = (e: TransitionEvent<SVGSVGElement>) => {
    if (e.propertyName === 'transform') turning.current = false
  }
  const clockwise = { transform: `rotate(${angle}deg)` }
  const counterClockwise = { transform: `rotate(${-angle}deg)` }

  return (
    <svg
      ref={ref}
      className={`${styles.root} ${className ?? ''}`}
      viewBox="-440 -440 880 880"
      fill="none"
      role="img"
      aria-label="ratherblue logo"
      data-circuit-target
      data-powered={powered}
      onAnimationEnd={onAnimationEnd}
      onTransitionEnd={onTransitionEnd}
    >
      <defs>
        <radialGradient
          id="logo-core"
          cx="-0.2"
          cy="-0.35"
          r="1.2"
          gradientUnits="objectBoundingBox"
          gradientTransform="translate(0.5 0.5)"
        >
          <stop offset="0" stopColor="#4A90D9" />
          <stop offset="0.6" stopColor="#2A5A95" />
          <stop offset="1" stopColor="#1A3A66" />
        </radialGradient>
        <radialGradient id="logo-glow" r="0.5">
          <stop offset="0.5" stopColor="#3B7BC8" stopOpacity="0.35" />
          <stop offset="1" stopColor="#3B7BC8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle r="200" fill="url(#logo-glow)" />
      {/* Outer ring: turns clockwise. */}
      <g className={styles.turn} style={clockwise}>
        <circle className={styles.ring} r="430" stroke="#2F5F98" strokeWidth="2.5" strokeDasharray="8 7" />
        <path d="M167 -296 A340 340 0 0 1 -165 297" stroke="#24589A" strokeWidth="13" />
      </g>
      {/* Inner ring: turns counter-clockwise. */}
      <g className={styles.turn} style={counterClockwise}>
        <circle r="249" stroke="#6E7F96" strokeWidth="2.5" />
        <path d="M-128 -213 A249 249 0 0 0 -209 136" stroke="#5AAEF0" strokeWidth="3" />
      </g>
      <circle r="129" fill="url(#logo-core)" stroke="#4A88CC" strokeWidth="2.5" />
      {/* The crosshair sits over the core but turns with the outer ring. */}
      <path
        className={`${styles.turn} ${styles.crosshair}`}
        style={clockwise}
        d="M-249 0H249M0 -430V430"
        stroke="#3E6EA6"
        strokeWidth="2"
        strokeOpacity="0.8"
      />
    </svg>
  )
}
