
import { Vector3, Quaternion } from 'three';

export const generateCurvePoints = (p1: Vector3, p2: Vector3, radius: number, segments: number = 20): Vector3[] => {
  const points: Vector3[] = [];
  const v1 = p1.clone().normalize();
  const v2 = p2.clone().normalize();
  const angle = v1.angleTo(v2);
  const axis = new Vector3().crossVectors(v1, v2).normalize();

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const q = new Quaternion().setFromAxisAngle(axis, angle * t);
    const point = v1.clone().applyQuaternion(q).multiplyScalar(radius);
    points.push(point);
  }
  return points;
};
