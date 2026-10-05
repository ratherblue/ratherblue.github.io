import PageIntro from '../../components/PageIntro/PageIntro'
import LegacyProject from '../../components/LegacyProject/LegacyProject'
import { legacyProjects } from '../../data/content'
import styles from './LegacyPage.module.scss'

export default function LegacyPage() {
  return (
    <section className={styles.root}>
      <PageIntro eyebrow="02 — Legacy portfolio" title="2008 to 2024">
        A selection of projects and products I've shipped from 2008 to 2024
      </PageIntro>
      <div>
        {legacyProjects.map((project) => (
          <LegacyProject key={project.idx} project={project} />
        ))}
      </div>
    </section>
  )
}
