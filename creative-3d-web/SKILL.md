---
name: creative-3d-web
description: Master workflow and engineering guide for building high-end, Awwwards-style 3D WebGL websites (automotive showcases like Porsche/supercars, luxury products, and scrollytelling experiences) completely from scratch using Three.js, GLTF, PBR shaders, audio, camera choreography, and smooth scrolling.
---

# Creative 3D WebGL Web Experiences

This skill provides the end-to-end architecture, deterministic engineering protocol, PBR material recipes, camera choreography engines, and production templates for building award-winning, interactive 3D WebGL websites completely from scratch — without needing external reference sites or reverse-engineering.

---

## 1. Autonomous 3D Website Generation Protocol (Agent Execution Workflow)

When tasked with building a 3D website (e.g. automotive showcase, luxury hardware, cyberpunk experience, or interactive portfolio), execute these steps in order:

```
┌────────────────────────────────────────────────────────────────────────┐
│  Phase 1: Concept & Thematic Foundation                                │
│  - Define brand identity, high-contrast palette, typography, layout    │
├────────────────────────────────────────────────────────────────────────┤
│  Phase 2: 3D Asset Procurement & Surgical Hygiene                      │
│  - Retrieve/prepare GLB, prune non-object nodes, center at y = 0       │
├────────────────────────────────────────────────────────────────────────┤
│  Phase 3: Material Synthesis & Studio Environment                      │
│  - Apply MeshPhysicalMaterial (Clearcoat, Metalness, Transmission)     │
│  - Setup HDR environment map & baked ambient contact shadow plane      │
├────────────────────────────────────────────────────────────────────────┤
│  Phase 4: Cinematic Camera Choreography & Scrollytelling               │
│  - Define 5-6 camera waypoints tied to scroll percentage (0.0 to 1.0)  │
│  - Apply cubic spline / smooth LERP interpolation & mouse parallax     │
├────────────────────────────────────────────────────────────────────────┤
│  Phase 5: Sensory Integration (Audio, Video, 3D Hotspots)              │
│  - Add engine/ambient audio with floating mute/unmute widget           │
│  - Integrate background video & project 3D world coords to 2D DOM      │
├────────────────────────────────────────────────────────────────────────┤
│  Phase 6: Production Hardening & Deployment                            │
│  - Configure MIME types & CORS in netlify.toml / vercel.json           │
│  - Validate in browser (zero 404s, 60 FPS, smooth audio/video)         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Architecture: The Two-Layer Paradigm

All high-performance 3D websites separate rendering into two synchronized layers:

```
┌────────────────────────────────────────────────────────┐
│  DOM UI Overlay  (z-index: 10, pointer-events: none)   │
│  - Interactive elements have pointer-events: auto      │
│  - Glassmorphic panels, typography, headers, footers   │
├────────────────────────────────────────────────────────┤
│  Fixed 3D Canvas (z-index: 0, position: fixed)         │
│  - Pinned full-viewport WebGLRenderer                  │
│  - Three.js Scene, Camera, Lights, Models, Shaders     │
└────────────────────────────────────────────────────────┘
```

### Essential CSS Architecture
```css
/* Fixed 3D WebGL Canvas Layer */
#webgl-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
}

/* Scrollable Content Container */
.content-wrapper {
  position: relative;
  z-index: 10;
  pointer-events: none;
}

/* Re-enable interaction on buttons, links, and widgets */
button,
a,
input,
.interactive-widget {
  pointer-events: auto;
}
```

---

## 3. 3D Model Sourcing & Geometry Hygiene

### 1. Removing Unwanted Internal Collision / Floor Meshes
Many 3D models from Blender or Sketchfab contain hidden collision boxes, floor slabs, or generic shadow boxes under the chassis (often named `underbody`, `ground_plane`, or `cube_0`). These create unsightly black blocks underneath the model. Always inspect and prune:
```javascript
model.traverse((child) => {
  if (child.isMesh) {
    const name = child.name.toLowerCase();
    // Prune underbody, collision, or untextured ground slabs
    if (name.includes('underbody') || name.includes('ground') || name.includes('collision')) {
      child.visible = false;
    }
  }
});
```

### 2. Auto-Centering and Ground Alignment
Compute the bounding box and re-center the model so its base sits precisely at `y = 0`:
```javascript
const box = new THREE.Box3().setFromObject(model);
const center = box.getCenter(new THREE.Vector3());

model.position.x = -center.x;
model.position.y = -box.min.y; // Bases object precisely at ground level
model.position.z = -center.z;
```

---

## 4. Studio Lighting & PBR Material Recipes

### Studio HDR Lighting Architecture
Use an HDR environment map for ultra-realistic reflections and diffuse illumination:
```javascript
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

new RGBELoader().load('/assets/studio-small-08-2k.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
});
```

### Automotive Clearcoat Lacquer Paint
```javascript
const carPaintMaterial = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color(0xd5001c),       // Signature Guards Red
  metalness: 0.85,
  roughness: 0.18,
  clearcoat: 1.0,                         // Automotive clearcoat lacquer
  clearcoatRoughness: 0.05,
  reflectivity: 1.0,
  envMapIntensity: 1.8,
});
```

### Baked Ground Contact Shadow Plane
Ground shadows ground the object in reality. Generate a procedural radial gradient canvas texture:
```javascript
function createContactShadow(width = 6.0, height = 3.5) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createRadialGradient(256, 256, 30, 256, 256, 240);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.82)');
  gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.35)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);

  const shadowTexture = new THREE.CanvasTexture(canvas);
  const shadowMaterial = new THREE.MeshBasicMaterial({
    map: shadowTexture,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
  });

  const plane = new THREE.Mesh(new THREE.PlaneGeometry(width, height), shadowMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = 0.005; // Slightly above zero to prevent z-fighting
  return plane;
}
```

---

## 5. Camera Choreography & Scrollytelling Engine

Connect scroll progress directly to 3D camera transforms using smooth cubic interpolation and mouse parallax:

```javascript
class ScrollyCameraRig {
  constructor(camera, keyframes) {
    this.camera = camera;
    this.keyframes = keyframes;
    this.currentPos = new THREE.Vector3().copy(keyframes[0].pos);
    this.currentTarget = new THREE.Vector3().copy(keyframes[0].target);
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  }

  update(scrollProgress) {
    // 1. Locate active keyframe segment
    let i = 0;
    while (i < this.keyframes.length - 1 && scrollProgress > this.keyframes[i + 1].t) {
      i++;
    }
    const kfA = this.keyframes[i];
    const kfB = this.keyframes[Math.min(i + 1, this.keyframes.length - 1)];

    const span = kfB.t - kfA.t || 1;
    const localT = THREE.MathUtils.clamp((scrollProgress - kfA.t) / span, 0, 1);
    
    // Smooth cubic easeInOut
    const easedT = localT < 0.5 
      ? 4 * localT * localT * localT 
      : 1 - Math.pow(-2 * localT + 2, 3) / 2;

    const targetPos = new THREE.Vector3().lerpVectors(kfA.pos, kfB.pos, easedT);
    const targetLookAt = new THREE.Vector3().lerpVectors(kfA.target, kfB.target, easedT);

    // Apply mouse parallax
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;
    targetPos.x += this.mouse.x * 0.2;
    targetPos.y += this.mouse.y * 0.2;

    // Damping (LERP) for cinematic weight
    this.currentPos.lerp(targetPos, 0.08);
    this.currentTarget.lerp(targetLookAt, 0.08);

    this.camera.position.copy(this.currentPos);
    this.camera.lookAt(this.currentTarget);
  }
}
```

---

## 6. Sensory Layer: Authentic Audio & Video Streaming

1. **Howler / HTML5 Audio with Unlock Gesture**:
   Modern browsers block audio autoplay with sound unless initiated by a user gesture. Place an interactive mute/unmute toggle in the top-right header:
   ```javascript
   let isAudioPlaying = false;
   const audio = new Audio('/assets/engine.mp3');
   audio.loop = true;
   audio.volume = 0.35;

   document.getElementById('audio-toggle').addEventListener('click', () => {
     if (isAudioPlaying) {
       audio.pause();
       isAudioPlaying = false;
       updateAudioIcon(false);
     } else {
       audio.play();
       isAudioPlaying = true;
       updateAudioIcon(true);
     }
   });
   ```

2. **Inline Video Integration**:
   Always include `playsinline loop autoplay muted` on video elements for seamless cross-platform playback.

---

## 7. Deployment Configuration (`netlify.toml` / `vercel.json`)

To ensure 3D models (`.glb`), HDR maps (`.hdr`), video (`.webm`), and audio stream reliably with proper MIME types and range requests:

### `netlify.toml`
```toml
[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"

[[headers]]
  for = "*.glb"
  [headers.values]
    Content-Type = "model/gltf-binary"

[[headers]]
  for = "*.webm"
  [headers.values]
    Content-Type = "video/webm"

[[headers]]
  for = "*.wasm"
  [headers.values]
    Content-Type = "application/wasm"

[[headers]]
  for = "*.hdr"
  [headers.values]
    Content-Type = "application/octet-stream"
```

---

## 8. Specialized Reference Guides

- **[Gamified 3D Scrollytelling Portfolio Architecture](file:///C:/Users/karth/.gemini/config/skills/creative-3d-web/references/gamified_scrollytelling_portfolio.md)**: Complete blueprint for Awwwards-style multi-world scrollytelling, vehicle mounting, bounding box star collection, perspective HUD typography, curved shader carousels, and velocity-scaled audio.
- **[Gamified 3D Scrollytelling Engine Implementation](file:///C:/Users/karth/.gemini/config/skills/creative-3d-web/examples/gamified_3d_scrollytelling_portfolio.js)**: Production-ready React Three Fiber & Three.js reference engine with VSH, star collisions, matcap floating buttons, and shaders.
- **[Automotive 3D Showcase Blueprint](file:///C:/Users/karth/.gemini/config/skills/creative-3d-web/references/automotive_showcase.md)**: Deep dive into car paint shaders, wheel rotation, contact shadows, multi-stage camera choreographies, and 3D projected annotations.
- **[Luxury Product & Hardware Blueprint](file:///C:/Users/karth/.gemini/config/skills/creative-3d-web/references/product_showcase.md)**: Deep dive into consumer electronics, sapphire watch crystals, exploded-view part animations, and dual-mode 360 inspection controls.
- **[Vanilla Three.js Scrollytelling Engine](file:///C:/Users/karth/.gemini/config/skills/creative-3d-web/examples/vanilla_3d_scrollytelling.js)**: Complete, production-ready, zero-dependency Three.js engine.
