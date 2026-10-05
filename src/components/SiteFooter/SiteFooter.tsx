import { Github, Linkedin, Mail } from 'lucide-react';
import { socials } from '../../data/content';
import styles from './SiteFooter.module.scss';

const icons = { github: Github, linkedin: Linkedin, mail: Mail };

export default function SiteFooter() {
  return (
    <footer className={styles.root}>
      <span>© {new Date().getFullYear()} ratherblue</span>
      <ul className={styles.links}>
        {socials.map(({ label, href, icon }) => {
          const Icon = icons[icon];
          return (
            <li key={label}>
              <a href={href} className={styles.link}>
                <Icon size={18} aria-hidden="true" />
                <span>{label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </footer>
  );
}
