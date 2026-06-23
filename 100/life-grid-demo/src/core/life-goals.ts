/**
 * 人生目标配置与结局评价。
 *
 * 每局开局时玩家选择一个人生目标，获得对应的初始属性加成，
 * 并在死亡/结束时根据目标相关属性的达成度获得评级反馈。
 */

import { PlayerState } from '../types';

export type LifeGoalAttribute =
  | 'health'
  | 'wealth'
  | 'knowledge'
  | 'skill'
  | 'social'
  | 'happy'
  | 'charm'
  | 'luck';

export type GoalDifficulty = 'low' | 'high';

export type GoalRating = 'unfulfilled' | 'bronze' | 'silver' | 'gold' | 'legend';

export interface LifeGoal {
  /** 目标唯一标识 */
  id: string;
  /** 显示名称 */
  name: string;
  /** 图标 emoji */
  icon: string;
  /** 简短描述 */
  description: string;
  /** 难度等级（low 简单 / high 困难） */
  difficulty: GoalDifficulty;
  /** 初始属性加成 */
  bonuses: Partial<Record<LifeGoalAttribute, number>>;
  /** 结局评价目标值（key 为属性，value 为期望达成的数值） */
  targets: Partial<Record<LifeGoalAttribute, number>>;
}

export interface GoalTargetProgress {
  attr: LifeGoalAttribute;
  label: string;
  target: number;
  actual: number;
  percent: number;
  reached: boolean;
}

export interface GoalEvaluation {
  goal: LifeGoal;
  age: number;
  rating: GoalRating;
  ratingLabel: string;
  averagePercent: number;
  targets: GoalTargetProgress[];
  summary: string;
}

export const ATTR_LABELS: Record<LifeGoalAttribute, string> = {
  health: '健康',
  wealth: '财富',
  knowledge: '知识',
  skill: '技能',
  social: '人脉',
  happy: '幸福',
  charm: '魅力',
  luck: '运势',
};

export const RATING_LABELS: Record<GoalRating, string> = {
  unfulfilled: '未竟之志',
  bronze: '初露锋芒',
  silver: '小有成就',
  gold: '名满天下',
  legend: '传奇一生',
};

export const LIFE_GOALS: LifeGoal[] = [
  {
    id: 'business',
    name: '商业帝国',
    icon: '💼',
    description: '从一介平民到商界巨擘，用财富书写人生传奇。',
    difficulty: 'low',
    bonuses: {
      wealth: 20,
      skill: 10,
      social: 10,
      charm: 5,
    },
    targets: {
      wealth: 1000,
      skill: 70,
      social: 70,
      charm: 50,
    },
  },
  {
    id: 'happiness',
    name: '美满人生',
    icon: '❤️',
    description: '执子之手，与子偕老，追寻平凡而持久的幸福。',
    difficulty: 'low',
    bonuses: {
      happy: 20,
      charm: 10,
      health: 10,
      social: 5,
    },
    targets: {
      happy: 75,
      charm: 60,
      health: 65,
      social: 55,
    },
  },
  {
    id: 'science',
    name: '科学巨匠',
    icon: '🔬',
    description: '探索未知，用知识和发现推动人类文明。',
    difficulty: 'high',
    bonuses: {
      knowledge: 20,
      skill: 10,
      luck: 10,
      health: 5,
    },
    targets: {
      knowledge: 90,
      skill: 85,
      luck: 80,
      health: 75,
    },
  },
  {
    id: 'medicine',
    name: '医道圣手',
    icon: '⚕️',
    description: '悬壶济世，以医术守护生命与健康。',
    difficulty: 'high',
    bonuses: {
      health: 20,
      knowledge: 10,
      skill: 10,
      happy: 5,
    },
    targets: {
      health: 90,
      knowledge: 90,
      skill: 85,
      happy: 70,
    },
  },
  {
    id: 'power',
    name: '权倾天下',
    icon: '👑',
    description: '运筹帷幄，在人际与权力的棋盘上登顶。',
    difficulty: 'high',
    bonuses: {
      social: 20,
      charm: 10,
      wealth: 10,
      luck: 5,
    },
    targets: {
      social: 95,
      charm: 90,
      wealth: 5000,
      luck: 80,
    },
  },
];

export function getLifeGoalById(id: string): LifeGoal | undefined {
  return LIFE_GOALS.find((goal) => goal.id === id);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function ratingFromPercent(percent: number): GoalRating {
  if (percent >= 90) return 'legend';
  if (percent >= 70) return 'gold';
  if (percent >= 50) return 'silver';
  if (percent >= 30) return 'bronze';
  return 'unfulfilled';
}

function generateSummary(evaluation: GoalEvaluation): string {
  const { goal, rating, averagePercent, age } = evaluation;
  const allReached = evaluation.targets.every((t) => t.reached);
  const prefix = `${goal.icon} ${goal.name}`;

  if (rating === 'legend') {
    return allReached
      ? `${prefix}：你完美达成了所有目标，留下了一段传奇。享年 ${age} 岁，千古流芳。`
      : `${prefix}：你已接近完美，虽未事事圆满，却已是世人仰望的存在。享年 ${age} 岁。`;
  }
  if (rating === 'gold') {
    return `${prefix}：你实现了大部分理想，人生堪称辉煌。享年 ${age} 岁，成就斐然。`;
  }
  if (rating === 'silver') {
    return `${prefix}：你在这条路上走出了自己的风景，但仍有遗憾。享年 ${age} 岁。`;
  }
  if (rating === 'bronze') {
    return `${prefix}：你迈出了坚实的步伐，却未能走得更远。享年 ${age} 岁。`;
  }
  return `${prefix}：你的人生与目标渐行渐远，仿佛从未真正出发。享年 ${age} 岁。`;
}

/**
 * 根据临终状态评价人生目标达成度。
 *
 * 计算逻辑：
 * 1. 按目标属性计算达成百分比（财富等无上限属性以目标值为 100% 截断）
 * 2. 用平均百分比作为主要评级依据
 * 3. 引入寿命修正：活过 80 岁不扣分，低于 80 岁按比例折减，
 *    避免英年早逝却因单项属性高而获得虚高评级
 */
export function evaluateLifeGoal(state: PlayerState): GoalEvaluation | null {
  if (!state.lifeGoal) return null;

  const { lifeGoal, age } = state;
  const targetEntries = Object.entries(lifeGoal.targets) as [LifeGoalAttribute, number][];
  if (targetEntries.length === 0) return null;

  const targets: GoalTargetProgress[] = targetEntries.map(([attr, target]) => {
    const actual = state[attr] as number;
    const rawPercent = (actual / target) * 100;
    const percent = Math.min(100, Math.round(rawPercent * 10) / 10);
    return {
      attr,
      label: ATTR_LABELS[attr],
      target,
      actual: Math.round(actual),
      percent,
      reached: actual >= target,
    };
  });

  const avgPercent =
    targets.reduce((sum, t) => sum + t.percent, 0) / targets.length;

  const ageFactor = clamp(age / 80, 0.4, 1);
  const effectivePercent = avgPercent * ageFactor;

  const rating = ratingFromPercent(effectivePercent);
  const evaluation: GoalEvaluation = {
    goal: lifeGoal,
    age,
    rating,
    ratingLabel: RATING_LABELS[rating],
    averagePercent: Math.round(effectivePercent),
    targets,
    summary: '',
  };
  evaluation.summary = generateSummary(evaluation);
  return evaluation;
}
