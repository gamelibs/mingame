import { ChoiceRecord } from '../../types';

const RESULT_LABELS: Record<ChoiceRecord['result'], string> = {
  bigSuccess: '大成功',
  success: '成功',
  normal: '普通',
  failure: '失败',
  bigFailure: '大失败',
};

export function renderLifeMap(container: HTMLElement, history: ChoiceRecord[]): void {
  container.innerHTML = '';

  if (history.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'event-empty';
    empty.textContent = '人生地图尚未展开，等待你的第一个选择。';
    container.appendChild(empty);
    return;
  }

  for (let i = 0; i < history.length; i++) {
    const record = history[i];
    const isMajor = record.y >= 8 || isMajorResult(record.result);
    const node = document.createElement('div');
    node.className = isMajor ? 'map-node major' : 'map-node';

    const dot = document.createElement('div');
    dot.className = 'map-dot';

    const age = document.createElement('div');
    age.className = 'map-age';
    age.textContent = `${record.age}岁`;

    const name = document.createElement('div');
    name.className = 'map-name';
    name.textContent = record.behaviorName;

    const result = document.createElement('div');
    result.className = `map-result ${record.result}`;
    result.textContent = RESULT_LABELS[record.result];

    node.appendChild(dot);
    node.appendChild(age);
    node.appendChild(name);
    node.appendChild(result);

    container.appendChild(node);
  }
}

function isMajorResult(result: ChoiceRecord['result']): boolean {
  return result === 'bigSuccess' || result === 'bigFailure';
}


