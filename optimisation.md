You: 

Optimisation for the three.js model rendering for end devices

ChatGPT: 

Optimizing a **Three.js model for end devices (mobile, low-GPU laptops, tablets)** is basically about controlling 3 things:

> 🧠 Geometry complexity  
> 🎨 Material & shader cost  
> ⚡ Runtime rendering pipeline

I’ll break it down practically — like something you'd apply in a production frontend app.

---

# 1️⃣ Optimize the 3D Model Itself (Before Loading in Three.js)

### 🔹 Reduce Polygon Count

![https://www.zealousxr.com/db-query/assets/images/blog-images/67602fbb9d643-low_poly_vs_high_poly_which_is_right_for_you.webp](https://www.zealousxr.com/db-query/assets/images/blog-images/67602fbb9d643-low_poly_vs_high_poly_which_is_right_for_you.webp)

![https://graphics.rwth-aachen.de/media/paper_images/306/snap.jpg](https://graphics.rwth-aachen.de/media/paper_images/306/snap.jpg)

![https://blenderartists.org/uploads/default/optimized/3X/5/a/5ad50b5f2dc83609f58d16f9848c1eb12ed42448_2_1024x554.jpg](https://blenderartists.org/uploads/default/optimized/3X/5/a/5ad50b5f2dc83609f58d16f9848c1eb12ed42448_2_1024x554.jpg)

4

High poly = GPU death on mobile.

**Do this:**

-   Use Blender → *Decimate Modifier*
    
-   Remove hidden internal faces
    
-   Merge duplicate vertices
    
-   Avoid unnecessary subdivisions
    

👉 Target:

-   Mobile: < 50k triangles per visible model
    
-   Desktop: < 150k per major object
    

---

### 🔹 Use GLTF / GLB (Mandatory)

Always export as:

```php
.glb (binary glTF)
```

Why?

-   Small file size
    
-   GPU friendly
    
-   Native Three.js support
    
-   Supports compression
    

---

### 🔹 Use Draco Compression

```js
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
loader.setDRACOLoader(dracoLoader);
```

Can reduce model size by **70–90%**.

---

# 2️⃣ Texture Optimization (Biggest Real-World Win)

### 🔹 Reduce Texture Size

![https://blenderartists.org/uploads/default/original/4X/1/5/e/15e97e1ad935a5cea9a3f06e9e2ef9aeddd05f97.jpeg](https://blenderartists.org/uploads/default/original/4X/1/5/e/15e97e1ad935a5cea9a3f06e9e2ef9aeddd05f97.jpeg)

![https://imagedelivery.net/S4svCqSolndHzMne84t1OQ/A23D-PBR-Maps/format%3Dauto](https://images.openai.com/static-rsc-1/AjxzGLhDj9p9QEu-3rXFCLqXZ5gxXQOsD05mr0OXNOqaqXiPx8Q89CTghyap_OStCZ_6gvfSnKb9cPoVcVOE4HxQFl7dYefDxmTIeEYs6uXOEfkogVtj6EO-XwnwWLU-4-jzLuYaNqhDbJPQp2o4Jg)

![https://cms-assets.tutsplus.com/cdn-cgi/image/width%3D850/uploads/users/849/posts/26783/image/02b.jpg](https://cms-assets.tutsplus.com/cdn-cgi/image/width%3D850/uploads/users/849/posts/26783/image/02b.jpg)

4

DO NOT use:

-   4K textures on mobile
    
-   Multiple 2K maps per object
    

Use:

-   512px or 1024px max
    
-   Texture atlas (combine maps into one)
    
-   Remove unused maps
    

---

### 🔹 Avoid Heavy PBR If Not Needed

Instead of:

```js
MeshStandardMaterial
```

Use:

```js
MeshLambertMaterial
```

Or even:

```js
MeshBasicMaterial
```

PBR = physically correct lighting = expensive.

---

# 3️⃣ Rendering Pipeline Optimization

---

## 🔹 Limit Device Pixel Ratio

Mobile phones often have DPR = 3.

That triples GPU load.

```js
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
```

Even 1.5 is fine for mobile apps.

---

## 🔹 Enable Frustum Culling (default true)

Make sure:

```js
mesh.frustumCulled = true;
```

Objects outside camera view won’t render.

---

## 🔹 Use LOD (Level of Detail)

![https://www.cgspectrum.com/hs-fs/hubfs/different-LODs-3d-modeling.jpg?height=627&name=different-LODs-3d-modeling.jpg&width=900](https://www.cgspectrum.com/hs-fs/hubfs/different-LODs-3d-modeling.jpg?height=627&name=different-LODs-3d-modeling.jpg&width=900)

![https://www.researchgate.net/publication/258499597/figure/fig3/AS%3A392554005712934%401470603576781/Basic-concept-of-LoD-An-object-is-simplified-by-different-representations-through.png](https://www.researchgate.net/publication/258499597/figure/fig3/AS%3A392554005712934%401470603576781/Basic-concept-of-LoD-An-object-is-simplified-by-different-representations-through.png)

![https://canada1.discourse-cdn.com/flex035/uploads/threejs/optimized/2X/0/047be49c642e1bb351c70220248f90cbd13920cb_2_690x288.jpeg](https://canada1.discourse-cdn.com/flex035/uploads/threejs/optimized/2X/0/047be49c642e1bb351c70220248f90cbd13920cb_2_690x288.jpeg)

4

```js
const lod = new THREE.LOD();
lod.addLevel(highDetailMesh, 0);
lod.addLevel(mediumMesh, 50);
lod.addLevel(lowMesh, 100);
```

Far objects → fewer polygons rendered.

Huge performance gain.

---

## 🔹 Disable Shadows If Possible

Shadows are extremely expensive.

Instead of:

```js
renderer.shadowMap.enabled = true;
```

Try:

-   Fake baked shadows in texture
    
-   Use lightmap
    

---

# 4️⃣ Scene Optimization

---

### 🔹 Reduce Draw Calls

Every separate mesh = draw call.

Bad:

```js
1000 small meshes
```

Better:

```js
Use InstancedMesh
```

```js
const mesh = new THREE.InstancedMesh(geometry, material, count);
```

Massive improvement for repeated objects.

---

### 🔹 Merge Static Geometry

```js
BufferGeometryUtils.mergeGeometries()
```

Combine static meshes into one.

---

# 5️⃣ Runtime Smart Optimizations

---

### 🔹 Pause Rendering When Not Needed

```js
renderer.setAnimationLoop(null);
```

Or render only when camera moves.

Huge battery saver for mobile.

---

### 🔹 Use requestIdleCallback for heavy tasks

Load models progressively.

---

# 6️⃣ Postprocessing (Avoid on Mobile)

Avoid:

-   SSAO
    
-   Bloom
    
-   Depth of field
    
-   Unreal bloom pass
    

Each = extra render pass.

Mobile = keep single render pass.

---

# 7️⃣ Profiling Tools (Important)

Use:

-   Chrome → Performance tab
    
-   Chrome → WebGL Insights
    
-   Stats.js
    

```js
import Stats from 'three/examples/jsm/libs/stats.module.js';
```

Watch:

-   FPS
    
-   Draw calls
    
-   Triangles
    
-   Memory
    

---

# 8️⃣ Advanced: Adaptive Quality System (Pro Level)

You can auto-scale quality:

```js
if (fps < 30) {
   renderer.setPixelRatio(1);
   disableShadows();
}
```

Dynamic optimization = professional UX.

---

# 🔥 Real-World Mobile Target Metrics

| Metric | Good |
| --- | --- |
| FPS | 30–60 |
| Draw Calls | < 100 |
| Triangles | < 100k |
| Texture memory | < 50MB |
| Render passes | 1 |

---

# 🧠 If You're Building Something Like:

-   Interactive architectural table
    
-   3D map viewer
    
-   Product configurator
    

Tell me what type of scene you’re building and I’ll give you **architecture-level optimization strategy** instead of generic advice.

Because optimization changes a lot depending on:

-   Static vs dynamic
    
-   Indoor vs outdoor
    
-   Many repeated objects vs hero object
    
-   Real-time lighting vs baked
    

What are you building?

You: 

Can we do it according to the screen size of the device

ChatGPT: 

Yes ✅ — and not just screen size… you should optimize based on:

1.  **Screen resolution**
    
2.  **Device pixel ratio (DPR)**
    
3.  **GPU capability**
    
4.  **Performance (real-time FPS)**
    

Screen size alone is not enough — but it’s a good starting signal.

Let’s break it properly.

---

# 🎯 1️⃣ Optimizing Based on Screen Size (Basic Level)

You can detect screen width:

```js
const width = window.innerWidth;

if (width < 768) {
  // Mobile
} else if (width < 1200) {
  // Tablet
} else {
  // Desktop
}
```

Then reduce:

-   Texture resolution
    
-   Shadow quality
    
-   Model LOD
    
-   Postprocessing
    

---

# 🎯 2️⃣ The Real Thing: Device Pixel Ratio (Most Important)

A 6-inch phone may render at **1440px × 3200px** with DPR = 3.

That’s ~3x GPU workload.

### Always clamp DPR:

```js
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
```

For mobile-heavy apps:

```js
renderer.setPixelRatio(1.5);
```

💡 Huge performance improvement instantly.

---

# 🎯 3️⃣ Adaptive Resolution Scaling (Pro Method)

Instead of guessing by screen size…

Measure performance dynamically.

```js
let fps = 60;

function checkPerformance() {
  if (fps < 30) {
    renderer.setPixelRatio(1);
  }
}
```

You can auto-adjust:

-   Pixel ratio
    
-   Shadow quality
    
-   LOD distance
    
-   Post effects
    

This is how games do it.

---

# 🎯 4️⃣ LOD Based on Screen + Distance

![https://www.cgspectrum.com/hs-fs/hubfs/different-LODs-3d-modeling.jpg?height=627&name=different-LODs-3d-modeling.jpg&width=900](https://www.cgspectrum.com/hs-fs/hubfs/different-LODs-3d-modeling.jpg?height=627&name=different-LODs-3d-modeling.jpg&width=900)

![https://canada1.discourse-cdn.com/flex035/uploads/threejs/optimized/2X/0/047be49c642e1bb351c70220248f90cbd13920cb_2_690x288.jpeg](https://canada1.discourse-cdn.com/flex035/uploads/threejs/optimized/2X/0/047be49c642e1bb351c70220248f90cbd13920cb_2_690x288.jpeg)

![https://i1.wp.com/www.trainzportal.com/images/uploads/blog/TS18/lod_transitions_0.jpg](https://i1.wp.com/www.trainzportal.com/images/uploads/blog/TS18/lod_transitions_0.jpg)

4

Even on a large screen:

-   If object occupies only 100px → use low poly
    
-   If full screen → high poly
    

Example:

```js
const lod = new THREE.LOD();
lod.addLevel(highPoly, 0);
lod.addLevel(mediumPoly, 50);
lod.addLevel(lowPoly, 120);
```

This is better than screen-size-only logic.

---

# 🎯 5️⃣ Responsive Texture Strategy

Load different texture sizes:

```bash
/textures/
   wood_512.jpg
   wood_1024.jpg
   wood_2048.jpg
```

Then:

```js
const isMobile = window.innerWidth < 768;
const texturePath = isMobile 
  ? 'wood_512.jpg'
  : 'wood_1024.jpg';
```

Much better memory control.

---

# 🎯 6️⃣ Resize Renderer Properly

Always update on resize:

```js
function onResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
}
```

---

# ⚠️ Important Reality Check

Screen size ≠ performance.

Example:

-   6-inch budget phone → weak GPU
    
-   6-inch flagship phone → strong GPU
    
-   Small laptop window → powerful GPU
    

So production systems use:

```js
renderer.capabilities
```

To detect:

-   max textures
    
-   precision
    
-   WebGL version
    

---

# 🔥 Best Practice Strategy (What Professionals Do)

1.  Clamp DPR
    
2.  Use LOD
    
3.  Detect mobile via width
    
4.  Disable heavy postprocessing on small screens
    
5.  Use adaptive scaling based on FPS
    

---

# 🧠 If You’re Building That Interactive 3D Map / Architecture Table

Then the ideal system is:

-   Static baked lighting
    
-   LOD models
    
-   Instanced meshes
    
-   Adaptive pixel ratio
    
-   Shadow OFF for mobile
    
-   Progressive loading
    

If you tell me your exact use case (static viewer? game-like? product showcase?), I’ll design a clean performance architecture for it.