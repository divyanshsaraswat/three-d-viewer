# 3D Model Optimization Guide for Mobile & Edge Devices

Based on the performance metrics and recommendations in `transition.md`, processing models for mobile requires an aggressive combination of mesh decimation, texture compression, and lighting shortcuts. 

Below is the step-by-step "Model Howl" guide to preparing your models before loading them into the PlayCanvas engine.

---

## 1. Mesh Decimation & Topology Optimization (Blender)

Mobile GPUs choke on high polygon counts. Before exporting your model, you must drastically reduce its complexity.

**Target Mobile Budgets:**
- **Single Hero Object:** 20k – 60k triangles
- **Full Scene:** < 150k triangles total
- **Background Props:** < 5k triangles each

**Steps:**
1. **Decimate Modifier**: In Blender, select your heavy meshes, add a `Decimate` modifier, set mode to `Collapse`, and reduce the ratio until visual quality is just barely affected.
2. **Remove Unseen Geometry**: Delete inner faces, backfaces, and parts of the model that the user will never see.
3. **Merge Meshes**: Combine separate objects into a single mesh where possible to reduce draw calls. Aim for **under 50 total draw calls** for your entire scene.

---

## 2. Bake Your Lighting (Crucial for Mobile)

Real-time shadows and dynamic lighting (especially PBR calculations) are the biggest frame-rate killers on mobile devices.

**Steps:**
1. Setup your lighting (Sun, Point lights, HDRI) inside Blender.
2. Ensure your model has a proper, non-overlapping UV unwrap.
3. Create a new Image Texture node in the Shader Editor.
4. Set the Render Engine to Cycles.
5. In the Bake settings, set Bake Type to `Combined` (or `Diffuse` if you only want color/shadows without specular highlights).
6. Hit **Bake**. 
7. Once baked, you can load this single texture into a basic, unlit material in PlayCanvas. This completely bypasses real-time lighting math in the engine.

---

## 3. Texture Atlasing & Compression

Large 4K textures and uncompressed PNG/JPEG files will cause mobile browsers to crash due to out-of-memory errors.

**Texture Atlases:**
- If your scene uses 10 different materials with 10 different textures, bake them all down into **one single Texture Atlas**.
- This allows you to use 1 Material for the entire scene, bringing your draw calls down to 1.

**KTX2 / Basis Compression:**
- Never use raw 4K PNGs. Ensure your textures are at most **1K (1024x1024) or 2K (2048x2048)**.
- Use a tool like the `gltf-transform` CLI to compress your textures into the **KTX2 GPU-native format** (using Basis Universal). This stops the GPU from unzipping PNGs into raw memory and directly streams the compressed texture to VRAM.

---

## 4. Export to GLB with DRACO Compression

When you are finally ready to export, use the `.glb` format paired with **Draco Mesh Compression**. 

Draco drastically shrinks the actual file size of the geometry (often by 70-90%), meaning your users will download the 3D scene much faster over 4G/5G connections.

**Steps:**
- In Blender's GLTF Export settings, check `Geometry > Compression > Draco`.
- *Alternatively*, use the command line:  
  `gltf-pipeline -i model.gltf -o model.glb -d`

---

## 5. Implement LODs (Level of Detail)

Instead of forcing the engine to render a 50k triangle model from 100 meters away, use LODs.

- **High Detail (LOD0)**: 100% geometry. Only shown when the user zooms in closely.
- **Mid Detail (LOD1)**: 40-60% geometry. Shown at a moderate distance.
- **Low Detail (LOD2)**: 10-20% geometry. A very cheap proxy mesh shown when viewed from far away.

---

## The Golden Formula for Mobile

If you strictly follow this formula before uploading to your editor, you will achieve 60fps even on 4-year-old Android phones:

`Single GLB (Draco Compressed) + 3 LOD Levels + Baked Lightmaps + KTX2 Textures (1K limit) + < 50 Draw calls`
