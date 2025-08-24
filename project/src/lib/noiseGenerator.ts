// Simplified Perlin-like noise generator
export function generateNoise(width: number, height: number, smoothing: number): number[][] {
  const noise: number[][] = [];
  
  // Initialize with random values
  for (let y = 0; y < height; y++) {
    noise[y] = [];
    for (let x = 0; x < width; x++) {
      noise[y][x] = Math.random();
    }
  }
  
  // Apply smoothing
  for (let i = 0; i < 3; i++) {
    smoothNoise(noise, smoothing);
  }
  
  return noise;
}

function smoothNoise(noise: number[][], factor: number): void {
  const height = noise.length;
  const width = noise[0].length;
  const original = noise.map(row => [...row]);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      let count = 0;
      
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const newY = y + dy;
          const newX = x + dx;
          
          if (newY >= 0 && newY < height && newX >= 0 && newX < width) {
            sum += original[newY][newX];
            count++;
          }
        }
      }
      
      noise[y][x] = original[y][x] * (1 - factor) + (sum / count) * factor;
    }
  }
}