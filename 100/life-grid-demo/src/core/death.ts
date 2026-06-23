import { EffectSnapshot, PlayerState } from '../types';
import { getBaseDeathRateByAge } from '../data/death-table';
import { clamp } from './utils';
import { GameRules, DEFAULT_GAME_RULES } from './game-rules';

export interface DeathResolution {
  /** 是否死亡 */
  died: boolean;
  /** 死亡原因（仅死亡时有效） */
  reason?: string;
  /** 临终征兆文案（仅死亡时有效） */
  preDeathStory?: string;
  /** 疾病带来的状态变化（未死亡时有效） */
  illnessEffects?: EffectSnapshot;
  /** 疾病相关文案（未死亡时有效） */
  illnessEvent?: string;
}

function clampState(state: PlayerState): void {
  state.health = clamp(state.health, 0, 100);
  state.wealth = clamp(state.wealth, 0, Number.MAX_SAFE_INTEGER);
  state.knowledge = clamp(state.knowledge, 0, 100);
  state.skill = clamp(state.skill, 0, 100);
  state.social = clamp(state.social, 0, 100);
  state.happy = clamp(state.happy, 0, 100);
  state.charm = clamp(state.charm, 0, 100);
  state.luck = clamp(state.luck, 0, 100);
  state.lifeBalance = clamp(state.lifeBalance, 0, 100);
}

function treatmentScore(state: PlayerState, rules: GameRules): number {
  const tr = rules.illness;
  // 健康、财富、运势共同决定治疗效果：
  // 健康好则抗病力强；财富高则能获得更好的医治；运势影响恢复机缘
  return Math.min(
    tr.treatmentScoreCap,
    (state.health / 100) * tr.treatmentHealthWeight +
      Math.min(state.wealth, tr.treatmentWealthCap) / tr.treatmentWealthCap * tr.treatmentWealthWeight +
      (state.luck / 100) * tr.treatmentLuckWeight
  );
}

function oldAgeDeath(story: string, reason: string): DeathResolution {
  return { died: true, reason, preDeathStory: story };
}

/**
 * 判定本年度的生死结果。
 *
 * 设计目标：
 * 1. 40~59 岁：每年有 20% 概率罹患重病；重病后若医治无效则死亡，否则健康/财富大幅下降。
 * 2. 60~100 岁：每年有 80% 概率陷入重病或身体机能衰竭；死亡概率显著上升。
 * 3. 少数健康/财富/运势俱佳的人能在重病中康复或带病维持，最终寿终正寝到 80~120 岁。
 */
export function resolveDeath(
  state: PlayerState,
  maxAge: number,
  rules: GameRules = DEFAULT_GAME_RULES
): DeathResolution {
  const { age, isCriticallyIll } = state;

  // 到达最大年龄：寿终正寝
  if (age >= maxAge) {
    return oldAgeDeath(
      '你感到生命之烛即将燃尽，内心却异常平静。',
      '寿终正寝，走完了人生的全程。'
    );
  }

  const score = treatmentScore(state, rules);
  const illness = rules.illness;

  // 已处于重病状态：每年都面临死亡考验，也有康复可能
  if (isCriticallyIll) {
    const baseDeath = age >= 60 ? illness.deathBase60Plus : illness.deathBase40_59;
    const treatmentFactor = age >= 60 ? illness.treatmentFactorOld : illness.treatmentFactorYoung;
    const deathChance = baseDeath * Math.max(illness.minDeathMultiplier, 1 - score * treatmentFactor);

    if (Math.random() < deathChance) {
      return oldAgeDeath(
        '久病缠身，这一年病情急转直下，医治已无力回天。',
        age >= 60 ? '年老病重，医治无效离世。' : '重疾不治，生命戛然而止。'
      );
    }

    // 康复概率：健康、财富、运势越高越容易好转
    const recoveryChance = Math.min(
      illness.recoveryCap,
      illness.recoveryBase +
        state.health * illness.recoveryHealthFactor +
        Math.min(state.wealth, illness.recoveryWealthCap) * illness.recoveryWealthFactor +
        state.luck * illness.recoveryLuckFactor
    );

    if (Math.random() < recoveryChance) {
      const beforeHealth = state.health;
      const beforeHappy = state.happy;
      state.isCriticallyIll = false;
      state.health += Math.round(illness.recoveryHealthBase + Math.random() * illness.recoveryHealthRandom);
      state.happy += Math.round(illness.recoveryHappyBase + Math.random() * illness.recoveryHappyRandom);
      clampState(state);
      return {
        died: false,
        illnessEffects: {
          health: state.health - beforeHealth,
          happy: state.happy - beforeHappy,
        },
        illnessEvent: '病情好转，身体逐渐康复',
      };
    }

    // 带病维持：长期治疗持续消耗健康与财富
    const beforeHealth = state.health;
    const beforeWealth = state.wealth;
    const beforeHappy = state.happy;
    const maintenanceHealth = Math.round(illness.maintenanceHealthBase + Math.random() * illness.maintenanceHealthRandom);
    const maintenanceWealth = Math.round(illness.maintenanceWealthBase + age * illness.maintenanceWealthAgeCoeff + Math.random() * illness.maintenanceWealthRandom);
    state.health -= maintenanceHealth;
    state.wealth -= maintenanceWealth;
    state.happy -= Math.round(illness.maintenanceHappyBase + Math.random() * illness.maintenanceHappyRandom);
    clampState(state);
    return {
      died: false,
      illnessEffects: {
        health: state.health - beforeHealth,
        wealth: state.wealth - beforeWealth,
        happy: state.happy - beforeHappy,
      },
      illnessEvent: '久病未愈，持续治疗中',
    };
  }

  // 新重大疾病判定
  let illnessChance = 0;
  if (age >= 60) {
    illnessChance = illness.illnessChance60Plus;
  } else if (age >= 40) {
    illnessChance = illness.illnessChance40_59;
  }

  if (Math.random() < illnessChance) {
    const baseDeath = age >= 60 ? illness.deathBase60Plus : illness.deathBase40_59;
    const treatmentFactor = age >= 60 ? illness.treatmentFactorOld : illness.treatmentFactorYoung;
    const deathChance = baseDeath * Math.max(illness.minDeathMultiplier, 1 - score * treatmentFactor);

    if (Math.random() < deathChance) {
      return oldAgeDeath(
        '一场大病突如其来，尽管全力救治，生命仍走到了尽头。',
        age >= 60 ? '年老病重，医治无效离世。' : '重疾不治，猝然离世。'
      );
    }

    // 挺过疾病，但付出了沉重代价
    const beforeHealth = state.health;
    const beforeWealth = state.wealth;
    const beforeHappy = state.happy;
    const beforeSocial = state.social;

    state.isCriticallyIll = true;
    const severity = Math.max(illness.severityMin, illness.severityBase - score * illness.severityScoreCoeff);
    const healthLoss = Math.round((illness.healthLossBase + age * illness.healthLossAgeCoeff) * severity);
    const wealthLoss = Math.round((illness.wealthLossBase + age * illness.wealthLossAgeCoeff) * severity);
    const happyLoss = Math.round(illness.happyLossBase + severity * illness.happyLossSeverityCoeff);
    const socialLoss = Math.round(severity * illness.socialLossSeverityCoeff);

    state.health -= healthLoss;
    state.wealth -= wealthLoss;
    state.happy -= happyLoss;
    state.social -= socialLoss;
    clampState(state);

    return {
      died: false,
      illnessEffects: {
        health: state.health - beforeHealth,
        wealth: state.wealth - beforeWealth,
        happy: state.happy - beforeHappy,
        social: state.social - beforeSocial,
      },
      illnessEvent: age >= 60 ? '年老体衰，重病一场' : '突发重疾，经治疗保住性命',
    };
  }

  // 无重病时的自然衰老死亡（健康会显著降低该概率，避免年轻且健康时“突然老死”）
  const baseNaturalRate = getBaseDeathRateByAge(age);
  const naturalMultiplier = Math.max(
    illness.naturalDeathMinMultiplier,
    1 - (state.health / 100) * illness.naturalDeathHealthFactor
  );
  const naturalRate = baseNaturalRate * naturalMultiplier;
  if (Math.random() < naturalRate) {
    return oldAgeDeath(
      '年迈的身体在不知不觉中走到了尽头。',
      '年老体衰，在平静中离世。'
    );
  }

  return { died: false };
}

// 保留旧接口兼容性（测试/历史代码可能仍调用）
export function calculateDeathRate(
  state: PlayerState,
  rules: GameRules = DEFAULT_GAME_RULES
): number {
  const lastChoice = state.history[state.history.length - 1];
  const lastRisk = lastChoice ? lastChoice.y : 1;
  const riskFactor =
    rules.illness.lastRiskDeathFactorBase +
    (lastRisk - 1) * rules.illness.lastRiskDeathFactorCoeff;
  return getBaseDeathRateByAge(state.age) * riskFactor;
}

export function checkDeath(
  state: PlayerState,
  rules: GameRules = DEFAULT_GAME_RULES
): boolean {
  return Math.random() < calculateDeathRate(state, rules);
}
