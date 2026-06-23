import 'dotenv/config';

export interface AiConfig {
  /** Kimi API Key */
  apiKey: string;
  /** 模型名称，例如 moonshot-v1-8k */
  model: string;
  /** API 基础地址 */
  baseURL: string;
  /** 是否启用 AI 功能 */
  enabled: boolean;
  /** 默认温度 */
  temperature: number;
  /** 最大 token 数 */
  maxTokens: number;
}

function env(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (value === undefined || value === '') {
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`缺少环境变量：${key}`);
  }
  return value;
}

export const AI_CONFIG: AiConfig = {
  apiKey: env('KIMI_API_KEY', ''),
  model: env('KIMI_MODEL', 'moonshot-v1-8k'),
  baseURL: env('KIMI_BASE_URL', 'https://api.moonshot.cn/v1'),
  enabled: env('KIMI_API_KEY', '') !== '',
  temperature: parseFloat(env('KIMI_TEMPERATURE', '0.7')),
  maxTokens: parseInt(env('KIMI_MAX_TOKENS', '512'), 10),
};
