import { Behavior } from '../src/types';
import { modernBehaviors } from '../src/data/modern-behaviors';
import * as fs from 'fs';
import * as path from 'path';

interface Candidate {
  name: string;
  category: string;
  minAge?: number;
  maxAge?: number;
  riskLevel?: Behavior['riskLevel'];
  rewardLevel?: number;
  failureLevel?: number;
  balanceEffect?: number;
  unlockWealth?: number;
  tags?: string[];
  description?: string;
}

const categoryEnMap: Record<string, string> = {
  健康: 'health',
  知识: 'knowledge',
  技能: 'skill',
  运气: 'luck',
  魅力: 'charm',
  幸福: 'happiness',
  人脉: 'relationship',
  财富: 'wealth',
  意外: 'risk',
  未知: 'mystery',
};

const categoryDefaults: Record<
  string,
  { risk: Behavior['riskLevel']; reward: number; failure: number; balance: number }
> = {
  健康: { risk: 1, reward: 1, failure: 1, balance: 1 },
  知识: { risk: 1, reward: 2, failure: 1, balance: 1 },
  技能: { risk: 2, reward: 2, failure: 1, balance: 1 },
  运气: { risk: 3, reward: 4, failure: 2, balance: 0 },
  魅力: { risk: 1, reward: 2, failure: 1, balance: 1 },
  幸福: { risk: 1, reward: 2, failure: 1, balance: 2 },
  人脉: { risk: 2, reward: 2, failure: 1, balance: 1 },
  财富: { risk: 3, reward: 3, failure: 2, balance: 0 },
  意外: { risk: 8, reward: 2, failure: 5, balance: -1 },
  未知: { risk: 5, reward: 5, failure: 3, balance: 0 },
};

const candidates: Candidate[] = [
  // 健康 - 基础
  { name: '午睡', category: '健康' },
  { name: '早起', category: '健康' },
  { name: '熬夜', category: '健康', riskLevel: 3, balanceEffect: -1 },
  { name: '赖床', category: '健康', riskLevel: 1 },
  { name: '散步', category: '健康' },
  { name: '骑车', category: '健康' },
  { name: '游泳', category: '健康' },
  { name: '爬山', category: '健康', riskLevel: 2 },
  { name: '瑜伽', category: '健康' },
  { name: '拉伸', category: '健康' },
  { name: '冥想', category: '健康' },
  { name: '深呼吸', category: '健康' },
  { name: '看牙医', category: '健康', riskLevel: 2 },
  { name: '打疫苗', category: '健康', riskLevel: 1 },
  { name: '戒酒', category: '健康', riskLevel: 2 },
  { name: '增肌', category: '健康', riskLevel: 2 },
  // 健康 - 饮食
  { name: '做饭', category: '健康' },
  { name: '学习营养', category: '健康' },
  { name: '控制饮食', category: '健康' },
  { name: '低糖饮食', category: '健康' },
  { name: '高蛋白饮食', category: '健康' },
  { name: '喝奶茶', category: '健康', riskLevel: 1 },
  { name: '喝咖啡', category: '健康', riskLevel: 1 },
  { name: '吃零食', category: '健康', riskLevel: 1 },
  { name: '暴饮暴食', category: '健康', riskLevel: 2, balanceEffect: -1 },
  { name: '节食', category: '健康', riskLevel: 2 },
  { name: '吃保健品', category: '健康', riskLevel: 2 },
  { name: '喝酒聚餐', category: '健康', riskLevel: 2 },
  // 健康 - 医疗
  { name: '住院', category: '健康', riskLevel: 5 },
  { name: '手术', category: '健康', riskLevel: 7 },
  { name: '物理治疗', category: '健康', riskLevel: 3 },

  // 知识 - 学习
  { name: '背单词', category: '知识' },
  { name: '写笔记', category: '知识' },
  { name: '记忆训练', category: '知识' },
  { name: '刷题', category: '知识', riskLevel: 2 },
  { name: '预习', category: '知识', minAge: 6, maxAge: 25 },
  { name: '复习', category: '知识', minAge: 6, maxAge: 25 },
  { name: '考研', category: '知识', minAge: 20, maxAge: 35, riskLevel: 5, rewardLevel: 5 },
  { name: '考博', category: '知识', minAge: 22, maxAge: 40, riskLevel: 6, rewardLevel: 6 },
  // 知识 - 阅读
  { name: '小说', category: '知识' },
  { name: '历史', category: '知识' },
  { name: '哲学', category: '知识' },
  { name: '经济学', category: '知识' },
  { name: '心理学', category: '知识' },
  { name: '科幻', category: '知识' },
  { name: '传记', category: '知识' },
  { name: '管理学', category: '知识', minAge: 18 },
  { name: '法律', category: '知识', minAge: 18 },
  { name: '医学', category: '知识', minAge: 18 },
  // 知识 - 信息获取
  { name: '看纪录片', category: '知识' },
  { name: '听播客', category: '知识' },
  { name: '参加讲座', category: '知识', minAge: 12 },
  { name: '公开课', category: '知识', minAge: 12 },
  { name: '线上课程', category: '知识', minAge: 12 },
  { name: '读论文', category: '知识', minAge: 18 },
  { name: '研究报告', category: '知识', minAge: 18 },

  // 技能 - 通用
  { name: '写作', category: '技能' },
  { name: '演讲', category: '技能' },
  { name: '表达', category: '技能' },
  { name: '沟通', category: '技能' },
  { name: '谈判', category: '技能', minAge: 18 },
  { name: '销售', category: '技能', minAge: 18 },
  { name: '组织活动', category: '技能', minAge: 12 },
  { name: '项目管理', category: '技能', minAge: 18 },
  { name: '时间管理', category: '技能', minAge: 12 },
  // 技能 - 技术
  { name: '设计', category: '技能', minAge: 12 },
  { name: '建模', category: '技能', minAge: 14 },
  { name: '摄影', category: '技能', minAge: 10 },
  { name: '视频剪辑', category: '技能', minAge: 12 },
  { name: '动画制作', category: '技能', minAge: 14 },
  { name: 'AI应用', category: '技能', minAge: 14 },
  { name: '数据分析', category: '技能', minAge: 16 },
  { name: '产品设计', category: '技能', minAge: 16 },
  // 技能 - 艺术
  { name: '音乐', category: '技能' },
  { name: '钢琴', category: '技能' },
  { name: '吉他', category: '技能' },
  { name: '唱歌', category: '技能' },
  { name: '舞蹈', category: '技能' },
  { name: '书法', category: '技能' },
  { name: '雕塑', category: '技能' },

  // 运气 - 正面
  { name: '中奖', category: '运气', riskLevel: 2, rewardLevel: 5 },
  { name: '抽奖', category: '运气', riskLevel: 2, rewardLevel: 3 },
  { name: '贵人相助', category: '运气', riskLevel: 3, rewardLevel: 4 },
  { name: '意外收入', category: '运气', riskLevel: 2, rewardLevel: 5 },
  { name: '彩票中奖', category: '运气', riskLevel: 4, rewardLevel: 8 },
  { name: '捡到钱', category: '运气', riskLevel: 1, rewardLevel: 2 },
  { name: '获得推荐', category: '运气', riskLevel: 2, rewardLevel: 3 },
  { name: '遇见机会', category: '运气', riskLevel: 3, rewardLevel: 4 },
  { name: '投资暴涨', category: '运气', riskLevel: 5, rewardLevel: 8 },
  // 运气 - 负面
  { name: '错失机会', category: '运气', riskLevel: 4, failureLevel: 3 },
  { name: '被骗', category: '运气', riskLevel: 6, failureLevel: 5 },
  { name: '被盗', category: '运气', riskLevel: 5, failureLevel: 4 },
  { name: '项目取消', category: '运气', riskLevel: 5, failureLevel: 4 },
  { name: '航班延误', category: '运气', riskLevel: 2, failureLevel: 2 },
  { name: '设备损坏', category: '运气', riskLevel: 3, failureLevel: 3 },

  // 魅力 - 外貌
  { name: '护肤', category: '魅力' },
  { name: '理发', category: '魅力' },
  { name: '健身塑形', category: '魅力', riskLevel: 2 },
  { name: '学习穿搭', category: '魅力' },
  { name: '化妆', category: '魅力', minAge: 12 },
  { name: '美容', category: '魅力', minAge: 12 },
  { name: '拍写真', category: '魅力', minAge: 12 },
  // 魅力 - 气质
  { name: '阅读提升气质', category: '魅力' },
  { name: '学习礼仪', category: '魅力' },
  { name: '练习微笑', category: '魅力' },
  { name: '公开演讲', category: '魅力', minAge: 12 },
  { name: '社交训练', category: '魅力', minAge: 12 },

  // 幸福 - 娱乐
  { name: '玩游戏', category: '幸福' },
  { name: '看电影', category: '幸福' },
  { name: '追剧', category: '幸福' },
  { name: '听音乐', category: '幸福' },
  { name: '旅游', category: '幸福', riskLevel: 2 },
  { name: '露营', category: '幸福', riskLevel: 2 },
  { name: '逛街', category: '幸福' },
  { name: '泡温泉', category: '幸福', minAge: 12 },
  // 幸福 - 精神满足
  { name: '完成目标', category: '幸福', riskLevel: 2, rewardLevel: 3 },
  { name: '获得奖励', category: '幸福', riskLevel: 2, rewardLevel: 3 },
  { name: '帮助别人', category: '幸福' },
  { name: '养宠物', category: '幸福', riskLevel: 2 },
  { name: '家庭聚会', category: '幸福' },
  { name: '实现梦想', category: '幸福', riskLevel: 3, rewardLevel: 5 },

  // 人脉 - 朋友
  { name: '交朋友', category: '人脉' },
  { name: '参加社团', category: '人脉', minAge: 10, maxAge: 30 },
  { name: '聚会', category: '人脉', minAge: 12 },
  { name: '同学会', category: '人脉', minAge: 18 },
  { name: '行业交流', category: '人脉', minAge: 18 },
  { name: '兴趣小组', category: '人脉', minAge: 12 },
  // 人脉 - 职场
  { name: '认识领导', category: '人脉', minAge: 18 },
  { name: '结识客户', category: '人脉', minAge: 18 },
  { name: '参加峰会', category: '人脉', minAge: 18 },
  { name: '商务饭局', category: '人脉', minAge: 18 },
  { name: '建立团队', category: '人脉', minAge: 18 },
  { name: '寻找合伙人', category: '人脉', minAge: 18 },
  // 人脉 - 家庭
  { name: '陪伴父母', category: '人脉' },
  { name: '探望亲人', category: '人脉' },
  { name: '家族聚会', category: '人脉' },
  { name: '教育孩子', category: '人脉', minAge: 18 },

  // 财富 - 工作
  { name: '兼职', category: '财富', minAge: 16, maxAge: 65 },
  { name: '实习', category: '财富', minAge: 16, maxAge: 30 },
  { name: '上班', category: '财富', minAge: 18, maxAge: 65 },
  { name: '加班', category: '财富', minAge: 18, maxAge: 65, riskLevel: 2 },
  { name: '升职', category: '财富', minAge: 22, maxAge: 60, riskLevel: 4, rewardLevel: 5 },
  { name: '跳槽', category: '财富', minAge: 22, maxAge: 55, riskLevel: 4, rewardLevel: 4 },
  // 财富 - 投资
  { name: '存钱', category: '财富' },
  { name: '定投', category: '财富', riskLevel: 2 },
  { name: '买基金', category: '财富', riskLevel: 3 },
  { name: '买股票', category: '财富', riskLevel: 5 },
  { name: '买黄金', category: '财富', riskLevel: 3 },
  { name: '买房', category: '财富', riskLevel: 4, unlockWealth: 50 },
  { name: '买保险', category: '财富', riskLevel: 2 },
  { name: '资产配置', category: '财富', minAge: 25, riskLevel: 4 },
  // 财富 - 商业
  { name: '开网店', category: '财富', minAge: 18, riskLevel: 4 },
  { name: '直播带货', category: '财富', minAge: 16, riskLevel: 4 },
  { name: '做自媒体', category: '财富', minAge: 14, riskLevel: 3 },
  { name: '广告变现', category: '财富', minAge: 18, riskLevel: 3 },
  { name: '知识付费', category: '财富', minAge: 18, riskLevel: 3 },
  { name: '加盟创业', category: '财富', minAge: 22, riskLevel: 6 },

  // 意外 - 身体
  { name: '感冒', category: '意外', riskLevel: 2 },
  { name: '发烧', category: '意外', riskLevel: 2 },
  { name: '受伤', category: '意外', riskLevel: 4 },
  { name: '骨折', category: '意外', riskLevel: 6 },
  { name: '车祸', category: '意外', riskLevel: 9 },
  { name: '重大疾病', category: '意外', riskLevel: 10 },
  // 意外 - 社会
  { name: '失业', category: '意外', riskLevel: 6, failureLevel: 5 },
  { name: '裁员', category: '意外', riskLevel: 6, failureLevel: 5 },
  { name: '诈骗', category: '意外', riskLevel: 7, failureLevel: 5 },
  { name: '投资失败', category: '意外', riskLevel: 6, failureLevel: 5 },
  { name: '离婚', category: '意外', riskLevel: 7, failureLevel: 5, minAge: 22 },
  { name: '官司', category: '意外', riskLevel: 7, failureLevel: 5 },
  { name: '债务危机', category: '意外', riskLevel: 9, failureLevel: 8 },
  // 意外 - 灾难
  { name: '火灾', category: '意外', riskLevel: 9 },
  { name: '洪水', category: '意外', riskLevel: 9 },
  { name: '地震', category: '意外', riskLevel: 10 },
  { name: '疫情', category: '意外', riskLevel: 8 },
  { name: '战争', category: '意外', riskLevel: 10 },

  // 未知
  { name: '神秘来信', category: '未知', riskLevel: 5 },
  { name: '陌生电话', category: '未知', riskLevel: 5 },
  { name: '偶遇老人', category: '未知', riskLevel: 4 },
  { name: '神秘网站', category: '未知', riskLevel: 6 },
  { name: '隐藏任务', category: '未知', riskLevel: 5 },
  { name: '未知宝箱', category: '未知', riskLevel: 5 },
  { name: '神秘投资机会', category: '未知', riskLevel: 7 },
  { name: '穿越梦境', category: '未知', riskLevel: 4 },
  { name: '遗失的日记', category: '未知', riskLevel: 3 },
  { name: '地下组织邀请', category: '未知', riskLevel: 8 },

  // 恋爱系统
  { name: '暗恋', category: '幸福', minAge: 10, maxAge: 40 },
  { name: '约会', category: '幸福', minAge: 16, maxAge: 60 },
  { name: '同居', category: '幸福', minAge: 18, maxAge: 50, riskLevel: 3 },
  { name: '订婚', category: '幸福', minAge: 20, maxAge: 50, riskLevel: 3 },
  { name: '蜜月', category: '幸福', minAge: 20, maxAge: 50, riskLevel: 2 },
  { name: '复婚', category: '幸福', minAge: 25, maxAge: 70, riskLevel: 5 },

  // 创业系统
  { name: '摆摊', category: '财富', minAge: 16, maxAge: 70, riskLevel: 4 },
  { name: '接私活', category: '财富', minAge: 18, maxAge: 65, riskLevel: 3 },
  { name: '开工作室', category: '财富', minAge: 20, maxAge: 65, riskLevel: 5 },
  { name: '融资', category: '财富', minAge: 22, maxAge: 60, riskLevel: 6, unlockWealth: 30 },
  { name: '招聘员工', category: '财富', minAge: 22, maxAge: 65, riskLevel: 4 },
  { name: '开分公司', category: '财富', minAge: 25, maxAge: 65, riskLevel: 6, unlockWealth: 80 },
  { name: '出售公司', category: '财富', minAge: 30, maxAge: 75, riskLevel: 5, rewardLevel: 8 },

  // AI时代
  { name: '学习AI', category: '知识', minAge: 12 },
  { name: '制作小游戏', category: '技能', minAge: 12 },
  { name: '开发APP', category: '技能', minAge: 14 },
  { name: '经营网站', category: '财富', minAge: 14, riskLevel: 3 },
  { name: '自媒体创作', category: '财富', minAge: 14, riskLevel: 3 },
  { name: '短视频运营', category: '财富', minAge: 14, riskLevel: 3 },
  { name: '直播', category: '财富', minAge: 16, riskLevel: 3 },
  { name: '跨境电商', category: '财富', minAge: 18, riskLevel: 5 },
  { name: '独立开发', category: '财富', minAge: 16, riskLevel: 4 },
  { name: '数字游民', category: '财富', minAge: 18, riskLevel: 4 },
];

function buildBehavior(candidate: Candidate, index: number): Behavior {
  const defaults = categoryDefaults[candidate.category] ?? { risk: 1, reward: 1, failure: 1, balance: 0 };
  const idPrefix = categoryEnMap[candidate.category] ?? 'other';
  const risk = candidate.riskLevel ?? defaults.risk;
  const reward = candidate.rewardLevel ?? Math.max(1, Math.round(risk * 0.8 + 1));
  const failure = candidate.failureLevel ?? Math.max(1, Math.round(risk * 0.7 + 1));

  return {
    id: `m_${idPrefix}_${index}`,
    name: candidate.name,
    category: candidate.category,
    minAge: candidate.minAge ?? 1,
    maxAge: candidate.maxAge ?? 120,
    riskLevel: risk,
    rewardLevel: reward,
    failureLevel: failure,
    balanceEffect: candidate.balanceEffect ?? defaults.balance,
    unlockWealth: candidate.unlockWealth ?? 0,
    tags: candidate.tags ?? [candidate.category],
    description: candidate.description ?? `${candidate.name}，属于${candidate.category}类人生行为。`,
  };
}

const existingNames = new Set(modernBehaviors.map((b) => b.name));
let counter = modernBehaviors.length;
const newBehaviors: Behavior[] = [];

for (const candidate of candidates) {
  if (existingNames.has(candidate.name)) continue;
  newBehaviors.push(buildBehavior(candidate, counter++));
  existingNames.add(candidate.name);
}

console.log(`已有行为: ${modernBehaviors.length}`);
console.log(`新增行为: ${newBehaviors.length}`);
console.log(`总计: ${modernBehaviors.length + newBehaviors.length}`);

if (newBehaviors.length === 0) {
  console.log('没有新增行为，退出');
  process.exit(0);
}

const filePath = path.resolve(__dirname, '../src/data/modern-behaviors.ts');
let content = fs.readFileSync(filePath, 'utf-8');

const entriesText = newBehaviors
  .map((b) => {
    const fields = [
      `    id: '${b.id}',`,
      `    name: '${b.name}',`,
      `    category: '${b.category}',`,
      `    minAge: ${b.minAge},`,
      `    maxAge: ${b.maxAge},`,
      `    riskLevel: ${b.riskLevel},`,
      `    rewardLevel: ${b.rewardLevel},`,
      `    failureLevel: ${b.failureLevel},`,
      `    balanceEffect: ${b.balanceEffect},`,
      `    unlockWealth: ${b.unlockWealth},`,
      `    tags: [${b.tags.map((t) => `'${t}'`).join(', ')}],`,
      `    description: '${b.description}',`,
    ];
    return `  {\n${fields.join('\n')}\n  }`;
  })
  .join(',\n');

const insertMarker = content.lastIndexOf('];');
if (insertMarker === -1) {
  console.error('找不到 modernBehaviors 数组结尾');
  process.exit(1);
}

content = content.slice(0, insertMarker) + ',\n' + entriesText + '\n];\n';
fs.writeFileSync(filePath, content, 'utf-8');
console.log('已写入 modern-behaviors.ts');
