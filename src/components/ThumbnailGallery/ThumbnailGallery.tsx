import type { Shot } from '../../data/content';
import Thumbnail from '../Thumbnail/Thumbnail';
import { useLightbox, type LightboxFit } from '../Lightbox/LightboxContext';
import styles from './ThumbnailGallery.module.scss';

type Props = {
  shots: Shot[];
  title: string;
  layout: 'strip' | 'quad';
  fit?: LightboxFit;
};

// strip: legacy row, up to 6 across, tiles never stretch when fewer than 6.
// quad: DIY, 2x2 on mobile, 4 across from md.
export default function ThumbnailGallery({ shots, title, layout, fit }: Props) {
  const { open } = useLightbox();

  return (
    <div className={styles.root} data-layout={layout}>
      {shots.map((shot, i) => (
        <Thumbnail
          key={i}
          shot={shot}
          size={layout === 'strip' ? 'sm' : 'md'}
          onOpen={() => open(shots, i, title, fit)}
        />
      ))}
    </div>
  );
}
