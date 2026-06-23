import { createGameController } from './game-controller';

const controller = createGameController({ mode: 'modern', maxAge: 10 });

console.log('===== 初始状态 =====');
console.log(controller.getState());

const grid = controller.getGrid();
console.log('\n===== 初始网格 =====');
console.log(`网格维度：${grid.length} x ${grid[0].length}`);

function printGrid(g: typeof grid) {
  for (let visualRow = 10; visualRow >= 1; visualRow--) {
    const row = g[visualRow - 1];
    const cells = row.map((b) => (b ? b.name : '-'));
    console.log(`n${visualRow.toString().padStart(2)}: ${cells.join(' | ')}`);
  }
}

printGrid(grid);

function rowHasBehavior(y: number) {
  return grid[y - 1].some((b) => b !== null);
}

console.log('\n===== 低龄行检查 =====');
console.log('n1 有行为:', rowHasBehavior(1));
console.log('n2 有行为:', rowHasBehavior(2));
console.log('n3 有行为:', rowHasBehavior(3));

console.log('\n===== 自动执行一年 =====');
const firstLog = controller.stepAuto();
console.log('第一年日志:', firstLog);
console.log('当前年龄:', controller.getState().age);
console.log('日志条数:', controller.getLogs().length);
console.log('能量曲线:', controller.getEnergyCurve());

console.log('\n===== 再执行几年 =====');
for (let i = 0; i < 5 && !controller.isGameOver(); i++) {
  controller.stepAuto();
}

console.log('最终年龄:', controller.getState().age);
console.log('是否结束:', controller.isGameOver());
console.log('结束原因:', controller.getGameOverReason());
console.log('日志总数:', controller.getLogs().length);
console.log('能量曲线长度:', controller.getEnergyCurve().length);
