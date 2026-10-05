import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'rb-theme'
const query = '(prefers-color-scheme: light)'

const readStored = (): Theme | null => {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

const systemTheme = (): Theme => (window.matchMedia(query).matches ? 'light' : 'dark')

// Defaults to the OS preference; an explicit toggle is persisted and wins from then on.
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => readStored() ?? systemTheme())

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = () => {
      if (!readStored()) setTheme(systemTheme())
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        /* storage unavailable */
      }
      return next
    })
  }, [])

  return { theme, toggle }
}
