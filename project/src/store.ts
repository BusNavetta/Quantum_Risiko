import { create } from 'zustand';
import { Planet, Player, GameState, GamePhase, PendingAction, StandardMap } from './types';
import { generateInitialPlanets } from './data/planets';
import { supabase } from './lib/supabase';
import { getStandardMap, initializeMapPlanets } from './lib/supabase/api';
import { handlePlanetAttack, CombatResult, resolveMultipleAttacks } from './lib/combat';

const FIRST_ROUND_BONUS = 5;
const INITIAL_TROOPS = 2;
const MAX_TROOPS_PER_PLANET = 8;
const POLL_INTERVAL = 1000;
const MAX_LOAD_ATTEMPTS = 30;
const LOAD_RETRY_DELAY = 1000;
const MAP_LOAD_TIMEOUT = 30000;
const ROUND_CHECK_INTERVAL = 3000;
const MOVE_EXECUTION_DELAY = 3000;
const PHASE_EXECUTION_DELAY = 5000;
const MAX_ROUNDS = 2; // For debugging: game ends after 2 rounds

interface GameStore extends GameState {
  error: string | null;
  setError: (error: string | null) => void;
  debug: string[];
  addDebugMessage: (message: string) => void;
  initialPlanets: Planet[];
}

const useGameStore = create<GameStore>((set, get) => ({
  loadingProgress: 0,
  players: [],
  currentPlayerIndex: 0,
  planets: [],
  initialPlanets: [],
  selectedPlanet: null,
  hoveredPlanet: null,
  movementSourcePlanet: null,
  currentRound: 1,
  currentPhase: 'fortify',
  showPhaseNotification: false,
  phaseNotificationText: '',
  troopsToMove: 0,
  troopsToPlace: FIRST_ROUND_BONUS,
  troopPlacements: {},
  pendingActions: [],
  playerPhases: {},
  error: null,
  debug: [],

  setError: (error) => set({ error }),
  addDebugMessage: (message) => set(state => ({ 
    debug: [...state.debug, `${new Date().toISOString()}: ${message}`] 
  })),

  setHoveredPlanet: (planetId) => set({ hoveredPlanet: planetId }),
  setSelectedPlanet: (planetId) => set({ selectedPlanet: planetId }),
  setMovementSourcePlanet: (planetId) => set({ movementSourcePlanet: planetId }),
  setPlayers: (players) => {
    const state = get();
    state.addDebugMessage(`Setting ${players.length} players`);
    set({ players });
  },
  setPhaseNotificationText: (text) => set({ 
    phaseNotificationText: text,
    showPhaseNotification: true 
  }),
  
  setTroopsToMove: (troops) => set({ troopsToMove: troops }),

  calculateAvailableTroops: () => {
    const state = get();
    const username = localStorage.getItem('username') || '';
    const player = state.players.find(p => p.name === username);
    if (!player) return 0;

    const ownedPlanets = state.planets.filter(p => 
      p.owners.includes(player.id)
    ).length;

    if (state.currentRound === 1) {
      return FIRST_ROUND_BONUS;
    }

    return Math.max(3, ownedPlanets);
  },

  resetTroopPlacements: () => {
    const availableTroops = get().calculateAvailableTroops();
    set({ 
      troopPlacements: {},
      troopsToPlace: availableTroops
    });
  },

  resetMap: () => {
    const state = get();
    set({ planets: [...state.initialPlanets] });
    state.addDebugMessage('Map reset to initial state');
  },

  placeTroops: async (planetId: string, amount: number) => {
    const state = get();
    if (amount > state.troopsToPlace) return;

    try {
      const username = localStorage.getItem('username') || '';
      const currentPlayer = state.players.find(p => p.name === username);
      const gameId = localStorage.getItem('gameId');

      if (!currentPlayer || !gameId) {
        throw new Error('Player or game information not found');
      }

      const planet = state.planets.find(p => p.id === planetId);
      if (!planet) return;

      const totalTroops = planet.troops + amount;
      const actualAmount = Math.min(amount, MAX_TROOPS_PER_PLANET - planet.troops);

      const { error: moveError } = await supabase
        .from('moves')
        .insert({
          game_id: gameId,
          player_id: currentPlayer.id,
          round_number: state.currentRound,
          phase: 'FORTIFY',
          action_type: 'place_troops',
          action_data: {
            planet_id: planetId,
            troops: actualAmount
          },
          executed: false
        });

      if (moveError) throw moveError;

      const newPlanets = state.planets.map(planet => 
        planet.id === planetId
          ? { ...planet, troops: Math.min(planet.troops + amount, MAX_TROOPS_PER_PLANET) }
          : planet
      );

      set(state => ({
        planets: newPlanets,
        troopPlacements: {
          ...state.troopPlacements,
          [planetId]: (state.troopPlacements[planetId] || 0) + actualAmount
        },
        troopsToPlace: state.troopsToPlace - actualAmount
      }));
    } catch (error) {
      console.error('Error recording move:', error);
      state.setError('Failed to record move');
    }
  },

  confirmTroopPlacements: async () => {
    const state = get();
    const username = localStorage.getItem('username') || '';
    const currentPlayer = state.players.find(p => p.name === username);
    
    if (currentPlayer) {
      Object.entries(state.troopPlacements).forEach(([planetId, troops]) => {
        state.addPendingAction({
          type: 'fortify',
          to: planetId,
          troops
        });
      });

      set({
        troopPlacements: {},
        troopsToPlace: 0,
        currentPhase: 'attack',
        showPhaseNotification: true,
        phaseNotificationText: 'Attack phase...'
      });
    }
  },

  handleAttack: async (defenderPlanetId: string, attackerPlanetId: string, attackerTroops: number) => {
    const state = get();
    const username = localStorage.getItem('username') || '';
    const currentPlayer = state.players.find(p => p.name === username);
    
    if (!currentPlayer) return;

    const defenderPlanet = state.planets.find(p => p.id === defenderPlanetId);
    const attackerPlanet = state.planets.find(p => p.id === attackerPlanetId);

    if (!defenderPlanet || !attackerPlanet) return;

    const result = handlePlanetAttack(
      defenderPlanet,
      attackerPlanet,
      attackerTroops,
      currentPlayer
    );

    if (!result.success) {
      set({ error: result.message });
      return;
    }

    try {
      const gameId = localStorage.getItem('gameId');
      const { error: moveError } = await supabase
        .from('moves')
        .insert({
          game_id: gameId,
          player_id: currentPlayer.id,
          round_number: state.currentRound,
          phase: 'ATTACK',
          action_type: 'attack',
          action_data: {
            from_planet: attackerPlanetId,
            to_planet: defenderPlanetId,
            troops: attackerTroops
          },
          executed: false
        });

      if (moveError) throw moveError;

      const updatedPlanets = state.planets.map(planet => {
        if (planet.id === defenderPlanetId) {
          return {
            ...result.updatedDefender!,
            troops: Math.min(result.updatedDefender!.troops, MAX_TROOPS_PER_PLANET)
          };
        }
        if (planet.id === attackerPlanetId) {
          return result.updatedAttacker!;
        }
        return planet;
      });

      set({ planets: updatedPlanets });
    } catch (error) {
      console.error('Error recording attack:', error);
      set({ error: 'Failed to record attack' });
    }
  },

  moveTroops: async (fromPlanetId: string, toPlanetId: string, troops: number) => {
    const state = get();
    const username = localStorage.getItem('username') || '';
    const currentPlayer = state.players.find(p => p.name === username);
    const gameId = localStorage.getItem('gameId');

    if (!currentPlayer || !gameId) {
      state.setError('Player or game information not found');
      return;
    }

    try {
      const toPlanet = state.planets.find(p => p.id === toPlanetId);
      if (!toPlanet) return;

      const actualTroops = Math.min(troops, MAX_TROOPS_PER_PLANET - toPlanet.troops);

      const { error: moveError } = await supabase
        .from('moves')
        .insert({
          game_id: gameId,
          player_id: currentPlayer.id,
          round_number: state.currentRound,
          phase: 'MOVEMENT',
          action_type: 'move_troops',
          action_data: {
            from_planet: fromPlanetId,
            to_planet: toPlanetId,
            troops: actualTroops
          },
          executed: false
        });

      if (moveError) throw moveError;

      const newPlanets = state.planets.map(planet => {
        if (planet.id === fromPlanetId) {
          return { ...planet, troops: planet.troops - actualTroops };
        }
        if (planet.id === toPlanetId) {
          return { ...planet, troops: Math.min(planet.troops + actualTroops, MAX_TROOPS_PER_PLANET) };
        }
        return planet;
      });

      set({ planets: newPlanets });
    } catch (error) {
      console.error('Error recording troop movement:', error);
      state.setError('Failed to record troop movement');
    }
  },

  addPendingAction: (action: PendingAction) => {
    set(state => ({
      pendingActions: [...state.pendingActions, action]
    }));
  },

  playerReadyForPhase: async (playerId: string) => {
    const state = get();
    const gameId = localStorage.getItem('gameId');
    
    try {
      if (state.currentPhase === 'movement') {
        state.addDebugMessage(`Player ${playerId} marking as finished`);
        
        const { error: updateError } = await supabase
          .from('game_players')
          .update({ finished: true })
          .eq('game_id', gameId)
          .eq('id', playerId);

        if (updateError) {
          state.addDebugMessage(`Error marking player as finished: ${updateError.message}`);
          throw updateError;
        }

        set({ 
          showPhaseNotification: true,
          phaseNotificationText: 'Waiting for other players...'
        });

        let checkInterval: NodeJS.Timeout;

        const checkAllPlayersFinished = async () => {
          const { data: players, error: playersError } = await supabase
            .from('game_players')
            .select('*')
            .eq('game_id', gameId)
            .eq('role', 'player');

          if (playersError) {
            state.addDebugMessage(`Error checking players: ${playersError.message}`);
            clearInterval(checkInterval);
            throw playersError;
          }
          
          const activePlayers = players?.filter(p => p.role === 'player') || [];
          const finishedPlayers = activePlayers.filter(p => p.finished);
          const allFinished = activePlayers.length > 0 && finishedPlayers.length === activePlayers.length;
          
          state.addDebugMessage(`Player status check - Total: ${activePlayers.length}, Finished: ${finishedPlayers.length}`);
          
          if (allFinished && activePlayers.length > 0) {
            clearInterval(checkInterval);
            state.addDebugMessage('All players finished, executing round');
            await state.executeRound();
          }
        };

        checkInterval = setInterval(checkAllPlayersFinished, ROUND_CHECK_INTERVAL);
      } else {
        const nextPhase = state.currentPhase === 'fortify' ? 'attack' : 'movement';
        await state.setCurrentPhase(nextPhase);
      }
    } catch (error) {
      console.error('Error updating player ready status:', error);
      state.setError('Failed to update ready status');
    }
  },

  isPlayerReady: (playerId: string) => {
    const state = get();
    const player = state.players.find(p => p.id === playerId);
    return player?.isReady || false;
  },

  executeRound: async () => {
    const state = get();
    set({ 
      currentPhase: 'applying_moves',
      showPhaseNotification: true,
      phaseNotificationText: 'Applying moves...'
    });

    try {
      state.resetMap();
      state.addDebugMessage('Map reset before executing round');
      
      let newPlanets = [...state.initialPlanets];
      
      const gameId = localStorage.getItem('gameId');
      const { data: moves } = await supabase
        .from('moves')
        .select('*')
        .eq('game_id', gameId)
        .eq('round_number', state.currentRound)
        .order('created_at', { ascending: true });

      if (!moves) return;

      for (const move of moves) {
        if (move.action_type === 'place_troops') {
          const { action_data, player_id } = move;
          const player = state.players.find(p => p.id === player_id);
          
          if (!player) continue;

          set({ 
            phaseNotificationText: `${player.name} is placing troops on their planets...`,
            showPhaseNotification: true
          });

          await new Promise(resolve => setTimeout(resolve, MOVE_EXECUTION_DELAY));

          newPlanets = newPlanets.map(planet => {
            if (planet.id === action_data.planet_id) {
              const newTroops = Math.min(planet.troops + action_data.troops, MAX_TROOPS_PER_PLANET);
              return { ...planet, troops: newTroops };
            }
            return planet;
          });
          
          set({ planets: newPlanets });
        }
      }

      const attacks = moves.filter(move => move.action_type === 'attack');
      const attackedPlanets = new Set(attacks.map(move => move.action_data.to_planet));

      const attacksByTarget = attacks.reduce((acc, move) => {
        const targetId = move.action_data.to_planet;
        if (!acc[targetId]) {
          acc[targetId] = [];
        }
        const player = state.players.find(p => p.id === move.player_id);
        if (player) {
          acc[targetId].push({
            playerId: move.player_id,
            troops: move.action_data.troops,
            fromPlanetId: move.action_data.from_planet,
            color: player.color
          });
        }
        return acc;
      }, {} as Record<string, any[]>);

      for (const [targetId, attacks] of Object.entries(attacksByTarget)) {
        const targetPlanet = newPlanets.find(p => p.id === targetId);
        if (!targetPlanet) continue;

        const attackers = attacks.map(a => {
          const player = state.players.find(p => p.id === a.playerId);
          return player ? player.name : 'Unknown';
        }).join(', ');

        set({ 
          phaseNotificationText: `Battle for ${targetPlanet.name}!\n${attackers} attacking...`,
          showPhaseNotification: true
        });

        await new Promise(resolve => setTimeout(resolve, PHASE_EXECUTION_DELAY));

        const resolvedPlanet = resolveMultipleAttacks(targetPlanet, attacks, newPlanets);
        resolvedPlanet.troops = Math.min(resolvedPlanet.troops, MAX_TROOPS_PER_PLANET);
        
        newPlanets = newPlanets.map(planet =>
          planet.id === targetId ? resolvedPlanet : planet
        );
        
        set({ planets: newPlanets });
      }

      for (const move of moves) {
        if (move.action_type === 'move_troops') {
          const { action_data, player_id } = move;
          
          if (attackedPlanets.has(action_data.to_planet)) {
            continue;
          }

          const player = state.players.find(p => p.id === player_id);
          if (!player) continue;

          const sourcePlanet = newPlanets.find(p => p.id === action_data.from_planet);
          const targetPlanet = newPlanets.find(p => p.id === action_data.to_planet);

          if (sourcePlanet && targetPlanet) {
            set({ 
              phaseNotificationText: `${player.name} moving ${action_data.troops} troops\nfrom ${sourcePlanet.name} to ${targetPlanet.name}`,
              showPhaseNotification: true
            });

            await new Promise(resolve => setTimeout(resolve, PHASE_EXECUTION_DELAY));

            const actualTroops = Math.min(action_data.troops, MAX_TROOPS_PER_PLANET - targetPlanet.troops);

            newPlanets = newPlanets.map(planet => {
              if (planet.id === action_data.from_planet) {
                return { ...planet, troops: planet.troops - actualTroops };
              }
              if (planet.id === action_data.to_planet) {
                return { ...planet, troops: Math.min(planet.troops + actualTroops, MAX_TROOPS_PER_PLANET) };
              }
              return planet;
            });
            
            set({ planets: newPlanets });
          }
        }
      }

      const { error: resetError } = await supabase
        .from('game_players')
        .update({ finished: false })
        .eq('game_id', gameId)
        .eq('role', 'player');

      if (resetError) throw resetError;

      const nextRound = state.currentRound + 1;
      const availableTroops = nextRound === 1 ? FIRST_ROUND_BONUS : 0;

      // Check if game should end (for debugging: after 2 rounds)
      if (nextRound > MAX_ROUNDS) {
        // Game is complete, don't update to next round
        set({
          planets: newPlanets,
          initialPlanets: newPlanets,
          players: state.players.map(p => ({ ...p, isReady: false })),
          pendingActions: [],
          currentPhase: 'game_complete' as GamePhase,
          showPhaseNotification: true,
          phaseNotificationText: 'Game Complete!',
          troopsToPlace: 0,
          playerPhases: {},
          movementSourcePlanet: null,
          selectedPlanet: null
        });
        return;
      }

      const newState = {
        planets: newPlanets,
        initialPlanets: newPlanets,
        players: state.players.map(p => ({ ...p, isReady: false })),
        pendingActions: [],
        currentPhase: 'fortify' as GamePhase,
        currentRound: nextRound,
        showPhaseNotification: true,
        phaseNotificationText: `Starting round ${nextRound}...`,
        troopsToPlace: availableTroops,
        playerPhases: {},
        movementSourcePlanet: null,
        selectedPlanet: null
      };

      set(newState);

      const username = localStorage.getItem('username') || '';
      const currentPlayer = state.players.find(p => p.name === username);
      if (currentPlayer) {
        const ownedPlanets = newPlanets.filter(p => 
          p.owners.includes(currentPlayer.id)
        ).length;
        const troopsToPlace = nextRound === 1 ? FIRST_ROUND_BONUS : Math.max(3, ownedPlanets);
        set({ troopsToPlace });
      }

    } catch (error) {
      console.error('Error executing round:', error);
      state.setError('Failed to execute round');
    }
  },

  setCurrentPhase: async (phase: GamePhase) => {
    const state = get();
    const username = localStorage.getItem('username') || '';
    const currentPlayer = state.players.find(p => p.name === username);
    if (!currentPlayer) return;

    const availableTroops = phase === 'fortify' ? get().calculateAvailableTroops() : 0;
    const phaseText = phase === 'fortify' && availableTroops > 0
      ? `Fortify phase - Place ${availableTroops} troops!`
      : `${phase.charAt(0).toUpperCase() + phase.slice(1)} phase...`;

    set({
      currentPhase: phase,
      showPhaseNotification: true,
      phaseNotificationText: phaseText,
      troopsToMove: 0,
      troopsToPlace: availableTroops,
      troopPlacements: {},
      selectedPlanet: null,
      movementSourcePlanet: null,
      players: state.players.map(p => ({ ...p, isReady: false }))
    });
  },

  hidePhaseNotification: () => set({ showPhaseNotification: false }),

  endTurn: () => {
    const state = get();
    const username = localStorage.getItem('username') || '';
    const currentPlayer = state.players.find(p => p.name === username);
    
    if (!currentPlayer) return;

    switch (state.currentPhase) {
      case 'fortify':
        state.confirmTroopPlacements();
        break;
      case 'attack':
        state.playerReadyForPhase(currentPlayer.id);
        break;
      case 'movement':
        state.playerReadyForPhase(currentPlayer.id);
        break;
    }
  },

  setLoadingProgress: (progress) => set({ loadingProgress: progress }),

  initializeGame: async () => {
    const state = get();
    state.addDebugMessage('Starting game initialization');
    
    try {
      const gameId = localStorage.getItem('gameId');
      const username = localStorage.getItem('username') || '';
      
      if (!gameId || !username) {
        throw new Error('Missing game or user information');
      }

      // Reset map loading status for this player
      // Reset map loading status for this player
      const { error: resetError } = await supabase
        .from('game_players')
        .update({ map_loaded: false })
        .eq('game_id', gameId)
        .eq('player_name', username);

      if (resetError) {
        state.addDebugMessage(`Error resetting map loaded status: ${resetError.message}`);
        throw resetError;
      }

      if (resetError) {
        state.addDebugMessage(`Error resetting map loaded status: ${resetError.message}`);
        throw resetError;
      }
      const { data: gameSession } = await supabase
        .from('game_sessions')
        .select('seed')
        .eq('game_id', gameId)
        .single();

      if (!gameSession?.seed) {
        throw new Error('Game seed not found');
      }

      state.addDebugMessage(`Game seed: ${gameSession.seed}`);

      state.addDebugMessage('Loading standard map...');
      const standardMap = await getStandardMap('Standard Galaxy v1', 1);
      state.addDebugMessage(`Loaded standard map with ${standardMap?.planets?.length || 0} planets`);

      // Check if this player is the host
      const { data: gameData } = await supabase
        .from('game_sessions')
        .select('host_player')
        .eq('game_id', gameId)
        .single();
      
      const isHost = gameData?.host_player === username;
      state.addDebugMessage(`Player ${username} is ${isHost ? 'host' : 'not host'}`);

      // Only the host should initialize planet assignments, and only if not already done
      if (isHost && (!standardMap.instanced_planets || standardMap.instanced_planets.length === 0)) {
        state.addDebugMessage('Host initializing planet assignments...');
        
        // Get current active players for this game
        const { data: activePlayers } = await supabase
          .from('game_players')
          .select('*')
          .eq('game_id', gameId)
          .eq('role', 'player')
          .order('created_at', { ascending: true });
        
        if (!activePlayers || activePlayers.length === 0) {
          throw new Error('No active players found for planet assignment');
        }
        
        const playerData = activePlayers.map(p => ({
          id: p.id,
          name: p.player_name,
          color: p.color
        }));
        
        
        await initializeMapPlanets('Standard Galaxy v1', 1, playerData, gameSession.seed);
        state.addDebugMessage('Planet assignments completed');
      }

      let instancedMap = standardMap;
      let attempts = 0;
      const startTime = Date.now();

      // Wait for planet assignments to be available
      while ((!instancedMap.instanced_planets || instancedMap.instanced_planets.length === 0) && Date.now() - startTime < MAP_LOAD_TIMEOUT) {
        state.addDebugMessage(`Waiting for planet assignments... Attempt ${attempts + 1}`);
        
        const { data } = await supabase
          .from('standard_maps')
          .select('instanced_planets')
          .eq('name', 'Standard Galaxy v1')
          .eq('version', 1)
          .eq('is_active', true)
          .single();

        if (data?.instanced_planets && data.instanced_planets.length > 0) {
          instancedMap = { ...standardMap, instanced_planets: data.instanced_planets };
          state.addDebugMessage('Planet assignments received');
          break;
        }

        await new Promise(resolve => setTimeout(resolve, LOAD_RETRY_DELAY));
        attempts++;
      }

      if (!instancedMap.instanced_planets || instancedMap.instanced_planets.length === 0) {
        throw new Error('Failed to load planet assignments - timeout');
      }
      
      state.addDebugMessage('Converting instanced planets to game format...');
      const planets = instancedMap.instanced_planets.map((p: any) => ({
        id: p.id,
        name: p.name,
        position: p.position,
        size: 1.2,
        color: p.assigned_color,
        owners: p.assigned_color !== '#4a5568' 
          ? [state.players.find(player => player.color === p.assigned_color)?.id || '']
          : [],
        troops: p.assigned_color !== '#4a5568' ? INITIAL_TROOPS : 0,
        type: p.type || 'rocky',
        maxTroops: p.maxTroops || MAX_TROOPS_PER_PLANET,
        resources: p.resources || { gas: 0, metal: 0, crystal: 0 },
      }));
      
      // Log planet assignment statistics
      const assignedPlanets = planets.filter(p => p.owners.length > 0);
      const planetsPerPlayer = state.players.reduce((acc, player) => {
        const count = assignedPlanets.filter(p => p.owners.includes(player.id)).length;
        acc[player.name] = count;
        return acc;
      }, {} as Record<string, number>);
      
      state.addDebugMessage(`Planet assignment: ${JSON.stringify(planetsPerPlayer)}`);
      state.addDebugMessage(`Total assigned planets: ${assignedPlanets.length}/${planets.length}`);
      
      set({ 
        planets: planets,
        initialPlanets: planets,
      });
      state.addDebugMessage('Planets converted and loaded');

      // Mark this player as having loaded the map
      try {
        state.addDebugMessage('Updating map loaded status...');
        const { error } = await supabase
          .from('game_players')
          .update({ map_loaded: true })
          .eq('game_id', gameId)
          .eq('player_name', username);

        if (error) throw error;
        state.addDebugMessage('Map loaded status updated successfully');
        
        // Wait for all players to load the map before proceeding
        state.addDebugMessage('Waiting for all players to load the map...');
        await state.waitForAllPlayersToLoadMap(gameId);
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update map loaded status';
        state.addDebugMessage(`Error updating map loaded status: ${errorMessage}`);
        throw error;
      }
      
      const availableTroops = FIRST_ROUND_BONUS;
      
      set({ 
        currentPhase: 'fortify',
        showPhaseNotification: true,
        phaseNotificationText: `Fortify phase - Place ${availableTroops} troops!`,
        troopsToPlace: availableTroops,
        players: state.players.map(p => ({ ...p, isReady: false })),
        error: null
      });

      state.addDebugMessage('Game initialization complete');

      setTimeout(() => {
        set({ showPhaseNotification: false });
      }, 1500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize game';
      state.addDebugMessage(`Error during initialization: ${errorMessage}`);
      console.error('Game initialization error:', error);
      set({ 
        error: errorMessage,
        loadingProgress: 100
      });
    }
  },

  waitForAllPlayersToLoadMap: async (gameId: string) => {
    const state = get();
    const maxWaitTime = 60000; // 60 seconds timeout
    const checkInterval = 1000; // Check every second
    const startTime = Date.now();
    
    return new Promise<void>((resolve, reject) => {
      const checkAllPlayersLoaded = async () => {
        try {
          // Get all active players in the game
          const { data: players, error } = await supabase
            .from('game_players')
            .select('player_name, map_loaded')
            .eq('game_id', gameId)
            .eq('role', 'player');
          
          if (error) {
            state.addDebugMessage(`Error checking player map loading status: ${error.message}`);
            reject(error);
            return;
          }
          
          if (!players || players.length === 0) {
            state.addDebugMessage('No active players found');
            reject(new Error('No active players found'));
            return;
          }
          
          const loadedPlayers = players.filter(p => p.map_loaded);
          const allPlayersLoaded = loadedPlayers.length === players.length;
          
          state.addDebugMessage(`Map loading progress: ${loadedPlayers.length}/${players.length} players loaded`);
          
          if (allPlayersLoaded) {
            state.addDebugMessage('All players have loaded the map!');
            resolve();
            return;
          }
          
          // Check for timeout
          if (Date.now() - startTime > maxWaitTime) {
            const notLoadedPlayers = players.filter(p => !p.map_loaded).map(p => p.player_name);
            state.addDebugMessage(`Timeout waiting for players to load map: ${notLoadedPlayers.join(', ')}`);
            reject(new Error(`Timeout waiting for players to load map: ${notLoadedPlayers.join(', ')}`));
            return;
          }
          
          // Continue checking
          setTimeout(checkAllPlayersLoaded, checkInterval);
          
        } catch (error) {
          state.addDebugMessage(`Error in map loading check: ${error instanceof Error ? error.message : 'Unknown error'}`);
          reject(error);
        }
      };
      
      // Start checking
      checkAllPlayersLoaded();
    });
  },

}));

// Helper function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export { useGameStore };