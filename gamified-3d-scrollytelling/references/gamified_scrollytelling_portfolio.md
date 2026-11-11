# Gamified 3D Scrollytelling Portfolio Architecture

This reference guide provides the complete engineering blueprint for building an Awwwards Site of the Year calibre gamified 3D WebGL portfolio website. It documents the patterns, physics, shaders, audio mechanics, and interaction loops pioneered by world-class creative developers (like Sébastien Lempens, Bruno Simon, and 0xca0a).

---

## 1. Multi-World Transition Architecture

### The State Machine
A high-end 3D journey is divided into sequential geographic or thematic worlds. The entire site state is governed by a lightweight reactive store (e.g. Zustand):

```javascript
import create from 'zustand';

export const useStore = create((set, get) => ({
  country: 'fr', // 'fr' -> 'frlux' (transition) -> 'lux' -> 'luxbe' -> 'be' -> 'befr' -> 'befr2'
  transition: null, // 'onEnter', 'onExit', 'onEnterFinish', 'onExitFinish'
  transitionProgress: 0,
  scroll: 0,
  deltaScroll: 0,
  popup_active: false,
  soundMuted: false,
  setCountry: (country) => set({ country }),
  setScroll: (scroll, deltaScroll) => set({ scroll, deltaScroll }),
}));
```

### Transition Curtains & Shaders
Worlds transition seamlessly without page reloads using a screen-space transition mesh placed immediately in front of the active camera (`position-z: -5`):

```glsl
// Vertex Shader
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}

// Fragment Shader
uniform float uTransition; // 0.0 -> 1.0 lerped
uniform float uTime;
uniform int uCountry;
uniform sampler2D uTextureCountry;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  float progress = uTransition;
  
  // Wipe curtain with dynamic noise / gradient ramp
  float wipe = step(uv.y + sin(uv.x * 10.0 + uTime) * 0.05, progress * 1.1);
  vec4 color = mix(vec4(0.1, 0.08, 0.1, 1.0), vec4(0.0), 1.0 - wipe);
  gl_FragColor = color;
}
```

### Dynamic World Visibility & Asset Preloading
To maintain 60 FPS on all devices, worlds out of viewport are automatically hidden from the scene graph:

```javascript
export function updateWorldVisibility(scene, visibleNames = [], hiddenNames = []) {
  visibleNames.forEach(name => {
    const obj = scene.getObjectByName(name);
    if (obj) obj.visible = true;
  });
  hiddenNames.forEach(name => {
    const obj = scene.getObjectByName(name);
    if (obj) obj.visible = false;
  });
}
```

---

## 2. Virtual Scroll & Inertia Physics Engine

### Virtual Scroll Handler (VSH)
Normal browser scrolling is disabled (`overflow: hidden`, `body { position: fixed }`). A virtual scroll handler normalizes wheel delta across mice, trackpads, and touch gestures:

```javascript
export class VirtualScrollHandler {
  constructor({ range = [0, 100], lerpAmount = 0.05, onUpdate }) {
    this.range = range;
    this.lerpAmount = lerpAmount;
    this.currentY = 0;
    this.deltaY = 0;
    this.completion = 0;
    this.onUpdate = onUpdate;
    this.bindEvents();
    this.raf();
  }

  bindEvents() {
    window.addEventListener('wheel', (e) => {
      const delta = e.deltaY * 0.5;
      this.deltaY = Math.min(Math.max(this.deltaY + delta, this.range[0]), this.range[1]);
    }, { passive: true });
  }

  raf = () => {
    // Spring lerp deceleration
    this.currentY += (this.deltaY - this.currentY) * this.lerpAmount;
    this.completion = (this.currentY - this.range[0]) / (this.range[1] - this.range[0]);
    
    const deltaScroll = Math.abs(this.deltaY - this.currentY);
    if (this.onUpdate) this.onUpdate(this.completion, deltaScroll);

    requestAnimationFrame(this.raf);
  };
}
```

---

## 3. Character & Vehicle Choreography

### Mounting Character to Vehicle
In multi-stage scenes, characters dismount, walk, or ride vehicles. The character skinned mesh is re-parented dynamically:

```javascript
export function mountCharacterToVehicle(scene, characterName, vehicleInnerName) {
  const vehicle = scene.getObjectByName(vehicleInnerName);
  const character = scene.getObjectByName(characterName);
  
  if (vehicle && character) {
    character.removeFromParent();
    vehicle.add(character);
    
    // Position on seat with rider offset
    character.position.set(-0.04, -0.6, 0.09);
    character.rotation.y = -Math.PI;
    
    // Enable helmet
    const helmet = vehicle.getObjectByName('Wolf3D_Helmet');
    if (helmet) helmet.visible = true;
  }
}
```

### Wind & Velocity Morph Target Physics
As the vehicle accelerates, clothing and hair morph targets react to scroll velocity:

```javascript
// Frame update
const outfit = character.getObjectByName('Wolf3D_Outfit_Top');
if (outfit && outfit.morphTargetInfluences) {
  const windVelocity = Math.min(deltaScroll * 10.0, 1.0);
  const flutter = Math.sin(clock.getElapsedTime() * 30.0) * windVelocity;
  outfit.morphTargetInfluences[0] = Math.max(0.0, flutter);
}
```

---

## 4. 3D Collectible Star Pickup & HUD Physics

### Bounding Box Intersection
Each frame, test intersection between the vehicle's collider and the 3D collectibles:

```javascript
const vehicleCollider = scene.getObjectByName('vespaColider');
const vehicleBox = new THREE.Box3().setFromObject(vehicleCollider);

starsGroup.children.forEach((starMesh, index) => {
  const starBox = new THREE.Box3().setFromObject(starMesh);
  
  if (vehicleBox.intersectsBox(starBox) && !starMesh.userData.hit) {
    starMesh.userData.hit = true;
    
    // 1. Play collection audio chime
    audioManager.play('soundSkills');
    
    // 2. Animate star in 3D: elevate and spin
    gsap.to(starMesh.position, { y: 3.0, duration: 0.5, ease: 'back.out' });
    gsap.to(starMesh.scale, { x: 0.25, y: 0.25, z: 0.25, duration: 0.5 });
    
    // 3. Trigger HUD reveal
    const hudItem = document.querySelector(`.skills-HUD > h3:nth-child(${index + 1})`);
    if (hudItem) hudItem.classList.add('active');
  }
});
```

### 3D Perspective HUD Typography CSS
```css
.skills-HUD {
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: absolute;
  top: 50%;
  right: 10%;
  transform: translateY(-50%);
  pointer-events: none;
}

.skills-HUD > h3 {
  font-family: 'Zen Dots', sans-serif;
  font-size: 2rem;
  margin: 0;
  padding: 0;
  clip-path: inset(0 0 35px 0);
  transform-origin: left bottom;
  opacity: 0;
  color: #ffbb00;
  transform: perspective(250px) translateY(-40px) scaleY(4.55);
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              clip-path 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              opacity 0.8s ease,
              color 0.8s ease;
}

.skills-HUD > h3.active {
  clip-path: inset(0);
  transform: none;
  color: #ffffff;
  opacity: 0.85;
}
```

---

## 5. Curved 3D Project Carousel with Momentum

### Vertex Shader Curvature
Card meshes bend backwards as they approach the viewport edges to simulate an IMAX curved screen:

```glsl
uniform vec2 uResolution;
uniform float uOffset;
uniform float uHoverProgress;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 pos = position;
  
  // Parabolic cylinder bend along X
  float bend = pow(pos.x / (uResolution.x * 0.5), 2.0);
  pos.z -= bend * 40.0 * (1.0 + uOffset * 0.2);
  
  // Hover elevation
  pos.z += uHoverProgress * 30.0;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
```

---

## 6. Real-Time Spatial Audio Engine

### Velocity-Controlled Ambient Wind Loop
Wind sound volume directly mirrors player movement speed:

```javascript
export class AudioManager {
  constructor() {
    this.sounds = {
      theme: new Audio('/sounds/theme.m4a'),
      wind: new Audio('/sounds/wind.mp3'),
      skills: new Audio('/sounds/skills.mp3'),
      whoosh: new Audio('/sounds/whoosh.mp3'),
      click: new Audio('/sounds/buttonClick.mp3'),
    };
    
    this.sounds.theme.loop = true;
    this.sounds.theme.volume = 0.15;
    this.sounds.wind.loop = true;
    this.sounds.wind.volume = 0.0;
  }

  updateWind(deltaScroll) {
    // Normalize scroll delta to volume 0.0 - 1.0
    const targetVolume = Math.min(deltaScroll * 2.5, 0.9);
    // Smooth lerp volume
    this.sounds.wind.volume += (targetVolume - this.sounds.wind.volume) * 0.1;
  }
}
```

---

## 7. Floating 3D Action Buttons (Matcap + HTML)

### Sine Wave Levitation Math
```javascript
function updateFloatingMesh(mesh, clockTime, speed = 1.0, floatIntensity = 1.0, rotIntensity = 0.02) {
  mesh.rotation.x = Math.cos(clockTime / 4.0 * speed) / 8.0 * rotIntensity;
  mesh.rotation.y = Math.sin(clockTime / 4.0 * speed) / 8.0 * rotIntensity;
  mesh.rotation.z = Math.sin(clockTime / 4.0 * speed) / 20.0 * rotIntensity;
  
  mesh.position.y = (Math.sin(clockTime / 4.0 * speed) / 10.0) * floatIntensity;
}
```
Combined with `THREE.MeshMatcapMaterial`, floating action buttons render with studio metallic reflections at virtually zero GPU cost.
