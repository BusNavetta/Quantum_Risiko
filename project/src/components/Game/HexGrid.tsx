import React, { useRef, useEffect } from 'react';
import { HexTile, getHexPoints } from '../../lib/mapGenerator';

interface HexGridProps {
  map: { [key: string]: HexTile };
  players: Array<{ id: string; color: string }>;
  onTileClick?: (tileId: string) => void;
  selectedTileId?: string;
}

export function HexGrid({ map, players, onTileClick, selectedTileId }: HexGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawHex = (
    ctx: CanvasRenderingContext2D,
    tile: HexTile,
    size: number,
    offsetX: number,
    offsetY: number
  ) => {
    const isEvenRow = tile.y % 2 === 0;
    const x = offsetX + (tile.x * size * 1.75) + (isEvenRow ? 0 : size * 0.875);
    const y = offsetY + (tile.y * size * 1.5);

    ctx.beginPath();
    const points = getHexPoints(x, y, size);
    const [firstPoint, ...rest] = points.split(' ');
    const [startX, startY] = firstPoint.split(',').map(Number);
    
    ctx.moveTo(startX, startY);
    rest.forEach(point => {
      const [px, py] = point.split(',').map(Number);
      ctx.lineTo(px, py);
    });
    ctx.closePath();

    // Fill base color
    ctx.fillStyle = tile.type === 'water' ? '#2563eb' : '#92400e';
    ctx.fill();

    // Draw owner color if exists
    if (tile.owner) {
      const player = players.find(p => p.id === tile.owner);
      if (player) {
        ctx.fillStyle = player.color;
        ctx.globalAlpha = 0.6;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // Draw selection highlight
    if (selectedTileId === tile.id) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Draw border
    ctx.strokeStyle = tile.type === 'water' ? '#1d4ed8' : '#854d0e';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw troops count if exists
    if (tile.troops) {
      ctx.fillStyle = '#ffffff';
      ctx.font = `${size * 0.4}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(tile.troops.toString(), x, y);
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate hex size based on canvas size and map dimensions
    const mapWidth = Math.max(...Object.values(map).map(t => t.x)) + 1;
    const mapHeight = Math.max(...Object.values(map).map(t => t.y)) + 1;
    
    const hexSize = Math.min(
      canvas.width / (mapWidth * 2),
      canvas.height / (mapHeight * 1.5)
    );

    // Center the map
    const offsetX = (canvas.width - mapWidth * hexSize * 1.75) / 2;
    const offsetY = (canvas.height - mapHeight * hexSize * 1.5) / 2;

    // Draw all hexes
    Object.values(map).forEach(tile => {
      drawHex(ctx, tile, hexSize, offsetX, offsetY);
    });
  };

  useEffect(() => {
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [map, players, selectedTileId]);

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onTileClick || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // TODO: Implement hex hit detection
    // For now, we'll just pass a random tile ID
    const tiles = Object.values(map);
    const randomTile = tiles[Math.floor(Math.random() * tiles.length)];
    onTileClick(randomTile.id);
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      className="w-full h-full"
    />
  );
}