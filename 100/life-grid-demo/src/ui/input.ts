import { Behavior, PlayerState } from '../types';
import { LifeGoalAttribute } from '../core/life-goals';
import { GameRules, DEFAULT_GAME_RULES } from '../core/game-rules';
import { randomRange, shuffle } from '../core/utils';

/** 行为类别与人生目标属性的对应关系（用于自动人生的目标驱动选择） */
const CATEGORY_ATTRIBUTES: Record<string, LifeGoalAttribute[]> = {
  成长: ['health', 'happy'],
  教育: ['knowledge', 'skill'],
  事业: ['wealth', 'skill'],
  投资: ['wealth'],
  感情: ['happy', 'social'],
  家庭: ['happy', 'health', 'social'],
  社交: ['social', 'charm'],
  兴趣: ['happy', 'charm'],
  风险: ['luck', 'wealth'],
  机遇: ['luck', 'wealth'],
};

const GRID_SIZE = 10;

export interface SimulatedInput {
  x: number; // 1-10，对应 l1 ~ l10
  y: number; // 1-10，对应 n1 ~ n10
  weight: number; // 0.1 - 1.0
}

interface GridOption {
  x: number;
  y: number;
  behavior: Behavior;
}

/**
 * 收集网格中所有非空选项。
 */
function collectOptions(grid: (Behavior | null)[][]): GridOption[] {
  const options: GridOption[] = [];
  for (let y = 1; y <= GRID_SIZE; y++) {
    for (let x = 1; x <= GRID_SIZE; x++) {
      const behavior = grid[y - 1][x - 1];
      if (behavior) {
        options.push({ x, y, behavior });
      }
    }
  }
  return options;
}

/**
 * 计算一个选项的权重，用于状态偏向选择。
 */
function scoreOption(
  option: GridOption,
  state: PlayerState,
  rules: GameRules
): number {
  const ir = rules.input;
  let score = 1;

  // 低龄玩家偏好低风险行为
  if (state.age <= ir.lowAgeMax && option.y <= ir.lowAgeRiskMax) {
    score += ir.lowAgeBonus;
  }

  // 健康低时偏向低风险 / 生存类行为
  if (state.health < ir.lowHealthThreshold && option.y <= ir.lowHealthRiskMax) {
    score += ir.lowHealthBonus;
  }

  // 中年玩家可接受适度风险
  if (
    state.age >= ir.middleAgeMin &&
    state.age <= ir.middleAgeMax &&
    option.y >= ir.middleRiskMin &&
    option.y <= ir.middleRiskMax
  ) {
    score += ir.middleAgeBonus;
  }

  // 高龄玩家偏好低风险
  if (state.age >= ir.elderlyAgeMin && option.y <= ir.elderlyRiskMax) {
    score += ir.elderlyBonus;
  }

  // 失败链高时，强烈偏好低风险
  if (state.failureChain >= ir.failureChainThreshold && option.y <= ir.failureChainRiskMax) {
    score += ir.failureChainBonus;
  }

  // 成功链高时，可接受更高风险
  if (state.successChain >= ir.successChainThreshold && option.y >= ir.successChainRiskMin) {
    score += ir.successChainBonus;
  }

  // 风险越低基础分越高
  score += (GRID_SIZE - option.y) * ir.riskRowScoreCoeff;

  // 人生目标驱动：优先选择能提升目标相关属性的行为类别
  if (state.lifeGoal) {
    const attrs = CATEGORY_ATTRIBUTES[option.behavior.category] ?? [];
    let matched = false;
    for (const [attr, bonus] of Object.entries(state.lifeGoal.bonuses)) {
      if (bonus && attrs.includes(attr as LifeGoalAttribute)) {
        score += bonus * ir.lifeGoalAttributeCoeff;
        matched = true;
      }
    }
    if (matched) {
      score += ir.lifeGoalCategoryCoeff;
    }
  }

  return score;
}

function randomWeight(rules: GameRules): number {
  const ir = rules.input;
  return Number(randomRange(ir.weightMin, ir.weightMax).toFixed(2));
}

/**
 * 模拟玩家选择：根据当前状态和行为池，返回一个选择。
 */
export function simulatePlayerChoice(
  state: PlayerState,
  grid: (Behavior | null)[][],
  rules: GameRules = DEFAULT_GAME_RULES
): SimulatedInput {
  const options = collectOptions(grid);

  if (options.length === 0) {
    // 没有可用行为时，返回一个默认空选择
    return { x: 1, y: 1, weight: rules.input.defaultWeight };
  }

  // 加权随机选择
  const scoredOptions = options.map((option) => ({
    option,
    score: scoreOption(option, state, rules)
  }));

  const totalScore = scoredOptions.reduce((sum, item) => sum + item.score, 0);
  let pick = Math.random() * totalScore;

  for (const item of scoredOptions) {
    pick -= item.score;
    if (pick <= 0) {
      return {
        x: item.option.x,
        y: item.option.y,
        weight: randomWeight(rules)
      };
    }
  }

  // 兜底：随机一个
  const fallback = shuffle(options)[0];
  return {
    x: fallback.x,
    y: fallback.y,
    weight: randomWeight(rules)
  };
}

/**
 * 解析玩家输入为坐标。
 * 支持格式："l3n2"、"L3N2"、"3,2"、"3 2"。
 */
export function parsePlayerInput(
  grid: (Behavior | null)[][],
  input: string,
  rules: GameRules = DEFAULT_GAME_RULES
): SimulatedInput | null {
  const trimmed = input.trim().toLowerCase();

  let x = 0;
  let y = 0;

  // 格式 l3n2 或 L3N2
  const lnMatch = trimmed.match(/^l(\d{1,2})n(\d{1,2})$/);
  if (lnMatch) {
    x = parseInt(lnMatch[1], 10);
    y = parseInt(lnMatch[2], 10);
  } else {
    // 格式 3,2 或 3 2
    const commaMatch = trimmed.match(/^(\d{1,2})[,\s](\d{1,2})$/);
    if (commaMatch) {
      x = parseInt(commaMatch[1], 10);
      y = parseInt(commaMatch[2], 10);
    } else {
      return null;
    }
  }

  if (x < 1 || x > GRID_SIZE || y < 1 || y > GRID_SIZE) return null;
  if (!grid[y - 1][x - 1]) return null;

  return { x, y, weight: randomWeight(rules) };
}
