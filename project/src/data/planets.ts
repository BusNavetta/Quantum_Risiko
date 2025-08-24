import { Planet, StandardMap } from '../types';

const PLANETS_PER_PLAYER = 10; // Each player gets exactly 10 planets
const DEFAULT_COLOR = '#4a5568';
const INITIAL_TROOPS = 2;

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateInitialPlanets(
  players: { id: string; color: string }[],
  standardMap: StandardMap
): Planet[] {
  if (!standardMap || !standardMap.planets || !Array.isArray(standardMap.planets)) {
    throw new Error("A valid standard map is required. Cannot generate planets.");
  }

  try {
    // Create base planets array from standard map
    const planets: Planet[] = standardMap.planets.map(p => ({
      id: p.id,
      name: p.name,
      position: p.position as [number, number, number],
      size: 1.2,
      color: DEFAULT_COLOR, // Start all planets with default color
      owners: [], // Start with no owners
      troops: 0, // Start with 0 troops
      type: p.type || 'rocky',
      maxTroops: p.maxTroops || 100,
      resources: p.resources || { gas: 0, metal: 0, crystal: 0 },
      baseDefense: p.baseDefense || 10,
      infrastructure: p.infrastructure || { labs: 0, mines: 0, shipyards: 0 },
      productionRate: p.productionRate || { gas: 1, metal: 1, crystal: 1 }
    }));

    // Randomly assign planets to players
    const shuffledPlanets = shuffleArray(planets);
    
    // Ensure we don't exceed available planets
    const maxAssignablePlanets = Math.min(PLANETS_PER_PLAYER * players.length, planets.length);
    
    players.forEach((player, playerIndex) => {
      const startIdx = playerIndex * PLANETS_PER_PLAYER;
      const endIdx = Math.min(startIdx + PLANETS_PER_PLAYER, maxAssignablePlanets);
      const playerPlanets = shuffledPlanets.slice(startIdx, endIdx);
      
      playerPlanets.forEach(planet => {
        planet.color = player.color;
        planet.owners = [player.id];
        planet.troops = INITIAL_TROOPS;
      });
    });

    // Return the planets - database update will be handled separately
    return planets;
  } catch (error) {
    throw new Error(`Failed to generate planets: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Separate function to handle database updates
export async function updatePlanetStates(planets: Planet[]): Promise<void> {
  try {
    const { supabase } = await import('../lib/supabase');
    
    const planetStates = planets.map(planet => ({
      planet_id: planet.id,
      map_name: 'Standard Galaxy v1',
      map_version: 1,
      owner_id: planet.owners[0] || null,
      color: planet.color,
      troops: planet.troops
    }));

    await supabase
      .from('map_planet_state')
      .upsert(planetStates, { onConflict: 'planet_id,map_name,map_version' });
  } catch (error) {
    console.error('Failed to update planet states:', error);
    throw error;
  }
}