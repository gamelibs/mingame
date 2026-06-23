import { ChoiceRecord, PlayerState } from '../../types';

interface AchievementDef {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
}

export function renderAchievements(
  container: HTMLElement,
  state: PlayerState,
  history: ChoiceRecord[]
): void {
  container.innerHTML = '';

  const defs = computeAchievements(state, history);

  for (const def of defs) {
    const badge = document.createElement('span');
    badge.className = def.unlocked ? 'achievement' : 'achievement locked';
    badge.textContent = `${def.icon} ${def.name}`;
    badge.title = def.unlocked ? '已解锁' : '未解锁';
    container.appendChild(badge);
  }
}

function computeAchievements(state: PlayerState, history: ChoiceRecord[]): AchievementDef[] {
  const behaviorNames = history.map((h) => h.behaviorName);
  const hasBehavior = (keywords: string[]) =>
    history.some((h) => keywords.some((kw) => h.behaviorName.includes(kw)));

  return [
    {
      id: 'millionaire',
      name: '百万富翁',
      icon: '💰',
      unlocked: state.wealth > 1000000,
    },
    {
      id: 'entrepreneur',
      name: '创业者',
      icon: '🚀',
      unlocked: hasBehavior(['创业', '开公司']),
    },
    {
      id: 'first-love',
      name: '初恋',
      icon: '💕',
      unlocked: hasBehavior(['恋爱', '表白']),
    },
    {
      id: 'happy-life',
      name: '人生赢家',
      icon: '🏠',
      unlocked: state.happy > 80,
    },
    {
      id: 'long-life',
      name: '健康长寿',
      icon: '🍑',
      unlocked: state.health > 80 && state.age > 70,
    },
    {
      id: 'legendary',
      name: '传奇人生',
      icon: '👑',
      unlocked: state.successChain > 10,
    },
    {
      id: 'survivor',
      name: '历经磨难',
      icon: '⚔️',
      unlocked: state.failureChain > 5,
    },
    {
      id: 'scholar',
      name: '学富五车',
      icon: '📚',
      unlocked: state.knowledge > 80,
    },
    {
      id: 'celebrity',
      name: '社会名流',
      icon: '⭐',
      unlocked: state.social > 80 && state.charm > 80,
    },
  ];
}
