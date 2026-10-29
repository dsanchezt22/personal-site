import { Matrix4, Mesh } from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

// Bake fixed children into their parent's coordinates, keeping animated meshes separate.
export function mergeStaticMeshes(parent, animated = new Set()) {
  parent.updateWorldMatrix(true, true);
  const inverse = parent.matrixWorld.clone().invert();
  const batches = new Map();
  parent.traverse((object) => {
    if (!object.isMesh || animated.has(object)) return;
    const key = `${object.material.uuid}:${object.castShadow}:${object.receiveShadow}`;
    if (!batches.has(key)) batches.set(key, []);
    batches.get(key).push(object);
  });
  for (const objects of batches.values()) {
    if (objects.length < 2) continue;
    const geometries = objects.map((object) => {
      const geometry = object.geometry.index
        ? object.geometry.toNonIndexed() : object.geometry.clone();
      return geometry.applyMatrix4(new Matrix4().multiplyMatrices(inverse, object.matrixWorld));
    });
    const merged = new Mesh(mergeGeometries(geometries), objects[0].material);
    merged.castShadow = objects[0].castShadow;
    merged.receiveShadow = objects[0].receiveShadow;
    objects.forEach((object) => {
      object.removeFromParent();
    });
    geometries.forEach((geometry) => geometry.dispose());
    parent.add(merged);
  }
}
