import { Behavior, ChoiceRecord } from '../../types';
import { CATEGORY_ORDER, CATEGORY_COLORS } from '../../core/category';

interface LibraryCategory {
  key: string;
  label: string;
  predicate: (behavior: Behavior) => boolean;
}

const CATEGORIES: LibraryCategory[] = CATEGORY_ORDER.map((name) => ({
  key: name,
  label: name,
  predicate: (b) => b.category === name,
}));

function classifyBehavior(behavior: Behavior): LibraryCategory | undefined {
  return CATEGORIES.find((c) => c.predicate(behavior));
}

export function renderCardLibrary(
  statsContainer: HTMLElement,
  tagsContainer: HTMLElement,
  history: ChoiceRecord[],
  allBehaviors: Behavior[],
  onCategoryClick?: (category: string) => void,
  showcaseActive = false,
  onShowcaseClick?: () => void
): void {
  statsContainer.innerHTML = '';
  tagsContainer.innerHTML = '';

  // 移除旧的展示按钮（在 #card-library 容器内查找，避免结构变更后失效）
  const libraryContainer = tagsContainer.closest('.card-library');
  const oldBtn = libraryContainer?.querySelector('.library-showcase-btn');
  if (oldBtn) oldBtn.remove();

  const unlockedNames = new Set(history.map((h) => h.behaviorName));
  const totalBehaviors = allBehaviors.length;
  const unlockedCount = unlockedNames.size;

  const stats = document.createElement('span');
  stats.textContent = `已解锁 ${unlockedCount} / ${totalBehaviors}`;
  statsContainer.appendChild(stats);

  const counts: Record<string, number> = {};

  for (const behavior of allBehaviors) {
    const category = classifyBehavior(behavior);
    if (!category) continue;
    counts[category.key] = (counts[category.key] ?? 0) + 1;
  }

  for (const category of CATEGORIES) {
    const count = counts[category.key] ?? 0;
    const tag = document.createElement('div');
    tag.className = 'library-tag';
    const color = CATEGORY_COLORS[category.label as keyof typeof CATEGORY_COLORS];
    tag.style.borderColor = color;
    tag.style.color = color;
    tag.textContent = `${category.label} ${count}`;
    tag.title = `点击编辑「${category.label}」数据库（共 ${count} 条）`;

    if (onCategoryClick) {
      tag.style.cursor = 'pointer';
      tag.addEventListener('click', () => onCategoryClick(category.label));
    }

    tagsContainer.appendChild(tag);
  }

  if (onShowcaseClick) {
    const showcaseBtn = document.createElement('button');
    showcaseBtn.className = 'seal-btn secondary library-showcase-btn';
    showcaseBtn.textContent = showcaseActive ? '返回游戏' : '展示全部卡牌';
    showcaseBtn.addEventListener('click', onShowcaseClick);
    tagsContainer.after(showcaseBtn);
  }
}
