import { AI_CONFIG } from './ai-config';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export interface ChatResult {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * 调用 Kimi（Moonshot）API。
 * Kimi 的接口与 OpenAI Chat Completions 兼容。
 */
export async function chat(
  messages: ChatMessage[],
  options: ChatOptions = {}
): Promise<ChatResult> {
  if (!AI_CONFIG.enabled || !AI_CONFIG.apiKey) {
    throw new Error('AI 功能未启用，请在环境变量中配置 KIMI_API_KEY');
  }

  const res = await fetch(`${AI_CONFIG.baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AI_CONFIG.apiKey}`,
    },
    body: JSON.stringify({
      model: options.model || AI_CONFIG.model,
      messages,
      temperature:
        options.temperature !== undefined
          ? options.temperature
          : AI_CONFIG.temperature,
      max_tokens:
        options.maxTokens !== undefined
          ? options.maxTokens
          : AI_CONFIG.maxTokens,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Kimi API 请求失败 (${res.status}): ${text}`);
  }

  const data = (await res.json()) as {
    choices: { message: ChatMessage }[];
    usage?: ChatResult['usage'];
  };

  if (!data.choices || data.choices.length === 0) {
    throw new Error('Kimi API 返回空结果');
  }

  return {
    content: data.choices[0].message.content || '',
    usage: data.usage,
  };
}
