import { Behavior } from '../types';
import { generatedModernBehaviors } from './generated-modern-behaviors';

// 现代社会人生行为库 v2
// 设计原则：
// 1. 按真实人生阶段划分可执行行为，避免 1 岁做饭、演讲、投资、买房等不合理选项。
// 2. 行为总数控制在 150 个左右，覆盖十大类别与七个年龄段。
// 3. 风险/机遇类行为也按年龄重新设计（幼儿是摔倒/感冒发烧，成年才是失业/投资失败/房产问题）。
// 4. category 与 tags 保持一致，不再出现 tag=健康但 category=成长/社交等错位。
// 5. 每个年龄段都有足够且合理的可选行为，保证游戏可玩性。

export const modernBehaviors: Behavior[] = [
  // ==================== 1-5岁：幼儿期 ====================
  // 成长类
  {
    id: 'm_sleep',
    name: '睡觉',
    category: '成长',
    minAge: 1,
    maxAge: 120,
    riskLevel: 1,
    rewardLevel: 1,
    failureLevel: 1,
    balanceEffect: 2,
    unlockWealth: 0,
    tags: ['健康', '基础', '恢复'],
    description: '充足的睡眠是成长的基石。',
    narrative: {
      title: '安睡',
      story: '夜色深沉，你选择早早睡下。身体在沉睡中自我修复，等待明天的到来。',
      successText: '你一觉到天亮，精神焕发，整个人都轻盈了许多。',
      failureText: '你辗转反侧，梦境纷扰，醒来依然疲惫不堪。',
      normalText: '睡眠普普通通，既没太好，也不算太差。'
    }
  },
  {
    id: 'm_eat',
    name: '吃饭',
    category: '成长',
    minAge: 1,
    maxAge: 120,
    riskLevel: 1,
    rewardLevel: 1,
    failureLevel: 1,
    balanceEffect: 1,
    unlockWealth: 0,
    tags: ['健康', '基础', '能量'],
    description: '一日三餐，维持生命能量。',
    narrative: {
      title: '一日三餐',
      story: '你决定好好吃一顿饭。食物是最原始的安慰，也是生命的燃料。',
      successText: '饭菜可口，营养均衡，你感到浑身充满了能量。',
      failureText: '食物不新鲜，你吃坏了肚子，整个人都没精打采。',
      normalText: '这顿饭平淡无奇，填饱了肚子而已。'
    }
  },
  {
    id: 'm_see_doctor',
    name: '看医生',
    category: '成长',
    minAge: 1,
    maxAge: 120,
    riskLevel: 2,
    rewardLevel: 2,
    failureLevel: 1,
    balanceEffect: 0,
    unlockWealth: 0,
    tags: ['健康', '治疗', '医疗'],
    description: '身体不适时及时就医。',
    narrative: {
      title: '就医',
      story: '你感到身体有些不适，决定去医院看看。',
      successText: '医生准确诊断，对症下药，你很快好转。',
      failureText: '误诊或延误治疗，病情反而加重了。',
      normalText: '检查了一堆项目，医生只说多休息。'
    }
  },
  {
    id: 'm_vaccine',
    name: '接种疫苗',
    category: '成长',
    minAge: 1,
    maxAge: 12,
    riskLevel: 1,
    rewardLevel: 2,
    failureLevel: 1,
    balanceEffect: 1,
    unlockWealth: 0,
    tags: ['健康', '预防', '免疫'],
    description: '按时接种疫苗，预防疾病。'
  },

  // 教育类
  {
    id: 'm_learn_speak',
    name: '学说话',
    category: '教育',
    minAge: 1,
    maxAge: 5,
    riskLevel: 1,
    rewardLevel: 2,
    failureLevel: 1,
    balanceEffect: 1,
    unlockWealth: 0,
    tags: ['知识', '启蒙', '沟通'],
    description: '牙牙学语，开启与世界沟通的大门。'
  },
  {
    id: 'm_recognize_chars',
    name: '识字',
    category: '教育',
    minAge: 3,
    maxAge: 7,
    riskLevel: 1,
    rewardLevel: 3,
    failureLevel: 1,
    balanceEffect: 1,
    unlockWealth: 0,
    tags: ['知识', '启蒙', '认知'],
    description: '认识文字，获得知识的第一把钥匙。'
  },
  {
    id: 'm_explore',
    name: '探索',
    category: '教育',
    minAge: 2,
    maxAge: 6,
    riskLevel: 2,
    rewardLevel: 2,
    failureLevel: 1,
    balanceEffect: 1,
    unlockWealth: 0,
    tags: ['知识', '好奇', '探索'],
    description: '对周围世界充满好奇地探索。'
  },
  {
    id: 'm_listen_story',
    name: '听故事',
    category: '教育',
    minAge: 2,
    maxAge: 8,
    riskLevel: 1,
    rewardLevel: 2,
    failureLevel: 1,
    balanceEffect: 1,
    unlockWealth: 0,
    tags: ['知识', '想象', '语言'],
    description: '听父母或老师讲故事，培养想象力。'
  },

  // 家庭类
  {
    id: 'm_family_time',
    name: '陪伴家人',
    category: '家庭',
    minAge: 1,
    maxAge: 120,
    riskLevel: 1,
    rewardLevel: 2,
    failureLevel: 1,
    balanceEffect: 2,
    unlockWealth: 0,
    tags: ['幸福', '家庭', '亲情'],
    description: '与家人共度温馨时光。',
    narrative: {
      title: '天伦之乐',
      story: '你把时间留给家人，一起吃饭、聊天或游戏。',
      successText: '家人之间的感情更加深厚，你感到被爱着。',
      failureText: '短暂的陪伴被琐事打断，气氛有些尴尬。',
      normalText: '这是一个普通却温暖的家庭日。'
    }
  },
  {
    id: 'm_parent_child_play',
    name: '亲子游戏',
    category: '家庭',
    minAge: 1,
    maxAge: 8,
    riskLevel: 1,
    rewardLevel: 2,
    failureLevel: 1,
    balanceEffect: 2,
    unlockWealth: 0,
    tags: ['幸福', '家庭', '互动'],
    description: '和父母一起玩游戏，增进亲子关系。'
  },

  // 兴趣类
  {
    id: 'm_play',
    name: '玩耍',
    category: '兴趣',
    minAge: 1,
    maxAge: 12,
    riskLevel: 2,
    rewardLevel: 2,
    failureLevel: 1,
    balanceEffect: 2,
    unlockWealth: 0,
    tags: ['魅力', '娱乐', '社交'],
    description: '在玩耍中学习社交与规则。'
  },
  {
    id: 'm_doodle',
    name: '涂鸦',
    category: '兴趣',
    minAge: 2,
    maxAge: 8,
    riskLevel: 1,
    rewardLevel: 2,
    failureLevel: 1,
    balanceEffect: 1,
    unlockWealth: 0,
    tags: ['技能', '艺术', '创作'],
    description: '拿起画笔随意涂鸦，释放创造力。'
  },
  {
    id: 'm_listen_music',
    name: '听音乐',
    category: '兴趣',
    minAge: 1,
    maxAge: 120,
    riskLevel: 1,
    rewardLevel: 1,
    failureLevel: 1,
    balanceEffect: 1,
    unlockWealth: 0,
    tags: ['幸福', '艺术', '音乐'],
    description: '聆听音乐，舒缓心情。'
  },

  // 风险类（幼儿专属）
  {
    id: 'm_fall_down',
    name: '摔倒',
    category: '风险',
    minAge: 1,
    maxAge: 5,
    riskLevel: 2,
    rewardLevel: 1,
    failureLevel: 2,
    balanceEffect: -1,
    unlockWealth: 0,
    tags: ['意外', '健康', '成长'],
    description: '学步时不小心摔倒，受了点小伤。'
  },
  {
    id: 'm_child_cold',
    name: '感冒发烧',
    category: '风险',
    minAge: 1,
    maxAge: 12,
    riskLevel: 2,
    rewardLevel: 1,
    failureLevel: 2,
    balanceEffect: -1,
    unlockWealth: 0,
    tags: ['意外', '健康', '疾病'],
    description: '一场小病让你虚弱了几天。'
  },

  // 机遇类（幼儿专属）
  {
    id: 'm_new_toy',
    name: '得到新玩具',
    category: '机遇',
    minAge: 1,
    maxAge: 8,
    riskLevel: 1,
    rewardLevel: 2,
    failureLevel: 1,
    balanceEffect: 1,
    unlockWealth: 0,
    tags: ['运气', '幸福', '成长'],
    description: '收到了期待已久的新玩具，开心不已。'
  },
  {
    id: 'm_learn_new_skill',
    name: '学会新本领',
    category: '机遇',
    minAge: 2,
    maxAge: 8,
    riskLevel: 1,
    rewardLevel: 3,
    failureLevel: 1,
    balanceEffect: 1,
    unlockWealth: 0,
    tags: ['运气', '知识', '成长'],
    description: '突然掌握了某项新技能，获得成就感。'
  },

  // ==================== 6-12岁：儿童期 ====================
  // 成长类
  {
    id: 'm_regular_schedule',
    name: '规律作息',
    category: '成长',
    minAge: 6,
    maxAge: 120,
    riskLevel: 1,
    rewardLevel: 2,
    failureLevel: 1,
    balanceEffect: 2,
    unlockWealth: 0,
    tags: ['健康', '自律', '基础'],
    description: '保持规律的作息时间。'
  },
  {
    id: 'm_health_checkup',
    name: '健康体检',
    category: '成长',
    minAge: 6,
    maxAge: 120,
    riskLevel: 1,
    rewardLevel: 2,
    failureLevel: 1,
    balanceEffect: 1,
    unlockWealth: 0,
    tags: ['健康', '预防', '医疗'],
    description: '定期体检，关注身体状况。'
  },

  // 教育类
  {
    id: 'm_school',
    name: '上学',
    category: '教育',
    minAge: 6,
    maxAge: 18,
    riskLevel: 2,
    rewardLevel: 3,
    failureLevel: 1,
    balanceEffect: 0,
    unlockWealth: 0,
    tags: ['知识', '基础', '校园'],
    description: '系统学习基础知识。',
    narrative: {
      title: '校园时光',
      story: '你背着书包走进校园，开始学习新的知识。',
      successText: '你成绩优异，得到了老师的赞许和同学的认可。',
      failureText: '学习遇到了瓶颈，你开始怀疑自己的能力。',
      normalText: '这一学期平平常常，没有大起大落。'
    }
  },
  {
    id: 'm_homework',
    name: '做作业',
    category: '教育',
    minAge: 6,
    maxAge: 18,
    riskLevel: 2,
    rewardLevel: 2,
    failureLevel: 1,
    balanceEffect: -1,
    unlockWealth: 0,
    tags: ['知识', '学习', '自律'],
    description: '巩固课堂所学。'
  },
  {
    id: 'm_read',
    name: '阅读',
    category: '教育',
    minAge: 6,
    maxAge: 120,
    riskLevel: 2,
    rewardLevel: 3,
    failureLevel: 1,
    balanceEffect: 1,
    unlockWealth: 0,
    tags: ['知识', '幸福', '阅读'],
    description: '阅读书籍，开阔眼界。'
  },
  {
    id: 'm_math',
    name: '数学',
    category: '教育',
    minAge: 7,
    maxAge: 22,
    riskLevel: 2,
    rewardLevel: 4,
    failureLevel: 1,
    balanceEffect: -1,
    unlockWealth: 0,
    tags: ['知识', '逻辑', '数学'],
    description: '锻炼逻辑思维能力。'
  },
  {
    id: 'm_science',
    name: '科学',
    category: '教育',
    minAge: 10,
    maxAge: 30,
    riskLevel: 2,
    rewardLevel: 5,
    failureLevel: 1,
    balanceEffect: 0,
    unlockWealth: 0,
    tags: ['知识', '探索', '理性'],
    description: '学习自然科学知识。'
  },
  {
    id: 'm_foreign_language',
    name: '外语',
    category: '教育',
    minAge: 10,
    maxAge: 35,
    riskLevel: 2,
    rewardLevel: 4,
    failureLevel: 1,
    balanceEffect: 0,
    unlockWealth: 0,
    tags: ['知识', '语言', '视野'],
    description: '掌握一门外语，打开新世界。'
  },

  // 社交类
  {
    id: 'm_make_friends',
    name: '交朋友',
    category: '社交',
    minAge: 5,
    maxAge: 80,
    riskLevel: 2,
    rewardLevel: 2,
    failureLevel: 1,
    balanceEffect: 2,
    unlockWealth: 0,
    tags: ['人脉', '社交', '友谊'],
    description: '结识志同道合的朋友。'
  },

  // 兴趣类
  {
    id: 'm_sports_training',
    name: '运动训练',
    category: '兴趣',
    minAge: 6,
    maxAge: 50,
    riskLevel: 2,
    rewardLevel: 3,
    failureLevel: 2,
    balanceEffect: 2,
    unlockWealth: 0,
    tags: ['健康', '体能', '训练'],
    description: '规律运动，增强体质。'
  },
  {
    id: 'm_painting',
    name: '绘画',
    category: '兴趣',
    minAge: 5,
    maxAge: 25,
    riskLevel: 3,
    rewardLevel: 2,
    failureLevel: 1,
    balanceEffect: 2,
    unlockWealth: 0,
    tags: ['技能', '艺术', '创作'],
    description: '用画笔表达内心世界。'
  },
  {
    id: 'm_music',
    name: '音乐',
    category: '兴趣',
    minAge: 5,
    maxAge: 30,
    riskLevel: 2,
    rewardLevel: 3,
    failureLevel: 1,
    balanceEffect: 2,
    unlockWealth: 0,
    tags: ['技能', '艺术', '音乐'],
    description: '学习乐器或声乐。'
  },
  {
    id: 'm_dance',
    name: '舞蹈',
    category: '兴趣',
    minAge: 5,
    maxAge: 30,
    riskLevel: 2,
    rewardLevel: 2,
    failureLevel: 1,
    balanceEffect: 2,
    unlockWealth: 0,
    tags: ['技能', '艺术', '体能'],
    description: '学习舞蹈，锻炼身体协调性。'
  },
  {
    id: 'm_swimming',
    name: '游泳',
    category: '兴趣',
    minAge: 6,
    maxAge: 70,
    riskLevel: 2,
    rewardLevel: 3,
    failureLevel: 2,
    balanceEffect: 2,
    unlockWealth: 0,
    tags: ['健康', '体能', '技能'],
    description: '学习游泳，掌握一项求生技能。'
  },

  // 家庭类
  {
    id: 'm_do_housework',
    name: '做家务',
    category: '家庭',
    minAge: 6,
    maxAge: 70,
    riskLevel: 1,
    rewardLevel: 2,
    failureLevel: 1,
    balanceEffect: 1,
    unlockWealth: 0,
    tags: ['幸福', '家庭', '责任'],
    description: '分担家务，培养责任感。'
  },

  // 风险类（儿童期）
  {
    id: 'm_sports_injury',
    name: '运动受伤',
    category: '风险',
    minAge: 6,
    maxAge: 18,
    riskLevel: 3,
    rewardLevel: 1,
    failureLevel: 3,
    balanceEffect: -2,
    unlockWealth: 0,
    tags: ['意外', '健康', '运动'],
    description: '运动时意外受伤，需要休养。'
  },
  {
    id: 'm_school_conflict',
    name: '校园冲突',
    category: '风险',
    minAge: 6,
    maxAge: 18,
    riskLevel: 3,
    rewardLevel: 1,
    failureLevel: 3,
    balanceEffect: -2,
    unlockWealth: 0,
    tags: ['意外', '社交', '校园'],
    description: '与同学发生矛盾，心情受到影响。'
  },

  // 机遇类（儿童期）
  {
    id: 'm_get_reward',
    name: '获得奖励',
    category: '机遇',
    minAge: 6,
    maxAge: 18,
    riskLevel: 1,
    rewardLevel: 3,
    failureLevel: 1,
    balanceEffect: 1,
    unlockWealth: 0,
    tags: ['运气', '幸福', '成长'],
    description: '因为表现优秀获得奖励。'
  },
  {
    id: 'm_summer_camp',
    name: '参加夏令营',
    category: '机遇',
    minAge: 8,
    maxAge: 16,
    riskLevel: 2,
    rewardLevel: 4,
    failureLevel: 1,
    balanceEffect: 2,
    unlockWealth: 0,
    tags: ['运气', '知识', '社交'],
    description: '参加夏令营，结识新朋友，开阔眼界。'
  },

  // ==================== 13-18岁：青少年期 ====================
  // 教育类
  {
    id: 'm_exam',
    name: '考试',
    category: '教育',
    minAge: 13,
    maxAge: 22,
    riskLevel: 3,
    rewardLevel: 4,
    failureLevel: 3,
    balanceEffect: -1,
    unlockWealth: 0,
    tags: ['知识', '压力', '竞争'],
    description: '检验学习成果的重要节点。',
    narrative: {
      title: '考场风云',
      story: '考试铃声响起，你握紧笔杆，准备迎接人生的又一次检验。',
      successText: '你超常发挥，取得了令人惊喜的好成绩。',
      failureText: '你发挥失常，分数远低于预期，心情跌到谷底。'
    }
  },
  {
    id: 'm_competition',
    name: '比赛',
    category: '教育',
    minAge: 12,
    maxAge: 25,
    riskLevel: 3,
    rewardLevel: 5,
    failureLevel: 2,
    balanceEffect: 0,
    unlockWealth: 0,
    tags: ['知识', '竞争', '荣誉'],
    description: '参加学科或体育竞赛。'
  },
  {
    id: 'm_club',
    name: '社团',
    category: '教育',
    minAge: 13,
    maxAge: 22,
    riskLevel: 3,
    rewardLevel: 3,
    failureLevel: 1,
    balanceEffect: 1,
    unlockWealth: 0,
    tags: ['知识', '社交', '组织'],
    description: '加入学校社团，培养兴趣与领导力。'
  },
  {
    id: 'm_self_study',
    name: '自学',
    category: '教育',
    minAge: 13,
    maxAge: 120,
    riskLevel: 3,
    rewardLevel: 4,
    failureLevel: 2,
    balanceEffect: 0,
    unlockWealth: 0,
    tags: ['知识', '自律', '技能'],
    description: '不依赖课堂，自主学习新技能。'
  },
  {
    id: 'm_programming',
    name: '编程',
    category: '教育',
    minAge: 14,
    maxAge: 45,
    riskLevel: 3,
    rewardLevel: 6,
    failureLevel: 2,
    balanceEffect: -1,
    unlockWealth: 0,
    tags: ['技能', '技术', '高薪'],
    description: '学习计算机编程，掌握未来语言。',
    narrative: {
      title: '代码人生',
      story: '你打开编辑器，开始与机器对话。每一行代码都可能改变未来。',
      successText: '你写出了一个优雅高效的程序，技术水平突飞猛进。',
      failureText: '项目出现严重bug，你不得不熬夜修复，身心俱疲。',
      normalText: '你完成了一些常规功能，能力在稳步积累。'
    }
  },

  // 事业类
  {
    id: 'm_part_time_job',
    name: '兼职',
    category: '事业',
    minAge: 16,
    maxAge: 30,
    riskLevel: 3,
    rewardLevel: 3,
    failureLevel: 2,
    balanceEffect: -1,
    unlockWealth: 0,
    tags: ['技能', '收入', '经验'],
    description: '利用课余时间赚取零花钱。'
  },

  // 社交类
  {
    id: 'm_party',
    name: '参加聚会',
    category: '社交',
    minAge: 13,
    maxAge: 50,
    riskLevel: 2,
    rewardLevel: 2,
    failureLevel: 1,
    balanceEffect: 1,
    unlockWealth: 0,
    tags: ['人脉', '社交', '娱乐'],
    description: '参加朋友聚会，拓展社交圈。'
  },

  // 感情类
  {
    id: 'm_first_love',
    name: '初恋',
    category: '感情',
    minAge: 13,
    maxAge: 20,
    riskLevel: 3,
    rewardLevel: 4,
    failureLevel: 3,
    balanceEffect: 2,
    unlockWealth: 0,
    tags: ['幸福', '情感', '成长'],
    description: '青春期的第一次心动。'
  },
  {
    id: 'm_secret_crush',
    name: '暗恋',
    category: '感情',
    minAge: 13,
    maxAge: 22,
    riskLevel: 2,
    rewardLevel: 2,
    failureLevel: 2,
    balanceEffect: 1,
    unlockWealth: 0,
    tags: ['幸福', '情感', '成长'],
    description: '悄悄喜欢上一个人，藏在心底。'
  },

  // 兴趣类
  {
    id: 'm_video_games',
    name: '玩游戏',
    category: '兴趣',
    minAge: 10,
    maxAge: 50,
    riskLevel: 2,
    rewardLevel: 2,
    failureLevel: 2,
    balanceEffect: 1,
    unlockWealth: 0,
    tags: ['幸福', '娱乐', '技能'],
    description: '适度玩游戏放松身心。'
  },
  {
    id: 'm_read_novel',
    name: '读小说',
    category: '兴趣',
    minAge: 10,
    maxAge: 120,
    riskLevel: 1,
    rewardLevel: 2,
    failureLevel: 1,
    balanceEffect: 1,
    unlockWealth: 0,
    tags: ['知识', '幸福', '阅读'],
    description: '阅读小说，体验不同人生。'
  },

  // 风险类（青少年期）
  {
    id: 'm_exam_failure',
    name: '考试失利',
    category: '风险',
    minAge: 13,
    maxAge: 22,
    riskLevel: 3,
    rewardLevel: 1,
    failureLevel: 3,
    balanceEffect: -2,
    unlockWealth: 0,
    tags: ['意外', '知识', '压力'],
    description: '一次重要考试没有考好。'
  },
  {
    id: 'm_internet_addiction',
    name: '网络沉迷',
    category: '风险',
    minAge: 13,
    maxAge: 25,
    riskLevel: 3,
    rewardLevel: 1,
    failureLevel: 3,
    balanceEffect: -3,
    unlockWealth: 0,
    tags: ['意外', '健康', '自控'],
    description: '沉迷网络，影响学习和生活。'
  },

  // 机遇类（青少年期）
  {
    id: 'm_win_prize',
    name: '获奖',
    category: '机遇',
    minAge: 13,
    maxAge: 25,
    riskLevel: 2,
    rewardLevel: 5,
    failureLevel: 1,
    balanceEffect: 1,
    unlockWealth: 0,
    tags: ['运气', '荣誉', '知识'],
    description: '在竞赛或评选中获奖。'
  },
  {
    id: 'm_meet_mentor',
    name: '遇见良师',
    category: '机遇',
    minAge: 13,
    maxAge: 30,
    riskLevel: 2,
    rewardLevel: 4,
    failureLevel: 1,
    balanceEffect: 1,
    unlockWealth: 0,
    tags: ['运气', '人脉', '成长'],
    description: '遇到一位愿意指导你的好老师或前辈。'
  },

  // ==================== 19-30岁：青年期 ====================
  // 成长类
  {
    id: 'm_fitness',
    name: '健身',
    category: '成长',
    minAge: 16,
    maxAge: 70,
    riskLevel: 2,
    rewardLevel: 3,
    failureLevel: 2,
    balanceEffect: 2,
    unlockWealth: 5,
    tags: ['健康', '自律', '体能'],
    description: '系统锻炼身体，保持健康。',
    narrative: {
      title: '挥洒汗水',
      story: '你换上运动服，走进健身房。身体的疲惫即将被多巴胺取代。',
      successText: '你突破了个人纪录，身材与精神状态都焕然一新。',
      failureText: '你不慎拉伤了肌肉，训练计划被迫中断。',
      normalText: '你完成了一次常规训练，感觉还算不错。'
    }
  },

  // 教育类
  {
    id: 'm_certification',
    name: '考证',
    category: '教育',
    minAge: 18,
    maxAge: 45,
    riskLevel: 3,
    rewardLevel: 4,
    failureLevel: 2,
    balanceEffect: -1,
    unlockWealth: 0,
    tags: ['知识', '技能', '职业'],
    description: '考取职业资格证书，提升竞争力。'
  },
  {
    id: 'm_further_study',
    name: '深造',
    category: '教育',
    minAge: 18,
    maxAge: 35,
    riskLevel: 3,
    rewardLevel: 6,
    failureLevel: 2,
    balanceEffect: -1,
    unlockWealth: 10,
    tags: ['知识', '学历', '成长'],
    description: '继续深造，攻读更高学位。'
  },

  // 事业类
  {
    id: 'm_job_hunt',
    name: '求职',
    category: '事业',
    minAge: 18,
    maxAge: 50,
    riskLevel: 3,
    rewardLevel: 4,
    failureLevel: 3,
    balanceEffect: -1,
    unlockWealth: 0,
    tags: ['技能', '竞争', '机遇'],
    description: '投递简历，参加面试。',
    narrative: {
      title: '求职之路',
      story: '你更新简历，投递了一家又一家公司，等待回音。',
      successText: '你收到了心仪的offer，薪资与平台都令人满意。',
      failureText: '面试屡屡碰壁，自信心受到了严重打击。',
      normalText: '你拿到了一份尚可的offer，先安顿下来再说。'
    }
  },
  {
    id: 'm_work',
    name: '打工',
    category: '事业',
    minAge: 18,
    maxAge: 60,
    riskLevel: 3,
    rewardLevel: 4,
    failureLevel: 2,
    balanceEffect: -1,
    unlockWealth: 0,
    tags: ['技能', '收入', '稳定'],
    description: '找一份稳定的工作。',
    narrative: {
      title: '日常工作',
      story: '你按部就班地完成手头的工作。',
      successText: '你出色地完成了任务，获得了领导的表扬。',
      failureText: '工作中出现了失误，被领导批评了一顿。',
      normalText: '一天的工作平平常常地结束了。'
    }
  },
  {
    id: 'm_overtime',
    name: '加班',
    category: '事业',
    minAge: 20,
    maxAge: 55,
    riskLevel: 3,
    rewardLevel: 4,
    failureLevel: 4,
    balanceEffect: -3,
    unlockWealth: 0,
    tags: ['技能', '收入', '压力'],
    description: '牺牲休息时间换取收入。',
    narrative: {
      title: '加班之夜',
      story: '办公室只剩下你一个人，键盘声在寂静中格外清晰。',
      successText: '加班换来了项目的突破性进展，你得到了认可。',
      failureText: '长期加班拖垮了身体，工作效率也大幅下降。',
      normalText: '你熬过了这个夜晚，但疲惫不堪。'
    }
  },
  {
    id: 'm_job_change',
    name: '换工作',
    category: '事业',
    minAge: 22,
    maxAge: 50,
    riskLevel: 4,
    rewardLevel: 5,
    failureLevel: 3,
    balanceEffect: -1,
    unlockWealth: 0,
    tags: ['技能', '机遇', '收入'],
    description: '跳槽到新的平台，寻求更好发展。'
  },
  {
    id: 'm_startup',
    name: '创业',
    category: '事业',
    minAge: 22,
    maxAge: 55,
    riskLevel: 6,
    rewardLevel: 9,
    failureLevel: 8,
    balanceEffect: -3,
    unlockWealth: 30,
    tags: ['财富', '事业', '高风险'],
    description: '创办自己的公司，高风险高回报。',
    narrative: {
      title: '创业赌局',
      story: '你决定辞去稳定工作，全身心投入创业。前路未知，这可能改变你的一生。',
      successText: '你的产品恰好赶上风口，获得第一桶金，事业蒸蒸日上。',
      failureText: '市场环境恶化，合作伙伴卷款跑路，你被骗走全部积蓄。'
    }
  },

  // 投资类
  {
    id: 'm_saving',
    name: '储蓄',
    category: '投资',
    minAge: 18,
    maxAge: 100,
    riskLevel: 2,
    rewardLevel: 2,
    failureLevel: 1,
    balanceEffect: 0,
    unlockWealth: 0,
    tags: ['财富', '稳健', '积累'],
    description: '把收入存起来以备不时之需。',
    narrative: {
      title: '积少成多',
      story: '你把一部分收入存起来，为未来的不确定性做准备。',
      successText: '你的储蓄计划执行得很好，账户里的数字稳步增长。',
      failureText: '通货膨胀蚕食了你的存款，购买力大不如前。',
      normalText: '储蓄略有增加，但距离目标还有很长的路要走。'
    }
  },
  {
    id: 'm_fund',
    name: '买基金',
    category: '投资',
    minAge: 18,
    maxAge: 80,
    riskLevel: 3,
    rewardLevel: 4,
    failureLevel: 3,
    balanceEffect: -1,
    unlockWealth: 5,
    tags: ['财富', '投资', '基金'],
    description: '购买基金，分散投资风险。'
  },
  {
    id: 'm_stocks',
    name: '买股票',
    category: '投资',
    minAge: 18,
    maxAge: 80,
    riskLevel: 5,
    rewardLevel: 7,
    failureLevel: 6,
    balanceEffect: -2,
    unlockWealth: 10,
    tags: ['财富', '投资', '股票'],
    description: '投资股票市场，追求资本增值。',
    narrative: {
      title: '股市沉浮',
      story: '你把资金投入了变幻莫测的股市，心跳随着K线起伏。',
      successText: '你精准抄底，账户盈利丰厚，财务自由似乎触手可及。',
      failureText: '市场突然暴跌，你的资产腰斩，账户一片惨绿。'
    }
  },
  {
    id: 'm_real_estate',
    name: '投资房产',
    category: '投资',
    minAge: 25,
    maxAge: 70,
    riskLevel: 4,
    rewardLevel: 7,
    failureLevel: 5,
    balanceEffect: -1,
    unlockWealth: 50,
    tags: ['财富', '投资', '房产'],
    description: '购买房产用于居住或投资。',
    narrative: {
      title: '房产投资',
      story: '你看中了一处房产，决定把积蓄换成砖瓦。',
      successText: '房价大涨，你的资产翻了几番，成为身边人羡慕的对象。',
      failureText: '政策调整，房价下跌，你的首付几乎打了水漂。'
    }
  },

  // 感情类
  {
    id: 'm_relationship',
    name: '恋爱',
    category: '感情',
    minAge: 18,
    maxAge: 50,
    riskLevel: 3,
    rewardLevel: 5,
    failureLevel: 3,
    balanceEffect: 2,
    unlockWealth: 0,
    tags: ['幸福', '情感', '社交'],
    description: '投入一段感情。',
    narrative: {
      title: '恋爱季节',
      story: '你决定投入一段感情，心里既期待又忐忑。',
      successText: '你们彼此欣赏，感情迅速升温，生活仿佛涂上了亮色。',
      failureText: '性格差异让你们争吵不断，最终不欢而散。',
      normalText: '感情进展不温不火，你们还在互相了解。'
    }
  },
  {
    id: 'm_marriage',
    name: '结婚',
    category: '感情',
    minAge: 22,
    maxAge: 50,
    riskLevel: 4,
    rewardLevel: 6,
    failureLevel: 4,
    balanceEffect: 1,
    unlockWealth: 10,
    tags: ['幸福', '家庭', '责任'],
    description: '与爱人步入婚姻殿堂。',
    narrative: {
      title: '婚姻殿堂',
      story: '你牵着爱人的手，走进了婚姻的殿堂。新的责任与承诺开始了。',
      successText: '婚后生活幸福美满，你们成为了彼此最坚实的依靠。',
      failureText: '婚后的琐碎与矛盾消磨了感情，家庭气氛日渐紧张。',
      normalText: '日子平淡而真实，婚姻需要慢慢经营。'
    }
  },

  // 家庭类
  {
    id: 'm_parenting',
    name: '育儿',
    category: '家庭',
    minAge: 22,
    maxAge: 55,
    riskLevel: 4,
    rewardLevel: 5,
    failureLevel: 3,
    balanceEffect: 0,
    unlockWealth: 10,
    tags: ['幸福', '家庭', '责任'],
    description: '抚养教育下一代。',
    narrative: {
      title: '为人父母',
      story: '你把精力投入到孩子身上，教导他们认识这个世界。',
      successText: '孩子健康成长，亲子关系融洽，你感到无比欣慰。',
      failureText: '教育方式出了问题，孩子叛逆，家庭矛盾加剧。',
      normalText: '育儿之路磕磕绊绊，你在不断学习。'
    }
  },

  // 社交类
  {
    id: 'm_networking',
    name: '建立人脉',
    category: '社交',
    minAge: 20,
    maxAge: 70,
    riskLevel: 3,
    rewardLevel: 4,
    failureLevel: 1,
    balanceEffect: 1,
    unlockWealth: 10,
    tags: ['人脉', '社交', '资源'],
    description: '扩展职业与社交圈层。',
    narrative: {
      title: '人脉拓展',
      story: '你参加了一场社交活动，希望能认识更多有价值的人。',
      successText: '你结识了一位关键人物，对方愿意在未来给予帮助。',
      failureText: '社交场合让你疲惫不堪，也没有收获有价值的人脉。',
      normalText: '你交换了几张名片，建立了初步联系。'
    }
  },
  {
    id: 'm_industry_exchange',
    name: '行业交流',
    category: '社交',
    minAge: 20,
    maxAge: 70,
    riskLevel: 2,
    rewardLevel: 3,
    failureLevel: 1,
    balanceEffect: 1,
    unlockWealth: 5,
    tags: ['人脉', '社交', '知识'],
    description: '参加行业活动，了解前沿动态。'
  },

  // 兴趣类
  {
    id: 'm_travel',
    name: '旅行',
    category: '兴趣',
    minAge: 18,
    maxAge: 75,
    riskLevel: 3,
    rewardLevel: 4,
    failureLevel: 2,
    balanceEffect: 3,
    unlockWealth: 5,
    tags: ['魅力', '旅行', '视野'],
    description: '去远方看看世界。'
  },
  {
    id: 'm_photography',
    name: '摄影',
    category: '兴趣',
    minAge: 16,
    maxAge: 80,
    riskLevel: 2,
    rewardLevel: 3,
    failureLevel: 1,
    balanceEffect: 1,
    unlockWealth: 5,
    tags: ['技能', '艺术', '创作'],
    description: '用镜头记录生活中的美好瞬间。'
  },
  {
    id: 'm_cooking',
    name: '烹饪',
    category: '兴趣',
    minAge: 12,
    maxAge: 80,
    riskLevel: 2,
    rewardLevel: 3,
    failureLevel: 1,
    balanceEffect: 1,
    unlockWealth: 0,
    tags: ['技能', '生活', '幸福'],
    description: '学习烹饪，享受美食带来的乐趣。'
  },
  {
    id: 'm_public_speech',
    name: '公开演讲',
    category: '社交',
    minAge: 16,
    maxAge: 80,
    riskLevel: 3,
    rewardLevel: 4,
    failureLevel: 2,
    balanceEffect: 1,
    unlockWealth: 0,
    tags: ['技能', '魅力', '沟通'],
    description: '在公众面前发表演讲，锻炼表达能力。',
    narrative: {
      title: '登台演讲',
      story: '你站在台上，面对众多目光，准备发表演讲。',
      successText: '你的演讲打动全场，掌声雷动。',
      failureText: '你紧张得忘词，场面一度十分尴尬。',
      normalText: '演讲顺利完成，中规中矩。'
    }
  },

  // 风险类（青年期）
  {
    id: 'm_unemployed',
    name: '失业',
    category: '风险',
    minAge: 18,
    maxAge: 60,
    riskLevel: 5,
    rewardLevel: 1,
    failureLevel: 5,
    balanceEffect: -3,
    unlockWealth: 0,
    tags: ['意外', '事业', '财富'],
    description: '突然失去工作，收入来源中断。'
  },
  {
    id: 'm_investment_loss',
    name: '投资失败',
    category: '风险',
    minAge: 18,
    maxAge: 80,
    riskLevel: 5,
    rewardLevel: 1,
    failureLevel: 5,
    balanceEffect: -2,
    unlockWealth: 0,
    tags: ['意外', '财富', '投资'],
    description: '一次投资判断失误，资金缩水。'
  },
  {
    id: 'm_breakup',
    name: '失恋',
    category: '风险',
    minAge: 18,
    maxAge: 50,
    riskLevel: 4,
    rewardLevel: 1,
    failureLevel: 4,
    balanceEffect: -2,
    unlockWealth: 0,
    tags: ['意外', '情感', '幸福'],
    description: '一段感情走到尽头，心情低落。'
  },
  {
    id: 'm_accident',
    name: '意外事故',
    category: '风险',
    minAge: 18,
    maxAge: 60,
    riskLevel: 5,
    rewardLevel: 1,
    failureLevel: 5,
    balanceEffect: -3,
    unlockWealth: 0,
    tags: ['意外', '健康', '财富'],
    description: '一次意外让你受了伤，需要休养。'
  },

  // 机遇类（青年期）
  {
    id: 'm_promotion',
    name: '升职加薪',
    category: '机遇',
    minAge: 22,
    maxAge: 55,
    riskLevel: 3,
    rewardLevel: 6,
    failureLevel: 2,
    balanceEffect: 1,
    unlockWealth: 0,
    tags: ['运气', '事业', '财富'],
    description: '工作表现出色，获得升职加薪。'
  },
  {
    id: 'm_lucky_income',
    name: '意外收入',
    category: '机遇',
    minAge: 18,
    maxAge: 80,
    riskLevel: 2,
    rewardLevel: 4,
    failureLevel: 1,
    balanceEffect: 1,
    unlockWealth: 0,
    tags: ['运气', '财富', '幸福'],
    description: '一笔意外之财改善了生活。'
  },
  {
    id: 'm_meet_opportunity',
    name: '遇见机会',
    category: '机遇',
    minAge: 18,
    maxAge: 60,
    riskLevel: 3,
    rewardLevel: 5,
    failureLevel: 2,
    balanceEffect: 1,
    unlockWealth: 0,
    tags: ['运气', '机遇', '成长'],
    description: '生活中出现了一个难得的机会。'
  },

  // ==================== 31-50岁：中年期 ====================
  // 事业类
  {
    id: 'm_manage_team',
    name: '管理团队',
    category: '事业',
    minAge: 28,
    maxAge: 65,
    riskLevel: 4,
    rewardLevel: 6,
    failureLevel: 3,
    balanceEffect: -1,
    unlockWealth: 25,
    tags: ['技能', '领导', '管理'],
    description: '带领团队完成目标。',
    narrative: {
      title: '团队管理',
      story: '你作为管理者，需要带领团队完成一个关键项目。',
      successText: '团队配合默契，项目提前完成，你赢得了上级的信任。',
      failureText: '团队内部冲突不断，项目延期，你备受质疑。',
      normalText: '项目勉强完成，团队还需要进一步磨合。'
    }
  },
  {
    id: 'm_client_dev',
    name: '客户开发',
    category: '事业',
    minAge: 22,
    maxAge: 60,
    riskLevel: 4,
    rewardLevel: 6,
    failureLevel: 3,
    balanceEffect: -1,
    unlockWealth: 15,
    tags: ['技能', '销售', '社交'],
    description: '拓展客户资源。',
    narrative: {
      title: '客户开发',
      story: '你主动出击，试图拓展新的客户资源。',
      successText: '你成功签下大单，业绩一路飘红。',
      failureText: '客户流失严重，你的努力付诸东流。',
      normalText: '你接触到几个潜在客户，还需要长期跟进。'
    }
  },
  {
    id: 'm_business_negotiation',
    name: '商务谈判',
    category: '事业',
    minAge: 25,
    maxAge: 65,
    riskLevel: 4,
    rewardLevel: 6,
    failureLevel: 3,
    balanceEffect: -1,
    unlockWealth: 20,
    tags: ['技能', '沟通', '事业'],
    description: '参与重要商务谈判，争取有利条件。'
  },
  {
    id: 'm_career_change',
    name: '转行',
    category: '事业',
    minAge: 25,
    maxAge: 50,
    riskLevel: 5,
    rewardLevel: 6,
    failureLevel: 4,
    balanceEffect: -2,
    unlockWealth: 0,
    tags: ['技能', '机遇', '风险'],
    description: '离开熟悉的行业，尝试新的职业方向。'
  },

  // 投资类
  {
    id: 'm_buy_gold',
    name: '买黄金',
    category: '投资',
    minAge: 25,
    maxAge: 80,
    riskLevel: 3,
    rewardLevel: 4,
    failureLevel: 2,
    balanceEffect: 0,
    unlockWealth: 10,
    tags: ['财富', '投资', '保值'],
    description: '购买黄金作为保值手段。'
  },
  {
    id: 'm_fixed_deposit',
    name: '定存',
    category: '投资',
    minAge: 22,
    maxAge: 100,
    riskLevel: 1,
    rewardLevel: 2,
    failureLevel: 1,
    balanceEffect: 0,
    unlockWealth: 0,
    tags: ['财富', '稳健', '储蓄'],
    description: '把资金存入定期，获得稳定利息。'
  },
  {
    id: 'm_insurance',
    name: '买保险',
    category: '投资',
    minAge: 25,
    maxAge: 70,
    riskLevel: 2,
    rewardLevel: 3,
    failureLevel: 1,
    balanceEffect: 0,
    unlockWealth: 5,
    tags: ['财富', '保障', '稳健'],
    description: '购买保险，为未来提供保障。'
  },

  // 家庭类
  {
    id: 'm_family_invest',
    name: '家庭投资',
    category: '家庭',
    minAge: 25,
    maxAge: 60,
    riskLevel: 4,
    rewardLevel: 5,
    failureLevel: 4,
    balanceEffect: 0,
    unlockWealth: 20,
    tags: ['幸福', '家庭', '财富'],
    description: '为家庭未来进行投资。'
  },
  {
    id: 'm_care_parents',
    name: '照顾父母',
    category: '家庭',
    minAge: 30,
    maxAge: 70,
    riskLevel: 3,
    rewardLevel: 4,
    failureLevel: 2,
    balanceEffect: 1,
    unlockWealth: 0,
    tags: ['幸福', '家庭', '责任'],
    description: '照顾年迈的父母，尽子女责任。'
  },
  {
    id: 'm_family_education',
    name: '家庭教育',
    category: '家庭',
    minAge: 25,
    maxAge: 60,
    riskLevel: 2,
    rewardLevel: 4,
    failureLevel: 2,
    balanceEffect: 1,
    unlockWealth: 0,
    tags: ['知识', '家庭', '责任'],
    description: '花时间教育引导孩子成长。'
  },

  // 感情类
  {
    id: 'm_marriage_care',
    name: '婚姻经营',
    category: '感情',
    minAge: 25,
    maxAge: 70,
    riskLevel: 3,
    rewardLevel: 4,
    failureLevel: 2,
    balanceEffect: 2,
    unlockWealth: 0,
    tags: ['幸福', '情感', '责任'],
    description: '用心经营婚姻，维护家庭和谐。'
  },

  // 社交类
  {
    id: 'm_volunteer',
    name: '志愿活动',
    category: '社交',
    minAge: 18,
    maxAge: 75,
    riskLevel: 2,
    rewardLevel: 3,
    failureLevel: 1,
    balanceEffect: 2,
    unlockWealth: 0,
    tags: ['人脉', '公益', '幸福'],
    description: '参与志愿服务，回馈社会。'
  },

  // 兴趣类
  {
    id: 'm_gourmet',
    name: '美食探索',
    category: '兴趣',
    minAge: 20,
    maxAge: 80,
    riskLevel: 2,
    rewardLevel: 2,
    failureLevel: 1,
    balanceEffect: 1,
    unlockWealth: 5,
    tags: ['幸福', '美食', '生活'],
    description: '探索各种美食，享受生活乐趣。'
  },

  // 风险类（中年期）
  {
    id: 'm_career_crisis',
    name: '事业危机',
    category: '风险',
    minAge: 30,
    maxAge: 55,
    riskLevel: 6,
    rewardLevel: 1,
    failureLevel: 6,
    balanceEffect: -4,
    unlockWealth: 0,
    tags: ['意外', '事业', '压力'],
    description: '遭遇职场瓶颈或行业变动。'
  },
  {
    id: 'm_health_crisis',
    name: '健康危机',
    category: '风险',
    minAge: 30,
    maxAge: 70,
    riskLevel: 6,
    rewardLevel: 1,
    failureLevel: 6,
    balanceEffect: -4,
    unlockWealth: 0,
    tags: ['意外', '健康', '疾病'],
    description: '长期压力导致健康亮红灯。'
  },
  {
    id: 'm_family_conflict',
    name: '家庭矛盾',
    category: '风险',
    minAge: 25,
    maxAge: 70,
    riskLevel: 4,
    rewardLevel: 1,
    failureLevel: 4,
    balanceEffect: -3,
    unlockWealth: 0,
    tags: ['意外', '家庭', '情感'],
    description: '与家人发生争执，家庭气氛紧张。'
  },

  // 机遇类（中年期）
  {
    id: 'm_industry_wind',
    name: '事业风口',
    category: '机遇',
    minAge: 25,
    maxAge: 55,
    riskLevel: 4,
    rewardLevel: 8,
    failureLevel: 3,
    balanceEffect: 1,
    unlockWealth: 0,
    tags: ['运气', '事业', '财富'],
    description: '赶上行业风口，事业迎来爆发。'
  },
  {
    id: 'm_key_connection',
    name: '贵人相助',
    category: '机遇',
    minAge: 25,
    maxAge: 70,
    riskLevel: 3,
    rewardLevel: 5,
    failureLevel: 1,
    balanceEffect: 1,
    unlockWealth: 0,
    tags: ['运气', '人脉', '事业'],
    description: '关键时刻得到贵人提携。'
  },

  // ==================== 51-70岁：中老年期 ====================
  // 成长类
  {
    id: 'm_wellness',
    name: '养生',
    category: '成长',
    minAge: 40,
    maxAge: 120,
    riskLevel: 1,
    rewardLevel: 3,
    failureLevel: 1,
    balanceEffect: 3,
    unlockWealth: 10,
    tags: ['健康', '养生', '长寿'],
    description: '调理身体，延缓衰老。',
    narrative: {
      title: '养生之道',
      story: '你开始关注身体调养，饮食作息都变得更加规律。',
      successText: '气色明显变好，连朋友都说你看起来年轻了几岁。',
      failureText: '养生方法不当，反而让身体出现了不适。',
      normalText: '你坚持了一些养生习惯，效果尚需时间验证。'
    }
  },
  {
    id: 'm_rehabilitation',
    name: '康复训练',
    category: '成长',
    minAge: 50,
    maxAge: 120,
    riskLevel: 2,
    rewardLevel: 3,
    failureLevel: 2,
    balanceEffect: 2,
    unlockWealth: 0,
    tags: ['健康', '恢复', '自律'],
    description: '进行康复训练，恢复身体机能。'
  },

  // 教育类
  {
    id: 'm_mentor',
    name: '指导后辈',
    category: '教育',
    minAge: 40,
    maxAge: 90,
    riskLevel: 2,
    rewardLevel: 4,
    failureLevel: 1,
    balanceEffect: 2,
    unlockWealth: 20,
    tags: ['知识', '传承', '影响力'],
    description: '分享经验，帮助他人成长。'
  },
  {
    id: 'm_lifelong_learning',
    name: '终身学习',
    category: '教育',
    minAge: 50,
    maxAge: 120,
    riskLevel: 2,
    rewardLevel: 3,
    failureLevel: 1,
    balanceEffect: 1,
    unlockWealth: 0,
    tags: ['知识', '自律', '成长'],
    description: '保持学习热情，跟上时代变化。'
  },

  // 事业类
  {
    id: 'm_consultant',
    name: '担任顾问',
    category: '事业',
    minAge: 45,
    maxAge: 75,
    riskLevel: 3,
    rewardLevel: 5,
    failureLevel: 2,
    balanceEffect: 0,
    unlockWealth: 30,
    tags: ['技能', '经验', '收入'],
    description: '凭借经验担任顾问，继续发挥价值。'
  },
  {
    id: 'm_retire_prep',
    name: '退休准备',
    category: '事业',
    minAge: 50,
    maxAge: 70,
    riskLevel: 2,
    rewardLevel: 4,
    failureLevel: 1,
    balanceEffect: 1,
    unlockWealth: 30,
    tags: ['财富', '规划', '稳健'],
    description: '为退休生活做准备。'
  },

  // 投资类
  {
    id: 'm_asset_allocation',
    name: '资产配置',
    category: '投资',
    minAge: 35,
    maxAge: 90,
    riskLevel: 3,
    rewardLevel: 5,
    failureLevel: 2,
    balanceEffect: 0,
    unlockWealth: 40,
    tags: ['财富', '规划', '稳健'],
    description: '科学配置资产，分散风险。',
    narrative: {
      title: '资产配置',
      story: '你重新审视自己的资产，希望分散风险、稳健增值。',
      successText: '配置科学合理，各类资产相互补充，收益稳健。',
      failureText: '某类资产暴跌，拖累了整体收益。',
      normalText: '资产结构有所调整，效果还有待观察。'
    }
  },
  {
    id: 'm_retirement_savings',
    name: '退休储蓄',
    category: '投资',
    minAge: 45,
    maxAge: 70,
    riskLevel: 2,
    rewardLevel: 3,
    failureLevel: 1,
    balanceEffect: 0,
    unlockWealth: 20,
    tags: ['财富', '稳健', '养老'],
    description: '为退休后的生活储备资金。'
  },

  // 家庭类
  {
    id: 'm_family_reunion',
    name: '家庭聚会',
    category: '家庭',
    minAge: 30,
    maxAge: 120,
    riskLevel: 1,
    rewardLevel: 3,
    failureLevel: 1,
    balanceEffect: 2,
    unlockWealth: 0,
    tags: ['幸福', '家庭', '亲情'],
    description: '全家人聚在一起，共享天伦之乐。'
  },

  // 社交类
  {
    id: 'm_community_activity',
    name: '社区活动',
    category: '社交',
    minAge: 40,
    maxAge: 120,
    riskLevel: 1,
    rewardLevel: 2,
    failureLevel: 1,
    balanceEffect: 1,
    unlockWealth: 0,
    tags: ['人脉', '社区', '幸福'],
    description: '参加社区活动，丰富退休生活。'
  },

  // 兴趣类
  {
    id: 'm_gardening',
    name: '园艺',
    category: '兴趣',
    minAge: 30,
    maxAge: 120,
    riskLevel: 1,
    rewardLevel: 2,
    failureLevel: 1,
    balanceEffect: 2,
    unlockWealth: 0,
    tags: ['幸福', '自然', '生活'],
    description: '种植花草，享受园艺乐趣。'
  },
  {
    id: 'm_fishing',
    name: '钓鱼',
    category: '兴趣',
    minAge: 30,
    maxAge: 120,
    riskLevel: 1,
    rewardLevel: 2,
    failureLevel: 1,
    balanceEffect: 2,
    unlockWealth: 0,
    tags: ['幸福', '耐心', '自然'],
    description: '静心钓鱼，享受独处时光。'
  },
  {
    id: 'm_tour',
    name: '旅游',
    category: '兴趣',
    minAge: 30,
    maxAge: 80,
    riskLevel: 3,
    rewardLevel: 4,
    failureLevel: 2,
    balanceEffect: 2,
    unlockWealth: 15,
    tags: ['魅力', '旅行', '幸福'],
    description: '享受旅行生活，看看大千世界。'
  },

  // 风险类（中老年期）
  {
    id: 'm_chronic_disease',
    name: '慢性病',
    category: '风险',
    minAge: 50,
    maxAge: 120,
    riskLevel: 5,
    rewardLevel: 1,
    failureLevel: 5,
    balanceEffect: -3,
    unlockWealth: 0,
    tags: ['意外', '健康', '疾病'],
    description: '患上慢性病，需要长期管理。'
  },
  {
    id: 'm_investment_decline',
    name: '投资缩水',
    category: '风险',
    minAge: 50,
    maxAge: 100,
    riskLevel: 4,
    rewardLevel: 1,
    failureLevel: 4,
    balanceEffect: -2,
    unlockWealth: 0,
    tags: ['意外', '财富', '投资'],
    description: '市场环境变化，投资出现亏损。'
  },

  // 机遇类（中老年期）
  {
    id: 'm_inheritance',
    name: '获得遗产',
    category: '机遇',
    minAge: 30,
    maxAge: 90,
    riskLevel: 2,
    rewardLevel: 8,
    failureLevel: 1,
    balanceEffect: 0,
    unlockWealth: 0,
    tags: ['运气', '财富', '家庭'],
    description: '一位长辈留给你一笔遗产。'
  },
  {
    id: 'm_charity',
    name: '慈善捐赠',
    category: '机遇',
    minAge: 35,
    maxAge: 120,
    riskLevel: 3,
    rewardLevel: 4,
    failureLevel: 1,
    balanceEffect: 2,
    unlockWealth: 50,
    tags: ['幸福', '公益', '影响力'],
    description: '捐赠财富，回馈社会。',
    narrative: {
      title: '慈善捐赠',
      story: '你决定拿出一部分财富，帮助那些需要帮助的人。',
      successText: '你的善举产生了深远的影响，社会声誉大大提升。',
      failureText: '善款被挪用，你的善意没有到达需要的人手中。',
      normalText: '你完成了一次普通的捐赠。'
    }
  },

  // ==================== 71-120岁：老年期 ====================
  // 成长类
  {
    id: 'm_nursing',
    name: '养老护理',
    category: '成长',
    minAge: 70,
    maxAge: 120,
    riskLevel: 2,
    rewardLevel: 3,
    failureLevel: 2,
    balanceEffect: 2,
    unlockWealth: 20,
    tags: ['健康', '养老', '照护'],
    description: '接受专业养老护理，保障晚年生活质量。'
  },

  // 教育类
  {
    id: 'm_memoir',
    name: '写回忆录',
    category: '教育',
    minAge: 65,
    maxAge: 120,
    riskLevel: 2,
    rewardLevel: 4,
    failureLevel: 1,
    balanceEffect: 1,
    unlockWealth: 0,
    tags: ['知识', '回忆', '传承'],
    description: '记录自己的人生故事，留给后人。'
  },

  // 投资类
  {
    id: 'm_estate_planning',
    name: '遗产规划',
    category: '投资',
    minAge: 60,
    maxAge: 120,
    riskLevel: 2,
    rewardLevel: 4,
    failureLevel: 1,
    balanceEffect: 0,
    unlockWealth: 50,
    tags: ['财富', '家庭', '规划'],
    description: '提前规划遗产分配，减少家庭纠纷。'
  },

  // 家庭类
  {
    id: 'm_legacy_wealth',
    name: '传承财富',
    category: '家庭',
    minAge: 60,
    maxAge: 120,
    riskLevel: 3,
    rewardLevel: 5,
    failureLevel: 2,
    balanceEffect: 1,
    unlockWealth: 50,
    tags: ['财富', '家庭', '传承'],
    description: '把财富与经验传承给下一代。'
  },

  // 社交类
  {
    id: 'm_elderly_club',
    name: '老年社团',
    category: '社交',
    minAge: 60,
    maxAge: 120,
    riskLevel: 1,
    rewardLevel: 2,
    failureLevel: 1,
    balanceEffect: 1,
    unlockWealth: 0,
    tags: ['人脉', '社交', '幸福'],
    description: '参加老年社团，结识同龄朋友。'
  },

  // 兴趣类
  {
    id: 'm_calligraphy',
    name: '书法',
    category: '兴趣',
    minAge: 50,
    maxAge: 120,
    riskLevel: 1,
    rewardLevel: 2,
    failureLevel: 1,
    balanceEffect: 1,
    unlockWealth: 0,
    tags: ['技能', '艺术', '静心'],
    description: '练习书法，修身养性。'
  },
  {
    id: 'm_travel_retirement',
    name: '旅行养老',
    category: '兴趣',
    minAge: 60,
    maxAge: 90,
    riskLevel: 2,
    rewardLevel: 3,
    failureLevel: 2,
    balanceEffect: 2,
    unlockWealth: 30,
    tags: ['幸福', '旅行', '养老'],
    description: '趁身体还行，去想去的地方看看。'
  },

  // 风险类（老年期）
  {
    id: 'm_serious_illness',
    name: '重大疾病',
    category: '风险',
    minAge: 60,
    maxAge: 120,
    riskLevel: 7,
    rewardLevel: 1,
    failureLevel: 7,
    balanceEffect: -5,
    unlockWealth: 0,
    tags: ['意外', '健康', '疾病'],
    description: '患上重大疾病，需要长期治疗。'
  },
  {
    id: 'm_fall_elderly',
    name: '跌倒',
    category: '风险',
    minAge: 65,
    maxAge: 120,
    riskLevel: 5,
    rewardLevel: 1,
    failureLevel: 5,
    balanceEffect: -4,
    unlockWealth: 0,
    tags: ['意外', '健康', '养老'],
    description: '不慎跌倒，可能造成骨折等伤害。'
  },
  {
    id: 'm_loneliness',
    name: '孤独',
    category: '风险',
    minAge: 70,
    maxAge: 120,
    riskLevel: 4,
    rewardLevel: 1,
    failureLevel: 4,
    balanceEffect: -3,
    unlockWealth: 0,
    tags: ['意外', '幸福', '心理'],
    description: '感到孤独，需要陪伴与关怀。'
  },

  // 机遇类（老年期）
  {
    id: 'm_family_blessing',
    name: '子孙满堂',
    category: '机遇',
    minAge: 60,
    maxAge: 120,
    riskLevel: 1,
    rewardLevel: 5,
    failureLevel: 1,
    balanceEffect: 3,
    unlockWealth: 0,
    tags: ['运气', '家庭', '幸福'],
    description: '子孙孝顺，家庭和睦，晚年幸福。'
  },
  {
    id: 'm_happy_surprise',
    name: '意外之喜',
    category: '机遇',
    minAge: 60,
    maxAge: 120,
    riskLevel: 2,
    rewardLevel: 3,
    failureLevel: 1,
    balanceEffect: 2,
    unlockWealth: 0,
    tags: ['运气', '幸福', '生活'],
    description: '生活中出现一件令人开心的小事。'
  },
  ...generatedModernBehaviors
];
