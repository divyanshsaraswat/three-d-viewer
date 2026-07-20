# Building Weinix: A Deep-Dive into Designing a Premium 3D-First Sustainable Materials Platform

There's a strange problem at the intersection of construction and commerce. The products — recycled-textile bricks, acoustic panels, sustainable tiles — are genuinely beautiful. They deserve to be sold the way a luxury watch is sold, or the way a high-end car configurator lets you spin and customise before you commit. But most building-material websites look like they haven't changed since 2009. A PDF catalogue, a contact form, maybe a blurry JPEG of a factory floor.

Weinix was built to fix that. This post is the full story — the product decisions, the user psychology that shaped the UI, the design language, and every technical layer underneath, from the WebGL editor down to the Redis-backed session store.

---

## The User We're Designing For

Before a single line of code, you need to know who is going to sit in front of this thing.

Weinix serves two audiences simultaneously. The first is **B2B buyers** — architects, interior designers, and procurement leads at mid-to-large construction firms. These people are not browsing casually. They arrive with a brief in hand. They need to evaluate whether a material will work for a specific project, which means they need high-fidelity visuals, technical specifications (dimensions, weight, finish, sustainability ratings), and a fast, frictionless path to inquiry. They are not emotionally driven; they are deadline-driven. Trust signals matter enormously: does this company look credible enough to stake a client's project on?

The second is **D2C buyers** — homeowners and small contractors who found Weinix through Instagram or a search for "sustainable wall panels India." This group is emotionally driven. They're buying into an aesthetic, a philosophy. The phrase "recycled textile" is a story they want to tell their guests. They need to be seduced by the product before they think about logistics.

One platform, two completely different psychological modes. The design had to do something difficult: feel premium and trustworthy enough for the procurement officer, while still being warm and tactile enough to close the individual buyer. That tension is the root of almost every design decision you'll see below.

---

## Design Philosophy: Why 3D, Why Frosted Glass, Why This Theme

### The 3D Imperative

A brick is a three-dimensional object with a backlit glow mode and a texture that changes entirely depending on the variant. A flat product photo does roughly 40% of the selling work. The other 60% is the feeling of *handling* the material — turning it over, seeing how light catches it.

The `/editor` route is a WebGL canvas built on Three.js that lets users orbit the model freely, inspect it at any angle, and swap textures in real time. This isn't a novelty feature. It's the core of the purchase decision for a B2B buyer who needs to present a material board to a client. They can literally screenshot the configurator and drop it in a presentation.

The challenge, as you'll see in the technical section, is making a GLB file with 89 textures and a 250 MB raw size actually perform on a mid-range Android device. That optimisation journey is documented in detail below.

### Frosted Glass and the Depth Language

The frosted glass (`backdrop-filter: blur`) panels throughout the UI weren't a trend choice — they were the answer to a specific problem. The hero sections use full-viewport background video and 3D reveals. If you put flat opaque cards over that, you kill the dimensional depth you've spent GPU cycles creating. Frosted glass preserves the visual layer beneath. The user's eye registers depth without consciously processing it. The result is a UI that feels *embedded in* the brand rather than floating in front of it.

The blog grid (`/blog`) uses this language extensively. Individual posts render inside frosted-glass tiles against the product-texture backgrounds. It reads as editorial, not corporate — which matters for the D2C buyer who arrived from a social touchpoint.

### Light and Dark: Contextual, Not Cosmetic

Most dark modes are implemented as a toggle — same layout, inverted palette. Weinix's themes are contextual. Certain routes default dark (the 3D editor, the immersive product detail page) and others default light (the blog, the about page). The logic follows user intent: when someone is inspecting a 3D model, they're in "studio" mode. Ambient light is controlled. Dark backgrounds make the product pop. When they're reading a 500-word product story or a journal post, they're in "reading" mode. A white background is more readable for long-form content and signals editorial credibility.

The technical implementation uses TailwindCSS's `dark:` variant plus a React context that persists the preference to localStorage, with SSR-safe defaults managed via Next.js `<script>` injection in `_document` to prevent flash.

### Typography and Motion

GSAP handles all scroll-driven animations — the 3D model reveal on the homepage, the staggered Bento Grid entrance on `/products`, the count-up on impact metrics in `/about-us`. The principle is that motion should *reveal* information, not decorate it. Every GSAP tween exists because the thing it animates would be less meaningful if it appeared instantaneously.

The homepage is the highest-stakes page. It needs to answer three questions in the first 10 seconds: *What is this? Is it for me? Should I trust it?* The scroll-driven 3D reveal handles the first. The tagline handles the second. The impact metrics — tonnes of textile waste diverted, recovery hubs, projects completed — handle the third.

---

## Frontend Architecture

The frontend is a **Next.js App Router** application with the following route structure:

| Route | Purpose | Key Feature |
|---|---|---|
| `/home` | Primary landing experience | Scroll-driven 3D reveal, GSAP animations |
| `/about-us` | Corporate philosophy | Impact metrics, recovery hub map |
| `/products` | Product catalogue | Bento Grid layout, carousel |
| `/products/[id]` | Product configurator | Variant picker, image gallery |
| `/blog` | Weinix Journal | Frosted glass grid, tag filtering |
| `/blog/[id]` | Individual post | Distraction-free reading environment |
| `/editor` | 3D canvas (protected) | WebGL, orbit controls, texture swap |
| `/profile` | User portal (protected) | Personal configuration, ticket history |

**TailwindCSS** drives the styling. The decision to stay in Tailwind rather than CSS Modules or styled-components is about velocity — the Bento Grid on the products page is ~40 utility classes with a single `grid-cols` breakpoint change. The same result in a component library would have taken 3× longer and introduced an upstream dependency.

**GSAP (GreenSock)** is the animation layer. `ScrollTrigger` pins sections and scrubs 3D model rotations against scroll position. The entrance animations use a shared `animateIn` utility that fires on `IntersectionObserver` entry, keeping the initial page load clean.

Fonts load via `next/font` (Geist), which eliminates layout shift. Images go through `next/image` for automatic WebP conversion and responsive sizing.

---

## The 3D Rendering Pipeline

This is where the project gets interesting — and where it almost died several times.

### The Starting Problem

The raw architectural model: **3 million triangles, 101 materials, 89 textures, 250 MB download.** On a mid-range Android device, this loads in 45 seconds, renders at 8–12 FPS, and triggers thermal throttling inside 90 seconds. Unusable.

The target for a smooth mobile walkthrough experience: **150k–300k triangles, 10–20 materials, 15 compressed textures, <30 MB, >45 FPS sustained.**

Getting from 250 MB / 3M tris to 42 MB / 190k tris is a pipeline problem, not a coding problem.

### The Optimisation Pipeline (`scripts/optimize-models.js`)

A Node.js script powered by `@gltf-transform/core` automates the entire compression chain:

1. **Draco geometry compression** — reduces mesh file size by 70–90% by re-encoding vertex positions as integer residuals instead of 32-bit floats. The GPU decompresses at load time, essentially for free.
2. **Invisible node removal** — strips any mesh that has zero contribution to the rendered output.
3. **Mesh merging** — combines geometry that shares a material into a single draw call. This is the single biggest FPS improvement: going from 101 draw calls to under 50 nearly doubles frame rate on mobile.
4. **WebP texture compression** — embeds textures at 1024px max, encoded as WebP. This format is GPU-friendly, has near-universal mobile support, and cuts texture memory by 60–80% compared to raw PNG.

The script accepts an `--input` path (single file or directory), `--output`, a `--max-texture-size` cap, and a `--weld` flag that merges duplicate vertices — critical for CAD-exported models where every surface edge is duplicated.

Typical result: a 250 MB raw export becomes a 35–45 MB optimised GLB that loads in under 4 seconds on a 4G connection and sustains 50+ FPS on a 2022 mid-range Android phone.

### Texture Swapping (`scripts/swap-texture.py`)

Products come in multiple design variants — the same geometry, different surface. A Python utility (`pygltflib`) handles replacing a named embedded texture inside a `.glb` without re-exporting from Blender. This is the pipeline step that makes the `/editor` configurator viable: you don't need to maintain separate model files per variant. One base GLB, n texture variants, one swap script.

```bash
python scripts/swap-texture.py scene_optimized.glb Painting2_baseColor "weinix poster.png"
```

### The Runtime: Three.js + OrbitControls

The editor canvas uses Three.js with `OrbitControls` (damping enabled, pan disabled). The decision to stay with Three.js rather than migrating to PlayCanvas was deliberate after extensive evaluation: for a *product configurator* (as opposed to an architectural walkthrough), Three.js gives sufficient control with less engine overhead. The orbit model matches the mental model of a user inspecting a physical sample.

Key runtime optimisations:
- `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` — hard caps mobile GPU load
- `mesh.frustumCulled = true` — skips off-camera geometry
- Textures are preloaded on mount; swapping is a reference swap (`material.map = preloaded.wood; material.needsUpdate = true`), never a new network request
- Render loop pauses (`renderer.setAnimationLoop(null)`) when the canvas is out of viewport, cutting battery drain by ~60%

---

## Backend Architecture

The backend is a **Node.js / Express** API server with a MongoDB (Mongoose) database and a Redis cache for session management.

### Dual-Audience Design

The API serves two fundamentally different audiences:

- **Admin CRM** (`/api/v1/admin/*`) — used by the internal team to manage products, customers, tickets, and audit logs. Every write action is captured in a 90-day TTL audit trail with full before/after snapshots.
- **Customer Portal** (`/api/v1/portal/*`) — the self-service interface for customers. Passwordless authentication via OTP sent to WhatsApp. Customers can create support tickets, track order inquiries, and manage their profile.

### Authentication

Admin authentication uses JWT access tokens (30-day TTL) paired with JWT refresh tokens (60-day TTL), with sessions stored in Redis. A session record contains IP, user agent, and last-activity timestamp — this powers the "view active sessions" and "logout all devices" features. After 5 failed login attempts, the account locks for 2 hours.

Customer authentication is fully passwordless. A phone number triggers a 6-digit OTP via WhatsApp (through the HSNS microservice). The portal then issues its own JWT pair, independent of the admin session system. This keeps the auth surfaces completely separated — a compromised customer token cannot be used against admin routes.

### Product Schema

The product model is the most complex in the system, designed to handle:
- **Multiple variants per product** — each variant has its own SKU, design, material, pricing (per unit, bulk discount tiers), dimensions, sustainability ratings, and two image sets (with-backlit / without-backlit)
- **Analytics counters** — views, clicks, inquiries tracked per product
- **SEO metadata** — per-product meta title, description, and keyword sets
- **Brand narrative fields** — `story` and `stance` are first-class fields, not footnotes, because the brand story is a core sales asset for sustainability-driven buyers

### Ticketing System

The ticketing model is a full threaded conversation system. Tickets have a state machine: `open → in_progress → awaiting_customer ↔ awaiting_staff → resolved → closed`. Status transitions happen automatically based on who added the last message. An admin reply moves a ticket to `awaiting_customer`; a customer reply moves it to `awaiting_staff`. This eliminates the common CRM failure mode where tickets sit in limbo because nobody updated the status manually.

Tickets also carry a `ragHandled` flag and `requiresHumanIntervention` — forward-compatible with an AI triage layer that can auto-route simple inquiries before a human sees them.

### Notifications

Every significant event triggers a WhatsApp and/or email notification via the HSNS microservice. Login alerts, OTP delivery, ticket creation confirmation, resolution notifications — all automated. The notification matrix is comprehensive: 14 distinct events, each with a defined channel combination. This is not a nice-to-have; for a B2B sales platform in India where WhatsApp has near-universal penetration, WhatsApp is the primary trust channel.

---

## SEO and Discoverability

Weinix is Google-indexed but early-stage in authority. The SEO strategy is structured for long-term compounding:

- **Sitemap** submitted to Google Search Console
- **Per-product SEO fields** — meta title, meta description, and keyword arrays are first-class schema fields, not afterthoughts
- **Structured data** — Organization and Product schema markup for rich results
- **Clean URL architecture** — `/products/[slug]`, `/blog/[id]` — human-readable, crawlable
- **Internal linking** — navigation and footer explicitly link to primary routes, which is the primary signal Google uses for sitelink elevation

Sitelinks (the sub-page links that appear under the main result) are a Google-decided feature that requires domain authority, consistent internal linking, and branded search volume. The current milestone is getting enough search signal on "weinix + [category]" queries to trigger sitelink generation.

The `/blog` exists partly for this reason. Original editorial content — material case studies, sustainability engineering guides, project showcases — creates long-tail search surface that product pages can't provide. The Weinix Journal is the slow-burn SEO investment.

---

## What This Platform Is, Really

At its core, Weinix is a bet that the way you sell a sustainable product is inseparable from the experience of discovering it. A buyer who orbits a 3D model of a recycled-textile brick, swaps between five design variants, and reads a 300-word brand story about the recovery hub it came from — that buyer has formed a relationship with the material before they've placed an order.

The technical stack — Next.js, Three.js, Node.js, Redis, MongoDB, GSAP — is chosen to serve that experience. Nothing in this stack is there because it was trendy. Every choice traces back to a user behaviour we needed to enable: fast 3D on mobile, real-time texture swapping, frictionless WhatsApp authentication, distraction-free reading, audit-safe CRM operations.

The platform is live at [weinix.com](https://weinix.com). The 3D editor is accessible at `/editor` for verified users. The full API is documented in `BackendReadme.md`.

The building materials industry is one of the largest contributors to global material waste. It's also one of the most underdesigned sectors from a digital commerce perspective. There is a lot of space between "a PDF catalogue on a 2009 website" and what Weinix is trying to be. We're building toward the far end of that space.
