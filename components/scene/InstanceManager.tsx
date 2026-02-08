import React, { useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { useDisposable } from '../../hooks/useDisposable';

interface InstanceManagerProps {
    data: any[]; // Array de instâncias do Digital Stock (AssemblyInstance)
}

export const InstanceManager: React.FC<InstanceManagerProps> = ({ data }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const tempObject = new THREE.Object3D();

    // Missão: Dispose Automático para manter o kernel leve e performante
    useDisposable(meshRef);

    useLayoutEffect(() => {
        if (!meshRef.current) return;

        data.forEach((inst, i) => {
            // Aplicar transformações sem criar novos objetos (Eficiência 10D)
            tempObject.position.set(inst.position.x, inst.position.y, inst.position.z);
            tempObject.rotation.set(0, inst.rotation || 0, 0);
            
            // Escala baseada na camada ou padrão unitário
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
            onPointerMissed={() => {}}
        >
            <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
            <meshStandardMaterial color="#00ff41" metalness={0.8} roughness={0.2} />
        </instancedMesh>
    );
};