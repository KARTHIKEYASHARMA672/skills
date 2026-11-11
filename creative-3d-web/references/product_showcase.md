# Luxury Product & Hardware 3D WebGL Showcase Blueprint

This guide provides the engineering rules and shaders for building luxury consumer product showcases (smartphones, mechanical watches, headphones, VR headsets, architectural objects) from scratch.

---

## 1. Product Studio Lighting & Environment

Consumer electronics and luxury watches require crisp specular highlights and soft reflections:

### Three-Point Studio Light Rig with Soft Fill
```javascript
export function setupStudioLighting(scene) {
  // Key Light (Crisp highlights on top chamfered edges)
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
  keyLight.position.set(3, 5, 2);
  scene.add(keyLight);

  // Rim / Backlight (Separates object from dark background)
  const rimLight = new THREE.DirectionalLight(0x60a5fa, 3.0);
  rimLight.position.set(-3, 3, -4);
  scene.add(rimLight);

  // Soft Ambient Fill (Prevents pitch black shadows)
  const fillLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(fillLight);
}
```

---

## 2. Luxury Hardware Materials

### A. Anodized Aerospace Titanium / Aluminum
```javascript
const anodizedMetalMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color(0x3a3c3e),       // Space Grey / Titanium
  metalness: 0.95,
  roughness: 0.22,                        // Micro-brushed satin finish
  envMapIntensity: 1.5,
});
```

### B. Ceramic / Sapphire Watch Crystal
```javascript
const sapphireCrystalMaterial = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color(0xffffff),
  metalness: 0.05,
  roughness: 0.0,
  transmission: 0.98,
  ior: 1.77,                              // True sapphire crystal IOR
  thickness: 0.08,
  transparent: true,
  opacity: 0.9,
});
```

### C. OLED Screen Glass with Emissive UI Texture
```javascript
function createScreenMaterial(uiCanvasOrTexture) {
  return new THREE.MeshStandardMaterial({
    map: uiCanvasOrTexture,
    emissive: new THREE.Color(0xffffff),
    emissiveMap: uiCanvasOrTexture,
    emissiveIntensity: 1.2,
    roughness: 0.1,
    metalness: 0.2,
  });
}
```

---

## 3. Exploded-View Scroll Interaction

For mechanical products (e.g. watch movements, phone internal components, camera lenses), disassemble components along an explosion vector based on scroll progress:

```javascript
class ExplodedViewManager {
  constructor(parts) {
    // parts = [{ mesh, basePos, explodeOffset: new THREE.Vector3(x, y, z) }]
    this.parts = parts;
  }

  update(explodeFactor) {
    // explodeFactor is 0.0 (assembled) to 1.0 (fully disassembled)
    this.parts.forEach(({ mesh, basePos, explodeOffset }) => {
      mesh.position.copy(basePos).addScaledVector(explodeOffset, explodeFactor);
    });
  }
}
```

---

## 4. Dual Control: Scroll Cinematic + Interactive 360 Drag

Allow users to seamlessly transition between scroll-driven presentation and free 360-degree inspection:

```javascript
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let isUserInteracting = false;
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = false; // Prevent breaking page scroll

controls.addEventListener('start', () => {
  isUserInteracting = true;
});

controls.addEventListener('end', () => {
  // Gracefully transition back to scroll target after 2 seconds idle
  setTimeout(() => {
    isUserInteracting = false;
  }, 2000);
});

function renderLoop() {
  requestAnimationFrame(renderLoop);
  if (isUserInteracting) {
    controls.update();
  } else {
    cameraRig.update(scrollProgress);
  }
  renderer.render(scene, camera);
}
```
