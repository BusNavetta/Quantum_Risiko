import React from 'react';
import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Torus, Billboard } from '@react-three/drei';
import { Mesh, Group } from 'three';
import { useGameStore } from '../store';
import { Planet as PlanetType } from '../types';
import { Atom } from 'lucide-react';

interface PlanetProps {
  planet: PlanetType;
  onSelect?: (planetId: string | null) => void;
}

export function Planet({ planet, onSelect }: PlanetProps) {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const setHoveredPlanet = useGameStore((state) => state.setHoveredPlanet);
  const selectedPlanet = useGameStore((state) => state.selectedPlanet);
  const movementSourcePlanet = useGameStore((state) => state.movementSourcePlanet);
  const setMovementSourcePlanet = useGameStore((state) => state.setMovementSourcePlanet);
  const players = useGameStore((state) => state.players);
  const currentPhase = useGameStore((state) => state.currentPhase);

  const username = localStorage.getItem('username') || '';
  const currentPlayer = players.find(p => p.name === username);
  const isSelected = selectedPlanet === planet.id || movementSourcePlanet === planet.id;
  const isCurrentPlayersPlanet = currentPlayer && planet.owners.includes(currentPlayer.id);
  
  const canInteract = currentPhase === 'fortify' ? isCurrentPlayersPlanet : true;
  
  const planetColor = useMemo(() => {
    return planet.owners.length > 0 
      ? players.find(p => p.id === planet.owners[0])?.color || '#4a5568'
      : '#4a5568';
  }, [planet.owners, players]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
    
    if (groupRef.current) {
      const scale = isSelected 
        ? 1 + Math.sin(state.clock.getElapsedTime() * 4) * 0.1 
        : hovered ? 1.1 : 1;
      groupRef.current.scale.setScalar(scale * planet.size * 1.5);
    }
  });

  const textProps = useMemo(() => ({
    fontSize: 0.8,
    color: "white",
    anchorX: "center",
    anchorY: "middle",
    outlineWidth: 0.2,
    outlineColor: "#000000",
    renderOrder: 1
  }), []);

  const handleClick = () => {
    if (!canInteract) return;
    
    if (currentPhase === 'movement' && isCurrentPlayersPlanet && planet.troops > 1) {
      if (movementSourcePlanet === planet.id) {
        setMovementSourcePlanet(null);
      } else {
        setMovementSourcePlanet(planet.id);
      }
    } else if (onSelect) {
      onSelect(planet.id);
    }
  };

  // Render quantum entanglement symbol if planet is entangled
  const EntanglementSymbol = () => {
    if (!planet.entangledWith || planet.entangledWith.length === 0) return null;

    return (
      <Billboard
        follow={true}
        lockX={false}
        lockY={false}
        lockZ={false}
        position={[0, 4, 0]}
      >
        <Text
          {...textProps}
          fontSize={1.2}
          color="#faff00"
          outlineColor="#000000"
          outlineWidth={0.3}
          textShadow="0 0 8px #faff00"
        >
          ⧉
        </Text>

      </Billboard>
    );
  };

  return (
    <group position={planet.position}>
      <group ref={groupRef}>
        <mesh scale={2}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshBasicMaterial
            color={planetColor}
            transparent
            opacity={0.2}
            depthWrite={false}
          />
        </mesh>

        <mesh scale={2.2}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshBasicMaterial
            color={planetColor}
            transparent
            opacity={0.1}
            depthWrite={false}
          />
        </mesh>

        {isSelected && (
          <Torus
            args={[2.5, 0.15, 16, 32]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <meshPhongMaterial
              color="#ffffff"
              transparent
              opacity={0.8}
              emissive="#ffffff"
              emissiveIntensity={1.5}
            />
          </Torus>
        )}

        <mesh
          ref={meshRef}
          onPointerOver={() => {
            if (canInteract) {
              setHovered(true);
              setHoveredPlanet(planet.id);
            }
          }}
          onPointerOut={() => {
            if (canInteract) {
              setHovered(false);
              setHoveredPlanet(null);
            }
          }}
          onClick={handleClick}
          style={{ cursor: canInteract ? 'pointer' : 'default' }}
        >
          <sphereGeometry args={[1, 24, 24]} />
          <meshPhongMaterial
            color={planetColor}
            emissive={planetColor}
            emissiveIntensity={hovered || isSelected ? 3 : 2}
            shininess={100}
            opacity={canInteract ? 1 : 0.7}
            transparent={!canInteract}
          />
        </mesh>

        <EntanglementSymbol />

        <Billboard
          follow={true}
          lockX={false}
          lockY={false}
          lockZ={false}
        >
          <Text
            position={[0, 2.5, 0]}
            {...textProps}
            scale={hovered ? 1.2 : 1}
          >
            {planet.name}
          </Text>
          <Text
            position={[0, -2.5, 0]}
            {...textProps}
            fontSize={1.2}
            color={planet.troops > 0 ? "#4ade80" : "#ef4444"}
          >
            {planet.troops}
          </Text>
        </Billboard>
      </group>
    </group>
  );
}

export default React.memo(Planet);