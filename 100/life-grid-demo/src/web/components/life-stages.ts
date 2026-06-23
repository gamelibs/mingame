export interface LifeStageConfig {
  key: string;
  icon: string;
  title: string;
  subtitle: string;
  minAge: number;
  maxAge: number;
}

function createStageElement(
  stage: LifeStageConfig,
  selected: boolean,
  onClick: (key: string) => void
): HTMLElement {
  const el = document.createElement('div');
  el.className = selected ? 'life-stage active' : 'life-stage';
  el.style.cursor = 'pointer';
  el.title = selected ? '再次点击返回游戏' : `查看「${stage.title}」阶段可执行的行为`;

  const icon = document.createElement('div');
  icon.className = 'life-stage-icon';
  icon.textContent = stage.icon;

  const text = document.createElement('div');
  text.className = 'life-stage-text';

  const title = document.createElement('div');
  title.className = 'life-stage-title';
  title.textContent = stage.title;

  const subtitle = document.createElement('div');
  subtitle.className = 'life-stage-subtitle';
  subtitle.textContent = stage.subtitle;

  text.appendChild(title);
  text.appendChild(subtitle);
  el.appendChild(icon);
  el.appendChild(text);

  el.addEventListener('click', () => onClick(stage.key));

  return el;
}

export function renderLifeStages(
  container: HTMLElement,
  stages: LifeStageConfig[],
  selectedKey: string | null,
  onSelect: (key: string) => void
): void {
  container.innerHTML = '';
  container.className = 'life-stages';

  for (const stage of stages) {
    const selected = stage.key === selectedKey;
    container.appendChild(createStageElement(stage, selected, onSelect));
  }
}
