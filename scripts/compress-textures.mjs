const sharp = (await import('sharp')).default;
const { readdir, stat, writeFile } = await import('fs/promises');
const { join, extname } = await import('path');
const { fileURLToPath } = await import('url');

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const TEXTURES_ROOT = join(__dirname, '..', 'public', 'textures');
const TARGET_BYTES = 1 * 1024 * 1024; // 1 MB

async function getAllPngs(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      files.push(...(await getAllPngs(full)));
    } else if (e.isFile() && extname(e.name).toLowerCase() === '.png') {
      files.push(full);
    }
  }
  return files;
}

async function compressPng(filePath) {
  const before = (await stat(filePath)).size;
  const relPath = filePath.replace(/.*public/, '\\public');

  if (before <= TARGET_BYTES) {
    console.log(`  SKIP  ${relPath}  (${(before / 1024).toFixed(0)} KB – already under 1 MB)`);
    return { skipped: true, size: before };
  }

  const meta = await sharp(filePath).metadata();
  const origWidth = meta.width || 2048;

  // Try lossless PNG max compression first
  {
    const buf = await sharp(filePath).png({ compressionLevel: 9, effort: 10 }).toBuffer();
    if (buf.length <= TARGET_BYTES) {
      await writeFile(filePath, buf);
      const after = buf.length;
      console.log(`  LOSSLESS ${relPath}  ${(before/1024).toFixed(0)} KB → ${(after/1024).toFixed(0)} KB`);
      return { before, after };
    }
  }

  // Try lossy PNG at decreasing quality
  for (const q of [75, 65, 55, 45]) {
    const buf = await sharp(filePath).png({ quality: q, compressionLevel: 9, effort: 10 }).toBuffer();
    if (buf.length <= TARGET_BYTES) {
      await writeFile(filePath, buf);
      const after = buf.length;
      console.log(`  Q${q}    ${relPath}  ${(before/1024).toFixed(0)} KB → ${(after/1024).toFixed(0)} KB`);
      return { before, after };
    }
  }

  // Resize to 75% + lossy
  const w75 = Math.round(origWidth * 0.75);
  for (const q of [75, 60, 45]) {
    const buf = await sharp(filePath).resize({ width: w75 }).png({ quality: q, compressionLevel: 9 }).toBuffer();
    if (buf.length <= TARGET_BYTES) {
      await writeFile(filePath, buf);
      const after = buf.length;
      console.log(`  75%+Q${q} ${relPath}  ${(before/1024).toFixed(0)} KB → ${(after/1024).toFixed(0)} KB (resized to ${w75}px)`);
      return { before, after };
    }
  }

  // Resize to 50% + lossy
  const w50 = Math.round(origWidth * 0.5);
  for (const q of [75, 60]) {
    const buf = await sharp(filePath).resize({ width: w50 }).png({ quality: q, compressionLevel: 9 }).toBuffer();
    if (buf.length <= TARGET_BYTES) {
      await writeFile(filePath, buf);
      const after = buf.length;
      console.log(`  50%+Q${q} ${relPath}  ${(before/1024).toFixed(0)} KB → ${(after/1024).toFixed(0)} KB (resized to ${w50}px)`);
      return { before, after };
    }
  }

  console.warn(`  FAIL  ${relPath}  – could not get under 1 MB`);
  return { failed: true, size: before };
}

const files = await getAllPngs(TEXTURES_ROOT);
console.log(`Found ${files.length} PNG files under ${TEXTURES_ROOT}\n`);

let totalBefore = 0, totalAfter = 0, skipped = 0, failed = 0, compressed = 0;

for (const f of files) {
  const res = await compressPng(f);
  if (res.skipped)       { skipped++; totalBefore += res.size; totalAfter += res.size; }
  else if (res.failed)   { failed++;  totalBefore += res.size; totalAfter += res.size; }
  else                   { compressed++; totalBefore += res.before; totalAfter += res.after; }
}

console.log(`\n==================================================`);
console.log(`Done: ${files.length} files | ${compressed} compressed | ${skipped} skipped | ${failed} failed`);
console.log(`Total: ${(totalBefore/1024/1024).toFixed(1)} MB → ${(totalAfter/1024/1024).toFixed(1)} MB saved ${((1 - totalAfter/totalBefore)*100).toFixed(0)}%`);
