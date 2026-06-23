import { PlayerState, ResultType } from '../types';
import { GameRules, DEFAULT_GAME_RULES } from './game-rules';
import { clamp } from './utils';

export function updateChains(
  state: PlayerState,
  result: ResultType,
  rules: GameRules = DEFAULT_GAME_RULES
): void {
  const cr = rules.chains;
  switch (result) {
    case 'bigSuccess':
    case 'success': {
      state.successChain += 1;
      state.failureChain = 0;
      state.deathRate *= cr.successDeathRateMultiplier;
      state.luck = clamp(state.luck + cr.successLuckDelta, 0, 100);
      break;
    }
    case 'bigFailure':
    case 'failure': {
      state.failureChain += 1;
      state.successChain = 0;
      state.deathRate *= cr.failureDeathRateMultiplier;
      state.luck = clamp(state.luck + cr.failureLuckDelta, 0, 100);
      break;
    }
    case 'normal': {
      // 缓慢衰减到 0
      state.successChain = state.successChain > 0 ? state.successChain - cr.normalDecay : 0;
      state.failureChain = state.failureChain > 0 ? state.failureChain - cr.normalDecay : 0;
      break;
    }
  }

  // 保持 deathRate 在合理范围
  state.deathRate = clamp(state.deathRate, cr.deathRateMin, cr.deathRateMax);
}
