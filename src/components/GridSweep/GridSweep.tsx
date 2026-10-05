import { useEffect, useRef } from 'react'

// Must match the backdrop grid in Layout.module.scss.
const CELL = 64
// Diagonals the front of the sweep crosses per second.
const SPEED = 9
// How many diagonals behind the front are still fading out.
const TAIL = 5
// Rest between sweeps, in seconds.
const PAUSE = 4

// Lights up the backdrop grid's cells in a diagonal line that sweeps from the top left to the bottom right.
export default function GridSweep({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cols = 0
    let rows = 0
    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(width / CELL)
      rows = Math.ceil(height / CELL)
    }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()

    // Read the colour at the start of each sweep so it follows the theme toggle.
    const readColor = () => getComputedStyle(canvas).getPropertyValue('--grid-cell')
    let color = readColor()
    let start = performance.now()
    let frame = 0
    const draw = (now: number) => {
      frame = requestAnimationFrame(draw)
      const diagonals = cols + rows - 1
      let elapsed = (now - start) / 1000
      if (elapsed > (diagonals + TAIL) / SPEED + PAUSE) {
        start = now
        elapsed = 0
        color = readColor()
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = color
      const front = elapsed * SPEED
      for (let d = Math.max(0, Math.ceil(front - TAIL)); d <= Math.min(front, diagonals - 1); d++) {
        ctx.globalAlpha = 1 - (front - d) / TAIL
        for (let col = Math.max(0, d - rows + 1); col <= Math.min(d, cols - 1); col++) {
          // Inset by the 1px grid line drawn along each cell's top and left edges.
          ctx.fillRect(col * CELL + 1, (d - col) * CELL + 1, CELL - 1, CELL - 1)
        }
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
