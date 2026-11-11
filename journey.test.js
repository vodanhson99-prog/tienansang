import assert from 'node:assert/strict';
import * as data from './public/js/digestive-data.js';
import * as anatomy from './public/js/anatomy.js';
import * as food from './public/js/food-particle.js';

assert.equal(data.stages?.length, 5, 'Có đủ 5 giai đoạn tiêu hóa');
const model = anatomy.createAnatomy();
assert.equal(model.organs.length, 5);
for (let i = 0; i < 4; i++) {
  assert.ok(model.organs[i].curve.getPoint(1).distanceTo(model.organs[i + 1].curve.getPoint(0)) < 1e-6);
}
for (const organ of model.organs) {
  assert.ok([...organ.mesh.geometry.attributes.position.array].every(Number.isFinite));
  assert.equal(organ.mesh.material.roughness, 0.25);
  assert.equal(organ.mesh.material.clearcoat, 1);
}
const journey = food.createFoodParticle(model.organs);
journey.seek(0.45);
assert.equal(journey.stageIndex, 2);
const initialSize = journey.mesh.scale.x;
journey.seek(0.64);
assert.ok(journey.mesh.scale.x < initialSize);
journey.seek(0.85);
assert.equal(journey.stageIndex, 3);
journey.seek(-1);
assert.equal(journey.progress, 0);
journey.seek(2);
assert.equal(journey.progress, 1);
journey.seek(0.2);
journey.playing = false;
journey.update(10);
assert.equal(journey.progress, 0.2);
journey.playing = true;
journey.update(1000);
assert.equal(journey.progress, 1);
assert.equal(journey.playing, false);
console.log('PASS: 5 stages, continuous geometry, materials, absorption, seek, pause and completion');
