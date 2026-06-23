import * as fs from 'fs';
import * as path from 'path';
import { DEFAULT_GAME_RULES } from '../src/core/game-rules';
import { modernBehaviors } from '../src/data/modern-behaviors';
import { apocalypseBehaviors } from '../src/data/apocalypse-behaviors';
import { gameEvents } from '../src/data/events';
import { ageConfigMap } from '../src/data/age-config';
import { baseDeathRateByAge } from '../src/data/death-table';

const backup = {
  meta: {
    generatedAt: new Date().toISOString(),
    version: '1.0.0',
    description: '当前行为数据与动态配置参数备份，用于对比不同配置下的真实反馈',
  },
  gameRules: DEFAULT_GAME_RULES,
  staticData: {
    modernBehaviors,
    apocalypseBehaviors,
    events: gameEvents,
    ageConfig: ageConfigMap,
    baseDeathRateByAge,
  },
  stats: {
    modernBehaviorCount: modernBehaviors.length,
    apocalypseBehaviorCount: apocalypseBehaviors.length,
    eventCount: gameEvents.length,
    ageGroupCount: Object.keys(ageConfigMap).length,
    deathRateSampleCount: Object.keys(baseDeathRateByAge).length,
  },
};

const outPath = path.resolve(__dirname, '../data.json.bak');
fs.writeFileSync(outPath, JSON.stringify(backup, null, 2), 'utf-8');

console.log(`✅ 数据备份已生成: ${outPath}`);
console.log(`   现代行为: ${backup.stats.modernBehaviorCount} 个`);
console.log(`   末世行为: ${backup.stats.apocalypseBehaviorCount} 个`);
console.log(`   事件: ${backup.stats.eventCount} 个`);
console.log(`   年龄段: ${backup.stats.ageGroupCount} 组`);
console.log(`   死亡率采样点: ${backup.stats.deathRateSampleCount} 个`);
console.log(`   规则模块数: ${Object.keys(DEFAULT_GAME_RULES).length} 个`);
