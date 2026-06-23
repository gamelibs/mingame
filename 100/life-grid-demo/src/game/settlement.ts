import { PlayerState, ResultType } from '../types';
import { createInitialState } from '../core/state';
import { GameRules, DEFAULT_GAME_RULES } from '../core/game-rules';

/**
 * 计算某一年的人生能量值。
 * 对财富取对数归一化，避免数值过大。
 */
export function calcYearEnergy(state: PlayerState): number {
  const wealthScore = Math.log10(Math.max(state.wealth, 1) + 1) * 10;
  return (
    wealthScore * 0.15 +
    state.health * 0.15 +
    state.knowledge * 0.1 +
    state.skill * 0.1 +
    state.social * 0.1 +
    state.happy * 0.15 +
    state.charm * 0.1 +
    state.luck * 0.1
  );
}

/**
 * 根据最终状态生成人生评价。
 * 按优先级依次匹配。
 */
export function evaluateLife(state: PlayerState): string {
  if (state.wealth > 1_000_000 && state.happy > 70) {
    return '富有的一生';
  }
  if (state.social > 80 && state.charm > 70 && state.successChain > 10) {
    return '传奇的一生';
  }
  if (state.lifeBalance > 80 && state.happy > 80) {
    return '幸福的一生';
  }
  if (state.failureChain > 8 || state.happy < 20) {
    return '痛苦的一生';
  }
  if (state.social < 20) {
    return '孤独的一生';
  }
  if (state.successChain > 5 && state.failureChain > 5) {
    return '精彩的一生';
  }
  if (state.wealth < 1000 && state.age > 50) {
    return '贫困的一生';
  }
  return '平凡的一生';
}

function formatWealth(wealth: number): string {
  if (wealth >= 1_000_000) return `${(wealth / 1_000_000).toFixed(2)}M`;
  if (wealth >= 1_000) return `${(wealth / 1_000).toFixed(2)}K`;
  return wealth.toFixed(0);
}

function resultEmoji(result: ResultType): string {
  switch (result) {
    case 'bigSuccess':
      return '🌟';
    case 'success':
      return '✅';
    case 'normal':
      return '➖';
    case 'failure':
      return '❌';
    case 'bigFailure':
      return '💥';
    default:
      return '·';
  }
}

/**
 * 根据历史记录重放，得到每年的能量值。
 * 用于兼容未填充 energyCurve 的状态。
 */
function replayEnergyCurve(state: PlayerState, rules: GameRules): number[] {
  const replayState = createInitialState(rules);
  const curve: number[] = [calcYearEnergy(replayState)];

  for (const record of state.history) {
    const effects = record.effects;
    if (effects.health !== undefined) replayState.health += effects.health;
    if (effects.wealth !== undefined) replayState.wealth += effects.wealth;
    if (effects.knowledge !== undefined) replayState.knowledge += effects.knowledge;
    if (effects.skill !== undefined) replayState.skill += effects.skill;
    if (effects.social !== undefined) replayState.social += effects.social;
    if (effects.happy !== undefined) replayState.happy += effects.happy;
    if (effects.charm !== undefined) replayState.charm += effects.charm;
    if (effects.luck !== undefined) replayState.luck += effects.luck;

    replayState.age = record.age;
    curve.push(calcYearEnergy(replayState));
  }

  return curve;
}

/**
 * 渲染能量曲线：逐年数值列表 + 简单 ASCII 折线。
 * 当数据点过多时进行降采样，保证在普通终端内可阅读。
 */
function renderEnergyCurve(state: PlayerState, rules: GameRules): string {
  const curve = state.energyCurve && state.energyCurve.length > 0
    ? state.energyCurve
    : replayEnergyCurve(state, rules);

  if (curve.length === 0) {
    return '能量曲线：无数据';
  }

  const lines: string[] = [];
  lines.push('📈 能量曲线');

  const max = Math.max(...curve, 1);
  const min = Math.min(...curve, 0);
  const range = Math.max(max - min, 1);
  const height = 8;
  const chartWidth = Math.min(curve.length, 40);
  const step = Math.max(1, Math.ceil(curve.length / chartWidth));

  // 降采样后的图表数据
  const sampled: number[] = [];
  for (let i = 0; i < curve.length; i += step) {
    sampled.push(curve[i]);
  }

  // ASCII 折线图
  for (let h = height; h >= 0; h--) {
    const threshold = min + (range * h) / height;
    let row = `${threshold.toFixed(0).padStart(3)} │`;
    for (const value of sampled) {
      row += value >= threshold ? ' * ' : '   ';
    }
    lines.push(row);
  }

  lines.push('    └' + '───'.repeat(sampled.length));

  // 逐年数值（每 10 年一行）
  for (let i = 0; i < curve.length; i += 10) {
    const ageLabel = `年${(i + 1).toString().padStart(3)}`;
    const values = curve
      .slice(i, i + 10)
      .map((v) => v.toFixed(1).padStart(6))
      .join('');
    lines.push(`${ageLabel}:${values}`);
  }

  return lines.join('\n');
}

/**
 * 渲染人生重要节点（大成功/大失败）。
 */
function renderMilestones(state: PlayerState): string {
  const milestones = state.history.filter(
    (h) => h.result === 'bigSuccess' || h.result === 'bigFailure'
  );

  if (milestones.length === 0) {
    return '人生节点：无重大起伏';
  }

  const lines: string[] = [];
  lines.push('🎬 人生重要节点');
  for (const m of milestones.slice(0, 20)) {
    lines.push(
      `  第 ${m.age.toString().padStart(3)} 年 ${resultEmoji(m.result)} ${m.behaviorName} (${m.result})`
    );
  }
  if (milestones.length > 20) {
    lines.push(`  ... 还有 ${milestones.length - 20} 个节点未显示`);
  }
  return lines.join('\n');
}

/**
 * 渲染结算界面。
 */
export function renderSettlement(state: PlayerState, rules: GameRules = DEFAULT_GAME_RULES): string {
  const lines: string[] = [];

  lines.push('');
  lines.push('╔══════════════════════════════════════════════════╗');
  lines.push('║              🏁 人生选择器 - 最终结算            ║');
  lines.push('╚══════════════════════════════════════════════════╝');
  lines.push('');

  lines.push(`📅 最终年龄：${state.age} 岁`);
  lines.push('');

  lines.push('📊 主要属性');
  lines.push(`  健康：${state.health.toFixed(0).padStart(10)}  财富：${formatWealth(state.wealth).padStart(10)}  知识：${state.knowledge.toFixed(0).padStart(4)}`);
  lines.push(`  技能：${state.skill.toFixed(0).padStart(10)}  幸福：${state.happy.toFixed(0).padStart(10)}  人脉：${state.social.toFixed(0).padStart(4)}`);
  lines.push(`  魅力：${state.charm.toFixed(0).padStart(10)}  运气：${state.luck.toFixed(0).padStart(10)}  平衡：${state.lifeBalance.toFixed(0).padStart(4)}`);
  lines.push(`  成功链：${state.successChain.toString().padStart(8)}  失败链：${state.failureChain.toString().padStart(10)}`);
  lines.push('');

  lines.push(`✨ 人生评价：${evaluateLife(state)}`);
  lines.push('');

  lines.push(renderEnergyCurve(state, rules));
  lines.push('');

  lines.push(renderMilestones(state));
  lines.push('');

  return lines.join('\n');
}
