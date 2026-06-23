// 自然衰老死亡率表（按年龄，概率为 0~1 之间的小数）
// 重大疾病会在游戏核心层额外叠加，因此此表仅表示无重病时的自然死亡概率
export const baseDeathRateByAge: Record<number, number> = {
  1: 0.0001,    // 0.01%
  10: 0.0002,   // 0.02%
  20: 0.0005,   // 0.05%
  40: 0.001,    // 0.1%
  60: 0.01,     // 1%
  70: 0.03,     // 3%
  80: 0.10,     // 10%
  90: 0.30,     // 30%
  100: 0.70,    // 70%
  110: 0.95     // 95%
};

const sortedAges = Object.keys(baseDeathRateByAge)
  .map(Number)
  .sort((a, b) => a - b);

// 对中间年龄进行线性插值，获取自然衰老死亡率
export function getBaseDeathRateByAge(age: number): number {
  if (age <= sortedAges[0]) {
    return baseDeathRateByAge[sortedAges[0]];
  }

  const lastAge = sortedAges[sortedAges.length - 1];
  if (age >= lastAge) {
    return baseDeathRateByAge[lastAge];
  }

  for (let i = 0; i < sortedAges.length - 1; i++) {
    const lowerAge = sortedAges[i];
    const upperAge = sortedAges[i + 1];
    if (age >= lowerAge && age <= upperAge) {
      const lowerRate = baseDeathRateByAge[lowerAge];
      const upperRate = baseDeathRateByAge[upperAge];
      const ratio = (age - lowerAge) / (upperAge - lowerAge);
      return lowerRate + (upperRate - lowerRate) * ratio;
    }
  }

  return baseDeathRateByAge[lastAge];
}
