import { Behavior, PlayerState } from '../types';
import { getAgeConfig } from '../data/age-config';
import { CATEGORY_ORDER } from './category';
import { GameRules, DEFAULT_GAME_RULES } from './game-rules';
import { shuffle } from './utils';

/**
 * 根据年龄决定当前可开放的事件类别，使棋盘展示更符合人生阶段。
 */
function getAllowedCategories(age: number, rules: GameRules): string[] {
  const bp = rules.behaviorPool;
  if (age <= bp.infantMaxAge) {
    // 婴幼儿：基础成长、启蒙教育、家庭陪伴、兴趣探索，以及年龄适配的风险/机遇事件
    return ['成长', '教育', '家庭', '兴趣', '风险', '机遇'];
  }
  if (age <= bp.childMaxAge) {
    // 儿童：加入系统教育与社交
    return ['成长', '教育', '家庭', '兴趣', '社交', '风险', '机遇'];
  }
  if (age <= bp.teenMaxAge) {
    // 青少年：加入感情
    return ['成长', '教育', '家庭', '兴趣', '社交', '感情', '风险', '机遇'];
  }
  if (age <= bp.youngMaxAge) {
    // 青年：加入事业与投资
    return ['成长', '教育', '家庭', '兴趣', '社交', '感情', '事业', '投资', '风险', '机遇'];
  }
  // 成年以后：全部类别
  return [...CATEGORY_ORDER];
}

/**
 * 轮询采样：把行为尽量分散到不同的“类别 × 风险等级”格子中，
 * 让每个类别列都能展示多个风险级别的卡牌。
 * 每个类别内的风险顺序会被打乱，避免永远只出现低风险。
 */
function sampleAcrossCategories(
  pool: Behavior[],
  targetCount: number
): Behavior[] {
  if (pool.length <= targetCount) {
    return shuffle(pool);
  }

  const usedIds = new Set<string>();
  const result: Behavior[] = [];

  // 按类别 -> 风险等级 分组
  const byCategory = new Map<string, Map<number, Behavior[]>>();
  for (const b of pool) {
    if (!byCategory.has(b.category)) {
      byCategory.set(b.category, new Map());
    }
    const byRisk = byCategory.get(b.category)!;
    if (!byRisk.has(b.riskLevel)) {
      byRisk.set(b.riskLevel, []);
    }
    byRisk.get(b.riskLevel)!.push(b);
  }

  const categories: string[] = CATEGORY_ORDER.filter((c) => byCategory.has(c));

  // 为每个类别准备一个打乱的风险等级队列
  const categoryRiskQueue = new Map<string, number[]>();
  for (const category of categories) {
    categoryRiskQueue.set(
      category,
      shuffle(Array.from(byCategory.get(category)!.keys()))
    );
  }

  let activeCategories = [...categories];

  // 轮询类别：每轮每个类别从自己的风险队列中取一个未使用的风险等级
  while (result.length < targetCount && activeCategories.length > 0) {
    const stillActive: string[] = [];

    for (const category of activeCategories) {
      if (result.length >= targetCount) break;

      const queue = categoryRiskQueue.get(category)!;
      let pick: Behavior | null = null;

      while (queue.length > 0 && !pick) {
        const risk = queue.shift()!;
        const list = byCategory.get(category)!.get(risk) || [];
        const available = list.filter((b) => !usedIds.has(b.id));
        if (available.length > 0) {
          pick = shuffle(available)[0];
        }
      }

      if (pick) {
        result.push(pick);
        usedIds.add(pick.id);
        stillActive.push(category);
      }
    }

    activeCategories = stillActive;
  }

  // 若目标数量仍未达到，从剩余行为中随机补充
  if (result.length < targetCount) {
    const remaining = shuffle(pool.filter((b) => !usedIds.has(b.id)));
    for (const b of remaining) {
      if (result.length >= targetCount) break;
      result.push(b);
      usedIds.add(b.id);
    }
  }

  return result;
}

export function generateBehaviorPool(
  state: PlayerState,
  allBehaviors: Behavior[],
  mode: 'modern' | 'apocalypse' = 'modern',
  rules: GameRules = DEFAULT_GAME_RULES
): Behavior[] {
  const { age, wealth, successChain, failureChain } = state;
  const bp = rules.behaviorPool;
  const ageConfig = getAgeConfig(age);

  // 1. 按 minAge 和 maxAge 过滤
  let pool = allBehaviors.filter(
    (b) => age >= b.minAge && age <= b.maxAge
  );

  // 2 & 3. 根据年龄段配置获取 maxRisk，只保留 riskLevel <= maxRisk 的行为
  pool = pool.filter((b) => b.riskLevel <= ageConfig.maxRisk);

  // 3.5 根据人生阶段过滤可开放的事件类别
  const allowedCategories = new Set(getAllowedCategories(age, rules));
  pool = pool.filter((b) => allowedCategories.has(b.category));

  // 3.6 重复行为冷却：最近 N 回合选过的行为不再出现，避免连续重复
  const cooldownRounds = rules.behaviorPool.repeatCooldownRounds;
  if (cooldownRounds > 0 && state.history.length > 0) {
    const recentIds = new Set<string>();
    for (let i = 1; i <= cooldownRounds; i++) {
      const h = state.history[state.history.length - i];
      if (h) recentIds.add(h.behaviorId);
    }
    pool = pool.filter((b) => !recentIds.has(b.id));
  }

  // 4. 财富加成
  let wealthBonus = 0;
  if (ageConfig.unlockThreshold > 0) {
    wealthBonus = Math.min(
      Math.floor(wealth / ageConfig.unlockThreshold),
      ageConfig.wealthBonusMax
    );
  }
  // 低龄时财富加成受限
  if (age <= bp.wealthBonusCapAge) {
    wealthBonus = Math.min(wealthBonus, bp.wealthBonusCap);
  }

  // 5. 失败链限制：只能选低风险
  if (failureChain >= bp.failureChainThreshold) {
    pool = pool.filter((b) => b.riskLevel <= bp.lowRiskLimit);
  }

  // 6. 成功链奖励：解锁高阶或财富解锁行为
  if (successChain >= bp.successChainThreshold) {
    pool = pool.filter(
      (b) => b.riskLevel >= bp.highRiskLimit || b.unlockWealth <= wealth
    );
  }

  // 7. 目标数量
  const targetCount = Math.min(
    ageConfig.baseCount + wealthBonus,
    allBehaviors.length
  );

  // 8. 轮询采样，确保 10 大类别尽量均衡出现
  let result = sampleAcrossCategories(pool, targetCount);

  // 9. 保底：至少返回 minPoolSize 个行为（优先在允许类别内补充）
  if (result.length < bp.minPoolSize) {
    const existingIds = new Set(result.map((b) => b.id));
    const makeFallback = (respectCategory: boolean) =>
      allBehaviors
        .filter((b) => age >= b.minAge && age <= b.maxAge)
        .filter((b) => b.riskLevel <= ageConfig.maxRisk)
        .filter((b) => !existingIds.has(b.id))
        .filter((b) => !respectCategory || allowedCategories.has(b.category))
        .sort((a, b) => a.riskLevel - b.riskLevel);

    for (const b of makeFallback(true)) {
      if (result.length >= bp.minPoolSize) break;
      result.push(b);
      existingIds.add(b.id);
    }

    // 允许类别仍不足时，再放宽类别限制
    for (const b of makeFallback(false)) {
      if (result.length >= bp.minPoolSize) break;
      result.push(b);
      existingIds.add(b.id);
    }
  }

  return result;
}
