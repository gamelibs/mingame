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
  健康: 'health', 知识: 'knowledge', 技能: 'skill', 运气: 'luck',
  魅力: 'charm', 幸福: 'happiness', 人脉: 'relationship',
  财富: 'wealth', 意外: 'risk', 未知: 'mystery',
};

const categoryDefaults: Record<string, { risk: Behavior['riskLevel']; reward: number; failure: number; balance: number }> = {
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
  // 健康
  { name: '按摩', category: '健康' },
  { name: '针灸', category: '健康', riskLevel: 2 },
  { name: '拔罐', category: '健康', riskLevel: 2 },
  { name: '推拿', category: '健康' },
  { name: '足疗', category: '健康' },
  { name: '滑雪', category: '健康', riskLevel: 4 },
  { name: '潜水', category: '健康', riskLevel: 4 },
  { name: '跳伞', category: '健康', riskLevel: 9 },
  { name: '马术', category: '健康', riskLevel: 3 },
  { name: '高尔夫', category: '健康', riskLevel: 1 },
  { name: '台球', category: '健康' },
  { name: '羽毛球', category: '健康' },
  { name: '篮球', category: '健康', riskLevel: 3 },
  { name: '足球', category: '健康', riskLevel: 3 },
  { name: '网球', category: '健康', riskLevel: 2 },
  { name: '乒乓球', category: '健康' },
  { name: '马拉松', category: '健康', riskLevel: 4 },
  { name: '普拉提', category: '健康' },
  { name: '正念', category: '健康' },
  { name: '芳香疗法', category: '健康' },
  { name: '基因检测', category: '健康', riskLevel: 2 },
  { name: '视力检查', category: '健康' },
  { name: '洗牙', category: '健康' },
  { name: '拔智齿', category: '健康', riskLevel: 2 },
  { name: '医美', category: '健康', riskLevel: 3 },
  { name: '急救', category: '健康', riskLevel: 3 },
  { name: '器官移植', category: '健康', riskLevel: 9 },
  { name: '化疗', category: '健康', riskLevel: 9 },
  { name: '透析', category: '健康', riskLevel: 8 },

  // 知识
  { name: '英语', category: '知识' },
  { name: '日语', category: '知识' },
  { name: '法语', category: '知识' },
  { name: '算法', category: '知识', minAge: 14 },
  { name: '机器学习', category: '知识', minAge: 16 },
  { name: '深度学习', category: '知识', minAge: 18 },
  { name: '区块链', category: '知识', minAge: 16 },
  { name: '量子计算', category: '知识', minAge: 18 },
  { name: '生物学', category: '知识' },
  { name: '化学', category: '知识' },
  { name: '物理学', category: '知识' },
  { name: '地理', category: '知识' },
  { name: '政治', category: '知识', minAge: 14 },
  { name: '社会学', category: '知识', minAge: 14 },
  { name: '艺术史', category: '知识' },
  { name: '文学', category: '知识' },
  { name: '诗歌', category: '知识' },
  { name: '戏剧', category: '知识' },
  { name: '建筑', category: '知识' },
  { name: '批判性思维', category: '知识', minAge: 14 },
  { name: '财务知识', category: '知识', minAge: 16 },
  { name: '税务知识', category: '知识', minAge: 18 },
  { name: '会计', category: '知识', minAge: 18 },
  { name: '统计学', category: '知识', minAge: 14 },
  { name: '微积分', category: '知识', minAge: 14 },

  // 技能
  { name: '烹饪', category: '技能' },
  { name: '烘焙', category: '技能' },
  { name: '西餐', category: '技能' },
  { name: '中餐', category: '技能' },
  { name: '日本料理', category: '技能' },
  { name: '咖啡拉花', category: '技能' },
  { name: '调酒', category: '技能', minAge: 18 },
  { name: '茶艺', category: '技能' },
  { name: '花艺', category: '技能' },
  { name: '园艺', category: '技能' },
  { name: '木工', category: '技能' },
  { name: '电工', category: '技能', riskLevel: 3 },
  { name: '汽修', category: '技能', riskLevel: 2 },
  { name: '缝纫', category: '技能' },
  { name: '陶艺', category: '技能' },
  { name: '珠宝设计', category: '技能', minAge: 14 },
  { name: '服装设计', category: '技能', minAge: 14 },
  { name: '室内设计', category: '技能', minAge: 16 },
  { name: 'UI设计', category: '技能', minAge: 14 },
  { name: 'UX设计', category: '技能', minAge: 16 },
  { name: '工业设计', category: '技能', minAge: 16 },
  { name: '游戏设计', category: '技能', minAge: 14 },
  { name: 'VR开发', category: '技能', minAge: 16 },
  { name: '机器人', category: '技能', minAge: 14 },
  { name: '无人机', category: '技能', minAge: 14 },
  { name: '3D打印', category: '技能', minAge: 14 },
  { name: '修图', category: '技能' },
  { name: '混音', category: '技能' },
  { name: '编曲', category: '技能' },
  { name: '魔术', category: '技能' },
  { name: '围棋', category: '技能' },
  { name: '象棋', category: '技能' },
  { name: '桥牌', category: '技能' },
  { name: '电子竞技', category: '技能', riskLevel: 2 },
  { name: '拳击', category: '技能', riskLevel: 4 },
  { name: '跆拳道', category: '技能', riskLevel: 3 },
  { name: '柔道', category: '技能', riskLevel: 3 },
  { name: '攀岩', category: '技能', riskLevel: 4 },

  // 运气
  { name: '天气突变', category: '运气', riskLevel: 2 },
  { name: '交通堵塞', category: '运气', riskLevel: 1 },
  { name: '得到遗产', category: '运气', riskLevel: 2, rewardLevel: 8 },
  { name: '意外升职', category: '运气', riskLevel: 3, rewardLevel: 5 },
  { name: '一见钟情', category: '运气', riskLevel: 3 },
  { name: '偶遇老友', category: '运气', riskLevel: 1 },
  { name: '网络走红', category: '运气', riskLevel: 4, rewardLevel: 5 },
  { name: '爆款产品', category: '运气', riskLevel: 4, rewardLevel: 6 },
  { name: '幸运抽奖', category: '运气', riskLevel: 2, rewardLevel: 3 },

  // 魅力
  { name: '穿搭改造', category: '魅力' },
  { name: '形象顾问', category: '魅力' },
  { name: '声音训练', category: '魅力' },
  { name: '体态矫正', category: '魅力' },
  { name: '礼仪培训', category: '魅力' },
  { name: '演讲比赛', category: '魅力', riskLevel: 2 },
  { name: '主持', category: '魅力' },
  { name: '配音', category: '魅力' },
  { name: '个人品牌', category: '魅力', minAge: 16 },
  { name: '粉丝运营', category: '魅力', minAge: 16 },

  // 幸福
  { name: '美食', category: '幸福' },
  { name: '火锅', category: '幸福' },
  { name: '烧烤', category: '幸福' },
  { name: '日料', category: '幸福' },
  { name: '野餐', category: '幸福' },
  { name: '游乐园', category: '幸福' },
  { name: '演唱会', category: '幸福' },
  { name: '音乐节', category: '幸福' },
  { name: '博物馆', category: '幸福' },
  { name: '书店', category: '幸福' },
  { name: '猫咖', category: '幸福' },
  { name: '海岛游', category: '幸福', riskLevel: 2 },
  { name: '自驾游', category: '幸福', riskLevel: 2 },
  { name: '钓鱼', category: '幸福' },
  { name: '手办', category: '幸福' },
  { name: '乐高', category: '幸福' },
  { name: '桌游', category: '幸福' },
  { name: 'K歌', category: '幸福' },
  { name: 'SPA', category: '幸福' },

  // 人脉
  { name: '相亲', category: '人脉', minAge: 20, maxAge: 50 },
  { name: '网恋', category: '人脉', minAge: 14, maxAge: 50 },
  { name: '异地恋', category: '人脉', minAge: 16, maxAge: 45 },
  { name: '同学聚会', category: '人脉', minAge: 18 },
  { name: '同乡会', category: '人脉', minAge: 18 },
  { name: '读书会', category: '人脉', minAge: 12 },
  { name: '跑团', category: '人脉', minAge: 14 },
  { name: '健身伙伴', category: '人脉', minAge: 14 },
  { name: '游戏队友', category: '人脉', minAge: 10 },
  { name: '开源社区', category: '人脉', minAge: 14 },
  { name: '志愿者组织', category: '人脉', minAge: 12 },
  { name: '行业协会', category: '人脉', minAge: 18 },
  { name: '商会', category: '人脉', minAge: 22 },
  { name: '导师关系', category: '人脉', minAge: 14 },
  { name: '邻里关系', category: '人脉' },
  { name: '家长会', category: '人脉', minAge: 22, maxAge: 60 },
  { name: '亲子活动', category: '人脉', minAge: 18 },

  // 财富
  { name: '副业', category: '财富', minAge: 18, riskLevel: 3 },
  { name: '自由职业', category: '财富', minAge: 18, riskLevel: 3 },
  { name: '咨询', category: '财富', minAge: 22, riskLevel: 3 },
  { name: '培训', category: '财富', minAge: 20, riskLevel: 3 },
  { name: '写作变现', category: '财富', minAge: 16, riskLevel: 3 },
  { name: '翻译', category: '财富', minAge: 16, riskLevel: 2 },
  { name: '家教', category: '财富', minAge: 16, riskLevel: 1 },
  { name: '设计师接单', category: '财富', minAge: 18, riskLevel: 3 },
  { name: '程序员接单', category: '财富', minAge: 18, riskLevel: 3 },
  { name: '接广告', category: '财富', minAge: 18, riskLevel: 3 },
  { name: '会员订阅', category: '财富', minAge: 18, riskLevel: 3 },
  { name: '众筹', category: '财富', minAge: 18, riskLevel: 5 },
  { name: '租房', category: '财富', minAge: 18, riskLevel: 2 },
  { name: '收租', category: '财富', minAge: 22, riskLevel: 2, unlockWealth: 50 },
  { name: 'REITs', category: '财富', minAge: 22, riskLevel: 3 },
  { name: '期货', category: '财富', minAge: 22, riskLevel: 8 },
  { name: '外汇', category: '财富', minAge: 22, riskLevel: 7 },
  { name: '加密货币', category: '财富', minAge: 18, riskLevel: 8 },
  { name: '期权', category: '财富', minAge: 22, riskLevel: 8 },
  { name: '信托', category: '财富', minAge: 30, riskLevel: 3, unlockWealth: 100 },
  { name: '私募基金', category: '财富', minAge: 25, riskLevel: 6, unlockWealth: 80 },
  { name: 'IPO', category: '财富', minAge: 30, riskLevel: 7, unlockWealth: 150 },
  { name: '并购', category: '财富', minAge: 30, riskLevel: 7, unlockWealth: 200 },
  { name: '股权激励', category: '财富', minAge: 22, riskLevel: 4 },
  { name: '年终奖', category: '财富', minAge: 18, maxAge: 65, riskLevel: 2, rewardLevel: 4 },
  { name: '分红', category: '财富', minAge: 18, riskLevel: 3, rewardLevel: 5 },
  { name: '遗产继承', category: '财富', minAge: 25, riskLevel: 2, rewardLevel: 8 },
  { name: '奖学金', category: '财富', minAge: 6, maxAge: 30, riskLevel: 2, rewardLevel: 3 },
  { name: '科研经费', category: '财富', minAge: 22, maxAge: 65, riskLevel: 3 },
  { name: '政府补贴', category: '财富', minAge: 18, riskLevel: 2 },
  { name: '创业大赛', category: '财富', minAge: 18, maxAge: 40, riskLevel: 4 },

  // 意外
  { name: '食物中毒', category: '意外', riskLevel: 4 },
  { name: '过敏', category: '意外', riskLevel: 3 },
  { name: '中暑', category: '意外', riskLevel: 3 },
  { name: '溺水', category: '意外', riskLevel: 8 },
  { name: '触电', category: '意外', riskLevel: 7 },
  { name: '高空坠物', category: '意外', riskLevel: 7 },
  { name: '抢劫', category: '意外', riskLevel: 8 },
  { name: '斗殴', category: '意外', riskLevel: 8 },
  { name: '诽谤', category: '意外', riskLevel: 5 },
  { name: '背叛', category: '意外', riskLevel: 6 },
  { name: '失恋', category: '意外', riskLevel: 5 },
  { name: '违章罚款', category: '意外', riskLevel: 2 },
  { name: '税务稽查', category: '意外', riskLevel: 6 },
  { name: '房屋漏水', category: '意外', riskLevel: 3 },
  { name: '手机丢失', category: '意外', riskLevel: 3 },
  { name: '数据泄露', category: '意外', riskLevel: 6 },
  { name: '网络暴力', category: '意外', riskLevel: 6 },

  // 未知
  { name: 'AI失控', category: '未知', riskLevel: 8 },
  { name: '外星信号', category: '未知', riskLevel: 6 },
  { name: '时间循环', category: '未知', riskLevel: 5 },
  { name: '预知梦', category: '未知', riskLevel: 4 },
  { name: '前世记忆', category: '未知', riskLevel: 4 },
  { name: '平行世界', category: '未知', riskLevel: 6 },
  { name: '神秘失踪', category: '未知', riskLevel: 7 },
  { name: '午夜电梯', category: '未知', riskLevel: 5 },
  { name: '陌生包裹', category: '未知', riskLevel: 5 },
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
