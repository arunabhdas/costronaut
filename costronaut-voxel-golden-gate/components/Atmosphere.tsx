import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sky, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { COLORS } from '../constants';

interface AtmosphereProps {
  timeOfDay: number; // 0-24
  fogDensity: number; // 0-100
  setFogColor: (color: THREE.Color) => void;
}

const Atmosphere: React.FC<AtmosphereProps> = ({ timeOfDay, fogDensity, setFogColor }) => {
  // Helpers
  const isNight = timeOfDay < 5 || timeOfDay > 20;
  
  // Calculate Sun Position
  const sunPosition = useMemo(() => {
    const angle = ((timeOfDay - 6) / 24) * Math.PI * 2;
    // Sun moves East to West (approx)
    return new THREE.Vector3(Math.cos(angle) * 100, Math.sin(angle) * 100, -20);
  }, [timeOfDay]);

  // Dynamic Colors
  const { skyColor, lightColor, lightIntensity, ambientIntensity, fogCol } = useMemo(() => {
    const t = timeOfDay;
    const c = new THREE.Color();
    const f = new THREE.Color();
    let lInt = 1;
    let aInt = 0.5;

    // Sunrise (5-7)
    if (t >= 5 && t < 7) {
        const p = (t - 5) / 2;
        c.set(COLORS.SKY_NIGHT_BOTTOM).lerp(new THREE.Color(COLORS.SUNSET_ORANGE), p);
        f.set(COLORS.SKY_NIGHT_BOTTOM).lerp(new THREE.Color(COLORS.SUNSET_ORANGE), p);
        lInt = p * 1.5;
        aInt = 0.3 + p * 0.3;
    } 
    // Day (7-17)
    else if (t >= 7 && t < 17) {
        c.set(COLORS.SKY_DAY_BOTTOM);
        f.set('#e0f7fa'); // Light foggy blue
        lInt = 2;
        aInt = 0.8;
    }
    // Sunset (17-19)
    else if (t >= 17 && t < 19) {
        const p = (t - 17) / 2;
        c.set(COLORS.SKY_DAY_BOTTOM).lerp(new THREE.Color(COLORS.SUNSET_PURPLE), p);
        f.set('#e0f7fa').lerp(new THREE.Color(COLORS.SUNSET_PURPLE), p);
        lInt = 2 - p * 1.8;
        aInt = 0.8 - p * 0.5;
    }
    // Night (19-5)
    else {
        c.set(COLORS.SKY_NIGHT_BOTTOM);
        f.set('#0a0a10');
        lInt = 0.1;
        aInt = 0.2;
    }

    return { skyColor: c, lightColor: new THREE.Color('#fff'), lightIntensity: lInt, ambientIntensity: aInt, fogCol: f };
  }, [timeOfDay]);

  // Update parent fog color ref/state for shader
  useFrame(() => {
     setFogColor(fogCol);
  });

  return (
    <>
      {/* Background Color */}
      <color attach="background" args={[skyColor.r, skyColor.g, skyColor.b]} />
      
      {/* Fog - Standard ThreeJS fog for depth blending */}
      <fogExp2 attach="fog" color={fogCol} density={fogDensity > 0 ? (fogDensity / 100) * 0.02 : 0} />

      {/* Main Directional Light (Sun/Moon) */}
      <directionalLight
        position={sunPosition}
        intensity={lightIntensity}
        color={isNight ? "#aaaaff" : "#ffffcc"} // Bluish moonlight, warm sunlight
        castShadow
        shadow-bias={-0.0001}
      />
      
      {/* Ambient Light */}
      <ambientLight intensity={ambientIntensity} color={isNight ? "#111122" : "#ffffff"} />

      {/* Stars at night */}
      {isNight && (
        <Stars radius={200} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      )}
      
      {/* Procedural Sky only visible during day roughly to help lighting */}
      {!isNight && (
          <Sky 
            sunPosition={sunPosition} 
            turbidity={10}
            rayleigh={2}
            mieCoefficient={0.005}
            mieDirectionalG={0.8}
          />
      )}
    </>
  );
};

export default Atmosphere;
