import { AgeConfig } from '../types';

// 年龄段配置映射
// 键为代表年龄段的整数，便于检索：1=1-5岁, 6=6-12岁, 13=13-18岁, 19=19-30岁, 31=31-50岁, 51=51-70岁, 71=71岁以上
export const ageConfigMap: Record<number, AgeConfig> = {
  1: {
    maxRisk: 3,
    baseCount: 6,
    wealthBonusMax: 1,
    unlockThreshold: 0
  },
  6: {
    maxRisk: 4,
    baseCount: 8,
    wealthBonusMax: 2,
    unlockThreshold: 0
  },
  13: {
    maxRisk: 5,
    baseCount: 10,
    wealthBonusMax: 3,
    unlockThreshold: 0
  },
  19: {
    maxRisk: 8,
    baseCount: 16,
    wealthBonusMax: 4,
    unlockThreshold: 10
  },
  31: {
    maxRisk: 9,
    baseCount: 18,
    wealthBonusMax: 4,
    unlockThreshold: 50
  },
  51: {
    maxRisk: 8,
    baseCount: 14,
    wealthBonusMax: 3,
    unlockThreshold: 100
  },
  71: {
    maxRisk: 6,
    baseCount: 10,
    wealthBonusMax: 2,
    unlockThreshold: 50
  }
};

// 根据实际年龄获取所属年龄段配置
export function getAgeConfig(age: number): AgeConfig {
  if (age >= 71) return ageConfigMap[71];
  if (age >= 51) return ageConfigMap[51];
  if (age >= 31) return ageConfigMap[31];
  if (age >= 19) return ageConfigMap[19];
  if (age >= 13) return ageConfigMap[13];
  if (age >= 6) return ageConfigMap[6];
  return ageConfigMap[1];
}
