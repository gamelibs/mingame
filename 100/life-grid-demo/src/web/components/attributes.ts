import { EffectSnapshot, PlayerState } from '../../types';

interface AttributeDef {
  key: keyof PlayerState;
  label: string;
  icon: string;
  colorClass: string;
}

const ATTRIBUTES: AttributeDef[] = [
  { key: 'health', label: '健康', icon: '❤️', colorClass: 'health' },
  { key: 'wealth', label: '财富', icon: '💰', colorClass: 'wealth' },
  { key: 'knowledge', label: '知识', icon: '📖', colorClass: 'knowledge' },
  { key: 'skill', label: '技能', icon: '🔧', colorClass: 'skill' },
  { key: 'happy', label: '幸福', icon: '😊', colorClass: 'happy' },
  { key: 'social', label: '人脉', icon: '👥', colorClass: 'social' },
  { key: 'charm', label: '魅力', icon: '⭐', colorClass: 'charm' },
  { key: 'luck', label: '运势', icon: '🍀', colorClass: 'luck' },
];

function clamp100(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function formatValue(value: number): string {
  return `${Math.round(value)}`;
}

function formatDelta(key: keyof PlayerState, value: number): string {
  if (key === 'wealth') {
    const abs = Math.abs(value);
    let num: string;
    if (abs >= 1000000) num = `${(value / 1000000).toFixed(1)}M`;
    else if (abs >= 1000) num = `${(value / 1000).toFixed(1)}k`;
    else num = `${Math.round(value)}`;
    return `${value > 0 ? '+' : ''}${num}`;
  }
  return `${value > 0 ? '+' : ''}${Math.round(value)}`;
}

function createAttributeItem(
  def: AttributeDef,
  state: PlayerState,
  delta?: number
): HTMLElement {
  const item = document.createElement('div');
  item.className = 'attr-item';

  const header = document.createElement('div');
  header.className = 'attr-header';

  const icon = document.createElement('span');
  icon.className = 'attr-icon';
  icon.textContent = def.icon;

  const name = document.createElement('span');
  name.className = 'attr-name';
  name.textContent = def.label;

  const valueGroup = document.createElement('div');
  valueGroup.className = 'attr-value-group';

  const valueEl = document.createElement('span');
  valueEl.className = 'attr-value';
  const rawValue = state[def.key] as number;
  valueEl.textContent = def.key === 'wealth' ? formatValue(rawValue) : `${formatValue(rawValue)}/100`;

  valueGroup.appendChild(valueEl);

  if (delta !== undefined && Math.abs(delta) >= 0.5) {
    const deltaEl = document.createElement('span');
    deltaEl.className = `attr-delta ${delta > 0 ? 'positive' : 'negative'}`;
    deltaEl.textContent = formatDelta(def.key, delta);
    deltaEl.title = `较去年变化：${formatDelta(def.key, delta)}`;
    valueGroup.appendChild(deltaEl);
  }

  header.appendChild(icon);
  header.appendChild(name);
  header.appendChild(valueGroup);

  const bar = document.createElement('div');
  bar.className = 'attr-bar';

  const fill = document.createElement('div');
  fill.className = `attr-fill ${def.colorClass}`;
  fill.style.width = `${clamp100(def.key === 'wealth' ? Math.min(rawValue, 100) : rawValue)}%`;

  bar.appendChild(fill);
  item.appendChild(header);
  item.appendChild(bar);

  return item;
}

export interface AttributeSummary {
  deltas: EffectSnapshot;
  text: string;
}

export function renderAttributes(
  container: HTMLElement,
  state: PlayerState,
  summary?: AttributeSummary | null
): void {
  container.innerHTML = '';

  const deltas = summary?.deltas ?? {};
  for (const def of ATTRIBUTES) {
    const delta = (deltas[def.key as keyof EffectSnapshot] as number | undefined);
    container.appendChild(createAttributeItem(def, state, delta));
  }

  if (summary?.text) {
    const summaryEl = document.createElement('div');
    summaryEl.className = 'attr-summary';
    summaryEl.textContent = summary.text;
    container.appendChild(summaryEl);
  }
}
