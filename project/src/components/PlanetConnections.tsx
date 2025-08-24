import { useRef, useMemo } from 'react';
import { Line } from '@react-three/drei';
import { useGameStore } from '../store';
import { Planet } from '../types';

interface PlanetConnectionsProps {
  planets: Planet[];
  maxDistance: number;
}

export function PlanetConnections({ planets, maxDistance = 75 }: PlanetConnectionsProps) {
  const selectedPlanet = useGameStore(state => state.selectedPlanet);
  const movementSourcePlanet = useGameStore(state => state.movementSourcePlanet);
  const currentPhase = useGameStore(state => state.currentPhase);
  const players = useGameStore(state => state.players);
  
  const username = localStorage.getItem('username') || '';
  const currentPlayer = players.find(p => p.name === username);
  
  const connections = useMemo(() => {
    const result: Array<{ start: [number, number, number], end: [number, number, number], key: string }> = [];
    
    const sourcePlanetId = currentPhase === 'movement' ? movementSourcePlanet : selectedPlanet;
    if (!sourcePlanetId) return result;
    
    const sourcePlanetObj = planets.find(p => p.id === sourcePlanetId);
    if (!sourcePlanetObj) return result;

    planets.forEach(planet => {
      if (planet.id === sourcePlanetId) return;
      
      const dx = sourcePlanetObj.position[0] - planet.position[0];
      const dy = sourcePlanetObj.position[1] - planet.position[1];
      const dz = sourcePlanetObj.position[2] - planet.position[2];
      const distanceSquared = dx * dx + dy * dy + dz * dz;
      const maxDistanceSquared = maxDistance * maxDistance;
      
      if (distanceSquared <= maxDistanceSquared) {
        // During attack phase, only show connections to enemy planets
        if (currentPhase === 'attack') {
          if (!currentPlayer || planet.owners.includes(currentPlayer.id)) {
            return;
          }
          // Only show connection if source planet has at least 2 troops
          if (sourcePlanetObj.troops < 2) {
            return;
          }
        }
        // During movement phase, only show connections to owned planets
        else if (currentPhase === 'movement') {
          if (!currentPlayer || !planet.owners.includes(currentPlayer.id)) {
            return;
          }
        }

        result.push({
          start: sourcePlanetObj.position,
          end: planet.position,
          key: `${sourcePlanetId}-${planet.id}`
        });
      }
    });
    
    return result;
  }, [planets, maxDistance, selectedPlanet, movementSourcePlanet, currentPhase, currentPlayer, players]);

  return (
    <group>
      {connections.map(({ start, end, key }) => (
        <Line
          key={key}
          points={[start, end]}
          color={currentPhase === 'attack' ? '#ef4444' : '#4f46e5'}
          lineWidth={2}
          transparent
          opacity={0.8}
        />
      ))}
    </group>
  );
}

export default PlanetConnections;