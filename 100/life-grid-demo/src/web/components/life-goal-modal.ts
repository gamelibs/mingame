import { LifeGoal, LIFE_GOALS, LifeGoalAttribute } from '../../core/life-goals';

const ATTR_LABELS: Record<LifeGoalAttribute, string> = {
  health: '健康',
  wealth: '财富',
  knowledge: '知识',
  skill: '技能',
  social: '人脉',
  happy: '幸福',
  charm: '魅力',
  luck: '运势',
};

function renderBonusTags(bonuses: LifeGoal['bonuses']): HTMLElement {
  const tags = document.createElement('div');
  tags.className = 'life-goal-bonus-list';

  const entries = Object.entries(bonuses).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0));
  for (const [attr, value] of entries) {
    if (value === undefined) continue;
    const tag = document.createElement('span');
    tag.className = 'life-goal-bonus';
    tag.textContent = `${ATTR_LABELS[attr as LifeGoalAttribute]} +${value}`;
    tags.appendChild(tag);
  }

  return tags;
}

export function renderLifeGoalOptions(
  container: HTMLElement,
  onSelect: (goal: LifeGoal) => void
): void {
  container.innerHTML = '';

  for (const goal of LIFE_GOALS) {
    const card = document.createElement('div');
    card.className = 'life-goal-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');

    const header = document.createElement('div');
    header.className = 'life-goal-card-header';

    const icon = document.createElement('span');
    icon.className = 'life-goal-icon';
    icon.textContent = goal.icon;

    const title = document.createElement('h3');
    title.className = 'life-goal-name';
    title.textContent = goal.name;

    header.appendChild(icon);
    header.appendChild(title);

    const desc = document.createElement('p');
    desc.className = 'life-goal-description';
    desc.textContent = goal.description;

    const bonuses = renderBonusTags(goal.bonuses);

    card.appendChild(header);
    card.appendChild(desc);
    card.appendChild(bonuses);

    card.addEventListener('click', () => onSelect(goal));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onSelect(goal);
      }
    });

    container.appendChild(card);
  }
}

export function renderLifeGoalModal(
  container: HTMLElement,
  onSelect: (goal: LifeGoal) => void,
  onRandom?: () => void
): void {
  container.innerHTML = '';
  container.className = 'life-goal-modal-body';

  const header = document.createElement('div');
  header.className = 'life-goal-modal-header';

  const title = document.createElement('h2');
  title.textContent = '选择你的人生目标';

  const hint = document.createElement('p');
  hint.className = 'life-goal-hint';
  hint.textContent = '不同目标会给予不同的初始属性加成，影响你这一生的 Build 方向。';

  header.appendChild(title);
  header.appendChild(hint);

  const options = document.createElement('div');
  options.className = 'life-goal-options';
  renderLifeGoalOptions(options, onSelect);

  const footer = document.createElement('div');
  footer.className = 'life-goal-modal-footer';

  if (onRandom) {
    const randomBtn = document.createElement('button');
    randomBtn.className = 'seal-btn secondary';
    randomBtn.textContent = '🎲 随机选择';
    randomBtn.addEventListener('click', onRandom);
    footer.appendChild(randomBtn);
  }

  container.appendChild(header);
  container.appendChild(options);
  container.appendChild(footer);
}
