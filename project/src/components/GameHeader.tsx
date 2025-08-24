import React from 'react';
import { Shield, Swords, ArrowRight, RotateCcw } from 'lucide-react';
import { useGameStore } from '../store';

export default function GameHeader() {
  const currentRound = useGameStore(state => state.currentRound);
  const currentPhase = useGameStore(state => state.currentPhase);
  const troopsToPlace = useGameStore(state => state.troopsToPlace);
  const resetTroopPlacements = useGameStore(state => state.resetTroopPlacements);
  const players = useGameStore(state => state.players);

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'fortify':
        return <Shield className="w-5 h-5" />;
      case 'attack':
        return <Swords className="w-5 h-5" />;
      case 'movement':
        return <ArrowRight className="w-5 h-5" />;
      case 'applying_moves':
        return <RotateCcw className="w-5 h-5 animate-spin" />;
      default:
        return null;
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'fortify':
        return 'text-blue-400';
      case 'attack':
        return 'text-red-400';
      case 'movement':
        return 'text-green-400';
      case 'applying_moves':
        return 'text-purple-400';
      case 'game_complete':
        return 'text-yellow-400';
      default:
        return 'text-blue-400';
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-black/30 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div>
            <span className="text-blue-200 font-medium">Round</span>
            <span className="ml-2 text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {currentRound}/10
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-blue-200 font-medium mr-2">Phase</span>
            <div className={`flex items-center ${getPhaseColor(currentPhase)}`}>
              {getPhaseIcon(currentPhase)}
              <span className="ml-2 text-lg font-bold capitalize">
                {currentPhase.replace('_', ' ')}
              </span>
              {currentPhase === 'fortify' && troopsToPlace > 0 && (
                <span className="ml-2 text-sm bg-blue-500/20 px-2 py-1 rounded">
                  {troopsToPlace} troops to place
                </span>
              )}
              {currentPhase === 'game_complete' && (
                <span className="ml-2 text-sm bg-yellow-500/20 px-2 py-1 rounded">
                  Final Results
                </span>
              )}
            </div>
          </div>
          {currentPhase === 'fortify' && troopsToPlace > 0 && (
            <button
              onClick={resetTroopPlacements}
              className="p-2 rounded-lg bg-black/30 hover:bg-black/50 transition-colors"
              title="Reset troop placements"
            >
              <RotateCcw className="w-4 h-4 text-blue-400" />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-8">
          <div className="flex items-center gap-2">
            {players.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center ${index === 0 ? 'bg-white/10' : ''} px-3 py-1 rounded-lg`}
              >
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: player.color }}
                />
                <span className={`text-sm ${index === 0 ? 'text-white' : 'text-white/60'}`}>
                  {player.name}
                </span>
                {player.isReady && (
                  <span className="ml-2 text-xs text-green-400">✓</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}