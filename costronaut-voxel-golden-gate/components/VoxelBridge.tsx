import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { COLORS, BRIDGE_LENGTH, TOWER_HEIGHT, DECK_HEIGHT, TOWER_WIDTH, ROAD_WIDTH } from '../constants';

// A component to manage instanced cubes for the bridge
const VoxelBridge: React.FC<{ isNight: boolean }> = ({ isNight }) => {
  const redMeshRef = useRef<THREE.InstancedMesh>(null);
  const concreteMeshRef = useRef<THREE.InstancedMesh>(null);
  const roadMeshRef = useRef<THREE.InstancedMesh>(null);
  const cableMeshRef = useRef<THREE.InstancedMesh>(null);
  const lightMeshRef = useRef<THREE.InstancedMesh>(null);

  // Generate geometry data once
  const { redInstances, concreteInstances, roadInstances, cableInstances, lightInstances } = useMemo(() => {
    const rInstances: THREE.Matrix4[] = [];
    const cInstances: THREE.Matrix4[] = [];
    const rdInstances: THREE.Matrix4[] = [];
    const cbInstances: THREE.Matrix4[] = [];
    const lInstances: THREE.Matrix4[] = [];

    const tempMat = new THREE.Matrix4();
    const tempPos = new THREE.Vector3();
    const tempScale = new THREE.Vector3();
    const tempQuat = new THREE.Quaternion();

    const addInstance = (list: THREE.Matrix4[], x: number, y: number, z: number, sx: number, sy: number, sz: number, rx = 0, ry = 0, rz = 0) => {
      tempPos.set(x, y, z);
      tempScale.set(sx, sy, sz);
      tempQuat.setFromEuler(new THREE.Euler(rx, ry, rz));
      tempMat.compose(tempPos, tempQuat, tempScale);
      list.push(tempMat.clone());
    };

    // --- Towers ---
    const towerXPositions = [-BRIDGE_LENGTH / 4, BRIDGE_LENGTH / 4];
    
    towerXPositions.forEach((tx) => {
      // Concrete Base
      addInstance(cInstances, tx, 0, 0, TOWER_WIDTH * 1.5, DECK_HEIGHT, ROAD_WIDTH * 1.5);
      
      // Two Legs
      const legOffset = ROAD_WIDTH / 2 + 1;
      const legSize = 3;
      
      for (let h = DECK_HEIGHT; h < TOWER_HEIGHT; h += 2) {
         // Tapering logic
         const taper = 1 - ((h - DECK_HEIGHT) / (TOWER_HEIGHT - DECK_HEIGHT)) * 0.3;
         const currentSize = legSize * taper;

         // South Leg
         addInstance(rInstances, tx, h, legOffset, currentSize, 2, currentSize);
         // North Leg
         addInstance(rInstances, tx, h, -legOffset, currentSize, 2, currentSize);

         // Cross Braces (every 10 units)
         if ((h - DECK_HEIGHT) % 12 < 2 && h > DECK_HEIGHT + 5) {
             addInstance(rInstances, tx, h, 0, currentSize * 0.8, 1, legOffset * 2);
         }
      }

      // Top Beacon Light
      addInstance(lInstances, tx, TOWER_HEIGHT, legOffset, 0.5, 0.5, 0.5);
      addInstance(lInstances, tx, TOWER_HEIGHT, -legOffset, 0.5, 0.5, 0.5);
    });

    // --- Deck ---
    // Main Span and Approaches
    const deckSegments = 100;
    const segmentLen = BRIDGE_LENGTH / deckSegments;
    for (let i = 0; i < deckSegments; i++) {
        const x = -BRIDGE_LENGTH / 2 + i * segmentLen;
        // Road
        addInstance(rdInstances, x, DECK_HEIGHT, 0, segmentLen, 0.5, ROAD_WIDTH);
        
        // Side railings (Red)
        addInstance(rInstances, x, DECK_HEIGHT + 1, ROAD_WIDTH / 2, segmentLen, 1, 0.5);
        addInstance(rInstances, x, DECK_HEIGHT + 1, -ROAD_WIDTH / 2, segmentLen, 1, 0.5);

        // Street Lights (every 5 segments)
        if (i % 5 === 0) {
            // Poles
            addInstance(rInstances, x, DECK_HEIGHT + 2, 0, 0.2, 4, 0.2);
            // Light bulb (emissive)
            addInstance(lInstances, x, DECK_HEIGHT + 4, 0, 0.3, 0.3, 0.3);
        }
    }

    // --- Main Cables ---
    // Catenary curve approximation: y = a * cosh(x/a)
    // We'll just use a parabola for simplicity: y = x^2 * k
    const cablePoints = 100;
    const spanStart = towerXPositions[0];
    const spanEnd = towerXPositions[1];
    const spanWidth = spanEnd - spanStart;
    
    // Main Span
    for (let i = 0; i <= cablePoints; i++) {
        const t = i / cablePoints;
        const x = spanStart + t * spanWidth;
        
        // Sag calculation (0 at towers, lowest in middle)
        // Normalized x from -1 to 1
        const nx = (t - 0.5) * 2;
        const sag = (nx * nx) * (TOWER_HEIGHT - DECK_HEIGHT - 5);
        const y = (TOWER_HEIGHT) - (TOWER_HEIGHT - DECK_HEIGHT - 5) + sag;
        
        // Add cable segment (South side)
        addInstance(rInstances, x, y, ROAD_WIDTH / 2 + 1, 0.8, 0.8, 0.8);
        // North side
        addInstance(rInstances, x, y, -(ROAD_WIDTH / 2 + 1), 0.8, 0.8, 0.8);

        // Vertical Suspenders (every few units)
        if (i % 4 === 0) {
            const height = y - DECK_HEIGHT;
            addInstance(rInstances, x, DECK_HEIGHT + height / 2, ROAD_WIDTH / 2 + 1, 0.2, height, 0.2);
            addInstance(rInstances, x, DECK_HEIGHT + height / 2, -(ROAD_WIDTH / 2 + 1), 0.2, height, 0.2);
        }
    }

    // Back spans (Tower to shore)
    const createBackSpan = (startX: number, endX: number) => {
        for (let i = 0; i <= 30; i++) {
            const t = i / 30;
            const x = startX + t * (endX - startX);
            const y = TOWER_HEIGHT - t * (TOWER_HEIGHT - DECK_HEIGHT);
            addInstance(rInstances, x, y, ROAD_WIDTH/2 + 1, 0.8, 0.8, 0.8);
            addInstance(rInstances, x, y, -(ROAD_WIDTH/2 + 1), 0.8, 0.8, 0.8);
        }
    };
    createBackSpan(towerXPositions[0], -BRIDGE_LENGTH/2); // Left side
    createBackSpan(towerXPositions[1], BRIDGE_LENGTH/2); // Right side

    return {
      redInstances: rInstances,
      concreteInstances: cInstances,
      roadInstances: rdInstances,
      cableInstances: cbInstances,
      lightInstances: lInstances
    };
  }, []);

  // Update logic to apply matrices to InstancedMesh
  const applyInstances = (mesh: THREE.InstancedMesh | null, instances: THREE.Matrix4[]) => {
    if (mesh) {
      instances.forEach((mat, i) => {
        mesh.setMatrixAt(i, mat);
      });
      mesh.instanceMatrix.needsUpdate = true;
    }
  };

  useEffect(() => {
    applyInstances(redMeshRef.current, redInstances);
    applyInstances(concreteMeshRef.current, concreteInstances);
    applyInstances(roadMeshRef.current, roadInstances);
    applyInstances(cableMeshRef.current, cableInstances);
    applyInstances(lightMeshRef.current, lightInstances);
  }, [redInstances, concreteInstances, roadInstances, cableInstances, lightInstances]);

  return (
    <group>
      {/* Red Bridge Parts */}
      <instancedMesh ref={redMeshRef} args={[undefined, undefined, redInstances.length]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={COLORS.BRIDGE_RED} roughness={0.7} />
      </instancedMesh>

      {/* Concrete Bases */}
      <instancedMesh ref={concreteMeshRef} args={[undefined, undefined, concreteInstances.length]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={COLORS.CONCRETE} roughness={0.9} />
      </instancedMesh>

       {/* Road Deck */}
       <instancedMesh ref={roadMeshRef} args={[undefined, undefined, roadInstances.length]} receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={COLORS.ROAD} roughness={0.8} />
      </instancedMesh>
      
       {/* Lights (Emissive) */}
       <instancedMesh ref={lightMeshRef} args={[undefined, undefined, lightInstances.length]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial 
            color="#ffffcc" 
            emissive="#ffffaa" 
            emissiveIntensity={isNight ? 2 : 0} 
            toneMapped={false} 
        />
      </instancedMesh>
    </group>
  );
};

export default VoxelBridge;
