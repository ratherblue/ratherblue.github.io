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

type Point = { x: number; y: number }
// An HSL colour without alpha, read from a `--circuit-*` token such as `200 100% 80%`.
type Hsl = [number, number, number]

// A staircase along the grid lines from near the bottom-left corner to the top or right edge, one cell
// right or up at a time. It leans toward whichever direction is behind, so it climbs roughly corner to
// corner on any screen shape.
function route(width: number, height: number): Point[] {
  const cols = Math.ceil(width / CELL)
  const rows = Math.floor(height / CELL)
  let col = Math.floor(Math.random() * Math.max(1, cols / 4))
  let row = rows
  const points: Point[] = []
  while (col <= cols && row >= 0) {
    // +0.5 centres the stroke on the 1px grid line.
    points.push({ x: col * CELL + 0.5, y: row * CELL + 0.5 })
    const behindOnRight = col / cols < (rows - row) / rows
    if (Math.random() < (behindOnRight ? 0.7 : 0.3)) col++
    else row--
  }
  return points
}

const parseHsl = (value: string): Hsl => {
  const [h, s, l] = value.trim().split(/\s+/).map(parseFloat)
  return [h, s, l]
}

// A pulse of light runs along the backdrop grid's lines, climbing from the bottom left to the top right
// like current through a circuit.
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
    const colorAt = (t: number) => {
      const mix = colors.tail.map((tail, i) => tail + (colors.head[i] - tail) * t)
      return `hsl(${mix[0]} ${mix[1]}% ${mix[2]}% / ${t ** 1.6})`
    }

    let colors = readColors()
    let points = route(width, height)
    let start = performance.now()
    let frame = 0
    const draw = (now: number) => {
      frame = requestAnimationFrame(draw)
      const length = (points.length - 1) * CELL
      let elapsed = (now - start) / 1000
      if (elapsed > (length + TRAIL) / SPEED + PAUSE) {
        start = now
        elapsed = 0
        points = route(width, height)
        colors = readColors()
      }

      ctx.clearRect(0, 0, width, height)
      const head = elapsed * SPEED
      const tail = head - TRAIL
      if (tail >= length) return

      ctx.lineWidth = LINE_WIDTH
      ctx.lineCap = 'square'
      // A slight flicker in the glow sells the electricity.
      ctx.shadowBlur = GLOW * (0.8 + Math.random() * 0.4)
      ctx.shadowColor = colorAt(1)

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
        gradient.addColorStop(0, colorAt((from - tail) / TRAIL))
        gradient.addColorStop(1, colorAt((to - tail) / TRAIL))
        ctx.strokeStyle = gradient
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(q.x, q.y)
        ctx.stroke()
      }
    }
    frame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
