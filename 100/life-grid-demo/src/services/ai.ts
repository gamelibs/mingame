export interface AiChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AiChatOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export interface AiChatResult {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface AiChatResponse {
  success: boolean;
  data?: AiChatResult;
  message?: string;
}

export async function aiChat(
  messages: AiChatMessage[],
  options?: AiChatOptions
): Promise<AiChatResult> {
  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, options }),
  });

  const json = (await res.json()) as AiChatResponse;
  if (!res.ok || !json.success) {
    throw new Error(json.message || `AI 请求失败 (${res.status})`);
  }
  return json.data!;
}

/** 请求 AI 生成人生目标开场白 */
export async function fetchLifeGoalOpening(
  goalName: string,
  goalDesc: string,
  attributes: Record<string, number>
): Promise<string> {
  const attrText = Object.entries(attributes)
    .map(([k, v]) => `${k}: ${v}`)
    .join('，');

  const messages: AiChatMessage[] = [
    {
      role: 'system',
      content:
        '你是一名富有哲理的人生叙事师。请根据玩家选择的人生目标和初始属性，写一段 80~120 字的中文开场白，语气温暖、有代入感，并暗示这条路的艰辛与可能。只返回正文，不要标题。',
    },
    {
      role: 'user',
      content: `人生目标：${goalName}\n目标描述：${goalDesc}\n初始属性：${attrText}`,
    },
  ];

  const result = await aiChat(messages, { maxTokens: 256 });
  return result.content.trim();
}

/** 请求 AI 对玩家本次选择给出合理性评价 */
export async function fetchChoiceFeedback(
  goalName: string,
  age: number,
  behaviorName: string,
  behaviorCategory: string,
  history: string[]
): Promise<{ score: number; comment: string }> {
  const messages: AiChatMessage[] = [
    {
      role: 'system',
      content:
        '你是一名人生导师。请判断玩家本次选择是否符合其人生目标，并给出一句简短评语（30 字以内）。评分 1~5，5 分为非常合理。只返回 JSON：{"score": number, "comment": "..."}',
    },
    {
      role: 'user',
      content: `人生目标：${goalName}\n当前年龄：${age} 岁\n本次选择：${behaviorName}（${behaviorCategory}）\n此前选择：${history.slice(-5).join(' → ')}`,
    },
  ];

  const result = await aiChat(messages, { maxTokens: 128, temperature: 0.5 });
  try {
    const parsed = JSON.parse(result.content);
    return {
      score: Math.max(1, Math.min(5, Number(parsed.score) || 3)),
      comment: String(parsed.comment || '继续加油。'),
    };
  } catch {
    return { score: 3, comment: result.content.trim().slice(0, 60) || '继续加油。' };
  }
}
