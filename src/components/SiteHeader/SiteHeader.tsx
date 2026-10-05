import { Link, NavLink } from 'react-router-dom';
import { pages } from '../../data/content';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import styles from './SiteHeader.module.scss';

const links = [{ path: '/', label: 'Home' }, ...pages];

// Intentionally not sticky/fixed.
export default function SiteHeader() {
  return (
    <header className={styles.root}>
      <Link to="/" className={styles.brand}>
        <img src="/logo-icon.svg" alt="" width={32} height={32} />
        <span className={styles.name}>ratherblue</span>
      </Link>
      <nav className={styles.nav} aria-label="Main">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === '/'}
            className={({ isActive }) =>
              isActive ? styles.link + ' ' + styles.active : styles.link
            }
          >
            {link.label}
          </NavLink>
        ))}
        <ThemeToggle />
      </nav>
    </header>
  );
}
