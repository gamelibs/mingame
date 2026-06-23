import { GameEvent, PlayerState } from '../types';
import { GameRules, DEFAULT_GAME_RULES } from './game-rules';
import { clamp } from './utils';

function applyEventEffects(state: PlayerState, event: GameEvent): void {
  const effects = event.effects;
  if (effects.health !== undefined) state.health += effects.health;
  if (effects.wealth !== undefined) state.wealth += effects.wealth;
  if (effects.knowledge !== undefined) state.knowledge += effects.knowledge;
  if (effects.skill !== undefined) state.skill += effects.skill;
  if (effects.social !== undefined) state.social += effects.social;
  if (effects.happy !== undefined) state.happy += effects.happy;
  if (effects.charm !== undefined) state.charm += effects.charm;
  if (effects.luck !== undefined) state.luck += effects.luck;

  state.health = clamp(state.health, 0, 100);
  state.wealth = Math.max(0, state.wealth);
  state.knowledge = clamp(state.knowledge, 0, 100);
  state.skill = clamp(state.skill, 0, 100);
  state.social = clamp(state.social, 0, 100);
  state.happy = clamp(state.happy, 0, 100);
  state.charm = clamp(state.charm, 0, 100);
  state.luck = clamp(state.luck, 0, 100);
}

export function triggerEvent(
  state: PlayerState,
  events: GameEvent[],
  timing: 'start' | 'afterChoice',
  rules: GameRules = DEFAULT_GAME_RULES
): GameEvent | null {
  const er = rules.events;

  // 1. 按年龄范围过滤
  let candidates = events.filter(
    (e) =>
      (e.minAge === undefined || state.age >= e.minAge) &&
      (e.maxAge === undefined || state.age <= e.maxAge)
  );

  // timing 过滤：start 阶段主要触发普通/时代/健康/家庭类，afterChoice 可触发全部
  if (timing === 'start') {
    candidates = candidates.filter(
      (e) =>
        e.type === 'normal' ||
        e.type === 'era' ||
        e.type === 'health' ||
        e.type === 'family'
    );
  }

  if (candidates.length === 0) {
    return null;
  }

  // 2. 按事件类型调整权重
  const weightedEvents = candidates.map((e) => {
    let weight = e.weight;
    if (e.type === 'lucky') {
      weight *= (1 + state.successChain * er.luckySuccessChainBonus);
    } else if (e.type === 'crisis') {
      weight *=
        (1 + state.failureChain * er.crisisFailureChainBonus) *
        (1 + (100 - state.lifeBalance) * er.crisisImbalanceBonus);
    }
    return { event: e, weight };
  });

  const totalWeight = weightedEvents.reduce((sum, item) => sum + item.weight, 0);

  // 3. 保留不触发概率
  const noneWeight = totalWeight * er.noneWeightRatio;
  const roll = Math.random() * (totalWeight + noneWeight);

  if (roll >= totalWeight) {
    return null;
  }

  let cumulative = 0;
  for (const item of weightedEvents) {
    cumulative += item.weight;
    if (roll < cumulative) {
      // 4. 将事件效果应用到 state
      applyEventEffects(state, item.event);
      return item.event;
    }
  }

  return null;
}
