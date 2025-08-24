import React, { useState } from 'react';
import { useGameStore } from '../store';
import { ArrowRight } from 'lucide-react';
import TroopPlacementModal from './TroopPlacementModal';

export default function MovementPhase() {
  const [showDestinations, setShowDestinations] = useState(false);
  const planets = useGameStore(state => state.planets);
  const players = useGameStore(state => state.players);
  const selectedPlanet = useGameStore(state => state.selectedPlanet);
  const setSelectedPlanet = useGameStore(state => state.setSelectedPlanet);
  const movementSourcePlanet = useGameStore(state => state.movementSourcePlanet);
  const setMovementSourcePlanet = useGameStore(state => state.setMovementSourcePlanet);
  const addPendingAction = useGameStore(state => state.addPendingAction);
  const playerReadyForPhase = useGameStore(state => state.playerReadyForPhase);
  const moveTroops = useGameStore(state => state.moveTroops);

  const username = localStorage.getItem('username') || '';
  const currentPlayer = players.find(p => p.name === username);
  const sourcePlanet = planets.find(p => p.id === movementSourcePlanet);

  // Get possible destinations (planets owned by the current player and connected to source)
  const possibleDestinations = planets.filter(p => {
    if (!currentPlayer) return false;
    
    // Must be owned by current player
    if (!p.owners.includes(currentPlayer.id)) return false;
    
    // Must not be the source planet
    if (p.id === movementSourcePlanet) return false;
    
    // Must be within connection distance (75 units)
    if (sourcePlanet) {
      const dx = sourcePlanet.position[0] - p.position[0];
      const dy = sourcePlanet.position[1] - p.position[1];
      const dz = sourcePlanet.position[2] - p.position[2];
      const distanceSquared = dx * dx + dy * dy + dz * dz;
      return distanceSquared <= 75 * 75;
    }
    
    return false;
  });

  const handleMove = async (troops: number) => {
    if (!movementSourcePlanet || !selectedPlanet || !currentPlayer) return;

    try {
      await moveTroops(movementSourcePlanet, selectedPlanet, troops);
      
      addPendingAction({
        type: 'movement',
        from: movementSourcePlanet,
        to: selectedPlanet,
        troops
      });

      playerReadyForPhase(currentPlayer.id);
      setSelectedPlanet(null);
      setMovementSourcePlanet(null);
      setShowDestinations(false);
    } catch (error) {
      console.error('Error executing movement:', error);
    }
  };

  // If we have both source and destination planets, show the movement modal
  if (selectedPlanet && movementSourcePlanet) {
    return (
      <TroopPlacementModal
        planetId={selectedPlanet}
        sourcePlanetId={movementSourcePlanet}
        onClose={() => {
          setSelectedPlanet(null);
          setShowDestinations(false);
        }}
        isMovement={true}
        onMove={handleMove}
      />
    );
  }

  // Show source selection popup
  if (movementSourcePlanet && !showDestinations) {
    return (
      <div className="fixed bottom-4 left-4 bg-black/70 backdrop-blur-sm p-4 rounded-lg border border-white/10" style={{ zIndex: 1 }}>
        <div className="flex items-center gap-2 mb-4">
          <ArrowRight className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-bold text-green-400">Selected Source: {sourcePlanet?.name}</h3>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => setShowDestinations(true)}
            className="w-full py-2 px-4 rounded-lg bg-green-500/20 hover:bg-green-500/30 
              text-green-400 transition-colors"
          >
            Move From Here
          </button>

          <button
            onClick={() => {
              setMovementSourcePlanet(null);
              setShowDestinations(false);
            }}
            className="w-full py-2 px-4 rounded-lg bg-red-500/20 hover:bg-red-500/30 
              text-red-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Show destinations list
  if (showDestinations && movementSourcePlanet) {
    return (
      <div className="fixed bottom-4 left-4 bg-black/70 backdrop-blur-sm p-4 rounded-lg border border-white/10" style={{ zIndex: 1 }}>
        <div className="flex items-center gap-2 mb-4">
          <ArrowRight className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-bold text-green-400">Select Destination</h3>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {possibleDestinations.length > 0 ? (
            possibleDestinations.map(planet => (
              <button
                key={planet.id}
                onClick={() => setSelectedPlanet(planet.id)}
                className="w-full p-2 rounded-lg flex items-center justify-between
                  bg-black/30 hover:bg-black/50 transition-colors"
              >
                <span className="text-green-200">{planet.name}</span>
                <span className="text-green-400">{planet.troops} troops</span>
              </button>
            ))
          ) : (
            <p className="text-green-200 text-center py-2">No valid destinations within range</p>
          )}
        </div>

        <button
          onClick={() => {
            setMovementSourcePlanet(null);
            setShowDestinations(false);
          }}
          className="w-full mt-4 py-2 px-4 rounded-lg bg-red-500/20 hover:bg-red-500/30 
            text-red-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return null;
}