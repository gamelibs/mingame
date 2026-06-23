/**
 * 人生棋盘十大事件类别
 * X 轴从 1 到 10 依次为：
 * 1 成长、2 教育、3 事业、4 投资、5 感情、6 家庭、7 社交、8 兴趣、9 风险、10 机遇
 */

export const CATEGORY_ORDER = [
  '成长',
  '教育',
  '事业',
  '投资',
  '感情',
  '家庭',
  '社交',
  '兴趣',
  '风险',
  '机遇',
] as const;

export type LifeCategory = typeof CATEGORY_ORDER[number];

export function getCategoryIndex(category: string): number {
  const index = CATEGORY_ORDER.indexOf(category as LifeCategory);
  return index >= 0 ? index + 1 : 10; // 未归类默认放入「机遇」
}

export function isValidCategory(category: string): boolean {
  return CATEGORY_ORDER.includes(category as LifeCategory);
}

export const CATEGORY_LABELS: Record<LifeCategory, string> = {
  成长: '成长',
  教育: '教育',
  事业: '事业',
  投资: '投资',
  感情: '感情',
  家庭: '家庭',
  社交: '社交',
  兴趣: '兴趣',
  风险: '风险',
  机遇: '机遇',
};

export const CATEGORY_ICONS: Record<LifeCategory, string> = {
  成长: '🌱',
  教育: '📚',
  事业: '💼',
  投资: '📈',
  感情: '❤️',
  家庭: '🏠',
  社交: '🤝',
  兴趣: '🎨',
  风险: '⚠️',
  机遇: '🎁',
};

export const CATEGORY_COLORS: Record<LifeCategory, string> = {
  成长: '#2ecc71',
  教育: '#3498db',
  事业: '#1a3c8e',
  投资: '#f1c40f',
  感情: '#ff69b4',
  家庭: '#e74c3c',
  社交: '#9b59b6',
  兴趣: '#f39c12',
  风险: '#8b5a5a',
  机遇: '#ffd700',
};
