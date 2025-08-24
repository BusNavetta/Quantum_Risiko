import { createClient } from '@supabase/supabase-js';

if (!import.meta.env.VITE_SUPABASE_URL) {
  throw new Error('VITE_SUPABASE_URL environment variable is not defined');
}

if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('VITE_SUPABASE_ANON_KEY environment variable is not defined');
}

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function generateSeedFromGameId(gameId: string): string {
  // Convert gameId to a consistent numeric seed using ASCII values
  let seed = '';
  for (let i = 0; i < gameId.length; i++) {
    seed += gameId.charCodeAt(i).toString().padStart(3, '0');
  }
  return seed;
}

export const createGameSession = async (gameId: string, hostPlayer: string) => {
  const seed = generateSeedFromGameId(gameId);
  
  const { data, error } = await supabase
    .from('game_sessions')
    .insert([
      { 
        game_id: gameId,
        host_player: hostPlayer,
        status: 'waiting',
        seed: seed
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getGameSession = async (gameId: string) => {
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
};

export const exitGame = async (gameId: string, playerName: string) => {
  try {
    // First get the current game session to check if the player is the host
    const gameSession = await getGameSession(gameId);
    const isHost = gameSession.host_player === playerName;
    const remainingPlayers = gameSession.game_players.filter(p => 
      p.player_name !== playerName && p.role === 'player'
    );
    
    // Remove the player from the game
    await removePlayerFromGame(gameId, playerName);
    
    // Store the exited player in local storage to prevent rejoin
    const exitedGames = JSON.parse(localStorage.getItem('exitedGames') || '{}');
    exitedGames[gameId] = true;
    localStorage.setItem('exitedGames', JSON.stringify(exitedGames));
    
    // If the player was the host or there's only one or no players left, end the game
    if (isHost || remainingPlayers.length <= 1) {
      await supabase
        .from('game_sessions')
        .update({ 
          status: 'ended',
          ended_at: new Date().toISOString()
        })
        .eq('game_id', gameId);
      return;
    }

    // If the player was the host but there are other players, reassign host
    if (isHost && remainingPlayers.length > 0) {
      await supabase
        .from('game_sessions')
        .update({ host_player: remainingPlayers[0].player_name })
        .eq('game_id', gameId);
    }

    // Update game state to remove player's territories
    const { data: gameData } = await supabase
      .from('game_sessions')
      .select('game_state')
      .eq('game_id', gameId)
      .single();

    if (gameData?.game_state?.map) {
      const updatedMap = gameData.game_state.map.map((row: any[]) =>
        row.map((tile: any) => {
          if (tile.owner === playerName) {
            const { owner, troops, ...rest } = tile;
            return rest;
          }
          return tile;
        })
      );

      const updatedGameState = {
        ...gameData.game_state,
        map: updatedMap,
        players: gameData.game_state.players.filter((p: any) => p.player_name !== playerName)
      };

      // If it was the current player's turn, move to the next player
      if (gameData.game_state.currentTurn === playerName) {
        const remainingPlayers = updatedGameState.players;
        if (remainingPlayers.length > 0) {
          updatedGameState.currentTurn = remainingPlayers[0].player_name;
          updatedGameState.currentStep = 0;
        }
      }

      await supabase
        .from('game_sessions')
        .update({ game_state: updatedGameState })
        .eq('game_id', gameId);
    }

  } catch (error) {
    console.error('Error exiting game:', error);
    throw error;
  }
};

export const removePlayerFromGame = async (gameId: string, playerName: string) => {
  const { error } = await supabase
    .from('game_players')
    .delete()
    .match({ game_id: gameId, player_name: playerName });

  if (error) throw error;
};

export const joinGameSession = async (gameId: string, player: string, color: string) => {
  // Check if player has previously exited this game
  const exitedGames = JSON.parse(localStorage.getItem('exitedGames') || '{}');
  if (exitedGames[gameId]) {
    throw new Error('You have left this game and cannot rejoin');
  }

  // First check if the game exists and get its status
  const { data: session, error: sessionError } = await supabase
    .from('game_sessions')
    .select('status, game_players(count)')
    .eq('game_id', gameId)
    .single();

  if (sessionError) throw sessionError;

  if (session.status === 'ended') {
    throw new Error('This game has ended');
  }

  // Determine if the player should join as a visitor
  const isVisitor = session.status === 'playing';
  const role = isVisitor ? 'visitor' : 'player';

  // For visitors, we don't need to check player count or color
  if (!isVisitor) {
    // Check player count (excluding the current player)
    const { data: currentPlayer } = await supabase
      .from('game_players')
      .select('id')
      .match({ game_id: gameId, player_name: player, role: 'player' })
      .single();

    const { data: totalPlayers } = await supabase
      .from('game_players')
      .select('id')
      .eq('game_id', gameId)
      .eq('role', 'player');

    const playerCount = totalPlayers?.length || 0;
    if (!currentPlayer && playerCount >= 6) {
      throw new Error('Game lobby is full');
    }

    // Check if the color is already taken by another player
    const { data: existingPlayers, error: colorCheckError } = await supabase
      .from('game_players')
      .select('player_name, color')
      .eq('game_id', gameId)
      .eq('color', color)
      .eq('role', 'player');

    if (colorCheckError) throw colorCheckError;

    if (existingPlayers && existingPlayers.length > 0 && existingPlayers[0].player_name !== player) {
      throw new Error('This color is already taken');
    }
  }

  // Check if player already exists in the game
  const { data: existingPlayer } = await supabase
    .from('game_players')
    .select('*')
    .match({ game_id: gameId, player_name: player })
    .single();

  let result;
  if (existingPlayer) {
    // Update existing player's role and color
    const { data, error } = await supabase
      .from('game_players')
      .update({ color, role })
      .match({ game_id: gameId, player_name: player })
      .select()
      .single();

    if (error) throw error;
    result = data;
  } else {
    // Add new player entry
    const { data, error } = await supabase
      .from('game_players')
      .insert([
        {
          game_id: gameId,
          player_name: player,
          color: color,
          ready: false,
          role
        }
      ])
      .select()
      .single();

    if (error) throw error;
    result = data;
  }

  return result;
};

export const updatePlayerStatus = async (gameId: string, player: string, ready: boolean) => {
  const { error } = await supabase
    .from('game_players')
    .update({ ready })
    .match({ game_id: gameId, player_name: player });

  if (error) throw error;
};

export const startGame = async (gameId: string) => {
  // Check if there are at least 2 players and all are ready
  const { data: players, error: playersError } = await supabase
    .from('game_players')
    .select('ready')
    .eq('game_id', gameId)
    .eq('role', 'player');

  if (playersError) throw playersError;
  
  if (!players || players.length < 2) {
    throw new Error('At least 2 players are required to start the game');
  }

  if (!players.every(p => p.ready)) {
    throw new Error('All players must be ready to start the game');
  }

  const { error } = await supabase
    .from('game_sessions')
    .update({ status: 'playing' })
    .match({ game_id: gameId });

  if (error) throw error;
};

export const placeTroops = async (gameId: string, playerName: string, x: number, y: number, troops: number) => {
  const { data: tile, error: tileError } = await supabase
    .from('map_tiles')
    .select('*')
    .eq('game_id', gameId)
    .eq('x', x)
    .eq('y', y)
    .single();

  if (tileError) throw tileError;

  if (tile.type === 'water') {
    throw new Error('Cannot place troops on water');
  }

  if (tile.owner && tile.owner !== playerName) {
    throw new Error('This territory belongs to another player');
  }

  const { error } = await supabase
    .from('map_tiles')
    .update({
      owner_name: playerName,
      troops: (tile.troops || 0) + troops
    })
    .eq('game_id', gameId)
    .eq('x', x)
    .eq('y', y);

  if (error) throw error;
};

export const subscribeToGameUpdates = (gameId: string, callback: (payload: any) => void) => {
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

export const subscribeToGameStatus = (gameId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`game_status:${gameId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'game_sessions',
      filter: `game_id=eq.${gameId}`
    }, callback)
    .subscribe();
};