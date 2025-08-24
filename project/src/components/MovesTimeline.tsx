import React from 'react';
import { useGameStore } from '../store';
import { Shield, Swords, ArrowRight } from 'lucide-react';

export default function MovesTimeline() {
  const pendingActions = useGameStore(state => state.pendingActions);
  const currentPhase = useGameStore(state => state.currentPhase);
  const planets = useGameStore(state => state.planets);

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'fortify':
        return <Shield className="w-4 h-4 text-blue-400" />;
      case 'attack':
        return <Swords className="w-4 h-4 text-red-400" />;
      case 'movement':
        return <ArrowRight className="w-4 h-4 text-green-400" />;
      default:
        return null;
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'fortify':
        return 'text-blue-400';
      case 'attack':
        return 'text-red-400';
      case 'movement':
        return 'text-green-400';
      default:
        return 'text-white';
    }
  };

  const getActionDescription = (action: any) => {
    const fromPlanet = action.from ? planets.find(p => p.id === action.from)?.name : null;
    const toPlanet = planets.find(p => p.id === action.to)?.name;

    switch (action.type) {
      case 'fortify':
        return `Placed ${action.troops} troops on ${toPlanet}`;
      case 'attack':
        return `Attacked ${toPlanet} from ${fromPlanet} with ${action.troops} troops`;
      case 'movement':
        return `Moved ${action.troops} troops from ${fromPlanet} to ${toPlanet}`;
      default:
        return '';
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold text-blue-400 mb-4">Battle Log</h3>
      
      {currentPhase === 'applying_moves' ? (
        <div className="space-y-4">
          {pendingActions.map((action, index) => (
            <div 
              key={index}
              className="bg-black/30 rounded-lg p-3 border border-white/10"
            >
              <div className="flex items-center gap-2 mb-2">
                {getActionIcon(action.type)}
                <span className={`font-medium ${getActionColor(action.type)}`}>
                  {action.type.charAt(0).toUpperCase() + action.type.slice(1)}
                </span>
              </div>
              <p className="text-white/70 text-sm">
                {getActionDescription(action)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white/50 text-center py-4">
          Actions will appear here during execution phase
        </p>
      )}
    </div>
  );
}