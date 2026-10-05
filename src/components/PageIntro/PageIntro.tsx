import type { ReactNode } from 'react';
import styles from './PageIntro.module.scss';

type Props = {
  eyebrow: string;
  title: string;
  children?: ReactNode;
};

export default function PageIntro({ eyebrow, title, children }: Props) {
  return (
    <header className={styles.root}>
      <span className={styles.eyebrow}>{eyebrow}</span>
      <h1 className={styles.title}>{title}</h1>
      {children && <p className={styles.lede}>{children}</p>}
    </header>
  );
}
