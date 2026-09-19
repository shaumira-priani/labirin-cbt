import { MazeCell, Organism, Question, BiogeographicZone } from '../types/kehati';
import { ORGANISMS_DATABASE, KEHATI_QUESTIONS } from '../data/kehatiData';

export function generateMazeGrid(
  width: number,
  height: number,
  zone: BiogeographicZone,
  specimenCount: number,
  questionCount: number
): { grid: MazeCell[][]; startPos: { x: number; y: number }; exitPos: { x: number; y: number } } {
  // 1. Initialize grid with all walls
  const grid: MazeCell[][] = [];
  for (let y = 0; y < height; y++) {
    const row: MazeCell[] = [];
    for (let x = 0; x < width; x++) {
      row.push({
        x,
        y,
        walls: { top: true, right: true, bottom: true, left: true },
        visited: false
      });
    }
    grid.push(row);
  }

  // 2. Recursive Backtracker for Maze Generation
  const stack: [number, number][] = [];
  const startX = 0;
  const startY = 0;
  grid[startY][startX].visited = true;
  stack.push([startX, startY]);

  const directions = [
    { dx: 0, dy: -1, wall: 'top', opposite: 'bottom' },
    { dx: 1, dy: 0, wall: 'right', opposite: 'left' },
    { dx: 0, dy: 1, wall: 'bottom', opposite: 'top' },
    { dx: -1, dy: 0, wall: 'left', opposite: 'right' }
  ];

  while (stack.length > 0) {
    const [currentX, currentY] = stack[stack.length - 1];
    const neighbors: { x: number; y: number; dir: typeof directions[0] }[] = [];

    for (const dir of directions) {
      const nx = currentX + dir.dx;
      const ny = currentY + dir.dy;

      if (nx >= 0 && nx < width && ny >= 0 && ny < height && !grid[ny][nx].visited) {
        neighbors.push({ x: nx, y: ny, dir });
      }
    }

    if (neighbors.length > 0) {
      // Pick random unvisited neighbor
      const chosen = neighbors[Math.floor(Math.random() * neighbors.length)];
      const currentCell = grid[currentY][currentX];
      const nextCell = grid[chosen.y][chosen.x];

      // Remove walls between current and chosen
      (currentCell.walls as any)[chosen.dir.wall] = false;
      (nextCell.walls as any)[chosen.dir.opposite] = false;

      nextCell.visited = true;
      stack.push([chosen.x, chosen.y]);
    } else {
      stack.pop();
    }
  }

  // 3. Reset visited flags for gameplay
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      grid[y][x].visited = false;
    }
  }
  grid[0][0].visited = true;

  // 4. Determine Exit Position (farthest corner)
  const exitPos = { x: width - 1, y: height - 1 };
  grid[exitPos.y][exitPos.x].item = {
    type: 'exit'
  };

  // 5. Gather eligible organisms for this Zone
  const zoneOrganisms = ORGANISMS_DATABASE.filter(org => org.zone === zone);
  const fallbackOrganisms = ORGANISMS_DATABASE;
  const poolOrganisms = zoneOrganisms.length > 0 ? zoneOrganisms : fallbackOrganisms;

  // Filter available empty cells (excluding start 0,0 and exit)
  const emptyCells: { x: number; y: number }[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if ((x === 0 && y === 0) || (x === exitPos.x && y === exitPos.y)) continue;
      emptyCells.push({ x, y });
    }
  }

  // Shuffle empty cells
  const shuffledCells = [...emptyCells].sort(() => Math.random() - 0.5);

  // Place specimens
  let cellIdx = 0;
  for (let i = 0; i < specimenCount && cellIdx < shuffledCells.length; i++) {
    const org = poolOrganisms[i % poolOrganisms.length];
    const cell = shuffledCells[cellIdx++];
    grid[cell.y][cell.x].item = {
      type: 'specimen',
      organismId: org.id,
      collected: false
    };
  }

  // Place quiz checkpoints
  const shuffledQuestions = [...KEHATI_QUESTIONS].sort(() => Math.random() - 0.5);
  for (let i = 0; i < questionCount && cellIdx < shuffledCells.length; i++) {
    const q = shuffledQuestions[i % shuffledQuestions.length];
    const cell = shuffledCells[cellIdx++];
    grid[cell.y][cell.x].item = {
      type: 'checkpoint',
      questionId: q.id,
      collected: false
    };
  }

  // Place conservation seeds (bonus points)
  const seedCount = Math.floor((width * height) * 0.08);
  for (let i = 0; i < seedCount && cellIdx < shuffledCells.length; i++) {
    const cell = shuffledCells[cellIdx++];
    grid[cell.y][cell.x].item = {
      type: 'seed',
      collected: false
    };
  }

  // Place threat obstacle (e.g. logging/plastic)
  const threatCount = Math.min(2, Math.floor(specimenCount / 2));
  for (let i = 0; i < threatCount && cellIdx < shuffledCells.length; i++) {
    const cell = shuffledCells[cellIdx++];
    grid[cell.y][cell.x].item = {
      type: 'threat',
      collected: false
    };
  }

  return {
    grid,
    startPos: { x: 0, y: 0 },
    exitPos
  };
}
