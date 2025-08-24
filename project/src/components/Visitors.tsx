import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Users, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Player {
  id: string;
  player_name: string;
  role: string;
  created_at: string;
}

function Visitors() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState<Player[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const { data, error } = await supabase
          .from('game_players')
          .select('*')
          .eq('game_id', gameId)
          .order('created_at', { ascending: true });

        if (error) throw error;

        setVisitors(data.filter(p => p.role === 'visitor'));
        setPlayers(data.filter(p => p.role === 'player'));
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching players:', err);
        setError('Failed to load players');
        setIsLoading(false);
      }
    };

    const subscription = supabase
      .channel(`game_players:${gameId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'game_players',
        filter: `game_id=eq.${gameId}`
      }, () => {
        fetchPlayers();
      })
      .subscribe();

    fetchPlayers();
    const interval = setInterval(fetchPlayers, 5000);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [gameId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mb-4" />
          <p className="text-blue-200">Loading visitors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <div className="bg-black/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate(`/game/${gameId}`)}
            className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
          >
            Return to Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(`/game/${gameId}`)}
          className="mb-8 flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Game
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-black/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Active Players
              </h2>
              <div className="flex items-center text-blue-400">
                <Users className="w-5 h-5 mr-2" />
                <span>{players.length}</span>
              </div>
            </div>

            <div className="space-y-3">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between bg-black/30 rounded-lg p-3 border border-white/10"
                >
                  <span className="text-blue-200">{player.player_name}</span>
                  <span className="text-xs text-blue-400">
                    {new Date(player.created_at).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-black/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Visitors
              </h2>
              <div className="flex items-center text-blue-400">
                <Eye className="w-5 h-5 mr-2" />
                <span>{visitors.length}</span>
              </div>
            </div>

            <div className="space-y-3">
              {visitors.map((visitor) => (
                <div
                  key={visitor.id}
                  className="flex items-center justify-between bg-black/30 rounded-lg p-3 border border-white/10"
                >
                  <span className="text-blue-200">{visitor.player_name}</span>
                  <span className="text-xs text-blue-400">
                    {new Date(visitor.created_at).toLocaleTimeString()}
                  </span>
                </div>
              ))}
              {visitors.length === 0 && (
                <p className="text-blue-200/50 text-center py-4">
                  No visitors at the moment
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Visitors;