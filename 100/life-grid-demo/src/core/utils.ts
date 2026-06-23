/**
 * 通用工具函数
 */

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// 返回年龄段边界值：1, 6, 13, 19, 31, 51, 71
export function getAgeGroup(age: number): number {
  if (age >= 71) return 71;
  if (age >= 51) return 51;
  if (age >= 31) return 31;
  if (age >= 19) return 19;
  if (age >= 13) return 13;
  if (age >= 6) return 6;
  return 1;
}

export function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
