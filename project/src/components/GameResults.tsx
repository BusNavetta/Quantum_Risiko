import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Trophy, Medal, Award, Home, Star, Users, Target, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store';
import { supabase } from '../lib/supabase';

interface PlayerScore {
  id: string;
  name: string;
  color: string;
  planets: number;
  troops: number;
  totalScore: number;
  rank: number;
}

export default function GameResults() {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const [playerScores, setPlayerScores] = useState<PlayerScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [winner, setWinner] = useState<PlayerScore | null>(null);
  
  const planets = useGameStore(state => state.planets);
  const players = useGameStore(state => state.players);
  const currentRound = useGameStore(state => state.currentRound);

  useEffect(() => {
    calculateFinalScores();
  }, [planets, players]);

  const calculateFinalScores = () => {
    const scores: PlayerScore[] = players.map(player => {
      const ownedPlanets = planets.filter(planet => 
        planet.owners.includes(player.id)
      );
      
      const planetCount = ownedPlanets.length;
      const troopCount = ownedPlanets.reduce((total, planet) => total + planet.troops, 0);
      
      // Scoring: 10 points per planet + 1 point per troop
      const totalScore = (planetCount * 10) + troopCount;
      
      return {
        id: player.id,
        name: player.name,
        color: player.color,
        planets: planetCount,
        troops: troopCount,
        totalScore,
        rank: 0
      };
    });

    // Sort by score and assign ranks
    scores.sort((a, b) => b.totalScore - a.totalScore);
    scores.forEach((score, index) => {
      score.rank = index + 1;
    });

    setPlayerScores(scores);
    setWinner(scores[0]);
    setIsLoading(false);
  };

  const handleBackToHome = async () => {
    try {
      // Reset all runtime variables before ending the game
      await resetGameRuntimeVariables(gameId);
      
      // End the game session
      if (gameId) {
        await supabase
          .from('game_sessions')
          .update({ 
            status: 'ended',
            ended_at: new Date().toISOString()
          })
          .eq('game_id', gameId);
      }
      
      // Navigate back to home
      navigate('/home');
    } catch (error) {
      console.error('Error ending game:', error);
      // Navigate anyway
      navigate('/home');
    }
  };

  const resetGameRuntimeVariables = async (gameId: string | undefined) => {
    if (!gameId) return;

    try {
      // Reset instanced planets in standard maps
      await supabase
        .from('standard_maps')
        .update({ instanced_planets: null })
        .eq('name', 'Standard Galaxy v1')
        .eq('version', 1)
        .eq('is_active', true);

      // Reset all game players' runtime states
      await supabase
        .from('game_players')
        .update({ 
          ready: false,
          map_loaded: false,
          finished: false
        })
        .eq('game_id', gameId);

      // Clear all moves for this game
      await supabase
        .from('moves')
        .delete()
        .eq('game_id', gameId);

      // Reset game session runtime state
      await supabase
        .from('game_sessions')
        .update({
          game_state: {},
          current_round: 1,
          current_phase: 'fortify',
          round_start_time: null,
          round_end: null,
          quantum_state: {}
        })
        .eq('game_id', gameId);

      console.log('Runtime variables reset successfully');
    } catch (error) {
      console.error('Error resetting runtime variables:', error);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-8 h-8 text-yellow-400" />;
      case 2:
        return <Medal className="w-8 h-8 text-gray-400" />;
      case 3:
        return <Award className="w-8 h-8 text-amber-600" />;
      default:
        return <Star className="w-8 h-8 text-blue-400" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 via-yellow-500 to-yellow-600';
      case 2:
        return 'from-gray-300 via-gray-400 to-gray-500';
      case 3:
        return 'from-amber-500 via-amber-600 to-amber-700';
      default:
        return 'from-blue-400 via-blue-500 to-blue-600';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mb-4"></div>
          <p className="text-blue-200 text-xl">Calculating final scores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="quantum-bg min-h-screen p-8 relative overflow-hidden">
      {/* Quantum Particles */}
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full animate-particle opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${15 + Math.random() * 10}s`
          }}
        />
      ))}

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <Trophy className="h-16 w-16 text-yellow-400 animate-glow" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              Game Complete!
            </h1>
            <Trophy className="h-16 w-16 text-yellow-400 animate-glow" />
          </div>
          <p className="text-2xl text-blue-200">
            Round {currentRound - 1} • Final Results
          </p>
        </motion.div>

        {/* Winner Spotlight */}
        {winner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mb-12"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-3xl blur opacity-75"></div>
              <div className="relative bg-black/80 backdrop-blur-xl rounded-3xl p-8 border border-yellow-400/30">
                <div className="text-center">
                  <Crown className="h-20 w-20 text-yellow-400 mx-auto mb-4 animate-glow" />
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2">
                    Victory Achieved!
                  </h2>
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-yellow-400"
                      style={{ backgroundColor: winner.color }}
                    />
                    <span className="text-3xl font-bold text-white">{winner.name}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
                    <div className="text-center">
                      <Target className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-yellow-400">{winner.planets}</p>
                      <p className="text-yellow-200">Planets</p>
                    </div>
                    <div className="text-center">
                      <Users className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-yellow-400">{winner.troops}</p>
                      <p className="text-yellow-200">Troops</p>
                    </div>
                    <div className="text-center">
                      <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-yellow-400">{winner.totalScore}</p>
                      <p className="text-yellow-200">Score</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Rankings */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-12"
        >
          <h3 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Final Rankings
          </h3>
          
          <div className="space-y-4">
            {playerScores.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="relative group"
              >
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${getRankColor(player.rank)} rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-1000`}></div>
                <div className="relative bg-black/70 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                        {getRankIcon(player.rank)}
                        <span className="text-3xl font-bold text-white">#{player.rank}</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-white/20"
                          style={{ backgroundColor: player.color }}
                        />
                        <span className="text-xl font-semibold text-white">{player.name}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <Target className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                        <p className="text-lg font-bold text-white">{player.planets}</p>
                        <p className="text-xs text-blue-200">Planets</p>
                      </div>
                      
                      <div className="text-center">
                        <Users className="w-5 h-5 text-green-400 mx-auto mb-1" />
                        <p className="text-lg font-bold text-white">{player.troops}</p>
                        <p className="text-xs text-green-200">Troops</p>
                      </div>
                      
                      <div className="text-center">
                        <Star className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                        <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                          {player.totalScore}
                        </p>
                        <p className="text-xs text-purple-200">Total Score</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Scoring Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mb-12"
        >
          <div className="bg-black/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h4 className="text-xl font-bold text-blue-400 mb-4 text-center">Scoring System</h4>
            <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
              <div className="text-center">
                <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-lg font-bold text-white">10 Points</p>
                <p className="text-blue-200">per Planet</p>
              </div>
              <div className="text-center">
                <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-lg font-bold text-white">1 Point</p>
                <p className="text-green-200">per Troop</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Back to Home Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="text-center"
        >
          <button
            onClick={handleBackToHome}
            className="group relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-1000"></div>
            <div className="relative px-12 py-4 bg-black/70 backdrop-blur-xl rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center gap-3">
              <Home className="w-6 h-6" />
              <span className="text-xl font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Return to Home
              </span>
            </div>
          </button>
        </motion.div>
      </div>
    </div>
  );
}