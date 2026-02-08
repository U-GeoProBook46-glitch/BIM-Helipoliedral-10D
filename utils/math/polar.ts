import { Vector3 } from 'three';

export const PHI = 1.61803398875;

export const toVec3 = (radius: number, theta: number, phi: number): Vector3 => {
  return new Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};

export const toPolar = (vec: Vector3) => {
  const r = vec.length();
  const theta = Math.atan2(vec.z, vec.x);
  const phi = Math.acos(vec.y / (r || 1));
  return { r, theta, phi };
};

export const snapPolar = (theta: number, phi: number, divisions: number = 24) => {
  const snap = (Math.PI * 2) / divisions;
  const snappedTheta = Math.round(theta / snap) * snap;
  const snappedPhi = Math.round(phi / snap) * snap;
  return { snappedTheta, snappedPhi };
};

export const snapToPrecisionLines = (vec: Vector3, radius: number): Vector3 => {
  const { theta, phi } = toPolar(vec);
  const { snappedTheta, snappedPhi } = snapPolar(theta, phi);
  return toVec3(radius, snappedTheta, snappedPhi);
};

export const determineDomain = (points: Vector3[]): string => {
  if (points.length < 3) return "CHIP";
  const avgDist = points.reduce((acc, p, i) => {
    if (i === 0) return acc;
    return acc + p.distanceTo(points[i-1]);
  }, 0) / (points.length - 1);
  return avgDist > 50 ? "BIM" : "AUTO";
};