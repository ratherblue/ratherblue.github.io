import type { ReactNode } from 'react';
import styles from './Tag.module.scss';

type Props = {
  variant?: 'default' | 'soon';
  children: ReactNode;
};

export default function Tag({ variant = 'default', children }: Props) {
  return (
    <span className={styles.root} data-variant={variant}>
      {children}
    </span>
  );
}
