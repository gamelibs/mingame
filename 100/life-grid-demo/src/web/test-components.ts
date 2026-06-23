import { renderGrid, bindGridClick } from './components/grid';
import { renderAttributes } from './components/attributes';
import { renderLogs, scrollLogsToBottom } from './components/logs';
import { Behavior, LogEntry, PlayerState } from '../types';

const sampleBehavior: Behavior = {
  id: 'test-behavior',
  name: '学习编程',
  category: '教育',
  minAge: 0,
  maxAge: 100,
  riskLevel: 2,
  rewardLevel: 3,
  failureLevel: 1,
  balanceEffect: 0,
  unlockWealth: 0,
  tags: ['知识', '技能', 'tech'],
  description: '学习编程语言，提升技能与知识。',
};

function makeEmptyGrid(): (Behavior | null)[][] {
  return Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => null)
  );
}

function makeFilledGrid(): (Behavior | null)[][] {
  const grid = makeEmptyGrid();
  grid[1][2] = sampleBehavior;
  grid[4][0] = { ...sampleBehavior, id: 'high-risk', name: '创业冒险', riskLevel: 9 };
  return grid;
}

function makeState(): PlayerState {
  return {
    age: 18,
    health: 85,
    wealth: 5000,
    knowledge: 40,
    skill: 60,
    social: 50,
    happy: 70,
    charm: 45,
    luck: 55,
    lifeBalance: 75,
    successChain: 2,
    failureChain: 0,
    deathRate: 0.01,
    history: [],
  };
}

function makeLog(overrides?: Partial<LogEntry>): LogEntry {
  return {
    age: 18,
    behaviorName: '学习编程',
    riskLevel: 2,
    result: 'success',
    score: 12,
    events: ['遇到良师'],
    effects: { knowledge: 4, skill: 4 },
    wealth: 100,
    ...overrides,
  };
}

export function runComponentTests(): void {
  if (typeof document === 'undefined') {
    console.log('非浏览器环境，跳过组件 DOM 测试');
    return;
  }

  // 1. 空网格渲染与点击绑定
  const gridContainer = document.createElement('div');
  gridContainer.id = 'test-grid';
  renderGrid(gridContainer, makeEmptyGrid());
  bindGridClick(gridContainer, (x, y, behavior) => {
    console.log(`点击格子 ${x}, ${y}`, behavior?.name ?? '空');
  });
  document.body.appendChild(gridContainer);

  // 2. 带行为的网格重新渲染
  renderGrid(gridContainer, makeFilledGrid());

  // 3. 属性面板
  const attrContainer = document.createElement('div');
  attrContainer.id = 'test-attributes';
  renderAttributes(attrContainer, makeState());
  document.body.appendChild(attrContainer);

  // 4. 日志渲染
  const behaviorMap = new Map<string, Behavior>();
  behaviorMap.set(sampleBehavior.name, sampleBehavior);

  const logsContainer = document.createElement('div');
  logsContainer.id = 'test-logs';
  logsContainer.className = 'logs-content';
  renderLogs(
    logsContainer,
    [
      makeLog({ result: 'bigSuccess', score: 25, events: ['获得奖学金'] }),
      makeLog({ result: 'failure', score: -5, events: ['熬夜生病'] }),
      makeLog({ result: 'bigFailure', score: -20, events: ['投资失败'] }),
    ],
    behaviorMap
  );
  scrollLogsToBottom(logsContainer);
  document.body.appendChild(logsContainer);
}

runComponentTests();
