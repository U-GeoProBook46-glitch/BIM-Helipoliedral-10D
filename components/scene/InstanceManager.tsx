import React, { useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { useDisposable } from '../../hooks/useDisposable';

interface InstanceManagerProps {
    data: any[]; 
}

export const InstanceManager: React.FC<InstanceManagerProps> = ({ data }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const tempObject = new THREE.Object3D();

    useDisposable(meshRef);

    useLayoutEffect(() => {
        if (!meshRef.current) return;

        data.forEach((inst, i) => {
            tempObject.position.set(inst.position.x, inst.position.y, inst.position.z);
            tempObject.rotation.set(0, inst.rotation || 0, 0);
            const scale = inst.scale || 1.0;
            tempObject.scale.setScalar(scale);
            tempObject.updateMatrix();
            meshRef.current!.setMatrixAt(i, tempObject.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    }, [data]);

    return (
        <instancedMesh 
            ref={meshRef} 
            args={[null!, null!, data.length]} 
        >
            <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
            <meshStandardMaterial color="#00ff41" metalness={0.8} roughness={0.2} />
        </instancedMesh>
    );
};