import { Behavior, EffectSnapshot, PlayerState, ResultType } from '../../types';
import type { NarrativeBundle } from '../../core/narrative';

export function renderEventCard(
  container: HTMLElement,
  state: PlayerState,
  behavior: Behavior,
  successRate: number,
  onExecute: () => void,
  onSkip: () => void
): void {
  container.innerHTML = '';
  container.className = isMajorEvent(behavior) ? 'event-card major' : 'event-card';

  const title = document.createElement('div');
  title.className = 'event-title';
  title.textContent = `${state.age} 岁 · ${behavior.name}`;
  container.appendChild(title);

  const story = document.createElement('div');
  story.className = 'event-story';
  const narrative = behavior.narrative;
  story.textContent = narrative ? narrative.story : behavior.description;
  container.appendChild(story);

  const rate = document.createElement('div');
  rate.className = 'success-rate';
  rate.textContent = `成功率：${successRate}%`;
  container.appendChild(rate);

  const actions = document.createElement('div');
  actions.className = 'event-actions';

  const executeBtn = document.createElement('button');
  executeBtn.className = 'seal-btn';
  executeBtn.textContent = '执行此选择';
  executeBtn.addEventListener('click', onExecute);
  actions.appendChild(executeBtn);

  const skipBtn = document.createElement('button');
  skipBtn.className = 'seal-btn secondary';
  skipBtn.textContent = '放弃';
  skipBtn.addEventListener('click', onSkip);
  actions.appendChild(skipBtn);

  container.appendChild(actions);
}

export function renderEventOutcome(
  container: HTMLElement,
  behavior: Behavior,
  result: ResultType,
  narrative: NarrativeBundle,
  effects: EffectSnapshot
): void {
  container.innerHTML = '';
  container.classList.remove('hidden');

  const title = document.createElement('div');
  title.className = 'outcome-title';
  title.textContent = narrative.title;
  container.appendChild(title);

  const story = document.createElement('div');
  story.className = 'outcome-story';
  story.textContent = narrative.outcome;
  container.appendChild(story);

  const effectsEl = document.createElement('div');
  effectsEl.className = 'outcome-effects';
  effectsEl.textContent = formatEffects(effects);
  container.appendChild(effectsEl);
}

export function renderEmptyEventCard(container: HTMLElement): void {
  container.innerHTML = '';
  container.className = 'event-card';

  const empty = document.createElement('div');
  empty.className = 'event-empty';
  empty.textContent = '当前没有可选事件，人生或许需要一点运气……';
  container.appendChild(empty);
}

function formatEffects(effects: EffectSnapshot): string {
  const entries = Object.entries(effects).filter(([, value]) => value !== undefined && value !== 0);
  if (entries.length === 0) return '没有明显变化。';

  const labels: Record<string, string> = {
    health: '健康',
    wealth: '财富',
    knowledge: '知识',
    skill: '技能',
    social: '人脉',
    happy: '幸福',
    charm: '魅力',
    luck: '运势',
  };

  return '属性变化：' + entries
    .map(([key, value]) => `${labels[key] ?? key} ${value && value > 0 ? '+' : ''}${value}`)
    .join('，') + '。';
}

export function isMajorEvent(behavior: Behavior): boolean {
  if (behavior.tags.includes('重大')) return true;
  const majorCategories = ['事业', '投资', '感情', '家庭', '风险', '机遇'];
  if (majorCategories.some((c) => behavior.category.includes(c) || behavior.tags.includes(c))) {
    return true;
  }
  return behavior.riskLevel >= 8;
}


