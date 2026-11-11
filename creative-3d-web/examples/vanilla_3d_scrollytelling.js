/**
 * Production-Ready Vanilla Three.js Scrollytelling Engine
 * Zero framework dependencies. Drop into any HTML/CSS project.
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

export class CinematicScrollytellingApp {
  constructor(options = {}) {
    this.container = options.container || document.body;
    this.canvas = options.canvas || document.getElementById('webgl-canvas');
    this.modelUrl = options.modelUrl;
    this.hdrUrl = options.hdrUrl;
    this.keyframes = options.keyframes || this.getDefaultKeyframes();

    this.scrollProgress = 0;
    this.targetScrollProgress = 0;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.clock = new THREE.Clock();

    this.initScene();
    this.initLights();
    this.initEvents();
    if (this.hdrUrl) this.loadEnvironment(this.hdrUrl);
    if (this.modelUrl) this.loadModel(this.modelUrl);

    this.animate();
  }

  getDefaultKeyframes() {
    return [
      { t: 0.0, pos: new THREE.Vector3(-3.5, 0.7, 4.2), target: new THREE.Vector3(0, 0.4, 0) },
      { t: 0.25, pos: new THREE.Vector3(-4.8, 1.3, 1.2), target: new THREE.Vector3(0, 0.5, 0) },
      { t: 0.50, pos: new THREE.Vector3(0.0, 1.8, -3.8), target: new THREE.Vector3(0, 0.5, 0) },
      { t: 0.75, pos: new THREE.Vector3(3.2, 0.6, 2.5), target: new THREE.Vector3(0, 0.4, 0) },
      { t: 1.0, pos: new THREE.Vector3(-4.0, 0.9, 4.0), target: new THREE.Vector3(0, 0.4, 0) },
    ];
  }

  initScene() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      38,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.copy(this.keyframes[0].pos);
    this.camera.lookAt(this.keyframes[0].target);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: window.devicePixelRatio < 2,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    // Contact shadow plane
    this.addContactShadow();
  }

  initLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 10, 7);
    this.scene.add(directionalLight);
  }

  loadEnvironment(url) {
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load(url, (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      this.scene.environment = texture;
    });
  }

  loadModel(url) {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    gltfLoader.load(url, (gltf) => {
      this.model = gltf.scene;

      // Filter out unwanted ground meshes
      this.model.traverse((child) => {
        if (child.isMesh) {
          const name = child.name.toLowerCase();
          if (name.includes('underbody') || name.includes('ground')) {
            child.visible = false;
          }
        }
      });

      // Align model to ground
      const box = new THREE.Box3().setFromObject(this.model);
      const center = box.getCenter(new THREE.Vector3());
      this.model.position.x = -center.x;
      this.model.position.y = -box.min.y;
      this.model.position.z = -center.z;

      this.scene.add(this.model);
    });
  }

  addContactShadow() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(256, 256, 30, 256, 256, 240);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.35)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    const texture = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    });

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(6, 3.5), mat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 0.005;
    this.scene.add(plane);
  }

  initEvents() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    window.addEventListener('scroll', () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      this.targetScrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    });
  }

  updateCamera() {
    // Smooth scroll interpolation
    this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.08;

    // Smooth mouse parallax interpolation
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Determine current keyframe segment
    let i = 0;
    while (i < this.keyframes.length - 1 && this.scrollProgress > this.keyframes[i + 1].t) {
      i++;
    }
    const kfA = this.keyframes[i];
    const kfB = this.keyframes[Math.min(i + 1, this.keyframes.length - 1)];

    const span = kfB.t - kfA.t || 1;
    const localT = THREE.MathUtils.clamp((this.scrollProgress - kfA.t) / span, 0, 1);
    const easedT = localT < 0.5 ? 4 * localT * localT * localT : 1 - Math.pow(-2 * localT + 2, 3) / 2;

    const basePos = new THREE.Vector3().lerpVectors(kfA.pos, kfB.pos, easedT);
    const baseTarget = new THREE.Vector3().lerpVectors(kfA.target, kfB.target, easedT);

    // Subtle parallax offset
    basePos.x += this.mouse.x * 0.15;
    basePos.y += this.mouse.y * 0.15;

    this.camera.position.copy(basePos);
    this.camera.lookAt(baseTarget);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.updateCamera();
    this.renderer.render(this.scene, this.camera);
  }
}
