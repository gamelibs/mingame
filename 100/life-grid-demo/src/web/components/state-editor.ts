import { GameRules, DEFAULT_GAME_RULES } from '../../core/game-rules';

interface FieldDef {
  key: string;
  label: string;
  min?: number;
  max?: number;
  step?: number;
}

interface SectionDef {
  title: string;
  fields: FieldDef[];
}

function attrFields(prefix: string): FieldDef[] {
  return [
    { key: `${prefix}.knowledgeBase`, label: '知识基础值', min: -20, max: 20, step: 0.5 },
    { key: `${prefix}.knowledgeRiskCoeff`, label: '知识风险系数', min: -10, max: 10, step: 0.1 },
    { key: `${prefix}.skillBase`, label: '技能基础值', min: -20, max: 20, step: 0.5 },
    { key: `${prefix}.skillRiskCoeff`, label: '技能风险系数', min: -10, max: 10, step: 0.1 },
    { key: `${prefix}.socialBase`, label: '社交基础值', min: -20, max: 20, step: 0.5 },
    { key: `${prefix}.socialRiskCoeff`, label: '社交风险系数', min: -10, max: 10, step: 0.1 },
    { key: `${prefix}.happyBase`, label: '幸福基础值', min: -20, max: 20, step: 0.5 },
    { key: `${prefix}.happyRiskCoeff`, label: '幸福风险系数', min: -10, max: 10, step: 0.1 },
    { key: `${prefix}.charmBase`, label: '魅力基础值', min: -20, max: 20, step: 0.5 },
    { key: `${prefix}.charmRiskCoeff`, label: '魅力风险系数', min: -10, max: 10, step: 0.1 },
    { key: `${prefix}.healthBase`, label: '健康基础值', min: -20, max: 20, step: 0.5 },
    { key: `${prefix}.healthRiskCoeff`, label: '健康风险系数', min: -10, max: 10, step: 0.1 },
  ];
}

const SECTIONS: SectionDef[] = [
  {
    title: '魅力生命周期',
    fields: [
      { key: 'lifecycle.charmInitialMin', label: '初始最小值', min: 0, max: 100, step: 1 },
      { key: 'lifecycle.charmInitialMax', label: '初始最大值', min: 0, max: 100, step: 1 },
      { key: 'lifecycle.charmGrowthBase', label: '成长期基础增速', min: 0, max: 5, step: 0.1 },
      { key: 'lifecycle.charmGrowthPeakAge', label: '峰值年龄', min: 10, max: 200, step: 1 },
      { key: 'lifecycle.charmDeclineBase', label: '衰退期基础减速', min: 0, max: 5, step: 0.1 },
      { key: 'lifecycle.charmDeclineMaxAge', label: '衰退参考最大年龄', min: 50, max: 200, step: 1 },
    ],
  },
  {
    title: '运势波动',
    fields: [
      { key: 'lifecycle.luckYearlyDriftMin', label: '每年最小波动', min: -100, max: 0, step: 1 },
      { key: 'lifecycle.luckYearlyDriftMax', label: '每年最大波动', min: 0, max: 100, step: 1 },
    ],
  },
  {
    title: '财富效果',
    fields: [
      { key: 'wealth.bigSuccessBaseWealthMultiplier', label: '大成功基础系数', min: 0, max: 10, step: 0.1 },
      { key: 'wealth.bigSuccessWealthRiskBonus', label: '大成功风险加成系数', min: 0, max: 5, step: 0.05 },
      { key: 'wealth.bigSuccessWealthTagBonusBase', label: '大成功财富标签基础倍率', min: 0, max: 5, step: 0.1 },
      { key: 'wealth.successWealthBaseMultiplier', label: '成功基础系数', min: 0, max: 5, step: 0.1 },
      { key: 'wealth.successWealthRiskBonus', label: '成功风险加成系数', min: 0, max: 5, step: 0.05 },
      { key: 'wealth.successWealthBaseRewardMultiplier', label: '成功基础奖励倍率', min: 0, max: 5, step: 0.1 },
      { key: 'wealth.normalBaseWealthMultiplier', label: '普通基础系数', min: 0, max: 5, step: 0.1 },
      { key: 'wealth.normalWealthMultiplier', label: '普通标签加成系数', min: 0, max: 5, step: 0.1 },
      { key: 'wealth.failureBaseWealthMultiplier', label: '失败基础系数', min: 0, max: 5, step: 0.1 },
      { key: 'wealth.failureWealthMultiplier', label: '失败标签亏损系数', min: 0, max: 5, step: 0.1 },
      { key: 'wealth.bigFailureBaseWealthMultiplier', label: '大失败基础系数', min: 0, max: 10, step: 0.1 },
      { key: 'wealth.bigFailureWealthRiskBonus', label: '大失败风险加成系数', min: 0, max: 5, step: 0.05 },
    ],
  },
  {
    title: '疾病与死亡',
    fields: [
      { key: 'illness.illnessChance40_59', label: '40~59 岁发病概率', min: 0, max: 1, step: 0.01 },
      { key: 'illness.illnessChance60Plus', label: '60 岁以上发病概率', min: 0, max: 1, step: 0.01 },
      { key: 'illness.deathBase40_59', label: '40~59 岁重病死亡率', min: 0, max: 1, step: 0.01 },
      { key: 'illness.deathBase60Plus', label: '60 岁以上重病死亡率', min: 0, max: 1, step: 0.01 },
      { key: 'illness.treatmentFactorYoung', label: '中青年治疗效果系数', min: 0, max: 2, step: 0.05 },
      { key: 'illness.treatmentFactorOld', label: '老年治疗效果系数', min: 0, max: 2, step: 0.05 },
      { key: 'illness.minDeathMultiplier', label: '最低死亡倍数', min: 0.001, max: 1, step: 0.001 },
      { key: 'illness.treatmentScoreCap', label: '治疗评分上限', min: 0, max: 5, step: 0.1 },
      { key: 'illness.treatmentHealthWeight', label: '治疗评分健康权重', min: 0, max: 1, step: 0.05 },
      { key: 'illness.treatmentWealthWeight', label: '治疗评分财富权重', min: 0, max: 1, step: 0.05 },
      { key: 'illness.treatmentLuckWeight', label: '治疗评分运势权重', min: 0, max: 1, step: 0.05 },
      { key: 'illness.treatmentWealthCap', label: '治疗评分财富上限', min: 0, max: 10000000, step: 1000 },
      { key: 'illness.recoveryCap', label: '康复概率上限', min: 0, max: 1, step: 0.01 },
      { key: 'illness.recoveryBase', label: '康复基础概率', min: 0, max: 1, step: 0.01 },
      { key: 'illness.recoveryHealthFactor', label: '康复健康影响系数', min: 0, max: 1, step: 0.001 },
      { key: 'illness.recoveryWealthCap', label: '康复财富上限', min: 0, max: 10000000, step: 1000 },
      { key: 'illness.recoveryWealthFactor', label: '康复财富影响系数', min: 0, max: 1, step: 0.0001 },
      { key: 'illness.recoveryLuckFactor', label: '康复运势影响系数', min: 0, max: 1, step: 0.001 },
      { key: 'illness.recoveryHealthBase', label: '康复健康回复基础', min: 0, max: 50, step: 1 },
      { key: 'illness.recoveryHealthRandom', label: '康复健康回复随机', min: 0, max: 50, step: 1 },
      { key: 'illness.recoveryHappyBase', label: '康复幸福回复基础', min: 0, max: 50, step: 1 },
      { key: 'illness.recoveryHappyRandom', label: '康复幸福回复随机', min: 0, max: 50, step: 1 },
      { key: 'illness.maintenanceHealthBase', label: '维持健康消耗基础', min: 0, max: 50, step: 1 },
      { key: 'illness.maintenanceHealthRandom', label: '维持健康消耗随机', min: 0, max: 50, step: 1 },
      { key: 'illness.maintenanceWealthBase', label: '维持财富消耗基础', min: 0, max: 1000000, step: 100 },
      { key: 'illness.maintenanceWealthAgeCoeff', label: '维持财富消耗年龄系数', min: 0, max: 10000, step: 1 },
      { key: 'illness.maintenanceWealthRandom', label: '维持财富消耗随机', min: 0, max: 1000000, step: 100 },
      { key: 'illness.maintenanceHappyBase', label: '维持幸福消耗基础', min: 0, max: 50, step: 1 },
      { key: 'illness.maintenanceHappyRandom', label: '维持幸福消耗随机', min: 0, max: 50, step: 1 },
      { key: 'illness.severityBase', label: '疾病严重度基础', min: 0, max: 10, step: 0.1 },
      { key: 'illness.severityScoreCoeff', label: '治疗评分削弱系数', min: 0, max: 2, step: 0.05 },
      { key: 'illness.severityMin', label: '疾病严重度最低', min: 0, max: 1, step: 0.01 },
      { key: 'illness.healthLossBase', label: '健康损失基础', min: 0, max: 100, step: 1 },
      { key: 'illness.healthLossAgeCoeff', label: '健康损失年龄系数', min: 0, max: 10, step: 0.1 },
      { key: 'illness.wealthLossBase', label: '财富损失基础', min: 0, max: 1000000, step: 100 },
      { key: 'illness.wealthLossAgeCoeff', label: '财富损失年龄系数', min: 0, max: 10000, step: 1 },
      { key: 'illness.happyLossBase', label: '幸福损失基础', min: 0, max: 50, step: 1 },
      { key: 'illness.happyLossSeverityCoeff', label: '幸福损失严重度系数', min: 0, max: 50, step: 1 },
      { key: 'illness.socialLossSeverityCoeff', label: '社交损失严重度系数', min: 0, max: 50, step: 1 },
      { key: 'illness.lastRiskDeathFactorBase', label: '风险死亡基础乘数', min: 0, max: 5, step: 0.1 },
      { key: 'illness.lastRiskDeathFactorCoeff', label: '风险死亡系数', min: 0, max: 1, step: 0.01 },
    ],
  },
  {
    title: '运势效果（行为结果）',
    fields: [
      { key: 'luck.bigSuccessLuckBase', label: '大成功基础加成', min: 0, max: 50, step: 1 },
      { key: 'luck.bigSuccessLuckRiskBonus', label: '大成功风险加成', min: 0, max: 10, step: 0.1 },
      { key: 'luck.successLuckBase', label: '成功基础加成', min: 0, max: 50, step: 1 },
      { key: 'luck.successLuckRiskBonus', label: '成功风险加成', min: 0, max: 10, step: 0.1 },
      { key: 'luck.normalLuckDriftMin', label: '普通最小波动', min: -50, max: 0, step: 1 },
      { key: 'luck.normalLuckDriftMax', label: '普通最大波动', min: 0, max: 50, step: 1 },
      { key: 'luck.failureLuckBase', label: '失败基础减益', min: 0, max: 50, step: 1 },
      { key: 'luck.failureLuckRiskBonus', label: '失败风险减益', min: 0, max: 10, step: 0.1 },
      { key: 'luck.bigFailureLuckBase', label: '大失败基础减益', min: 0, max: 50, step: 1 },
      { key: 'luck.bigFailureLuckRiskBonus', label: '大失败风险减益', min: 0, max: 10, step: 0.1 },
    ],
  },
  {
    title: '结果判定',
    fields: [
      { key: 'resolution.randomFactorMin', label: '随机因子最小值', min: 0, max: 5, step: 0.1 },
      { key: 'resolution.randomFactorMax', label: '随机因子最大值', min: 0, max: 10, step: 0.1 },
      { key: 'resolution.balancePenaltyThreshold', label: '平衡惩罚阈值', min: 0, max: 100, step: 1 },
      { key: 'resolution.balancePenaltyFactor', label: '平衡惩罚系数', min: 0, max: 2, step: 0.05 },
      { key: 'resolution.balancePenaltyNormal', label: '平衡正常系数', min: 0.5, max: 2, step: 0.05 },
      { key: 'resolution.chainFailureBase', label: '失败连锁底数', min: 0, max: 2, step: 0.05 },
      { key: 'resolution.chainSuccessBase', label: '成功连锁底数', min: 0, max: 2, step: 0.05 },
      { key: 'resolution.bigFailureThreshold', label: '大失败阈值', min: 0, max: 2, step: 0.05 },
      { key: 'resolution.failureThreshold', label: '失败阈值', min: 0, max: 3, step: 0.05 },
      { key: 'resolution.normalThreshold', label: '普通阈值', min: 0, max: 5, step: 0.05 },
      { key: 'resolution.successThreshold', label: '成功阈值', min: 0, max: 10, step: 0.05 },
    ],
  },
  {
    title: '属性加成系数',
    fields: [
      { key: 'attrBonus.knowledgeCoeff', label: '知识加成系数', min: 0, max: 0.1, step: 0.001 },
      { key: 'attrBonus.skillCoeff', label: '技能加成系数', min: 0, max: 0.1, step: 0.001 },
      { key: 'attrBonus.wealthCoeff', label: '财富加成系数', min: 0, max: 0.001, step: 0.0001 },
      { key: 'attrBonus.socialCoeff', label: '社交加成系数', min: 0, max: 0.1, step: 0.001 },
      { key: 'attrBonus.healthCoeff', label: '健康加成系数', min: 0, max: 0.1, step: 0.001 },
      { key: 'attrBonus.charmCoeff', label: '魅力加成系数', min: 0, max: 0.1, step: 0.001 },
      { key: 'attrBonus.luckCoeff', label: '运势加成系数', min: 0, max: 0.1, step: 0.001 },
    ],
  },
  {
    title: '生态平衡度',
    fields: [
      { key: 'balance.repeatBehaviorPenalty', label: '重复行为惩罚', min: 0, max: 20, step: 1 },
      { key: 'balance.bigSuccessDelta', label: '大成功影响', min: -20, max: 20, step: 1 },
      { key: 'balance.successDelta', label: '成功影响', min: -20, max: 20, step: 1 },
      { key: 'balance.failureDelta', label: '失败影响', min: -20, max: 20, step: 1 },
      { key: 'balance.bigFailureDelta', label: '大失败影响', min: -20, max: 20, step: 1 },
      { key: 'balance.wealthHealthRatioThreshold', label: '财富健康失衡比例', min: 0, max: 10000, step: 10 },
      { key: 'balance.wealthHealthRatioPenalty', label: '财富健康失衡惩罚', min: 0, max: 20, step: 1 },
      { key: 'balance.lowHappyThreshold', label: '低幸福阈值', min: 0, max: 100, step: 1 },
      { key: 'balance.lowHappyPenalty', label: '低幸福惩罚', min: 0, max: 20, step: 1 },
    ],
  },
  {
    title: '连锁反应',
    fields: [
      { key: 'chains.successDeathRateMultiplier', label: '成功死亡率乘数', min: 0.5, max: 2, step: 0.05 },
      { key: 'chains.successLuckDelta', label: '成功运势变化', min: -10, max: 10, step: 1 },
      { key: 'chains.failureDeathRateMultiplier', label: '失败死亡率乘数', min: 0.5, max: 2, step: 0.05 },
      { key: 'chains.failureLuckDelta', label: '失败运势变化', min: -10, max: 10, step: 1 },
      { key: 'chains.normalDecay', label: '普通结果衰减', min: 0, max: 5, step: 1 },
      { key: 'chains.deathRateMin', label: '死亡率下限', min: 0.00001, max: 1, step: 0.00001 },
      { key: 'chains.deathRateMax', label: '死亡率上限', min: 0.00001, max: 1, step: 0.00001 },
    ],
  },
  {
    title: '随机事件',
    fields: [
      { key: 'events.luckySuccessChainBonus', label: '幸运成功链加成', min: 0, max: 5, step: 0.05 },
      { key: 'events.crisisFailureChainBonus', label: '危机失败链加成', min: 0, max: 5, step: 0.05 },
      { key: 'events.crisisImbalanceBonus', label: '危机失衡度加成', min: 0, max: 1, step: 0.01 },
      { key: 'events.noneWeightRatio', label: '不触发权重比例', min: 0, max: 10, step: 0.1 },
    ],
  },
  {
    title: '行为池',
    fields: [
      { key: 'behaviorPool.infantMaxAge', label: '婴幼儿最大年龄', min: 0, max: 120, step: 1 },
      { key: 'behaviorPool.childMaxAge', label: '儿童最大年龄', min: 0, max: 120, step: 1 },
      { key: 'behaviorPool.teenMaxAge', label: '青少年最大年龄', min: 0, max: 120, step: 1 },
      { key: 'behaviorPool.youngMaxAge', label: '青年最大年龄', min: 0, max: 120, step: 1 },
      { key: 'behaviorPool.failureChainThreshold', label: '失败链限制阈值', min: 0, max: 20, step: 1 },
      { key: 'behaviorPool.lowRiskLimit', label: '低风险上限', min: 1, max: 10, step: 1 },
      { key: 'behaviorPool.successChainThreshold', label: '成功链奖励阈值', min: 0, max: 20, step: 1 },
      { key: 'behaviorPool.highRiskLimit', label: '高奖励风险下限', min: 1, max: 10, step: 1 },
      { key: 'behaviorPool.minPoolSize', label: '保底数量', min: 1, max: 20, step: 1 },
      { key: 'behaviorPool.wealthBonusCapAge', label: '财富加成上限年龄', min: 0, max: 120, step: 1 },
      { key: 'behaviorPool.wealthBonusCap', label: '财富加成上限值', min: 0, max: 10, step: 1 },
    ],
  },
  {
    title: '自然衰老',
    fields: [
      { key: 'aging.healthDecayStartAge', label: '健康衰减起始年龄', min: 0, max: 200, step: 1 },
      { key: 'aging.healthDecayBase', label: '健康衰减基础', min: -10, max: 10, step: 1 },
      { key: 'aging.healthDecayAgeStep', label: '健康衰减年龄步长', min: 1, max: 100, step: 1 },
      { key: 'aging.extraHealthDecayAge', label: '额外健康衰减年龄', min: 0, max: 200, step: 1 },
      { key: 'aging.extraHealthDecay', label: '额外健康衰减', min: -10, max: 10, step: 1 },
      { key: 'aging.extremeHealthDecayAge', label: '极高龄衰减年龄', min: 0, max: 200, step: 1 },
      { key: 'aging.extremeHealthDecay', label: '极高龄衰减', min: -10, max: 10, step: 1 },
      { key: 'aging.happyDecayStartAge', label: '幸福衰减起始年龄', min: 0, max: 200, step: 1 },
      { key: 'aging.happyDecay', label: '幸福衰减', min: -10, max: 10, step: 1 },
    ],
  },
  {
    title: '行为效果公式 - 大成功',
    fields: attrFields('effectFormulas.bigSuccess'),
  },
  {
    title: '行为效果公式 - 成功',
    fields: attrFields('effectFormulas.success'),
  },
  {
    title: '行为效果公式 - 普通',
    fields: [
      ...attrFields('effectFormulas.normal'),
      { key: 'effectFormulas.normal.highRiskThreshold', label: '高风险阈值', min: 1, max: 10, step: 1 },
      { key: 'effectFormulas.normal.highRiskHappyPenalty', label: '高风险幸福惩罚', min: -10, max: 10, step: 0.5 },
      { key: 'effectFormulas.normal.highRiskHealthCoeff', label: '高风险健康系数', min: -10, max: 10, step: 0.1 },
    ],
  },
  {
    title: '行为效果公式 - 失败',
    fields: attrFields('effectFormulas.failure'),
  },
  {
    title: '行为效果公式 - 大失败',
    fields: attrFields('effectFormulas.bigFailure'),
  },
  {
    title: '初始状态',
    fields: [
      { key: 'initialState.ageInitial', label: '初始年龄', min: 1, max: 200, step: 1 },
      { key: 'initialState.healthInitial', label: '初始健康', min: 0, max: 100, step: 1 },
      { key: 'initialState.wealthInitial', label: '初始财富', min: 0, max: 1000000000, step: 1000 },
      { key: 'initialState.knowledgeInitial', label: '初始知识', min: 0, max: 100, step: 1 },
      { key: 'initialState.skillInitial', label: '初始技能', min: 0, max: 100, step: 1 },
      { key: 'initialState.socialInitial', label: '初始社交', min: 0, max: 100, step: 1 },
      { key: 'initialState.happyInitial', label: '初始幸福', min: 0, max: 100, step: 1 },
      { key: 'initialState.luckInitialMin', label: '初始运势最小', min: 0, max: 100, step: 1 },
      { key: 'initialState.luckInitialMax', label: '初始运势最大', min: 0, max: 100, step: 1 },
      { key: 'initialState.lifeBalanceInitial', label: '初始平衡度', min: 0, max: 100, step: 1 },
      { key: 'initialState.successChainInitial', label: '初始成功链', min: 0, max: 100, step: 1 },
      { key: 'initialState.failureChainInitial', label: '初始失败链', min: 0, max: 100, step: 1 },
      { key: 'initialState.deathRateInitial', label: '初始死亡率', min: 0.00001, max: 1, step: 0.00001 },
    ],
  },
  {
    title: '自动选择 AI',
    fields: [
      { key: 'input.lowAgeMax', label: '低龄最大年龄', min: 0, max: 200, step: 1 },
      { key: 'input.lowAgeRiskMax', label: '低龄偏好风险上限', min: 1, max: 10, step: 1 },
      { key: 'input.lowAgeBonus', label: '低龄偏好加分', min: 0, max: 20, step: 1 },
      { key: 'input.lowHealthThreshold', label: '低健康阈值', min: 0, max: 100, step: 1 },
      { key: 'input.lowHealthRiskMax', label: '低健康偏好风险上限', min: 1, max: 10, step: 1 },
      { key: 'input.lowHealthBonus', label: '低健康偏好加分', min: 0, max: 20, step: 1 },
      { key: 'input.middleAgeMin', label: '中年起始年龄', min: 0, max: 200, step: 1 },
      { key: 'input.middleAgeMax', label: '中年结束年龄', min: 0, max: 200, step: 1 },
      { key: 'input.middleRiskMin', label: '中年风险下限', min: 1, max: 10, step: 1 },
      { key: 'input.middleRiskMax', label: '中年风险上限', min: 1, max: 10, step: 1 },
      { key: 'input.middleAgeBonus', label: '中年偏好加分', min: 0, max: 20, step: 1 },
      { key: 'input.elderlyAgeMin', label: '高龄起始年龄', min: 0, max: 200, step: 1 },
      { key: 'input.elderlyRiskMax', label: '高龄偏好风险上限', min: 1, max: 10, step: 1 },
      { key: 'input.elderlyBonus', label: '高龄偏好加分', min: 0, max: 20, step: 1 },
      { key: 'input.failureChainThreshold', label: '失败链阈值', min: 0, max: 20, step: 1 },
      { key: 'input.failureChainRiskMax', label: '失败链风险上限', min: 1, max: 10, step: 1 },
      { key: 'input.failureChainBonus', label: '失败链加分', min: 0, max: 20, step: 1 },
      { key: 'input.successChainThreshold', label: '成功链阈值', min: 0, max: 20, step: 1 },
      { key: 'input.successChainRiskMin', label: '成功链风险下限', min: 1, max: 10, step: 1 },
      { key: 'input.successChainBonus', label: '成功链加分', min: 0, max: 20, step: 1 },
      { key: 'input.riskRowScoreCoeff', label: '风险行基础分系数', min: 0, max: 2, step: 0.05 },
      { key: 'input.defaultWeight', label: '默认空选择权重', min: 0, max: 2, step: 0.1 },
      { key: 'input.weightMin', label: '随机权重最小', min: 0, max: 2, step: 0.05 },
      { key: 'input.weightMax', label: '随机权重最大', min: 0, max: 2, step: 0.05 },
    ],
  },
];

function getValue(rules: GameRules, key: string): number {
  const parts = key.split('.');
  let current: any = rules;
  for (const part of parts) {
    current = current[part];
  }
  return current as number;
}

function setValue(rules: GameRules, key: string, value: number): void {
  const parts = key.split('.');
  let current: any = rules;
  for (let i = 0; i < parts.length - 1; i++) {
    current = current[parts[i]];
  }
  current[parts[parts.length - 1]] = value;
}

function createNumberInput(value: number, step?: number): HTMLInputElement {
  const input = document.createElement('input');
  input.type = 'number';
  input.className = 'editor-table-input';
  input.value = String(value);
  if (step !== undefined) input.step = String(step);
  return input;
}

export function openStateEditor(
  initialRules: GameRules,
  onSave: (rules: GameRules) => void,
  onClose: () => void
): void {
  const rules: GameRules = JSON.parse(JSON.stringify(initialRules));
  const inputs = new Map<string, HTMLInputElement>();

  const overlay = document.createElement('div');
  overlay.className = 'editor-modal';

  const backdrop = document.createElement('div');
  backdrop.className = 'editor-modal-backdrop';
  backdrop.addEventListener('click', closeEditor);

  const content = document.createElement('div');
  content.className = 'editor-modal-content';

  const header = document.createElement('div');
  header.className = 'editor-modal-header';

  const title = document.createElement('h2');
  title.textContent = '全局规则配置';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'editor-modal-close';
  closeBtn.textContent = '✕';
  closeBtn.addEventListener('click', closeEditor);

  header.appendChild(title);
  header.appendChild(closeBtn);

  const body = document.createElement('div');
  body.className = 'state-editor-body';

  for (const section of SECTIONS) {
    const sectionEl = document.createElement('div');
    sectionEl.className = 'state-editor-section';

    const sectionTitle = document.createElement('h3');
    sectionTitle.className = 'state-editor-section-title';
    sectionTitle.textContent = section.title;
    sectionEl.appendChild(sectionTitle);

    const grid = document.createElement('div');
    grid.className = 'state-editor-grid';

    for (const field of section.fields) {
      const label = document.createElement('label');
      label.className = 'state-editor-field';
      label.textContent = field.label;

      const input = createNumberInput(getValue(rules, field.key), field.step);
      input.min = String(field.min ?? '');
      input.max = String(field.max ?? '');
      input.addEventListener('change', () => {
        const num = parseFloat(input.value);
        if (!isNaN(num)) {
          setValue(rules, field.key, num);
        }
      });
      inputs.set(field.key, input);

      label.appendChild(input);
      grid.appendChild(label);
    }

    sectionEl.appendChild(grid);
    body.appendChild(sectionEl);
  }

  const footer = document.createElement('div');
  footer.className = 'editor-modal-footer';

  const hint = document.createElement('span');
  hint.className = 'editor-modal-hint';
  hint.textContent = '保存后将重置当前人生以应用新规则。';

  const resetBtn = document.createElement('button');
  resetBtn.className = 'seal-btn secondary';
  resetBtn.textContent = '恢复默认';
  resetBtn.addEventListener('click', () => {
    if (!confirm('确定恢复默认规则吗？')) return;
    onSave({ ...DEFAULT_GAME_RULES });
    closeEditor();
  });

  const saveBtn = document.createElement('button');
  saveBtn.className = 'seal-btn';
  saveBtn.textContent = '保存并重置';
  saveBtn.addEventListener('click', () => {
    onSave(rules);
    closeEditor();
  });

  footer.appendChild(hint);
  footer.appendChild(resetBtn);
  footer.appendChild(saveBtn);

  content.appendChild(header);
  content.appendChild(body);
  content.appendChild(footer);
  overlay.appendChild(backdrop);
  overlay.appendChild(content);
  document.body.appendChild(overlay);

  function closeEditor() {
    overlay.remove();
    onClose();
  }
}
