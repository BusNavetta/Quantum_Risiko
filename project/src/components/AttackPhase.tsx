import React, { useState } from 'react';
import { useGameStore } from '../store';
import { Swords } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AttackPhase() {
  const [showAttackConfirm, setShowAttackConfirm] = useState(false);
  const [selectedSourcePlanet, setSelectedSourcePlanet] = useState<string | null>(null);
  const [attackingTroops, setAttackingTroops] = useState(1);
  
  const planets = useGameStore(state => state.planets);
  const players = useGameStore(state => state.players);
  const selectedPlanet = useGameStore(state => state.selectedPlanet);
  const handleAttack = useGameStore(state => state.handleAttack);
  const addPendingAction = useGameStore(state => state.addPendingAction);
  const currentRound = useGameStore(state => state.currentRound);

  const username = localStorage.getItem('username') || '';
  const currentPlayer = players.find(p => p.name === username);
  const targetPlanet = planets.find(p => p.id === selectedPlanet);
  
  if (!selectedPlanet || !targetPlanet || !currentPlayer || targetPlanet.owners.includes(currentPlayer.id)) {
    return null;
  }

  const possibleSourcePlanets = planets.filter(planet => {
    if (!planet.owners.includes(currentPlayer.id)) return false;
    if (planet.troops <= 1) return false;
    
    const dx = planet.position[0] - targetPlanet.position[0];
    const dy = planet.position[1] - targetPlanet.position[1];
    const dz = planet.position[2] - targetPlanet.position[2];
    const distanceSquared = dx * dx + dy * dy + dz * dz;
    return distanceSquared <= 75 * 75;
  });

  const sourcePlanet = planets.find(p => p.id === selectedSourcePlanet);

  const executeAttack = async () => {
    if (!selectedSourcePlanet || !selectedPlanet || !sourcePlanet || !currentPlayer) return;

    await handleAttack(selectedPlanet, selectedSourcePlanet, attackingTroops);
    
    addPendingAction({
      type: 'attack',
      from: selectedSourcePlanet,
      to: selectedPlanet,
      troops: attackingTroops
    });

    setSelectedSourcePlanet(null);
    setShowAttackConfirm(false);
    setAttackingTroops(1);
  };

  if (showAttackConfirm && selectedSourcePlanet && sourcePlanet) {
    return (
      <div className="fixed bottom-4 left-4 bg-black/70 backdrop-blur-sm p-4 rounded-lg border border-white/10" style={{ zIndex: 1 }}>
        <div className="flex items-center gap-2 mb-4">
          <Swords className="w-5 h-5 text-red-400" />
          <h3 className="text-lg font-bold text-red-400">Attack Force</h3>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-red-200 mb-2">
              Attacking from {sourcePlanet.name} ({sourcePlanet.troops} troops)
            </p>
            <p className="text-red-200 mb-4">
              Target: {targetPlanet.name} ({targetPlanet.troops} troops)
            </p>

            <label className="block text-sm font-medium text-red-200 mb-2">
              Select Troops to Attack With
            </label>
            <input
              type="range"
              min={1}
              max={sourcePlanet.troops - 1}
              value={attackingTroops}
              onChange={(e) => setAttackingTroops(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-red-400 mt-1">
              <span>1</span>
              <span>{attackingTroops}</span>
              <span>{sourcePlanet.troops - 1}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowAttackConfirm(false);
                setSelectedSourcePlanet(null);
              }}
              className="flex-1 py-2 px-4 rounded-lg bg-red-500/20 hover:bg-red-500/30 
                text-red-400 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={executeAttack}
              className="flex-1 py-2 px-4 rounded-lg bg-red-500/20 hover:bg-red-500/30 
                text-red-400 transition-colors"
            >
              Confirm Attack
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedPlanet && !selectedSourcePlanet) {
    return (
      <div className="fixed bottom-4 left-4 bg-black/70 backdrop-blur-sm p-4 rounded-lg border border-white/10" style={{ zIndex: 1 }}>
        <div className="flex items-center gap-2 mb-4">
          <Swords className="w-5 h-5 text-red-400" />
          <h3 className="text-lg font-bold text-red-400">Attack {targetPlanet.name}</h3>
        </div>

        {possibleSourcePlanets.length > 0 ? (
          <div className="space-y-4">
            <p className="text-red-200">Select source planet for attack:</p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {possibleSourcePlanets.map(planet => (
                <button
                  key={planet.id}
                  onClick={() => {
                    setSelectedSourcePlanet(planet.id);
                    setShowAttackConfirm(true);
                  }}
                  className="w-full p-2 rounded-lg flex items-center justify-between
                    bg-black/30 hover:bg-black/50 transition-colors"
                >
                  <span className="text-red-200">{planet.name}</span>
                  <span className="text-red-400">{planet.troops} troops</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-red-200">No planets in range with enough troops to attack from.</p>
        )}
      </div>
    );
  }

  return null;
}