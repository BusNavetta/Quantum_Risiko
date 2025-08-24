import { supabase, handleSupabaseError } from './client';
import type { GameSession, GamePlayer, StandardMap } from '../../types/game';

export const createGameSession = async (gameId: string, hostPlayer: string): Promise<GameSession> => {
  try {
    const { data, error } = await supabase
      .from('game_sessions')
      .insert([
        { 
          game_id: gameId,
          host_player: hostPlayer,
          status: 'waiting',
          game_state: {}
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    return handleSupabaseError(error);
  }
};

export const getGameSession = async (gameId: string): Promise<GameSession> => {
  try {
    const { data, error } = await supabase
      .from('game_sessions')
      .select(`
        *,
        game_players (*)
      `)
      .eq('game_id', gameId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    return handleSupabaseError(error);
  }
};

export const updateGameState = async (gameId: string, gameState: any): Promise<void> => {
  try {
    const { error } = await supabase
      .from('game_sessions')
      .update({ game_state: gameState })
      .eq('game_id', gameId);

    if (error) throw error;
  } catch (error) {
    handleSupabaseError(error);
  }
};

export const joinGameSession = async (
  gameId: string, 
  player: string, 
  color: string
): Promise<GamePlayer> => {
  try {
    // Check if player has previously exited this game
    const exitedGames = JSON.parse(localStorage.getItem('exitedGames') || '{}');
    if (exitedGames[gameId]) {
      throw new Error('You have left this game and cannot rejoin');
    }

    // Get current game status
    const { data: session } = await supabase
      .from('game_sessions')
      .select('status, game_players(count)')
      .eq('game_id', gameId)
      .single();

    if (!session) throw new Error('Game not found');
    if (session.status === 'ended') throw new Error('This game has ended');

    const isVisitor = session.status === 'playing';
    const role = isVisitor ? 'visitor' : 'player';

    if (!isVisitor) {
      // Check player count and color availability
      const { data: players } = await supabase
        .from('game_players')
        .select('*')
        .eq('game_id', gameId)
        .eq('role', 'player');

      if (players && players.length >= 6) {
        throw new Error('Game lobby is full');
      }

      const colorTaken = players?.some(p => 
        p.color === color && p.player_name !== player
      );

      if (colorTaken) {
        throw new Error('This color is already taken');
      }
    }

    // Join or update player
    const { data, error } = await supabase
      .from('game_players')
      .upsert({
        game_id: gameId,
        player_name: player,
        color,
        role,
        ready: false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    return handleSupabaseError(error);
  }
};

export const getStandardMap = async (name: string, version: number): Promise<StandardMap> => {
  try {
    const { data, error } = await supabase
      .from('standard_maps')
      .select('*')
      .eq('name', name)
      .eq('version', version)
      .eq('is_active', true)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Standard map not found');
    
    // Validate map data
    if (!data.planets || !Array.isArray(data.planets)) {
      throw new Error('Invalid map data: planets array is missing or invalid');
    }

    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error 
        ? `Failed to load standard map: ${error.message}`
        : 'Failed to load standard map'
    );
  }
};

export const initializeMapPlanets = async (
  mapName: string,
  version: number,
  players: { id: string; name: string; color: string }[],
  seed: string
): Promise<void> => {
  try {
    // Get the standard map
    const { data: map } = await supabase
      .from('standard_maps')
      .select('planets')
      .eq('name', mapName)
      .eq('version', version)
      .eq('is_active', true)
      .single();

    if (!map || !map.planets) {
      throw new Error('Map not found or invalid');
    }

    // Create a seeded random number generator that maintains state
    let seedValue = parseInt(seed) || 12345;
    const seededRandom = () => {
      seedValue = ((seedValue * 1103515245) + 12345) & 0x7fffffff;
      return seedValue / 0x7fffffff;
    };
    
    // Calculate planets per player
    const planetsPerPlayer = 10; // Fixed: 10 planets per player
    
    // Shuffle planets array using seeded random
    const shuffledPlanets = [...map.planets].sort(() => seededRandom() - 0.5);

    // Assign planets to players
    const instancedPlanets = shuffledPlanets.map((planet, index) => {
      const playerIndex = Math.floor(index / planetsPerPlayer);
      const player = players[playerIndex];

      return {
        ...planet,
        assigned_color: player && index < planetsPerPlayer * players.length
          ? player.color
          : '#4a5568',
        troops: 0
      };
    });

    // Update the standard map with instanced planets
    const { error } = await supabase
      .from('standard_maps')
      .update({ instanced_planets: instancedPlanets })
      .eq('name', mapName)
      .eq('version', version)
      .eq('is_active', true);

    if (error) throw error;
  } catch (error) {
    throw new Error(
      error instanceof Error 
        ? `Failed to initialize map planets: ${error.message}`
        : 'Failed to initialize map planets'
    );
  }
};

export const subscribeToGameUpdates = (
  gameId: string, 
  callback: (payload: any) => void
) => {
  return supabase
    .channel(`game:${gameId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'game_players',
      filter: `game_id=eq.${gameId}`
    }, callback)
    .subscribe();
};

export const subscribeToGameState = (
  gameId: string,
  callback: (payload: any) => void
) => {
  return supabase
    .channel(`game_state:${gameId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'game_sessions',
      filter: `game_id=eq.${gameId}`
    }, callback)
    .subscribe();
};