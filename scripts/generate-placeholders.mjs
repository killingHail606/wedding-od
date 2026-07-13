// Generates tasteful placeholder images (ivory + olive) and a carp favicon.
// Run: node scripts/generate-placeholders.mjs
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(root, 'public/images')
mkdirSync(outDir, { recursive: true })

const OLIVE = '#838f70'
const OLIVE_D = '#545d47'
const IVORY = '#fff7e4'
const SAND = '#e7ceb0'
const ESPRESSO = '#4b3327'

function monogram(w, h, opacity = 0.22) {
  const s = Math.min(w, h)
  return `
    <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central"
      font-family="Georgia, 'Times New Roman', serif" font-size="${s * 0.34}"
      fill="${IVORY}" fill-opacity="${opacity}" letter-spacing="2">Д &amp; О</text>`
}

function grain() {
  return `
    <filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.05"/></feComponentTransfer>
      <feComposite operator="over" in2="SourceGraphic"/></filter>`
}

function sceneSvg(w, h) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${OLIVE}"/>
        <stop offset="0.55" stop-color="${OLIVE_D}"/>
        <stop offset="1" stop-color="${ESPRESSO}"/>
      </linearGradient>
      <radialGradient id="glow" cx="0.32" cy="0.28" r="0.9">
        <stop offset="0" stop-color="${SAND}" stop-opacity="0.55"/>
        <stop offset="1" stop-color="${SAND}" stop-opacity="0"/>
      </radialGradient>
      ${grain()}
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    <rect width="${w}" height="${h}" fill="url(#glow)"/>
    <rect width="${w}" height="${h}" filter="url(#g)"/>
    ${monogram(w, h)}
  </svg>`
}

function ogSvg(w, h) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${IVORY}"/>
        <stop offset="1" stop-color="#f3e8cf"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    <rect x="40" y="40" width="${w - 80}" height="${h - 80}" fill="none" stroke="${OLIVE}" stroke-opacity="0.5"/>
    <text x="50%" y="40%" text-anchor="middle" font-family="Georgia, serif" font-size="34"
      letter-spacing="8" fill="${OLIVE_D}">МИ ОДРУЖУЄМОСЬ</text>
    <text x="50%" y="55%" text-anchor="middle" font-family="Georgia, serif" font-size="82"
      fill="${ESPRESSO}">Дарʼя &amp; Олександр</text>
    <text x="50%" y="70%" text-anchor="middle" font-family="Georgia, serif" font-size="30"
      letter-spacing="4" fill="${OLIVE_D}">26 · 09 · 2026 · Київ</text>
  </svg>`
}

// Realistic-ish koi / carp for the favicon (per couple's request).
function carpSvg(size) {
  const SPOT = '#d68a5a'
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="14" fill="${OLIVE_D}"/>
    <g transform="rotate(-12 32 32)">
      <!-- tail -->
      <path d="M46 32c6-5 11-8 15-9-3 4-3 5-3 9s0 5 3 9c-4-1-9-4-15-9z" fill="${IVORY}"/>
      <!-- dorsal fin -->
      <path d="M28 21c4-8 11-9 16-5-4 0-8 1-12 4z" fill="${IVORY}" opacity="0.92"/>
      <!-- pectoral fin -->
      <path d="M27 40c2 7 8 9 13 6-4-1-8-3-11-7z" fill="${IVORY}" opacity="0.88"/>
      <!-- body -->
      <path d="M12 32c2-9 12-15 24-13 6 1 11 5 13 13-2 8-7 12-13 13-12 2-22-4-24-13z" fill="${IVORY}"/>
      <!-- koi markings -->
      <ellipse cx="30" cy="27" rx="5" ry="3.5" fill="${SPOT}" opacity="0.85"/>
      <ellipse cx="40" cy="35" rx="3.5" ry="2.6" fill="${SPOT}" opacity="0.7"/>
      <!-- eye -->
      <circle cx="18" cy="31" r="2.3" fill="${OLIVE_D}"/>
    </g>
  </svg>`
}

async function jpg(name, w, h, svg) {
  await sharp(Buffer.from(svg)).jpeg({ quality: 82, mozjpeg: true }).toFile(resolve(outDir, name))
  console.log('✓', name)
}

await jpg('hero.jpg', 1920, 1280, sceneSvg(1920, 1280))
await jpg('gallery-1.jpg', 800, 1000, sceneSvg(800, 1000))
await jpg('gallery-2.jpg', 1200, 800, sceneSvg(1200, 800))
await jpg('gallery-3.jpg', 800, 1000, sceneSvg(800, 1000))
await jpg('gallery-4.jpg', 900, 900, sceneSvg(900, 900))
await jpg('og.jpg', 1200, 630, ogSvg(1200, 630))

// Favicons
const pub = resolve(root, 'public')
await sharp(Buffer.from(carpSvg(256))).png().toFile(resolve(pub, 'favicon.png'))
await sharp(Buffer.from(carpSvg(180))).png().toFile(resolve(pub, 'apple-touch-icon.png'))
console.log('✓ favicon.png + apple-touch-icon.png (carp)')
