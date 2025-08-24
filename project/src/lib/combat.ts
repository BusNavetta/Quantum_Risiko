import { Planet, Player } from '../types';
import { Chart } from 'chart.js/auto';

export interface CombatResult {
  success: boolean;
  message?: string;
  updatedDefender?: Planet;
  updatedAttacker?: Planet;
  report?: AttackReport;
}

export interface AttackReport {
  attacker: string;
  defender: string;
  attackerTroops: number;
  defenderTroops: number;
  outcome: string;
  finalAttackerTroops: number;
  finalDefenderTroops: number;
  planetName: string;
  planetCaptured: boolean;
  quantumData: {
    initialState: number[];
    qftState: number[];
    interference: number[];
    finalState: number[];
    constructiveInterference: boolean;
  };
}

function qft(state: number[]): number[] {
  const N = state.length;
  const result = new Array(N).fill(0);
  
  for (let k = 0; k < N; k++) {
    let sum = { real: 0, imag: 0 };
    for (let n = 0; n < N; n++) {
      const angle = (2 * Math.PI * k * n) / N;
      sum.real += state[n] * Math.cos(angle);
      sum.imag -= state[n] * Math.sin(angle);
    }
    result[k] = Math.sqrt(sum.real * sum.real + sum.imag * sum.imag) / Math.sqrt(N);
  }
  
  return result;
}

function iqft(state: number[]): number[] {
  const N = state.length;
  const result = new Array(N).fill(0);
  
  for (let k = 0; k < N; k++) {
    let sum = { real: 0, imag: 0 };
    for (let n = 0; n < N; n++) {
      const angle = (2 * Math.PI * k * n) / N;
      sum.real += state[n] * Math.cos(angle);
      sum.imag += state[n] * Math.sin(angle);
    }
    result[k] = Math.sqrt(sum.real * sum.real + sum.imag * sum.imag) / Math.sqrt(N);
  }
  
  return result;
}

function seededRandom(seed: string, index: number): number {
  const x = parseInt(seed) + index;
  const a = ((x << 13) ^ x);
  const b = (a * (a * a * 15731 + 789221) + 1376312589);
  return (b & 0x7fffffff) / 0x7fffffff;
}

function troopsToQuantumState(troops: number, maxTroops: number, seed: string, index: number): number[] {
  const state = new Array(8).fill(0);
  const normalizedTroops = troops / maxTroops;
  
  for (let i = 0; i < 8; i++) {
    state[i] = normalizedTroops * seededRandom(seed, index + i);
  }
  
  const norm = Math.sqrt(state.reduce((sum, val) => sum + val * val, 0));
  return state.map(val => val / norm);
}

function calculateInterference(state1: number[], state2: number[]): number[] {
  return state1.map((val, i) => {
    const interference = val * state2[i];
    return Math.abs(interference);
  });
}

function createBattleReport(
  report: AttackReport,
  quantumData: AttackReport['quantumData']
): void {
  const newWindow = window.open("", "_blank");
  if (!newWindow) return;

  const html = `
    <html>
      <head>
        <title>Quantum Battle Report</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
          body { 
            font-family: system-ui, -apple-system, sans-serif;
            padding: 2rem;
            background-color: #000;
            color: #fff;
            line-height: 1.5;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 1rem;
            padding: 2rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          h1 { 
            color: #3b82f6;
            font-size: 2rem;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }
          .quantum-data {
            margin-top: 2rem;
            padding: 1rem;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 0.5rem;
          }
          .chart-container {
            margin: 2rem 0;
            background: rgba(0, 0, 0, 0.2);
            padding: 1rem;
            border-radius: 0.5rem;
          }
          .outcome {
            margin-top: 2rem;
            padding: 1rem;
            background: ${report.planetCaptured ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
            border-radius: 0.5rem;
            color: ${report.planetCaptured ? '#4ade80' : '#f87171'};
            font-weight: 500;
          }
          .interference-type {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 0.25rem;
            font-weight: 500;
            background: ${quantumData.constructiveInterference ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
            color: ${quantumData.constructiveInterference ? '#4ade80' : '#f87171'};
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>⚛️ Quantum Battle Report</h1>
          
          <div class="quantum-data">
            <h2>Battle Parameters</h2>
            <p>Attacker: ${report.attacker} (${report.attackerTroops} troops)</p>
            <p>Defender: ${report.defender} (${report.defenderTroops} troops)</p>
            <p>Target: ${report.planetName}</p>
            <p>Interference Type: 
              <span class="interference-type">
                ${quantumData.constructiveInterference ? 
                  'Constructive (Favorable for Attacker)' : 
                  'Destructive (Favorable for Defender)'}
              </span>
            </p>
          </div>

          <div class="chart-container">
            <canvas id="quantumStatesChart"></canvas>
          </div>

          <div class="chart-container">
            <canvas id="troopsChart"></canvas>
          </div>

          <div class="outcome">
            ${report.outcome}
            <p>Final Troops - Attacker: ${report.finalAttackerTroops}, Defender: ${report.finalDefenderTroops}</p>
            ${quantumData.constructiveInterference ?
              '<p>Constructive interference weakened defender\'s quantum state</p>' :
              '<p>Destructive interference strengthened defender\'s quantum state</p>'
            }
          </div>
        </div>

        <script>
          new Chart(document.getElementById('quantumStatesChart'), {
            type: 'line',
            data: {
              labels: ['0', '1', '2', '3', '4', '5', '6', '7'],
              datasets: [
                {
                  label: 'Initial State',
                  data: ${JSON.stringify(quantumData.initialState)},
                  borderColor: '#3b82f6',
                  tension: 0.4
                },
                {
                  label: 'QFT State',
                  data: ${JSON.stringify(quantumData.qftState)},
                  borderColor: '#8b5cf6',
                  tension: 0.4
                },
                {
                  label: 'Interference',
                  data: ${JSON.stringify(quantumData.interference)},
                  borderColor: '#ec4899',
                  tension: 0.4
                },
                {
                  label: 'Final State',
                  data: ${JSON.stringify(quantumData.finalState)},
                  borderColor: '#10b981',
                  tension: 0.4
                }
              ]
            },
            options: {
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: 'Quantum State Evolution',
                  color: '#fff'
                },
                legend: {
                  labels: {
                    color: '#fff'
                  }
                }
              },
              scales: {
                y: {
                  grid: {
                    color: '#ffffff20'
                  },
                  ticks: {
                    color: '#fff'
                  }
                },
                x: {
                  grid: {
                    color: '#ffffff20'
                  },
                  ticks: {
                    color: '#fff'
                  }
                }
              }
            }
          });

          new Chart(document.getElementById('troopsChart'), {
            type: 'bar',
            data: {
              labels: ['Initial', 'Final'],
              datasets: [
                {
                  label: 'Attacker Troops',
                  data: [${report.attackerTroops}, ${report.finalAttackerTroops}],
                  backgroundColor: '#3b82f6'
                },
                {
                  label: 'Defender Troops',
                  data: [${report.defenderTroops}, ${report.finalDefenderTroops}],
                  backgroundColor: '#ec4899'
                }
              ]
            },
            options: {
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: 'Troop Changes',
                  color: '#fff'
                },
                legend: {
                  labels: {
                    color: '#fff'
                  }
                }
              },
              scales: {
                y: {
                  grid: {
                    color: '#ffffff20'
                  },
                  ticks: {
                    color: '#fff'
                  }
                },
                x: {
                  grid: {
                    color: '#ffffff20'
                  },
                  ticks: {
                    color: '#fff'
                  }
                }
              }
            }
          });
        </script>
      </body>
    </html>
  `;
  
  newWindow.document.write(html);
  newWindow.document.close();
}

export function applyEntanglementEffects(
  planets: Planet[],
  affectedPlanetId: string,
  isPositive: boolean
): Planet[] {
  const affectedPlanet = planets.find(p => p.id === affectedPlanetId);
  if (!affectedPlanet || !affectedPlanet.entangledWith) return planets;

  // Calculate the quantum resonance factor based on the number of entangled planets
  const resonanceFactor = Math.min(0.3, 0.1 * affectedPlanet.entangledWith.length);

  return planets.map(planet => {
    if (affectedPlanet.entangledWith.includes(planet.id)) {
      const effect = isPositive ? 1 : -1;
      const troopChange = Math.max(1, Math.floor(planet.troops * resonanceFactor));
      
      // Apply quantum resonance effect
      const newTroops = Math.max(0, planet.troops + (effect * troopChange));
      
      // Add entanglement notification to the planet
      return {
        ...planet,
        troops: newTroops,
        entanglementEffect: {
          type: isPositive ? 'constructive' : 'destructive',
          magnitude: troopChange,
          sourceId: affectedPlanetId
        }
      };
    }
    return planet;
  });
}

export function handlePlanetAttack(
  defenderPlanet: Planet,
  attackerPlanet: Planet,
  attackerTroops: number,
  attacker: Player
): CombatResult {
  if (attackerTroops >= attackerPlanet.troops) {
    return {
      success: false,
      message: 'Must leave at least 1 troop on attacking planet'
    };
  }

  if (attackerTroops <= 0) {
    return {
      success: false,
      message: 'Must attack with at least 1 troop'
    };
  }

  const gameId = localStorage.getItem('gameId');
  if (!gameId) {
    return {
      success: false,
      message: 'Game ID not found'
    };
  }

  const MAX_TROOPS = 8;
  const attackerState = troopsToQuantumState(attackerTroops, MAX_TROOPS, gameId, 0);
  const defenderState = troopsToQuantumState(defenderPlanet.troops, MAX_TROOPS, gameId, 8);

  const attackerQFT = qft(attackerState);
  const defenderQFT = qft(defenderState);
  const interference = calculateInterference(attackerQFT, defenderQFT);
  const interferenceSum = interference.reduce((sum, val) => sum + val, 0);
  
  // Constructive interference favors the attacker (sum > 0.5)
  const constructiveInterference = interferenceSum > 0.5;

  let finalDefenderTroops: number;
  let finalAttackerTroops: number;

  if (constructiveInterference) {
    // Constructive interference: Attacker advantage
    finalDefenderTroops = Math.max(0, Math.floor(defenderPlanet.troops * 0.7)); // Defender loses 30%
    finalAttackerTroops = attackerPlanet.troops - Math.floor(attackerTroops * 0.8); // Attacker loses 20% of attacking force
  } else {
    // Destructive interference: Defender advantage
    finalDefenderTroops = Math.min(MAX_TROOPS, Math.ceil(defenderPlanet.troops * 1.3)); // Defender gains 30%
    finalAttackerTroops = attackerPlanet.troops - attackerTroops; // Attacker loses all attacking troops
  }

  let updatedPlanets = [
    { ...attackerPlanet, troops: finalAttackerTroops },
    { ...defenderPlanet, troops: finalDefenderTroops }
  ];

  // Apply entanglement effects
  if (attackerPlanet.entangledWith && attackerPlanet.entangledWith.length > 0) {
    updatedPlanets = applyEntanglementEffects(updatedPlanets, attackerPlanet.id, constructiveInterference);
  }
  if (defenderPlanet.entangledWith && defenderPlanet.entangledWith.length > 0) {
    updatedPlanets = applyEntanglementEffects(updatedPlanets, defenderPlanet.id, !constructiveInterference);
  }

  const updatedAttacker = updatedPlanets.find(p => p.id === attackerPlanet.id)!;
  const updatedDefender = updatedPlanets.find(p => p.id === defenderPlanet.id)!;

  let outcome: string;
  let planetCaptured = false;

  if (finalDefenderTroops === 0) {
    outcome = `Quantum interference caused total defender collapse! ${attacker.name} captures ${defenderPlanet.name}`;
    updatedDefender.owners = [attacker.id];
    updatedDefender.color = attacker.color;
    updatedDefender.troops = attackerTroops;
    planetCaptured = true;
  } else if (constructiveInterference) {
    outcome = `Constructive interference favored the attacker! Defender lost ${Math.floor(defenderPlanet.troops * 0.3)} troops`;
  } else {
    outcome = `Destructive interference favored the defender! Defender gained ${Math.ceil(defenderPlanet.troops * 0.3)} troops`;
  }

  const report: AttackReport = {
    attacker: attacker.name,
    defender: defenderPlanet.owners[0] ? 'Player' : 'Neutral Planet',
    attackerTroops,
    defenderTroops: defenderPlanet.troops,
    planetName: defenderPlanet.name,
    finalAttackerTroops,
    finalDefenderTroops,
    planetCaptured,
    outcome,
    quantumData: {
      initialState: attackerState,
      qftState: attackerQFT,
      interference,
      finalState: interference,
      constructiveInterference
    }
  };

  createBattleReport(report, report.quantumData);

  return {
    success: true,
    updatedDefender,
    updatedAttacker,
    report
  };
}

export function resolveMultipleAttacks(
  targetPlanet: Planet,
  attacks: Array<{ playerId: string, troops: number, fromPlanetId: string, color: string }>,
  allPlanets: Planet[]
): Planet {
  const totalAttackingTroops = attacks.reduce((sum, attack) => sum + attack.troops, 0);
  
  const remainingDefenderTroops = targetPlanet.troops - totalAttackingTroops;
  
  if (remainingDefenderTroops > 0) {
    return {
      ...targetPlanet,
      troops: remainingDefenderTroops
    };
  }
  
  if (remainingDefenderTroops === 0) {
    return {
      ...targetPlanet,
      troops: 0,
      owners: [],
      color: '#4a5568'
    };
  }
  
  const strongestAttack = attacks.reduce((strongest, current) => 
    current.troops > strongest.troops ? current : strongest
  );
  
  // Apply entanglement effects after resolving multiple attacks
  let updatedPlanet = {
    ...targetPlanet,
    troops: strongestAttack.troops,
    owners: [strongestAttack.playerId],
    color: strongestAttack.color
  };

  if (targetPlanet.entangledWith && targetPlanet.entangledWith.length > 0) {
    const entangledPlanets = applyEntanglementEffects(
      allPlanets,
      targetPlanet.id,
      remainingDefenderTroops < 0
    );
    updatedPlanet = entangledPlanets.find(p => p.id === targetPlanet.id) || updatedPlanet;
  }

  return updatedPlanet;
}