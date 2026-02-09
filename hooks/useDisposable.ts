import { useEffect, RefObject } from 'react';
import * as THREE from 'three';

/**
 * useDisposable Hook
 * Kernel BIM-Helipoliedral 10D: Gestão Soberana de Memória GPU.
 */
export const useDisposable = (ref: RefObject<THREE.Object3D | any>) => {
    useEffect(() => {
        return () => {
            if (ref.current) {
                ref.current.traverse((obj: any) => {
                    if (obj.isMesh) {
                        if (obj.geometry) {
                            obj.geometry.dispose();
                        }
                        if (obj.material) {
                            if (Array.isArray(obj.material)) {
                                obj.material.forEach((m: any) => m.dispose());
                            } else {
                                obj.material.dispose();
                            }
                        }
                    }
                });
                console.log("♻️ GPU Memory Cleared: Assets Disposed");
            }
        };
    }, []);
};