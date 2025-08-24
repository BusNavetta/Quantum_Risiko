import type { Database } from './supabase';

export type GameSession = Database['public']['Tables']['game_sessions']['Row'];
export type GamePlayer = Database['public']['Tables']['game_players']['Row'];
export type StandardMap = Database['public']['Tables']['standard_maps']['Row'] & {
  instanced_planets?: any[];
};

export interface GameState {
  planets: Planet[];
  players: Player[];
  currentPhase: GamePhase;
  currentRound: number;
  roundStartTime: number;
}

export interface Planet {
  id: string;
  name: string;
  position: [number, number, number];
  size: number;
  color: string;
  owners: string[];
  troops: number;
  type: 'rocky' | 'gas' | 'ice';
  maxTroops: number;
  resources: {
    gas: number;
    metal: number;
    crystal: number;
  };
  baseDefense: number;
  infrastructure: {
    labs: number;
    mines: number;
    shipyards: number;
  };
  productionRate: {
    gas: number;
    metal: number;
    crystal: number;
  };
}

export interface Player {
  id: string;
  name: string;
  color: string;
  isReady: boolean;
}

export type GamePhase = 'fortify' | 'attack' | 'movement';