import { useEffect, useRef } from 'react'

// Must match the backdrop grid in Layout.module.scss.
const CELL = 64
// How fast the pulse travels along the grid lines, in px per second.
const SPEED = 520
// Length of the glowing trail behind the head, in px.
const TRAIL = 300
// Rest between pulses, in seconds.
const PAUSE = 2.5
const LINE_WIDTH = 2
const GLOW = 10
// Chance that the pulse forks at each grid intersection it reaches.
const FORK_CHANCE = 0.12
// Forks can fork again, up to this many levels deep.
const MAX_DEPTH = 2
// Each level of fork is this much fainter than the one it split from.
const FORK_STRENGTH = 0.6
// A fork runs for this many cells (inclusive range) before dying out.
const FORK_LENGTH = [3, 8]

type Point = { x: number; y: number }
// One strand of the pulse. `delay` is how far, in px, the pulse travels before this strand starts.
type Bolt = { points: Point[]; delay: number; strength: number }
type Direction = 'right' | 'up'
// An HSL colour without alpha, read from a `--circuit-*` token such as `200 100% 80%`.
type Hsl = [number, number, number]

// +0.5 centres the stroke on the 1px grid line.
const corner = (col: number, row: number): Point => ({ x: col * CELL + 0.5, y: row * CELL + 0.5 })

// Maps out one pulse: a main strand that climbs a staircase along the grid lines from near the bottom-left
// corner to the top or right edge, one cell right or up at a time, plus the forks that split off it like
// lightning. The main strand leans toward whichever direction is behind, so it runs roughly corner to
// corner on any screen shape. Forks set off the other way from the split and wander from there.
function strike(width: number, height: number): Bolt[] {
  const cols = Math.ceil(width / CELL)
  const rows = Math.floor(height / CELL)
  const bolts: Bolt[] = []

  const grow = (col: number, row: number, delay: number, depth: number, first?: Direction) => {
    const maxSteps =
      depth === 0 ? Infinity : FORK_LENGTH[0] + Math.floor(Math.random() * (FORK_LENGTH[1] - FORK_LENGTH[0] + 1))
    const points: Point[] = []
    let next = first
    while (col <= cols && row >= 0 && points.length <= maxSteps) {
      points.push(corner(col, row))
      const lean = depth === 0 ? (col / cols < (rows - row) / rows ? 0.7 : 0.3) : 0.5
      const direction = next ?? (Math.random() < lean ? 'right' : 'up')
      next = undefined
      if (points.length > 1 && depth < MAX_DEPTH && Math.random() < FORK_CHANCE) {
        grow(col, row, delay + (points.length - 1) * CELL, depth + 1, direction === 'right' ? 'up' : 'right')
      }
      if (direction === 'right') col++
      else row--
    }
    bolts.push({ points, delay, strength: FORK_STRENGTH ** depth })
  }

  grow(Math.floor(Math.random() * Math.max(1, cols / 4)), rows, 0, 0)
  return bolts
}

// How long a pulse lasts, in seconds, until its last strand has faded out.
const duration = (bolts: Bolt[]) =>
  Math.max(...bolts.map((bolt) => bolt.delay + (bolt.points.length - 1) * CELL + TRAIL)) / SPEED

const parseHsl = (value: string): Hsl => {
  const [h, s, l] = value.trim().split(/\s+/).map(parseFloat)
  return [h, s, l]
}

// A pulse of light runs along the backdrop grid's lines, climbing from the bottom left to the top right
// like current through a circuit, and forking as it goes like lightning.
export default function GridSweep({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let width = 0
    let height = 0
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()

    // Read the theme's colours at the start of each pulse so it follows the theme toggle.
    const readColors = () => {
      const style = getComputedStyle(canvas)
      return {
        head: parseHsl(style.getPropertyValue('--circuit-head')),
        tail: parseHsl(style.getPropertyValue('--circuit-tail')),
      }
    }
    // t runs from 0 at the end of the trail to 1 at the head: the colour brightens and the alpha rises.
    const colorAt = (t: number, strength = 1) => {
      const mix = colors.tail.map((tail, i) => tail + (colors.head[i] - tail) * t)
      return `hsl(${mix[0]} ${mix[1]}% ${mix[2]}% / ${t ** 1.6 * strength})`
    }

    const drawBolt = ({ points, delay, strength }: Bolt, elapsed: number) => {
      const head = elapsed * SPEED - delay
      const tail = head - TRAIL
      // Each segment is one cell edge, so a straight gradient across it follows the trail exactly.
      for (let i = 0; i < points.length - 1; i++) {
        const from = Math.max(tail, i * CELL)
        const to = Math.min(head, (i + 1) * CELL)
        if (from >= to) continue
        const a = points[i]
        const b = points[i + 1]
        const at = (d: number) => {
          const f = (d - i * CELL) / CELL
          return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f }
        }
        const p = at(from)
        const q = at(to)
        const gradient = ctx.createLinearGradient(p.x, p.y, q.x, q.y)
        gradient.addColorStop(0, colorAt((from - tail) / TRAIL, strength))
        gradient.addColorStop(1, colorAt((to - tail) / TRAIL, strength))
        ctx.strokeStyle = gradient
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(q.x, q.y)
        ctx.stroke()
      }
    }

    let colors = readColors()
    let bolts = strike(width, height)
    let start = performance.now()
    let frame = 0
    const draw = (now: number) => {
      frame = requestAnimationFrame(draw)
      let elapsed = (now - start) / 1000
      if (elapsed > duration(bolts) + PAUSE) {
        start = now
        elapsed = 0
        bolts = strike(width, height)
        colors = readColors()
      }

      ctx.clearRect(0, 0, width, height)
      ctx.lineWidth = LINE_WIDTH
      ctx.lineCap = 'square'
      // A slight flicker in the glow sells the electricity.
      ctx.shadowBlur = GLOW * (0.8 + Math.random() * 0.4)
      ctx.shadowColor = colorAt(1)
      for (const bolt of bolts) drawBolt(bolt, elapsed)
    }
    frame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
