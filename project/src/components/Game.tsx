import React, { useEffect, Suspense, useCallback, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useGameStore } from '../store';
import GalaxyBackground from './GalaxyBackground';
import { Planet } from './Planet';
import PlanetConnections from './PlanetConnections';
import { LoadingScreen } from './LoadingScreen';
import PlayerPlanets from './PlayerPlanets';
import GameHeader from './GameHeader';
import PhaseNotification from './PhaseNotification';
import TroopPlacementModal from './TroopPlacementModal';
import AttackPhase from './AttackPhase';
import MovementPhase from './MovementPhase';
import { TroopMovement } from './TroopMovement';
import { useParams, useNavigate } from 'react-router-dom';
import { Vector3 } from 'three';
import MovesTimeline from './MovesTimeline';
import GameResults from './GameResults';
import { ArrowRightCircle } from 'lucide-react';

declare global {
  interface Window {
    gameCamera: THREE.Camera;
  }
}

const MemoizedPlanet = React.memo(Planet);

interface TroopAnimation {
  id: string;
  from: Vector3;
  to: Vector3;
  troops: number;
  color: string;
}

export default function Game() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [hasNavigated, setHasNavigated] = useState(false);
  const progress = useGameStore(state => state.loadingProgress);
  const planets = useGameStore(state => state.planets);
  const players = useGameStore(state => state.players);
  const currentPlayerIndex = useGameStore(state => state.currentPlayerIndex);
  const endTurn = useGameStore(state => state.endTurn);
  const setLoadingProgress = useGameStore(state => state.setLoadingProgress);
  const initializeGame = useGameStore(state => state.initializeGame);
  const currentPhase = useGameStore(state => state.currentPhase);
  const currentRound = useGameStore(state => state.currentRound);
  const setCurrentPhase = useGameStore(state => state.setCurrentPhase);
  const showPhaseNotification = useGameStore(state => state.showPhaseNotification);
  const selectedPlanet = useGameStore(state => state.selectedPlanet);
  const setSelectedPlanet = useGameStore(state => state.setSelectedPlanet);
  const movementSourcePlanet = useGameStore(state => state.movementSourcePlanet);
  const troopsToPlace = useGameStore(state => state.troopsToPlace);
  const confirmTroopPlacements = useGameStore(state => state.confirmTroopPlacements);
  const [animations, setAnimations] = useState<TroopAnimation[]>([]);

  const username = localStorage.getItem('username') || '';
  const currentPlayer = players.find(p => p.name === username);
  const isCurrentPlayer = !!currentPlayer;


  useEffect(() => {
    const loadGame = async () => {
      if (gameId) {
        localStorage.setItem('gameId', gameId);
      }
      initializeGame();
      
      const startTime = Date.now();
      const duration = 3000;
      
      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / duration) * 100, 100);
        setLoadingProgress(progress);
        
        if (progress < 100) {
          requestAnimationFrame(updateProgress);
        }
      };
      
      requestAnimationFrame(updateProgress);
    };

    loadGame();
  }, [setLoadingProgress, initializeGame, gameId]);

  useEffect(() => {
    const unsubscribe = useGameStore.subscribe(
      (state) => state.pendingActions,
      (actions) => {
        actions.forEach(action => {
          if (action.type === 'movement' || action.type === 'attack') {
            const fromPlanet = planets.find(p => p.id === action.from);
            const toPlanet = planets.find(p => p.id === action.to);
            const player = players.find(p => p.id === fromPlanet?.owners[0]);
            
            if (fromPlanet && toPlanet && player) {
              setAnimations(prev => [...prev, {
                id: `${action.from}-${action.to}-${Date.now()}`,
                from: new Vector3(...fromPlanet.position),
                to: new Vector3(...toPlanet.position),
                troops: action.troops,
                color: player.color
              }]);
            }
          }
        });
      }
    );

    return () => unsubscribe();
  }, [planets, players]);

  if (progress < 100) {
    return <LoadingScreen />;
  }

  const handleEndPhase = () => {
    endTurn();
  };

  const canEndPhase = isCurrentPlayer && 
    !(currentPhase === 'fortify' && troopsToPlace > 0);

  const handlePlanetSelect = (planetId: string | null) => {
    if (currentPhase === 'movement' && movementSourcePlanet) {
      return;
    }
    setSelectedPlanet(planetId);
  };

  const handleAnimationComplete = (id: string) => {
    setAnimations(prev => prev.filter(a => a.id !== id));
  };

  // If game is complete, show results page
  if (currentPhase === 'game_complete') {
    return <GameResults />;
  }

  return (
    <div className="w-full h-screen relative bg-black overflow-hidden">
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <Canvas
          camera={{ position: [150, 75, 150], fov: 60 }}
          style={{ background: '#000000' }}
          performance={{ min: 0.5 }}
          dpr={[1, 2]}
          onCreated={({ camera }) => {
            window.gameCamera = camera;
          }}
        >
          <ambientLight intensity={0.8} />
          <pointLight position={[0, 0, 0]} intensity={3} />
          
          <Suspense fallback={null}>
            <GalaxyBackground />
            <PlanetConnections planets={planets} maxDistance={75} />
            {planets.map((planet) => (
              <MemoizedPlanet 
                key={planet.id} 
                planet={planet} 
                onSelect={handlePlanetSelect}
              />
            ))}
            <OrbitControls 
              enablePan={true}
              minDistance={50}
              maxDistance={300}
              maxPolarAngle={Math.PI * 0.7}
              enableDamping={true}
              dampingFactor={0.05}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Moves Timeline */}
      <div className="absolute left-4 top-20 bottom-20 w-80 bg-black/70 backdrop-blur-sm rounded-lg border border-white/10 overflow-y-auto" style={{ zIndex: 1 }}>
        <MovesTimeline />
      </div>

      {/* Troop movement animations */}
      {animations.map((animation) => (
        <TroopMovement
          key={animation.id}
          from={animation.from}
          to={animation.to}
          troops={animation.troops}
          color={animation.color}
          onComplete={() => handleAnimationComplete(animation.id)}
        />
      ))}

      <div className="relative" style={{ zIndex: 1 }}>
        <GameHeader />
        <div className="mt-16">
          <PlayerPlanets />
        </div>
      </div>

      {/* Game ID */}
      <div className="absolute top-20 right-4 space-y-2" style={{ zIndex: 2 }}>
        <div className="bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
          <span className="text-blue-400">Game ID: </span>
          <span className="text-white font-mono">{gameId}</span>
        </div>
      </div>

      <PhaseNotification />

      {isCurrentPlayer && currentPhase !== 'applying_moves' && (
        <>
          {currentPhase === 'attack' && <AttackPhase />}
          {currentPhase === 'movement' && <MovementPhase />}
        </>
      )}

      {selectedPlanet && currentPhase === 'fortify' && (
        <TroopPlacementModal
          planetId={selectedPlanet}
          onClose={() => setSelectedPlanet(null)}
        />
      )}

      {currentPhase !== 'applying_moves' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm p-4 rounded-lg border border-white/10 flex items-center gap-4" style={{ zIndex: 1 }}>
          <p className="text-blue-200">
            <span className="font-semibold">Current Phase:</span> {currentPhase}
          </p>
          <button 
            onClick={handleEndPhase}
            disabled={!canEndPhase}
            className="px-6 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            End Phase
            <ArrowRightCircle className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}