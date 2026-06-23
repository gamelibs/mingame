import { Behavior, PlayerState } from '../types';
import { renderGrid } from './grid';

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

function formatStat(label: string, value: number): string {
  return `${label}: ${Math.round(value).toString().padStart(4, ' ')}`;
}

function boxLine(content: string, width: number): string {
  const innerWidth = width - 2;
  return `│${padDisplay(content, innerWidth)}│`;
}

function renderStatsPanel(state: PlayerState): string {
  const width = 62;
  const top = `┌${'─'.repeat(width - 2)}┐`;
  const bottom = `└${'─'.repeat(width - 2)}┘`;

  const lines = [
    boxLine(
      `${formatStat('年龄', state.age)}  ${formatStat('健康', state.health)}  ${formatStat('财富', state.wealth)}  ${formatStat('知识', state.knowledge)}`,
      width
    ),
    boxLine(
      `${formatStat('技能', state.skill)}  ${formatStat('幸福', state.happy)}  ${formatStat('人脉', state.social)}  ${formatStat('魅力', state.charm)}`,
      width
    ),
    boxLine(
      `${formatStat('运势', state.luck)}  ${formatStat('平衡度', state.lifeBalance)}  ${formatStat('成功链', state.successChain)}  ${formatStat('失败链', state.failureChain)}`,
      width
    )
  ];

  return [top, ...lines, bottom].join('\n');
}

/**
 * 渲染完整游戏界面。
 */
export function renderGameScreen(
  state: PlayerState,
  grid: (Behavior | null)[][]
): string {
  const lines: string[] = [];

  lines.push('');
  lines.push(`╔══════════════════════════════════════╗`);
  lines.push(`║     人生选择器 - 第 ${state.age.toString().padStart(3, ' ')} 年     ║`);
  lines.push(`╚══════════════════════════════════════╝`);
  lines.push('');
  lines.push(renderStatsPanel(state));
  lines.push('');
  lines.push(renderGrid(grid));
  lines.push('');
  lines.push('操作提示：输入 "l<列号>n<行号>" 或 "x,y" 选择行为');
  lines.push('          例如：l3n2  或  3,2');

  return lines.join('\n');
}
