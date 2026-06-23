import { modernBehaviors } from './data/modern-behaviors';
import { apocalypseBehaviors } from './data/apocalypse-behaviors';
import { gameEvents } from './data/events';
import { ageConfigMap, getAgeConfig } from './data/age-config';
import { getBaseDeathRateByAge } from './data/death-table';
import { Behavior } from './types';

function countByAgeRange(behaviors: Behavior[]): Record<string, number> {
  const ranges = [
    { key: '1-5岁', min: 1, max: 5 },
    { key: '6-12岁', min: 6, max: 12 },
    { key: '13-18岁', min: 13, max: 18 },
    { key: '19-30岁', min: 19, max: 30 },
    { key: '31-50岁', min: 31, max: 50 },
    { key: '51-70岁', min: 51, max: 70 },
    { key: '71岁以上', min: 71, max: 120 }
  ];

  const result: Record<string, number> = {};
  for (const range of ranges) {
    result[range.key] = behaviors.filter(
      b => b.minAge <= range.max && b.maxAge >= range.min
    ).length;
  }
  return result;
}

function main(): void {
  console.log('=== 数据加载测试 ===\n');

  console.log('【现代社会行为库】');
  console.log(`  总数: ${modernBehaviors.length}`);
  const modernAgeCounts = countByAgeRange(modernBehaviors);
  for (const [range, count] of Object.entries(modernAgeCounts)) {
    console.log(`  ${range}: ${count} 个`);
  }

  console.log('\n【末世行为库】');
  console.log(`  总数: ${apocalypseBehaviors.length}`);
  const apocAgeCounts = countByAgeRange(apocalypseBehaviors);
  for (const [range, count] of Object.entries(apocAgeCounts)) {
    console.log(`  ${range}: ${count} 个`);
  }

  console.log('\n【事件库】');
  console.log(`  总数: ${gameEvents.length}`);

  console.log('\n【年龄段配置】');
  for (const [ageKey, config] of Object.entries(ageConfigMap)) {
    console.log(`  ${ageKey}岁组: maxRisk=${config.maxRisk}, baseCount=${config.baseCount}, wealthBonusMax=${config.wealthBonusMax}, unlockThreshold=${config.unlockThreshold}`);
  }

  console.log('\n【死亡率插值测试】');
  const testAges = [1, 5, 15, 30, 45, 70, 85, 100, 110];
  for (const age of testAges) {
    console.log(`  ${age}岁: ${(getBaseDeathRateByAge(age) * 100).toFixed(3)}%`);
  }

  console.log('\n【年龄配置查询测试】');
  const queryAges = [3, 8, 16, 25, 40, 60, 75];
  for (const age of queryAges) {
    const cfg = getAgeConfig(age);
    console.log(`  ${age}岁 -> maxRisk=${cfg.maxRisk}, baseCount=${cfg.baseCount}`);
  }

  // 验收检查
  console.log('\n=== 验收检查 ===');
  let pass = true;

  if (modernBehaviors.length < 60) {
    console.log(`  ❌ 现代行为库不足 60 个，当前 ${modernBehaviors.length}`);
    pass = false;
  } else {
    console.log(`  ✅ 现代行为库 ${modernBehaviors.length} 个`);
  }

  if (apocalypseBehaviors.length < 60) {
    console.log(`  ❌ 末世行为库不足 60 个，当前 ${apocalypseBehaviors.length}`);
    pass = false;
  } else {
    console.log(`  ✅ 末世行为库 ${apocalypseBehaviors.length} 个`);
  }

  const allRanges = Object.keys(modernAgeCounts);
  const modernMissing = allRanges.filter(k => modernAgeCounts[k] === 0);
  const apocMissing = allRanges.filter(k => apocAgeCounts[k] === 0);

  if (modernMissing.length > 0) {
    console.log(`  ❌ 现代行为库缺失年龄段: ${modernMissing.join(', ')}`);
    pass = false;
  } else {
    console.log('  ✅ 现代行为库覆盖所有年龄段');
  }

  if (apocMissing.length > 0) {
    console.log(`  ❌ 末世行为库缺失年龄段: ${apocMissing.join(', ')}`);
    pass = false;
  } else {
    console.log('  ✅ 末世行为库覆盖所有年龄段');
  }

  if (gameEvents.length < 30) {
    console.log(`  ❌ 事件库不足 30 个，当前 ${gameEvents.length}`);
    pass = false;
  } else {
    console.log(`  ✅ 事件库 ${gameEvents.length} 个`);
  }

  console.log(pass ? '\n🎉 所有验收项通过' : '\n⚠️ 部分验收项未通过');
  process.exit(pass ? 0 : 1);
}

main();
