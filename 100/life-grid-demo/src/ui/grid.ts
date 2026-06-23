import { Behavior } from '../types';
import { shuffle } from '../core/utils';
import { CATEGORY_ORDER, getCategoryIndex } from '../core/category';

const GRID_SIZE = 10;

function cjkCount(text: string): number {
  let count = 0;
  for (const char of text) {
    const code = char.codePointAt(0) || 0;
    if (code >= 0x4e00 && code <= 0x9fff) count += 1;
  }
  return count;
}

function displayWidth(text: string): number {
  return text.length + cjkCount(text);
}

function truncateToDisplayWidth(text: string, maxWidth: number): string {
  let result = '';
  let width = 0;
  for (const char of text) {
    const charWidth = displayWidth(char);
    if (width + charWidth > maxWidth) break;
    result += char;
    width += charWidth;
  }
  return result;
}

function padDisplay(text: string, width: number): string {
  return text.padEnd(width - cjkCount(text), ' ');
}

/**
 * 把行为池映射到 10x10 网格中。
 * - 列索引 0~9 对应 10 大人生事件类别（成长、教育、事业、投资、感情、家庭、社交、兴趣、风险、机遇）
 * - 行索引 0~9 对应风险等级 1~10（row 0 = n1 最低风险，row 9 = n10 最高风险）
 * - 同一（类别，风险）格中若存在多个行为，随机挑选一个展示
 * - 空位用 null
 */
export function mapBehaviorsToGrid(behaviors: Behavior[]): (Behavior | null)[][] {
  const grid: (Behavior | null)[][] = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => null)
  );

  // 按 (列, 行) 聚合候选行为
  const buckets = new Map<string, Behavior[]>();
  for (const b of behaviors) {
    const col = getCategoryIndex(b.category) - 1;
    const row = Math.max(0, Math.min(GRID_SIZE - 1, b.riskLevel - 1));
    const key = `${col},${row}`;
    const list = buckets.get(key) || [];
    list.push(b);
    buckets.set(key, list);
  }

  for (let col = 0; col < GRID_SIZE; col++) {
    for (let row = 0; row < GRID_SIZE; row++) {
      const list = buckets.get(`${col},${row}`);
      if (list && list.length > 0) {
        grid[row][col] = shuffle(list)[0];
      }
    }
  }

  return grid;
}

const CELL_DISPLAY_WIDTH = 4;

function formatCell(content: string): string {
  const visible = truncateToDisplayWidth(content, CELL_DISPLAY_WIDTH);
  return padDisplay(visible, CELL_DISPLAY_WIDTH);
}

function formatEmptyCell(): string {
  return padDisplay('·', CELL_DISPLAY_WIDTH);
}

/**
 * 渲染网格为字符串。
 * 视觉上 n10 在最上方，n1 在最下方；底部横轴为 10 大类别。
 */
export function renderGrid(grid: (Behavior | null)[][]): string {
  const lines: string[] = [];

  for (let visualRow = GRID_SIZE - 1; visualRow >= 0; visualRow--) {
    const riskLabel = `n${visualRow + 1}`.padStart(3, ' ');
    const cells = grid[visualRow].map((b) =>
      b ? formatCell(b.name) : formatEmptyCell()
    );
    lines.push(`${riskLabel} | ${cells.join(' ')}`);
  }

  lines.push('    +-----------------------------------');
  const colLabels = Array.from({ length: GRID_SIZE }, (_, i) =>
    `c${i + 1}`.padStart(3, ' ')
  );
  lines.push(`      ${colLabels.join(' ')}`);

  const axisLabels = CATEGORY_ORDER.map((name) =>
    padDisplay(truncateToDisplayWidth(name, 4), 4)
  );
  lines.push(`      ${axisLabels.join(' ')}`);

  return lines.join('\n');
}

/**
 * 根据 1-based 坐标 (x=类别列, y=风险行) 从网格中取得行为。
 */
export function getBehaviorAt(
  grid: (Behavior | null)[][],
  x: number,
  y: number
): Behavior | null {
  if (x < 1 || x > GRID_SIZE || y < 1 || y > GRID_SIZE) return null;
  return grid[y - 1][x - 1];
}
