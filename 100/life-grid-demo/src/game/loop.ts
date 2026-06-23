import { Behavior, PlayerState } from '../types';
import { createInitialState } from '../core/state';
import { generateBehaviorPool } from '../core/behavior-pool';
import { resolveResult } from '../core/resolve';
import { applyEffects, applyAging } from '../core/effects';
import { updateLifeBalance } from '../core/balance';
import { updateChains } from '../core/chains';
import { triggerEvent } from '../core/events';
import { checkDeath } from '../core/death';
import { mapBehaviorsToGrid } from '../ui/grid';
import { renderGameScreen } from '../ui/render';
import { simulatePlayerChoice, SimulatedInput } from '../ui/input';
import { modernBehaviors } from '../data/modern-behaviors';
import { apocalypseBehaviors } from '../data/apocalypse-behaviors';
import { gameEvents } from '../data/events';
import { calcYearEnergy } from './settlement';
import { GameRules, loadGameRules, normalizeGameRules } from '../core/game-rules';

export interface GameConfig {
  mode: 'modern' | 'apocalypse';
  maxAge: number;
  autoPlay: boolean; // true 表示自动模拟玩家选择
  logEachTurn: boolean; // 是否打印每回合详情
  /** 可选的自定义规则；未指定时从 localStorage / 默认值加载 */
  rules?: GameRules;
}

/**
 * 获取玩家输入。
 * 当 autoPlay 为 true 时使用模拟选择；否则同样回退到模拟选择，
 * 以保证 CLI Demo 无需交互即可运行。
 */
function getPlayerInput(
  state: PlayerState,
  grid: (Behavior | null)[][],
  config: GameConfig,
  rules: GameRules
): SimulatedInput {
  if (config.autoPlay) {
    return simulatePlayerChoice(state, grid, rules);
  }
  return simulatePlayerChoice(state, grid, rules);
}

/**
 * 运行一局游戏，返回最终玩家状态。
 */
export function runGame(config: GameConfig): PlayerState {
  const rules = config.rules ?? normalizeGameRules(loadGameRules());
  const state = createInitialState(rules);
  state.energyCurve = [calcYearEnergy(state)];

  const behaviors = config.mode === 'modern' ? modernBehaviors : apocalypseBehaviors;
  const events = gameEvents;

  while (state.age <= config.maxAge) {
    // 1. 回合开始事件
    const startEvent = triggerEvent(state, events, 'start', rules);

    // 2. 生成行为池
    const pool = generateBehaviorPool(state, behaviors, config.mode, rules);

    // 3. 映射到网格
    const grid = mapBehaviorsToGrid(pool);

    // 4. 玩家选择（自动或解析输入）
    const input = getPlayerInput(state, grid, config, rules);
    const selectedBehavior = grid[input.y - 1][input.x - 1];

    if (!selectedBehavior) {
      // 选择空位，视为休息/跳过
      state.age++;
      applyAging(state, rules);
      state.energyCurve.push(calcYearEnergy(state));
      continue;
    }

    // 5. 结果判定
    const { result, score } = resolveResult(selectedBehavior, input.y, state, rules);

    // 6. 应用效果
    const effects = applyEffects(state, selectedBehavior, result, input.weight, rules);

    // 7. 更新平衡度和连锁
    updateLifeBalance(state, selectedBehavior, result, rules);
    updateChains(state, result, rules);

    // 8. 行为结算后事件
    const afterEvent = triggerEvent(state, events, 'afterChoice', rules);

    // 9. 记录历史
    state.history.push({
      age: state.age,
      x: input.x,
      y: input.y,
      behaviorId: selectedBehavior.id,
      behaviorName: selectedBehavior.name,
      weight: input.weight,
      result,
      effects,
      event: startEvent?.title || afterEvent?.title
    });

    // 10. 输出回合日志
    if (config.logEachTurn) {
      console.log(`\n===== 第 ${state.age} 年 =====`);
      console.log(renderGameScreen(state, grid));
      console.log(
        `选择: ${selectedBehavior.name} [n${input.y}] 结果: ${result} 评分: ${score.toFixed(1)}`
      );
      if (startEvent) {
        console.log(`事件: ${startEvent.title} - ${startEvent.description}`);
      }
      if (afterEvent) {
        console.log(`事件: ${afterEvent.title} - ${afterEvent.description}`);
      }
    }

    state.energyCurve.push(calcYearEnergy(state));

    // 11. 死亡判定
    if (checkDeath(state, rules)) {
      if (config.logEachTurn) {
        console.log(`\n💀 第 ${state.age} 年，你去世了。`);
      }
      break;
    }

    // 12. 年龄增长
    state.age++;
    applyAging(state, rules);
  }

  return state;
}
