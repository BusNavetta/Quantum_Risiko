import React, { useState } from 'react';
import { useGameStore } from '../store';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function PlayerPlanets() {
  const [isExpanded, setIsExpanded] = useState(true);
  const planets = useGameStore(state => state.planets);
  const players = useGameStore(state => state.players);
  const setSelectedPlanet = useGameStore(state => state.setSelectedPlanet);
  const currentPhase = useGameStore(state => state.currentPhase);
  const movementSourcePlanet = useGameStore(state => state.movementSourcePlanet);
  const setMovementSourcePlanet = useGameStore(state => state.setMovementSourcePlanet);
  const username = localStorage.getItem('username') || '';
  
  // Find the current user's player object
  const currentPlayer = players.find(p => p.name === username);
  
  // Filter planets owned by the current user
  const userPlanets = currentPlayer 
    ? planets.filter(planet => planet.owners.includes(currentPlayer.id))
    : [];

  const handlePlanetClick = (planetId: string) => {
    if (currentPhase === 'movement') {
      // If we're in movement phase and the planet has more than 1 troop
      const planet = planets.find(p => p.id === planetId);
      if (planet && planet.troops > 1) {
        // If this planet is already the source, deselect it
        if (movementSourcePlanet === planetId) {
          setMovementSourcePlanet(null);
        } else {
          // Otherwise, set it as the new source
          setMovementSourcePlanet(planetId);
        }
      }
    } else {
      setSelectedPlanet(planetId);
    }
  };

  return (
    <div className="absolute top-20 right-4 bg-black/70 backdrop-blur-sm rounded-lg border border-white/10 w-64">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-lg font-semibold text-blue-400"
      >
        <span>Your Planets ({userPlanets.length})</span>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>
      
      {isExpanded && (
        <div className="p-4 pt-0 space-y-2 max-h-96 overflow-y-auto">
          {userPlanets.map((planet) => (
            <button
              key={planet.id}
              onClick={() => handlePlanetClick(planet.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                movementSourcePlanet === planet.id
                  ? 'bg-green-500/20 border border-green-500/50'
                  : 'bg-black/30 hover:bg-black/40'
              }`}
            >
              <div>
                <p className="text-blue-200 font-medium text-left">{planet.name}</p>
                <p className={`text-sm text-left ${
                  planet.troops <= 1 && currentPhase === 'movement'
                    ? 'text-red-400'
                    : 'text-blue-400'
                }`}>
                  Troops: {planet.troops}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div
                  className="w-6 h-6 rounded-full border-2 border-white/10"
                  style={{ backgroundColor: currentPlayer?.color }}
                  title={`Planet Color: ${currentPlayer?.color}`}
                />
                {currentPhase === 'movement' && planet.troops <= 1 && (
                  <span className="text-xs text-red-400">Cannot move</span>
                )}
              </div>
            </button>
          ))}
          {userPlanets.length === 0 && (
            <p className="text-blue-200/50 text-center py-2">No planets owned</p>
          )}
        </div>
      )}
    </div>
  );
}