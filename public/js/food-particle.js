import * as THREE from 'three';
import { stages, getStageIndex } from './digestive-data.js';

export function createFoodParticle(organs) {
  const group = new THREE.Group();
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.13, 24, 16), new THREE.MeshBasicMaterial({ color: '#ffe6a2', depthTest: false }));
  mesh.renderOrder = 10;
  const halo = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 16), new THREE.MeshBasicMaterial({ color: '#ffd178', transparent: true, opacity: 0.18, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending }));
  halo.renderOrder = 9;
  const light = new THREE.PointLight('#ffd178', 1.8, 2);
  group.add(mesh, halo, light);
  const golden = new THREE.Color('#ffe6a2');
  const waste = new THREE.Color('#9b653b');
  const journey = {
    group, mesh, progress: 0, stageIndex: 0, playing: true, speed: 1,
    seek(value) {
      if (!Number.isFinite(value)) return;
      this.progress = THREE.MathUtils.clamp(value, 0, 1);
      this.stageIndex = getStageIndex(this.progress);
      const stage = stages[this.stageIndex];
      const local = (this.progress - stage.start) / (stage.end - stage.start);
      group.position.copy(organs[this.stageIndex].curve.getPointAt(local));
      const absorption = THREE.MathUtils.clamp((this.progress - stages[2].start) / (stages[2].end - stages[2].start), 0, 1);
      mesh.scale.setScalar(1 - absorption * 0.58);
      halo.scale.copy(mesh.scale);
      const residue = THREE.MathUtils.clamp((this.progress - stages[3].start) / 0.08, 0, 1);
      mesh.material.color.copy(golden).lerp(waste, residue);
      halo.material.color.copy(mesh.material.color);
      light.color.copy(mesh.material.color);
      if (this.progress === 1) this.playing = false;
    },
    update(delta) {
      if (this.playing) this.seek(this.progress + Math.max(0, delta) * this.speed / 90);
    },
  };
  journey.seek(0);
  return journey;
}
