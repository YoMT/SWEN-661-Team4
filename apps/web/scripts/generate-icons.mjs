// One-off raster icon generation from the SVG brand marks.
// Run manually after changing public/icon*.svg:  node scripts/generate-icons.mjs
// Outputs are committed to public/ (they are not part of the build).
import sharp from 'sharp'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const pub = fileURLToPath(new URL('../public/', import.meta.url))

const jobs = [
  { src: 'icon.svg', out: 'icon-192.png', size: 192 },
  { src: 'icon.svg', out: 'icon-512.png', size: 512 },
  { src: 'icon-maskable.svg', out: 'icon-maskable-192.png', size: 192 },
  { src: 'icon-maskable.svg', out: 'icon-maskable-512.png', size: 512 },
  // iOS ignores transparency — flatten the rounded-rect corners onto the brand blue.
  { src: 'icon.svg', out: 'apple-touch-icon.png', size: 180, flatten: '#2e5c8a' }
]

for (const job of jobs) {
  const svg = await readFile(path.join(pub, job.src))
  let img = sharp(svg, { density: 300 }).resize(job.size, job.size)
  if (job.flatten) img = img.flatten({ background: job.flatten })
  await img.png().toFile(path.join(pub, job.out))
  console.log(`wrote public/${job.out} (${job.size}x${job.size})`)
}
