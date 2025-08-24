import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Send } from 'lucide-react';
import { useGameStore } from '../store';
import { useEffect, useCallback, useRef, useState } from 'react';

export default function PlanetInfoPopup() {
  const selectedPlanetId = useGameStore((state) => state.selectedPlanet);
  const planets = useGameStore((state) => state.planets);
  const players = useGameStore((state) => state.players);
  const currentPlayerIndex = useGameStore((state) => state.currentPlayerIndex);
  const currentPhase = useGameStore((state) => state.currentPhase);
  const troopsToMove = useGameStore((state) => state.troopsToMove);
  const setTroopsToMove = useGameStore((state) => state.setTroopsToMove);
  const moveTroops = useGameStore((state) => state.moveTroops);
  const setSelectedPlanet = useGameStore((state) => state.setSelectedPlanet);
  const modalRef = useRef<HTMLDivElement>(null);
  const [showSourcePlanets, setShowSourcePlanets] = useState(false);

  const selectedPlanet = planets.find(p => p.id === selectedPlanetId);
  const currentPlayer = players[currentPlayerIndex];
  const username = localStorage.getItem('username') || '';
  const isCurrentPlayersTurn = currentPlayer?.name === username;
  const isCurrentPlayersSelectedPlanet = selectedPlanet?.owners[0] === currentPlayer?.id;
  
  const handleClose = useCallback(() => {
    setSelectedPlanet(null);
    setTroopsToMove(0);
    setShowSourcePlanets(false);
  }, [setSelectedPlanet, setTroopsToMove]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClose]);

  const handleIncreaseTroops = () => {
    if (!selectedPlanet) return;
    
    const sourcePlanet = planets.find(p => 
      p.id !== selectedPlanet.id && 
      p.owners[0] === currentPlayer?.id &&
      p.troops > 1
    );
    
    if (sourcePlanet) {
      setTroopsToMove(Math.min(troopsToMove + 1, sourcePlanet.troops - 1));
    }
  };

  const handleDecreaseTroops = () => {
    setTroopsToMove(Math.max(troopsToMove - 1, 0));
  };

  const handleMoveTroopsFrom = (sourcePlanetId: string) => {
    if (selectedPlanet && sourcePlanetId && troopsToMove > 0) {
      const sourcePlanet = planets.find(p => p.id === sourcePlanetId);
      if (sourcePlanet && sourcePlanet.troops > troopsToMove) {
        moveTroops(sourcePlanetId, selectedPlanet.id, troopsToMove);
        setShowSourcePlanets(false);
      }
    }
  };

  if (!selectedPlanet) return null;

  const owner = selectedPlanet.owners[0] 
    ? players.find(p => p.id === selectedPlanet.owners[0])
    : null;

  const canMoveTroops = isCurrentPlayersTurn && 
                       currentPhase === 'placement' && 
                       isCurrentPlayersSelectedPlanet;

  const availableSourcePlanets = planets.filter(planet => 
    planet.id !== selectedPlanet.id && 
    planet.owners[0] === currentPlayer?.id &&
    planet.troops > 1
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      />

      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed top-20 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-lg 
          rounded-xl border border-white/10 w-full max-w-md z-50 max-h-[calc(100vh-8rem)] flex flex-col"
      >
        <div className="flex justify-between items-start p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">{selectedPlanet.name}</h2>
          <button
            onClick={handleClose}
            className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          <div>
            <h3 className="text-white/70 text-sm font-medium mb-2">Status</h3>
            <div className="bg-white/5 rounded-lg p-3">
              {owner ? (
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: owner.color }}
                  />
                  <span className="text-white/90">
                    Controlled by {owner.name}
                  </span>
                </div>
              ) : (
                <p className="text-white/90">Neutral Planet</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-white/70 text-sm font-medium mb-2">Details</h3>
            <div className="bg-white/5 rounded-lg p-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-white/70">Type</span>
                <span className="text-white">{selectedPlanet.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Size</span>
                <span className="text-white">{selectedPlanet.size.toFixed(1)}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Troops</span>
                <span className="text-white">{selectedPlanet.troops}</span>
              </div>
            </div>
          </div>

          {canMoveTroops && (
            <div>
              <h3 className="text-white/70 text-sm font-medium mb-2">Move Troops Here</h3>
              <div className="bg-white/5 rounded-lg p-3 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={handleDecreaseTroops}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    disabled={troopsToMove <= 0}
                  >
                    <Minus className="w-5 h-5 text-white" />
                  </button>
                  
                  <span className="text-2xl font-bold text-white">{troopsToMove}</span>
                  
                  <button
                    onClick={handleIncreaseTroops}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <Plus className="w-5 h-5 text-white" />
                  </button>
                </div>

                <button
                  onClick={() => setShowSourcePlanets(true)}
                  disabled={troopsToMove === 0 || availableSourcePlanets.length === 0}
                  className="w-full py-2 px-4 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 
                    text-blue-400 flex items-center justify-center gap-2 transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  Select Source Planet
                </button>
              </div>
            </div>
          )}

          {showSourcePlanets && (
            <div>
              <h3 className="text-white/70 text-sm font-medium mb-2">Select Source Planet</h3>
              <div className="space-y-2">
                {availableSourcePlanets.map(planet => (
                  <button
                    key={planet.id}
                    onClick={() => handleMoveTroopsFrom(planet.id)}
                    className="w-full p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors
                      flex items-center justify-between"
                  >
                    <span className="text-white">{planet.name}</span>
                    <span className="text-white/70">Troops: {planet.troops}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}