import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');
const texturesDir = path.join(publicDir, 'textures');

// ── Config ────────────────────────────────────────────────────────────────────
// Textures in subdirs: small thumbnails + 3D use → 512px, q65 (~40-70 KB)
const TEXTURE_SIZE = 512;
const TEXTURE_QUALITY = 65;

// Hero/carousel images in /public root → 1600px wide, q78 (~150-200 KB)
const HERO_WIDTH = 1600;
const HERO_QUALITY = 78;

const HERO_PNGS = [
  'weinix_brick.png',
  'weinix_construction.png',
  'weinix_documentation.png',
  'weinix_exterior.png',
  'weinix_interior.png',
];

const TEXTURE_SUBDIRS = ['brick', 'fabric', 'lava', 'scifi', 'stone', 'wall'];

// ── Helpers ───────────────────────────────────────────────────────────────────
function kb(bytes) {
  return (bytes / 1024).toFixed(1) + ' KB';
}

async function convertToWebP(inputPath, outputPath, options) {
  const before = fs.statSync(inputPath).size;
  await sharp(inputPath)
    .resize(options.width ?? options.size, options.height ?? options.size, {
      fit: 'cover',
      withoutEnlargement: true,
    })
    .webp({ quality: options.quality, effort: 5 })
    .toFile(outputPath);
  const after = fs.statSync(outputPath).size;
  console.log(`  ✓ ${path.basename(inputPath)} → ${path.basename(outputPath)}  (${kb(before)} → ${kb(after)})`);
}

// ── Convert hero/carousel PNGs in /public root ────────────────────────────────
console.log('\n📦 Converting hero images in /public ...');
for (const file of HERO_PNGS) {
  const inputPath = path.join(publicDir, file);
  if (!fs.existsSync(inputPath)) { console.log(`  ⚠ Skipped (not found): ${file}`); continue; }
  const outputPath = path.join(publicDir, file.replace('.png', '.webp'));
  await convertToWebP(inputPath, outputPath, { width: HERO_WIDTH, quality: HERO_QUALITY });
}

// ── Convert textures in each subdirectory ─────────────────────────────────────
for (const subdir of TEXTURE_SUBDIRS) {
  const dir = path.join(texturesDir, subdir);
  if (!fs.existsSync(dir)) { console.log(`\n⚠ Subdir not found: ${subdir}`); continue; }

  const pngs = fs.readdirSync(dir).filter(f => f.endsWith('.png'));
  if (pngs.length === 0) { console.log(`\n⚠ No PNGs in: ${subdir}`); continue; }

  console.log(`\n📁 textures/${subdir} (${pngs.length} files) ...`);
  for (const file of pngs) {
    const inputPath = path.join(dir, file);
    const outputPath = path.join(dir, file.replace('.png', '.webp'));
    await convertToWebP(inputPath, outputPath, { size: TEXTURE_SIZE, quality: TEXTURE_QUALITY });
  }
}

// ── Update packs.json ─────────────────────────────────────────────────────────
console.log('\n📝 Updating packs.json ...');
const packsPath = path.join(texturesDir, 'packs.json');
let packsContent = fs.readFileSync(packsPath, 'utf-8');
packsContent = packsContent.replaceAll('.png"', '.webp"');
fs.writeFileSync(packsPath, packsContent, 'utf-8');
console.log('  ✓ All .png references replaced with .webp in packs.json');

console.log('\n✅ Done! You can now delete the original .png files after verifying.');
