import * as THREE from 'three';
import { stages } from './digestive-data.js';

export function createAnatomy() {
  const group = new THREE.Group();
  const small = [[0.25, 1.25, 0], [-0.7, 0.9, 0]];
  for (let row = 0; row < 6; row++) {
    const y = 0.55 - row * 0.52;
    const direction = row % 2 === 0 ? 1 : -1;
    for (let step = 0; step <= 8; step++) {
      const x = direction * (-1.35 + step * 2.7 / 8);
      small.push([x, y + Math.sin(step / 8 * Math.PI) * 0.13, Math.sin(step / 8 * Math.PI * 2 + row) * 0.22]);
    }
  }
  small.push([-1.55, -2.4, 0], [-2.05, -2.35, 0]);
  const paths = [
    [[0, 5.5, 0.1], [0, 5.3, 0.04], [0, 5.05, 0]],
    [[0, 5.05, 0], [0, 4.6, 0], [0, 3.65, 0]],
    [[0, 3.65, 0], [0.6, 3.45, 0], [1.2, 3.0, 0], [1.2, 2.25, 0], [0.65, 1.9, 0]],
    [[0.65, 1.9, 0], [0.1, 2.0, 0], [-0.1, 1.65, 0], [0.25, 1.25, 0]],
    small,
    [[-2.05, -2.35, 0], [-2.3, -1.6, 0], [-2.3, 0, 0], [-2.25, 1.55, 0], [-1.7, 1.95, -0.6], [0, 1.75, -1.4], [1.85, 1.85, -1.2], [2.35, 1.35, 0], [2.35, -0.5, 0], [2.25, -2.25, 0], [1.5, -2.8, 0], [0.35, -2.95, 0], [0, -3.4, 0]],
    [[0, -3.4, 0], [0, -3.9, 0.05], [0, -4.5, 0.15]],
  ];
  const radii = [0.19, 0.19, 0.22, 0.16, 0.16, 0.33, 0.23];
  const rest = [];
  const organs = paths.map((points, index) => {
    const curve = new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...point)), false, 'centripetal');
    const segments = index === 4 ? 480 : 180;
    const geometry = new THREE.TubeGeometry(curve, segments, radii[index], 16, false);
    const positions = geometry.attributes.position;
    const centers = [];
    const center = new THREE.Vector3();
    const vertex = new THREE.Vector3();
    for (let ring = 0; ring <= segments; ring++) {
      const t = ring / segments;
      curve.getPointAt(t, center);
      centers.push(center.clone());
      const scale = index === 2 ? 1 + 2.6 * Math.pow(Math.sin(Math.PI * t), 1.2) : index === 5 ? 1 + 0.1 * Math.sin(t * Math.PI * 64) : index === 0 ? 1 + 0.7 * Math.sin(Math.PI * t) : 1;
      for (let side = 0; side <= 16; side++) {
        const offset = ring * 17 + side;
        vertex.fromBufferAttribute(positions, offset).sub(center).multiplyScalar(scale).add(center);
        positions.setXYZ(offset, vertex.x, vertex.y, vertex.z);
      }
    }
    geometry.computeVertexNormals();
    const material = new THREE.MeshPhysicalMaterial({
      color: stages[index].color, roughness: 0.25, clearcoat: 1,
      clearcoatRoughness: 0.12, metalness: 0, transparent: true,
      opacity: 0.62, depthWrite: false, side: THREE.DoubleSide,
      emissive: stages[index].color, emissiveIntensity: 0.025,
    });
    const mesh = new THREE.Mesh(geometry, material);
    const shell = new THREE.Mesh(geometry.clone(), new THREE.MeshBasicMaterial({
      color: '#ffb6a2', transparent: true, opacity: 0,
      side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    const shellPositions = shell.geometry.attributes.position;
    for (let ring = 0; ring <= segments; ring++) {
      center.copy(centers[ring]);
      for (let side = 0; side <= 16; side++) {
        const offset = ring * 17 + side;
        vertex.fromBufferAttribute(shellPositions, offset).sub(center).multiplyScalar(1.06).add(center);
        shellPositions.setXYZ(offset, vertex.x, vertex.y, vertex.z);
      }
    }
    rest.push({ centers, positions: positions.array.slice(), shell: shellPositions.array.slice(), color: material.color.clone(), amount: 0 });
    group.add(mesh, shell);
    return { curve, mesh, shell, stage: stages[index] };
  });
  const accessories = {};
  const addAccessory = (name, geometry, color, position, scale) => {
    const mesh = new THREE.Mesh(geometry, new THREE.MeshPhysicalMaterial({
      color, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.12,
    }));
    mesh.name = name;
    mesh.position.set(...position);
    mesh.scale.set(...scale);
    group.add(mesh);
    accessories[name] = mesh;
    return mesh;
  };
  const liverShape = new THREE.Shape();
  liverShape.moveTo(-1.45, 0.4);
  liverShape.bezierCurveTo(-1.55, 1.0, -0.6, 1.1, 0.6, 0.7);
  liverShape.bezierCurveTo(1.0, 0.55, 1.05, 0.3, 0.65, 0.05);
  liverShape.bezierCurveTo(0.1, -0.3, -0.9, -0.65, -1.15, -0.3);
  liverShape.bezierCurveTo(-1.35, -0.1, -1.45, 0.15, -1.45, 0.4);
  addAccessory('liver', new THREE.ExtrudeGeometry(liverShape, {
    depth: 0.35, bevelEnabled: true, bevelSegments: 4, steps: 1, bevelSize: 0.16, bevelThickness: 0.16, curveSegments: 24,
  }), '#71362d', [-0.85, 2.75, -0.75], [1, 1, 1]);
  const pear = [[0, -0.42], [0.12, -0.39], [0.23, -0.25], [0.24, -0.08], [0.17, 0.12], [0.08, 0.32], [0.05, 0.52], [0, 0.55]];
  const gallbladder = addAccessory('gallbladder', new THREE.LatheGeometry(pear.map(point => new THREE.Vector2(...point)), 32), '#7b803d', [-1.0, 2.25, -0.12], [1, 1, 1]);
  gallbladder.rotation.z = -0.25;
  const pancreasCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.25, 1.65, -0.48), new THREE.Vector3(0.25, 1.9, -0.58), new THREE.Vector3(0.95, 2.0, -0.65), new THREE.Vector3(1.65, 2.15, -0.7),
  ]);
  const pancreasGeometry = new THREE.TubeGeometry(pancreasCurve, 64, 0.22, 16, false);
  const pancreasPositions = pancreasGeometry.attributes.position;
  const center = new THREE.Vector3();
  const vertex = new THREE.Vector3();
  for (let ring = 0; ring <= 64; ring++) {
    const t = ring / 64;
    pancreasCurve.getPointAt(t, center);
    for (let side = 0; side <= 16; side++) {
      const offset = ring * 17 + side;
      vertex.fromBufferAttribute(pancreasPositions, offset).sub(center).multiplyScalar((1 - t) * 0.9 + 0.08).add(center);
      pancreasPositions.setXYZ(offset, vertex.x, vertex.y, vertex.z);
    }
  }
  pancreasGeometry.computeVertexNormals();
  addAccessory('pancreas', pancreasGeometry, '#eee0b9', [0, 0, 0], [1, 1, 1]);
  const red = new THREE.Color('#d52b35');
  return {
    group, organs, accessories,
    highlight(index, delta) {
      for (const [i, organ] of organs.entries()) {
        const factor = 1 - Math.exp(-delta * 8);
        organ.mesh.material.emissiveIntensity = THREE.MathUtils.lerp(organ.mesh.material.emissiveIntensity, i === index ? 0.35 : 0.025, factor);
        organ.shell.material.opacity = THREE.MathUtils.lerp(organ.shell.material.opacity, i === index ? 0.3 : 0, factor);
      }
    },
    react(stageIndex, mode, response, time, delta) {
      time = Number.isFinite(time) ? time : 0;
      const factor = 1 - Math.exp(-Math.max(0, Number.isFinite(delta) ? delta : 0) * 12);
      for (const [i, organ] of organs.entries()) {
        const state = rest[i];
        const stomach = i === 2 && stageIndex === 2;
        const intestine = i >= 4 && stageIndex >= 4 && response === 'diarrhea';
        const target = mode === 'toxic' && (stomach || intestine) ? 1 : 0;
        const previous = state.amount;
        state.amount = mode === 'normal' ? 0 : THREE.MathUtils.lerp(previous, target, factor);
        if (target === 0 && state.amount < 0.0001) state.amount = 0;
        organ.mesh.material.color.copy(state.color).lerp(red, i >= 4 ? state.amount * 0.75 : state.amount * 0.3);
        organ.mesh.material.emissive.copy(state.color).lerp(red, state.amount * 0.6);
        organ.shell.material.color.set('#ffb6a2').lerp(red, state.amount * 0.6);
        for (const [mesh, base] of [[organ.mesh, state.positions], [organ.shell, state.shell]]) {
          if (mode === 'normal') {
            mesh.position.set(0, 0, 0);
            mesh.rotation.set(0, 0, 0);
            mesh.scale.set(1, 1, 1);
          }
          if (state.amount === 0 && previous === 0) continue;
          const positions = mesh.geometry.attributes.position;
          positions.array.set(base);
          if (state.amount > 0) {
            const segments = state.centers.length - 1;
            for (let ring = 1; ring < segments; ring++) {
              const t = ring / segments;
              const envelope = Math.sin(Math.PI * t) ** 2;
              const pulse = i === 2 ? Math.sin(time * 9) * 0.1 : Math.sin(t * Math.PI * 18 - time * 16) * 0.12;
              center.copy(state.centers[ring]);
              for (let side = 0; side <= 16; side++) {
                const offset = ring * 17 + side;
                const shake = i === 2 ? Math.cos(side / 16 * Math.PI * 2) * Math.sin(time * 25) * 0.035 : 0;
                vertex.fromBufferAttribute(positions, offset).sub(center).multiplyScalar(1 + state.amount * envelope * (pulse + shake)).add(center);
                positions.setXYZ(offset, vertex.x, vertex.y, vertex.z);
              }
            }
          }
          positions.needsUpdate = true;
          mesh.geometry.computeVertexNormals();
          mesh.geometry.computeBoundingSphere();
        }
      }
    },
  };
}
