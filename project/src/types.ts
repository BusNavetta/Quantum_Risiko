import { Vector3 } from 'three';

export interface Planet {
  id: string;
  name: string;
  position: [number, number, number];
  size: number;
  color: string;
  isCity: boolean;
  owners: string[];
  troops: number;
  entangledWith: string[];
  quantumState: number;
  waveform: number[];
  orbital: {
    orbitRadius: number;
    orbitSpeed: number;
    orbitOffset: number;
    verticalTilt: number;
  };
}

export interface Player {
  id: string;
  name: string;
  color: string;
  isReady: boolean;
}

export type GamePhase = 'fortify' | 'attack' | 'movement' | 'applying_moves' | 'game_complete';

export interface PendingAction {
  type: 'fortify' | 'attack' | 'movement';
  from?: string;
  to: string;
  troops: number;
}

export interface GameState {
  loadingProgress: number;
  players: Player[];
  currentPlayerIndex: number;
  planets: Planet[];
  selectedPlanet: string | null;
  hoveredPlanet: string | null;
  movementSourcePlanet: string | null;
  setPlayers: (players: Player[]) => void;
  setMovementSourcePlanet: (planetId: string | null) => void;
  currentRound: number;
  currentPhase: GamePhase;
  setCurrentPhase: (phase: GamePhase) => void;
  showPhaseNotification: boolean;
  phaseNotificationText: string;
  setPhaseNotificationText: (text: string) => void;
  hidePhaseNotification: () => void;
  troopsToMove: number;
  troopsToPlace: number;
  troopPlacements: { [planetId: string]: number };
  setTroopsToMove: (troops: number) => void;
  moveTroops: (fromPlanetId: string, toPlanetId: string, troops: number) => void;
  placeTroops: (planetId: string, amount: number) => void;
  resetTroopPlacements: () => void;
  confirmTroopPlacements: () => void;
  pendingActions: PendingAction[];
  addPendingAction: (action: PendingAction) => void;
  executeRound: () => void;
  playerReadyForPhase: (playerId: string) => void;
  isPlayerReady: (playerId: string) => boolean;
  playerPhases: { [playerId: string]: GamePhase };
  waitForAllPlayersToLoadMap: (gameId: string) => Promise<void>;
  waitForAllPlayersToLoadMap: (gameId: string) => Promise<void>;
}