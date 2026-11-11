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
    [[0, 5.5, 0], [0, 4.6, 0], [0, 3.65, 0]],
    [[0, 3.65, 0], [0.6, 3.45, 0], [1.2, 3.0, 0], [1.2, 2.25, 0], [0.65, 1.9, 0], [0.1, 2.0, 0], [-0.1, 1.65, 0], [0.25, 1.25, 0]],
    small,
    [[-2.05, -2.35, 0], [-2.3, -1.6, 0], [-2.3, 0, 0], [-2.25, 1.55, 0], [-1.7, 1.95, -0.6], [0, 1.75, -1.4], [1.85, 1.85, -1.2], [2.35, 1.35, 0], [2.35, -0.5, 0], [2.25, -2.25, 0], [1.5, -2.8, 0], [0.35, -2.95, 0], [0, -3.4, 0]],
    [[0, -3.4, 0], [0, -3.9, 0.05], [0, -4.5, 0.15]],
  ];
  const radii = [0.19, 0.22, 0.16, 0.33, 0.23];
  const organs = paths.map((points, index) => {
    const curve = new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...point)), false, 'centripetal');
    const segments = index === 2 ? 480 : 180;
    const geometry = new THREE.TubeGeometry(curve, segments, radii[index], 16, false);
    const positions = geometry.attributes.position;
    const center = new THREE.Vector3();
    const vertex = new THREE.Vector3();
    for (let ring = 0; ring <= segments; ring++) {
      const t = ring / segments;
      curve.getPointAt(t, center);
      const scale = index === 1 ? 1 + 2.6 * Math.pow(Math.sin(Math.PI * t), 1.2) : index === 3 ? 1 + 0.1 * Math.sin(t * Math.PI * 64) : 1;
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
      curve.getPointAt(ring / segments, center);
      for (let side = 0; side <= 16; side++) {
        const offset = ring * 17 + side;
        vertex.fromBufferAttribute(shellPositions, offset).sub(center).multiplyScalar(1.06).add(center);
        shellPositions.setXYZ(offset, vertex.x, vertex.y, vertex.z);
      }
    }
    group.add(mesh, shell);
    return { curve, mesh, shell, stage: stages[index] };
  });
  return {
    group, organs,
    highlight(index, delta) {
      for (const [i, organ] of organs.entries()) {
        const factor = 1 - Math.exp(-delta * 8);
        organ.mesh.material.emissiveIntensity = THREE.MathUtils.lerp(organ.mesh.material.emissiveIntensity, i === index ? 0.35 : 0.025, factor);
        organ.shell.material.opacity = THREE.MathUtils.lerp(organ.shell.material.opacity, i === index ? 0.3 : 0, factor);
      }
    },
  };
}
