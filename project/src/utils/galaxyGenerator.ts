import { Planet } from '../types';

const GALAXY_RADIUS = 100;
const SPIRAL_ARMS = 3;
const CITIES_PERCENTAGE = 0.2;
const ARM_OFFSET = 2 * Math.PI / SPIRAL_ARMS;
const SPIRAL_TIGHTNESS = 0.3;

function generateSpiralPosition(index: number, total: number): [number, number, number] {
  const arm = index % SPIRAL_ARMS;
  const armOffset = arm * ARM_OFFSET;
  const distanceFromCenter = Math.sqrt(index / total) * GALAXY_RADIUS;
  const spiralAngle = distanceFromCenter * SPIRAL_TIGHTNESS + armOffset;
  
  const x = distanceFromCenter * Math.cos(spiralAngle);
  const y = (Math.random() - 0.5) * GALAXY_RADIUS * 0.2;
  const z = distanceFromCenter * Math.sin(spiralAngle);
  
  return [x, y, z];
}

export function generateGalaxy(numPlanets: number): Planet[] {
  const planets: Planet[] = [];
  
  for (let i = 0; i < numPlanets; i++) {
    const position = generateSpiralPosition(i, numPlanets);
    
    planets.push({
      id: `planet-${i}`,
      name: `Planet ${i + 1}`,
      position,
      size: 0.8 + Math.random() * 0.4,
      color: '#4a9eff',
      isCity: Math.random() < CITIES_PERCENTAGE,
      owners: [],
      troops: Math.floor(Math.random() * 5),
      entangledWith: [],
      quantumState: Math.random(),
      waveform: Array.from({ length: 32 }, () => Math.random()),
      orbital: {
        orbitRadius: 2 + Math.random() * 3,
        orbitSpeed: 0.1 + Math.random() * 0.2,
        orbitOffset: Math.random() * Math.PI * 2,
        verticalTilt: (Math.random() - 0.5) * 0.3
      }
    });
  }

  return planets;
}