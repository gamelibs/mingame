import { GoalEvaluation, RATING_LABELS, ATTR_LABELS } from '../../core/life-goals';

const RATING_CLASS: Record<GoalEvaluation['rating'], string> = {
  unfulfilled: 'rating-unfulfilled',
  bronze: 'rating-bronze',
  silver: 'rating-silver',
  gold: 'rating-gold',
  legend: 'rating-legend',
};

export function renderLifeGoalEvaluation(container: HTMLElement, evaluation: GoalEvaluation): void {
  container.innerHTML = '';
  container.className = 'life-goal-evaluation';

  const header = document.createElement('div');
  header.className = 'evaluation-header';

  const title = document.createElement('h3');
  title.textContent = `目标评价：${evaluation.goal.icon} ${evaluation.goal.name}`;

  const difficulty = document.createElement('span');
  difficulty.className = `goal-difficulty difficulty-${evaluation.goal.difficulty}`;
  difficulty.textContent = evaluation.goal.difficulty === 'low' ? '简单' : '困难';

  header.appendChild(title);
  header.appendChild(difficulty);

  const badge = document.createElement('div');
  badge.className = `rating-badge ${RATING_CLASS[evaluation.rating]}`;
  badge.textContent = evaluation.ratingLabel;

  const scoreRow = document.createElement('div');
  scoreRow.className = 'evaluation-score';
  scoreRow.textContent = `综合达成度 ${evaluation.averagePercent}%`;

  const summary = document.createElement('p');
  summary.className = 'evaluation-summary';
  summary.textContent = evaluation.summary;

  const list = document.createElement('div');
  list.className = 'evaluation-targets';

  for (const target of evaluation.targets) {
    const row = document.createElement('div');
    row.className = 'evaluation-target-row';

    const label = document.createElement('span');
    label.className = 'target-label';
    label.textContent = target.label;

    const barWrap = document.createElement('div');
    barWrap.className = 'target-bar-wrap';

    const bar = document.createElement('div');
    bar.className = 'target-bar';
    bar.style.width = `${target.percent}%`;
    if (target.reached) bar.classList.add('reached');

    barWrap.appendChild(bar);

    const value = document.createElement('span');
    value.className = 'target-value';
    const displayActual =
      target.attr === 'wealth' ? target.actual.toLocaleString() : target.actual;
    const displayTarget =
      target.attr === 'wealth' ? target.target.toLocaleString() : target.target;
    value.textContent = `${displayActual} / ${displayTarget} (${target.percent}%)`;

    row.appendChild(label);
    row.appendChild(barWrap);
    row.appendChild(value);
    list.appendChild(row);
  }

  const footer = document.createElement('p');
  footer.className = 'evaluation-hint';
  footer.textContent = '点击「重新开始」可以再次挑战，或尝试选择其它人生目标。';

  container.appendChild(header);
  container.appendChild(badge);
  container.appendChild(scoreRow);
  container.appendChild(summary);
  container.appendChild(list);
  container.appendChild(footer);
}
