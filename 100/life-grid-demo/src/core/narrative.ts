import { Behavior, EffectSnapshot, LogEntry, ResultType } from '../types';

export interface NarrativeBundle {
  title: string;
  story: string;
  outcome: string;
}

const resultLabels: Record<ResultType, string> = {
  bigSuccess: '大成功',
  success: '成功',
  normal: '平平无奇',
  failure: '失败',
  bigFailure: '大失败',
};

function getLifeStage(age: number): { label: string; prefix: string } {
  if (age <= 5) return { label: '幼年', prefix: '在懵懂无知的年纪里，' };
  if (age <= 12) return { label: '童年', prefix: '在天真烂漫的时光中，' };
  if (age <= 18) return { label: '少年', prefix: '在朝气蓬勃的岁月里，' };
  if (age <= 30) return { label: '青年', prefix: '在人生的黄金年华，' };
  if (age <= 50) return { label: '中年', prefix: '在背负责任的年纪，' };
  if (age <= 70) return { label: '老年', prefix: '在渐入暮年的时光里，' };
  return { label: '暮年', prefix: '在人生的最后阶段，' };
}

function getCategoryStory(category: string, behaviorName: string, stage: string, risk: number): string {
  const riskDesc = risk >= 8 ? '冒着极大的风险' : risk >= 5 ? '顶着不小的压力' : '稳妥地';
  switch (category) {
    case '成长':
      return `${stage}你选择${behaviorName}，为生活打下根基。`;
    case '教育':
      return `${stage}你${riskDesc}投入${behaviorName}，试图为未来积累资本。`;
    case '事业':
      return `${stage}你${riskDesc}推进${behaviorName}，在职场上拼搏。`;
    case '投资':
      return `${stage}你${riskDesc}进行${behaviorName}，财富的天平开始摇摆。`;
    case '感情':
      return `${stage}你${riskDesc}经营${behaviorName}，情感的波澜由此起伏。`;
    case '家庭':
      return `${stage}你${riskDesc}陪伴家人，${behaviorName}让亲情升温。`;
    case '社交':
      return `${stage}你${riskDesc}参与${behaviorName}，人脉网络悄然变化。`;
    case '兴趣':
      return `${stage}你${riskDesc}尝试${behaviorName}，生活因此多了几分色彩。`;
    case '风险':
      return `${stage}你不得不面对${behaviorName}，危机的阴影笼罩心头。`;
    case '机遇':
      return `${stage}你敏锐地抓住${behaviorName}，命运的齿轮开始转动。`;
    default:
      return `${stage}你选择了${behaviorName}。`;
  }
}

function describeEffectValue(value: number | undefined, positive: string, negative: string): string | null {
  if (value === undefined) return null;
  if (value >= 10) return `大幅${positive}`;
  if (value >= 3) return `有所${positive}`;
  if (value > 0) return `略微${positive}`;
  if (value <= -10) return `大幅${negative}`;
  if (value <= -3) return `受到${negative}`;
  if (value < 0) return `略有${negative}`;
  return null;
}

function describeEffects(effects: EffectSnapshot): string {
  const parts: string[] = [];
  const h = describeEffectValue(effects.health, '改善', '损伤');
  if (h) parts.push(`健康${h}`);
  const w = describeEffectValue(effects.wealth, '增长', '缩水');
  if (w) parts.push(`财富${w}`);
  const k = describeEffectValue(effects.knowledge, '提升', '下降');
  if (k) parts.push(`知识${k}`);
  const s = describeEffectValue(effects.skill, '精进', '退步');
  if (s) parts.push(`技能${s}`);
  const so = describeEffectValue(effects.social, '拓展', '受损');
  if (so) parts.push(`人脉${so}`);
  const ha = describeEffectValue(effects.happy, '提升', '下降');
  if (ha) parts.push(`幸福${ha}`);
  const c = describeEffectValue(effects.charm, '提升', '下降');
  if (c) parts.push(`魅力${c}`);
  const l = describeEffectValue(effects.luck, '上升', '下降');
  if (l) parts.push(`运势${l}`);

  if (parts.length === 0) return '各方面没有明显变化。';
  return parts.join('，') + '。';
}

function getAgeContext(age: number): string {
  if (age >= 80) return '年迈的身体让每一次波动都更加明显。';
  if (age >= 50) return '年龄增长带来的自然衰退也在悄悄发生。';
  if (age >= 30) return '成年生活的长期压力在潜移默化中积累。';
  return '';
}

function getResultOutcome(result: ResultType, effects: EffectSnapshot, events: string[], risk: number, age: number): string {
  const effectDesc = describeEffects(effects);
  const eventText = events.length > 0 ? `期间发生了：${events.join('、')}。` : '';
  const ageContext = getAgeContext(age);
  const separator = ageContext ? ` ${ageContext}` : '';

  switch (result) {
    case 'bigSuccess':
      return `结果超出预期，一切顺风顺水。${effectDesc}${eventText}${separator}`;
    case 'success':
      return `事情进展顺利，努力没有白费。${effectDesc}${eventText}${separator}`;
    case 'normal':
      if (risk >= 7) {
        return `虽然过程惊险，但最终有惊无险。${effectDesc}${eventText}${separator}`;
      }
      return `结果中规中矩，没有惊喜也没有太大损失。${effectDesc}${eventText}${separator}`;
    case 'failure':
      return `事情不太顺利，你付出了代价。${effectDesc}${eventText}${separator}`;
    case 'bigFailure':
      return `命运开了个残酷的玩笑，这次打击令你久久难以平复。${effectDesc}${eventText}${separator}`;
  }
}

function generateBehaviorNarrative(log: LogEntry, behavior?: Behavior): NarrativeBundle {
  const age = log.age;
  const result = log.result;
  const risk = log.riskLevel;
  const category = behavior?.category || log.behaviorCategory || '其他';
  const behaviorName = behavior?.name || log.behaviorName;
  const description = behavior?.description || '';
  const stage = getLifeStage(age);

  // 如果行为本身配了叙事，优先使用行为自己的标题和故事
  if (behavior?.narrative) {
    const n = behavior.narrative;
    let outcome: string;
    switch (result) {
      case 'bigSuccess':
      case 'success':
        outcome = n.successText || `你获得了成功：${behavior.name}。`;
        break;
      case 'bigFailure':
      case 'failure':
        outcome = n.failureText || `你遭遇了失败：${behavior.name}。`;
        break;
      default:
        outcome = n.normalText || `结果平平淡淡，${behavior.name}没有掀起太大波澜。`;
    }
    return {
      title: `${age}岁 · ${n.title}`,
      story: n.story,
      outcome: `【${resultLabels[result]}】${outcome} ${getResultOutcome(result, log.effects, log.events, risk, log.age)}`,
    };
  }

  const title = `${age}岁 · ${category} · ${behaviorName}`;
  const story = `${stage.prefix}${getCategoryStory(category, behaviorName, '', risk)}${description ? `（${description}）` : ''}`;
  const outcome = `【${resultLabels[result]}】${getResultOutcome(result, log.effects, log.events, risk, log.age)}`;

  return { title, story, outcome };
}

function generatePreDeathNarrative(log: LogEntry): NarrativeBundle {
  return {
    title: `${log.age}岁 · 临终征兆`,
    story: '这一年，命运的阴影悄然逼近。',
    outcome: log.deathReason || '你的身体或处境出现了严重危机。',
  };
}

function generateDeathNarrative(log: LogEntry): NarrativeBundle {
  const reason = log.deathReason || '人生走到了尽头。';
  return {
    title: `${log.age}岁 · 人生终点`,
    story: '这一年，你的人生画上了句号。',
    outcome: reason,
  };
}

export function getNarrative(log: LogEntry, behavior?: Behavior): NarrativeBundle {
  if (log.specialType === 'pre-death') {
    return generatePreDeathNarrative(log);
  }
  if (log.specialType === 'death' || log.behaviorName === '离世' || log.deathReason) {
    return generateDeathNarrative(log);
  }
  return generateBehaviorNarrative(log, behavior);
}
