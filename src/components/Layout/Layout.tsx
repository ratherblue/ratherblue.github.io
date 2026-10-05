import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import SiteHeader from '../SiteHeader/SiteHeader'
import SiteFooter from '../SiteFooter/SiteFooter'
import { LightboxProvider } from '../Lightbox/LightboxContext'
import styles from './Layout.module.scss'

export default function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <LightboxProvider>
      <div className={styles.root}>
        <SiteHeader />
        <main className={styles.main}>
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </LightboxProvider>
  )
}
