import { createInitialState } from './core/state';
import { generateBehaviorPool } from './core/behavior-pool';
import { modernBehaviors } from './data/modern-behaviors';
import { Behavior, PlayerState } from './types';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`[年龄合理性测试失败] ${message}`);
  }
}

function makeState(age: number): PlayerState {
  const state = createInitialState();
  state.age = age;
  return state;
}

function poolForAge(age: number): Behavior[] {
  return generateBehaviorPool(makeState(age), modernBehaviors, 'modern');
}

function poolsForAge(age: number, count: number): Behavior[][] {
  const pools: Behavior[][] = [];
  for (let i = 0; i < count; i++) {
    pools.push(poolForAge(age));
  }
  return pools;
}

function appearsInAnyPool(pools: Behavior[][], names: string[]): boolean {
  const allNames = new Set(pools.flat().map((b) => b.name));
  return names.some((name) => allNames.has(name));
}

function assertNotContains(pool: Behavior[], names: string[], age: number): void {
  const found = pool.filter((b) => names.includes(b.name));
  assert(
    found.length === 0,
    `年龄 ${age} 不应出现以下行为: ${found.map((b) => b.name).join(', ')}`
  );
}

function assertOnlyCategories(pool: Behavior[], allowed: string[], age: number): void {
  const bad = pool.filter((b) => !allowed.includes(b.category));
  assert(
    bad.length === 0,
    `年龄 ${age} 出现不允许的类别: ${bad.map((b) => `${b.name}(${b.category})`).join(', ')}`
  );
}

function main(): void {
  console.log('=== 年龄合理性测试开始 ===\n');

  const ages = [1, 3, 5, 8, 12, 15, 18, 20, 25, 35, 50, 60, 75, 90, 100];
  for (const age of ages) {
    const pool = poolForAge(age);
    assert(pool.length >= 3, `年龄 ${age} 行为池数量不足: ${pool.length}`);
    assert(
      pool.every((b) => b.minAge <= age && b.maxAge >= age),
      `年龄 ${age} 行为池包含年龄范围不匹配的行为`
    );
  }
  console.log('✓ 所有测试年龄段行为池数量与年龄范围均合法');

  // 1-5 岁：只能有成长/教育/家庭/兴趣/风险/机遇，且不能有成人专属行为
  for (const age of [1, 3, 5]) {
    const pool = poolForAge(age);
    assertOnlyCategories(pool, ['成长', '教育', '家庭', '兴趣', '风险', '机遇'], age);
    assertNotContains(pool, [
      '做饭', '烹饪', '演讲', '演讲比赛', '公开演讲', '买股票', '买房',
      '买黄金', '投资房产', '创业', '工作', '打工', '加班', '求职',
      '结婚', '恋爱', '育儿', '失业', '投资失败', '车祸', '买房',
      '买基金', '储蓄', '兼职'
    ], age);
  }
  console.log('✓ 1-5 岁行为池仅包含幼儿合理类别与行为');

  // 6-12 岁：不应有事业/投资/感情
  for (const age of [6, 8, 12]) {
    const pool = poolForAge(age);
    assertOnlyCategories(pool, ['成长', '教育', '家庭', '兴趣', '社交', '风险', '机遇'], age);
    assertNotContains(pool, [
      '买股票', '买房', '创业', '结婚', '恋爱', '育儿', '失业', '投资失败'
    ], age);
  }
  console.log('✓ 6-12 岁行为池不出现事业/投资/感情类成人行为');

  // 13-18 岁：可以有感情/事业萌芽（兼职）/教育/社交，但不应有高阶投资/婚恋家庭
  for (const age of [13, 15, 18]) {
    const pool = poolForAge(age);
    assertOnlyCategories(
      pool,
      ['成长', '教育', '家庭', '兴趣', '社交', '感情', '事业', '风险', '机遇'],
      age
    );
    assertNotContains(pool, [
      '买股票', '买房', '投资房产', '结婚', '育儿', '创业', '管理团队',
      '上市准备', '客户开发', '资产配置', '遗产规划'
    ], age);
  }
  console.log('✓ 13-18 岁行为池仅出现适龄的感情/事业萌芽行为');

  // 19-30 岁：应有事业/投资/感情/旅行等青年行为
  const youthPools = poolsForAge(25, 20);
  const youthCategories = new Set(youthPools.flat().map((b) => b.category));
  assert(youthCategories.has('事业'), '25 岁应出现事业类行为');
  assert(youthCategories.has('投资'), '25 岁应出现投资类行为');
  assert(youthCategories.has('感情'), '25 岁应出现感情类行为');
  console.log('✓ 19-30 岁行为池开放事业/投资/感情类别');

  // 31-50 岁：应有高阶事业/投资/家庭行为
  const middlePools = poolsForAge(40, 20);
  assert(
    appearsInAnyPool(middlePools, ['管理团队', '商务谈判', '客户开发']),
    '40 岁应出现中高级事业行为'
  );
  assert(
    appearsInAnyPool(middlePools, ['投资房产', '资产配置', '家庭投资']),
    '40 岁应出现中高级投资/家庭行为'
  );
  console.log('✓ 31-50 岁行为池出现中高级事业/投资/家庭行为');

  // 51-70 岁：应有养老/养生/传承相关行为
  const seniorPools = poolsForAge(60, 20);
  assert(
    appearsInAnyPool(seniorPools, ['养生', '退休准备', '康复训练']),
    '60 岁应出现养老/健康类行为'
  );
  console.log('✓ 51-70 岁行为池出现养老/养生相关行为');

  // 71+ 岁：应有晚年专属行为，不应出现高压力事业行为
  for (const age of [75, 90, 100]) {
    const pool = poolForAge(age);
    assertNotContains(pool, [
      '创业', '加班', '求职', '上市准备', '管理团队', '客户开发',
      '结婚', '恋爱', '育儿', '怀孕', '买房'
    ], age);
  }
  const elderlyPools = poolsForAge(80, 20);
  const elderlyNames = new Set(elderlyPools.flat().map((b) => b.name));
  assert(
    elderlyNames.has('旅行养老') || elderlyNames.has('遗产规划') || elderlyNames.has('养生'),
    '80 岁应出现晚年专属行为'
  );
  console.log('✓ 71+ 岁行为池出现晚年专属行为，且不含高压力青年/中年行为');

  // 关键修复验证：1 岁不应出现截图中的不合理行为
  const age1Pool = poolForAge(1);
  assertNotContains(age1Pool, ['做饭', '陪伴父母', '演讲', '房屋漏水'], 1);
  console.log('✓ 1 岁行为池不再出现做饭/演讲/房屋漏水等不合理行为');

  console.log('\n=== 所有年龄合理性测试通过 ===');
}

main();
