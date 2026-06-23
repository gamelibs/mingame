/**
 * 全局游戏规则配置。
 *
 * 这些参数决定了属性成长、财富波动、疾病死亡等核心机制，
 * 可在运行时通过状态面板弹窗动态调整并持久化到 localStorage。
 */

export interface LifecycleRules {
  /** 魅力初始最小值 */
  charmInitialMin: number;
  /** 魅力初始最大值 */
  charmInitialMax: number;
  /** 魅力成长期基础增速（每年） */
  charmGrowthBase: number;
  /** 魅力成长峰值年龄 */
  charmGrowthPeakAge: number;
  /** 魅力衰退期基础减速（每年） */
  charmDeclineBase: number;
  /** 魅力衰退参考最大年龄，用于计算衰退加速度 */
  charmDeclineMaxAge: number;
  /** 运势每年随机波动最小值 */
  luckYearlyDriftMin: number;
  /** 运势每年随机波动最大值 */
  luckYearlyDriftMax: number;
}

export interface WealthRules {
  /** 大成功时基础财富系数 */
  bigSuccessBaseWealthMultiplier: number;
  /** 大成功时财富额外奖励 = reward × risk × 系数 */
  bigSuccessWealthRiskBonus: number;
  /** 大成功时财富标签额外基础倍率 */
  bigSuccessWealthTagBonusBase: number;
  /** 成功时财富基础系数（标签额外） */
  successWealthBaseMultiplier: number;
  /** 成功时财富风险加成系数 */
  successWealthRiskBonus: number;
  /** 成功时基础财富奖励倍率 */
  successWealthBaseRewardMultiplier: number;
  /** 普通结果时基础财富系数 */
  normalBaseWealthMultiplier: number;
  /** 普通结果时财富标签加成系数 */
  normalWealthMultiplier: number;
  /** 失败时基础财富亏损系数 */
  failureBaseWealthMultiplier: number;
  /** 失败时财富标签亏损系数（相对于 failureLevel） */
  failureWealthMultiplier: number;
  /** 大失败时基础财富亏损系数 */
  bigFailureBaseWealthMultiplier: number;
  /** 大失败时财富风险加成系数 */
  bigFailureWealthRiskBonus: number;
}

export interface LuckRules {
  /** 大成功时运势基础加成 */
  bigSuccessLuckBase: number;
  /** 大成功时运势风险加成 */
  bigSuccessLuckRiskBonus: number;
  /** 成功时运势基础加成 */
  successLuckBase: number;
  /** 成功时运势风险加成 */
  successLuckRiskBonus: number;
  /** 普通结果时运势随机波动最小值 */
  normalLuckDriftMin: number;
  /** 普通结果时运势随机波动最大值 */
  normalLuckDriftMax: number;
  /** 失败时运势基础减益 */
  failureLuckBase: number;
  /** 失败时运势风险减益 */
  failureLuckRiskBonus: number;
  /** 大失败时运势基础减益 */
  bigFailureLuckBase: number;
  /** 大失败时运势风险减益 */
  bigFailureLuckRiskBonus: number;
}

export interface IllnessRules {
  /** 40~59 岁每年新重大疾病概率 */
  illnessChance40_59: number;
  /** 60 岁以上每年新重大疾病概率 */
  illnessChance60Plus: number;
  /** 40~59 岁重病基础死亡率（治疗前） */
  deathBase40_59: number;
  /** 60 岁以上重病基础死亡率（治疗前） */
  deathBase60Plus: number;
  /** 中青年（<60）治疗效果系数，越高则死亡概率越低 */
  treatmentFactorYoung: number;
  /** 老年（>=60）治疗效果系数 */
  treatmentFactorOld: number;
  /** 重病死亡概率最低不会低于 基础 × 该倍数 */
  minDeathMultiplier: number;

  /** 治疗效果评分上限 */
  treatmentScoreCap: number;
  /** 健康在治疗评分中的权重 */
  treatmentHealthWeight: number;
  /** 财富在治疗评分中的权重 */
  treatmentWealthWeight: number;
  /** 运势在治疗评分中的权重 */
  treatmentLuckWeight: number;
  /** 治疗评分中财富计算的上限 */
  treatmentWealthCap: number;

  /** 康复概率上限 */
  recoveryCap: number;
  /** 康复基础概率 */
  recoveryBase: number;
  /** 健康对康复概率的影响系数 */
  recoveryHealthFactor: number;
  /** 财富对康复概率计算的上限 */
  recoveryWealthCap: number;
  /** 财富对康复概率的影响系数 */
  recoveryWealthFactor: number;
  /** 运势对康复概率的影响系数 */
  recoveryLuckFactor: number;

  /** 康复时健康回复基础值 */
  recoveryHealthBase: number;
  /** 康复时健康回复随机范围 */
  recoveryHealthRandom: number;
  /** 康复时幸福回复基础值 */
  recoveryHappyBase: number;
  /** 康复时幸福回复随机范围 */
  recoveryHappyRandom: number;

  /** 带病维持时健康消耗基础值 */
  maintenanceHealthBase: number;
  /** 带病维持时健康消耗随机范围 */
  maintenanceHealthRandom: number;
  /** 带病维持时财富消耗基础值 */
  maintenanceWealthBase: number;
  /** 带病维持时财富消耗年龄系数 */
  maintenanceWealthAgeCoeff: number;
  /** 带病维持时财富消耗随机范围 */
  maintenanceWealthRandom: number;
  /** 带病维持时幸福消耗基础值 */
  maintenanceHappyBase: number;
  /** 带病维持时幸福消耗随机范围 */
  maintenanceHappyRandom: number;

  /** 新疾病严重度基础值 */
  severityBase: number;
  /** 治疗评分对严重度的削弱系数 */
  severityScoreCoeff: number;
  /** 疾病严重度最低值 */
  severityMin: number;

  /** 新疾病健康损失基础值 */
  healthLossBase: number;
  /** 新疾病健康损失年龄系数 */
  healthLossAgeCoeff: number;
  /** 新疾病财富损失基础值 */
  wealthLossBase: number;
  /** 新疾病财富损失年龄系数 */
  wealthLossAgeCoeff: number;
  /** 新疾病幸福损失基础值 */
  happyLossBase: number;
  /** 新疾病幸福损失严重度系数 */
  happyLossSeverityCoeff: number;
  /** 新疾病社交损失严重度系数 */
  socialLossSeverityCoeff: number;

  /** 基于上次行为风险计算死亡率时的基础乘数 */
  lastRiskDeathFactorBase: number;
  /** 基于上次行为风险计算死亡率时的风险系数 */
  lastRiskDeathFactorCoeff: number;

  /** 健康对自然衰老死亡率的削弱系数（满健康时 rate × (1 - factor)） */
  naturalDeathHealthFactor: number;
  /** 自然衰老死亡率最低乘数 */
  naturalDeathMinMultiplier: number;
}

export interface ResolutionRules {
  /** 结果判定随机因子最小值 */
  randomFactorMin: number;
  /** 结果判定随机因子最大值 */
  randomFactorMax: number;
  /** 低生态平衡度阈值（低于此值触发惩罚） */
  balancePenaltyThreshold: number;
  /** 低生态平衡度惩罚系数 */
  balancePenaltyFactor: number;
  /** 正常生态平衡度系数 */
  balancePenaltyNormal: number;
  /** 失败连锁底数 */
  chainFailureBase: number;
  /** 成功连锁底数 */
  chainSuccessBase: number;
  /** 大失败判定阈值（ratio < 此值） */
  bigFailureThreshold: number;
  /** 失败判定阈值 */
  failureThreshold: number;
  /** 普通判定阈值 */
  normalThreshold: number;
  /** 成功判定阈值 */
  successThreshold: number;
}

export interface AttrBonusRules {
  /** 知识属性加成系数 */
  knowledgeCoeff: number;
  /** 技能属性加成系数 */
  skillCoeff: number;
  /** 财富属性加成系数 */
  wealthCoeff: number;
  /** 社交属性加成系数 */
  socialCoeff: number;
  /** 健康属性加成系数 */
  healthCoeff: number;
  /** 魅力属性加成系数 */
  charmCoeff: number;
  /** 运势属性加成系数 */
  luckCoeff: number;
}

export interface BalanceRules {
  /** 重复行为惩罚值 */
  repeatBehaviorPenalty: number;
  /** 重复行为效果递减系数（每次同类行为效果 × (1 - coeff)） */
  repeatEffectPenaltyCoeff: number;
  /** 重复行为效果递减下限 */
  repeatEffectPenaltyMin: number;
  /** 大成功对平衡度的影响 */
  bigSuccessDelta: number;
  /** 成功对平衡度的影响 */
  successDelta: number;
  /** 失败对平衡度的影响 */
  failureDelta: number;
  /** 大失败对平衡度的影响 */
  bigFailureDelta: number;
  /** 财富与健康失衡比例阈值（wealth > health × threshold） */
  wealthHealthRatioThreshold: number;
  /** 财富与健康失衡惩罚 */
  wealthHealthRatioPenalty: number;
  /** 低幸福阈值 */
  lowHappyThreshold: number;
  /** 低幸福惩罚 */
  lowHappyPenalty: number;
}

export interface ChainsRules {
  /** 成功时死亡率乘数 */
  successDeathRateMultiplier: number;
  /** 成功时运势变化 */
  successLuckDelta: number;
  /** 失败时死亡率乘数 */
  failureDeathRateMultiplier: number;
  /** 失败时运势变化 */
  failureLuckDelta: number;
  /** 普通结果时连锁衰减量 */
  normalDecay: number;
  /** 死亡率下限 */
  deathRateMin: number;
  /** 死亡率上限 */
  deathRateMax: number;
}

export interface EventsRules {
  /** 幸运事件权重随成功链增长的系数 */
  luckySuccessChainBonus: number;
  /** 危机事件权重随失败链增长的系数 */
  crisisFailureChainBonus: number;
  /** 危机事件权重随失衡度增长的系数 */
  crisisImbalanceBonus: number;
  /** 不触发事件权重相对于总权重的比例 */
  noneWeightRatio: number;
}

export interface BehaviorPoolRules {
  /** 婴幼儿最大年龄 */
  infantMaxAge: number;
  /** 儿童最大年龄 */
  childMaxAge: number;
  /** 青少年最大年龄 */
  teenMaxAge: number;
  /** 青年最大年龄 */
  youngMaxAge: number;
  /** 失败链触发低风险限制的阈值 */
  failureChainThreshold: number;
  /** 失败链限制下的最大风险等级 */
  lowRiskLimit: number;
  /** 成功链触发高阶奖励的阈值 */
  successChainThreshold: number;
  /** 成功链奖励下的最小风险等级 */
  highRiskLimit: number;
  /** 行为池保底数量 */
  minPoolSize: number;
  /** 相同行为冷却回合数（最近 N 回合内出现过的行为不会进入行为池） */
  repeatCooldownRounds: number;
  /** 低龄财富加成上限年龄 */
  wealthBonusCapAge: number;
  /** 低龄财富加成上限值 */
  wealthBonusCap: number;
}

export interface AgingRules {
  /** 健康衰减起始年龄 */
  healthDecayStartAge: number;
  /** 健康衰减基础值 */
  healthDecayBase: number;
  /** 健康衰减年龄步长 */
  healthDecayAgeStep: number;
  /** 额外健康衰减起始年龄 */
  extraHealthDecayAge: number;
  /** 额外健康衰减值 */
  extraHealthDecay: number;
  /** 极高龄健康衰减起始年龄 */
  extremeHealthDecayAge: number;
  /** 极高龄健康衰减值 */
  extremeHealthDecay: number;
  /** 幸福自然衰减起始年龄 */
  happyDecayStartAge: number;
  /** 幸福自然衰减值 */
  happyDecay: number;
}

export interface EffectFormulaResult {
  /** 知识基础值 */
  knowledgeBase: number;
  /** 知识风险系数 */
  knowledgeRiskCoeff: number;
  /** 技能基础值 */
  skillBase: number;
  /** 技能风险系数 */
  skillRiskCoeff: number;
  /** 社交基础值 */
  socialBase: number;
  /** 社交风险系数 */
  socialRiskCoeff: number;
  /** 幸福基础值 */
  happyBase: number;
  /** 幸福风险系数 */
  happyRiskCoeff: number;
  /** 魅力基础值 */
  charmBase: number;
  /** 魅力风险系数 */
  charmRiskCoeff: number;
  /** 健康基础值 */
  healthBase: number;
  /** 健康风险系数 */
  healthRiskCoeff: number;
}

export interface NormalEffectFormulaResult extends EffectFormulaResult {
  /** 触发额外惩罚的高风险阈值 */
  highRiskThreshold: number;
  /** 高风险时的幸福惩罚 */
  highRiskHappyPenalty: number;
  /** 高风险时的健康风险系数（乘以 riskLevel） */
  highRiskHealthCoeff: number;
}

export interface EffectFormulasRules {
  bigSuccess: EffectFormulaResult;
  success: EffectFormulaResult;
  normal: NormalEffectFormulaResult;
  failure: EffectFormulaResult;
  bigFailure: EffectFormulaResult;
}

export interface InitialStateRules {
  /** 初始年龄 */
  ageInitial: number;
  /** 初始健康 */
  healthInitial: number;
  /** 初始财富 */
  wealthInitial: number;
  /** 初始知识 */
  knowledgeInitial: number;
  /** 初始技能 */
  skillInitial: number;
  /** 初始社交 */
  socialInitial: number;
  /** 初始幸福 */
  happyInitial: number;
  /** 初始运势最小值 */
  luckInitialMin: number;
  /** 初始运势最大值 */
  luckInitialMax: number;
  /** 初始生态平衡度 */
  lifeBalanceInitial: number;
  /** 初始成功链 */
  successChainInitial: number;
  /** 初始失败链 */
  failureChainInitial: number;
  /** 初始死亡率 */
  deathRateInitial: number;
}

export interface InputRules {
  /** 低龄最大年龄 */
  lowAgeMax: number;
  /** 低龄偏好风险上限 */
  lowAgeRiskMax: number;
  /** 低龄偏好加分 */
  lowAgeBonus: number;
  /** 低健康阈值 */
  lowHealthThreshold: number;
  /** 低健康偏好风险上限 */
  lowHealthRiskMax: number;
  /** 低健康偏好加分 */
  lowHealthBonus: number;
  /** 中年起始年龄 */
  middleAgeMin: number;
  /** 中年结束年龄 */
  middleAgeMax: number;
  /** 中年可接受风险下限 */
  middleRiskMin: number;
  /** 中年可接受风险上限 */
  middleRiskMax: number;
  /** 中年偏好加分 */
  middleAgeBonus: number;
  /** 高龄起始年龄 */
  elderlyAgeMin: number;
  /** 高龄偏好风险上限 */
  elderlyRiskMax: number;
  /** 高龄偏好加分 */
  elderlyBonus: number;
  /** 高失败链阈值 */
  failureChainThreshold: number;
  /** 高失败链偏好风险上限 */
  failureChainRiskMax: number;
  /** 高失败链偏好加分 */
  failureChainBonus: number;
  /** 高成功链阈值 */
  successChainThreshold: number;
  /** 高成功链可接受风险下限 */
  successChainRiskMin: number;
  /** 高成功链偏好加分 */
  successChainBonus: number;
  /** 风险行基础分系数（每低一级 risk 增加分数） */
  riskRowScoreCoeff: number;
  /** 默认空选择权重 */
  defaultWeight: number;
  /** 随机权重最小值 */
  weightMin: number;
  /** 随机权重最大值 */
  weightMax: number;
  /** 人生目标相关类别行为加分（命中目标主属性类别时） */
  lifeGoalCategoryCoeff: number;
  /** 人生目标属性加成对应的选项加分系数（bonus × coeff） */
  lifeGoalAttributeCoeff: number;
}

export interface GameRules {
  lifecycle: LifecycleRules;
  wealth: WealthRules;
  luck: LuckRules;
  illness: IllnessRules;
  resolution: ResolutionRules;
  attrBonus: AttrBonusRules;
  balance: BalanceRules;
  chains: ChainsRules;
  events: EventsRules;
  behaviorPool: BehaviorPoolRules;
  aging: AgingRules;
  effectFormulas: EffectFormulasRules;
  initialState: InitialStateRules;
  input: InputRules;
}

export const DEFAULT_GAME_RULES: GameRules = {
  lifecycle: {
    charmInitialMin: 5,
    charmInitialMax: 20,
    charmGrowthBase: 0.4,
    charmGrowthPeakAge: 50,
    charmDeclineBase: 0.25,
    charmDeclineMaxAge: 120,
    luckYearlyDriftMin: -10,
    luckYearlyDriftMax: 10,
  },
  wealth: {
    bigSuccessBaseWealthMultiplier: 2,
    bigSuccessWealthRiskBonus: 0.25,
    bigSuccessWealthTagBonusBase: 1,
    successWealthBaseMultiplier: 0.5,
    successWealthRiskBonus: 0.1,
    successWealthBaseRewardMultiplier: 1,
    normalBaseWealthMultiplier: 0.2,
    normalWealthMultiplier: 0.2,
    failureBaseWealthMultiplier: 0.5,
    failureWealthMultiplier: 0.7,
    bigFailureBaseWealthMultiplier: 1.5,
    bigFailureWealthRiskBonus: 0.1,
  },
  luck: {
    bigSuccessLuckBase: 3,
    bigSuccessLuckRiskBonus: 0.3,
    successLuckBase: 1,
    successLuckRiskBonus: 0.15,
    normalLuckDriftMin: -2,
    normalLuckDriftMax: 2,
    failureLuckBase: 2,
    failureLuckRiskBonus: 0.2,
    bigFailureLuckBase: 3,
    bigFailureLuckRiskBonus: 0.3,
  },
  illness: {
    illnessChance40_59: 0.04,
    illnessChance60Plus: 0.80,
    deathBase40_59: 0.20,
    deathBase60Plus: 0.10,
    treatmentFactorYoung: 0.65,
    treatmentFactorOld: 0.85,
    minDeathMultiplier: 0.05,

    treatmentScoreCap: 1.2,
    treatmentHealthWeight: 0.45,
    treatmentWealthWeight: 0.45,
    treatmentLuckWeight: 0.2,
    treatmentWealthCap: 300000,

    recoveryCap: 0.85,
    recoveryBase: 0.25,
    recoveryHealthFactor: 1 / 200,
    recoveryWealthCap: 200000,
    recoveryWealthFactor: 1 / 400000,
    recoveryLuckFactor: 1 / 400,

    recoveryHealthBase: 4,
    recoveryHealthRandom: 4,
    recoveryHappyBase: 2,
    recoveryHappyRandom: 3,

    maintenanceHealthBase: 3,
    maintenanceHealthRandom: 4,
    maintenanceWealthBase: 1000,
    maintenanceWealthAgeCoeff: 30,
    maintenanceWealthRandom: 1000,
    maintenanceHappyBase: 1,
    maintenanceHappyRandom: 2,

    severityBase: 1,
    severityScoreCoeff: 0.6,
    severityMin: 0.2,

    healthLossBase: 12,
    healthLossAgeCoeff: 0.2,
    wealthLossBase: 5000,
    wealthLossAgeCoeff: 100,
    happyLossBase: 2,
    happyLossSeverityCoeff: 4,
    socialLossSeverityCoeff: 2,
    lastRiskDeathFactorBase: 1,
    lastRiskDeathFactorCoeff: 0.05,

    naturalDeathHealthFactor: 0.85,
    naturalDeathMinMultiplier: 0.02,
  },
  resolution: {
    randomFactorMin: 0.5,
    randomFactorMax: 2.0,
    balancePenaltyThreshold: 30,
    balancePenaltyFactor: 0.7,
    balancePenaltyNormal: 1.0,
    chainFailureBase: 0.9,
    chainSuccessBase: 1.05,
    bigFailureThreshold: 0.3,
    failureThreshold: 0.7,
    normalThreshold: 1.2,
    successThreshold: 2.0,
  },
  attrBonus: {
    knowledgeCoeff: 0.01,
    skillCoeff: 0.01,
    wealthCoeff: 0.0001,
    socialCoeff: 0.01,
    healthCoeff: 0.01,
    charmCoeff: 0.01,
    luckCoeff: 0.01,
  },
  balance: {
    repeatBehaviorPenalty: 3,
    repeatEffectPenaltyCoeff: 0.15,
    repeatEffectPenaltyMin: 0.2,
    bigSuccessDelta: 5,
    successDelta: 2,
    failureDelta: -3,
    bigFailureDelta: -10,
    wealthHealthRatioThreshold: 1000,
    wealthHealthRatioPenalty: 2,
    lowHappyThreshold: 20,
    lowHappyPenalty: 2,
  },
  chains: {
    successDeathRateMultiplier: 0.95,
    successLuckDelta: 1,
    failureDeathRateMultiplier: 1.1,
    failureLuckDelta: -2,
    normalDecay: 1,
    deathRateMin: 0.0001,
    deathRateMax: 1,
  },
  events: {
    luckySuccessChainBonus: 0.1,
    crisisFailureChainBonus: 0.15,
    crisisImbalanceBonus: 0.01,
    noneWeightRatio: 1.5,
  },
  behaviorPool: {
    infantMaxAge: 5,
    childMaxAge: 12,
    teenMaxAge: 18,
    youngMaxAge: 30,
    failureChainThreshold: 3,
    lowRiskLimit: 3,
    successChainThreshold: 3,
    highRiskLimit: 4,
    minPoolSize: 3,
    repeatCooldownRounds: 1,
    wealthBonusCapAge: 12,
    wealthBonusCap: 1,
  },
  aging: {
    healthDecayStartAge: 50,
    healthDecayBase: 1,
    healthDecayAgeStep: 10,
    extraHealthDecayAge: 80,
    extraHealthDecay: 1,
    extremeHealthDecayAge: 100,
    extremeHealthDecay: 2,
    happyDecayStartAge: 30,
    happyDecay: 1,
  },
  effectFormulas: {
    bigSuccess: {
      knowledgeBase: 3,
      knowledgeRiskCoeff: 0.5,
      skillBase: 3,
      skillRiskCoeff: 0.5,
      socialBase: 1,
      socialRiskCoeff: 0.25,
      happyBase: 1,
      happyRiskCoeff: 0.25,
      charmBase: 0,
      charmRiskCoeff: 0.2,
      healthBase: 2,
      healthRiskCoeff: 0.2,
    },
    success: {
      knowledgeBase: 2,
      knowledgeRiskCoeff: 0.3,
      skillBase: 2,
      skillRiskCoeff: 0.3,
      socialBase: 0,
      socialRiskCoeff: 0.15,
      happyBase: 0,
      happyRiskCoeff: 0.15,
      charmBase: 0,
      charmRiskCoeff: 0.15,
      healthBase: 0,
      healthRiskCoeff: 0.2,
    },
    normal: {
      knowledgeBase: 1,
      knowledgeRiskCoeff: 0,
      skillBase: 1,
      skillRiskCoeff: 0,
      socialBase: 1,
      socialRiskCoeff: 0,
      happyBase: 1,
      happyRiskCoeff: 0,
      charmBase: 1,
      charmRiskCoeff: 0,
      healthBase: 1,
      healthRiskCoeff: 0,
      highRiskThreshold: 7,
      highRiskHappyPenalty: -1,
      highRiskHealthCoeff: -0.3,
    },
    failure: {
      knowledgeBase: -2,
      knowledgeRiskCoeff: 0,
      skillBase: -2,
      skillRiskCoeff: 0,
      socialBase: -1,
      socialRiskCoeff: -0.3,
      happyBase: -2,
      happyRiskCoeff: -0.5,
      charmBase: -2,
      charmRiskCoeff: 0,
      healthBase: -1,
      healthRiskCoeff: -0.4,
    },
    bigFailure: {
      knowledgeBase: -4,
      knowledgeRiskCoeff: 0,
      skillBase: -4,
      skillRiskCoeff: 0,
      socialBase: -3,
      socialRiskCoeff: -0.5,
      happyBase: -5,
      happyRiskCoeff: -0.8,
      charmBase: -3,
      charmRiskCoeff: 0,
      healthBase: -5,
      healthRiskCoeff: -1,
    },
  },
  initialState: {
    ageInitial: 1,
    healthInitial: 100,
    wealthInitial: 0,
    knowledgeInitial: 0,
    skillInitial: 0,
    socialInitial: 30,
    happyInitial: 50,
    luckInitialMin: 0,
    luckInitialMax: 100,
    lifeBalanceInitial: 50,
    successChainInitial: 0,
    failureChainInitial: 0,
    deathRateInitial: 0.01,
  },
  input: {
    lowAgeMax: 12,
    lowAgeRiskMax: 2,
    lowAgeBonus: 2,
    lowHealthThreshold: 40,
    lowHealthRiskMax: 3,
    lowHealthBonus: 2,
    middleAgeMin: 31,
    middleAgeMax: 50,
    middleRiskMin: 3,
    middleRiskMax: 6,
    middleAgeBonus: 1,
    elderlyAgeMin: 71,
    elderlyRiskMax: 3,
    elderlyBonus: 2,
    failureChainThreshold: 2,
    failureChainRiskMax: 2,
    failureChainBonus: 3,
    successChainThreshold: 2,
    successChainRiskMin: 5,
    successChainBonus: 1,
    riskRowScoreCoeff: 0.2,
    defaultWeight: 0.5,
    weightMin: 0.3,
    weightMax: 1.0,
    lifeGoalCategoryCoeff: 1.5,
    lifeGoalAttributeCoeff: 0.04,
  },
};

const STORAGE_KEY = 'life-grid-game-rules';

export function loadGameRules(): GameRules {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_GAME_RULES;
    const parsed = JSON.parse(raw) as Partial<GameRules>;
    return normalizeGameRules(mergeRules(parsed));
  } catch {
    return DEFAULT_GAME_RULES;
  }
}

export function saveGameRules(rules: GameRules): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
  } catch {
    // ignore
  }
}

function mergeRules(parsed: Partial<GameRules>): GameRules {
  return {
    lifecycle: { ...DEFAULT_GAME_RULES.lifecycle, ...parsed.lifecycle },
    wealth: { ...DEFAULT_GAME_RULES.wealth, ...parsed.wealth },
    luck: { ...DEFAULT_GAME_RULES.luck, ...parsed.luck },
    illness: { ...DEFAULT_GAME_RULES.illness, ...parsed.illness },
    resolution: { ...DEFAULT_GAME_RULES.resolution, ...parsed.resolution },
    attrBonus: { ...DEFAULT_GAME_RULES.attrBonus, ...parsed.attrBonus },
    balance: { ...DEFAULT_GAME_RULES.balance, ...parsed.balance },
    chains: { ...DEFAULT_GAME_RULES.chains, ...parsed.chains },
    events: { ...DEFAULT_GAME_RULES.events, ...parsed.events },
    behaviorPool: { ...DEFAULT_GAME_RULES.behaviorPool, ...parsed.behaviorPool },
    aging: { ...DEFAULT_GAME_RULES.aging, ...parsed.aging },
    effectFormulas: {
      bigSuccess: { ...DEFAULT_GAME_RULES.effectFormulas.bigSuccess, ...parsed.effectFormulas?.bigSuccess },
      success: { ...DEFAULT_GAME_RULES.effectFormulas.success, ...parsed.effectFormulas?.success },
      normal: { ...DEFAULT_GAME_RULES.effectFormulas.normal, ...parsed.effectFormulas?.normal },
      failure: { ...DEFAULT_GAME_RULES.effectFormulas.failure, ...parsed.effectFormulas?.failure },
      bigFailure: { ...DEFAULT_GAME_RULES.effectFormulas.bigFailure, ...parsed.effectFormulas?.bigFailure },
    },
    initialState: { ...DEFAULT_GAME_RULES.initialState, ...parsed.initialState },
    input: { ...DEFAULT_GAME_RULES.input, ...parsed.input },
  };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function normalizeEffectFormula(formula: EffectFormulaResult): EffectFormulaResult {
  return {
    knowledgeBase: clamp(formula.knowledgeBase, -20, 20),
    knowledgeRiskCoeff: clamp(formula.knowledgeRiskCoeff, -10, 10),
    skillBase: clamp(formula.skillBase, -20, 20),
    skillRiskCoeff: clamp(formula.skillRiskCoeff, -10, 10),
    socialBase: clamp(formula.socialBase, -20, 20),
    socialRiskCoeff: clamp(formula.socialRiskCoeff, -10, 10),
    happyBase: clamp(formula.happyBase, -20, 20),
    happyRiskCoeff: clamp(formula.happyRiskCoeff, -10, 10),
    charmBase: clamp(formula.charmBase, -20, 20),
    charmRiskCoeff: clamp(formula.charmRiskCoeff, -10, 10),
    healthBase: clamp(formula.healthBase, -20, 20),
    healthRiskCoeff: clamp(formula.healthRiskCoeff, -10, 10),
  };
}

function normalizeNormalFormula(formula: NormalEffectFormulaResult): NormalEffectFormulaResult {
  const base = normalizeEffectFormula(formula);
  return {
    ...base,
    highRiskThreshold: clamp(Math.round(formula.highRiskThreshold), 1, 10),
    highRiskHappyPenalty: clamp(formula.highRiskHappyPenalty, -10, 10),
    highRiskHealthCoeff: clamp(formula.highRiskHealthCoeff, -10, 10),
  };
}

export function normalizeGameRules(rules: GameRules): GameRules {
  return {
    lifecycle: {
      charmInitialMin: clamp(Math.round(rules.lifecycle.charmInitialMin), 0, 100),
      charmInitialMax: clamp(Math.round(rules.lifecycle.charmInitialMax), 0, 100),
      charmGrowthBase: clamp(rules.lifecycle.charmGrowthBase, 0, 5),
      charmGrowthPeakAge: clamp(Math.round(rules.lifecycle.charmGrowthPeakAge), 10, 200),
      charmDeclineBase: clamp(rules.lifecycle.charmDeclineBase, 0, 5),
      charmDeclineMaxAge: clamp(Math.round(rules.lifecycle.charmDeclineMaxAge), 50, 200),
      luckYearlyDriftMin: clamp(Math.round(rules.lifecycle.luckYearlyDriftMin), -100, 0),
      luckYearlyDriftMax: clamp(Math.round(rules.lifecycle.luckYearlyDriftMax), 0, 100),
    },
    wealth: {
      bigSuccessBaseWealthMultiplier: clamp(rules.wealth.bigSuccessBaseWealthMultiplier, 0, 10),
      bigSuccessWealthRiskBonus: clamp(rules.wealth.bigSuccessWealthRiskBonus, 0, 5),
      bigSuccessWealthTagBonusBase: clamp(rules.wealth.bigSuccessWealthTagBonusBase, 0, 5),
      successWealthBaseMultiplier: clamp(rules.wealth.successWealthBaseMultiplier, 0, 5),
      successWealthRiskBonus: clamp(rules.wealth.successWealthRiskBonus, 0, 5),
      successWealthBaseRewardMultiplier: clamp(rules.wealth.successWealthBaseRewardMultiplier, 0, 5),
      normalBaseWealthMultiplier: clamp(rules.wealth.normalBaseWealthMultiplier, 0, 5),
      normalWealthMultiplier: clamp(rules.wealth.normalWealthMultiplier, 0, 5),
      failureBaseWealthMultiplier: clamp(rules.wealth.failureBaseWealthMultiplier, 0, 5),
      failureWealthMultiplier: clamp(rules.wealth.failureWealthMultiplier, 0, 5),
      bigFailureBaseWealthMultiplier: clamp(rules.wealth.bigFailureBaseWealthMultiplier, 0, 10),
      bigFailureWealthRiskBonus: clamp(rules.wealth.bigFailureWealthRiskBonus, 0, 5),
    },
    luck: {
      bigSuccessLuckBase: clamp(rules.luck.bigSuccessLuckBase, 0, 50),
      bigSuccessLuckRiskBonus: clamp(rules.luck.bigSuccessLuckRiskBonus, 0, 10),
      successLuckBase: clamp(rules.luck.successLuckBase, 0, 50),
      successLuckRiskBonus: clamp(rules.luck.successLuckRiskBonus, 0, 10),
      normalLuckDriftMin: clamp(rules.luck.normalLuckDriftMin, -50, 0),
      normalLuckDriftMax: clamp(rules.luck.normalLuckDriftMax, 0, 50),
      failureLuckBase: clamp(rules.luck.failureLuckBase, 0, 50),
      failureLuckRiskBonus: clamp(rules.luck.failureLuckRiskBonus, 0, 10),
      bigFailureLuckBase: clamp(rules.luck.bigFailureLuckBase, 0, 50),
      bigFailureLuckRiskBonus: clamp(rules.luck.bigFailureLuckRiskBonus, 0, 10),
    },
    illness: {
      illnessChance40_59: clamp(rules.illness.illnessChance40_59, 0, 1),
      illnessChance60Plus: clamp(rules.illness.illnessChance60Plus, 0, 1),
      deathBase40_59: clamp(rules.illness.deathBase40_59, 0, 1),
      deathBase60Plus: clamp(rules.illness.deathBase60Plus, 0, 1),
      treatmentFactorYoung: clamp(rules.illness.treatmentFactorYoung, 0, 2),
      treatmentFactorOld: clamp(rules.illness.treatmentFactorOld, 0, 2),
      minDeathMultiplier: clamp(rules.illness.minDeathMultiplier, 0.001, 1),

      treatmentScoreCap: clamp(rules.illness.treatmentScoreCap, 0, 5),
      treatmentHealthWeight: clamp(rules.illness.treatmentHealthWeight, 0, 1),
      treatmentWealthWeight: clamp(rules.illness.treatmentWealthWeight, 0, 1),
      treatmentLuckWeight: clamp(rules.illness.treatmentLuckWeight, 0, 1),
      treatmentWealthCap: clamp(Math.round(rules.illness.treatmentWealthCap), 0, 10000000),

      recoveryCap: clamp(rules.illness.recoveryCap, 0, 1),
      recoveryBase: clamp(rules.illness.recoveryBase, 0, 1),
      recoveryHealthFactor: clamp(rules.illness.recoveryHealthFactor, 0, 1),
      recoveryWealthCap: clamp(Math.round(rules.illness.recoveryWealthCap), 0, 10000000),
      recoveryWealthFactor: clamp(rules.illness.recoveryWealthFactor, 0, 1),
      recoveryLuckFactor: clamp(rules.illness.recoveryLuckFactor, 0, 1),

      recoveryHealthBase: clamp(rules.illness.recoveryHealthBase, 0, 50),
      recoveryHealthRandom: clamp(rules.illness.recoveryHealthRandom, 0, 50),
      recoveryHappyBase: clamp(rules.illness.recoveryHappyBase, 0, 50),
      recoveryHappyRandom: clamp(rules.illness.recoveryHappyRandom, 0, 50),

      maintenanceHealthBase: clamp(rules.illness.maintenanceHealthBase, 0, 50),
      maintenanceHealthRandom: clamp(rules.illness.maintenanceHealthRandom, 0, 50),
      maintenanceWealthBase: clamp(rules.illness.maintenanceWealthBase, 0, 1000000),
      maintenanceWealthAgeCoeff: clamp(rules.illness.maintenanceWealthAgeCoeff, 0, 10000),
      maintenanceWealthRandom: clamp(rules.illness.maintenanceWealthRandom, 0, 1000000),
      maintenanceHappyBase: clamp(rules.illness.maintenanceHappyBase, 0, 50),
      maintenanceHappyRandom: clamp(rules.illness.maintenanceHappyRandom, 0, 50),

      severityBase: clamp(rules.illness.severityBase, 0, 10),
      severityScoreCoeff: clamp(rules.illness.severityScoreCoeff, 0, 2),
      severityMin: clamp(rules.illness.severityMin, 0, 1),

      healthLossBase: clamp(rules.illness.healthLossBase, 0, 100),
      healthLossAgeCoeff: clamp(rules.illness.healthLossAgeCoeff, 0, 10),
      wealthLossBase: clamp(rules.illness.wealthLossBase, 0, 1000000),
      wealthLossAgeCoeff: clamp(rules.illness.wealthLossAgeCoeff, 0, 10000),
      happyLossBase: clamp(rules.illness.happyLossBase, 0, 50),
      happyLossSeverityCoeff: clamp(rules.illness.happyLossSeverityCoeff, 0, 50),
      socialLossSeverityCoeff: clamp(rules.illness.socialLossSeverityCoeff, 0, 50),
      lastRiskDeathFactorBase: clamp(rules.illness.lastRiskDeathFactorBase, 0, 5),
      lastRiskDeathFactorCoeff: clamp(rules.illness.lastRiskDeathFactorCoeff, 0, 1),

      naturalDeathHealthFactor: clamp(rules.illness.naturalDeathHealthFactor, 0, 1),
      naturalDeathMinMultiplier: clamp(rules.illness.naturalDeathMinMultiplier, 0.001, 1),
    },
    resolution: {
      randomFactorMin: clamp(rules.resolution.randomFactorMin, 0, 5),
      randomFactorMax: clamp(rules.resolution.randomFactorMax, rules.resolution.randomFactorMin, 10),
      balancePenaltyThreshold: clamp(rules.resolution.balancePenaltyThreshold, 0, 100),
      balancePenaltyFactor: clamp(rules.resolution.balancePenaltyFactor, 0, 2),
      balancePenaltyNormal: clamp(rules.resolution.balancePenaltyNormal, 0.5, 2),
      chainFailureBase: clamp(rules.resolution.chainFailureBase, 0, 2),
      chainSuccessBase: clamp(rules.resolution.chainSuccessBase, 0, 2),
      bigFailureThreshold: clamp(rules.resolution.bigFailureThreshold, 0, 2),
      failureThreshold: clamp(rules.resolution.failureThreshold, rules.resolution.bigFailureThreshold, 3),
      normalThreshold: clamp(rules.resolution.normalThreshold, rules.resolution.failureThreshold, 5),
      successThreshold: clamp(rules.resolution.successThreshold, rules.resolution.normalThreshold, 10),
    },
    attrBonus: {
      knowledgeCoeff: clamp(rules.attrBonus.knowledgeCoeff, 0, 0.1),
      skillCoeff: clamp(rules.attrBonus.skillCoeff, 0, 0.1),
      wealthCoeff: clamp(rules.attrBonus.wealthCoeff, 0, 0.001),
      socialCoeff: clamp(rules.attrBonus.socialCoeff, 0, 0.1),
      healthCoeff: clamp(rules.attrBonus.healthCoeff, 0, 0.1),
      charmCoeff: clamp(rules.attrBonus.charmCoeff, 0, 0.1),
      luckCoeff: clamp(rules.attrBonus.luckCoeff, 0, 0.1),
    },
    balance: {
      repeatBehaviorPenalty: clamp(rules.balance.repeatBehaviorPenalty, 0, 20),
      repeatEffectPenaltyCoeff: clamp(rules.balance.repeatEffectPenaltyCoeff, 0, 1),
      repeatEffectPenaltyMin: clamp(rules.balance.repeatEffectPenaltyMin, 0, 1),
      bigSuccessDelta: clamp(rules.balance.bigSuccessDelta, -20, 20),
      successDelta: clamp(rules.balance.successDelta, -20, 20),
      failureDelta: clamp(rules.balance.failureDelta, -20, 20),
      bigFailureDelta: clamp(rules.balance.bigFailureDelta, -20, 20),
      wealthHealthRatioThreshold: clamp(rules.balance.wealthHealthRatioThreshold, 0, 10000),
      wealthHealthRatioPenalty: clamp(rules.balance.wealthHealthRatioPenalty, 0, 20),
      lowHappyThreshold: clamp(rules.balance.lowHappyThreshold, 0, 100),
      lowHappyPenalty: clamp(rules.balance.lowHappyPenalty, 0, 20),
    },
    chains: {
      successDeathRateMultiplier: clamp(rules.chains.successDeathRateMultiplier, 0.5, 2),
      successLuckDelta: clamp(rules.chains.successLuckDelta, -10, 10),
      failureDeathRateMultiplier: clamp(rules.chains.failureDeathRateMultiplier, 0.5, 2),
      failureLuckDelta: clamp(rules.chains.failureLuckDelta, -10, 10),
      normalDecay: clamp(rules.chains.normalDecay, 0, 5),
      deathRateMin: clamp(rules.chains.deathRateMin, 0.00001, 1),
      deathRateMax: clamp(rules.chains.deathRateMax, rules.chains.deathRateMin, 1),
    },
    events: {
      luckySuccessChainBonus: clamp(rules.events.luckySuccessChainBonus, 0, 5),
      crisisFailureChainBonus: clamp(rules.events.crisisFailureChainBonus, 0, 5),
      crisisImbalanceBonus: clamp(rules.events.crisisImbalanceBonus, 0, 1),
      noneWeightRatio: clamp(rules.events.noneWeightRatio, 0, 10),
    },
    behaviorPool: {
      infantMaxAge: clamp(Math.round(rules.behaviorPool.infantMaxAge), 0, 120),
      childMaxAge: clamp(Math.round(rules.behaviorPool.childMaxAge), rules.behaviorPool.infantMaxAge, 120),
      teenMaxAge: clamp(Math.round(rules.behaviorPool.teenMaxAge), rules.behaviorPool.childMaxAge, 120),
      youngMaxAge: clamp(Math.round(rules.behaviorPool.youngMaxAge), rules.behaviorPool.teenMaxAge, 120),
      failureChainThreshold: clamp(Math.round(rules.behaviorPool.failureChainThreshold), 0, 20),
      lowRiskLimit: clamp(Math.round(rules.behaviorPool.lowRiskLimit), 1, 10),
      successChainThreshold: clamp(Math.round(rules.behaviorPool.successChainThreshold), 0, 20),
      highRiskLimit: clamp(Math.round(rules.behaviorPool.highRiskLimit), 1, 10),
      minPoolSize: clamp(Math.round(rules.behaviorPool.minPoolSize), 1, 20),
      repeatCooldownRounds: clamp(Math.round(rules.behaviorPool.repeatCooldownRounds), 0, 5),
      wealthBonusCapAge: clamp(Math.round(rules.behaviorPool.wealthBonusCapAge), 0, 120),
      wealthBonusCap: clamp(Math.round(rules.behaviorPool.wealthBonusCap), 0, 10),
    },
    aging: {
      healthDecayStartAge: clamp(Math.round(rules.aging.healthDecayStartAge), 0, 200),
      healthDecayBase: clamp(rules.aging.healthDecayBase, -10, 10),
      healthDecayAgeStep: clamp(Math.round(rules.aging.healthDecayAgeStep), 1, 100),
      extraHealthDecayAge: clamp(Math.round(rules.aging.extraHealthDecayAge), rules.aging.healthDecayStartAge, 200),
      extraHealthDecay: clamp(rules.aging.extraHealthDecay, -10, 10),
      extremeHealthDecayAge: clamp(Math.round(rules.aging.extremeHealthDecayAge), rules.aging.extraHealthDecayAge, 200),
      extremeHealthDecay: clamp(rules.aging.extremeHealthDecay, -10, 10),
      happyDecayStartAge: clamp(Math.round(rules.aging.happyDecayStartAge), 0, 200),
      happyDecay: clamp(rules.aging.happyDecay, -10, 10),
    },
    effectFormulas: {
      bigSuccess: normalizeEffectFormula(rules.effectFormulas.bigSuccess),
      success: normalizeEffectFormula(rules.effectFormulas.success),
      normal: normalizeNormalFormula(rules.effectFormulas.normal),
      failure: normalizeEffectFormula(rules.effectFormulas.failure),
      bigFailure: normalizeEffectFormula(rules.effectFormulas.bigFailure),
    },
    initialState: {
      ageInitial: clamp(Math.round(rules.initialState.ageInitial), 1, 200),
      healthInitial: clamp(Math.round(rules.initialState.healthInitial), 0, 100),
      wealthInitial: clamp(Math.round(rules.initialState.wealthInitial), 0, Number.MAX_SAFE_INTEGER),
      knowledgeInitial: clamp(Math.round(rules.initialState.knowledgeInitial), 0, 100),
      skillInitial: clamp(Math.round(rules.initialState.skillInitial), 0, 100),
      socialInitial: clamp(Math.round(rules.initialState.socialInitial), 0, 100),
      happyInitial: clamp(Math.round(rules.initialState.happyInitial), 0, 100),
      luckInitialMin: clamp(Math.round(rules.initialState.luckInitialMin), 0, 100),
      luckInitialMax: clamp(Math.round(rules.initialState.luckInitialMax), rules.initialState.luckInitialMin, 100),
      lifeBalanceInitial: clamp(Math.round(rules.initialState.lifeBalanceInitial), 0, 100),
      successChainInitial: clamp(Math.round(rules.initialState.successChainInitial), 0, 100),
      failureChainInitial: clamp(Math.round(rules.initialState.failureChainInitial), 0, 100),
      deathRateInitial: clamp(rules.initialState.deathRateInitial, 0.00001, 1),
    },
    input: {
      lowAgeMax: clamp(Math.round(rules.input.lowAgeMax), 0, 200),
      lowAgeRiskMax: clamp(Math.round(rules.input.lowAgeRiskMax), 1, 10),
      lowAgeBonus: clamp(rules.input.lowAgeBonus, 0, 20),
      lowHealthThreshold: clamp(Math.round(rules.input.lowHealthThreshold), 0, 100),
      lowHealthRiskMax: clamp(Math.round(rules.input.lowHealthRiskMax), 1, 10),
      lowHealthBonus: clamp(rules.input.lowHealthBonus, 0, 20),
      middleAgeMin: clamp(Math.round(rules.input.middleAgeMin), 0, 200),
      middleAgeMax: clamp(Math.round(rules.input.middleAgeMax), rules.input.middleAgeMin, 200),
      middleRiskMin: clamp(Math.round(rules.input.middleRiskMin), 1, 10),
      middleRiskMax: clamp(Math.round(rules.input.middleRiskMax), rules.input.middleRiskMin, 10),
      middleAgeBonus: clamp(rules.input.middleAgeBonus, 0, 20),
      elderlyAgeMin: clamp(Math.round(rules.input.elderlyAgeMin), 0, 200),
      elderlyRiskMax: clamp(Math.round(rules.input.elderlyRiskMax), 1, 10),
      elderlyBonus: clamp(rules.input.elderlyBonus, 0, 20),
      failureChainThreshold: clamp(Math.round(rules.input.failureChainThreshold), 0, 20),
      failureChainRiskMax: clamp(Math.round(rules.input.failureChainRiskMax), 1, 10),
      failureChainBonus: clamp(rules.input.failureChainBonus, 0, 20),
      successChainThreshold: clamp(Math.round(rules.input.successChainThreshold), 0, 20),
      successChainRiskMin: clamp(Math.round(rules.input.successChainRiskMin), 1, 10),
      successChainBonus: clamp(rules.input.successChainBonus, 0, 20),
      riskRowScoreCoeff: clamp(rules.input.riskRowScoreCoeff, 0, 2),
      defaultWeight: clamp(rules.input.defaultWeight, 0, 2),
      weightMin: clamp(rules.input.weightMin, 0, 2),
      weightMax: clamp(rules.input.weightMax, rules.input.weightMin, 2),
      lifeGoalCategoryCoeff: clamp(rules.input.lifeGoalCategoryCoeff, 0, 10),
      lifeGoalAttributeCoeff: clamp(rules.input.lifeGoalAttributeCoeff, 0, 2),
    },
  };
}
