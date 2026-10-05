// Builds web media from the originals in images-src/ (gitignored) into public/images/.
//
//   images-src/{section}/{project}/NN.jpg  ->  public/images/{section}/{project}/NN.webp         (lightbox)
//                                          ->  public/images/{section}/{project}/thumbs/NN.webp  (tile)
//   images-src/{section}/{project}/NN.mov  ->  public/images/{section}/{project}/NN.mp4          (lightbox)
//                                          ->  NN.webp + thumbs/NN.webp from a poster frame
//
// Videos use ffmpeg when it's on the PATH (brew install ffmpeg), otherwise macOS's avconvert, which
// makes larger files. Re-run with --force after installing ffmpeg to re-encode them.
//
// Usage: npm run images [-- --force]
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import sharp from 'sharp'

const SRC = 'images-src'
const OUT = 'public/images'
const FULL_MAX_WIDTH = 2000
const VIDEO_MAX_SIDE = 1280
const POSTER_AT_SECONDS = 1
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff'])
const VIDEO_EXT = new Set(['.mov', '.mp4', '.m4v'])

// Thumbnails are cropped to the tile's aspect ratio at ~2x its largest rendered size.
// Screenshots keep the top of the page; photos crop around the most interesting region.
const thumbSpecs = {
  portfolio: { width: 1280, height: 800, position: 'top' },
  legacy: { width: 480, height: 270, position: 'top' },
  diy: { width: 800, height: 450, position: sharp.strategy.attention },
}

const force = process.argv.includes('--force')
const isStale = (src, ...outs) =>
  force || outs.some((out) => !fs.existsSync(out) || fs.statSync(out).mtimeMs < fs.statSync(src).mtimeMs)

const has = (cmd) => {
  try {
    execFileSync('which', [cmd], { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

// Prefer ffmpeg (smaller files); fall back to the encoder built into macOS.
const videoEncoder = has('ffmpeg') ? 'ffmpeg' : has('avconvert') ? 'avconvert' : null

// maxBuffer: a full-resolution PNG poster on stdout can exceed the 1 MB default.
const run = (cmd, args) => execFileSync(cmd, args, { stdio: 'pipe', maxBuffer: 64 * 1024 * 1024 })
const ffmpeg = (args) => run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args])

// Writes the full-size image and the tile thumbnail. `input` is a path or an image buffer.
async function writeStills(input, spec, full, thumb) {
  fs.mkdirSync(path.dirname(thumb), { recursive: true })
  // rotate() applies EXIF orientation (phone photos are often stored sideways).
  await sharp(input)
    .rotate()
    .resize({ width: FULL_MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(full)
  await sharp(input)
    .rotate()
    .resize({
      width: spec.width,
      height: spec.height,
      fit: 'cover',
      position: spec.position,
    })
    .webp({ quality: 78 })
    .toFile(thumb)
}

// Encodes an H.264/AAC MP4 (plays everywhere; faststart lets it begin before it has fully downloaded)
// and returns a PNG poster frame taken from the encoded file, so it matches what plays.
function encodeVideo(src, out) {
  if (videoEncoder === 'avconvert') {
    run('avconvert', ['--source', src, '--preset', 'Preset1280x720', '--output', out, '--replace'])
    // Quick Look renders a frame of the movie; it names the result after the input file.
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'poster-'))
    run('qlmanage', ['-t', '-s', String(FULL_MAX_WIDTH), '-o', tmp, out])
    const poster = fs.readFileSync(path.join(tmp, path.basename(out) + '.png'))
    fs.rmSync(tmp, { recursive: true })
    return poster
  }

  // Phone HDR footage is tone-mapped to SDR so it doesn't look washed out.
  const transfer = run('ffprobe', [
    ...'-v error -select_streams v:0 -show_entries stream=color_transfer -of csv=p=0'.split(' '),
    src,
  ])
    .toString()
    .trim()
  const toneMap = ['arib-std-b67', 'smpte2084'].includes(transfer)
    ? 'zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,'
    : ''
  const scale = `scale='if(gte(iw,ih),min(${VIDEO_MAX_SIDE},iw),-2)':'if(gte(iw,ih),-2,min(${VIDEO_MAX_SIDE},ih))'`
  ffmpeg([
    ...['-i', src, '-vf', `${toneMap}${scale},format=yuv420p`],
    ...'-c:v libx264 -preset slow -crf 26 -profile:v high -c:a aac -b:a 96k -movflags +faststart'.split(' '),
    out,
  ])
  return ffmpeg(['-ss', String(POSTER_AT_SECONDS), '-i', out, ...'-frames:v 1 -f image2pipe -c:v png -'.split(' ')])
}

let built = 0
let skipped = 0

for (const section of fs.readdirSync(SRC)) {
  const spec = thumbSpecs[section]
  if (!spec) continue

  for (const project of fs.readdirSync(path.join(SRC, section))) {
    const dir = path.join(SRC, section, project)
    if (!fs.statSync(dir).isDirectory()) continue

    for (const file of fs.readdirSync(dir).sort()) {
      const ext = path.extname(file).toLowerCase()
      const isImage = IMAGE_EXT.has(ext)
      const isVideo = VIDEO_EXT.has(ext)
      if (!isImage && !isVideo) continue

      const src = path.join(dir, file)
      const base = path.join(OUT, section, project, path.parse(file).name)
      const full = base + '.webp'
      const thumb = path.join(OUT, section, project, 'thumbs', path.parse(file).name + '.webp')

      if (isImage) {
        if (!isStale(src, full, thumb)) {
          skipped++
          continue
        }
        await writeStills(src, spec, full, thumb)
      } else {
        if (!videoEncoder) {
          console.warn(`images: skipping ${src} (install ffmpeg to build videos)`)
          continue
        }
        const mp4 = base + '.mp4'
        if (!isStale(src, mp4, full, thumb)) {
          skipped++
          continue
        }
        fs.mkdirSync(path.dirname(thumb), { recursive: true })
        await writeStills(encodeVideo(src, mp4), spec, full, thumb)
      }
      built++
    }
  }
}

console.log(`images: ${built} built, ${skipped} up to date`)
