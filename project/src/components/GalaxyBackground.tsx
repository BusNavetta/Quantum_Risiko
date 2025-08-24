import React from 'react';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const STAR_COUNT = 4000; // Reduced star count for better performance

function generateStarData() {
  const starPositions = new Float32Array(STAR_COUNT * 3);
  const starColors = new Float32Array(STAR_COUNT * 3);
  const starSizes = new Float32Array(STAR_COUNT);

  for (let i = 0; i < STAR_COUNT; i++) {
    const i3 = i * 3;
    const radius = Math.random() * 1500;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI * 2;

    starPositions[i3] = radius * Math.sin(theta) * Math.cos(phi);
    starPositions[i3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
    starPositions[i3 + 2] = radius * Math.cos(theta);

    const colorType = Math.random();
    if (colorType < 0.6) {
      starColors[i3] = 1;
      starColors[i3 + 1] = 1;
      starColors[i3 + 2] = 1;
    } else if (colorType < 0.8) {
      starColors[i3] = 0.6;
      starColors[i3 + 1] = 0.8;
      starColors[i3 + 2] = 1;
    } else {
      starColors[i3] = 1;
      starColors[i3 + 1] = 0.9;
      starColors[i3 + 2] = 0.6;
    }

    starSizes[i] = Math.random() * 3 + 0.5;
  }

  return { starPositions, starColors, starSizes };
}

const GalaxyBackground = () => {
  const pointsRef = useRef();
  const { starPositions, starColors, starSizes } = useMemo(() => generateStarData(), []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x += 0.0001;
      pointsRef.current.rotation.y += 0.0001;
    }
  });

  return (
    <Points ref={pointsRef}>
      <PointMaterial
        transparent
        vertexColors
        size={1.5}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.6}
      />
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={STAR_COUNT}
          array={starPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={STAR_COUNT}
          array={starColors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={STAR_COUNT}
          array={starSizes}
          itemSize={1}
        />
      </bufferGeometry>
    </Points>
  );
};

export default React.memo(GalaxyBackground);