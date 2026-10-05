import { useEffect, useRef, type MouseEvent } from 'react'
import type { Shot } from '../../data/content'
import type { LightboxFit } from './LightboxContext'
import styles from './Lightbox.module.scss'

type Props = {
  shots: Shot[]
  index: number
  title: string
  fit: LightboxFit
  onClose: () => void
  onStep: (delta: number) => void
}

const stop = (e: MouseEvent) => e.stopPropagation()

export default function Lightbox({ shots, index, title, fit, onClose, onStep }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const shot = shots[index]
  const hasMany = shots.length > 1

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      // A focused video uses the arrow keys to seek.
      if (e.target instanceof HTMLMediaElement) return
      if (e.key === 'ArrowRight') onStep(1)
      if (e.key === 'ArrowLeft') onStep(-1)
      // Focus sits on Close, so scroll a tall screenshot from the keyboard here.
      const frame = frameRef.current
      const scrollKeys: Record<string, number> = {
        ArrowDown: 80,
        ArrowUp: -80,
        PageDown: 0.9,
        PageUp: -0.9,
      }
      if (frame && e.key in scrollKeys) {
        e.preventDefault()
        const amount = scrollKeys[e.key]
        frame.scrollBy({
          top: Math.abs(amount) < 1 ? amount * frame.clientHeight : amount,
        })
      }
    }
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [onClose, onStep])

  return (
    <div className={styles.root} role="dialog" aria-modal="true" aria-label="Screenshot viewer" onClick={onClose}>
      <div className={styles.bar} onClick={stop}>
        <span className={styles.position}>
          {title} — {index + 1} / {shots.length}
        </span>
        <div className={styles.actions}>
          {(shot.video ?? shot.src) && (
            <a className={styles.button} href={shot.video ?? shot.src} target="_blank" rel="noopener noreferrer">
              {shot.video ? 'View video' : 'View image'}
            </a>
          )}
          <button ref={closeRef} type="button" className={styles.button} onClick={onClose}>
            Close
          </button>
        </div>
      </div>

      <div className={styles.stage}>
        <button
          type="button"
          className={styles.step}
          data-hidden={!hasMany}
          aria-label="Previous"
          onClick={(e) => {
            stop(e)
            onStep(-1)
          }}
        >
          ←
        </button>
        {/* Keyed by index so each image starts scrolled to the top. */}
        <div key={index} ref={frameRef} className={styles.frame} data-fit={shot.video ? 'contain' : fit}>
          {shot.video ? (
            <video
              key={shot.video}
              className={styles.image}
              src={shot.video}
              poster={shot.src}
              aria-label={shot.caption}
              controls
              autoPlay
              muted
              playsInline
              onClick={stop}
            />
          ) : shot.src ? (
            <img className={styles.image} src={shot.src} alt={shot.caption ?? ''} onClick={stop} />
          ) : (
            <div className={styles.placeholder} onClick={stop} />
          )}
        </div>
        <button
          type="button"
          className={styles.step}
          data-hidden={!hasMany}
          aria-label="Next"
          onClick={(e) => {
            stop(e)
            onStep(1)
          }}
        >
          →
        </button>
      </div>

      <p className={styles.caption}>{shot.caption}</p>
    </div>
  )
}
