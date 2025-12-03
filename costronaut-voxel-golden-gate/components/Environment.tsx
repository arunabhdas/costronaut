import React from 'react';
import { COLORS, BRIDGE_LENGTH } from '../constants';

const Environment: React.FC = () => {
  return (
    <group>
      {/* Marin Headlands (Left/North) */}
      <mesh position={[-BRIDGE_LENGTH/2 - 60, 10, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
        <coneGeometry args={[80, 150, 4]} />
        <meshStandardMaterial color="#2d4c1e" roughness={1} />
      </mesh>
      <mesh position={[-BRIDGE_LENGTH/2 - 20, -5, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[30, 40, 30, 8]} />
        <meshStandardMaterial color="#4a4a4a" roughness={1} />
      </mesh>

      {/* SF Peninsula (Right/South) */}
      <mesh position={[BRIDGE_LENGTH/2 + 60, 10, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
         <coneGeometry args={[70, 120, 5]} />
         <meshStandardMaterial color="#3a3a3a" roughness={1} />
      </mesh>
      
      {/* Stylized City Blocks (SF Side) */}
      {Array.from({ length: 20 }).map((_, i) => (
          <mesh 
            key={i} 
            position={[
                BRIDGE_LENGTH/2 + 30 + Math.random() * 80, 
                5 + Math.random() * 10, 
                (Math.random() - 0.5) * 80
            ]}
            castShadow
          >
              <boxGeometry args={[5, 10 + Math.random() * 40, 5]} />
              <meshStandardMaterial color="#555" />
              {/* Windows emission could go here */}
          </mesh>
      ))}
    </group>
  );
};

export default Environment;
