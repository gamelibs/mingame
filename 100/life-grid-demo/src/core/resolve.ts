import { Behavior, PlayerState, ResultType } from '../types';
import { GameRules, DEFAULT_GAME_RULES } from './game-rules';

export function calcAttrBonus(
  behavior: Behavior,
  state: PlayerState,
  rules: GameRules = DEFAULT_GAME_RULES
): number {
  let multiplier = 1;
  const tags = behavior.tags;
  const coeff = rules.attrBonus;

  if (tags.includes('知识')) multiplier += state.knowledge * coeff.knowledgeCoeff;
  if (tags.includes('技能')) multiplier += state.skill * coeff.skillCoeff;
  if (tags.includes('财富') || tags.includes('金钱')) multiplier += state.wealth * coeff.wealthCoeff;
  if (tags.includes('社交') || tags.includes('人脉')) multiplier += state.social * coeff.socialCoeff;
  if (tags.includes('健康')) multiplier += state.health * coeff.healthCoeff;
  if (tags.includes('魅力') || tags.includes('影响力') || tags.includes('声望'))
    multiplier += state.charm * coeff.charmCoeff;
  if (tags.includes('运气')) multiplier += state.luck * coeff.luckCoeff;

  return multiplier;
}

export function resolveResult(
  behavior: Behavior,
  riskLevel: number,
  state: PlayerState,
  rules: GameRules = DEFAULT_GAME_RULES
): { result: ResultType; score: number; attrMultiplier: number } {
  const attrMultiplier = calcAttrBonus(behavior, state, rules);
  const rr = rules.resolution;
  const randomFactor = rr.randomFactorMin + Math.random() * (rr.randomFactorMax - rr.randomFactorMin);
  const balancePenalty = state.lifeBalance < rr.balancePenaltyThreshold ? rr.balancePenaltyFactor : rr.balancePenaltyNormal;

  const chainFactor =
    state.failureChain > 0
      ? Math.pow(rr.chainFailureBase, state.failureChain)
      : Math.pow(rr.chainSuccessBase, state.successChain);

  const score =
    behavior.rewardLevel *
    riskLevel *
    attrMultiplier *
    randomFactor *
    balancePenalty *
    chainFactor;

  // 以该行为的期望收益为基准，计算相对表现
  const expectedScore = behavior.rewardLevel * riskLevel;
  const ratio = expectedScore > 0 ? score / expectedScore : 0;

  let result: ResultType;
  if (ratio < rr.bigFailureThreshold) {
    result = 'bigFailure';
  } else if (ratio < rr.failureThreshold) {
    result = 'failure';
  } else if (ratio < rr.normalThreshold) {
    result = 'normal';
  } else if (ratio < rr.successThreshold) {
    result = 'success';
  } else {
    result = 'bigSuccess';
  }

  return { result, score: ratio, attrMultiplier };
}
