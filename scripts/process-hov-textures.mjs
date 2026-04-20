import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputDir = path.join(__dirname, '..', 'public', 'imgs', 'texture');
const outputDir = path.join(__dirname, '..', 'public', 'textures', 'hov');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Ensure the packs.json file is ready to be updated later
const packsPath = path.join(__dirname, '..', 'public', 'textures', 'packs.json');

const TARGET_SIZE = 512; // Typical thumbnail/texture size used in the application
const KB_TARGET = 60 * 1024; // 60 KB

function kb(bytes) {
  return (bytes / 1024).toFixed(1) + ' KB';
}

async function processTextures() {
  const files = fs.readdirSync(inputDir).filter(f => f.toLowerCase().endsWith('.jpg'));
  
  if (files.length === 0) {
    console.log('No JPG files found in', inputDir);
    return;
  }
  
  console.log(`Processing ${files.length} images...`);
  
  const texturesArr = [];

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const beforeSize = fs.statSync(inputPath).size;
    const outputFileName = file.replace('.jpg', '.webp').replace(/\s+/g, '_');
    const outputPath = path.join(outputDir, outputFileName);
    
    // We try to process it
    try {
      // Trying lossless first with a resize
      let info = await sharp(inputPath)
        .resize(TARGET_SIZE, TARGET_SIZE, {
          fit: 'cover',
          withoutEnlargement: true,
        })
        .webp({ lossless: true, effort: 6 })
        .toFile(outputPath);
        
      let afterSize = fs.statSync(outputPath).size;
      
      // If lossless is still > 60KB, we fall back to lossy near 60KB
      if (afterSize > KB_TARGET) {
        // Attempting lossy with decreasing quality to hit target
        let currentQuality = 80;
        while (afterSize > KB_TARGET && currentQuality > 10) {
          await sharp(inputPath)
            .resize(TARGET_SIZE, TARGET_SIZE, {
              fit: 'cover',
              withoutEnlargement: true,
            })
            .webp({ quality: currentQuality, effort: 6 })
            .toFile(outputPath);
            
          afterSize = fs.statSync(outputPath).size;
          currentQuality -= 10;
        }
      }
      
      console.log(`  ✓ ${file} → ${outputFileName} (${kb(beforeSize)} → ${kb(afterSize)})`);
      
      // Store info for packs.json
      const id = "tex_hov_" + outputFileName.replace('.webp', '').replace(/[^a-zA-Z0-9]/g, '_');
      const title = file.replace('.jpg', '');
      
      texturesArr.push({
          id: id.toLowerCase(),
          title: title,
          thumb: "/textures/hov/" + outputFileName,
          full: "/textures/hov/" + outputFileName
      });
      
    } catch (err) {
      console.error(`  ❌ Failed to process ${file}:`, err.message);
    }
  }
  
  // Write a JSON snippet that we can use to update packs.json
  const packObj = {
    id: "pack_hov_textures",
    title: "HOV Textures",
    description: "High-resolution optimized HOV textures.",
    tags: [
        "HOV",
        "Texture",
        "Material"
    ],
    thumb: texturesArr.length > 0 ? texturesArr[0].thumb : "",
    textures: texturesArr
  };
  
  const snippetPath = path.join(__dirname, 'new_pack_snippet.json');
  fs.writeFileSync(snippetPath, JSON.stringify(packObj, null, 4));
  console.log(`\n✅ Done! Pack snippet written to ${snippetPath}`);
}

processTextures();
