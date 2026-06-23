import { Behavior, LogEntry, ResultType } from '../../types';
import { GoalEvaluation, RATING_LABELS } from '../../core/life-goals';
import { getNarrative } from '../../core/narrative';
import { CATEGORY_ICONS } from '../../core/category';

const RESULT_ICONS: Record<ResultType, string> = {
  bigSuccess: '⭐',
  success: '🌟',
  normal: '📌',
  failure: '💥',
  bigFailure: '⚠️',
};

function getCategoryIcon(category: string): string {
  return CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] ?? '📜';
}

function isMajorLog(log: LogEntry): boolean {
  return log.riskLevel >= 8 || log.result === 'bigSuccess' || log.result === 'bigFailure';
}

function getBehaviorIcon(behavior: Behavior | undefined, log: LogEntry): string {
  if (behavior) {
    return getCategoryIcon(behavior.category);
  }
  return RESULT_ICONS[log.result] ?? '📜';
}

function createEvaluationEntry(log: LogEntry): HTMLElement {
  const evaluation = log.goalEvaluation as GoalEvaluation;
  const entry = document.createElement('div');
  entry.className = 'log-entry log-evaluation';

  const icon = document.createElement('div');
  icon.className = 'log-icon';
  icon.textContent = '🏆';

  const body = document.createElement('div');
  body.className = 'log-body';

  const title = document.createElement('div');
  title.className = 'log-title';
  title.textContent = `目标总结：${evaluation.goal.icon} ${evaluation.goal.name} · ${RATING_LABELS[evaluation.rating]}`;

  const score = document.createElement('div');
  score.className = 'log-evaluation-score';
  score.textContent = `综合达成度 ${evaluation.averagePercent}%`;

  const desc = document.createElement('div');
  desc.className = 'log-desc';
  desc.textContent = evaluation.summary;

  body.appendChild(title);
  body.appendChild(score);
  body.appendChild(desc);
  entry.appendChild(icon);
  entry.appendChild(body);

  return entry;
}

function createLogEntry(
  log: LogEntry,
  behavior: Behavior | undefined,
  index: number,
  total: number
): HTMLElement {
  if (log.specialType === 'goal-evaluation') {
    return createEvaluationEntry(log);
  }

  const entry = document.createElement('div');
  entry.className = isMajorLog(log) ? 'log-entry major' : 'log-entry';

  const icon = document.createElement('div');
  icon.className = 'log-icon';
  icon.textContent = getBehaviorIcon(behavior, log);

  const body = document.createElement('div');
  body.className = 'log-body';

  const title = document.createElement('div');
  title.className = 'log-title';

  const narrative = getNarrative(log, behavior);

  title.textContent = narrative.title;

  const desc = document.createElement('div');
  desc.className = 'log-desc';
  const storyText = narrative.story ? `${narrative.story} ` : '';
  desc.textContent = `${storyText}${narrative.outcome}`.trim() || log.events.join('、') || '';

  body.appendChild(title);
  body.appendChild(desc);

  if (log.aiComment) {
    const aiComment = document.createElement('div');
    aiComment.className = 'log-ai-comment';
    aiComment.textContent = `🤖 ${log.aiComment}`;
    body.appendChild(aiComment);
  }

  entry.appendChild(icon);
  entry.appendChild(body);

  return entry;
}

export function renderLogs(
  container: HTMLElement,
  logs: LogEntry[],
  behaviorMap?: Map<string, Behavior>,
  limit: number = 0
): void {
  container.innerHTML = '';

  const total = logs.length;
  const displayLogs = limit > 0 ? logs.slice(-limit) : logs;

  for (let i = 0; i < displayLogs.length; i++) {
    const log = displayLogs[i];
    const behavior = behaviorMap?.get(log.behaviorName);
    container.appendChild(createLogEntry(log, behavior, i, total));
  }

  if (logs.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'log-empty';
    empty.textContent = '人生刚刚开始，等待你书写第一段故事……';
    container.appendChild(empty);
  }
}

export function scrollLogsToBottom(container: HTMLElement): void {
  container.scrollTop = container.scrollHeight;
}
