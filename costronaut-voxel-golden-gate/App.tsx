import React, { useState, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats, AdaptiveDpr } from '@react-three/drei';
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing';
import * as THREE from 'three';

import VoxelBridge from './components/VoxelBridge';
import Traffic from './components/Traffic';
import Water from './components/Water';
import Atmosphere from './components/Atmosphere';
import Environment from './components/Environment';
import { SimulationState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<SimulationState>({
    timeOfDay: 12, // Noon
    fogDensity: 10,
    trafficDensity: 50,
    cameraZoom: 1,
  });

  // Ref to hold fog color calculated by Atmosphere to pass to Water
  const [fogColor, setFogColor] = useState(new THREE.Color(0x000000));

  const isNight = state.timeOfDay < 6 || state.timeOfDay > 19;

  return (
    <div className="relative w-full h-full bg-black font-sans text-white">
      
      {/* 3D Scene */}
      <Canvas shadows camera={{ position: [50, 40, 80], fov: 45 }}>
        <AdaptiveDpr pixelated />
        <Suspense fallback={null}>
            {/* World Content */}
            <Atmosphere 
                timeOfDay={state.timeOfDay} 
                fogDensity={state.fogDensity} 
                setFogColor={setFogColor} 
            />
            
            <group scale={[1,1,1]}>
                <VoxelBridge isNight={isNight} />
                <Traffic density={state.trafficDensity} isNight={isNight} />
                <Environment />
                <Water 
                    timeOfDay={state.timeOfDay} 
                    fogDensity={state.fogDensity} 
                    fogColor={fogColor}
                />
            </group>

            {/* Controls */}
            <OrbitControls 
                maxPolarAngle={Math.PI / 2 - 0.05} // Prevent going under water
                minDistance={20}
                maxDistance={300}
                enablePan={true}
            />

            {/* Post Processing */}
            <EffectComposer disableNormalPass>
                <Bloom 
                    luminanceThreshold={isNight ? 0.3 : 1.2} 
                    mipmapBlur 
                    intensity={isNight ? 1.5 : 0.2} 
                    radius={0.6}
                />
                <ToneMapping />
            </EffectComposer>
        </Suspense>
        {/* <Stats /> */}
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 p-6 bg-black/70 backdrop-blur-md rounded-xl border border-white/10 w-80 shadow-2xl">
        <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
          Golden Gate Voxel
        </h1>
        
        <div className="space-y-6">
          {/* Time Control */}
          <div>
            <div className="flex justify-between mb-1">
               <label className="text-xs uppercase tracking-wider text-gray-400">Time of Day</label>
               <span className="text-xs font-mono">{state.timeOfDay.toFixed(1)}h</span>
            </div>
            <input 
                type="range" min="0" max="24" step="0.1" 
                value={state.timeOfDay}
                onChange={(e) => setState({...state, timeOfDay: parseFloat(e.target.value)})}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                <span>Night</span><span>Noon</span><span>Night</span>
            </div>
          </div>

          {/* Fog Control */}
          <div>
             <div className="flex justify-between mb-1">
               <label className="text-xs uppercase tracking-wider text-gray-400">Fog Density</label>
               <span className="text-xs font-mono">{state.fogDensity}%</span>
            </div>
            <input 
                type="range" min="0" max="100" 
                value={state.fogDensity}
                onChange={(e) => setState({...state, fogDensity: parseFloat(e.target.value)})}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-400"
            />
          </div>

          {/* Traffic Control */}
          <div>
             <div className="flex justify-between mb-1">
               <label className="text-xs uppercase tracking-wider text-gray-400">Traffic Density</label>
               <span className="text-xs font-mono">{state.trafficDensity}%</span>
            </div>
            <input 
                type="range" min="0" max="100" 
                value={state.trafficDensity}
                onChange={(e) => setState({...state, trafficDensity: parseFloat(e.target.value)})}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 text-[10px] text-gray-500 leading-relaxed">
            <p>Drag to rotate. Scroll to zoom.</p>
            <p>Built with React Three Fiber.</p>
        </div>
      </div>
    </div>
  );
};

export default App;
