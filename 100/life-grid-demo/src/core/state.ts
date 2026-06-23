import { PlayerState } from '../types';
import { GameRules, DEFAULT_GAME_RULES } from './game-rules';
import { LifeGoal } from './life-goals';
import { clamp } from './utils';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createInitialState(
  rules: GameRules = DEFAULT_GAME_RULES,
  lifeGoal?: LifeGoal
): PlayerState {
  const init = rules.initialState;
  const state: PlayerState = {
    age: init.ageInitial,
    health: init.healthInitial,
    wealth: init.wealthInitial,
    knowledge: init.knowledgeInitial,
    skill: init.skillInitial,
    social: init.socialInitial,
    happy: init.happyInitial,
    // 魅力初始较低，随人生阶段自然上升后下降
    charm: randomInt(rules.lifecycle.charmInitialMin, rules.lifecycle.charmInitialMax),
    // 运势初始差异大，并在人生中持续波动
    luck: randomInt(init.luckInitialMin, init.luckInitialMax),
    lifeBalance: init.lifeBalanceInitial,
    successChain: init.successChainInitial,
    failureChain: init.failureChainInitial,
    deathRate: init.deathRateInitial,
    isCriticallyIll: false,
    history: [],
    lifeGoal,
  };

  // 应用人生目标初始加成
  if (lifeGoal?.bonuses) {
    for (const [attr, bonus] of Object.entries(lifeGoal.bonuses)) {
      const key = attr as keyof PlayerState;
      if (typeof state[key] === 'number' && bonus !== undefined) {
        (state[key] as number) = clamp((state[key] as number) + bonus, 0, 100);
      }
    }
  }

  return state;
}

export function snapshotState(state: PlayerState): PlayerState {
  return JSON.parse(JSON.stringify(state));
}
