import { HexTile } from './mapGenerator';

export interface GameState {
  currentRound: number;
  roundStartTime: number;
  roundDuration: number;
  currentPhase: 'placement' | 'execution';
  players: Player[];
  playerOrder: string[];
  map: { [key: string]: HexTile };
  pendingActions: { [playerId: string]: PlayerAction };
}

export interface Player {
  id: string;
  name: string;
  color: string;
  role: 'player' | 'visitor';
  troopsToPlace: number;
  isReady: boolean;
}

export interface PlayerAction {
  placements: { [tileId: string]: number };
  timestamp: number;
}

export const ROUND_DURATION = 60000; // 60 seconds
export const INITIAL_TROOPS = 30;
export const INITIAL_TERRITORIES = 3; // Number of territories each player starts with

export function createInitialGameState(players: Player[], map: MapTile[][]): GameState {
  const activePlayers = players.filter(p => p.role === 'player');
  const flatMap = map.flat();
  const landTiles = flatMap.filter(tile => tile.type === 'land');
  
  // Randomly assign initial territories to players
  const shuffledLandTiles = [...landTiles].sort(() => Math.random() - 0.5);
  const territoriesPerPlayer = Math.min(
    INITIAL_TERRITORIES,
    Math.floor(landTiles.length / activePlayers.length)
  );

  activePlayers.forEach((player, index) => {
    const startIdx = index * territoriesPerPlayer;
    const playerTerritories = shuffledLandTiles.slice(startIdx, startIdx + territoriesPerPlayer);
    
    playerTerritories.forEach(tile => {
      tile.owner = player.name;
      tile.troops = 1;
    });
  });

  // Calculate border tiles after territory assignment
  calculateBorderTiles(map);

  return {
    currentRound: 1,
    roundStartTime: Date.now(),
    roundDuration: ROUND_DURATION,
    currentPhase: 'placement',
    players: activePlayers,
    playerOrder: activePlayers.map(p => p.id),
    map: Object.fromEntries(flatMap.map(tile => [tile.id, tile])),
    pendingActions: {}
  };
}

function calculateBorderTiles(map: MapTile[][]): void {
  const height = map.length;
  const width = map[0].length;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const tile = map[y][x];
      if (tile.type === 'land' && tile.owner) {
        tile.borderTiles = [];
        
        // Check adjacent tiles (including diagonals)
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            
            const newY = y + dy;
            const newX = x + dx;
            
            if (newY >= 0 && newY < height && newX >= 0 && newX < width) {
              const neighbor = map[newY][newX];
              if (neighbor.type === 'land' && neighbor.owner && neighbor.owner !== tile.owner) {
                tile.borderTiles.push(neighbor.id);
              }
            }
          }
        }
      }
    }
  }
}

export function rotatePlayerOrder(playerOrder: string[]): string[] {
  return [...playerOrder.slice(1), playerOrder[0]];
}

export function executeRound(state: GameState): GameState {
  const newState = { ...state };
  
  // Execute all pending actions in player order
  for (const playerId of state.playerOrder) {
    const action = state.pendingActions[playerId];
    if (!action) continue;

    // Apply troop placements
    Object.entries(action.placements).forEach(([tileId, troops]) => {
      if (newState.map[tileId]) {
        newState.map[tileId].troops = (newState.map[tileId].troops || 0) + troops;
        newState.map[tileId].owner = playerId;
      }
    });
  }

  // Rotate player order for next round
  newState.playerOrder = rotatePlayerOrder(newState.playerOrder);
  newState.currentRound++;
  newState.roundStartTime = Date.now();
  newState.pendingActions = {};

  // Reset troops to place for all players
  newState.players = newState.players.map(player => ({
    ...player,
    troopsToPlace: INITIAL_TROOPS,
    isReady: false
  }));

  return newState;
}

export function isRoundComplete(state: GameState): boolean {
  // Round is complete if all players are ready or time has expired
  const timeExpired = Date.now() - state.roundStartTime >= state.roundDuration;
  const allPlayersReady = state.players.every(p => p.isReady);
  
  return timeExpired || allPlayersReady;
}

export function submitPlayerAction(
  state: GameState,
  playerId: string,
  action: PlayerAction
): GameState {
  return {
    ...state,
    pendingActions: {
      ...state.pendingActions,
      [playerId]: action
    },
    players: state.players.map(p =>
      p.id === playerId ? { ...p, isReady: true } : p
    )
  };
}