import PageIntro from '../../components/PageIntro/PageIntro'
import DiyProject from '../../components/DiyProject/DiyProject'
import { diyProjects } from '../../data/content'
import styles from './DiyPage.module.scss'

export default function DiyPage() {
  return (
    <section className={styles.root}>
      <PageIntro eyebrow="03 — DIY projects" title="Building things, on screen and off">
        Good design doesn't stop at <code>git push</code>
      </PageIntro>
      <div className={styles.list}>
        {diyProjects.map((project) => (
          <DiyProject key={project.idx} project={project} />
        ))}
      </div>
    </section>
  )
}
