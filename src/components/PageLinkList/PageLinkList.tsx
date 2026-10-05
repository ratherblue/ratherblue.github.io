import { Link } from 'react-router-dom';
import type { PageLink } from '../../data/content';
import styles from './PageLinkList.module.scss';

export default function PageLinkList({ links }: { links: PageLink[] }) {
  return (
    <ul className={styles.root}>
      {links.map((link) => (
        <li key={link.path}>
          <Link to={link.path} className={styles.row}>
            <span className={styles.idx}>{link.idx}</span>
            <span className={styles.text}>
              <span className={styles.label}>{link.label}</span>
              <span className={styles.description}>{link.description}</span>
            </span>
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
