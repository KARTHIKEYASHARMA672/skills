---
name: gamified-3d-scrollytelling
description: Master engineering guide and reusable architecture for building Awwwards Site of the Year calibre gamified 3D WebGL portfolios and multi-world scrollytelling websites. Includes virtual scroll physics, Mixamo character rigging on vehicles, bounding box collectible items, perspective HUD typography, curved shader carousels, and velocity-responsive spatial audio.
---

# Gamified 3D Scrollytelling Portfolio & Multi-World Universe

This skill provides the comprehensive engineering blueprint, mathematical models, shader recipes, and implementation templates for creating award-winning, interactive 3D WebGL scrollytelling universes from scratch.

---

## 1. Architectural Overview: The 8 Core Subsystems

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                 ZUSTAND STORE ENGINE                                    │
│  (country, scroll, deltaScroll, transitionProgress, starsCollected, soundMuted)         │
├───────────────────────────────┬─────────────────────────────────────────────────────────┤
│ 1. Virtual Scroll Handler     │ Normalized wheel/touch events, inertia LERP [0.0 - 1.0] │
├───────────────────────────────┼─────────────────────────────────────────────────────────┤
│ 2. Multi-World Transition     │ Dynamic visibility, skybox crossfade, transition screen │
├───────────────────────────────┼─────────────────────────────────────────────────────────┤
│ 3. Character & Vehicle Rig    │ Mixamo clip blending, dynamic mounting, cloth morphs    │
├───────────────────────────────┼─────────────────────────────────────────────────────────┤
│ 4. 3D Collectible Gameplay    │ Box3 collision detection, chime audio, 3D HUD reveal   │
├───────────────────────────────┼─────────────────────────────────────────────────────────┤
│ 5. Curved Project Carousel    │ Vertex curvature shader, touch momentum, card reveal    │
├───────────────────────────────┼─────────────────────────────────────────────────────────┤
│ 6. Floating Action Buttons    │ Sinusoidal multi-axis levitation, Matcap shaders        │
├───────────────────────────────┼─────────────────────────────────────────────────────────┤
│ 7. Dynamic Audio Pipeline     │ Theme music, velocity-scaled ambient wind volume        │
├───────────────────────────────┼─────────────────────────────────────────────────────────┤
│ 8. Mobile Subsystem           │ Virtual touch joystick, responsive camera focal length  │
└───────────────────────────────┴─────────────────────────────────────────────────────────┘
```

---

## 2. Implementation Guide: Step-by-Step

### Phase 1: State Machine & Multi-World Structure
Define sequential environments in a reactive store:
```javascript
import create from 'zustand';

export const useStore = create((set, get) => ({
  country: 'fr', // 'fr' (City 1) -> 'frlux' (Highway) -> 'lux' (City 2) -> 'be' (City 3)
  scroll: 0,
  deltaScroll: 0,
  transition: null,
  starsCollected: [false, false, false, false, false],
  soundMuted: false,

  setCountry: (country) => set({ country }),
  setScroll: (scroll, deltaScroll) => set({ scroll, deltaScroll }),
  collectStar: (index) => set((s) => {
    const next = [...s.starsCollected];
    next[index] = true;
    return { starsCollected: next };
  }),
}));
```

### Phase 2: Virtual Scroll & Deceleration Physics
Bypass native scrollbars with a custom Virtual Scroll Handler:
```javascript
export class VirtualScrollHandler {
  constructor({ range = [0, 1000], lerpAmount = 0.05, onUpdate }) {
    this.range = range;
    this.lerpAmount = lerpAmount;
    this.currentY = 0;
    this.deltaY = 0;
    this.onUpdate = onUpdate;
    this.bindEvents();
    this.tick();
  }

  bindEvents() {
    window.addEventListener('wheel', (e) => {
      this.deltaY = Math.min(Math.max(this.deltaY + e.deltaY * 0.45, this.range[0]), this.range[1]);
    }, { passive: true });
  }

  tick = () => {
    this.currentY += (this.deltaY - this.currentY) * this.lerpAmount;
    const progress = (this.currentY - this.range[0]) / (this.range[1] - this.range[0]);
    const deltaScroll = Math.abs(this.deltaY - this.currentY) / 100.0;
    
    if (this.onUpdate) this.onUpdate(progress, deltaScroll);
    requestAnimationFrame(this.tick);
  };
}
```

### Phase 3: Dynamic Character Re-parenting to Vehicle
When transitioning between walking and driving phases:
```javascript
export function mountCharacter(scene, characterName, vehicleInnerName) {
  const character = scene.getObjectByName(characterName);
  const vehicle = scene.getObjectByName(vehicleInnerName);
  if (!character || !vehicle) return;

  character.removeFromParent();
  vehicle.add(character);
  character.position.set(-0.04, -0.6, 0.09);
  character.rotation.y = -Math.PI;

  const helmet = vehicle.getObjectByName('Wolf3D_Helmet');
  if (helmet) helmet.visible = true;
}
```

### Phase 4: 3D Collectible Stars & Perspective HUD
1. **Collision Loop**:
```javascript
const vehicleCollider = scene.getObjectByName('vespaColider');
const vehicleBox = new THREE.Box3();

function checkStarCollisions(starsGroup, audioManager, onHit) {
  vehicleBox.setFromObject(vehicleCollider);
  
  starsGroup.children.forEach((star, index) => {
    star.rotation.y += star.userData.hit ? 0.45 : 0.05;
    
    const starBox = new THREE.Box3().setFromObject(star);
    if (!star.userData.hit && vehicleBox.intersectsBox(starBox)) {
      star.userData.hit = true;
      audioManager.play('skills');
      
      // Elevate and shrink in 3D
      star.position.y += 2.5;
      star.scale.multiplyScalar(0.5);
      
      // Reveal in HUD
      onHit(index);
    }
  });
}
```

2. **3D Perspective HUD CSS**:
```css
.skills-HUD {
  position: absolute;
  top: 50%;
  right: 10%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}

.skills-HUD > h3 {
  font-family: 'Zen Dots', sans-serif;
  font-size: 2rem;
  margin: 0;
  clip-path: inset(0 0 35px 0);
  opacity: 0;
  color: #ffbb00;
  transform: perspective(250px) translateY(-40px) scaleY(4.55);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.skills-HUD > h3.active {
  clip-path: inset(0);
  transform: none;
  color: #ffffff;
  opacity: 0.85;
}
```

### Phase 5: Curved 3D Project Carousel Shaders
Cards bend backwards as they approach viewport edges:
```glsl
uniform vec2 uResolution;
uniform float uOffset;
uniform float uHoverProgress;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 pos = position;
  
  // Parabolic cylinder curve along X
  float bend = pow(pos.x / (uResolution.x * 0.5), 2.0);
  pos.z -= bend * 40.0 * (1.0 + uOffset * 0.2);
  pos.z += uHoverProgress * 25.0; // Lift on hover
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
```

### Phase 6: Velocity-Controlled Spatial Audio
Wind noise scales in volume dynamically with player speed:
```javascript
export function updateWindAudio(windAudio, deltaScroll) {
  const targetVolume = Math.min(deltaScroll * 2.5, 0.9);
  windAudio.volume += (targetVolume - windAudio.volume) * 0.1;
}
```

### Phase 7: Floating Matcap Action Buttons
Low-cost metallic reflection using Matcap + multi-axis sinusoidal float:
```javascript
export function updateFloatingButton(mesh, elapsedTime, speed = 1.0, floatIntensity = 1.0) {
  mesh.rotation.x = (Math.cos((elapsedTime / 4) * speed) / 8) * 0.05;
  mesh.rotation.y = (Math.sin((elapsedTime / 4) * speed) / 8) * 0.05;
  mesh.position.y = (Math.sin((elapsedTime / 4) * speed) / 10) * floatIntensity;
}
```

---

## 3. Reusable Assets & References

- **[Full Engine Implementation](file:///C:/Users/karth/.gemini/config/skills/creative-3d-web/examples/gamified_3d_scrollytelling_portfolio.js)**: Ready-to-use Three.js/R3F script with VSH, star collisions, curved shaders, and audio manager.
- **[Architectural Blueprint](file:///C:/Users/karth/.gemini/config/skills/creative-3d-web/references/gamified_scrollytelling_portfolio.md)**: Deep architectural theory, transition curtains, and mobile joystick integration.
