# Automotive 3D WebGL Showcase Blueprint

This guide provides the complete engineering formula for creating studio-grade, interactive 3D automotive showcases (such as Porsche 911 GT3 RS, Ferrari, McLaren, or BMW) entirely from scratch without requiring external reference sites.

---

## 1. 3D Vehicle Asset Preparation & Hygiene

### Selecting & Sanitizing the Model
When importing or loading a vehicle GLB model:
1. **Node Hierarchy Inspection**: Always traverse the model hierarchy upon loading to inspect mesh names, materials, and bounding boxes.
2. **Pruning Invisible / Colliding Underbody Geometry**:
   Many 3D models from Blender or Sketchfab contain collision meshes, floor slabs, or generic shadow boxes under the chassis (often named `underbody`, `ground_plane`, or `cube_0`). These create unsightly black blocks underneath the vehicle.
   ```javascript
   model.traverse((child) => {
     if (child.isMesh) {
       // Filter out unwanted collision or ground planes
       const name = child.name.toLowerCase();
       if (name.includes('underbody') || name.includes('ground') || name.includes('collision')) {
         child.visible = false;
       }
     }
   });
   ```
3. **Auto-Centering & Ground Alignment**:
   Compute the bounding box and re-center the model so its wheels sit precisely at `y = 0`:
   ```javascript
   const box = new THREE.Box3().setFromObject(model);
   const center = box.getCenter(new THREE.Vector3());
   const size = box.getSize(new THREE.Vector3());

   // Center model horizontally and position wheels on ground
   model.position.x = -center.x;
   model.position.y = -box.min.y;
   model.position.z = -center.z;
   ```

---

## 2. Automotive PBR Material Formulations

To achieve high-end studio realism, replace standard generic materials with tuned `MeshPhysicalMaterial` instances:

### A. High-Gloss Clearcoat Car Paint (e.g. Porsche Guards Red)
```javascript
const carPaintMaterial = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color(0xd5001c),       // Signature Porsche Guards Red
  metalness: 0.85,
  roughness: 0.18,
  clearcoat: 1.0,                         // High gloss automotive lacquer
  clearcoatRoughness: 0.05,
  reflectivity: 1.0,
  envMapIntensity: 1.8,
});
```

### B. Carbon Fiber Aero & Spoilers
```javascript
const carbonFiberMaterial = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color(0x1a1a1a),
  metalness: 0.4,
  roughness: 0.35,
  clearcoat: 0.8,
  clearcoatRoughness: 0.15,
});
```

### C. Glass Windshield & Headlight Lenses
```javascript
const automotiveGlassMaterial = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color(0xffffff),
  metalness: 0.1,
  roughness: 0.02,
  transmission: 0.95,                     // Physical light transmission
  ior: 1.52,                              // Glass index of refraction
  thickness: 0.05,
  transparent: true,
  opacity: 0.85,
  envMapIntensity: 2.5,
});
```

### D. Tire Rubber
```javascript
const tireRubberMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color(0x151515),
  roughness: 0.85,
  metalness: 0.05,
});
```

### E. Baked Ambient Contact Shadow Plane
A realistic vehicle must cast a soft, diffused ambient occlusion shadow directly under its wheels:
```javascript
function createContactShadow(width = 5.0, height = 3.0) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Radial blur gradient: dark under center, soft falloff at edges
  const gradient = ctx.createRadialGradient(256, 256, 40, 256, 256, 240);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
  gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.4)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);

  const texture = new THREE.CanvasTexture(canvas);
  const shadowMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
  });

  const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(width, height), shadowMaterial);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = 0.005; // Slightly above ground to prevent z-fighting
  return shadowPlane;
}
```

---

## 3. Cinematic 6-Stage Camera Choreography

Structure the webpage into distinct narrative stages tied to scroll percentage:

| Stage | Scroll Range | Camera Position `[x, y, z]` | Target Focus | Narrative Focus |
|---|---|---|---|---|
| **1. Hero** | 0.00 – 0.15 | `[-3.5, 0.65, 4.2]` | `[0, 0.4, 0]` | Aggressive low front 3/4 angle, dramatic reveal |
| **2. Aerodynamics** | 0.15 – 0.35 | `[-4.5, 1.2, 1.5]` | `[0, 0.6, -0.2]` | Side profile, swan-neck rear wing & active DRS |
| **3. Powertrain** | 0.35 – 0.55 | `[0.0, 1.6, -3.8]` | `[0, 0.5, 0]` | High-RPM 4.0L atmospheric boxer engine details |
| **4. Wheels & Brakes** | 0.55 – 0.70 | `[2.8, 0.4, 1.2]` | `[1.2, 0.35, 1.2]` | PCCB Carbon Ceramic brakes & forged magnesium wheels |
| **5. Track Action** | 0.70 – 0.85 | `[-2.0, 0.8, 3.5]` | `[0, 0.5, 0]` | Video backdrop with high-speed cornering & downforce |
| **6. CTA / Dealer** | 0.85 – 1.00 | `[-4.0, 0.9, 4.0]` | `[0, 0.4, 0]` | Clean studio wide shot with configuration button |

### Smooth Spline Interpolation Engine
```javascript
class CameraRig {
  constructor(camera, keyframes) {
    this.camera = camera;
    this.keyframes = keyframes;
    this.currentPos = new THREE.Vector3().copy(keyframes[0].pos);
    this.currentTarget = new THREE.Vector3().copy(keyframes[0].target);
  }

  update(scrollProgress) {
    // Find active keyframe segment
    let i = 0;
    while (i < this.keyframes.length - 1 && scrollProgress > this.keyframes[i + 1].t) {
      i++;
    }
    const kfA = this.keyframes[i];
    const kfB = this.keyframes[Math.min(i + 1, this.keyframes.length - 1)];

    const segmentDuration = kfB.t - kfA.t || 1;
    const localT = THREE.MathUtils.clamp((scrollProgress - kfA.t) / segmentDuration, 0, 1);
    
    // Smooth cubic easeInOut
    const easedT = localT < 0.5 
      ? 4 * localT * localT * localT 
      : 1 - Math.pow(-2 * localT + 2, 3) / 2;

    const targetPos = new THREE.Vector3().lerpVectors(kfA.pos, kfB.pos, easedT);
    const targetLookAt = new THREE.Vector3().lerpVectors(kfA.target, kfB.target, easedT);

    // Damping (LERP) for fluid cinematic motion
    this.currentPos.lerp(targetPos, 0.08);
    this.currentTarget.lerp(targetLookAt, 0.08);

    this.camera.position.copy(this.currentPos);
    this.camera.lookAt(this.currentTarget);
  }
}
```

---

## 4. Authentic Engine Audio & Sound Architecture

High-end showcases feel alive when paired with authentic acoustic feedback:

1. **Howler.js or Native Web Audio**:
   - Provide engine rev sound clips (`assets/engine.mp3`).
   - Implement autoplay unlock: browsers require user interaction before playing audio with volume. Maintain a floating mute/unmute widget in the header.
2. **Dynamic Audio Controls**:
   - Pause on background tab (`document.visibilitychange`).
   - Fade volume in and out smoothly on user scroll or section enter.

---

## 5. 3D Projected Annotations (Hotspots)

Project 3D world coordinates onto the 2D DOM screen for interactive feature callouts (e.g. "DRS Wing", "4.0L Boxer-6", "Monobloc Calipers"):

```javascript
function updateHotspots(camera, hotspots) {
  const widthHalf = window.innerWidth / 2;
  const heightHalf = window.innerHeight / 2;

  hotspots.forEach(({ element, worldPosition }) => {
    const pos = worldPosition.clone().project(camera);

    // Check if hotspot is in front of camera
    if (pos.z < 1) {
      const screenX = (pos.x * widthHalf) + widthHalf;
      const screenY = -(pos.y * heightHalf) + heightHalf;

      element.style.transform = `translate(-50%, -50%) translate3d(${screenX}px, ${screenY}px, 0)`;
      element.style.opacity = '1';
    } else {
      element.style.opacity = '0'; // Behind camera
    }
  });
}
```
