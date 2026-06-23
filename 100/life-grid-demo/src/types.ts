import type { LifeGoal, GoalEvaluation } from './core/life-goals';

// 结果档位
export type ResultType = 'bigSuccess' | 'success' | 'normal' | 'failure' | 'bigFailure';

// 行为节点
export interface Behavior {
  id: string;
  name: string;
  category: string;
  minAge: number;
  maxAge: number;
  riskLevel: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  rewardLevel: number;
  failureLevel: number;
  balanceEffect: number;
  unlockWealth: number;
  tags: string[];
  description: string;
  narrative?: {
    title: string;
    story: string;
    successText: string;
    failureText: string;
    normalText?: string;
  };
}

// 效果快照
export interface EffectSnapshot {
  health?: number;
  wealth?: number;
  knowledge?: number;
  skill?: number;
  social?: number;
  happy?: number;
  charm?: number;
  luck?: number;
}

// 选择记录
export interface ChoiceRecord {
  age: number;
  x: number;
  y: number;
  behaviorId: string;
  behaviorName: string;
  weight: number;
  result: ResultType;
  effects: EffectSnapshot;
  event?: string;
}

// 玩家状态
export interface PlayerState {
  age: number;
  health: number;
  wealth: number;
  knowledge: number;
  skill: number;
  social: number;
  happy: number;
  charm: number;
  luck: number;
  lifeBalance: number;
  successChain: number;
  failureChain: number;
  deathRate: number;
  /** 是否正处于重大疾病中 */
  isCriticallyIll?: boolean;
  history: ChoiceRecord[];
  /** 逐年能量曲线，由游戏循环填充 */
  energyCurve?: number[];
  /** 本局选择的人生目标 */
  lifeGoal?: LifeGoal;
}

// 游戏事件
export interface GameEvent {
  id: string;
  type: 'lucky' | 'normal' | 'crisis' | 'era' | 'family' | 'health' | 'wealth';
  title: string;
  description: string;
  narrative?: string;
  minAge?: number;
  maxAge?: number;
  effects: EffectSnapshot;
  weight: number;
}

// 人生日志条目
export interface LogEntry {
  age: number;
  behaviorName: string;
  behaviorCategory?: string;
  riskLevel: number;
  result: ResultType;
  score: number;
  events: string[];
  effects: EffectSnapshot;
  wealth: number;
  deathReason?: string;
  /** 特殊日志类型：临终征兆 / 离世 / 目标评价 */
  specialType?: 'pre-death' | 'death' | 'goal-evaluation';
  /** 人生目标评价（仅目标评价日志有效） */
  goalEvaluation?: GoalEvaluation;
  /** AI 对该回合选择的评语 */
  aiComment?: string;
}

// 年龄段配置
export interface AgeConfig {
  maxRisk: number;
  baseCount: number;
  wealthBonusMax: number;
  unlockThreshold: number;
}
