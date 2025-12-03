import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BRIDGE_LENGTH, DECK_HEIGHT, ROAD_WIDTH } from '../constants';

interface TrafficProps {
  density: number; // 0 to 100
  isNight: boolean;
}

const Traffic: React.FC<TrafficProps> = ({ density, isNight }) => {
  const maxCars = 400;
  const activeCars = Math.floor((density / 100) * maxCars);

  // Mesh Refs
  const chassisMesh = useRef<THREE.InstancedMesh>(null);
  const headLightMesh = useRef<THREE.InstancedMesh>(null);
  const tailLightMesh = useRef<THREE.InstancedMesh>(null);

  // Car Data (Static random properties)
  const cars = useMemo(() => {
    return new Array(maxCars).fill(0).map((_, i) => ({
      speed: (0.2 + Math.random() * 0.3) * (Math.random() > 0.5 ? 1 : -1), // Random direction
      offset: Math.random() * BRIDGE_LENGTH,
      laneOffset: (Math.random() - 0.5) * (ROAD_WIDTH * 0.6), // Randomize slightly within lane
      color: new THREE.Color().setHSL(Math.random(), 0.8, 0.5),
      size: 0.8 + Math.random() * 0.4
    }));
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!chassisMesh.current || !headLightMesh.current || !tailLightMesh.current) return;

    const time = state.clock.getElapsedTime();

    cars.forEach((car, i) => {
      // Hide excess cars if density is low
      if (i >= activeCars) {
        dummy.position.set(0, -1000, 0); // Move out of view
        dummy.updateMatrix();
        chassisMesh.current!.setMatrixAt(i, dummy.matrix);
        headLightMesh.current!.setMatrixAt(i, dummy.matrix);
        tailLightMesh.current!.setMatrixAt(i, dummy.matrix);
        return;
      }

      // Calculate Loop Position
      // speed * time + offset modulo Bridge Length
      let zPos = (time * 10 * car.speed + car.offset) % BRIDGE_LENGTH;
      if (zPos < 0) zPos += BRIDGE_LENGTH;
      zPos -= BRIDGE_LENGTH / 2; // Center around 0

      const laneX = car.speed > 0 ? (ROAD_WIDTH / 4) : -(ROAD_WIDTH / 4);
      const xPos = laneX + car.laneOffset * 0.2; // Add little jitter

      // Chassis
      dummy.position.set(zPos, DECK_HEIGHT + 0.8, xPos);
      dummy.rotation.set(0, car.speed > 0 ? 0 : Math.PI, 0);
      dummy.scale.set(car.size * 2, car.size, car.size); // Car proportions
      dummy.updateMatrix();
      
      chassisMesh.current!.setMatrixAt(i, dummy.matrix);
      chassisMesh.current!.setColorAt(i, car.color);

      // Headlights (White/Yellow)
      dummy.scale.set(0.2, 0.2, 0.2);
      dummy.position.set(zPos + (car.speed > 0 ? car.size : -car.size), DECK_HEIGHT + 0.8, xPos + 0.3);
      dummy.updateMatrix();
      headLightMesh.current!.setMatrixAt(i * 2, dummy.matrix);
      dummy.position.set(zPos + (car.speed > 0 ? car.size : -car.size), DECK_HEIGHT + 0.8, xPos - 0.3);
      dummy.updateMatrix();
      headLightMesh.current!.setMatrixAt(i * 2 + 1, dummy.matrix);

      // Taillights (Red)
      dummy.position.set(zPos - (car.speed > 0 ? car.size : -car.size), DECK_HEIGHT + 0.8, xPos + 0.3);
      dummy.updateMatrix();
      tailLightMesh.current!.setMatrixAt(i * 2, dummy.matrix);
      dummy.position.set(zPos - (car.speed > 0 ? car.size : -car.size), DECK_HEIGHT + 0.8, xPos - 0.3);
      dummy.updateMatrix();
      tailLightMesh.current!.setMatrixAt(i * 2 + 1, dummy.matrix);
    });

    chassisMesh.current.instanceMatrix.needsUpdate = true;
    if (chassisMesh.current.instanceColor) chassisMesh.current.instanceColor.needsUpdate = true;
    headLightMesh.current.instanceMatrix.needsUpdate = true;
    tailLightMesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={chassisMesh} args={[undefined, undefined, maxCars]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.5} metalness={0.7} />
      </instancedMesh>

      {/* Headlights */}
      <instancedMesh ref={headLightMesh} args={[undefined, undefined, maxCars * 2]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </instancedMesh>

      {/* Taillights */}
      <instancedMesh ref={tailLightMesh} args={[undefined, undefined, maxCars * 2]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#ff0000" toneMapped={false} />
      </instancedMesh>
    </group>
  );
};

export default Traffic;
