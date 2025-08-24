import React from 'react';
import { ChevronRight } from 'lucide-react';
import { RoundTimer } from './RoundTimer';

interface TurnManagerProps {
  currentRound: number;
  roundStartTime: number;
  roundDuration: number;
  troopsToPlace: number;
  isCurrentPlayer: boolean;
  isReady: boolean;
  onEndTurn: () => void;
  onRoundComplete: () => void;
}

export function TurnManager({
  currentRound,
  roundStartTime,
  roundDuration,
  troopsToPlace,
  isCurrentPlayer,
  isReady,
  onEndTurn,
  onRoundComplete
}: TurnManagerProps) {
  return (
    <div className="bg-black/70 backdrop-blur-md rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-blue-400">Round {currentRound}</h3>
        <RoundTimer
          startTime={roundStartTime}
          duration={roundDuration}
          onComplete={onRoundComplete}
        />
      </div>

      <div className="space-y-4">
        <div className="bg-black/30 rounded-lg p-3">
          <div className="flex justify-between items-center text-blue-200 mb-2">
            <span>Troops to Place</span>
            <span className="text-lg font-semibold">{troopsToPlace}</span>
          </div>
          <div className="h-2 bg-black/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${(1 - troopsToPlace / 30) * 100}%` }}
            />
          </div>
        </div>

        <button
          onClick={onEndTurn}
          disabled={!isCurrentPlayer || isReady || troopsToPlace > 0}
          className="w-full px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isReady ? (
            'Waiting for other players...'
          ) : (
            <>
              End Turn
              <ChevronRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}