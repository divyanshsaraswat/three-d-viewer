// scripts/optimize-models.js
const fs = require('fs');
const path = require('path');
const obj2gltf = require('obj2gltf');

// Default target
let inputTarget = path.resolve(__dirname, '../public/examples');
let outputDir = null; // Defaults to the same directory as the input
let useDraco = true;

// Parse CLI Arguments
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
    if (args[i] === '--no-draco') {
        useDraco = false;
    } else if (args[i] === '-i' || args[i] === '--input') {
        let pathParts = [];
        i++;
        while (i < args.length && !args[i].startsWith('-')) {
            pathParts.push(args[i]);
            i++;
        }
        i--; // step back so the outer loop doesn't skip the next flag
        inputTarget = path.resolve(process.cwd(), pathParts.join(' '));
    } else if (args[i] === '-o' || args[i] === '--output') {
        let pathParts = [];
        i++;
        while (i < args.length && !args[i].startsWith('-')) {
            pathParts.push(args[i]);
            i++;
        }
        i--;
        outputDir = path.resolve(process.cwd(), pathParts.join(' '));
    }
}

(async () => {
    try {
        console.log('🚀 Starting Model Optimization Pipeline...\n');
        if (!useDraco) console.log('⚠️  Draco compression is DISABLED.');
        
        // Dynamic imports for ESM ONLY packages
        const { NodeIO } = await import('@gltf-transform/core');
        const { ALL_EXTENSIONS } = await import('@gltf-transform/extensions');
        const { draco, prune, dedup, resample, textureCompress } = await import('@gltf-transform/functions');
        const draco3d = await import('draco3dgltf');
        const sharp = (await import('sharp')).default;

        // Initialize glTF-Transform's IO handler with all standard extensions
        const io = new NodeIO()
            .registerExtensions(ALL_EXTENSIONS)
            // Register Draco compression dependency
            .registerDependencies({
                'draco3d.decoder': await draco3d.default.createDecoderModule(),
                'draco3d.encoder': await draco3d.default.createEncoderModule(),
            });

        // Determine files to process
        const filesToProcess = [];
        const stat = fs.statSync(inputTarget);
        if (stat.isDirectory()) {
            const files = fs.readdirSync(inputTarget);
            for (const file of files) {
                const ext = path.extname(file).toLowerCase();
                if ((ext === '.glb' || ext === '.gltf' || ext === '.obj') && !file.includes('_optimized') && !file.includes('_compressed')) {
                    filesToProcess.push(path.join(inputTarget, file));
                }
            }
        } else {
            filesToProcess.push(inputTarget);
        }

        if (filesToProcess.length === 0) {
            console.log('No eligible models (.glb, .gltf, .obj) found to process.');
            return;
        }

        for (const inputPath of filesToProcess) {
            const ext = path.extname(inputPath).toLowerCase();
            const basename = path.basename(inputPath, ext);
            const targetDir = outputDir || path.dirname(inputPath);
            const outputPath = path.join(targetDir, `${basename}_optimized.glb`);
            
            console.log(`\n📦 Processing: ${path.basename(inputPath)}`);
            console.log('-----------------------------------');
            
            const originalSize = fs.statSync(inputPath).size / (1024 * 1024);
            console.log(`➡️  Original Size: ${originalSize.toFixed(2)} MB`);

            let document;

            // Step 1: Read/Compile the Source Model
            if (ext === '.obj') {
                console.log(`⚙️ Converting OBJ layout -> GLB binary buffer...`);
                // Create a glTF Binary buffer directly from the OBJ file with embedded textures
                const glbOptions = { binary: true };
                const glbBuffer = await obj2gltf(inputPath, glbOptions);
                // Load into the glTF Transform Document model
                document = await io.readBinary(glbBuffer);
            } else {
                document = await io.read(inputPath);
            }

            // Step 2: Build Transform Pipeline
            const transforms = [
                prune(),
                dedup(),
                resample(),
                // Compress Textures to mobile-friendly formats
                textureCompress({
                    encoder: sharp,
                    targetFormat: 'webp',
                    resize: [1024, 1024],
                })
            ];

            // Conditionally add Draco
            if (useDraco) {
                transforms.push(
                    draco({
                        method: 'edgebreaker',
                        quantizePosition: 14,
                        quantizeTexcoord: 10,
                        quantizeColor: 8,
                        quantizeNormal: 8,
                    })
                );
            }

            // Step 3: Apply Engine Optimizations Sequentially
            await document.transform(...transforms);

            // Save the optimized file
            await io.write(outputPath, document);

            const newSize = fs.statSync(outputPath).size / (1024 * 1024);
            console.log(`✅ Optimized Size: ${newSize.toFixed(2)} MB`);
            console.log(`📉 Reduction: ${((1 - (newSize / originalSize)) * 100).toFixed(1)}%\n`);
        }

        console.log('🎉 Optimization Pipeline Complete!');
    } catch (error) {
        console.error('\n❌ PIPELINE FAILED CRITICALLY:');
        console.error(error);
        process.exit(1);
    }
})();
