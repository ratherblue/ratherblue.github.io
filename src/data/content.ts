export type Shot = {
  src?: string // full-size image, shown in the lightbox
  thumb?: string // pre-cropped tile image (see scripts/images.mjs)
  video?: string // when set, the lightbox plays this and `src` is its poster frame
  caption?: string
}

// Images live in public/images/{dir}/NN.webp with thumbnails in .../thumbs/NN.webp.
const image = (dir: string, n: number, caption?: string): Shot => {
  const file = String(n).padStart(2, '0') + '.webp'
  return {
    src: `/images/${dir}/${file}`,
    thumb: `/images/${dir}/thumbs/${file}`,
    caption,
  }
}

// Videos live in public/images/{dir}/NN.mp4; the script also writes a poster (NN.webp) and its thumbnail.
const video = (dir: string, n: number, caption?: string): Shot => ({
  ...image(dir, n, caption),
  video: `/images/${dir}/${String(n).padStart(2, '0')}.mp4`,
})

// Pass captions (one per image, in order) or just a count when there are none.
const gallery = (dir: string, captions: (string | undefined)[] | number): Shot[] =>
  (typeof captions === 'number' ? Array.from({ length: captions }, () => undefined) : captions).map((caption, i) =>
    image(dir, i + 1, caption),
  )

export type PageLink = {
  path: string
  idx: string
  label: string
  description: string
}

export type Project = {
  idx: string
  name: string
  description: string
  stack?: string[]
  url?: string
  status: 'live' | 'soon'
  shots: Shot[] // the first is the tile; the lightbox steps through all of them
}

export type LegacyProject = {
  idx: string
  title: string
  year: string
  role: string
  description: string
  shots: Shot[]
}

export type DiyProject = {
  idx: string
  name: string
  writeup: string
  shots: Shot[]
}

export const pages: PageLink[] = [
  {
    path: '/portfolio',
    idx: '01',
    label: 'Portfolio',
    description: 'Meadows, Strawberries, Nullwave, and Allocate',
  },
  {
    path: '/legacy',
    idx: '02',
    label: 'Legacy portfolio',
    description: '2008 to 2024',
  },
  {
    path: '/diy',
    idx: '03',
    label: 'DIY projects',
    description: 'Pantry, closets, and a powder room',
  },
]

// TODO(content): descriptions, stack, URLs and screenshots are placeholders.
export const projects: Project[] = [
  {
    idx: '01.1',
    name: 'Meadows design system',
    description: 'Work in progress',
    status: 'soon',
    shots: gallery('portfolio/meadows', ['Meadows design system']),
  },
  {
    idx: '01.2',
    name: 'Strawberries',
    description: 'Claude design POC',
    stack: ['React 18', 'TypeScript', 'SASS', 'Vite'],
    url: 'https://ratherblue.com/strawberries/',
    status: 'live',
    shots: gallery('portfolio/strawberries', ['Strawberries']),
  },
  {
    idx: '01.3',
    name: 'Nullwave',
    description:
      'Claude design POC. An homage to the old flash sites popular in the early 2000s. (Kai Morrow is a generated name)',
    stack: ['Astro'],
    url: 'https://ratherblue.com/nullwave/',
    status: 'live',
    shots: gallery('portfolio/nullwave', ['Nullwave']),
  },
  {
    idx: '01.4',
    name: 'Allocate',
    description:
      'Cannot show anything other than public images due to NDA, but currently work here polishing the design system for this app. Designs are not mine, but the implementation is.',
    status: 'live',
    url: 'https://allocate.co/',
    shots: gallery('portfolio/allocate', ['Dashboard', 'Detail panel']),
  },
]

// Toggle which metadata lines render on every legacy project.
export const legacyDisplay = {
  showYear: true,
  showRole: true,
  showDescription: true,
}

// TODO(content): unfilled years, roles and descriptions show placeholders.
type LegacyDetails = Partial<Pick<LegacyProject, 'year' | 'role' | 'description'>>

const legacy = (
  title: string,
  dir: string,
  captions: (string | undefined)[] | number,
  { year = '', role = '', description = '' }: LegacyDetails = {},
) => ({
  title,
  year,
  role,
  description,
  shots: gallery('legacy/' + dir, captions),
})

export const legacyProjects: LegacyProject[] = [
  legacy('Sourceability', 'sourceability', 12, {
    year: '2024',
    role: 'Implemented the frontend design system',
  }),
  legacy(
    'loanDepot',
    'loan-depot',
    ['Pipeline', 'Overview', 'Dual AUS: LPA settings', '1003: notification', 'Finalize'],
    { year: '2018', role: 'Frontend design system and implementation' },
  ),
  legacy('Apache FreeMarker', 'freemarker', 8, {
    year: '2014',
    role: 'Design and frontend design system and implementation',
  }),
  legacy('FMPP', 'fmpp', 4, {
    year: '2014',
    role: 'Design and frontend design system and implementation',
  }),
  legacy('Cedros Collective', 'cedros-collective', 4, {
    year: '2017',
    role: 'Implemented site design',
  }),
  legacy('Brian Church Architecture', 'brian-church-architecture', 6, {
    year: '2014',
    role: 'Implemented site to client expectations',
  }),
  legacy('Heart of the Swarm', 'heart-of-the-swarm', 6, {
    year: '2013',
    role: 'Frontend design system and implementation',
  }),
  legacy('Diablo III', 'diablo3', ['Media', 'Screenshots'], {
    year: '2012',
    role: 'Frontend design system and implementation',
  }),
  legacy(
    'BlizzCon',
    'blizzcon',
    ['EU regionals', 'TW regionals', 'TW regionals video archive', 'State 1', 'State 2', 'State 3'],
    { year: '2011', role: 'Frontend design system and implementation' },
  ),
  legacy('StarCraft II', 'sc2', ['Game landing', 'Homepage', 'Media', 'Services landing'], {
    year: '2010',
    role: 'Frontend design system and implementation',
  }),
  legacy(
    'World of Warcraft',
    'wow',
    [
      'Blood elf',
      'Death knight',
      'Draenei',
      'Druid',
      'Hunter',
      'Mage',
      'Orc',
      'Paladin',
      'Priest',
      'Rogue',
      'Shaman',
      'Tauren',
      'Troll',
      'Undead',
      'Warlock',
      'Warrior',
    ],
    { year: '2010', role: 'Frontend design system and implementation' },
  ),
  legacy('NetEase transition', 'netease-transition', ['Eligible realms', 'Confirm character move'], {
    year: '2009',
  }),
  legacy('WoW Armory', 'wow-armory', ['Character profile'], {
    year: '2009',
  }),
  legacy('Warcraft.com', 'warcraft-com', ['Free trial landing'], {
    year: '2008',
    role: 'Implemented design',
  }),
]
  // Newest first. The sort is stable, so projects from the same year keep the order they're listed in.
  .sort((a, b) => b.year.localeCompare(a.year))
  .map((project, i) => ({ idx: String(i + 1).padStart(2, '0'), ...project }))

// TODO(content): write-ups are placeholders.
export const diyProjects: DiyProject[] = [
  {
    name: 'Pantry',
    dir: 'pantry',
    writeup:
      'Taught myself SketchUp, then handed the plans to a finish carpenter. Not pictures: Under shelf lighting, and a lot of snacks.',
    captions: ['Before', 'Design', 'Shelves in', 'After'],
    videos: ['Walkthrough'],
  },
  {
    name: 'Bedroom closet 1',
    dir: 'bedroom-closet-1',
    writeup: 'Not to brag, but this only took us two Ikea trips',
    captions: ['Before', 'Cleared out', 'New system', 'After'],
  },
  {
    name: 'Bedroom closet 2',
    dir: 'bedroom-closet-2',
    writeup: 'Don’t worry, the carpet got replaced later',
    captions: ['Before, feat. borax', 'Cleared out', 'New system', 'After'],
  },
  {
    name: 'Powder room',
    dir: 'powder-room',
    writeup: 'Millennial green never saw us coming',
    captions: [
      'Before',
      'Before',
      'Demolition',
      'Skim coating',
      'After',
      'Whimsy? Check.',
      'Floor tile',
      'Snail party',
    ],
  },
].map(({ name, dir, captions, videos = [], writeup = '' }, i) => ({
  idx: String(i + 1).padStart(2, '0'),
  name,
  writeup,
  // Videos are numbered after the photos in the same folder.
  shots: [
    ...gallery('diy/' + dir, captions),
    ...videos.map((caption, j) => video('diy/' + dir, captions.length + j + 1, caption)),
  ],
}))

export const socials = [
  { label: 'GitHub', href: 'https://github.com/ratherblue', icon: 'github' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/lee-d-71183316a/',
    icon: 'linkedin',
  },
  { label: 'Email', href: 'mailto:ratherblue@gmail.com', icon: 'mail' },
] as const
