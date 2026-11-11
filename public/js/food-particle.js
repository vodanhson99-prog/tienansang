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
    mode: 'normal', response: 'vomit', direction: 1, contraction: 0, revision: 0,
    setMode(mode, response = 'vomit') {
      if (!['normal', 'toxic'].includes(mode) || !['vomit', 'diarrhea'].includes(response)) return;
      this.revision++;
      this.mode = mode;
      this.response = response;
      this.direction = 1;
      this.contraction = 0;
      this.seek(0);
    },
    seek(value) {
      if (!Number.isFinite(value)) return;
      this.progress = THREE.MathUtils.clamp(value, 0, 1);
      this.stageIndex = getStageIndex(this.progress);
      const stage = stages[this.stageIndex];
      const local = (this.progress - stage.start) / (stage.end - stage.start);
      group.position.copy(organs[this.stageIndex].curve.getPointAt(local));
      const absorption = THREE.MathUtils.clamp((this.progress - stages[4].start) / (stages[4].end - stages[4].start), 0, 1);
      mesh.scale.setScalar(1 - absorption * 0.58);
      halo.scale.copy(mesh.scale);
      const residue = THREE.MathUtils.clamp((this.progress - stages[5].start) / 0.08, 0, 1);
      mesh.material.color.copy(golden).lerp(waste, residue);
      if (this.mode === 'toxic') mesh.material.color.set('#22c55e');
      halo.material.color.copy(mesh.material.color);
      light.color.copy(mesh.material.color);
      if (this.progress === 1) this.playing = false;
    },
    update(delta) {
      if (!this.playing || !Number.isFinite(delta)) return;
      const elapsed = Math.max(0, delta) * this.speed;
      if (this.mode === 'toxic' && this.response === 'vomit') {
        if (this.direction === -1) {
          this.seek(this.progress - elapsed * 2 / 9);
          if (this.progress === 0) this.playing = false;
          return;
        }
        const trigger = 0.23;
        if (this.progress >= trigger) {
          this.seek(trigger);
          this.contraction += elapsed;
          if (this.contraction >= 1) this.direction = -1;
          return;
        }
        this.seek(Math.min(trigger, this.progress + elapsed / 90));
        return;
      }
      const multiplier = this.mode === 'toxic' && this.progress >= stages[3].start ? 6 : 1;
      this.seek(this.progress + elapsed * multiplier / 90);
    },
  };
  journey.seek(0);
  return journey;
}
