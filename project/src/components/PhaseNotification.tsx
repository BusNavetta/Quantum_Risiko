import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store';

export default function PhaseNotification() {
  const showNotification = useGameStore(state => state.showPhaseNotification);
  const notificationText = useGameStore(state => state.phaseNotificationText);
  const hideNotification = useGameStore(state => state.hidePhaseNotification);
  const currentRound = useGameStore(state => state.currentRound);
  const currentPhase = useGameStore(state => state.currentPhase);

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        hideNotification();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [showNotification, hideNotification]);

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <div className="bg-black/80 backdrop-blur-sm px-8 py-4 rounded-lg border border-white/10">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {notificationText}
            </h2>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}