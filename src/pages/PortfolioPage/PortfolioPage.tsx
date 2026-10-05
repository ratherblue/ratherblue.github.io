import PageIntro from '../../components/PageIntro/PageIntro'
import ProjectFeature from '../../components/ProjectFeature/ProjectFeature'
import { projects } from '../../data/content'
import styles from './PortfolioPage.module.scss'

export default function PortfolioPage() {
  return (
    <section className={styles.root}>
      <PageIntro eyebrow="01 — Portfolio" title="Current work" />
      <div className={styles.list}>
        {projects.map((project) => (
          <ProjectFeature key={project.idx} project={project} />
        ))}
      </div>
    </section>
  )
}
