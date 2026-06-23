import { createGameController } from './game-controller';

const c = createGameController({ mode: 'modern', maxAge: 100 });

console.log('===== 年龄 1 =====');
let grid = c.getGrid();
for (let y = 10; y >= 1; y--) {
  const row = grid[y - 1];
  const cells = row.map((b) => (b ? b.name : '-')).join(' | ');
  console.log(`n${y.toString().padStart(2)}: ${cells}`);
}

// Fast forward to age 30
while (c.getState().age < 30 && !c.isGameOver()) {
  c.stepAuto();
}

console.log('\n===== 年龄 30 =====');
grid = c.getGrid();
for (let y = 10; y >= 1; y--) {
  const row = grid[y - 1];
  const cells = row.map((b) => (b ? b.name : '-')).join(' | ');
  console.log(`n${y.toString().padStart(2)}: ${cells}`);
}
