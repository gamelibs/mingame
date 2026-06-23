import { ChoiceRecord } from '../../types';

interface RelationshipDef {
  name: string;
  icon: string;
  predicate: (history: ChoiceRecord[]) => boolean;
}

const RELATIONSHIPS: RelationshipDef[] = [
  {
    name: '父母',
    icon: '👨‍👩‍👧',
    predicate: () => true,
  },
  {
    name: '朋友',
    icon: '🤝',
    predicate: (history) => hasBehavior(history, ['交朋友', '社交活动']),
  },
  {
    name: '恋人',
    icon: '💑',
    predicate: (history) => hasBehavior(history, ['恋爱', '表白']),
  },
  {
    name: '伴侣',
    icon: '💍',
    predicate: (history) => hasBehavior(history, ['结婚']),
  },
  {
    name: '子女',
    icon: '👶',
    predicate: (history) => hasBehavior(history, ['生育']),
  },
  {
    name: '导师',
    icon: '🧙',
    predicate: (history) => hasBehavior(history, ['寻找导师', '拜师']),
  },
  {
    name: '对手',
    icon: '⚔️',
    predicate: (history) => hasBehavior(history, ['冲突处理', '暴力冲突']),
  },
];

function hasBehavior(history: ChoiceRecord[], keywords: string[]): boolean {
  return history.some((h) => keywords.some((kw) => h.behaviorName.includes(kw)));
}

export function renderRelationships(container: HTMLElement, history: ChoiceRecord[]): void {
  container.innerHTML = '';

  const active = RELATIONSHIPS.filter((r) => r.predicate(history));

  if (active.length === 0) {
    const empty = document.createElement('span');
    empty.className = 'relationship';
    empty.textContent = '暂无特殊关系';
    container.appendChild(empty);
    return;
  }

  for (const rel of active) {
    const badge = document.createElement('span');
    badge.className = 'relationship';
    badge.textContent = `${rel.icon} ${rel.name}`;
    container.appendChild(badge);
  }
}
