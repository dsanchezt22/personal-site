import assert from "node:assert/strict";
import { Group, Mesh, BoxGeometry, MeshStandardMaterial, Box3, Vector3 } from "three";
import { mergeStaticMeshes } from "../scene-geometry.js";
const parent = new Group(), nested = new Group();
parent.position.set(4, 2, -3);
parent.rotation.y = 0.7;
nested.position.set(2, 0, 1);
nested.rotation.z = 0.3;
parent.add(nested);
const material = new MeshStandardMaterial();
for (let i = 0; i < 3; i++) {
  const mesh = new Mesh(new BoxGeometry(1, 2, 1), material);
  mesh.position.x = i * 2;
  mesh.castShadow = true;
  nested.add(mesh);
}
const moving = nested.children[2];
function vertices(root) {
  root.updateWorldMatrix(true, true);
  const result = [];
  root.traverse(object => {
    if (!object.isMesh) return;
    const position = object.geometry.attributes.position;
    const index = object.geometry.index;
    for (let i = 0; i < (index ? index.count : position.count); i++) {
      const point = new Vector3().fromBufferAttribute(position, index ? index.getX(i) : i)
        .applyMatrix4(object.matrixWorld);
      result.push(point.toArray().map(value => Math.round(value * 10000)).join(","));
    }
  });
  return result.sort();
}
const beforeVertices = vertices(parent);
const before = new Box3().setFromObject(parent);
mergeStaticMeshes(parent, new Set([moving]));
const after = new Box3().setFromObject(parent);
assert.deepEqual(vertices(parent), beforeVertices, "Every triangle retains its world-space vertices");
assert.ok(before.min.distanceTo(after.min) < 1e-6);
assert.ok(before.max.distanceTo(after.max) < 1e-6);
assert.equal(moving.parent, nested, "Animated objects keep their original transform hierarchy");
assert.equal(parent.children.filter(o => o.isMesh).length, 1);
assert.equal(parent.children.find(o => o.isMesh).material, material);
assert.equal(parent.children.find(o => o.isMesh).castShadow, true);
moving.position.y = 2;
assert.ok(new Box3().setFromObject(parent).max.y > after.max.y, "Animation still changes real geometry");
console.log("PASS: static batching preserves world bounds, materials, shadows, and independent animation.");
