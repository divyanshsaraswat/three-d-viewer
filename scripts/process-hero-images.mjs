import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const sourceDir = 'public/imgs';
const targetDir = 'public/textures/hov/hero';

const heroImages = [
    'HOV02220 texture.jpg',
    'HOV02235 texture.jpg',
    'HOV02252 color.jpg',
    'HOV02265 color.jpg',
    'HOV02271 color.jpg',
    'HOV02312 color.jpg'
];

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

async function processImages() {
    for (const file of heroImages) {
        const sourcePath = path.join(sourceDir, file);
        const targetFile = file.replace(/\s+/g, '_').replace('.jpg', '.webp');
        const targetPath = path.join(targetDir, targetFile);

        console.log(`Processing ${file}...`);
        
        await sharp(sourcePath)
            .resize(1200, 800, { fit: 'inside' })
            .webp({ quality: 80 })
            .toFile(targetPath);
            
        console.log(`Saved to ${targetPath}`);
    }
}

processImages().catch(console.error);
