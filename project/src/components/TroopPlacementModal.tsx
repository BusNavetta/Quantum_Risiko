import React, { useState } from 'react';
import { X, Plus, Minus, Check, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store';

interface TroopPlacementModalProps {
  planetId: string;
  onClose: () => void;
  isMovement?: boolean;
  sourcePlanetId?: string;
  onMove?: (troops: number) => void;
}

export default function TroopPlacementModal({ 
  planetId, 
  onClose,
  isMovement = false,
  sourcePlanetId,
  onMove
}: TroopPlacementModalProps) {
  const [troopsToAdd, setTroopsToAdd] = useState(1);
  const [showLostTroopsNotification, setShowLostTroopsNotification] = useState(false);
  const [lostTroops, setLostTroops] = useState(0);
  const troopsToPlace = useGameStore(state => state.troopsToPlace);
  const placeTroops = useGameStore(state => state.placeTroops);
  const planets = useGameStore(state => state.planets);
  
  const planet = planets.find(p => p.id === planetId);
  const sourcePlanet = sourcePlanetId ? planets.find(p => p.id === sourcePlanetId) : null;

  if (!planet) return null;

  const maxTroops = isMovement && sourcePlanet 
    ? sourcePlanet.troops - 1 
    : troopsToPlace;

  const handleConfirm = () => {
    if (isMovement && onMove) {
      const totalTroops = planet.troops + troopsToAdd;
      if (totalTroops > 8) {
        const exceededTroops = totalTroops - 8;
        setLostTroops(exceededTroops);
        setShowLostTroopsNotification(true);
        onMove(troopsToAdd - exceededTroops);
      } else {
        onMove(troopsToAdd);
      }
    } else {
      const totalTroops = planet.troops + troopsToAdd;
      if (totalTroops > 8) {
        const exceededTroops = totalTroops - 8;
        setLostTroops(exceededTroops);
        setShowLostTroopsNotification(true);
        placeTroops(planetId, troopsToAdd - exceededTroops);
      } else {
        placeTroops(planetId, troopsToAdd);
      }
    }
    if (!showLostTroopsNotification) {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => {
        if (!showLostTroopsNotification) {
          onClose();
        }
      }} />
      
      <div className="relative bg-black/80 p-6 rounded-xl border border-white/10 w-full max-w-sm mx-4">
        {!showLostTroopsNotification ? (
          <>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-4">
              {isMovement ? `Move Troops to ${planet.name}` : `Place Troops on ${planet.name}`}
            </h3>

            <div className="space-y-4">
              <div className="bg-black/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-200">Current Troops</span>
                  <span className="text-white font-medium">{planet.troops}/8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-200">Available</span>
                  <span className="text-green-400 font-medium">{maxTroops}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 bg-black/50 rounded-lg p-4">
                <button
                  onClick={() => setTroopsToAdd(Math.max(1, troopsToAdd - 1))}
                  disabled={troopsToAdd <= 1}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-5 h-5 text-white" />
                </button>
                
                <span className="text-2xl font-bold text-white">{troopsToAdd}</span>
                
                <button
                  onClick={() => setTroopsToAdd(Math.min(maxTroops, troopsToAdd + 1))}
                  disabled={troopsToAdd >= maxTroops}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-5 h-5 text-white" />
                </button>
              </div>

              <button
                onClick={handleConfirm}
                disabled={troopsToAdd === 0 || troopsToAdd > maxTroops}
                className="w-full py-2 px-4 rounded-lg bg-green-500/20 hover:bg-green-500/30 
                  text-green-400 flex items-center justify-center gap-2 transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4" />
                {isMovement ? 'Confirm Movement' : 'Confirm Placement'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="w-12 h-12 text-yellow-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">
              Troops Lost!
            </h3>
            <p className="text-blue-200 mb-6">
              You lost {lostTroops} troops because planets can only hold a maximum of 8 troops.
            </p>
            <button
              onClick={() => {
                setShowLostTroopsNotification(false);
                onClose();
              }}
              className="w-full py-2 px-4 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 
                text-blue-400 transition-colors"
            >
              Understood
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}