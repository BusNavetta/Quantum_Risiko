import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Vector3 } from 'three';

interface TroopMovementProps {
  from: Vector3;
  to: Vector3;
  troops: number;
  color: string;
  onComplete: () => void;
}

export function TroopMovement({ from, to, troops, color, onComplete }: TroopMovementProps) {
  const [screenPosition, setScreenPosition] = useState({ start: { x: 0, y: 0 }, end: { x: 0, y: 0 } });

  useEffect(() => {
    // Convert 3D positions to screen coordinates
    const fromVector = new Vector3(from.x, from.y, from.z);
    const toVector = new Vector3(to.x, to.y, to.z);
    
    // Get the camera and convert to screen coordinates
    const camera = window.gameCamera;
    if (!camera) return;

    const startPos = fromVector.clone().project(camera);
    const endPos = toVector.clone().project(camera);

    // Convert to screen coordinates
    setScreenPosition({
      start: {
        x: (startPos.x + 1) * window.innerWidth / 2,
        y: (-startPos.y + 1) * window.innerHeight / 2
      },
      end: {
        x: (endPos.x + 1) * window.innerWidth / 2,
        y: (-endPos.y + 1) * window.innerHeight / 2
      }
    });
  }, [from, to]);

  return (
    <motion.div
      initial={{ 
        x: screenPosition.start.x, 
        y: screenPosition.start.y,
        scale: 0,
        opacity: 0 
      }}
      animate={{ 
        x: screenPosition.end.x, 
        y: screenPosition.end.y,
        scale: 1,
        opacity: 1
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 1 }}
      onAnimationComplete={onComplete}
      className="fixed pointer-events-none z-50"
      style={{ 
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="relative">
        {/* Spaceship */}
        <div 
          className="w-12 h-8 rounded-full relative"
          style={{ backgroundColor: color }}
        >
          <div 
            className="absolute inset-0 rounded-full opacity-30"
            style={{ 
              backgroundColor: color,
              filter: 'blur(8px)'
            }}
          />
          {/* Engine glow */}
          <div 
            className="absolute -right-4 top-1/2 w-8 h-2 -translate-y-1/2 rounded-full animate-pulse"
            style={{ 
              backgroundColor: color,
              filter: 'blur(4px)'
            }}
          />
        </div>
        
        {/* Troop count */}
        <div 
          className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl font-bold"
          style={{ color }}
        >
          {troops}
        </div>
      </div>
    </motion.div>
  );
}