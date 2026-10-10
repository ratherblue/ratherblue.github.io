import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { PageLink } from '../../data/content'
import styles from './PageLinkList.module.scss'

export default function PageLinkList({ links }: { links: PageLink[] }) {
  return (
    <ul className={styles.root}>
      {links.map((link) => (
        <li key={link.path}>
          <Link to={link.path} className={styles.row}>
            <span className={styles.text}>
              <span className={styles.label}>{link.label}</span>
              <span className={styles.description}>{link.description}</span>
            </span>
            <ArrowRight className={styles.arrow} size={18} aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  )
}
