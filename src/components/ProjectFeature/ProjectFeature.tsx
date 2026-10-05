import type { Project } from '../../data/content';
import Thumbnail from '../Thumbnail/Thumbnail';
import Tag from '../Tag/Tag';
import TextLink from '../TextLink/TextLink';
import { useLightbox } from '../Lightbox/LightboxContext';
import styles from './ProjectFeature.module.scss';

export default function ProjectFeature({ project }: { project: Project }) {
  const { open } = useLightbox();

  return (
    <article className={styles.root}>
      <Thumbnail
        shot={project.shots[0]}
        ratio="feature"
        showCaption={false}
        onOpen={() => open(project.shots, 0, project.name, 'width')}
      />
      <div className={styles.body}>
        <span className={styles.idx}>{project.idx}</span>
        <h2 className={styles.name}>{project.name}</h2>
        <p className={styles.description}>{project.description}</p>

        {project.stack && (
          <div className={styles.stack}>
            {project.stack?.map((item, i) => (
              <Tag key={i}>{item}</Tag>
            ))}
          </div>
        )}
        {project.status === 'live' && project.url && <TextLink href={project.url}>View site</TextLink>}
        {project.status === 'soon' && <Tag variant="soon">Coming soon</Tag>}
      </div>
    </article>
  );
}
