import React, { useState } from 'react';
import { Play, BookOpen, GraduationCap, ChevronRight, Atom, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HomeProps {
  username: string;
}

function Home({ username }: HomeProps) {
  const navigate = useNavigate();
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinLink, setJoinLink] = useState('');
  
  const sections = [
    {
      title: 'Play',
      icon: Play,
      description: 'Start a new game or join an existing session',
      path: '/play',
      gradient: 'from-blue-500 via-purple-500 to-pink-500'
    },
    {
      title: 'Keep Calm and Quantum',
      icon: GraduationCap,
      description: 'Learn the quantum mechanics behind QAJR',
      path: '/quantum',
      gradient: 'from-purple-500 via-pink-500 to-red-500'
    },
    {
      title: 'Tutorial',
      icon: BookOpen,
      description: 'Master the rules and strategies of QAJR',
      path: '/tutorial',
      gradient: 'from-pink-500 via-red-500 to-orange-500'
    }
  ];

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinLink) {
      try {
        const url = new URL(joinLink);
        const gameId = url.searchParams.get('game');
        if (gameId) {
          navigate(`/play?game=${gameId}`);
        }
      } catch (error) {
        // Handle invalid URL format
        const gameId = joinLink.trim();
        if (gameId) {
          navigate(`/play?game=${gameId}`);
        }
      }
    }
  };

  return (
    <div className="quantum-bg min-h-screen p-8 relative overflow-hidden">
      {[...Array(30)].map((_, i) => (
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

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-12">
          <div className="flex items-center gap-4">
            <Atom className="h-12 w-12 text-blue-400 animate-glow" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Welcome, {username}!
            </h1>
          </div>
          <p className="text-xl text-blue-200 mt-4 ml-16">Your quantum adventure awaits...</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {sections.map((section) => (
            <div
              key={section.title}
              onClick={() => navigate(section.path)}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-1000"></div>
              <div className="relative bg-black/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer">
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${section.gradient}`}>
                  <section.icon className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold mt-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {section.title}
                </h2>
                <p className="text-blue-200 mt-2">{section.description}</p>
                <div className="mt-4 flex items-center text-sm text-blue-400 group-hover:text-blue-300">
                  Explore <ChevronRight className="ml-1 w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button 
            onClick={() => setShowJoinModal(true)}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-1000"></div>
            <div className="relative px-8 py-3 bg-black/50 backdrop-blur-xl rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300">
              <span className="text-lg font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Quick Match
              </span>
            </div>
          </button>
        </div>
      </div>

      {showJoinModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowJoinModal(false)} />
          <div className="relative bg-black/80 p-8 rounded-2xl border border-white/10 max-w-md w-full mx-4">
            <button
              onClick={() => setShowJoinModal(false)}
              className="absolute top-4 right-4 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
              Join Existing Game
            </h2>
            
            <form onSubmit={handleJoinGame}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="gameLink" className="block text-blue-300 mb-2">
                    Enter Game Link or ID
                  </label>
                  <input
                    id="gameLink"
                    type="text"
                    value={joinLink}
                    onChange={(e) => setJoinLink(e.target.value)}
                    placeholder="Paste the game link or ID here"
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-blue-200 placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-medium
                    hover:opacity-90 transition-all duration-300"
                >
                  Join Game
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;