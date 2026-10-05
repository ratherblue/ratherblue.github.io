import PageLinkList from '../../components/PageLinkList/PageLinkList';
import { pages } from '../../data/content';
import styles from './HomePage.module.scss';

export default function HomePage() {
  return (
    <section className={styles.root}>
      <div className={styles.copy}>
        <h1 className={styles.title}>Fullstack engineer with a passion for UX.</h1>
        <PageLinkList links={pages} />
      </div>
      <div className={styles.mark}>
        <img src="/logo.svg" alt="ratherblue logo" />
      </div>
    </section>
  );
}
