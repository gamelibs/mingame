import { createInitialState } from './core/state';
import { generateBehaviorPool } from './core/behavior-pool';
import { resolveResult } from './core/resolve';
import { calculateDeathRate, checkDeath } from './core/death';
import { modernBehaviors } from './data/modern-behaviors';
import { PlayerState, ResultType } from './types';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function main(): void {
  console.log('=== 核心逻辑测试开始 ===\n');

  // 1. createInitialState 返回合法状态
  const state = createInitialState();
  assert(state.age === 1, '初始年龄应为 1');
  assert(state.health === 100, '初始健康应为 100');
  assert(state.wealth === 0, '初始财富应为 0');
  assert(state.history.length === 0, '初始历史应为空');
  console.log('✓ createInitialState 返回合法状态');

  // 2. generateBehaviorPool 在 1 岁返回 3-5 个低风险行为
  const childState: PlayerState = { ...state };
  childState.age = 1;
  const childPool = generateBehaviorPool(childState, modernBehaviors, 'modern');
  assert(childPool.length >= 5 && childPool.length <= 8, `1岁行为池数量应为 5-8，实际为 ${childPool.length}`);
  assert(
    childPool.every((b) => b.riskLevel <= 3),
    '1岁行为池应只包含低风险行为（riskLevel <= 3）'
  );
  console.log(`✓ 1岁行为池返回 ${childPool.length} 个低风险行为`);

  // 3. generateBehaviorPool 在 30 岁返回更多行为
  const adultState: PlayerState = { ...state };
  adultState.age = 30;
  const adultPool = generateBehaviorPool(adultState, modernBehaviors, 'modern');
  assert(adultPool.length > childPool.length, '30岁行为池应比1岁更多');
  console.log(`✓ 30岁行为池返回 ${adultPool.length} 个行为，比1岁更多`);

  // 4. resolveResult 多次调用返回不同结果档位
  const testBehavior = modernBehaviors.find((b) => b.id === 'm_read') || modernBehaviors[0];
  const results = new Set<ResultType>();
  for (let i = 0; i < 50; i++) {
    const res = resolveResult(testBehavior, testBehavior.riskLevel, state);
    results.add(res.result);
  }
  assert(results.size >= 2, `resolveResult 应返回至少 2 种结果档位，实际为 ${results.size}`);
  console.log(`✓ resolveResult 在 50 次调用中产生 ${results.size} 种结果档位: ${Array.from(results).join(', ')}`);

  // 5. checkDeath 对高龄返回更高概率
  const youngState: PlayerState = { ...state, age: 10, health: 100, lifeBalance: 50, failureChain: 0 };
  const oldState: PlayerState = { ...state, age: 85, health: 60, lifeBalance: 30, failureChain: 2 };
  oldState.history.push({
    age: 84,
    x: 0,
    y: 5,
    behaviorId: 'risky',
    behaviorName: 'risky',
    weight: 1,
    result: 'normal',
    effects: {}
  });

  const youngRate = calculateDeathRate(youngState);
  const oldRate = calculateDeathRate(oldState);
  assert(oldRate > youngRate, `高龄死亡率应更高：老年 ${oldRate} vs 年轻 ${youngRate}`);
  console.log(`✓ 死亡率随年龄增长：10岁=${(youngRate * 100).toFixed(4)}%, 85岁=${(oldRate * 100).toFixed(2)}%`);

  // 6. checkDeath 可执行
  const died = checkDeath(oldState);
  console.log(`✓ checkDeath 执行成功，高龄判定死亡=${died}`);

  console.log('\n=== 所有核心逻辑测试通过 ===');
}

main();
