import type { DiyProject as DiyProjectData } from '../../data/content';
import ThumbnailGallery from '../ThumbnailGallery/ThumbnailGallery';
import styles from './DiyProject.module.scss';

export default function DiyProject({ project }: { project: DiyProjectData }) {
  return (
    <article className={styles.root}>
      <div className={styles.heading}>
        <span className={styles.idx}>{project.idx}</span>
        <h3 className={styles.name}>{project.name}</h3>
      </div>
      {project.writeup && <p className={styles.writeup}>{project.writeup}</p>}
      <ThumbnailGallery
        shots={project.shots}
        title={project.name}
        layout="quad"
      />
    </article>
  );
}
