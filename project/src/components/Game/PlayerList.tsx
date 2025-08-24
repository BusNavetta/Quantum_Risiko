import React from 'react';
import { Eye } from 'lucide-react';

interface Player {
  id: string;
  player_name: string;
  color: string;
  role: string;
}

interface PlayerListProps {
  players: Player[];
  currentTurn: string;
}

export function PlayerList({ players, currentTurn }: PlayerListProps) {
  const activePlayers = players.filter(p => p.role === 'player');
  const visitors = players.filter(p => p.role === 'visitor');

  return (
    <div className="bg-black/70 backdrop-blur-md rounded-lg p-4">
      <h3 className="text-lg font-semibold text-blue-400 mb-4">Players</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          {activePlayers.map((player) => (
            <div
              key={player.id}
              className={`flex items-center p-2 rounded-lg ${
                player.player_name === currentTurn
                  ? 'bg-blue-500/20 border border-blue-500/50'
                  : 'bg-black/30'
              }`}
            >
              <div className={`w-4 h-4 rounded-full ${player.color} mr-3`} />
              <span className="text-blue-200">
                {player.player_name}
                {player.player_name === currentTurn && (
                  <span className="ml-2 text-xs text-blue-400">(Current Turn)</span>
                )}
              </span>
            </div>
          ))}
        </div>

        {visitors.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-blue-400 mb-2 flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              Visitors ({visitors.length})
            </h4>
            <div className="space-y-2">
              {visitors.map((visitor) => (
                <div
                  key={visitor.id}
                  className="flex items-center p-2 rounded-lg bg-black/30"
                >
                  <span className="text-blue-200/70">{visitor.player_name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}