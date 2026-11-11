import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createAnatomy } from './anatomy.js';
import { createFoodParticle } from './food-particle.js';
import { createUI } from './ui.js';

const viewport = document.getElementById('viewport');
const status = document.getElementById('scene-status');

try {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor('#0b0f19');
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  viewport.append(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.minDistance = 6;
  controls.maxDistance = 30;
  controls.target.set(0, 0.5, 0);
  const key = new THREE.DirectionalLight('#ffe5d6', 3.2);
  key.position.set(-4, 6, 7);
  const fill = new THREE.DirectionalLight('#c6d7ff', 1.5);
  fill.position.set(5, 1, 4);
  const rim = new THREE.DirectionalLight('#ff8e9f', 3);
  rim.position.set(1, 4, -5);
  scene.add(key, fill, rim, new THREE.AmbientLight('#c3c9e2', 0.65));
  const anatomy = createAnatomy();
  const journey = createFoodParticle(anatomy.organs);
  scene.add(anatomy.group, journey.group);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  journey.playing = !reducedMotion.matches;
  reducedMotion.addEventListener('change', event => {
    if (event.matches) journey.playing = false;
  });
  const ui = createUI(journey);
  function resetView() {
    controls.target.set(0, 0.5, 0);
    const aspect = viewport.clientWidth / viewport.clientHeight;
    const distance = Math.max(17, 6.3 / (Math.tan(THREE.MathUtils.degToRad(19)) * aspect));
    camera.position.set(0, 0.9, Math.min(distance, 29));
    controls.update();
  }
  function resize() {
    const width = viewport.clientWidth;
    const height = viewport.clientHeight;
    const oldAspect = camera.aspect;
    camera.aspect = width / height;
    if (camera.position.lengthSq() > 0) {
      const ratio = Math.max(1, 1 / camera.aspect) / Math.max(1, 1 / oldAspect);
      camera.position.sub(controls.target).multiplyScalar(ratio).clampLength(controls.minDistance, controls.maxDistance).add(controls.target);
    }
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  new ResizeObserver(resize).observe(viewport);
  resize();
  resetView();
  document.getElementById('reset-view').addEventListener('click', resetView);
  renderer.domElement.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    journey.playing = false;
    renderer.setAnimationLoop(null);
    status.textContent = 'Kết nối WebGL bị gián đoạn. Hãy tải lại trang để tiếp tục.';
  });
  let reactionTime = 0;
  let reactionRevision = journey.revision;
  let previous = performance.now();
  document.addEventListener('visibilitychange', () => { previous = performance.now(); });
  renderer.setAnimationLoop(now => {
    const delta = Math.min(Math.max((now - previous) / 1000, 0), 0.1);
    previous = now;
    if (document.hidden) return;
    if (reactionRevision !== journey.revision) {
      anatomy.react(0, 'normal', journey.response, 0, 0);
      reactionTime = 0;
      reactionRevision = journey.revision;
    }
    journey.update(delta);
    if (journey.playing && !reducedMotion.matches) reactionTime += delta * journey.speed * (journey.mode === 'toxic' ? 2 : 1);
    anatomy.react(journey.stageIndex, journey.mode, journey.response, reactionTime, journey.playing ? delta : 0);
    anatomy.highlight(journey.stageIndex, delta);
    ui.update();
    controls.update();
    renderer.render(scene, camera);
  });
  status.textContent = '';
} catch (error) {
  status.textContent = 'Không thể khởi tạo mô hình 3D. Hãy dùng trình duyệt hỗ trợ WebGL 2 và bật tăng tốc phần cứng.';
  console.error(error);
}
