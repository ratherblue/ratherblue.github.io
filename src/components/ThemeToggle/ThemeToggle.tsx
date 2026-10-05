import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import styles from './ThemeToggle.module.scss';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  const Icon = theme === 'dark' ? Sun : Moon;

  return (
    <button type="button" className={styles.root} onClick={toggle} aria-label={label} title={label}>
      <Icon size={18} aria-hidden="true" />
    </button>
  );
}
