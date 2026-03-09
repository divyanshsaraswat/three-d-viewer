This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Application Architecture & Routes

This project features a fully integrated frontend built on responsive TailwindCSS and GSAP animations, supporting Light/Dark themes contextually.

Core public routes include:
- `/home`: The primary experiential homepage featuring 3D reveals and scroll-driven messaging.
- `/about-us`: Corporate philosophy page highlighting impact metrics and recovery hubs.
- `/products` & `/products/[id]`: A dynamic high-end storefront (Bento Grid layout + Carousel) and individual product configuration views supporting variations and details.
- `/blog` & `/blog/[id]`: The Weinix Journal. Features a frosted glass UI post grid and distraction-free Medium-style individual reading environments tailored for long-form content.

Protected routes include:
- `/editor`: A WebGL interactive canvas for 3D model viewing and editing.
- `/profile`: User profiles and personal configuration.

## 3D Model Optimization Pipeline

This project includes a fully automated 3D model compression pipeline script powered by `@gltf-transform/core` and `obj2gltf`. It applies Draco geometry compression, reduces invisible nodes, merges meshes, and compresses built-in textures directly to the highly-optimized `WebP` mobile format.

**Command:**
`node scripts/optimize-models.js [options]`

**Options:**
- `-i`, `--input <path>`            Path to a specific `.glb`, `.gltf`, or `.obj` file, OR a directory containing models. (Defaults to `public/examples/`)
- `-o`, `--output <path>`           Path to a directory where the optimized `_optimized.glb` files will be saved. (Defaults to the input file's directory)
- `--no-draco`                      Disables Draco geometry compression. Useful if you only want to convert OBJ -> GLB and compress textures without altering vertex data.
- `--weld`                          Merges overlapping/duplicate vertices. Essential for reducing draw calls in poorly exported CAD/BIM models.
- `--max-texture-size <pixels>`     Aggressively downscales textures to a specific square dimension (e.g. `512` or `1024`) to conserve GPU memory. Default is 1024.

**Example Usages:**
1. Process all supported models in the default `public/examples` directory:
   ```bash
   node scripts/optimize-models.js
   ```

2. Process a single remote file and save it in the same folder:
   ```bash
   node scripts/optimize-models.js -i ./assets/raw/hero_scene.glb
   ```

3. Convert an OBJ file with its MTL/textures into a compacted GLB:
   ```bash
   node scripts/optimize-models.js -i ./raw_renders/car.obj -o ./public/models/
   ```

## GLB Texture Swap Utility

A Python utility to replace a named texture inside a `.glb` file with an external image.

**Requires:** `pip install pygltflib`

**Command:**
`python scripts/swap-texture.py <glb_file> <texture_name> <replacement_image>`

**Arguments:**
- `glb_file` — Path to the `.glb` file to modify (file is edited in-place).
- `texture_name` — Name (or substring) of the embedded texture to replace (e.g. `Painting2_baseColor`).
- `replacement_image` — Path to the replacement image (`.png`, `.jpg`, `.webp`, etc.).

**Example:**
```bash
python scripts/swap-texture.py public/examples/scene_optimized.glb Painting2_baseColor "public/examples/weinix poster.png"
```

Running the script with no arguments prints the help text. All embedded textures are listed during execution so you can identify the correct name to target.
