import { Play, Search } from 'lucide-react'
import type { Shot } from '../../data/content'
import styles from './Thumbnail.module.scss'

type Props = {
  shot: Shot
  size?: 'sm' | 'md'
  ratio?: 'wide' | 'feature'
  showCaption?: boolean
  onOpen: () => void
}

export default function Thumbnail({ shot, size = 'md', ratio = 'wide', showCaption = true, onOpen }: Props) {
  const tileSrc = shot.thumb ?? shot.src
  const isVideo = Boolean(shot.video)
  const Icon = isVideo ? Play : Search

  return (
    <figure className={styles.root}>
      <button
        type="button"
        className={styles.frame}
        data-size={size}
        data-ratio={ratio}
        data-media={isVideo ? 'video' : 'image'}
        onClick={onOpen}
        aria-label={(isVideo ? 'Play ' : 'Enlarge ') + (shot.caption ?? (isVideo ? 'video' : 'screenshot'))}
      >
        {tileSrc && <img className={styles.image} src={tileSrc} alt="" loading="lazy" />}
        <span className={styles.zoom} aria-hidden="true">
          <Icon className={styles.zoomIcon} />
        </span>
      </button>
      {showCaption && shot.caption && <figcaption className={styles.caption}>{shot.caption}</figcaption>}
    </figure>
  )
}
