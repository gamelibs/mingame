import { createInitialState } from './core/state';
import { generateBehaviorPool } from './core/behavior-pool';
import { modernBehaviors } from './data/modern-behaviors';
import {
  mapBehaviorsToGrid,
  renderGrid,
  getBehaviorAt
} from './ui/grid';
import { renderGameScreen } from './ui/render';
import { renderBehaviorModal } from './ui/modal';
import { simulatePlayerChoice, parsePlayerInput } from './ui/input';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`[断言失败] ${message}`);
  }
}

function runTests(): void {
  console.log('=== 人生选择器 UI 模块测试 ===\n');

  // 1. 低龄状态（1 岁）的行为池与网格
  const youngState = createInitialState();
  youngState.age = 1;
  const youngPool = generateBehaviorPool(youngState, modernBehaviors, 'modern');
  console.log(`[1 岁] 行为池数量: ${youngPool.length}`);

  const youngGrid = mapBehaviorsToGrid(youngPool);
  assert(youngGrid.length === 10, '网格应有 10 行');
  assert(youngGrid.every((row) => row.length === 10), '每行应有 10 列');

  // 低龄时只应在低 risk 行（n1~n2）出现行为
  const occupiedRows: number[] = [];
  for (let y = 1; y <= 10; y++) {
    const hasBehavior = youngGrid[y - 1].some((b) => b !== null);
    if (hasBehavior) occupiedRows.push(y);
  }
  console.log(`[1 岁] 被占用的风险行: ${occupiedRows.map((n) => 'n' + n).join(', ')}`);
  assert(
    occupiedRows.every((n) => n <= 3),
    '低龄网格只应在底部低风险行有内容'
  );

  // 1b. 青年（20 岁）应出现底部多行，但不会有高风险行
  const youthState = createInitialState();
  youthState.age = 20;
  youthState.wealth = 50;
  const youthPool = generateBehaviorPool(youthState, modernBehaviors, 'modern');
  const youthGrid = mapBehaviorsToGrid(youthPool);
  const youthOccupiedRows: number[] = [];
  for (let y = 1; y <= 10; y++) {
    const hasBehavior = youthGrid[y - 1].some((b) => b !== null);
    if (hasBehavior) youthOccupiedRows.push(y);
  }
  console.log(`[20 岁] 行为池数量: ${youthPool.length}, 被占用的风险行: ${youthOccupiedRows.map((n) => 'n' + n).join(', ')}`);
  assert(
    youthOccupiedRows.every((n) => n <= 8),
    '青年网格不应出现最高风险行'
  );
  assert(youthOccupiedRows.length >= 2, '青年网格应至少占据两行');

  // 2. 渲染网格字符串
  const gridStr = renderGrid(youngGrid);
  console.log('\n--- 低龄网格渲染 ---');
  console.log(gridStr);
  assert(gridStr.includes('n1'), '渲染结果应包含 n1');
  assert(gridStr.includes('n10'), '渲染结果应包含 n10');
  assert(gridStr.includes('c10'), '渲染结果应包含 c10');
  assert(gridStr.includes('成长'), '渲染结果应包含类别横轴 成长');

  // 3. 完整游戏界面渲染
  const screen = renderGameScreen(youngState, youngGrid);
  console.log('\n--- 完整游戏界面 ---');
  console.log(screen);
  assert(screen.includes('人生选择器'), '界面应包含标题');
  assert(screen.includes('财富'), '界面应包含财富属性');
  assert(screen.includes('健康'), '界面应包含健康属性');
  assert(screen.includes('操作提示'), '界面应包含操作提示');

  // 4. 行为详情弹窗（使用网格中实际存在的任意行为）
  let behavior: ReturnType<typeof getBehaviorAt> = null;
  for (let y = 1; y <= 10 && !behavior; y++) {
    for (let x = 1; x <= 10 && !behavior; x++) {
      behavior = getBehaviorAt(youngGrid, x, y);
    }
  }
  assert(behavior !== null, '低龄网格中应至少存在一个行为');
  const modal = renderBehaviorModal(behavior!, youngState);
  console.log('\n--- 行为详情弹窗 ---');
  console.log(modal);
  assert(modal.includes(behavior!.name), '弹窗应包含行为名称');
  assert(modal.includes('n' + behavior!.riskLevel), '弹窗应包含风险等级');
  assert(modal.includes('5 秒内确认'), '弹窗应包含倒计时提示');

  // 5. 模拟玩家选择
  const choice = simulatePlayerChoice(youngState, youngGrid);
  console.log('\n--- 模拟玩家选择 ---');
  console.log(`坐标: l${choice.x}n${choice.y}, 权重: ${choice.weight}`);
  assert(choice.x >= 1 && choice.x <= 10, 'x 应在 1~10 之间');
  assert(choice.y >= 1 && choice.y <= 10, 'y 应在 1~10 之间');
  assert(choice.weight >= 0.1 && choice.weight <= 1.0, 'weight 应在 0.1~1.0 之间');
  assert(
    getBehaviorAt(youngGrid, choice.x, choice.y) !== null,
    '模拟选择的位置应有行为'
  );

  // 6. 输入解析（使用网格中实际存在的坐标）
  let validX = 1;
  let validY = 1;
  for (let y = 1; y <= 10; y++) {
    for (let x = 1; x <= 10; x++) {
      if (getBehaviorAt(youngGrid, x, y) !== null) {
        validX = x;
        validY = y;
        break;
      }
    }
  }
  const lnInput = `l${validX}n${validY}`;
  const parsed = parsePlayerInput(youngGrid, lnInput);
  assert(parsed !== null, `${lnInput} 应解析成功`);
  assert(parsed!.x === validX && parsed!.y === validY, `${lnInput} 解析结果应为 x=${validX}, y=${validY}`);

  const commaInput = `${validX},${validY}`;
  const parsedComma = parsePlayerInput(youngGrid, commaInput);
  assert(parsedComma !== null, `${commaInput} 应解析成功`);
  assert(
    parsedComma!.x === validX && parsedComma!.y === validY,
    `${commaInput} 解析结果应为 x=${validX}, y=${validY}`
  );

  const invalid = parsePlayerInput(youngGrid, 'l9n9');
  assert(invalid === null, '空位置 l9n9 应解析失败');

  const badFormat = parsePlayerInput(youngGrid, 'hello');
  assert(badFormat === null, '非法格式应解析失败');

  console.log('\n✅ 所有 UI 测试通过');
}

runTests();
