import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Users, Loader2, Crown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  createGameSession, 
  joinGameSession, 
  updatePlayerStatus, 
  subscribeToGameUpdates,
  subscribeToGameStatus,
  getGameSession,
  startGame,
  removePlayerFromGame
} from '../lib/supabase';
import { useGameStore } from '../store';

const PLAYER_COLORS = [
  { name: 'Quantum Blue', value: 'bg-blue-500', color: '#3b82f6' },
  { name: 'Entangled Purple', value: 'bg-purple-500', color: '#a855f7' },
  { name: 'Superposition Pink', value: 'bg-pink-500', color: '#ec4899' },
  { name: 'Wave Green', value: 'bg-emerald-500', color: '#10b981' },
  { name: 'Probability Orange', value: 'bg-orange-500', color: '#f97316' },
  { name: 'Particle Yellow', value: 'bg-yellow-500', color: '#eab308' },
];

interface Player {
  id: string;
  player_name: string;
  color: string;
  ready: boolean;
}

interface GameSession {
  host_player: string;
  status: string;
  game_players: Player[];
}

function Play() {
  const navigate = useNavigate();
  const location = useLocation();
  const setPlayersInStore = useGameStore(state => state.setPlayers);
  const [gameId, setGameId] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('game') || Math.random().toString(36).substring(2, 9);
  });
  const [copied, setCopied] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>();
  const [isReady, setIsReady] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hostPlayer, setHostPlayer] = useState<string>('');
  const username = localStorage.getItem('username') || '';

  const inviteLink = `${window.location.origin}/play?game=${gameId}`;

  const refreshGameState = async () => {
    try {
      const gameData = await getGameSession(gameId) as GameSession;
      if (gameData.status === 'playing') {
        navigate(`/game/${gameId}`);
        return;
      }
      setHostPlayer(gameData.host_player);
      
      // Transform game players to match the store's Player interface
      const transformedPlayers = gameData.game_players.map(player => ({
        id: player.id,
        name: player.player_name,
        color: player.color
      }));
      
      setPlayers(gameData.game_players || []);
      setPlayersInStore(transformedPlayers);

      const currentPlayer = gameData.game_players?.find(p => p.player_name === username);
      if (currentPlayer) {
        setSelectedColor(PLAYER_COLORS.find(c => c.color === currentPlayer.color)?.value);
        setIsReady(currentPlayer.ready);
      } else {
        setSelectedColor(undefined);
        setIsReady(false);
      }
    } catch (error) {
      console.error('Error refreshing game state:', error);
    }
  };

  useEffect(() => {
    const initializeGame = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const params = new URLSearchParams(location.search);
        const isNewGame = !params.get('game');

        if (isNewGame) {
          await createGameSession(gameId, username);
          const firstColor = PLAYER_COLORS[0].color;
          await joinGameSession(gameId, username, firstColor);
          setSelectedColor(firstColor);
        }

        await refreshGameState();

        const playerSubscription = subscribeToGameUpdates(gameId, async () => {
          await refreshGameState();
        });

        const statusSubscription = subscribeToGameStatus(gameId, async (payload) => {
          if (payload.new) {
            if (payload.new.status === 'playing') {
              navigate(`/game/${gameId}`);
            } else {
              await refreshGameState();
            }
          }
        });

        const refreshInterval = setInterval(refreshGameState, 1000);

        setIsLoading(false);

        return () => {
          playerSubscription.unsubscribe();
          statusSubscription.unsubscribe();
          clearInterval(refreshInterval);
        };
      } catch (error) {
        console.error('Error initializing game:', error);
        setError('Failed to initialize game session');
        setIsLoading(false);
      }
    };

    initializeGame();
  }, [gameId, username, location.search, navigate]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleColorSelect = async (colorInfo: typeof PLAYER_COLORS[0]) => {
    try {
      setError(null);
      
      if (selectedColor) {
        await removePlayerFromGame(gameId, username);
      }
      
      await joinGameSession(gameId, username, colorInfo.color);
      setSelectedColor(colorInfo.value);
      await refreshGameState();
    } catch (error: any) {
      console.error('Error selecting color:', error);
      setError(error.message || 'Failed to select color');
      await refreshGameState();
    }
  };

  const handleReady = async () => {
    try {
      setError(null);
      await updatePlayerStatus(gameId, username, !isReady);
      setIsReady(!isReady);
      await refreshGameState();
    } catch (error) {
      console.error('Error updating ready status:', error);
      setError('Failed to update ready status');
    }
  };

  const handleStartGame = async () => {
    setIsStarting(true);
    try {
      await startGame(gameId);
      navigate(`/game/${gameId}`);
    } catch (error: any) {
      console.error('Error starting game:', error);
      setError(error.message || 'Failed to start game');
      setIsStarting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="quantum-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mb-4" />
          <p className="text-blue-200">Initializing Quantum Realm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="quantum-bg min-h-screen p-8 relative overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-particle opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${15 + Math.random() * 10}s`
          }}
        />
      ))}

      <div className="max-w-4xl mx-auto relative z-10">
        <button 
          onClick={() => navigate('/home')}
          className="mb-8 flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-black/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
              Game Setup
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-blue-300 mb-2">Invite Players</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={inviteLink}
                    readOnly
                    className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-blue-200"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors duration-300"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-blue-400" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-blue-300 mb-2">Choose Your Color</label>
                <div className="grid grid-cols-3 gap-2">
                  {PLAYER_COLORS.map((colorInfo) => {
                    const isUsed = players.some(p => p.color === colorInfo.color && p.player_name !== username);
                    const isSelected = selectedColor === colorInfo.value;
                    
                    return (
                      <button
                        key={colorInfo.name}
                        onClick={() => !isUsed && handleColorSelect(colorInfo)}
                        disabled={isUsed && !isSelected}
                        className={`
                          h-12 rounded-lg relative ${colorInfo.value} 
                          ${isUsed && !isSelected ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'} 
                          ${isSelected ? 'ring-2 ring-white' : ''}
                          transition-all duration-300
                        `}
                        title={colorInfo.name}
                      >
                        {isUsed && !isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                            <Users className="w-4 h-4 text-white/60" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleReady}
                disabled={!selectedColor}
                className={`
                  w-full py-3 px-4 rounded-lg font-medium text-lg
                  ${isReady 
                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                    : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'}
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-300
                `}
              >
                {isReady ? 'Ready!' : 'Mark as Ready'}
              </button>
            </div>
          </div>

          <div className="bg-black/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Players Lobby
              </h2>
              <div className="flex items-center text-blue-400">
                <Users className="w-5 h-5 mr-2" />
                <span>{players.length}/6</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between bg-black/30 rounded-lg p-3 border border-white/10"
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: player.color }}
                    />
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-200">{player.player_name}</span>
                      {player.player_name === hostPlayer && (
                        <Crown className="w-4 h-4 text-yellow-400" />
                      )}
                    </div>
                  </div>
                  {player.ready ? (
                    <span className="text-green-400 text-sm">Ready</span>
                  ) : (
                    <span className="text-blue-400 text-sm">Not Ready</span>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleStartGame}
              disabled={
                players.length < 2 || 
                !players.every(p => p.ready) || 
                isStarting ||
                username !== hostPlayer
              }
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-medium text-lg
                disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all duration-300"
            >
              {isStarting ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Starting Game...
                </div>
              ) : (
                'Start Game'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Play;