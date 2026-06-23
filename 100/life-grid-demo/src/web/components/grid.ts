import { Behavior } from '../../types';
import { CATEGORY_ORDER, CATEGORY_ICONS, CATEGORY_COLORS } from '../../core/category';

const SIZE = 10;
const cellBehaviorMap = new WeakMap<HTMLElement, Behavior>();

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '');
  if (clean.length !== 3 && clean.length !== 6) return null;
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const num = parseInt(full, 16);
  if (isNaN(num)) return null;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function getRiskClass(riskLevel: number): string {
  if (riskLevel <= 3) return 'risk-low';
  if (riskLevel <= 6) return 'risk-mid';
  if (riskLevel <= 8) return 'risk-high';
  return 'risk-extreme';
}

function getCategoryStyle(category: string): { background: string; border: string } {
  const color = CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] ?? '#95a5a6';
  const rgb = hexToRgb(color);
  if (!rgb) return { background: 'rgba(149, 165, 166, 0.12)', border: color };
  return {
    background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`,
    border: color,
  };
}

function formatCellName(name: string): string {
  const chars = Array.from(name);
  const end = Math.min(4, Math.max(2, chars.length));
  return chars.slice(0, end).join('');
}

export function renderGrid(
  container: HTMLElement,
  grid: (Behavior | null)[][]
): void {
  container.innerHTML = '';
  container.className = 'grid';

  // 从 n10 到 n1 渲染，使 n10 在上方，n1 在下方
  for (let visualY = SIZE; visualY >= 1; visualY--) {
    for (let x = 1; x <= SIZE; x++) {
      const behavior = grid[visualY - 1]?.[x - 1] ?? null;
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      cell.dataset.x = String(x);
      cell.dataset.y = String(visualY);

      if (!behavior) {
        cell.classList.add('empty');
        cell.title = `${CATEGORY_ORDER[x - 1]} · 风险 ${visualY}：空`;
      } else {
        const style = getCategoryStyle(behavior.category);
        cell.style.backgroundColor = style.background;
        cell.style.borderColor = style.border;
        cell.textContent = formatCellName(behavior.name);
        cell.title = `${behavior.name} · ${behavior.category} · 风险 ${behavior.riskLevel}`;
        cellBehaviorMap.set(cell, behavior);
      }

      container.appendChild(cell);
    }
  }

  // 底部类别横轴
  const axis = document.createElement('div');
  axis.className = 'grid-axis';
  for (let x = 1; x <= SIZE; x++) {
    const label = document.createElement('div');
    label.className = 'axis-label';
    const category = CATEGORY_ORDER[x - 1];
    label.textContent = `${CATEGORY_ICONS[category]}${category}`;
    label.title = category;
    axis.appendChild(label);
  }
  container.appendChild(axis);
}

const PAGE_SIZE = 100;

export function renderShowcaseGrid(
  container: HTMLElement,
  behaviors: Behavior[],
  page: number
): void {
  const totalPages = Math.max(1, Math.ceil(behaviors.length / PAGE_SIZE));
  const safePage = Math.max(0, Math.min(page, totalPages - 1));
  const start = safePage * PAGE_SIZE;
  const pageBehaviors = behaviors.slice(start, start + PAGE_SIZE);

  const grid: (Behavior | null)[][] = Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => null)
  );

  for (let i = 0; i < pageBehaviors.length; i++) {
    const row = Math.floor(i / SIZE);
    const col = i % SIZE;
    if (row < SIZE) {
      grid[row][col] = pageBehaviors[i];
    }
  }

  renderGrid(container, grid);
}

export function renderShowcasePagination(
  container: HTMLElement,
  behaviors: Behavior[],
  page: number,
  onPageChange: (page: number) => void
): void {
  const totalPages = Math.max(1, Math.ceil(behaviors.length / PAGE_SIZE));
  if (totalPages <= 1) return;

  const safePage = Math.max(0, Math.min(page, totalPages - 1));

  const pagination = document.createElement('div');
  pagination.className = 'showcase-pagination';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'seal-btn secondary';
  prevBtn.textContent = '上一页';
  prevBtn.disabled = safePage === 0;
  prevBtn.addEventListener('click', () => onPageChange(safePage - 1));

  const info = document.createElement('span');
  info.className = 'showcase-page-info';
  info.textContent = `第 ${safePage + 1} / ${totalPages} 页`;

  const nextBtn = document.createElement('button');
  nextBtn.className = 'seal-btn secondary';
  nextBtn.textContent = '下一页';
  nextBtn.disabled = safePage >= totalPages - 1;
  nextBtn.addEventListener('click', () => onPageChange(safePage + 1));

  pagination.appendChild(prevBtn);
  pagination.appendChild(info);
  pagination.appendChild(nextBtn);
  container.appendChild(pagination);
}

export function renderRiskGrid(
  container: HTMLElement,
  behaviors: Behavior[],
  offsets: Record<number, number>,
  onMore: (riskLevel: number) => void
): void {
  container.innerHTML = '';
  container.className = 'risk-grid';

  const groups = new Map<number, Behavior[]>();
  for (let r = 1; r <= SIZE; r++) groups.set(r, []);
  for (const b of behaviors) {
    const r = Math.max(1, Math.min(SIZE, b.riskLevel));
    groups.get(r)!.push(b);
  }

  // 从 n10 到 n1 渲染，使 n10 在上方，n1 在下方
  for (let risk = SIZE; risk >= 1; risk--) {
    const list = groups.get(risk)!;
    const offset = offsets[risk] ?? 0;
    const total = list.length;

    const row = document.createElement('div');
    row.className = 'risk-row';

    const label = document.createElement('div');
    label.className = 'risk-label';
    label.textContent = `n${risk}`;

    const cells = document.createElement('div');
    cells.className = 'risk-cells';

    const pageSize = total <= SIZE ? SIZE : SIZE - 1;
    const pageItems = list.slice(offset, offset + pageSize);

    for (const b of pageItems) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell risk-cell';
      const style = getCategoryStyle(b.category);
      cell.style.backgroundColor = style.background;
      cell.style.borderColor = style.border;
      cell.textContent = formatCellName(b.name);
      cell.title = `${b.name} · ${b.category} · 风险 ${b.riskLevel}`;
      cellBehaviorMap.set(cell, b);
      cells.appendChild(cell);
    }

    const displayed = pageItems.length;
    const hasMore = total > SIZE;
    const emptySlots = SIZE - displayed - (hasMore ? 1 : 0);
    for (let i = 0; i < emptySlots; i++) {
      const empty = document.createElement('div');
      empty.className = 'grid-cell risk-cell empty';
      cells.appendChild(empty);
    }

    if (hasMore) {
      const more = document.createElement('button');
      more.className = 'grid-cell risk-more';
      more.textContent = `>更多 (${total})`;
      more.title = '切换显示本风险等级的更多行为';
      more.addEventListener('click', () => onMore(risk));
      cells.appendChild(more);
    }

    row.appendChild(label);
    row.appendChild(cells);
    container.appendChild(row);
  }
}

export function renderMiniGrid(
  container: HTMLElement,
  grid: (Behavior | null)[][]
): void {
  container.innerHTML = '';

  // 从 n10 到 n1 渲染，使 n10 在上方，n1 在下方
  for (let visualY = SIZE; visualY >= 1; visualY--) {
    for (let x = 1; x <= SIZE; x++) {
      const behavior = grid[visualY - 1]?.[x - 1] ?? null;
      const cell = document.createElement('div');
      cell.className = 'mini-cell';
      cell.dataset.x = String(x);
      cell.dataset.y = String(visualY);

      if (!behavior) {
        cell.classList.add('empty');
        cell.title = `${CATEGORY_ORDER[x - 1]} · 风险 ${visualY}：空`;
      } else {
        const style = getCategoryStyle(behavior.category);
        cell.style.backgroundColor = style.background;
        cell.style.borderColor = style.border;
        cell.textContent = formatCellName(behavior.name);
        cell.title = `${behavior.name} · ${behavior.category} · 风险 ${behavior.riskLevel}`;
        cellBehaviorMap.set(cell, behavior);
      }

      container.appendChild(cell);
    }
  }
}

export function bindGridClick(
  container: HTMLElement,
  onCellClick: (x: number, y: number, behavior: Behavior | null) => void
): void {
  container.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const cell = target.closest('.grid-cell, .mini-cell') as HTMLElement | null;
    if (!cell) return;

    const x = Number(cell.dataset.x);
    const y = Number(cell.dataset.y);
    if (!x || !y) return;

    const behavior = cellBehaviorMap.get(cell) ?? null;
    onCellClick(x, y, behavior);
  });
}

export function renderBoardLegend(container: HTMLElement): void {
  container.innerHTML = '';
  container.className = 'board-legend';

  for (const category of CATEGORY_ORDER) {
    const el = document.createElement('div');
    el.className = 'legend-item';

    const dot = document.createElement('span');
    dot.className = 'legend-dot';
    dot.style.backgroundColor = CATEGORY_COLORS[category];

    const icon = document.createElement('span');
    icon.className = 'legend-icon';
    icon.textContent = CATEGORY_ICONS[category];

    const label = document.createElement('span');
    label.textContent = category;

    el.appendChild(dot);
    el.appendChild(icon);
    el.appendChild(label);
    container.appendChild(el);
  }
}
