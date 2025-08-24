// Create custom hook for game state management
import { create } from 'zustand';
import { GameState } from '../types';

export const useGameState = create<GameState>((set) => ({
  // ... existing store logic
}));