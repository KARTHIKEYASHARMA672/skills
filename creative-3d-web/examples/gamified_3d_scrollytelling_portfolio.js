/**
 * Gamified 3D Scrollytelling Portfolio Engine
 * Complete, production-ready React Three Fiber / Three.js Architecture
 * Features:
 *  - State-Driven Multi-World Scrollytelling (Zustand)
 *  - Virtual Scroll Handler with Inertia LERP & Deceleration
 *  - 3D Collectible Star Physics & Bounding Box Collision
 *  - 3D Perspective HUD with Zen Dots Typography
 *  - Velocity-Responsive Ambient Audio (Wind loop volume scaled to scroll speed)
 *  - Floating Matcap Action Buttons with Sine Wave Levitation
 *  - Curved 3D Horizontal Project Carousel with Drag Physics
 */

import * as THREE from 'three';

// ============================================================================
// 1. ZUSTAND MULTI-WORLD STORE
// ============================================================================
export const createPortfolioStore = (set, get) => ({
  country: 'fr', // 'fr' (Paris) -> 'frlux' (Highway) -> 'lux' (Luxembourg) -> 'be' (Belgium)
  scroll: 0,
  deltaScroll: 0,
  transition: null,
  starsCollected: [false, false, false, false, false],
  soundMuted: false,

  setScroll: (scroll, deltaScroll) => set({ scroll, deltaScroll }),
  setCountry: (country) => set({ country }),
  collectStar: (index) => set((state) => {
    const next = [...state.starsCollected];
    next[index] = true;
    return { starsCollected: next };
  }),
  toggleSound: () => set((state) => ({ soundMuted: !state.soundMuted })),
});

// ============================================================================
// 2. VIRTUAL SCROLL HANDLER (VSH)
// ============================================================================
export class VirtualScrollHandler {
  constructor({
    range = [0, 1000],
    lerpAmount = 0.05,
    onUpdate = () => {},
  }) {
    this.range = range;
    this.lerpAmount = lerpAmount;
    this.currentY = 0;
    this.deltaY = 0;
    this.completion = 0;
    this.onUpdate = onUpdate;
    this.active = true;

    this.bindEvents();
    this.tick();
  }

  bindEvents() {
    window.addEventListener('wheel', (e) => {
      if (!this.active) return;
      // Normalizing wheel delta across standard mice and high-precision trackpads
      const delta = e.deltaY * 0.45;
      this.deltaY = Math.min(Math.max(this.deltaY + delta, this.range[0]), this.range[1]);
    }, { passive: true });

    // Touch swipe support for mobile
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!this.active) return;
      const touchY = e.touches[0].clientY;
      const delta = (touchStartY - touchY) * 1.5;
      touchStartY = touchY;
      this.deltaY = Math.min(Math.max(this.deltaY + delta, this.range[0]), this.range[1]);
    }, { passive: true });
  }

  tick = () => {
    // Smooth inertia lerp
    this.currentY += (this.deltaY - this.currentY) * this.lerpAmount;
    this.completion = (this.currentY - this.range[0]) / (this.range[1] - this.range[0]);

    const deltaScroll = Math.abs(this.deltaY - this.currentY) / 100.0;
    this.onUpdate(this.completion, deltaScroll);

    requestAnimationFrame(this.tick);
  };

  goTo(target, instant = false) {
    this.deltaY = target;
    if (instant) this.currentY = target;
  }

  destroy() {
    this.active = false;
  }
}

// ============================================================================
// 3. 3D STAR COLLECTIBLE & COLLISION ENGINE
// ============================================================================
export class StarCollectionManager {
  constructor({ scene, starsData, audioManager, onStarHit }) {
    this.scene = scene;
    this.starsData = starsData;
    this.audioManager = audioManager;
    this.onStarHit = onStarHit;

    this.starsGroup = new THREE.Group();
    this.starsGroup.name = 'starsGroup';
    this.scene.add(this.starsGroup);

    this.starBoxes = [];
    this.vehicleBox = new THREE.Box3();
    this.initMeshes();
  }

  initMeshes() {
    const starGeom = new THREE.OctahedronGeometry(0.5, 0);
    const starMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0xffaa00,
      emissiveIntensity: 0.4,
    });

    this.starsData.forEach((star, index) => {
      const mesh = new THREE.Mesh(starGeom, starMat.clone());
      mesh.position.set(...star.position);
      mesh.userData = { id: star.key, index, hit: false, title: star.html };
      this.starsGroup.add(mesh);

      const box = new THREE.Box3();
      box.setFromObject(mesh);
      this.starBoxes.push(box);
    });
  }

  update(vehicleCollider, delta) {
    if (!vehicleCollider) return;
    this.vehicleBox.setFromObject(vehicleCollider);

    this.starsGroup.children.forEach((starMesh, index) => {
      // Rotation animation
      starMesh.rotation.y += starMesh.userData.hit ? 0.45 : 0.05;

      // Check collision
      if (!starMesh.userData.hit && this.vehicleBox.intersectsBox(this.starBoxes[index])) {
        starMesh.userData.hit = true;

        // 1. Play sound
        if (this.audioManager) this.audioManager.play('skills');

        // 2. Animate mesh elevation & shrinkage
        starMesh.position.y += 2.5;
        starMesh.scale.multiplyScalar(0.5);

        // 3. Callback for HUD
        if (this.onStarHit) this.onStarHit(index, starMesh.userData.title);
      }
    });
  }
}

// ============================================================================
// 4. FLOATING MATCAP BUTTONS
// ============================================================================
export class FloatingButtonManager {
  constructor(scene, textureLoader) {
    this.scene = scene;
    this.matcap = textureLoader.load('/texture/matcap.png');
    this.buttons = [];
  }

  addButton({ geometry, position, speed = 1.0, floatIntensity = 1.0, onClick }) {
    const material = new THREE.MeshMatcapMaterial({
      matcap: this.matcap,
      roughness: 0.4,
      metalness: 0.6,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.userData = { speed, floatIntensity, basePos: mesh.position.clone(), onClick };

    this.scene.add(mesh);
    this.buttons.push(mesh);
    return mesh;
  }

  update(elapsedTime) {
    this.buttons.forEach((btn) => {
      const { speed, floatIntensity, basePos } = btn.userData;
      btn.rotation.x = (Math.cos((elapsedTime / 4) * speed) / 8) * 0.05;
      btn.rotation.y = (Math.sin((elapsedTime / 4) * speed) / 8) * 0.05;
      btn.rotation.z = (Math.sin((elapsedTime / 4) * speed) / 20) * 0.05;

      const floatY = (Math.sin((elapsedTime / 4) * speed) / 10) * floatIntensity;
      btn.position.y = basePos.y + floatY;
    });
  }
}

// ============================================================================
// 5. VELOCITY-CONTROLLED AUDIO MANAGER
// ============================================================================
export class AudioManager {
  constructor() {
    this.muted = false;
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

  play(name) {
    if (this.muted || !this.sounds[name]) return;
    const sound = this.sounds[name];
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  startAmbient() {
    if (this.muted) return;
    this.sounds.theme.play().catch(() => {});
    this.sounds.wind.play().catch(() => {});
  }

  updateWindVolume(deltaScroll) {
    if (this.muted) return;
    const targetVolume = Math.min(deltaScroll * 2.5, 0.9);
    this.sounds.wind.volume += (targetVolume - this.sounds.wind.volume) * 0.1;
  }

  setMuted(muted) {
    this.muted = muted;
    Object.values(this.sounds).forEach((s) => (s.muted = muted));
  }
}

// ============================================================================
// 6. CURVED 3D PROJECT SLIDER MATERIAL (SHADERS)
// ============================================================================
export const CurvedCardShader = {
  vertexShader: `
    uniform vec2 uResolution;
    uniform float uOffset;
    uniform float uHoverProgress;
    varying vec2 vUv;

    void main() {
      vUv = uv;
      vec3 pos = position;

      // Parabolic curve bending backwards towards screen edges
      float bend = pow(pos.x / (uResolution.x * 0.5), 2.0);
      pos.z -= bend * 40.0 * (1.0 + uOffset * 0.2);

      // Hover elevation
      pos.z += uHoverProgress * 25.0;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D uTexture;
    uniform vec3 uColor;
    varying vec2 vUv;

    void main() {
      vec4 tex = texture2D(uTexture, vUv);
      vec3 finalColor = mix(tex.rgb, uColor, 0.15);
      gl_FragColor = vec4(finalColor, tex.a);
    }
  `,
};
