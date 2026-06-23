import { Behavior, PlayerState } from '../types';

function cjkCount(text: string): number {
  let count = 0;
  for (const char of text) {
    const code = char.codePointAt(0) || 0;
    if (code >= 0x4e00 && code <= 0x9fff) count += 1;
  }
  return count;
}

function padDisplay(text: string, width: number): string {
  return text.padEnd(width - cjkCount(text), ' ');
}

/**
 * 渲染行为详情弹窗。
 */
export function renderBehaviorModal(
  behavior: Behavior,
  _state: PlayerState
): string {
  const lines: string[] = [];

  lines.push('');
  lines.push('┌─────────────────────────────────────────┐');
  lines.push(`│ 行为：${padDisplay(behavior.name, 32)}│`);
  lines.push('├─────────────────────────────────────────┤');
  lines.push(`│ 类型：${padDisplay(behavior.category, 32)}│`);
  lines.push(`│ 风险等级：n${padDisplay(behavior.riskLevel.toString(), 30)}│`);
  lines.push(`│ 收益等级：${padDisplay(behavior.rewardLevel.toString(), 30)}│`);
  lines.push(`│ 失败等级：${padDisplay(behavior.failureLevel.toString(), 30)}│`);
  lines.push(`│ 平衡影响：${padDisplay((behavior.balanceEffect > 0 ? '+' : '').concat(String(behavior.balanceEffect)), 30)}│`);
  lines.push('├─────────────────────────────────────────┤');

  const descLines = splitDescription(behavior.description, 34);
  for (const descLine of descLines) {
    lines.push(`│ ${padDisplay(descLine, 39)}│`);
  }

  lines.push('├─────────────────────────────────────────┤');
  lines.push(`│ 标签：${padDisplay(behavior.tags.join('、').slice(0, 32), 32)}│`);
  lines.push('├─────────────────────────────────────────┤');
  lines.push('│ 倒计时：请在 5 秒内确认执行（模拟）     │');
  lines.push('└─────────────────────────────────────────┘');

  return lines.join('\n');
}

function splitDescription(text: string, maxWidth: number): string[] {
  const results: string[] = [];
  let current = '';

  for (const char of text) {
    if (current.length >= maxWidth) {
      results.push(current);
      current = char;
    } else {
      current += char;
    }
  }

  if (current.length > 0) {
    results.push(current);
  }

  return results.length > 0 ? results : [''];
}
