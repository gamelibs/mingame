import {
  Behavior,
  ChoiceRecord,
  EffectSnapshot,
  GameEvent,
  LogEntry,
  PlayerState,
  ResultType,
} from '../types';
import { LifeGoal, GoalEvaluation, evaluateLifeGoal } from '../core/life-goals';
import { createInitialState, snapshotState } from '../core/state';
import { generateBehaviorPool } from '../core/behavior-pool';
import { resolveResult } from '../core/resolve';
import { applyEffects, applyAging, applyLifecycleEffects } from '../core/effects';
import {
  GameRules,
  DEFAULT_GAME_RULES,
  loadGameRules,
  saveGameRules,
  normalizeGameRules,
} from '../core/game-rules';
import { updateLifeBalance } from '../core/balance';
import { updateChains } from '../core/chains';
import { triggerEvent } from '../core/events';
import { resolveDeath } from '../core/death';
import { mapBehaviorsToGrid } from '../ui/grid';
import { simulatePlayerChoice } from '../ui/input';
import { modernBehaviors } from '../data/modern-behaviors';
import { apocalypseBehaviors } from '../data/apocalypse-behaviors';
import { gameEvents } from '../data/events';
import {
  BehaviorOverrideSet,
  applyBehaviorOverrides,
  loadBehaviorOverrides,
  saveBehaviorOverrides,
} from './behavior-overrides';
import { calcYearEnergy } from '../game/settlement';

export type GameMode = 'modern' | 'apocalypse';

export interface GameConfig {
  mode: GameMode;
  maxAge: number;
  /** 本局选择的人生目标 */
  lifeGoal?: LifeGoal;
}

export const SAVED_LIFE_VERSION = 1;

export interface SavedLifeData {
  version: number;
  config: GameConfig;
  records: ChoiceRecord[];
  /** snapshots[i] 为执行完第 i 条记录后的状态快照；snapshots[0] 为初始状态 */
  snapshots: PlayerState[];
  savedAt: string;
}

export interface SavedLifeMeta {
  id: string;
  name: string;
  savedAt: string;
  age: number;
  summary: string;
}

export interface GameController {
  getState(): PlayerState;
  getGrid(): (Behavior | null)[][];
  getLogs(): LogEntry[];
  getEnergyCurve(): number[];
  getWealthCurve(): number[];
  getAttributeCurves(): {
    health: number[];
    wealth: number[];
    knowledge: number[];
    skill: number[];
    social: number[];
    happy: number[];
    charm: number[];
    luck: number[];
  };
  getAnnualSummary(): { deltas: EffectSnapshot; text: string } | null;
  getGameRules(): GameRules;
  setGameRules(rules: GameRules): void;
  resetGameRules(): void;
  getConfig(): GameConfig;

  /**
   * 设置本局人生目标，设置后会自动重置游戏以应用初始加成。
   */
  setLifeGoal(lifeGoal?: LifeGoal): void;

  /**
   * 获取当前模式下的基础行为列表。
   */
  getBaseBehaviors(): Behavior[];

  /**
   * 获取当前模式下所有行为（含用户覆盖）。
   */
  getAllBehaviors(): Behavior[];

  /**
   * 应用并持久化用户行为覆盖，随后刷新棋盘。
   */
  applyBehaviorOverrides(overrides: BehaviorOverrideSet): void;

  /**
   * 玩家手动选择一个格子。
   * x 与 y 均为 1~10 的闭区间坐标，对应 l1~l10 与 n1~n10。
   */
  selectBehavior(
    x: number,
    y: number,
    weight?: number
  ): {
    success: boolean;
    message?: string;
    log?: LogEntry;
  };

  /**
   * 自动执行一年，返回该年的日志条目。
   */
  stepAuto(): LogEntry | null;

  /**
   * 重置游戏，可切换模式或最大年龄。
   */
  reset(config?: Partial<GameConfig>): void;

  /**
   * 检查游戏是否结束。
   */
  isGameOver(): boolean;

  /**
   * 获取游戏结束原因，未结束时返回 null。
   */
  getGameOverReason(): string | null;

  /**
   * 评价当前人生目标的达成度，未选择目标或游戏未结束时返回 null。
   */
  evaluateLifeGoal(): GoalEvaluation | null;

  /**
   * 估算选择某行为的成功概率（0~100）。
   */
  getSuccessRate(behavior: Behavior, riskLevel: number): number;

  /**
   * 导出当前人生数据为 JSON 字符串，包含完整状态快照，可精确回放。
   */
  exportLifeData(): string;

  /**
   * 解析人生数据 JSON 字符串。
   */
  importLifeData(json: string): SavedLifeData | null;

  /**
   * 获取当前人生数据对象（用于本地存储或下载）。
   */
  getLifeData(): SavedLifeData;

  /**
   * 开始回放已加载的人生数据。返回是否成功启动。
   */
  startReplay(data: SavedLifeData): boolean;

  /**
   * 回放一步，返回是否还有下一步。
   */
  replayStep(): boolean;

  /**
   * 是否处于回放模式。
   */
  isReplaying(): boolean;

  /**
   * 获取回放进度。
   */
  getReplayProgress(): { current: number; total: number };

  /**
   * 结束回放模式并恢复到普通游戏状态（保留当前回放进度）。
   */
  stopReplay(): void;
}

const GRID_SIZE = 10;
const DEFAULT_CONFIG: GameConfig = {
  mode: 'modern',
  maxAge: 100,
};

function generateLogEntry(
  state: PlayerState,
  behavior: Behavior,
  riskLevel: number,
  result: ResultType,
  score: number,
  events: GameEvent[],
  effects: EffectSnapshot
): LogEntry {
  return {
    age: state.age,
    behaviorName: behavior.name,
    behaviorCategory: behavior.category,
    riskLevel,
    result,
    score,
    events: events.map((e) => e.title),
    effects: { ...effects },
    wealth: state.wealth,
  };
}

function mergeEffects(target: EffectSnapshot, source: EffectSnapshot): void {
  for (const [key, value] of Object.entries(source)) {
    const k = key as keyof EffectSnapshot;
    target[k] = (target[k] ?? 0) + (value as number);
  }
}

function generateDeathLog(state: PlayerState, reason: string): LogEntry {
  return {
    age: state.age,
    behaviorName: '离世',
    behaviorCategory: '风险',
    riskLevel: 10,
    result: 'failure',
    score: 0,
    events: [],
    effects: {},
    wealth: state.wealth,
    deathReason: reason,
    specialType: 'death',
  };
}

function generatePreDeathLog(state: PlayerState, story: string): LogEntry {
  return {
    age: state.age,
    behaviorName: '临终征兆',
    behaviorCategory: '风险',
    riskLevel: 10,
    result: 'failure',
    score: 0,
    events: [],
    effects: {},
    wealth: state.wealth,
    specialType: 'pre-death',
  };
}

function generateEvaluationLog(state: PlayerState): LogEntry {
  const evaluation = evaluateLifeGoal(state);
  return {
    age: state.age,
    behaviorName: '目标评价',
    behaviorCategory: '总结',
    riskLevel: 0,
    result: 'bigSuccess',
    score: 0,
    events: evaluation ? [evaluation.summary] : [],
    effects: {},
    wealth: state.wealth,
    specialType: 'goal-evaluation',
    goalEvaluation: evaluation ?? undefined,
  };
}

interface DeathDetails {
  preDeathStory: string;
  deathReason: string;
}

function determineDeathDetails(
  state: PlayerState,
  behavior: Behavior,
  events: GameEvent[],
  config: GameConfig
): DeathDetails {
  const age = state.age;
  const health = state.health;
  const risk = behavior?.riskLevel ?? 1;
  const eventTitles = events.map((e) => e.title);

  // 1. 寿终正寝
  if (age >= config.maxAge) {
    return {
      preDeathStory: '你感到生命之烛即将燃尽，内心却异常平静。',
      deathReason: '寿终正寝，走完了人生的全程。',
    };
  }

  // 2. 重大疾病 / 久病不治
  if (state.isCriticallyIll || eventTitles.includes('突发疾病') || health <= 25) {
    return {
      preDeathStory: '长期积累的疾病在这一年突然恶化，你被紧急送医，情况不容乐观。',
      deathReason: '重疾不治，最终离开了人世。',
    };
  }

  // 3. 意外事故
  if (eventTitles.includes('意外事故') || risk >= 9) {
    return {
      preDeathStory: '一场突如其来的意外打破了你原本平静的生活，伤势严重。',
      deathReason: '因意外伤势过重，不幸猝然离世。',
    };
  }

  // 4. 自然灾害 / 战争
  if (eventTitles.includes('自然灾害') || eventTitles.includes('区域冲突')) {
    return {
      preDeathStory: '无情的灾难降临，你被困在混乱与危险之中。',
      deathReason: '在一场突如其来的灾难中失去了生命。',
    };
  }

  // 5. 英年早逝（无明显病因/意外）
  if (age < 40) {
    return {
      preDeathStory: '你从未想过死亡会来得这么早，一切都发生得太快。',
      deathReason: '一场突如其来的变故，让你英年早逝。',
    };
  }

  // 6. 健康恶化
  if (health <= 40) {
    return {
      preDeathStory: '你感到身体每况愈下，日常起居都变得困难。',
      deathReason: '久病缠身，医治无效离世。',
    };
  }

  // 7. 老年安详离世
  if (health <= 65 && age >= 65) {
    return {
      preDeathStory: '年迈的身体越来越不听使唤，你大部分时间都在休息。',
      deathReason: '年老体衰，在睡梦中安详离世。',
    };
  }

  // 8. 积劳成疾
  if (health <= 65) {
    return {
      preDeathStory: '长期的压力和操劳终于在这一年压垮了你。',
      deathReason: '身体长期透支，积劳成疾离世。',
    };
  }

  // 9. 高风险行为后果
  if (risk >= 6) {
    return {
      preDeathStory: '你冒险一试，却没想到代价如此沉重。',
      deathReason: '高风险行为引发严重后果，不幸离世。',
    };
  }

  // 10. 精神打击
  if (state.failureChain >= 2 || state.happy <= 30) {
    return {
      preDeathStory: '接连的打击让你身心俱疲，整个人仿佛被抽空了。',
      deathReason: '心力交瘁，黯然离世。',
    };
  }

  // 11. 老年自然
  if (age >= 70) {
    return {
      preDeathStory: '你感到生命的火焰正在缓缓熄灭。',
      deathReason: '年老力衰，平静地离开了人世。',
    };
  }

  // 兜底：根据年龄和最后行为给出更具体的常见死因
  if (age >= 40) {
    if (behavior?.category === '事业' || behavior?.category === '投资') {
      return {
        preDeathStory: '长期高压和操劳让你的身体发出了最后的警报。',
        deathReason: '因过度劳累和压力，猝然离世。',
      };
    }
    return {
      preDeathStory: '你一向觉得身体尚可，没想到疾病会来得如此突然。',
      deathReason: '突发急病，抢救无效离世。',
    };
  }

  return {
    preDeathStory: '没有任何征兆，命运突然转向了最坏的方向。',
    deathReason: '人生戛然而止，留下许多未完成的遗憾。',
  };
}

const ANNUAL_ATTRS: (keyof EffectSnapshot)[] = [
  'health',
  'wealth',
  'knowledge',
  'skill',
  'social',
  'happy',
  'charm',
  'luck',
];

function buildAnnualSummary(
  state: PlayerState,
  snapshots: PlayerState[],
  logs: LogEntry[]
): { deltas: EffectSnapshot; text: string } | null {
  if (state.age <= 1 || snapshots.length < 2) return null;

  const current = snapshots[snapshots.length - 1];
  const prev = snapshots[snapshots.length - 2];
  const deltas: EffectSnapshot = {};

  for (const key of ANNUAL_ATTRS) {
    const d = (current[key] as number) - (prev[key] as number);
    if (Math.abs(d) >= 0.5) {
      deltas[key] = Math.round(d * 10) / 10;
    }
  }

  // 找到上一年度的主行为日志（排除临终/死亡标记）
  const lastBehaviorLog = [...logs]
    .reverse()
    .find((log) => !log.specialType && log.age === state.age - 1);

  const deltaParts = describeAnnualDeltas(deltas);
  let text = lastBehaviorLog
    ? `受「${lastBehaviorLog.behaviorName}」影响`
    : '这一年';
  text += deltaParts.length > 0 ? `，${deltaParts.join('、')}` : '，各项属性基本持平';
  text += '。';

  return { deltas, text };
}

function describeAnnualDeltas(deltas: EffectSnapshot): string[] {
  const labels: Record<string, string> = {
    health: '健康',
    wealth: '财富',
    knowledge: '知识',
    skill: '技能',
    social: '人脉',
    happy: '幸福',
    charm: '魅力',
    luck: '运势',
  };
  const parts: string[] = [];
  for (const [key, value] of Object.entries(deltas)) {
    const label = labels[key] || key;
    const formatted = key === 'wealth' ? formatWealthDelta(value) : `${value > 0 ? '+' : ''}${Math.round(value)}`;
    parts.push(`${label}${formatted}`);
  }
  return parts;
}

function formatWealthDelta(value: number): string {
  const abs = Math.abs(value);
  let formatted: string;
  if (abs >= 1000000) formatted = `${(value / 1000000).toFixed(1)}M`;
  else if (abs >= 1000) formatted = `${(value / 1000).toFixed(1)}k`;
  else formatted = `${Math.round(value)}`;
  return `${value > 0 ? '+' : ''}${formatted}`;
}

export function createGameController(
  config?: Partial<GameConfig>
): GameController {
  let currentConfig: GameConfig = { ...DEFAULT_CONFIG, ...config };
  let rules: GameRules = normalizeGameRules(loadGameRules());
  let state = createInitialState(rules, currentConfig.lifeGoal);
  let baseBehaviors =
    currentConfig.mode === 'modern' ? modernBehaviors : apocalypseBehaviors;
  let behaviorOverrideSet = loadBehaviorOverrides(currentConfig.mode);
  let behaviors = applyBehaviorOverrides(baseBehaviors, behaviorOverrideSet);
  const events = gameEvents;
  let grid = mapBehaviorsToGrid(
    generateBehaviorPool(state, behaviors, currentConfig.mode, rules)
  );
  let logs: LogEntry[] = [];
  let snapshots: PlayerState[] = [snapshotState(state)];
  let dead = false;
  let gameOverReason: string | null = null;

  // 回放状态
  let replayData: SavedLifeData | null = null;
  let replayIndex = 0;
  let replaying = false;

  function regenerateGrid(): void {
    const pool = generateBehaviorPool(state, behaviors, currentConfig.mode, rules);
    grid = mapBehaviorsToGrid(pool);
  }

  function advanceAgeIfAlive(): void {
    if (dead) return;
    if (state.age < currentConfig.maxAge) {
      state.age += 1;
      applyAging(state, rules);
      applyLifecycleEffects(state, rules);
      regenerateGrid();
    } else {
      gameOverReason = `活到了 ${currentConfig.maxAge} 岁`;
    }
  }

  const controller: GameController = {
    getState: () => state,
    getGrid: () => grid,
    getLogs: () => logs,
    getEnergyCurve: () => snapshots.map((s) => calcYearEnergy(s)),
    getWealthCurve: () => snapshots.map((s) => s.wealth),
    getAttributeCurves: () => ({
      health: snapshots.map((s) => s.health),
      wealth: snapshots.map((s) => s.wealth),
      knowledge: snapshots.map((s) => s.knowledge),
      skill: snapshots.map((s) => s.skill),
      social: snapshots.map((s) => s.social),
      happy: snapshots.map((s) => s.happy),
      charm: snapshots.map((s) => s.charm),
      luck: snapshots.map((s) => s.luck),
    }),
    getAnnualSummary: () => buildAnnualSummary(state, snapshots, logs),
    getGameRules: () => ({ ...rules }),
    setGameRules(newRules: GameRules) {
      rules = normalizeGameRules(newRules);
      saveGameRules(rules);
    },
    resetGameRules() {
      rules = normalizeGameRules(DEFAULT_GAME_RULES);
      saveGameRules(rules);
    },
    getConfig: () => ({ ...currentConfig }),

    setLifeGoal(lifeGoal?: LifeGoal) {
      currentConfig = { ...currentConfig, lifeGoal };
      state = createInitialState(rules, currentConfig.lifeGoal);
      baseBehaviors =
        currentConfig.mode === 'modern' ? modernBehaviors : apocalypseBehaviors;
      behaviorOverrideSet = loadBehaviorOverrides(currentConfig.mode);
      behaviors = applyBehaviorOverrides(baseBehaviors, behaviorOverrideSet);
      logs = [];
      snapshots = [snapshotState(state)];
      dead = false;
      gameOverReason = null;
      regenerateGrid();
    },

    getBaseBehaviors: () => baseBehaviors,

    getAllBehaviors: () => behaviors,

    applyBehaviorOverrides(overrides: BehaviorOverrideSet) {
      behaviorOverrideSet = { ...overrides };
      saveBehaviorOverrides(currentConfig.mode, behaviorOverrideSet);
      behaviors = applyBehaviorOverrides(baseBehaviors, behaviorOverrideSet);
      regenerateGrid();
    },

    selectBehavior(x, y, weight = 1.0) {
      if (controller.isGameOver()) {
        return { success: false, message: '游戏已结束' };
      }

      if (x < 1 || x > GRID_SIZE || y < 1 || y > GRID_SIZE) {
        return { success: false, message: '坐标超出范围（应为 1~10）' };
      }

      const behavior = grid[y - 1][x - 1];
      if (!behavior) {
        return { success: false, message: '该格子没有可用行为' };
      }

      // 1. 回合开始事件
      const startEvent = triggerEvent(state, events, 'start', rules);

      // 2. 结果判定
      const { result, score } = resolveResult(behavior, y, state, rules);

      // 3. 应用效果
      const effects = applyEffects(state, behavior, result, weight, rules);

      // 4. 更新平衡度与连锁
      updateLifeBalance(state, behavior, result, rules);
      updateChains(state, result, rules);

      // 5. 行为结算后事件
      const afterEvent = triggerEvent(state, events, 'afterChoice', rules);

      // 6. 生成日志与历史记录
      const triggeredEvents: GameEvent[] = [
        startEvent,
        afterEvent,
      ].filter((e): e is GameEvent => e !== null);

      const log = generateLogEntry(
        state,
        behavior,
        behavior.riskLevel,
        result,
        score,
        triggeredEvents,
        effects
      );

      state.history.push({
        age: state.age,
        x,
        y,
        behaviorId: behavior.id,
        behaviorName: behavior.name,
        weight,
        result,
        effects,
        event: triggeredEvents.map((e) => e.title).join(' / ') || undefined,
      });

      logs.push(log);

      // 7. 死亡判定（含重大疾病、治疗、康复、带病维持）
      const deathResolution = resolveDeath(state, currentConfig.maxAge, rules);
      if (deathResolution.died) {
        dead = true;
        gameOverReason = `在第 ${state.age} 年去世：${deathResolution.reason}`;
        logs.push(generatePreDeathLog(state, deathResolution.preDeathStory!));
        logs.push(generateDeathLog(state, deathResolution.reason!));
        logs.push(generateEvaluationLog(state));
      } else {
        if (deathResolution.illnessEffects) {
          mergeEffects(log.effects, deathResolution.illnessEffects);
          log.events.push(deathResolution.illnessEvent!);
        }
        advanceAgeIfAlive();
      }

      const snap = snapshotState(state);
      snap.history = []; // 快照中不需要完整历史，由 records 单独保存，可大幅减小体积
      snapshots.push(snap);
      return { success: true, log };
    },

    stepAuto() {
      if (controller.isGameOver()) return null;
      const { x, y, weight } = simulatePlayerChoice(state, grid, rules);
      const result = controller.selectBehavior(x, y, weight);
      return result.log ?? null;
    },

    reset(newConfig) {
      currentConfig = { ...DEFAULT_CONFIG, ...newConfig };
      state = createInitialState(rules, currentConfig.lifeGoal);
      baseBehaviors =
        currentConfig.mode === 'modern' ? modernBehaviors : apocalypseBehaviors;
      // 行为覆盖按模式独立保存
      behaviorOverrideSet = loadBehaviorOverrides(currentConfig.mode);
      behaviors = applyBehaviorOverrides(baseBehaviors, behaviorOverrideSet);
      logs = [];
      snapshots = [snapshotState(state)];
      dead = false;
      gameOverReason = null;
      replaying = false;
      replayData = null;
      replayIndex = 0;
      regenerateGrid();
    },

    isGameOver() {
      return dead || state.age >= currentConfig.maxAge || gameOverReason !== null;
    },

    getGameOverReason() {
      return gameOverReason;
    },

    evaluateLifeGoal() {
      if (!gameOverReason) return null;
      return evaluateLifeGoal(state);
    },

    getSuccessRate(behavior: Behavior, riskLevel: number): number {
      const trials = 500;
      let successCount = 0;
      for (let i = 0; i < trials; i++) {
        const { result } = resolveResult(behavior, riskLevel, state, rules);
        if (result === 'success' || result === 'bigSuccess') {
          successCount++;
        }
      }
      return Math.round((successCount / trials) * 100);
    },

    exportLifeData(): string {
      const data = controller.getLifeData();
      return JSON.stringify(data, null, 2);
    },

    importLifeData(json: string): SavedLifeData | null {
      try {
        const parsed = JSON.parse(json);
        if (!parsed || typeof parsed !== 'object') return null;
        if (parsed.version !== SAVED_LIFE_VERSION) {
          console.warn(`人生数据版本不匹配: ${parsed.version} != ${SAVED_LIFE_VERSION}`);
          return null;
        }
        if (!parsed.config || !Array.isArray(parsed.records) || !Array.isArray(parsed.snapshots)) {
          return null;
        }
        if (parsed.snapshots.length !== parsed.records.length + 1) {
          console.warn('人生数据快照数量与记录数量不匹配');
          return null;
        }
        return parsed as SavedLifeData;
      } catch {
        return null;
      }
    },

    getLifeData(): SavedLifeData {
      return {
        version: SAVED_LIFE_VERSION,
        config: { ...currentConfig },
        records: state.history.map((r) => ({ ...r })),
        snapshots: snapshots.map((s) => snapshotState(s)),
        savedAt: new Date().toISOString(),
      };
    },

    startReplay(data: SavedLifeData): boolean {
      if (data.version !== SAVED_LIFE_VERSION) return false;
      if (data.snapshots.length !== data.records.length + 1) return false;

      // 切换到相同模式
      controller.reset(data.config);

      replayData = {
        version: data.version,
        config: { ...data.config },
        records: data.records.map((r) => ({ ...r })),
        snapshots: data.snapshots.map((s) => snapshotState(s)),
        savedAt: data.savedAt,
      };
      replayIndex = 0;
      replaying = true;

      // 恢复到初始状态
      state = snapshotState(replayData.snapshots[0]);
      state.history = [];
      logs = [];
      regenerateGrid();

      return true;
    },

    replayStep(): boolean {
      if (!replaying || !replayData) return false;
      if (replayIndex >= replayData.records.length) {
        replaying = false;
        return false;
      }

      const record = replayData.records[replayIndex];
      const nextSnapshot = replayData.snapshots[replayIndex + 1];

      // 将状态精确恢复到下一年，同时逐步重建历史记录
      state = snapshotState(nextSnapshot);
      state.history = replayData.records.slice(0, replayIndex + 1).map((r) => ({ ...r }));
      regenerateGrid();

      // 重建日志
      const replayBehavior = behaviors.find((b) => b.id === record.behaviorId);
      const log: LogEntry = {
        age: record.age,
        behaviorName: record.behaviorName,
        behaviorCategory: replayBehavior?.category,
        riskLevel: record.y,
        result: record.result,
        score: 0,
        events: record.event ? record.event.split(' / ') : [],
        effects: { ...record.effects },
        wealth: state.wealth,
      };

      logs.push(log);
      replayIndex++;

      if (replayIndex >= replayData.records.length) {
        replaying = false;
        // 如果人生提前结束，标记结束原因
        if (state.age < currentConfig.maxAge) {
          dead = true;
          const { preDeathStory, deathReason } = determineDeathDetails(
            state,
            replayBehavior || ({} as Behavior),
            [],
            currentConfig
          );
          gameOverReason = `在第 ${state.age} 年去世：${deathReason}`;
          logs.push(generatePreDeathLog(state, preDeathStory));
          logs.push(generateDeathLog(state, deathReason));
          logs.push(generateEvaluationLog(state));
        }
      }

      return replaying;
    },

    isReplaying(): boolean {
      return replaying;
    },

    getReplayProgress(): { current: number; total: number } {
      if (!replayData) return { current: 0, total: 0 };
      return { current: replayIndex, total: replayData.records.length };
    },

    stopReplay(): void {
      replaying = false;
    },
  };

  return controller;
}
