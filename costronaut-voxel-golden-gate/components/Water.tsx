import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS } from '../constants';

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;
  uniform float uTime;

  // Simple pseudo-random
  float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  // Value Noise
  float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Gerstner-like waves + Noise
    float wave1 = sin(pos.x * 0.1 + uTime * 0.5) * 0.5;
    float wave2 = cos(pos.z * 0.05 + uTime * 0.3) * 0.5;
    float n = noise(pos.xz * 0.2 + uTime * 0.2) * 0.8;
    
    pos.y += wave1 + wave2 + n;

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vWorldPosition = worldPos.xyz;
    vec4 mvPosition = viewMatrix * worldPos;
    vViewPosition = -mvPosition.xyz;
    
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;
  
  uniform float uTime;
  uniform vec3 uColorDeep;
  uniform vec3 uColorShallow;
  uniform vec3 uSunPosition;
  uniform float uFogDensity;
  uniform vec3 uFogColor;

  void main() {
    // Basic water color gradient based on height/noise approximation
    float noiseVal = sin(vWorldPosition.x * 0.2 + uTime) * sin(vWorldPosition.z * 0.2 + uTime);
    vec3 waterColor = mix(uColorDeep, uColorShallow, smoothstep(-2.0, 2.0, vWorldPosition.y + noiseVal));

    // Specular Highlight (Sun Reflection)
    vec3 viewDir = normalize(vViewPosition);
    vec3 normal = normalize(vec3(
      sin(vWorldPosition.x * 0.5 + uTime), 
      10.0, 
      sin(vWorldPosition.z * 0.5 + uTime)
    ));
    
    vec3 lightDir = normalize(uSunPosition);
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 64.0);
    
    // Add specular to water
    vec3 finalColor = waterColor + spec * vec3(1.0, 0.9, 0.7) * 0.5;

    // Distance-based Fog (Manual exponential squared fog)
    float dist = length(vViewPosition);
    float fogFactor = 1.0 - exp(- (dist * uFogDensity * 0.005) * (dist * uFogDensity * 0.005));
    
    finalColor = mix(finalColor, uFogColor, fogFactor);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

interface WaterProps {
  timeOfDay: number;
  fogDensity: number;
  fogColor: THREE.Color;
}

const Water: React.FC<WaterProps> = ({ timeOfDay, fogDensity, fogColor }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Calculate sun position based on time (0-24)
  const sunPos = useMemo(() => {
    const angle = ((timeOfDay - 6) / 24) * Math.PI * 2; // Sunrise at 6
    const y = Math.sin(angle) * 100;
    const x = Math.cos(angle) * 100;
    return new THREE.Vector3(x, y, -50); // Offset z slightly
  }, [timeOfDay]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      materialRef.current.uniforms.uSunPosition.value.copy(sunPos);
      materialRef.current.uniforms.uFogDensity.value = fogDensity;
      materialRef.current.uniforms.uFogColor.value = fogColor;
    }
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorDeep: { value: new THREE.Color(COLORS.WATER_DEEP) },
      uColorShallow: { value: new THREE.Color(COLORS.WATER_SHALLOW) },
      uSunPosition: { value: new THREE.Vector3(0, 50, 0) },
      uFogDensity: { value: 50 },
      uFogColor: { value: new THREE.Color(0x000000) },
    }),
    []
  );

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[1000, 1000, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
};

export default Water;
