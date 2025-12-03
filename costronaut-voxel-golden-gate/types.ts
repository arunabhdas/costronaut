export interface SimulationState {
  timeOfDay: number; // 0-24
  fogDensity: number; // 0-100
  trafficDensity: number; // 0-100
  cameraZoom: number; // 1-10 (conceptually)
}

export interface Uniforms {
  [uniform: string]: { value: any };
}
