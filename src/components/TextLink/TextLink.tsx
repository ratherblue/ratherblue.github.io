import type { ReactNode } from 'react';
import styles from './TextLink.module.scss';

type Props = {
  href: string;
  children: ReactNode;
};

// Text underlines on hover; the caret does not.
export default function TextLink({ href, children }: Props) {
  return (
    <a href={href} className={styles.root}>
      <span className={styles.label}>{children}</span>
      <svg className={styles.caret} width="6" height="10" viewBox="0 0 6 10" fill="none" aria-hidden="true">
        <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="butt" strokeLinejoin="miter" />
      </svg>
    </a>
  );
}
