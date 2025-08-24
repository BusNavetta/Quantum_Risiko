export interface MapTile {
  id: string;
  type: 'water' | 'land';
  x: number;
  y: number;
  owner?: string;
  color?: string; 
  troops?: number;
  borderTiles?: string[];
}

// This file is kept for type compatibility but the map generation functionality is no longer used
export function generateMap(): MapTile[][] {
  return [];
}