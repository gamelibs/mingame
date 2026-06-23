import { GameEvent } from '../types';

export const gameEvents: GameEvent[] = [
  // 幸运事件
  {
    id: 'evt_lucky_lottery',
    type: 'lucky',
    title: '意外之财',
    description: '你在路边捡到一个装满物资的背包，运气爆棚。',
    narrative: '你在街角发现一个被人遗忘的背包，里面装满了财物。命运似乎在向你微笑。',
    minAge: 10,
    maxAge: 100,
    effects: { wealth: 20, happy: 5 },
    weight: 3
  },
  {
    id: 'evt_lucky_mentor',
    type: 'lucky',
    title: '贵人相助',
    description: '一位长者看中了你的潜力，决定传授经验。',
    narrative: '一位经验丰富的前辈主动向你伸出援手，愿意传授毕生所学。',
    minAge: 15,
    maxAge: 50,
    effects: { knowledge: 8, skill: 7, charm: 3 },
    weight: 2
  },
  {
    id: 'evt_lucky_inspiration',
    type: 'lucky',
    title: '灵感迸发',
    description: '某天夜里，你想到了一个绝妙的点子。',
    narrative: '深夜的灵光一闪，让你发现了一个可能改变一切的方向。',
    minAge: 18,
    maxAge: 60,
    effects: { knowledge: 6, skill: 6 },
    weight: 3
  },
  {
    id: 'evt_lucky_reunion',
    type: 'lucky',
    title: '久别重逢',
    description: '你与失散多年的老友意外重逢。',
    narrative: '命运让失散多年的老友再次出现在你面前，回忆涌上心头。',
    minAge: 20,
    maxAge: 90,
    effects: { happy: 10, social: 5 },
    weight: 2
  },

  // 普通事件
  {
    id: 'evt_normal_rain',
    type: 'normal',
    title: '一场雨',
    description: '下雨了，空气变得清新。',
    narrative: '一场突如其来的雨洗净了城市的尘埃，也洗去了你心中的烦躁。',
    effects: { happy: 1, health: 1 },
    weight: 8
  },
  {
    id: 'evt_normal_neighbor',
    type: 'normal',
    title: '邻居来访',
    description: '邻居上门寒暄了几句。',
    narrative: '邻居带着自家做的点心登门拜访，闲聊中你感受到了人间的烟火气。',
    effects: { social: 2, happy: 1 },
    weight: 8
  },
  {
    id: 'evt_normal_book',
    type: 'normal',
    title: '读到一本好书',
    description: '书中的故事让你有所感悟。',
    narrative: '一本偶然翻开的书，字里行间恰好解答了你最近的困惑。',
    minAge: 8,
    maxAge: 100,
    effects: { knowledge: 2, happy: 2 },
    weight: 7
  },
  {
    id: 'evt_normal_skill',
    type: 'normal',
    title: '熟能生巧',
    description: '持续的练习让你的技能小有提升。',
    narrative: '日复一日的练习终于有了回报，你的能力悄然提升了一个台阶。',
    minAge: 10,
    maxAge: 70,
    effects: { skill: 3 },
    weight: 7
  },
  {
    id: 'evt_normal_weekend',
    type: 'normal',
    title: '悠闲周末',
    description: '你度过了一个放松的周末。',
    narrative: '没有工作、没有压力，你尽情享受了一个慵懒的周末。',
    effects: { happy: 3, health: 1 },
    weight: 8
  },

  // 危机事件
  {
    id: 'evt_crisis_accident',
    type: 'crisis',
    title: '意外事故',
    description: '一次意外让你受了轻伤。',
    narrative: '一次意外让你措手不及，身体与生活都受到了冲击。',
    minAge: 5,
    maxAge: 100,
    effects: { health: -10, wealth: -5, happy: -3 },
    weight: 4
  },
  {
    id: 'evt_crisis_betrayal',
    type: 'crisis',
    title: '被人背叛',
    description: '信任的人出卖了你，损失惨重。',
    narrative: '你最信任的人背叛了你，多年的情谊在利益面前支离破碎。',
    minAge: 20,
    maxAge: 80,
    effects: { social: -5, wealth: -15, happy: -10 },
    weight: 3
  },
  {
    id: 'evt_crisis_illness',
    type: 'crisis',
    title: '突发疾病',
    description: '一场大病让你卧床数日。',
    narrative: '一场突如其来的疾病袭来，你不得不放下手中的一切。',
    minAge: 30,
    maxAge: 100,
    effects: { health: -15, wealth: -10, happy: -5 },
    weight: 4
  },
  {
    id: 'evt_crisis_disaster',
    type: 'crisis',
    title: '自然灾害',
    description: '地震/洪水来袭，你损失了一些物资。',
    narrative: '自然灾害毫无征兆地降临，你眼睁睁看着财产化为乌有。',
    minAge: 1,
    maxAge: 120,
    effects: { wealth: -20, health: -5, happy: -5 },
    weight: 2
  },
  {
    id: 'evt_crisis_war',
    type: 'crisis',
    title: '区域冲突',
    description: '附近爆发冲突，生活受到严重影响。',
    narrative: '附近的冲突波及到你的生活，和平的日子一去不复返。',
    minAge: 10,
    maxAge: 80,
    effects: { wealth: -15, health: -10, knowledge: -2, skill: -1 },
    weight: 2
  },

  // 时代事件
  {
    id: 'evt_era_tech',
    type: 'era',
    title: '技术革命',
    description: '新技术改变了社会，学习能力强的人受益。',
    narrative: '新技术的浪潮席卷而来，跟不上的人将被时代抛下。',
    minAge: 18,
    maxAge: 60,
    effects: { knowledge: 6, skill: 6 },
    weight: 2
  },
  {
    id: 'evt_era_economic',
    type: 'era',
    title: '经济繁荣',
    description: '市场整体向好，投资获得回报。',
    narrative: '市场一片繁荣，抓住机会的人财富迅速积累。',
    minAge: 20,
    maxAge: 70,
    effects: { wealth: 15, social: 1, charm: 1 },
    weight: 2
  },
  {
    id: 'evt_era_recession',
    type: 'era',
    title: '经济衰退',
    description: '市场萧条，许多投资缩水。',
    narrative: '经济寒冬降临，各行各业都在紧缩，人人自危。',
    minAge: 20,
    maxAge: 70,
    effects: { wealth: -15, happy: -3 },
    weight: 2
  },
  {
    id: 'evt_era_plague',
    type: 'era',
    title: '瘟疫流行',
    description: '一场流行病席卷而来。',
    narrative: '一场流行病蔓延开来，健康与秩序都遭受重创。',
    minAge: 1,
    maxAge: 120,
    effects: { health: -10, social: -2, charm: -1, wealth: -5 },
    weight: 1
  },

  // 家庭事件
  {
    id: 'evt_family_birth',
    type: 'family',
    title: '新生命诞生',
    description: '家中添丁，你感到责任与幸福。',
    narrative: '家中迎来了新生命，你第一次感受到如此沉重的责任与喜悦。',
    minAge: 20,
    maxAge: 50,
    effects: { happy: 10, social: 2, charm: 1, wealth: -5 },
    weight: 3
  },
  {
    id: 'evt_family_wedding',
    type: 'family',
    title: '婚礼喜讯',
    description: '亲友结婚，你参加了热闹的婚礼。',
    narrative: '喜庆的婚礼上，你见证了两颗心的结合。',
    minAge: 18,
    maxAge: 70,
    effects: { happy: 5, social: 2, charm: 1, wealth: -2 },
    weight: 4
  },
  {
    id: 'evt_family_loss',
    type: 'family',
    title: '亲人离世',
    description: '一位亲人离开了人世，你悲痛不已。',
    narrative: '亲人的离去像一记重锤，让你重新审视生命的意义。',
    minAge: 20,
    maxAge: 120,
    effects: { happy: -15, health: -3, social: -1, charm: -1 },
    weight: 3
  },
  {
    id: 'evt_family_reunion',
    type: 'family',
    title: '家庭团聚',
    description: '全家人难得聚在一起。',
    narrative: '久未团聚的家人围坐在一起，欢声笑语驱散了孤独。',
    minAge: 10,
    maxAge: 120,
    effects: { happy: 8, social: 3, charm: 2 },
    weight: 5
  },
  {
    id: 'evt_family_conflict',
    type: 'family',
    title: '家庭矛盾',
    description: '与家人发生争执，心情低落。',
    narrative: '一场争吵让家庭气氛降至冰点，沟通变得困难重重。',
    minAge: 15,
    maxAge: 90,
    effects: { happy: -5, social: -2, charm: -1, health: -1 },
    weight: 4
  },

  // 健康事件
  {
    id: 'evt_health_recovery',
    type: 'health',
    title: '身体康复',
    description: '你的身体状况有所好转。',
    narrative: '身体逐渐恢复，你重新感受到健康带来的自由。',
    minAge: 1,
    maxAge: 120,
    effects: { health: 8, happy: 2 },
    weight: 5
  },
  {
    id: 'evt_health_fever',
    type: 'health',
    title: '感冒发烧',
    description: '一场小病让你虚弱了几天。',
    narrative: '一场感冒发烧让你卧床数日，才意识到健康多么重要。',
    minAge: 1,
    maxAge: 100,
    effects: { health: -5, happy: -2 },
    weight: 6
  },
  {
    id: 'evt_health_marathon',
    type: 'health',
    title: '马拉松挑战',
    description: '你完成了一次马拉松，体能大增。',
    narrative: '你完成了马拉松挑战，汗水与坚持换来了前所未有的成就感。',
    minAge: 18,
    maxAge: 60,
    effects: { health: 10, skill: 2, happy: 5 },
    weight: 2
  },
  {
    id: 'evt_health_addiction',
    type: 'health',
    title: '不良习惯',
    description: '沉迷某种不良习惯，健康受损。',
    narrative: '不良习惯悄悄侵蚀着你的健康，戒除它比想象中更难。',
    minAge: 18,
    maxAge: 80,
    effects: { health: -8, wealth: -5, happy: -2 },
    weight: 3
  },
  {
    id: 'evt_health_checkup',
    type: 'health',
    title: '体检发现隐患',
    description: '定期体检让你及时发现并处理健康隐患。',
    narrative: '一次体检及时发现隐患，医生的叮嘱让你开始重视身体。',
    minAge: 25,
    maxAge: 100,
    effects: { health: 5, wealth: -3 },
    weight: 4
  },

  // 财富事件
  {
    id: 'evt_wealth_bonus',
    type: 'wealth',
    title: '项目奖金',
    description: '你的努力获得了丰厚的奖金。',
    narrative: '项目大获成功，丰厚的奖金让你的努力有了回报。',
    minAge: 22,
    maxAge: 60,
    effects: { wealth: 25, happy: 5 },
    weight: 3
  },
  {
    id: 'evt_wealth_loss',
    type: 'wealth',
    title: '投资亏损',
    description: '一次投资判断失误，资金缩水。',
    narrative: '一次错误的投资判断让你的资产大幅缩水。',
    minAge: 22,
    maxAge: 80,
    effects: { wealth: -20, happy: -5 },
    weight: 4
  },
  {
    id: 'evt_wealth_inheritance',
    type: 'wealth',
    title: '获得遗产',
    description: '一位长辈留给你一笔遗产。',
    narrative: '一笔意外的遗产改变了你的财务状况，也带来了复杂的情绪。',
    minAge: 30,
    maxAge: 90,
    effects: { wealth: 40, happy: 2 },
    weight: 1
  },
  {
    id: 'evt_wealth_theft',
    type: 'wealth',
    title: '遭遇盗窃',
    description: '你的财物被盗，损失惨重。',
    narrative: '财物被盗让你损失惨重，安全感瞬间崩塌。',
    minAge: 15,
    maxAge: 100,
    effects: { wealth: -15, happy: -5 },
    weight: 3
  },
  {
    id: 'evt_wealth_startup',
    type: 'wealth',
    title: '创业风口',
    description: '你赶上了行业风口，财富快速增长。',
    narrative: '风口上的创业让你的财富迅速膨胀，你也成为了众人瞩目的焦点。',
    minAge: 25,
    maxAge: 55,
    effects: { wealth: 50, social: 3, charm: 2 },
    weight: 1
  }
];
