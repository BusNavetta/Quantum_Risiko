import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Shield, Swords, ArrowUpRight, Atom, Target, Users, Crown, Zap, Eye, RotateCcw, Play, BookOpen, GraduationCap, Sparkles, Globe, Layers, Clock, TrendingUp, Award, Star, Gamepad2, Brain, Cpu, Orbit, Waves, Hexagon, Triangle, Circle, Square } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface TutorialStep {
  id: number;
  title: string;
  content: React.ReactNode;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
}

function Tutorial() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps: TutorialStep[] = [
    {
      id: 1,
      title: "Welcome to QAJR",
      icon: <Atom className="w-8 h-8" />,
      color: "text-blue-400",
      bgGradient: "from-blue-500/20 via-purple-500/20 to-pink-500/20",
      content: (
        <div className="space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6 rounded-full">
                  <Atom className="h-16 w-16 text-white animate-spin" style={{ animationDuration: '8s' }} />
                </div>
              </div>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
              Quantum Assault: Jericho's Revenge
            </h2>
            <p className="text-xl text-blue-200 mb-8">
              Where quantum mechanics meet galactic conquest in an epic multiplayer strategy experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Globe className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-blue-400">Epic Scale</h3>
              </div>
              <p className="text-blue-200">
                Command fleets across a vast 3D galaxy with 60 unique planets, each with strategic importance and quantum properties.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Brain className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-purple-400">Quantum Strategy</h3>
              </div>
              <p className="text-blue-200">
                Master quantum interference patterns, entanglement effects, and probability-based combat systems.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-xl p-6 border border-green-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Users className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-green-400">Multiplayer Mayhem</h3>
              </div>
              <p className="text-blue-200">
                Battle 2-6 players in real-time with simultaneous turn execution and dynamic alliance possibilities.
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-6 border border-yellow-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Crown className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold text-yellow-400">Victory Conditions</h3>
              </div>
              <p className="text-blue-200">
                Achieve dominance through territorial control and strategic troop deployment over 10 intense rounds.
              </p>
            </div>
          </div>

          <div className="bg-black/30 rounded-xl p-6 border border-white/10">
            <h3 className="text-2xl font-semibold text-white mb-4 text-center">Core Game Features</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-yellow-400 font-medium">Quantum Combat</p>
                <p className="text-blue-200 text-sm">Physics-based battle resolution</p>
              </div>
              <div className="text-center">
                <Orbit className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-purple-400 font-medium">3D Galaxy</p>
                <p className="text-blue-200 text-sm">Immersive spatial gameplay</p>
              </div>
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-green-400 font-medium">Strategic Depth</p>
                <p className="text-blue-200 text-sm">Multiple paths to victory</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Game Setup & Lobby",
      icon: <Users className="w-8 h-8" />,
      color: "text-purple-400",
      bgGradient: "from-purple-500/20 via-pink-500/20 to-red-500/20",
      content: (
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-purple-400 mb-4">Creating Your Quantum Empire</h3>
            <p className="text-xl text-blue-200">
              Set up your game session and prepare for galactic conquest
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
              <h4 className="text-2xl font-semibold text-purple-400 mb-6">Step-by-Step Setup</h4>
              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: "Create New Game",
                    description: "Click 'Play' from the home screen to generate a unique game session",
                    icon: <Play className="w-6 h-6" />,
                    color: "blue"
                  },
                  {
                    step: 2,
                    title: "Choose Your Identity",
                    description: "Select from 6 quantum-themed colors that represent your faction",
                    icon: <Sparkles className="w-6 h-6" />,
                    color: "purple"
                  },
                  {
                    step: 3,
                    title: "Invite Allies & Enemies",
                    description: "Share the game link with 1-5 friends for epic multiplayer battles",
                    icon: <Users className="w-6 h-6" />,
                    color: "pink"
                  },
                  {
                    step: 4,
                    title: "Ready for War",
                    description: "All players must mark themselves ready before the host can begin",
                    icon: <Crown className="w-6 h-6" />,
                    color: "yellow"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className={`w-12 h-12 bg-${item.color}-500/20 rounded-full flex items-center justify-center flex-shrink-0 border border-${item.color}-500/30`}>
                      <span className={`text-${item.color}-400 font-bold text-lg`}>{item.step}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`text-${item.color}-400`}>
                          {item.icon}
                        </div>
                        <h5 className={`text-lg font-semibold text-${item.color}-400`}>{item.title}</h5>
                      </div>
                      <p className="text-blue-200">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-xl p-6 border border-green-500/20">
                <h4 className="text-xl font-semibold text-green-400 mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6" />
                  Initial Deployment
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">Starting Planets</span>
                    <span className="text-green-400 font-bold">10 per player</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">Initial Troops</span>
                    <span className="text-green-400 font-bold">2 per planet</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">Bonus Troops</span>
                    <span className="text-green-400 font-bold">5 (Round 1)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">Galaxy Size</span>
                    <span className="text-green-400 font-bold">60 planets</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-6 border border-orange-500/20">
                <h4 className="text-xl font-semibold text-orange-400 mb-4 flex items-center gap-2">
                  <Gamepad2 className="w-6 h-6" />
                  Player Colors
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "Quantum Blue", color: "bg-blue-500" },
                    { name: "Entangled Purple", color: "bg-purple-500" },
                    { name: "Superposition Pink", color: "bg-pink-500" },
                    { name: "Wave Green", color: "bg-emerald-500" },
                    { name: "Probability Orange", color: "bg-orange-500" },
                    { name: "Particle Yellow", color: "bg-yellow-500" }
                  ].map((colorOption) => (
                    <div key={colorOption.name} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${colorOption.color}`} />
                      <span className="text-blue-200 text-sm">{colorOption.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Game Phases & Flow",
      icon: <RotateCcw className="w-8 h-8" />,
      color: "text-green-400",
      bgGradient: "from-green-500/20 via-blue-500/20 to-purple-500/20",
      content: (
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-green-400 mb-4">The Rhythm of War</h3>
            <p className="text-xl text-blue-200">
              Master the three-phase cycle that drives each round of galactic conquest
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl p-6 border border-green-500/20 mb-8">
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-2">
                  <Shield className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-blue-400 font-semibold">Fortify</p>
              </div>
              <ArrowRight className="w-6 h-6 text-green-400" />
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-2">
                  <Swords className="w-8 h-8 text-red-400" />
                </div>
                <p className="text-red-400 font-semibold">Attack</p>
              </div>
              <ArrowRight className="w-6 h-6 text-green-400" />
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-2">
                  <ArrowUpRight className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-green-400 font-semibold">Movement</p>
              </div>
            </div>
            <p className="text-center text-blue-200">
              Each round consists of these three sequential phases executed by all players
            </p>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-6 border border-blue-500/30"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Shield className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-2xl font-semibold text-blue-400">Phase 1: Fortify</h4>
                  <p className="text-blue-200">Strengthen your defenses and expand your forces</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h5 className="text-lg font-semibold text-blue-300">Core Mechanics</h5>
                  <ul className="space-y-2 text-blue-200">
                    <li className="flex items-start gap-2">
                      <Circle className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                      <span>Place troops on planets you control</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Circle className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                      <span>First round: 5 bonus troops to deploy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Circle className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                      <span>Later rounds: 3 minimum, or 1 per planet owned</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Circle className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                      <span>Maximum 8 troops per planet</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h5 className="text-lg font-semibold text-blue-300">Strategic Tips</h5>
                  <ul className="space-y-2 text-blue-200">
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                      <span>Fortify border planets facing enemies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                      <span>Build staging areas for future attacks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                      <span>Consider defensive clustering</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                      <span>Plan for quantum interference effects</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-xl p-6 border border-red-500/30"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-red-500/20 rounded-lg">
                  <Swords className="w-8 h-8 text-red-400" />
                </div>
                <div>
                  <h4 className="text-2xl font-semibold text-red-400">Phase 2: Attack</h4>
                  <p className="text-blue-200">Launch quantum-powered assaults on enemy territories</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h5 className="text-lg font-semibold text-red-300">Combat Rules</h5>
                  <ul className="space-y-2 text-blue-200">
                    <li className="flex items-start gap-2">
                      <Triangle className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                      <span>Attack planets within 75 units range</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Triangle className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                      <span>Must leave at least 1 troop on attacking planet</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Triangle className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                      <span>Quantum mechanics determine outcomes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Triangle className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                      <span>Successful attacks capture planets</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h5 className="text-lg font-semibold text-red-300">Quantum Effects</h5>
                  <div className="space-y-3">
                    <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                      <p className="text-green-400 font-medium mb-1">Constructive Interference</p>
                      <p className="text-blue-200 text-sm">Favors attacker - defender loses 30% troops</p>
                    </div>
                    <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                      <p className="text-red-400 font-medium mb-1">Destructive Interference</p>
                      <p className="text-blue-200 text-sm">Favors defender - gains 30% more troops</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-6 border border-green-500/30"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <ArrowUpRight className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <h4 className="text-2xl font-semibold text-green-400">Phase 3: Movement</h4>
                  <p className="text-blue-200">Reposition forces for strategic advantage</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h5 className="text-lg font-semibold text-green-300">Movement Rules</h5>
                  <ul className="space-y-2 text-blue-200">
                    <li className="flex items-start gap-2">
                      <Square className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <span>Move troops between your own planets</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Square className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <span>Only between connected planets (75 units)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Square className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <span>Must leave at least 1 troop on source</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Square className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <span>Perfect for reinforcing key positions</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h5 className="text-lg font-semibold text-green-300">Tactical Applications</h5>
                  <ul className="space-y-2 text-blue-200">
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                      <span>Consolidate forces for major offensives</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                      <span>Reinforce vulnerable border planets</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                      <span>Create strategic reserves</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                      <span>Prepare for next round's attacks</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Quantum Combat System",
      icon: <Zap className="w-8 h-8" />,
      color: "text-yellow-400",
      bgGradient: "from-yellow-500/20 via-orange-500/20 to-red-500/20",
      content: (
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-yellow-400 mb-4">The Science of War</h3>
            <p className="text-xl text-blue-200">
              Harness quantum mechanics to determine the fate of battles across the galaxy
            </p>
          </div>

          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-6 border border-yellow-500/20 mb-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-3 bg-black/30 rounded-full px-6 py-3">
                <Cpu className="w-6 h-6 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">Quantum Battle Engine</span>
              </div>
            </div>
            <p className="text-center text-blue-200 text-lg">
              Every battle is resolved using real quantum mechanical principles, making each conflict unique and scientifically grounded
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-6 border border-purple-500/20">
              <h4 className="text-2xl font-semibold text-purple-400 mb-6 flex items-center gap-3">
                <Brain className="w-8 h-8" />
                Quantum Battle Process
              </h4>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  {
                    step: 1,
                    title: "State Conversion",
                    description: "Troop counts converted to quantum states using game seed",
                    icon: <Waves className="w-6 h-6" />,
                    color: "blue"
                  },
                  {
                    step: 2,
                    title: "Quantum Transform",
                    description: "States processed through Quantum Fourier Transform",
                    icon: <Cpu className="w-6 h-6" />,
                    color: "purple"
                  },
                  {
                    step: 3,
                    title: "Interference",
                    description: "Quantum interference patterns calculated",
                    icon: <Orbit className="w-6 h-6" />,
                    color: "pink"
                  },
                  {
                    step: 4,
                    title: "Resolution",
                    description: "Battle outcome determined by interference type",
                    icon: <Zap className="w-6 h-6" />,
                    color: "yellow"
                  }
                ].map((step, index) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-${step.color}-500/10 rounded-lg p-4 border border-${step.color}-500/20 text-center`}
                  >
                    <div className={`w-12 h-12 bg-${step.color}-500/20 rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <div className={`text-${step.color}-400`}>
                        {step.icon}
                      </div>
                    </div>
                    <h5 className={`font-semibold text-${step.color}-400 mb-2`}>{step.title}</h5>
                    <p className="text-blue-200 text-sm">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-green-400">Constructive Interference</h4>
                </div>
                <div className="space-y-3">
                  <p className="text-green-300 font-medium">Favors the Attacker</p>
                  <ul className="space-y-2 text-blue-200">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Defender loses 30% of troops</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Attacker loses 20% of attacking force</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Can result in planet capture</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Quantum amplification effect</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-xl p-6 border border-red-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <Shield className="w-6 h-6 text-red-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-red-400">Destructive Interference</h4>
                </div>
                <div className="space-y-3">
                  <p className="text-red-300 font-medium">Favors the Defender</p>
                  <ul className="space-y-2 text-blue-200">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span>Defender gains 30% more troops</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span>Attacker loses all attacking troops</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span>Planet remains under defender control</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span>Quantum reinforcement effect</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-6 border border-indigo-500/20">
              <h4 className="text-xl font-semibold text-indigo-400 mb-4 flex items-center gap-3">
                <BookOpen className="w-6 h-6" />
                Quantum Battle Reports
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h5 className="font-semibold text-indigo-300">Visual Analysis</h5>
                  <ul className="text-blue-200 text-sm space-y-1">
                    <li>• Quantum state evolution charts</li>
                    <li>• Interference pattern graphs</li>
                    <li>• Troop change visualizations</li>
                    <li>• Real-time battle animations</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="font-semibold text-indigo-300">Scientific Data</h5>
                  <ul className="text-blue-200 text-sm space-y-1">
                    <li>• Initial quantum states</li>
                    <li>• QFT transformation results</li>
                    <li>• Interference calculations</li>
                    <li>• Final state measurements</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="font-semibold text-indigo-300">Battle Summary</h5>
                  <ul className="text-blue-200 text-sm space-y-1">
                    <li>• Outcome explanation</li>
                    <li>• Troop casualties</li>
                    <li>• Territory changes</li>
                    <li>• Strategic implications</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-black/30 rounded-xl p-6 border border-white/10">
              <h4 className="text-xl font-semibold text-white mb-4 text-center">Advanced Quantum Effects</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h5 className="font-semibold text-purple-400">Entanglement Mechanics</h5>
                  <p className="text-blue-200 text-sm">
                    Some planets become quantum entangled, creating mysterious connections that affect 
                    battle outcomes across vast distances. When entangled planets are attacked, 
                    their quantum partners experience resonance effects.
                  </p>
                </div>
                <div className="space-y-3">
                  <h5 className="font-semibold text-cyan-400">Superposition States</h5>
                  <p className="text-blue-200 text-sm">
                    Planets can exist in quantum superposition, where their true state remains 
                    uncertain until observed through combat. This creates strategic uncertainty 
                    and opportunities for quantum surprise attacks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Interface & Controls",
      icon: <Eye className="w-8 h-8" />,
      color: "text-cyan-400",
      bgGradient: "from-cyan-500/20 via-blue-500/20 to-indigo-500/20",
      content: (
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-cyan-400 mb-4">Command Center Mastery</h3>
            <p className="text-xl text-blue-200">
              Navigate the 3D galaxy and command your forces with precision and style
            </p>
          </div>

          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-6 border border-cyan-500/20 mb-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-3 bg-black/30 rounded-full px-6 py-3 mb-4">
                <Globe className="w-6 h-6 text-cyan-400" />
                <span className="text-cyan-400 font-semibold">Immersive 3D Galaxy</span>
              </div>
              <p className="text-blue-200 text-lg">
                Experience galactic warfare in a fully interactive 3D environment with intuitive controls and stunning visuals
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl p-6 border border-blue-500/20">
              <h4 className="text-2xl font-semibold text-blue-400 mb-6 flex items-center gap-3">
                <Globe className="w-8 h-8" />
                3D Galaxy Navigation
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h5 className="text-lg font-semibold text-blue-300">Camera Controls</h5>
                  <div className="space-y-3">
                    {[
                      { action: "Rotate View", control: "Mouse Drag / Touch Drag", icon: <Orbit className="w-5 h-5" /> },
                      { action: "Zoom In/Out", control: "Mouse Wheel / Pinch", icon: <Eye className="w-5 h-5" /> },
                      { action: "Pan Camera", control: "Right Click + Drag", icon: <ArrowUpRight className="w-5 h-5" /> },
                      { action: "Reset View", control: "Double Click Empty Space", icon: <RotateCcw className="w-5 h-5" /> }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3 bg-black/20 rounded-lg p-3">
                        <div className="text-blue-400">{item.icon}</div>
                        <div className="flex-1">
                          <p className="text-blue-200 font-medium">{item.action}</p>
                          <p className="text-blue-300 text-sm">{item.control}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h5 className="text-lg font-semibold text-blue-300">Visual Features</h5>
                  <ul className="space-y-2 text-blue-200">
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                      <span>Dynamic star field background with particle effects</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                      <span>Planet ownership indicated by color coding</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                      <span>Connection lines show attack/movement range</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                      <span>Hover effects and selection highlights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                      <span>Smooth animations and transitions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
              <h4 className="text-2xl font-semibold text-purple-400 mb-6 flex items-center gap-3">
                <Layers className="w-8 h-8" />
                Interface Layout
              </h4>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h5 className="text-lg font-semibold text-purple-300">Top Header</h5>
                  <div className="bg-black/20 rounded-lg p-4">
                    <ul className="space-y-2 text-blue-200 text-sm">
                      <li className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span>Round counter (1-10)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <RotateCcw className="w-4 h-4 text-green-400" />
                        <span>Current phase indicator</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-400" />
                        <span>Troops to place counter</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-400" />
                        <span>Player list with status</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <h5 className="text-lg font-semibold text-purple-300">Side Panels</h5>
                  <div className="bg-black/20 rounded-lg p-4">
                    <ul className="space-y-2 text-blue-200 text-sm">
                      <li className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-green-400" />
                        <span>Your planets list (right)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-orange-400" />
                        <span>Battle log (left)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Gamepad2 className="w-4 h-4 text-cyan-400" />
                        <span>Action controls (bottom)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-pink-400" />
                        <span>Game ID display</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <h5 className="text-lg font-semibold text-purple-300">Interactive Elements</h5>
                  <div className="bg-black/20 rounded-lg p-4">
                    <ul className="space-y-2 text-blue-200 text-sm">
                      <li className="flex items-center gap-2">
                        <Circle className="w-4 h-4 text-yellow-400" />
                        <span>Planet selection rings</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-red-400" />
                        <span>Connection line indicators</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span>Hover glow effects</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span>Action confirmation modals</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20">
                <h4 className="text-xl font-semibold text-green-400 mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6" />
                  Planet Interaction
                </h4>
                <div className="space-y-3">
                  <div className="bg-black/20 rounded-lg p-3">
                    <p className="text-green-300 font-medium mb-1">Selection</p>
                    <p className="text-blue-200 text-sm">Click any planet to select it for actions</p>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3">
                    <p className="text-green-300 font-medium mb-1">Information</p>
                    <p className="text-blue-200 text-sm">Planet name and troop count always visible</p>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3">
                    <p className="text-green-300 font-medium mb-1">Visual Feedback</p>
                    <p className="text-blue-200 text-sm">Hover effects and selection highlights</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-6 border border-orange-500/20">
                <h4 className="text-xl font-semibold text-orange-400 mb-4 flex items-center gap-2">
                  <Gamepad2 className="w-6 h-6" />
                  Action Controls
                </h4>
                <div className="space-y-3">
                  <div className="bg-black/20 rounded-lg p-3">
                    <p className="text-orange-300 font-medium mb-1">Context Sensitive</p>
                    <p className="text-blue-200 text-sm">Controls adapt to current phase and selection</p>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3">
                    <p className="text-orange-300 font-medium mb-1">Modal Dialogs</p>
                    <p className="text-blue-200 text-sm">Detailed action configuration windows</p>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3">
                    <p className="text-orange-300 font-medium mb-1">Confirmation</p>
                    <p className="text-blue-200 text-sm">Clear feedback for all player actions</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/30 rounded-xl p-6 border border-white/10">
              <h4 className="text-xl font-semibold text-white mb-4 text-center">Accessibility Features</h4>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Eye className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <p className="text-cyan-400 font-medium">Visual Clarity</p>
                  <p className="text-blue-200 text-sm">High contrast colors and clear typography</p>
                </div>
                <div className="text-center">
                  <Gamepad2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-green-400 font-medium">Intuitive Controls</p>
                  <p className="text-blue-200 text-sm">Consistent interaction patterns</p>
                </div>
                <div className="text-center">
                  <BookOpen className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-purple-400 font-medium">Clear Feedback</p>
                  <p className="text-blue-200 text-sm">Immediate visual and textual responses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Advanced Strategies",
      icon: <Target className="w-8 h-8" />,
      color: "text-orange-400",
      bgGradient: "from-orange-500/20 via-red-500/20 to-pink-500/20",
      content: (
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-orange-400 mb-4">The Art of Quantum War</h3>
            <p className="text-xl text-blue-200">
              Master advanced tactics and strategies to dominate the quantum battlefield
            </p>
          </div>

          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl p-6 border border-orange-500/20 mb-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-3 bg-black/30 rounded-full px-6 py-3 mb-4">
                <Brain className="w-6 h-6 text-orange-400" />
                <span className="text-orange-400 font-semibold">Strategic Mastery</span>
              </div>
              <p className="text-blue-200 text-lg">
                From early expansion to endgame dominance, learn the tactics that separate novices from quantum generals
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20">
              <h4 className="text-2xl font-semibold text-blue-400 mb-6 flex items-center gap-3">
                <Play className="w-8 h-8" />
                Early Game Mastery (Rounds 1-3)
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h5 className="text-lg font-semibold text-blue-300">Expansion Tactics</h5>
                  <div className="space-y-3">
                    {[
                      {
                        title: "Aggressive Expansion",
                        description: "Capture neutral planets while they're weakly defended",
                        icon: <Target className="w-5 h-5" />,
                        priority: "High"
                      },
                      {
                        title: "Border Fortification",
                        description: "Strengthen planets adjacent to enemy territories",
                        icon: <Shield className="w-5 h-5" />,
                        priority: "High"
                      },
                      {
                        title: "Cluster Control",
                        description: "Group your planets for easier mutual defense",
                        icon: <Hexagon className="w-5 h-5" />,
                        priority: "Medium"
                      },
                      {
                        title: "Range Scouting",
                        description: "Learn which planets can attack each other",
                        icon: <Eye className="w-5 h-5" />,
                        priority: "Medium"
                      }
                    ].map((tactic, index) => (
                      <div key={index} className="bg-black/20 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="text-blue-400 mt-1">{tactic.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-blue-300 font-medium">{tactic.title}</p>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                tactic.priority === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {tactic.priority}
                              </span>
                            </div>
                            <p className="text-blue-200 text-sm">{tactic.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h5 className="text-lg font-semibold text-blue-300">Resource Management</h5>
                  <div className="bg-black/20 rounded-lg p-4">
                    <h6 className="text-blue-300 font-medium mb-3">Troop Allocation Priority</h6>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-200">Border Defense</span>
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map(i => (
                            <div key={i} className="w-3 h-3 bg-red-400 rounded-full"></div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-200">Attack Staging</span>
                        <div className="flex gap-1">
                          {[1,2,3,4].map(i => (
                            <div key={i} className="w-3 h-3 bg-orange-400 rounded-full"></div>
                          ))}
                          <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-200">Interior Planets</span>
                        <div className="flex gap-1">
                          {[1,2].map(i => (
                            <div key={i} className="w-3 h-3 bg-green-400 rounded-full"></div>
                          ))}
                          {[1,2,3].map(i => (
                            <div key={i} className="w-3 h-3 bg-gray-600 rounded-full"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-4">
                    <h6 className="text-blue-300 font-medium mb-2">Early Game Goals</h6>
                    <ul className="text-blue-200 text-sm space-y-1">
                      <li>• Secure 15+ planets by round 3</li>
                      <li>• Establish 2-3 strong defensive clusters</li>
                      <li>• Identify weak opponents for targeting</li>
                      <li>• Build staging areas for mid-game attacks</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
              <h4 className="text-2xl font-semibold text-purple-400 mb-6 flex items-center gap-3">
                <Cpu className="w-8 h-8" />
                Mid Game Dominance (Rounds 4-7)
              </h4>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h5 className="text-lg font-semibold text-purple-300">Power Consolidation</h5>
                  <div className="space-y-3">
                    <div className="bg-black/20 rounded-lg p-3">
                      <p className="text-purple-300 font-medium mb-1">Force Concentration</p>
                      <p className="text-blue-200 text-sm">Focus troops on key strategic planets rather than spreading thin</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                      <p className="text-purple-300 font-medium mb-1">Chokepoint Control</p>
                      <p className="text-blue-200 text-sm">Defend planets that connect different regions of the galaxy</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                      <p className="text-purple-300 font-medium mb-1">Economic Warfare</p>
                      <p className="text-blue-200 text-sm">Target opponents' most valuable planets to cripple their economy</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h5 className="text-lg font-semibold text-purple-300">Alliance Dynamics</h5>
                  <div className="space-y-3">
                    <div className="bg-black/20 rounded-lg p-3">
                      <p className="text-purple-300 font-medium mb-1">Temporary Alliances</p>
                      <p className="text-blue-200 text-sm">Coordinate attacks with other players against strong opponents</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                      <p className="text-purple-300 font-medium mb-1">Diplomatic Pressure</p>
                      <p className="text-blue-200 text-sm">Use threats and negotiations to influence player behavior</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                      <p className="text-purple-300 font-medium mb-1">Betrayal Timing</p>
                      <p className="text-blue-200 text-sm">Know when to break alliances for maximum advantage</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h5 className="text-lg font-semibold text-purple-300">Target Selection</h5>
                  <div className="space-y-3">
                    <div className="bg-black/20 rounded-lg p-3">
                      <p className="text-purple-300 font-medium mb-1">Weak Player Elimination</p>
                      <p className="text-blue-200 text-sm">Focus on eliminating players with few planets first</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                      <p className="text-purple-300 font-medium mb-1">Leader Disruption</p>
                      <p className="text-blue-200 text-sm">Coordinate attacks against the current leader</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                      <p className="text-purple-300 font-medium mb-1">Opportunity Strikes</p>
                      <p className="text-blue-200 text-sm">Exploit weakened positions after major battles</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-xl p-6 border border-red-500/20">
              <h4 className="text-2xl font-semibold text-red-400 mb-6 flex items-center gap-3">
                <Crown className="w-8 h-8" />
                Endgame Victory (Rounds 8-10)
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h5 className="text-lg font-semibold text-red-300">Final Push Strategies</h5>
                  <div className="space-y-3">
                    <div className="bg-black/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Swords className="w-5 h-5 text-red-400" />
                        <p className="text-red-300 font-medium">Mass Coordinated Attacks</p>
                      </div>
                      <p className="text-blue-200 text-sm">Launch multiple simultaneous attacks on strong players to overwhelm their defenses</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-red-400" />
                        <p className="text-red-300 font-medium">Defensive Positioning</p>
                      </div>
                      <p className="text-blue-200 text-sm">Protect your largest planets while maintaining offensive capabilities</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-red-400" />
                        <p className="text-red-300 font-medium">Denial Tactics</p>
                      </div>
                      <p className="text-blue-200 text-sm">Prevent opponents from expanding even if you can't capture planets yourself</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h5 className="text-lg font-semibold text-red-300">Score Optimization</h5>
                  <div className="bg-black/20 rounded-lg p-4 mb-4">
                    <h6 className="text-red-300 font-medium mb-3">Victory Calculation</h6>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-200">Planets Controlled</span>
                        <span className="text-green-400 font-bold">10 points each</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-200">Total Troops</span>
                        <span className="text-green-400 font-bold">1 point each</span>
                      </div>
                      <div className="border-t border-white/10 pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-blue-200 font-medium">Example Score</span>
                          <span className="text-yellow-400 font-bold">15×10 + 45 = 195</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-4">
                    <h6 className="text-red-300 font-medium mb-2">Final Round Priorities</h6>
                    <ul className="text-blue-200 text-sm space-y-1">
                      <li>• Planets are generally more valuable than troops</li>
                      <li>• Maximize troops on planets you control</li>
                      <li>• Consider risk vs. reward for final attacks</li>
                      <li>• Defend against last-minute captures</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-6 border border-yellow-500/20">
              <h4 className="text-2xl font-semibold text-yellow-400 mb-6 flex items-center gap-3">
                <Zap className="w-8 h-8" />
                Quantum Combat Mastery
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h5 className="text-lg font-semibold text-yellow-300">Understanding Probability</h5>
                  <div className="space-y-3">
                    <div className="bg-black/20 rounded-lg p-3">
                      <p className="text-yellow-300 font-medium mb-1">Deterministic Chaos</p>
                      <p className="text-blue-200 text-sm">Quantum outcomes are deterministic but complex - learn the patterns</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                      <p className="text-yellow-300 font-medium mb-1">Multiple Small Attacks</p>
                      <p className="text-blue-200 text-sm">Several small attacks can be more effective than one large assault</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                      <p className="text-yellow-300 font-medium mb-1">Troop Efficiency</p>
                      <p className="text-blue-200 text-sm">Keep planets at 8 troops maximum for optimal resource usage</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h5 className="text-lg font-semibold text-yellow-300">Advanced Tactics</h5>
                  <div className="space-y-3">
                    <div className="bg-black/20 rounded-lg p-3">
                      <p className="text-yellow-300 font-medium mb-1">Risk Assessment</p>
                      <p className="text-blue-200 text-sm">Always consider both best and worst case battle scenarios</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                      <p className="text-yellow-300 font-medium mb-1">Quantum Entanglement</p>
                      <p className="text-blue-200 text-sm">Exploit entangled planet effects for strategic advantages</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                      <p className="text-yellow-300 font-medium mb-1">Battle Report Analysis</p>
                      <p className="text-blue-200 text-sm">Study quantum battle reports to understand interference patterns</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/30 rounded-xl p-6 border border-white/10">
              <h4 className="text-xl font-semibold text-white mb-4 text-center">Master-Level Insights</h4>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-purple-400 font-medium">Psychological Warfare</p>
                  <p className="text-blue-200 text-sm">Use unpredictable moves to confuse opponents</p>
                </div>
                <div className="text-center">
                  <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-blue-400 font-medium">Timing Mastery</p>
                  <p className="text-blue-200 text-sm">Know when to be aggressive vs. defensive</p>
                </div>
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-green-400 font-medium">Adaptive Strategy</p>
                  <p className="text-blue-200 text-sm">Adjust tactics based on opponent behavior</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: "Victory & Scoring",
      icon: <Crown className="w-8 h-8" />,
      color: "text-yellow-400",
      bgGradient: "from-yellow-500/20 via-orange-500/20 to-red-500/20",
      content: (
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-yellow-400 mb-4">Path to Galactic Supremacy</h3>
            <p className="text-xl text-blue-200">
              Understand the scoring system and victory conditions to claim your quantum crown
            </p>
          </div>

          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-6 border border-yellow-500/20 mb-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-3 bg-black/30 rounded-full px-6 py-3 mb-4">
                <Crown className="w-6 h-6 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">10 Rounds to Glory</span>
              </div>
              <p className="text-blue-200 text-lg">
                After 10 intense rounds of quantum warfare, the player with the highest score claims ultimate victory
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-8 border border-yellow-500/20">
              <h4 className="text-3xl font-semibold text-yellow-400 mb-8 text-center flex items-center justify-center gap-3">
                <Award className="w-10 h-10" />
                Scoring System
              </h4>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-blue-500 blur-xl opacity-30 animate-pulse"></div>
                    <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-8 rounded-2xl">
                      <Target className="w-16 h-16 text-white mx-auto mb-4" />
                      <h5 className="text-3xl font-bold text-white mb-2">10 Points</h5>
                      <p className="text-blue-100 text-lg">per Planet Controlled</p>
                    </div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-4">
                    <p className="text-blue-200 text-sm">
                      Planets are the primary source of victory points. Control as many as possible!
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-green-500 blur-xl opacity-30 animate-pulse"></div>
                    <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 p-8 rounded-2xl">
                      <Users className="w-16 h-16 text-white mx-auto mb-4" />
                      <h5 className="text-3xl font-bold text-white mb-2">1 Point</h5>
                      <p className="text-green-100 text-lg">per Troop on Planets</p>
                    </div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-4">
                    <p className="text-blue-200 text-sm">
                      Troops provide additional points. Maximize your military strength!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
              <h4 className="text-2xl font-semibold text-purple-400 mb-6 flex items-center gap-3">
                <TrendingUp className="w-8 h-8" />
                Victory Conditions & Strategies
              </h4>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h5 className="text-lg font-semibold text-purple-300">Primary Victory Path</h5>
                  <div className="space-y-3">
                    <div className="bg-black/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Crown className="w-5 h-5 text-yellow-400" />
                        <p className="text-purple-300 font-medium">Highest Total Score</p>
                      </div>
                      <p className="text-blue-200 text-sm">Player with most points after 10 rounds wins</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-blue-400" />
                        <p className="text-purple-300 font-medium">Planet Dominance</p>
                      </div>
                      <p className="text-blue-200 text-sm">Generally more valuable than individual troops</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-green-400" />
                        <p className="text-purple-300 font-medium">Troop Efficiency</p>
                      </div>
                      <p className="text-blue-200 text-sm">Maximize troops on planets you control</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h5 className="text-lg font-semibold text-purple-300">Scoring Examples</h5>
                  <div className="space-y-3">
                    <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                      <p className="text-green-400 font-medium mb-2">Strong Position</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-200">15 planets × 10</span>
                          <span className="text-green-400">150</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-200">45 troops × 1</span>
                          <span className="text-green-400">45</span>
                        </div>
                        <div className="border-t border-white/10 pt-1 flex justify-between font-bold">
                          <span className="text-blue-200">Total Score</span>
                          <span className="text-green-400">195</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/20">
                      <p className="text-orange-400 font-medium mb-2">Troop Heavy</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-200">12 planets × 10</span>
                          <span className="text-orange-400">120</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-200">60 troops × 1</span>
                          <span className="text-orange-400">60</span>
                        </div>
                        <div className="border-t border-white/10 pt-1 flex justify-between font-bold">
                          <span className="text-blue-200">Total Score</span>
                          <span className="text-orange-400">180</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h5 className="text-lg font-semibold text-purple-300">Endgame Tips</h5>
                  <div className="space-y-3">
                    <div className="bg-black/20 rounded-lg p-3">
                      <p className="text-purple-300 font-medium mb-1">Planet Priority</p>
                      <p className="text-blue-200 text-sm">Focus on capturing planets over accumulating troops</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                      <p className="text-purple-300 font-medium mb-1">Defensive Play</p>
                      <p className="text-blue-200 text-sm">Protect your valuable planets in final rounds</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                      <p className="text-purple-300 font-medium mb-1">Score Calculation</p>
                      <p className="text-blue-200 text-sm">Keep track of opponents' potential scores</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-6 border border-indigo-500/20">
              <h4 className="text-2xl font-semibold text-indigo-400 mb-6 flex items-center gap-3">
                <Sparkles className="w-8 h-8" />
                Victory Celebration
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h5 className="text-lg font-semibold text-indigo-300">Results Screen Features</h5>
                  <div className="space-y-3">
                    <div className="bg-black/20 rounded-lg p-3">
                      <p className="text-indigo-300 font-medium mb-1">Winner Spotlight</p>
                      <p className="text-blue-200 text-sm">Dramatic victory celebration with quantum effects</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                      <p className="text-indigo-300 font-medium mb-1">Detailed Rankings</p>
                      <p className="text-blue-200 text-sm">Complete breakdown of all player scores</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                      <p className="text-indigo-300 font-medium mb-1">Performance Analysis</p>
                      <p className="text-blue-200 text-sm">Planets and troops breakdown per player</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                      <p className="text-indigo-300 font-medium mb-1">Game Statistics</p>
                      <p className="text-blue-200 text-sm">Battle history and strategic insights</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h5 className="text-lg font-semibold text-indigo-300">Post-Game Options</h5>
                  <div className="space-y-3">
                    <div className="bg-black/20 rounded-lg p-3">
                      <p className="text-indigo-300 font-medium mb-1">Return to Lobby</p>
                      <p className="text-blue-200 text-sm">Start a new game with the same players</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                      <p className="text-indigo-300 font-medium mb-1">Share Results</p>
                      <p className="text-blue-200 text-sm">Export game statistics and rankings</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                      <p className="text-indigo-300 font-medium mb-1">Replay Analysis</p>
                      <p className="text-blue-200 text-sm">Review key moments and strategic decisions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/30 rounded-xl p-6 border border-white/10">
              <h4 className="text-xl font-semibold text-white mb-6 text-center">Paths to Victory</h4>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-8 h-8 text-blue-400" />
                  </div>
                  <p className="text-blue-400 font-medium mb-2">Territorial Control</p>
                  <p className="text-blue-200 text-sm">Dominate through planet acquisition</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Swords className="w-8 h-8 text-red-400" />
                  </div>
                  <p className="text-red-400 font-medium mb-2">Military Might</p>
                  <p className="text-blue-200 text-sm">Overwhelm with superior forces</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Brain className="w-8 h-8 text-purple-400" />
                  </div>
                  <p className="text-purple-400 font-medium mb-2">Strategic Mastery</p>
                  <p className="text-blue-200 text-sm">Outmaneuver through cunning</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-8 h-8 text-green-400" />
                  </div>
                  <p className="text-green-400 font-medium mb-2">Alliance Building</p>
                  <p className="text-blue-200 text-sm">Coordinate for mutual victory</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div className="quantum-bg min-h-screen p-8 relative overflow-hidden">
      {/* Enhanced Quantum Particles */}
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-particle opacity-20"
          style={{
            width: `${Math.random() * 4 + 1}px`,
            height: `${Math.random() * 4 + 1}px`,
            backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'][Math.floor(Math.random() * 5)],
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 20}s`,
            animationDuration: `${20 + Math.random() * 20}s`
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('/home')}
            className="group flex items-center text-blue-400 hover:text-blue-300 transition-all duration-300"
          >
            <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors mr-2">
              <ArrowLeft className="w-5 h-5" />
            </div>
            Back to Home
          </button>
          
          <div className="text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
              QAJR Mastery Guide
            </h1>
            <p className="text-blue-200 text-lg">Your complete guide to quantum galactic conquest</p>
          </div>

          <div className="text-right">
            <div className="text-blue-400 text-lg font-semibold">
              Step {currentStep + 1} of {tutorialSteps.length}
            </div>
            <div className="text-blue-300 text-sm">
              {Math.round(((currentStep + 1) / tutorialSteps.length) * 100)}% Complete
            </div>
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mb-8">
          <div className="relative">
            <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </motion.div>
            </div>
            <div className="absolute -top-1 left-0 w-full flex justify-between">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                    index <= currentStep
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-white'
                      : 'bg-black/50 border-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Step Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {tutorialSteps.map((step, index) => (
              <motion.button
                key={step.id}
                onClick={() => goToStep(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`group relative overflow-hidden rounded-xl transition-all duration-300 ${
                  index === currentStep
                    ? `bg-gradient-to-r ${step.bgGradient} border-2 border-white/30 scale-110`
                    : index < currentStep
                    ? 'bg-green-500/20 border border-green-500/50 hover:bg-green-500/30'
                    : 'bg-black/30 border border-white/10 hover:bg-black/50'
                }`}
              >
                <div className="p-4 flex items-center gap-3">
                  <div className={`${step.color} transition-colors duration-300`}>
                    {step.icon}
                  </div>
                  <div className="text-left">
                    <p className={`font-medium ${index === currentStep ? 'text-white' : step.color}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-blue-200/70">
                      Step {index + 1}
                    </p>
                  </div>
                </div>
                {index === currentStep && (
                  <motion.div
                    className="absolute inset-0 bg-white/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Enhanced Main Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Enhanced Step List */}
          <div className="lg:col-span-1">
            <div className="bg-black/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10 sticky top-8">
              <h3 className="text-xl font-semibold text-blue-400 mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                Tutorial Sections
              </h3>
              <div className="space-y-3">
                {tutorialSteps.map((step, index) => (
                  <motion.button
                    key={step.id}
                    onClick={() => goToStep(index)}
                    whileHover={{ x: 5 }}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                      index === currentStep
                        ? `bg-gradient-to-r ${step.bgGradient} border border-white/20 text-white shadow-lg`
                        : 'bg-black/30 hover:bg-black/50 text-blue-200/70 hover:text-blue-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 ${index === currentStep ? 'text-white' : step.color}`}>
                        {step.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{step.title}</p>
                        <p className="text-xs opacity-70">
                          {index < currentStep ? 'Completed' : index === currentStep ? 'Current' : 'Upcoming'}
                        </p>
                      </div>
                      {index < currentStep && (
                        <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Content Area */}
          <div className="lg:col-span-3">
            <div className={`bg-gradient-to-br ${tutorialSteps[currentStep].bgGradient} rounded-2xl p-1`}>
              <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 min-h-[800px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <div className={`p-4 bg-gradient-to-r ${tutorialSteps[currentStep].bgGradient} rounded-xl`}>
                        <div className="text-white">
                          {tutorialSteps[currentStep].icon}
                        </div>
                      </div>
                      <div>
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                          {tutorialSteps[currentStep].title}
                        </h2>
                        <p className="text-blue-300 text-lg mt-1">
                          Section {currentStep + 1} of {tutorialSteps.length}
                        </p>
                      </div>
                    </div>
                    
                    <div className="prose prose-invert max-w-none">
                      {tutorialSteps[currentStep].content}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Enhanced Navigation */}
            <div className="flex items-center justify-between mt-8">
              <motion.button
                onClick={prevStep}
                disabled={currentStep === 0}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-black/30 hover:bg-black/50 
                  text-blue-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                  disabled:hover:scale-100"
              >
                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Previous</span>
              </motion.button>

              <div className="flex items-center gap-4">
                {currentStep === tutorialSteps.length - 1 ? (
                  <motion.button
                    onClick={() => navigate('/home')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group px-12 py-4 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
                      text-white font-medium hover:opacity-90 transition-all duration-300 flex items-center gap-3"
                  >
                    <Crown className="w-6 h-6" />
                    <span>Complete Tutorial</span>
                    <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={nextStep}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
                      text-white font-medium hover:opacity-90 transition-all duration-300"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tutorial;