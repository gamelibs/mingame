import { Behavior, EffectSnapshot, PlayerState, ResultType } from '../types';
import { clamp } from './utils';
import { GameRules, DEFAULT_GAME_RULES } from './game-rules';

function clampStateValue(state: PlayerState): void {
  state.health = clamp(state.health, 0, 100);
  state.wealth = clamp(state.wealth, 0, Number.MAX_SAFE_INTEGER);
  state.knowledge = clamp(state.knowledge, 0, 100);
  state.skill = clamp(state.skill, 0, 100);
  state.social = clamp(state.social, 0, 100);
  state.happy = clamp(state.happy, 0, 100);
  state.charm = clamp(state.charm, 0, 100);
  state.luck = clamp(state.luck, 0, 100);
  state.lifeBalance = clamp(state.lifeBalance, 0, 100);
  state.deathRate = clamp(state.deathRate, 0.0001, 1);
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 应用年龄生命周期带来的自然变化（除衰老健康衰减外）。
 * - 魅力：0~50 岁随年龄成长，50 岁后随年龄下降。
 * - 运势：每年都会有一定随机波动，造成人生运势差异巨大。
 */
export function applyLifecycleEffects(
  state: PlayerState,
  rules: GameRules = DEFAULT_GAME_RULES
): void {
  const age = state.age;

  // 魅力生命周期：年轻时长身体/气质，到达峰值年龄后逐渐衰退
  const lc = rules.lifecycle;
  if (age <= lc.charmGrowthPeakAge) {
    const ratio = (lc.charmGrowthPeakAge - age) / lc.charmGrowthPeakAge;
    const growth = lc.charmGrowthBase * (1 + ratio);
    state.charm += growth;
  } else {
    const ratio =
      (age - lc.charmGrowthPeakAge) /
      Math.max(1, lc.charmDeclineMaxAge - lc.charmGrowthPeakAge);
    const decline = lc.charmDeclineBase * (1 + ratio);
    state.charm -= decline;
  }

  // 运势波动：每年随机震荡，造成人生运势差异巨大
  const luckDrift = randomInt(lc.luckYearlyDriftMin, lc.luckYearlyDriftMax);
  state.luck += luckDrift;

  clampStateValue(state);
}

function createTagMatchers(behavior: Behavior) {
  const tags = behavior.tags;
  const has = (tag: string) => tags.includes(tag);
  return {
    health: () => has('健康'),
    wealth: () => has('财富') || has('金钱'),
    knowledge: () => has('知识'),
    skill: () => has('技能'),
    social: () => has('社交') || has('人脉'),
    happy: () => has('幸福') || has('爱情') || has('家庭'),
    charm: () => has('魅力') || has('影响力') || has('声望'),
    luck: () => has('运气'),
  };
}

function allocateByCategory(behavior: Behavior): Partial<Record<keyof EffectSnapshot, boolean>> {
  const category = behavior.category;
  const map: Partial<Record<keyof EffectSnapshot, boolean>> = {};

  // 事件类别作为属性影响的兜底映射；具体行为仍由 tags 决定
  if (category === '成长') map.health = true;
  if (category === '教育') map.knowledge = true;
  if (category === '事业') map.skill = true;
  if (category === '投资') map.wealth = true;
  if (category === '感情') map.happy = true;
  if (category === '家庭') {
    map.happy = true;
    map.social = true;
  }
  if (category === '社交') map.social = true;
  if (category === '兴趣') {
    map.happy = true;
    map.charm = true;
  }
  if (category === '风险' || category === '机遇') map.luck = true;

  return map;
}

export function applyEffects(
  state: PlayerState,
  behavior: Behavior,
  result: ResultType,
  weight: number,
  rules: GameRules = DEFAULT_GAME_RULES
): EffectSnapshot {
  const reward = behavior.rewardLevel * weight;
  const failure = behavior.failureLevel * weight;
  const snapshot: EffectSnapshot = {};
  const tag = createTagMatchers(behavior);
  const categoryMap = allocateByCategory(behavior);

  const matches = (key: keyof EffectSnapshot): boolean => {
    return tag[key]() || categoryMap[key] === true;
  };

  const risk = behavior.riskLevel;

  function add(key: keyof EffectSnapshot, value: number): void {
    snapshot[key] = (snapshot[key] ?? 0) + value;
  }

  switch (result) {
    case 'bigSuccess': {
      const f = rules.effectFormulas.bigSuccess;
      snapshot.wealth = reward * rules.wealth.bigSuccessBaseWealthMultiplier;
      if (matches('knowledge')) add('knowledge', f.knowledgeBase + risk * f.knowledgeRiskCoeff);
      if (matches('skill')) add('skill', f.skillBase + risk * f.skillRiskCoeff);
      if (matches('social')) add('social', f.socialBase + risk * f.socialRiskCoeff);
      if (matches('happy')) add('happy', f.happyBase + risk * f.happyRiskCoeff);
      if (matches('charm')) add('charm', f.charmBase + risk * f.charmRiskCoeff);
      if (matches('wealth'))
        add('wealth', reward * (rules.wealth.bigSuccessWealthTagBonusBase + risk * rules.wealth.bigSuccessWealthRiskBonus));
      if (matches('health')) add('health', f.healthBase + risk * f.healthRiskCoeff);
      if (matches('luck')) add('luck', rules.luck.bigSuccessLuckBase + risk * rules.luck.bigSuccessLuckRiskBonus);
      break;
    }
    case 'success': {
      const f = rules.effectFormulas.success;
      snapshot.wealth = reward * rules.wealth.successWealthBaseRewardMultiplier;
      if (matches('knowledge')) add('knowledge', f.knowledgeBase + risk * f.knowledgeRiskCoeff);
      if (matches('skill')) add('skill', f.skillBase + risk * f.skillRiskCoeff);
      if (matches('social')) add('social', f.socialBase + risk * f.socialRiskCoeff);
      if (matches('happy')) add('happy', f.happyBase + risk * f.happyRiskCoeff);
      if (matches('charm')) add('charm', f.charmBase + risk * f.charmRiskCoeff);
      if (matches('wealth'))
        add('wealth', reward * (rules.wealth.successWealthBaseMultiplier + risk * rules.wealth.successWealthRiskBonus));
      if (matches('health')) add('health', f.healthBase + risk * f.healthRiskCoeff);
      if (matches('luck')) add('luck', rules.luck.successLuckBase + risk * rules.luck.successLuckRiskBonus);
      break;
    }
    case 'normal': {
      const f = rules.effectFormulas.normal;
      snapshot.wealth = reward * rules.wealth.normalBaseWealthMultiplier;
      // 普通结果只按行为本身属性微弱提升，不再无条件加健康/幸福/人脉
      if (matches('knowledge')) add('knowledge', f.knowledgeBase);
      if (matches('skill')) add('skill', f.skillBase);
      if (matches('social')) add('social', f.socialBase);
      if (matches('happy')) add('happy', f.happyBase);
      if (matches('charm')) add('charm', f.charmBase);
      if (matches('wealth')) add('wealth', reward * rules.wealth.normalWealthMultiplier);
      if (matches('health')) add('health', f.healthBase);
      if (matches('luck')) add('luck', randomInt(rules.luck.normalLuckDriftMin, rules.luck.normalLuckDriftMax));
      // 高风险行为即使普通结果也会带来轻微压力
      if (risk >= f.highRiskThreshold) {
        add('happy', f.highRiskHappyPenalty);
        add('health', risk * f.highRiskHealthCoeff);
      }
      break;
    }
    case 'failure': {
      const f = rules.effectFormulas.failure;
      snapshot.wealth = -failure * rules.wealth.failureBaseWealthMultiplier;
      add('happy', f.happyBase + risk * f.happyRiskCoeff);
      add('social', f.socialBase + risk * f.socialRiskCoeff);
      add('health', f.healthBase + risk * f.healthRiskCoeff);
      if (matches('knowledge')) add('knowledge', f.knowledgeBase);
      if (matches('skill')) add('skill', f.skillBase);
      if (matches('charm')) add('charm', f.charmBase);
      if (matches('wealth')) add('wealth', -failure * rules.wealth.failureWealthMultiplier);
      if (matches('luck')) add('luck', -(rules.luck.failureLuckBase + risk * rules.luck.failureLuckRiskBonus));
      break;
    }
    case 'bigFailure': {
      const f = rules.effectFormulas.bigFailure;
      snapshot.wealth = -failure * rules.wealth.bigFailureBaseWealthMultiplier;
      add('health', f.healthBase + risk * f.healthRiskCoeff);
      add('happy', f.happyBase + risk * f.happyRiskCoeff);
      add('social', f.socialBase + risk * f.socialRiskCoeff);
      add('charm', f.charmBase);
      if (matches('knowledge')) add('knowledge', f.knowledgeBase);
      if (matches('skill')) add('skill', f.skillBase);
      if (matches('wealth'))
        add('wealth', -failure * (rules.wealth.bigFailureBaseWealthMultiplier + risk * rules.wealth.bigFailureWealthRiskBonus));
      if (matches('luck')) add('luck', -(rules.luck.bigFailureLuckBase + risk * rules.luck.bigFailureLuckRiskBonus));
      break;
    }
  }

  // 重复行为效果递减：同一行为使用次数越多，效果越差（边际效用递减）
  const repeatCount = state.history.filter((h) => h.behaviorId === behavior.id).length;
  const repeatMultiplier = Math.max(
    rules.balance.repeatEffectPenaltyMin,
    1 - repeatCount * rules.balance.repeatEffectPenaltyCoeff
  );
  (Object.keys(snapshot) as Array<keyof EffectSnapshot>).forEach((key) => {
    const v = snapshot[key];
    if (v !== undefined) snapshot[key] = v * repeatMultiplier;
  });

  // 应用到 state
  if (snapshot.health !== undefined) state.health += snapshot.health;
  if (snapshot.wealth !== undefined) state.wealth += snapshot.wealth;
  if (snapshot.knowledge !== undefined) state.knowledge += snapshot.knowledge;
  if (snapshot.skill !== undefined) state.skill += snapshot.skill;
  if (snapshot.social !== undefined) state.social += snapshot.social;
  if (snapshot.happy !== undefined) state.happy += snapshot.happy;
  if (snapshot.charm !== undefined) state.charm += snapshot.charm;
  if (snapshot.luck !== undefined) state.luck += snapshot.luck;

  clampStateValue(state);

  return snapshot;
}

/**
 * 应用年龄自然衰减。
 * 随着年龄增长，健康会缓慢下降，使长寿越来越困难。
 */
export function applyAging(
  state: PlayerState,
  rules: GameRules = DEFAULT_GAME_RULES
): void {
  const age = state.age;
  const ar = rules.aging;

  // 50 岁后开始基础衰老
  if (age >= ar.healthDecayStartAge) {
    const decay = ar.healthDecayBase + Math.floor((age - ar.healthDecayStartAge) / ar.healthDecayAgeStep);
    state.health -= decay;
  }

  // 80 岁后额外加速衰退
  if (age >= ar.extraHealthDecayAge) {
    state.health -= ar.extraHealthDecay;
  }

  // 极高龄直接大幅扣健康，确保极少能活到最大年龄上限
  if (age >= ar.extremeHealthDecayAge) {
    state.health -= ar.extremeHealthDecay;
  }

  // 成年后幸福会自然波动下降，需要通过积极行为维持
  if (age >= ar.happyDecayStartAge) {
    state.happy -= ar.happyDecay;
  }

  clampStateValue(state);
}
