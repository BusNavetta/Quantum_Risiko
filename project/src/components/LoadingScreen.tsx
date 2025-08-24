import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store';
import { Toast } from './Toast';
import { AlertCircle } from 'lucide-react';

export function LoadingScreen() {
  const progress = useGameStore((state) => state.loadingProgress);
  const error = useGameStore((state) => state.error);
  const setError = useGameStore((state) => state.setError);
  const debug = useGameStore((state) => state.debug);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showDebug, setShowDebug] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 0.1);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const loadingMessages = [
    'Generating quantum fields...',
    'Calculating orbital trajectories...',
    'Establishing planetary connections...',
    'Initializing player territories...',
    'Stabilizing quantum entanglements...',
    'Synchronizing player maps...',
    'Waiting for all players to load...'
  ];

  const currentMessage = loadingMessages[Math.floor((progress / 100) * loadingMessages.length)];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/90 text-white flex items-center justify-center z-50"
    >
      <div className="text-center max-w-2xl w-full px-4">
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Initializing Galaxy
        </h2>
        
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 50, damping: 10 }}
          />
        </div>
        
        <motion.p
          key={currentMessage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg text-cyan-300 mb-2"
        >
          {currentMessage}
        </motion.p>
        
        <div className="flex items-center justify-center gap-4 text-white/60 mb-4">
          <p>Progress: {Math.round(progress)}%</p>
          <span>|</span>
          <p>Time Elapsed: {timeElapsed.toFixed(1)}s</p>
        </div>

        {/* Show debug info with map loading status */}
        <div className="mt-4 p-4 bg-black/50 border border-white/10 rounded-lg text-left">
          <h4 className="text-sm font-medium text-blue-400 mb-2">Debug Log:</h4>
          <div className="max-h-40 overflow-y-auto text-xs space-y-1">
            {debug.map((msg, i) => (
              <p key={i} className="text-blue-200 font-mono">{msg}</p>
            ))}
            {debug.length === 0 && (
              <p className="text-blue-200/50 italic">No debug messages yet...</p>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-950/50 border border-red-500/50 rounded-lg">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-semibold">Initialization Error</h3>
            </div>
            <p className="text-red-200 mt-2">{error}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}