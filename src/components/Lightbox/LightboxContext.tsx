import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Shot } from '../../data/content'
import Lightbox from './Lightbox'

// contain: the whole image fits on screen (photos).
// width: the image keeps its width and the viewer scrolls vertically (long screenshots).
export type LightboxFit = 'contain' | 'width'

type LightboxState = {
  shots: Shot[]
  index: number
  title: string
  fit: LightboxFit
} | null

type LightboxApi = {
  open: (shots: Shot[], index: number, title: string, fit?: LightboxFit) => void
}

const LightboxContext = createContext<LightboxApi | null>(null)

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LightboxState>(null)

  const open = useCallback((shots: Shot[], index: number, title: string, fit: LightboxFit = 'contain') => {
    setState({ shots, index, title, fit })
  }, [])

  const close = useCallback(() => setState(null), [])

  const step = useCallback((delta: number) => {
    setState((s) => (s ? { ...s, index: (s.index + delta + s.shots.length) % s.shots.length } : s))
  }, [])

  const api = useMemo(() => ({ open }), [open])

  return (
    <LightboxContext.Provider value={api}>
      {children}
      {state && <Lightbox {...state} onClose={close} onStep={step} />}
    </LightboxContext.Provider>
  )
}

export function useLightbox() {
  const ctx = useContext(LightboxContext)
  if (!ctx) throw new Error('useLightbox must be used inside <LightboxProvider>')
  return ctx
}
