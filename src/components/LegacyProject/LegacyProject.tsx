import {
  legacyDisplay,
  type LegacyProject as LegacyProjectData,
} from '../../data/content';
import ThumbnailGallery from '../ThumbnailGallery/ThumbnailGallery';
import styles from './LegacyProject.module.scss';

type Props = {
  project: LegacyProjectData;
  display?: typeof legacyDisplay;
};

export default function LegacyProject({
  project,
  display = legacyDisplay,
}: Props) {
  return (
    <article className={styles.root}>
      <div className={styles.meta}>
        <div className={styles.heading}>
          <span className={styles.idx}>{project.idx}</span>
          <h3 className={styles.title}>{project.title}</h3>
          {display.showYear && project.year && (
            <span className={styles.year}>{project.year}</span>
          )}
        </div>
        {display.showRole && project.role && (
          <span className={styles.role}>{project.role}</span>
        )}
        {display.showDescription && project.description && (
          <p className={styles.description}>{project.description}</p>
        )}
      </div>
      <ThumbnailGallery
        shots={project.shots}
        title={project.title}
        layout="strip"
        fit="width"
      />
    </article>
  );
}
