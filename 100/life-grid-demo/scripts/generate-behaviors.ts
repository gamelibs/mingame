import * as fs from 'fs';
import * as path from 'path';

interface BehaviorSeed {
  id: string;
  name: string;
  category: string;
  minAge: number;
  maxAge: number;
  riskLevel: number;
  rewardLevel: number;
  failureLevel: number;
  balanceEffect: number;
  unlockWealth: number;
  tags: string[];
  description: string;
  narrative?: {
    title: string;
    story: string;
    successText: string;
    failureText: string;
    normalText?: string;
  };
}

const CATEGORIES = ['成长', '教育', '事业', '投资', '感情', '家庭', '社交', '兴趣', '风险', '机遇'];

const AGE_GROUPS = [
  { key: 'infant', min: 1, max: 5, label: '幼儿' },
  { key: 'child', min: 6, max: 12, label: '儿童' },
  { key: 'teen', min: 13, max: 18, label: '少年' },
  { key: 'young', min: 19, max: 30, label: '青年' },
  { key: 'middle', min: 31, max: 50, label: '中年' },
  { key: 'old', min: 51, max: 70, label: '老年前期' },
  { key: 'elder', min: 71, max: 120, label: '晚年' },
];

function riskForAge(ageKey: string, category: string): number {
  const base: Record<string, number> = {
    infant: 1,
    child: 2,
    teen: 3,
    young: 5,
    middle: 6,
    old: 5,
    elder: 4,
  };
  let r = base[ageKey] ?? 3;
  if (category === '风险') r += 1;
  if (category === '机遇') r += 0;
  if (category === '事业' || category === '投资') r += 1;
  if (category === '成长' || category === '教育') r -= 1;
  return Math.max(1, Math.min(10, r));
}

function rewardForAge(ageKey: string, category: string): number {
  const base: Record<string, number> = {
    infant: 1,
    child: 2,
    teen: 3,
    young: 4,
    middle: 5,
    old: 4,
    elder: 3,
  };
  let rw = base[ageKey] ?? 3;
  if (category === '投资' || category === '事业') rw += 1;
  if (category === '风险') rw += 1;
  return Math.max(1, Math.min(10, rw));
}

function failureForAge(ageKey: string, category: string): number {
  const base: Record<string, number> = {
    infant: 1,
    child: 1,
    teen: 2,
    young: 3,
    middle: 4,
    old: 3,
    elder: 2,
  };
  let f = base[ageKey] ?? 2;
  if (category === '风险') f += 1;
  return Math.max(1, Math.min(10, f));
}

function balanceEffectFor(category: string): number {
  if (category === '成长' || category === '教育') return 1;
  if (category === '家庭' || category === '兴趣') return 1;
  if (category === '事业' || category === '投资') return 0;
  if (category === '社交') return 0;
  if (category === '感情') return 1;
  if (category === '风险') return -1;
  if (category === '机遇') return 0;
  return 0;
}

function tagsFor(category: string, ageKey: string): string[] {
  const map: Record<string, string[]> = {
    成长: ['健康', '基础', '恢复'],
    教育: ['知识', '技能', '成长'],
    事业: ['技能', '财富', '人脉'],
    投资: ['财富', '风险', '机遇'],
    感情: ['幸福', '魅力', '人脉'],
    家庭: ['幸福', '健康', '人脉'],
    社交: ['人脉', '魅力', '社交'],
    兴趣: ['幸福', '魅力', '健康'],
    风险: ['风险', '运气', '挑战'],
    机遇: ['运气', '机遇', '财富'],
  };
  const base = map[category] ?? ['综合'];
  if (ageKey === 'infant' || ageKey === 'child') {
    if (!base.includes('基础')) base.push('基础');
  }
  if (category === '风险' || category === '机遇') {
    if (!base.includes('运气')) base.push('运气');
  }
  return base.slice(0, 4);
}

function narrativeFor(name: string, category: string, ageLabel: string) {
  const success = '事情进展顺利，努力没有白费。';
  const failure = '事情不太顺利，你付出了一些代价。';
  const normal = '结果中规中矩，没有惊喜也没有太大损失。';
  return {
    title: name,
    story: `在${ageLabel}阶段，你选择了「${name}」。这是${category}类行为，会影响你的人生走向。`,
    successText: success,
    failureText: failure,
    normalText: normal,
  };
}

const modernTemplates: Record<string, Record<string, string[]>> = {
  成长: {
    infant: ['早睡早起', '乖乖吃饭', '自己走路', '学刷牙', '听儿歌'],
    child: ['按时睡觉', '均衡饮食', '跑步玩耍', '做眼保健操', '勤洗手'],
    teen: ['坚持锻炼', '规律作息', '远离烟酒', '健康体检', '心理调节'],
    young: ['健身房训练', '晨跑', '瑜伽课', '均衡膳食', '定期体检'],
    middle: ['坚持运动', '控制体重', '戒烟限酒', '年度体检', '慢病管理'],
    old: ['养生太极', '散步健身', '健康食谱', '康复训练', '定期复查'],
    elder: ['静坐养神', '晒太阳补钙', '规律用药', '适度活动', '养生保健'],
  },
  教育: {
    infant: ['学说话', '学走路', '听故事', '看绘本', '认颜色'],
    child: ['认真上课', '完成作业', '课外阅读', '学数学', '学英语'],
    teen: ['备考冲刺', '参加竞赛', '学编程', '学历史', '学物理'],
    young: ['专业进修', '考研复习', '考公备考', '考职业证书', '学英语'],
    middle: ['读MBA', '管理培训', '学投资理财', '学外语', '行业进修'],
    old: ['读在职研究生', '参加讲座', '学新技能', '看书充电', '老年大学'],
    elder: ['上老年大学', '学书法', '学绘画', '读报纸', '听网课'],
  },
  事业: {
    infant: ['帮小忙'],
    child: ['做小任务'],
    teen: ['暑期兼职', '勤工俭学', '参加实习', '志愿活动'],
    young: ['努力工作', '主动加班', '跳槽换工作', '争取升职', '创业启动'],
    middle: ['带团队', '商务谈判', '项目攻关', '职业转型', '拓展业务'],
    old: ['管理顾问', '经验传承', '创业守成', '副业经营', '退休返聘'],
    elder: ['顾问指导', '社区服务', '传授手艺', '轻量工作', '分享经验'],
  },
  投资: {
    infant: ['存零花钱'],
    child: ['存压岁钱'],
    teen: ['小额储蓄', '买学习基金'],
    young: ['定期存款', '买基金', '买股票', '买黄金', '学理财'],
    middle: ['买房置业', '投资股票', '购买保险', '理财产品', '投资教育'],
    old: ['资产配置', '养老金规划', '购买国债', '信托投资', '稳健理财'],
    elder: ['保守理财', '遗产规划', '购买年金', '低风险储蓄', '稳健投资'],
  },
  感情: {
    infant: ['亲近家人'],
    child: ['喜欢玩伴'],
    teen: ['暗恋', '写情书', '初次约会', '校园恋情', '表白'],
    young: ['认真恋爱', '求婚', '步入婚姻', '经营感情', '处理分手'],
    middle: ['婚姻经营', '夫妻旅行', '相互扶持', '感情保鲜', '家庭责任'],
    old: ['陪伴伴侣', '回忆往昔', '维系婚姻', '子女婚事', '夫妻养生'],
    elder: ['金婚纪念', '携手散步', '共度晚年', '陪伴老伴', '重温旧梦'],
  },
  家庭: {
    infant: ['亲子游戏', '依偎父母', '学叫爸妈', '被抱在怀里'],
    child: ['陪伴家人', '帮忙做家务', '家庭聚餐', '听父母教导', '亲子阅读'],
    teen: ['陪伴父母', '家庭旅行', '照顾弟妹', '一起看电视', '家庭会议'],
    young: ['组建家庭', '养育子女', '买房安家', '孝敬父母', '家庭聚会'],
    middle: ['子女教育', '赡养老父老母', '家庭理财', '家庭旅行', '亲子沟通'],
    old: ['照顾孙辈', '家庭团圆', '陪老伴', '处理家务', '传承家风'],
    elder: ['含饴弄孙', '家庭聚餐', '与子女通话', '回忆往事', '安享天伦'],
  },
  社交: {
    infant: ['对大人笑'],
    child: ['交朋友', '参加生日会', '与邻居玩耍', '参加兴趣班'],
    teen: ['参加社团', '同学聚会', '网络社交', '结交新朋友', '参加志愿'],
    young: ['拓展人脉', '参加行业活动', '维护关系', '商务宴请', '社交应酬'],
    middle: ['人脉维护', '参加校友会', '商业合作', '社交俱乐部', '政治关系'],
    old: ['老友聚会', '社区活动', '亲戚走动', '参加协会', '志愿服务'],
    elder: ['老年社团', '邻里互助', '老友茶话', '社区讲座', '志愿陪伴'],
  },
  兴趣: {
    infant: ['听音乐', '玩玩具', '涂鸦', '看动画片'],
    child: ['画画', '唱歌', '跳舞', '踢足球', '弹钢琴'],
    teen: ['打游戏', '追剧', '打篮球', '摄影', '学乐器'],
    young: ['旅行', '摄影', '健身', '烹饪', '看电影'],
    middle: ['高尔夫', '自驾游', '茶道', '园艺', '收藏'],
    old: ['书法', '钓鱼', '下棋', '养花', '广场舞'],
    elder: ['听戏曲', '写回忆录', '手工艺', '养鸟', '书法绘画'],
  },
  风险: {
    infant: ['摔倒', '感冒发烧', '误食东西', '夜间哭闹'],
    child: ['淘气受伤', '被欺负', '走失风险', '食物中毒'],
    teen: ['叛逆冲动', '早恋风波', '考试失利', '网络沉迷'],
    young: ['创业失败', '投资亏损', '失业危机', '交通事故', '感情破裂'],
    middle: ['职场危机', '健康预警', '婚姻危机', '投资失败', '意外事故'],
    old: ['重大疾病', '被骗', '退休失落', '意外伤害', '慢性病发'],
    elder: ['身体失能', '被骗财产', '孤独终老', '突发急病', '意外跌倒'],
  },
  机遇: {
    infant: ['意外发现', '被夸奖', '遇到好心人'],
    child: ['获奖', '遇到好老师', '意外礼物', '比赛机会'],
    teen: ['奖学金', '竞赛获奖', '贵人相助', '出国机会'],
    young: ['升职机会', '投资良机', '偶遇贵人', '创业风口', '中奖'],
    middle: ['事业突破', '资产翻倍', '贵人提携', '合作机会', '意外之财'],
    old: ['养老金上涨', '子女有成', '健康长寿', '中奖', '晚年福气'],
    elder: ['长寿安康', '子孙满堂', '意外惊喜', '社会关怀', '安享晚年'],
  },
};

const apocalypseTemplates: Record<string, Record<string, string[]>> = {
  成长: {
    infant: ['裹紧破毯', '寻找温暖', '喝过滤水', '包扎伤口'],
    child: ['躲避危险', '学习求生', '寻找食物', '保持安静'],
    teen: ['体能训练', '练习潜行', '制作陷阱', '搜寻药品'],
    young: ['荒野求生', '锻炼身体', '学习医疗', '保持警惕'],
    middle: ['治疗伤病', '维护装备', '净化水源', '搜寻物资'],
    old: ['保存体力', '简单锻炼', '服用药物', '休息恢复'],
    elder: ['缓慢移动', '节省体力', '依靠他人', '维持生命'],
  },
  教育: {
    infant: ['观察环境', '听大人吩咐'],
    child: ['学习暗号', '认路标', '学急救', '读旧书'],
    teen: ['学习战斗', '学习机械', '学习种植', '学习用药'],
    young: ['研究地图', '学习领导', '学习交易', '学习侦查'],
    middle: ['传授经验', '研究科技', '培训新人', '学习医疗'],
    old: ['整理知识', '写求生笔记', '教年轻人', '回忆旧技'],
    elder: ['口述历史', '传授经验', '安静倾听', '指导后辈'],
  },
  事业: {
    infant: ['帮忙看守'],
    child: ['传递消息', '放哨', '搜集柴火'],
    teen: ['巡逻', '修理器械', '驾驶车辆', '搬运物资'],
    young: ['外出探索', '带队搜寻', '保卫营地', '建设据点'],
    middle: ['指挥战斗', '管理营地', '交易谈判', '制定计划'],
    old: ['顾问参谋', '维护秩序', '医疗救治', '传授战术'],
    elder: ['守家', '讲故事', '调解纠纷', '精神支柱'],
  },
  投资: {
    infant: ['收集小物件'],
    child: ['囤积零食', '收集瓶盖'],
    teen: ['交换物资', '修理装备', '倒卖物资'],
    young: ['搜寻武器', '储存燃料', '投资种植', '囤积药品'],
    middle: ['扩建据点', '交易物资', '投资车队', '储备粮食'],
    old: ['稳固资产', '分配资源', '养老物资', '保护财产'],
    elder: ['守住物资', '分配遗产', '依靠储备', '简单交易'],
  },
  感情: {
    infant: ['依附亲人'],
    child: ['信任伙伴', '结交同伴'],
    teen: ['末世初恋', '守护同伴', '组建小队'],
    young: ['组建家庭', '寻找伴侣', '守护家人', '建立信任'],
    middle: ['维系关系', '保护伴侣', '共同求生', '情感支持'],
    old: ['陪伴老伴', '照顾家人', '回忆往昔', '守护孙辈'],
    elder: ['依靠伴侣', '回忆家人', '安静陪伴', '临终嘱托'],
  },
  家庭: {
    infant: ['被抱着逃命'],
    child: ['跟随家人', '帮忙藏匿', '照顾弟妹'],
    teen: ['保护家人', '分担物资', '守护营地'],
    young: ['组建小家', '养育后代', '建设安全屋', '寻找亲人'],
    middle: ['守护据点', '教育子女', '照顾老人', '家庭分工'],
    old: ['照顾孙辈', '维系家庭', '传承家风', '守家'],
    elder: ['被照顾', '与家人相依', '回忆过去', '安然等待'],
  },
  社交: {
    infant: ['向大人撒娇'],
    child: ['结识小伙伴', '加入孩童群'],
    teen: ['加入少年队', '结成交换网', '建立信誉'],
    young: ['加入幸存者团体', '结交盟友', '建立声望', '谈判交易'],
    middle: ['领袖交际', '联盟谈判', '维护势力', '组织集会'],
    old: ['长老议事', '调解冲突', '传承关系', '受人尊敬'],
    elder: ['受人照顾', '讲述往事', '维系旧识', '安静相处'],
  },
  兴趣: {
    infant: ['玩破玩具'],
    child: ['画废墟', '唱歌', '捉迷藏'],
    teen: ['练格斗', '收集卡牌', '弹旧吉他'],
    young: ['射击练习', '改装车辆', '种植花草', '修理机械'],
    middle: ['酿酒', '烹饪美食', '制作工具', '读书'],
    old: ['下棋', '钓鱼', '写日记', '听老歌'],
    elder: ['晒太阳', '看天空', '回忆往事', '安静养神'],
  },
  风险: {
    infant: ['哭泣引来危险', '被遗弃风险'],
    child: ['外出迷路', '遭遇掠夺者', '误食毒物'],
    teen: ['鲁莽行动', '感染风险', '遭遇变异生物'],
    young: ['探索废墟', '与敌对势力冲突', '资源争夺', '感染爆发'],
    middle: ['领导战斗', '高风险交易', '据点防御', '疫病流行'],
    old: ['身体衰退', '被掠夺', '疾病缠身', '孤独遇险'],
    elder: ['行动受限', '被遗弃', '突发疾病', '意外身亡'],
  },
  机遇: {
    infant: ['被发现获救'],
    child: ['找到罐头', '遇到好心人'],
    teen: ['发现武器库', '学会新技能', '加入强队'],
    young: ['找到安全区', '获得物资箱', '结识强者', '发现水源'],
    middle: ['占领据点', '获得车辆', '发现粮仓', '交易大赚'],
    old: ['长寿生存', '子孙平安', '发现药品', '意外之财'],
    elder: ['安享晚年', '被人照顾', '回忆幸福', '临终平静'],
  },
};

function descriptionFor(name: string, mode: 'modern' | 'apocalypse'): string {
  if (mode === 'apocalypse') {
    return `在末世环境中执行「${name}」，以求生存。`;
  }
  return `选择${name}，这是人生中常见的行为之一。`;
}

function generateFromTemplates(
  mode: 'modern' | 'apocalypse',
  prefix: string,
  targetPerCell: number
): BehaviorSeed[] {
  const templates = mode === 'modern' ? modernTemplates : apocalypseTemplates;
  const result: BehaviorSeed[] = [];
  let globalIndex = 0;

  for (const category of CATEGORIES) {
    const catMap = templates[category];
    if (!catMap) continue;
    for (const age of AGE_GROUPS) {
      const names = catMap[age.key] || ['日常' + category];
      // 根据目标数量复制模板并添加序号变体
      const baseNames = names;
      const count = targetPerCell;
      for (let i = 0; i < count; i++) {
        const baseName = baseNames[i % baseNames.length];
        const suffix = count > baseNames.length ? `·${Math.floor(i / baseNames.length) + 1}` : '';
        const name = baseName + suffix;
        const id = `${prefix}_${category}_${age.key}_${i}`;
        const risk = riskForAge(age.key, category);
        const reward = rewardForAge(age.key, category);
        const failure = failureForAge(age.key, category);
        result.push({
          id,
          name,
          category,
          minAge: age.min,
          maxAge: age.max,
          riskLevel: risk,
          rewardLevel: reward,
          failureLevel: failure,
          balanceEffect: balanceEffectFor(category),
          unlockWealth: 0,
          tags: tagsFor(category, age.key),
          description: descriptionFor(name, mode),
          narrative: narrativeFor(name, category, age.label),
        });
        globalIndex++;
      }
    }
  }
  return result;
}

function behaviorToTS(b: BehaviorSeed, indent = 2): string {
  const sp = ' '.repeat(indent);
  let s = `${sp}{
${sp}  id: '${b.id}',
${sp}  name: '${b.name}',
${sp}  category: '${b.category}',
${sp}  minAge: ${b.minAge},
${sp}  maxAge: ${b.maxAge},
${sp}  riskLevel: ${b.riskLevel},
${sp}  rewardLevel: ${b.rewardLevel},
${sp}  failureLevel: ${b.failureLevel},
${sp}  balanceEffect: ${b.balanceEffect},
${sp}  unlockWealth: ${b.unlockWealth},
${sp}  tags: [${b.tags.map((t) => `'${t}'`).join(', ')}],
${sp}  description: '${b.description}'`;
  if (b.narrative) {
    s += `,
${sp}  narrative: {
${sp}    title: '${b.narrative.title}',
${sp}    story: '${b.narrative.story}',
${sp}    successText: '${b.narrative.successText}',
${sp}    failureText: '${b.narrative.failureText}'`;
    if (b.narrative.normalText) {
      s += `,
${sp}    normalText: '${b.narrative.normalText}'`;
    }
    s += `,
${sp}  }`;
  }
  s += `,
${sp}}`;
  return s;
}

function writeGeneratedFile(mode: 'modern' | 'apocalypse', prefix: string, targetPerCell: number, outName: string) {
  const behaviors = generateFromTemplates(mode, prefix, targetPerCell);
  const varName = `generated${mode === 'modern' ? 'Modern' : 'Apocalypse'}Behaviors`;
  const lines = behaviors.map((b) => behaviorToTS(b)).join(',\n');
  const content = `import { Behavior } from '../types';

// 由 scripts/generate-behaviors.ts 自动生成，用于扩充${mode === 'modern' ? '现代' : '末世'}行为库
export const ${varName}: Behavior[] = [
${lines}
];
`;
  const outPath = path.resolve(__dirname, `../src/data/${outName}`);
  fs.writeFileSync(outPath, content, 'utf-8');
  console.log(`${outName}: 生成 ${behaviors.length} 条行为`);
}

// 目标：现代约 350 条，末世约 150 条，合计约 500 条
writeGeneratedFile('modern', 'm_gen', 5, 'generated-modern-behaviors.ts');
writeGeneratedFile('apocalypse', 'a_gen', 2, 'generated-apocalypse-behaviors.ts');
