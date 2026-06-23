import { Behavior, PlayerState, ResultType } from '../types';
import { GameRules, DEFAULT_GAME_RULES } from './game-rules';
import { clamp } from './utils';

export function updateLifeBalance(
  state: PlayerState,
  behavior: Behavior,
  result: ResultType,
  rules: GameRules = DEFAULT_GAME_RULES
): number {
  const br = rules.balance;
  let delta = behavior.balanceEffect;

  // 如果上一回合行为和本次相同
  const lastChoice = state.history[state.history.length - 1];
  if (lastChoice && lastChoice.behaviorId === behavior.id) {
    delta -= br.repeatBehaviorPenalty;
  }

  // 结果影响
  switch (result) {
    case 'bigSuccess':
      delta += br.bigSuccessDelta;
      break;
    case 'success':
      delta += br.successDelta;
      break;
    case 'failure':
      delta += br.failureDelta;
      break;
    case 'bigFailure':
      delta += br.bigFailureDelta;
      break;
    case 'normal':
    default:
      break;
  }

  // 如果 wealth > health * threshold
  if (state.wealth > state.health * br.wealthHealthRatioThreshold) {
    delta -= br.wealthHealthRatioPenalty;
  }

  // 如果 happy < threshold
  if (state.happy < br.lowHappyThreshold) {
    delta -= br.lowHappyPenalty;
  }

  state.lifeBalance = clamp(state.lifeBalance + delta, 0, 100);
  return state.lifeBalance;
}
