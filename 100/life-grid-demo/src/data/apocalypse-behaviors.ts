import { Behavior } from '../types';
import { generatedApocalypseBehaviors } from './generated-apocalypse-behaviors';

export const apocalypseBehaviors: Behavior[] = [
  {
    "id": "a_sleep",
    "name": "睡觉",
    "category": "成长",
    "minAge": 1,
    "maxAge": 120,
    "riskLevel": 1,
    "rewardLevel": 1,
    "failureLevel": 1,
    "balanceEffect": 2,
    "unlockWealth": 0,
    "tags": [
      "健康",
      "基础",
      "恢复",
      "安全"
    ],
    "description": "在末世中寻找片刻安宁。",
    "narrative": {
      "title": "末世安眠",
      "story": "在危机四伏的废墟中，你蜷缩在安全角落试图入睡。",
      "successText": "你睡得难得安稳，体力恢复了不少。",
      "failureText": "噩梦与远处的嘶吼让你一夜惊醒，疲惫不堪。"
    }
  },
  {
    "id": "a_rest",
    "name": "休息",
    "category": "兴趣",
    "minAge": 1,
    "maxAge": 120,
    "riskLevel": 1,
    "rewardLevel": 1,
    "failureLevel": 1,
    "balanceEffect": 2,
    "unlockWealth": 0,
    "tags": [
      "健康",
      "恢复",
      "低危",
      "基础"
    ],
    "description": "保存体力，避免过度消耗。",
    "narrative": {
      "title": "保存体力",
      "story": "你选择停下来休息，避免在末世中透支自己。",
      "successText": "休息让你恢复了精力，注意力更加集中。",
      "failureText": "休息时物资被盗，你懊恼不已。"
    }
  },
  {
    "id": "a_find_food",
    "name": "寻找食物",
    "category": "成长",
    "minAge": 5,
    "maxAge": 120,
    "riskLevel": 3,
    "rewardLevel": 3,
    "failureLevel": 2,
    "balanceEffect": 0,
    "unlockWealth": 0,
    "tags": [
      "健康",
      "食物",
      "探索",
      "必需"
    ],
    "description": "搜寻任何可食用的东西。",
    "narrative": {
      "title": "搜寻食物",
      "story": "饥饿驱使你外出寻找任何可食用的东西。",
      "successText": "你找到了一批罐头，暂时解决了温饱问题。",
      "failureText": "你空手而归，还险些遭遇危险。"
    }
  },
  {
    "id": "a_find_water",
    "name": "寻找饮水",
    "category": "成长",
    "minAge": 5,
    "maxAge": 120,
    "riskLevel": 3,
    "rewardLevel": 3,
    "failureLevel": 3,
    "balanceEffect": 0,
    "unlockWealth": 0,
    "tags": [
      "健康",
      "水",
      "探索",
      "必需"
    ],
    "description": "寻找干净的水源。",
    "narrative": {
      "title": "寻找饮水",
      "story": "干净的水源越来越稀缺，你不得不冒险去寻找。",
      "successText": "你发现了一处未被污染的水源，如获至宝。",
      "failureText": "找到的水源已被污染，你喝下去后身体不适。"
    }
  },
  {
    "id": "a_emergency_shelter",
    "name": "紧急避难",
    "category": "成长",
    "minAge": 1,
    "maxAge": 120,
    "riskLevel": 4,
    "rewardLevel": 2,
    "failureLevel": 2,
    "balanceEffect": 1,
    "unlockWealth": 0,
    "tags": [
      "健康",
      "安全",
      "避险",
      "基础"
    ],
    "description": "遭遇危险时迅速躲藏。",
    "narrative": {
      "title": "紧急避难",
      "story": "危险逼近，你必须立刻找到藏身之处。",
      "successText": "你及时躲藏，成功避开了威胁。",
      "failureText": "你藏身的地点被发现，不得不狼狈逃窜。"
    }
  },
  {
    "id": "a_collect_wood",
    "name": "收集木材",
    "category": "成长",
    "minAge": 6,
    "maxAge": 120,
    "riskLevel": 3,
    "rewardLevel": 2,
    "failureLevel": 1,
    "balanceEffect": -1,
    "unlockWealth": 0,
    "tags": [
      "健康",
      "资源",
      "燃料",
      "基础"
    ],
    "description": "收集木材用于生火与建造。"
  },
  {
    "id": "a_make_fire",
    "name": "生火",
    "category": "成长",
    "minAge": 6,
    "maxAge": 120,
    "riskLevel": 2,
    "rewardLevel": 2,
    "failureLevel": 2,
    "balanceEffect": 1,
    "unlockWealth": 0,
    "tags": [
      "健康",
      "温暖",
      "烹饪",
      "基础"
    ],
    "description": "点燃火焰，取暖煮食。"
  },
  {
    "id": "a_cook",
    "name": "烹饪",
    "category": "兴趣",
    "minAge": 8,
    "maxAge": 120,
    "riskLevel": 2,
    "rewardLevel": 2,
    "failureLevel": 1,
    "balanceEffect": 1,
    "unlockWealth": 0,
    "tags": [
      "健康",
      "食物",
      "技能"
    ],
    "description": "把食材加工成安全的食物。"
  },
  {
    "id": "a_collect_stone",
    "name": "收集石头",
    "category": "成长",
    "minAge": 6,
    "maxAge": 120,
    "riskLevel": 3,
    "rewardLevel": 1,
    "failureLevel": 1,
    "balanceEffect": -1,
    "unlockWealth": 0,
    "tags": [
      "健康",
      "资源",
      "建造",
      "基础"
    ],
    "description": "收集石头作为建筑材料。"
  },
  {
    "id": "a_organize_bag",
    "name": "整理背包",
    "category": "成长",
    "minAge": 6,
    "maxAge": 120,
    "riskLevel": 2,
    "rewardLevel": 1,
    "failureLevel": 1,
    "balanceEffect": 1,
    "unlockWealth": 0,
    "tags": [
      "健康",
      "整理",
      "效率",
      "基础"
    ],
    "description": "整理物资，提高携带效率。"
  },
  {
    "id": "a_search_house",
    "name": "搜索房屋",
    "category": "机遇",
    "minAge": 12,
    "maxAge": 120,
    "riskLevel": 4,
    "rewardLevel": 4,
    "failureLevel": 3,
    "balanceEffect": -1,
    "unlockWealth": 0,
    "tags": [
      "运气",
      "探索",
      "物资",
      "风险"
    ],
    "description": "进入废弃房屋搜寻物资。"
  },
  {
    "id": "a_make_tool",
    "name": "制作工具",
    "category": "社交",
    "minAge": 12,
    "maxAge": 120,
    "riskLevel": 4,
    "rewardLevel": 3,
    "failureLevel": 2,
    "balanceEffect": 0,
    "unlockWealth": 0,
    "tags": [
      "技能",
      "制作",
      "工具"
    ],
    "description": "用废旧材料制作简易工具。"
  },
  {
    "id": "a_get_medicine",
    "name": "获取药品",
    "category": "成长",
    "minAge": 13,
    "maxAge": 120,
    "riskLevel": 4,
    "rewardLevel": 4,
    "failureLevel": 3,
    "balanceEffect": 0,
    "unlockWealth": 0,
    "tags": [
      "健康",
      "医疗",
      "探索",
      "必需"
    ],
    "description": "前往危险区域寻找药品。",
    "narrative": {
      "title": "获取药品",
      "story": "药品是末世里最珍贵的资源之一，你决定冒险去搜寻。",
      "successText": "你找到了急需的药品，救了同伴一命。",
      "failureText": "你闯入危险区域，险些被感染者包围。"
    }
  },
  {
    "id": "a_set_camp",
    "name": "搭建营地",
    "category": "事业",
    "minAge": 13,
    "maxAge": 120,
    "riskLevel": 3,
    "rewardLevel": 3,
    "failureLevel": 2,
    "balanceEffect": 1,
    "unlockWealth": 0,
    "tags": [
      "技能",
      "建造",
      "安全",
      "临时"
    ],
    "description": "搭建临时营地休息过夜。"
  },
  {
    "id": "a_gather_berries",
    "name": "采集野果",
    "category": "投资",
    "minAge": 8,
    "maxAge": 120,
    "riskLevel": 4,
    "rewardLevel": 2,
    "failureLevel": 2,
    "balanceEffect": 0,
    "unlockWealth": 0,
    "tags": [
      "财富",
      "食物",
      "采集",
      "自然"
    ],
    "description": "在野外采集可食用的果实。"
  },
  {
    "id": "a_search_market",
    "name": "搜索超市",
    "category": "机遇",
    "minAge": 16,
    "maxAge": 120,
    "riskLevel": 5,
    "rewardLevel": 5,
    "failureLevel": 4,
    "balanceEffect": -1,
    "unlockWealth": 0,
    "tags": [
      "运气",
      "探索",
      "物资",
      "风险"
    ],
    "description": "搜索废弃超市获取食物与物资。"
  },
  {
    "id": "a_make_weapon",
    "name": "制作武器",
    "category": "事业",
    "minAge": 16,
    "maxAge": 120,
    "riskLevel": 5,
    "rewardLevel": 5,
    "failureLevel": 3,
    "balanceEffect": -1,
    "unlockWealth": 5,
    "tags": [
      "技能",
      "武器",
      "防御",
      "制作"
    ],
    "description": "制作武器保护自己。"
  },
  {
    "id": "a_patrol",
    "name": "巡逻",
    "category": "事业",
    "minAge": 18,
    "maxAge": 60,
    "riskLevel": 4,
    "rewardLevel": 4,
    "failureLevel": 4,
    "balanceEffect": -1,
    "unlockWealth": 0,
    "tags": [
      "技能",
      "防御",
      "安全",
      "战斗"
    ],
    "description": "在营地周围巡逻警戒。"
  },
  {
    "id": "a_plant_food",
    "name": "种植粮食",
    "category": "投资",
    "minAge": 16,
    "maxAge": 80,
    "riskLevel": 3,
    "rewardLevel": 4,
    "failureLevel": 2,
    "balanceEffect": 1,
    "unlockWealth": 0,
    "tags": [
      "财富",
      "农业",
      "食物",
      "长期"
    ],
    "description": "开垦土地种植粮食作物。"
  },
  {
    "id": "a_night_watch",
    "name": "守夜",
    "category": "事业",
    "minAge": 16,
    "maxAge": 70,
    "riskLevel": 4,
    "rewardLevel": 3,
    "failureLevel": 4,
    "balanceEffect": -2,
    "unlockWealth": 0,
    "tags": [
      "技能",
      "防御",
      "夜间",
      "警觉"
    ],
    "description": "夜间值守，防备袭击。"
  },
  {
    "id": "a_train_shooting",
    "name": "训练射击",
    "category": "兴趣",
    "minAge": 16,
    "maxAge": 60,
    "riskLevel": 5,
    "rewardLevel": 5,
    "failureLevel": 3,
    "balanceEffect": -1,
    "unlockWealth": 10,
    "tags": [
      "技能",
      "战斗",
      "消耗"
    ],
    "description": "练习射击，提高战斗能力。"
  },
  {
    "id": "a_hunt",
    "name": "狩猎",
    "category": "投资",
    "minAge": 18,
    "maxAge": 65,
    "riskLevel": 5,
    "rewardLevel": 5,
    "failureLevel": 5,
    "balanceEffect": -1,
    "unlockWealth": 5,
    "tags": [
      "财富",
      "食物",
      "战斗",
      "风险"
    ],
    "description": "捕猎野生动物获取食物。"
  },
  {
    "id": "a_fishing",
    "name": "捕鱼",
    "category": "投资",
    "minAge": 10,
    "maxAge": 80,
    "riskLevel": 4,
    "rewardLevel": 3,
    "failureLevel": 2,
    "balanceEffect": 1,
    "unlockWealth": 0,
    "tags": [
      "财富",
      "食物",
      "耐心",
      "低危"
    ],
    "description": "在水域附近捕鱼。"
  },
  {
    "id": "a_build_shelter",
    "name": "建造避难所",
    "category": "事业",
    "minAge": 20,
    "maxAge": 120,
    "riskLevel": 3,
    "rewardLevel": 5,
    "failureLevel": 3,
    "balanceEffect": 1,
    "unlockWealth": 10,
    "tags": [
      "技能",
      "建造",
      "安全",
      "长期"
    ],
    "description": "建造坚固的避难所。",
    "narrative": {
      "title": "建造避难所",
      "story": "你决定建造一个更坚固的避难所，抵御末世的威胁。",
      "successText": "避难所坚固实用，大家终于有了安全感。",
      "failureText": "建材不足，避难所质量堪忧。"
    }
  },
  {
    "id": "a_build_wall",
    "name": "修建围墙",
    "category": "事业",
    "minAge": 18,
    "maxAge": 120,
    "riskLevel": 4,
    "rewardLevel": 4,
    "failureLevel": 3,
    "balanceEffect": 0,
    "unlockWealth": 10,
    "tags": [
      "技能",
      "防御",
      "建造",
      "安全"
    ],
    "description": "修建围墙保护营地。"
  },
  {
    "id": "a_defend_attack",
    "name": "抵御袭击",
    "category": "风险",
    "minAge": 18,
    "maxAge": 65,
    "riskLevel": 6,
    "rewardLevel": 6,
    "failureLevel": 7,
    "balanceEffect": -3,
    "unlockWealth": 0,
    "tags": [
      "技能",
      "战斗",
      "危机",
      "高危险"
    ],
    "description": "击退敌对势力或感染者的袭击。",
    "narrative": {
      "title": "抵御袭击",
      "story": "营地遭到袭击，你必须挺身而出保卫家园。",
      "successText": "你们成功击退了敌人，守住了营地。",
      "failureText": "敌人突破防线，营地损失惨重。"
    }
  },
  {
    "id": "a_make_medicine",
    "name": "制作药品",
    "category": "事业",
    "minAge": 20,
    "maxAge": 120,
    "riskLevel": 5,
    "rewardLevel": 5,
    "failureLevel": 3,
    "balanceEffect": 0,
    "unlockWealth": 15,
    "tags": [
      "技能",
      "医疗",
      "制作",
      "资源"
    ],
    "description": "用草药和化学材料制作药品。"
  },
  {
    "id": "a_trade",
    "name": "进行贸易",
    "category": "社交",
    "minAge": 18,
    "maxAge": 80,
    "riskLevel": 5,
    "rewardLevel": 5,
    "failureLevel": 3,
    "balanceEffect": 0,
    "unlockWealth": 10,
    "tags": [
      "人脉",
      "交易",
      "社交",
      "资源"
    ],
    "description": "与其他幸存者交易物资。",
    "narrative": {
      "title": "末世贸易",
      "story": "你与其他幸存者进行交易，各取所需。",
      "successText": "你换到了急需的物资，双方都满意而归。",
      "failureText": "对方设下陷阱，你被骗走了大部分资源。"
    }
  },
  {
    "id": "a_build_team",
    "name": "建立团队",
    "category": "事业",
    "minAge": 22,
    "maxAge": 70,
    "riskLevel": 4,
    "rewardLevel": 6,
    "failureLevel": 3,
    "balanceEffect": 1,
    "unlockWealth": 10,
    "tags": [
      "人脉",
      "组织",
      "领导力",
      "社交"
    ],
    "description": "召集幸存者组成团队。",
    "narrative": {
      "title": "建立团队",
      "story": "你召集志同道合的幸存者，希望抱团取暖。",
      "successText": "团队分工明确，凝聚力越来越强。",
      "failureText": "团队内部出现分歧，人心涣散。"
    }
  },
  {
    "id": "a_manage_inventory",
    "name": "管理库存",
    "category": "投资",
    "minAge": 18,
    "maxAge": 80,
    "riskLevel": 4,
    "rewardLevel": 3,
    "failureLevel": 1,
    "balanceEffect": 1,
    "unlockWealth": 5,
    "tags": [
      "财富",
      "管理",
      "资源",
      "效率"
    ],
    "description": "合理分配与储存物资。"
  },
  {
    "id": "a_recruit",
    "name": "招募成员",
    "category": "社交",
    "minAge": 20,
    "maxAge": 65,
    "riskLevel": 5,
    "rewardLevel": 5,
    "failureLevel": 4,
    "balanceEffect": 0,
    "unlockWealth": 5,
    "tags": [
      "人脉",
      "组织",
      "信任",
      "风险"
    ],
    "description": "吸纳新成员加入团队。"
  },
  {
    "id": "a_train_leader",
    "name": "培养领导者",
    "category": "事业",
    "minAge": 40,
    "maxAge": 90,
    "riskLevel": 6,
    "rewardLevel": 5,
    "failureLevel": 2,
    "balanceEffect": 1,
    "unlockWealth": 15,
    "tags": [
      "人脉",
      "传承",
      "领导",
      "组织"
    ],
    "description": "培养下一代团队领导者。"
  },
  {
    "id": "a_build_hospital",
    "name": "建立医院",
    "category": "事业",
    "minAge": 30,
    "maxAge": 90,
    "riskLevel": 7,
    "rewardLevel": 7,
    "failureLevel": 4,
    "balanceEffect": 1,
    "unlockWealth": 30,
    "tags": [
      "健康",
      "医疗",
      "建造",
      "组织"
    ],
    "description": "建立医疗站服务团队。"
  },
  {
    "id": "a_build_alliance",
    "name": "建立联盟",
    "category": "社交",
    "minAge": 30,
    "maxAge": 80,
    "riskLevel": 7,
    "rewardLevel": 7,
    "failureLevel": 4,
    "balanceEffect": 1,
    "unlockWealth": 20,
    "tags": [
      "人脉",
      "外交",
      "组织",
      "战略"
    ],
    "description": "与其他幸存者团体结盟。"
  },
  {
    "id": "a_mentor_youth",
    "name": "指导后辈",
    "category": "社交",
    "minAge": 40,
    "maxAge": 120,
    "riskLevel": 3,
    "rewardLevel": 4,
    "failureLevel": 1,
    "balanceEffect": 2,
    "unlockWealth": 5,
    "tags": [
      "人脉",
      "传承",
      "教育",
      "低危"
    ],
    "description": "传授末世生存经验。"
  },
  {
    "id": "a_charity_apoc",
    "name": "救助难民",
    "category": "社交",
    "minAge": 25,
    "maxAge": 120,
    "riskLevel": 6,
    "rewardLevel": 5,
    "failureLevel": 3,
    "balanceEffect": 2,
    "unlockWealth": 10,
    "tags": [
      "人脉",
      "公益",
      "道德",
      "资源"
    ],
    "description": "收留并帮助落难幸存者。"
  },
  {
    "id": "a_retire_apoc",
    "name": "退休",
    "category": "家庭",
    "minAge": 60,
    "maxAge": 120,
    "riskLevel": 1,
    "rewardLevel": 2,
    "failureLevel": 1,
    "balanceEffect": 2,
    "unlockWealth": 5,
    "tags": [
      "幸福",
      "晚年",
      "低危",
      "稳定"
    ],
    "description": "把前线工作交给年轻人。",
    "narrative": {
      "title": "末世退休",
      "story": "你把前线工作交给年轻人，开始过上相对安稳的晚年。",
      "successText": "年轻人尊重你的经验，你的晚年得到了妥善照顾。",
      "failureText": "你体力衰退，渐渐成为团队的负担。"
    }
  },
  {
    "id": "a_memoir_apoc",
    "name": "回忆录",
    "category": "教育",
    "minAge": 60,
    "maxAge": 120,
    "riskLevel": 2,
    "rewardLevel": 3,
    "failureLevel": 1,
    "balanceEffect": 2,
    "unlockWealth": 0,
    "tags": [
      "知识",
      "传承",
      "低危"
    ],
    "description": "记录末世经历与生存知识。"
  },
  {
    "id": "a_elder_care",
    "name": "养老照护",
    "category": "家庭",
    "minAge": 60,
    "maxAge": 120,
    "riskLevel": 3,
    "rewardLevel": 3,
    "failureLevel": 2,
    "balanceEffect": 1,
    "unlockWealth": 10,
    "tags": [
      "健康",
      "晚年",
      "互助"
    ],
    "description": "在团队中获得养老照护。",
    "narrative": {
      "title": "养老照护",
      "story": "团队为你安排了养老照护，你在末世中也感受到了温暖。",
      "successText": "照护周到，你的身体状况保持稳定。",
      "failureText": "资源短缺，你的照护条件大不如前。"
    }
  },
  {
    "id": "a_storytelling",
    "name": "讲述往事",
    "category": "感情",
    "minAge": 60,
    "maxAge": 120,
    "riskLevel": 3,
    "rewardLevel": 2,
    "failureLevel": 1,
    "balanceEffect": 3,
    "unlockWealth": 0,
    "tags": [
      "幸福",
      "传承",
      "社交"
    ],
    "description": "给年轻人讲述过去的故事。"
  },
  {
    "id": "a_family_gather_apoc",
    "name": "家族团聚",
    "category": "家庭",
    "minAge": 50,
    "maxAge": 120,
    "riskLevel": 4,
    "rewardLevel": 3,
    "failureLevel": 1,
    "balanceEffect": 3,
    "unlockWealth": 0,
    "tags": [
      "幸福",
      "家庭",
      "传承"
    ],
    "description": "与幸存者家人团聚。"
  },
  {
    "id": "a_search_hospital",
    "name": "搜索医院",
    "category": "事业",
    "minAge": 18,
    "maxAge": 120,
    "riskLevel": 6,
    "rewardLevel": 6,
    "failureLevel": 5,
    "balanceEffect": -1,
    "unlockWealth": 0,
    "tags": [
      "运气",
      "探索",
      "医疗",
      "高危险"
    ],
    "description": "深入废弃医院搜寻药品。",
    "narrative": {
      "title": "搜索医院",
      "story": "你深入废弃医院，希望能找到药品和器械。",
      "successText": "你满载而归，收获远超预期。",
      "failureText": "医院内潜伏着危险，你差点没能活着出来。"
    }
  },
  {
    "id": "a_search_military",
    "name": "搜索军营",
    "category": "机遇",
    "minAge": 20,
    "maxAge": 60,
    "riskLevel": 6,
    "rewardLevel": 8,
    "failureLevel": 7,
    "balanceEffect": -2,
    "unlockWealth": 10,
    "tags": [
      "运气",
      "探索",
      "武器",
      "高危险"
    ],
    "description": "搜索军营获取武器与装备。",
    "narrative": {
      "title": "搜索军营",
      "story": "你前往废弃军营，寻找武器与装备。",
      "successText": "你找到了一批精良装备，实力大增。",
      "failureText": "军营中埋伏着其他势力，你受了重伤。"
    }
  },
  {
    "id": "a_long_expedition",
    "name": "长途远征",
    "category": "机遇",
    "minAge": 18,
    "maxAge": 55,
    "riskLevel": 7,
    "rewardLevel": 7,
    "failureLevel": 6,
    "balanceEffect": -2,
    "unlockWealth": 5,
    "tags": [
      "运气",
      "探索",
      "远征",
      "高危险"
    ],
    "description": "离开安全区进行长途探索。"
  },
  {
    "id": "a_raid",
    "name": "突袭敌营",
    "category": "风险",
    "minAge": 20,
    "maxAge": 55,
    "riskLevel": 7,
    "rewardLevel": 8,
    "failureLevel": 9,
    "balanceEffect": -4,
    "unlockWealth": 15,
    "tags": [
      "意外",
      "战斗",
      "掠夺",
      "高危险"
    ],
    "description": "主动袭击敌对营地。",
    "narrative": {
      "title": "突袭敌营",
      "story": "你主动出击，试图从敌对势力手中夺取资源。",
      "successText": "突袭大获成功，你们带回了大量物资。",
      "failureText": "敌方早有准备，你损失惨重，险些丧命。"
    }
  },
  {
    "id": "a_radiation_zone",
    "name": "穿越辐射区",
    "category": "机遇",
    "minAge": 18,
    "maxAge": 50,
    "riskLevel": 7,
    "rewardLevel": 9,
    "failureLevel": 10,
    "balanceEffect": -5,
    "unlockWealth": 20,
    "tags": [
      "运气",
      "辐射",
      "高危险",
      "探索"
    ],
    "description": "穿越高辐射区域寻找稀缺资源。"
  },
  {
    "id": "a_infected_zone",
    "name": "深入感染区",
    "category": "机遇",
    "minAge": 18,
    "maxAge": 50,
    "riskLevel": 8,
    "rewardLevel": 9,
    "failureLevel": 10,
    "balanceEffect": -5,
    "unlockWealth": 20,
    "tags": [
      "运气",
      "感染",
      "高危险",
      "探索"
    ],
    "description": "深入丧尸密集区域。",
    "narrative": {
      "title": "深入感染区",
      "story": "你冒险进入丧尸密集的区域，寻找稀缺物资。",
      "successText": "你机智地避开了尸群，顺利完成任务。",
      "failureText": "你被感染者包围，九死一生才逃出来。"
    }
  },
  {
    "id": "a_black_market",
    "name": "黑市交易",
    "category": "机遇",
    "minAge": 18,
    "maxAge": 70,
    "riskLevel": 8,
    "rewardLevel": 7,
    "failureLevel": 8,
    "balanceEffect": -3,
    "unlockWealth": 15,
    "tags": [
      "运气",
      "交易",
      "非法",
      "高危险"
    ],
    "description": "在危险黑市进行交易。",
    "narrative": {
      "title": "黑市交易",
      "story": "你来到危险的黑市，试图买到紧俏物资。",
      "successText": "你用合理的价格买到了急需品。",
      "failureText": "黑市卖家翻脸，你财物两空。"
    }
  },
  {
    "id": "a_rebuild_civilization",
    "name": "重建文明",
    "category": "教育",
    "minAge": 30,
    "maxAge": 80,
    "riskLevel": 9,
    "rewardLevel": 10,
    "failureLevel": 5,
    "balanceEffect": 1,
    "unlockWealth": 50,
    "tags": [
      "知识",
      "科技",
      "组织",
      "终极"
    ],
    "description": "组织力量重建社会秩序。",
    "narrative": {
      "title": "重建文明",
      "story": "你决定组织力量重建社会秩序，这是人类最后的希望。",
      "successText": "你的努力让废墟中重新燃起了文明的火种。",
      "failureText": "重建计划遭遇背叛与破坏，希望变得渺茫。"
    }
  },
  {
    "id": "a_search_warehouse",
    "name": "搜索仓库",
    "category": "机遇",
    "minAge": 14,
    "maxAge": 120,
    "riskLevel": 5,
    "rewardLevel": 5,
    "failureLevel": 4,
    "balanceEffect": -1,
    "unlockWealth": 0,
    "tags": [
      "运气",
      "探索",
      "物资",
      "风险"
    ],
    "description": "搜索废弃仓库寻找大量物资。"
  },
  {
    "id": "a_search_factory",
    "name": "搜索工厂",
    "category": "机遇",
    "minAge": 16,
    "maxAge": 60,
    "riskLevel": 5,
    "rewardLevel": 6,
    "failureLevel": 5,
    "balanceEffect": -1,
    "unlockWealth": 5,
    "tags": [
      "运气",
      "探索",
      "工业",
      "高危险"
    ],
    "description": "进入废弃工厂搜寻原材料与设备。"
  },
  {
    "id": "a_map_explore",
    "name": "地图探索",
    "category": "教育",
    "minAge": 12,
    "maxAge": 60,
    "riskLevel": 3,
    "rewardLevel": 3,
    "failureLevel": 2,
    "balanceEffect": 0,
    "unlockWealth": 0,
    "tags": [
      "运气",
      "探索",
      "情报",
      "安全"
    ],
    "description": "绘制周边地图，标注安全路线。"
  },
  {
    "id": "a_build_warehouse",
    "name": "建造仓库",
    "category": "事业",
    "minAge": 18,
    "maxAge": 120,
    "riskLevel": 3,
    "rewardLevel": 4,
    "failureLevel": 2,
    "balanceEffect": 0,
    "unlockWealth": 10,
    "tags": [
      "技能",
      "建造",
      "存储",
      "安全"
    ],
    "description": "建造仓库安全储存物资。"
  },
  {
    "id": "a_build_farmland",
    "name": "建造农田",
    "category": "事业",
    "minAge": 16,
    "maxAge": 80,
    "riskLevel": 4,
    "rewardLevel": 4,
    "failureLevel": 2,
    "balanceEffect": 1,
    "unlockWealth": 5,
    "tags": [
      "技能",
      "农业",
      "建造",
      "长期"
    ],
    "description": "开垦农田实现粮食自给。"
  },
  {
    "id": "a_make_trap",
    "name": "制作陷阱",
    "category": "事业",
    "minAge": 14,
    "maxAge": 80,
    "riskLevel": 4,
    "rewardLevel": 4,
    "failureLevel": 3,
    "balanceEffect": -1,
    "unlockWealth": 5,
    "tags": [
      "技能",
      "武器",
      "防御",
      "狩猎"
    ],
    "description": "制作陷阱捕猎或防御敌人。"
  },
  {
    "id": "a_mine",
    "name": "采矿",
    "category": "投资",
    "minAge": 18,
    "maxAge": 60,
    "riskLevel": 5,
    "rewardLevel": 6,
    "failureLevel": 5,
    "balanceEffect": -2,
    "unlockWealth": 10,
    "tags": [
      "财富",
      "资源",
      "工业",
      "高危险"
    ],
    "description": "开采矿石获取金属资源。"
  },
  {
    "id": "a_defend_position",
    "name": "防守据点",
    "category": "事业",
    "minAge": 18,
    "maxAge": 65,
    "riskLevel": 6,
    "rewardLevel": 5,
    "failureLevel": 6,
    "balanceEffect": -2,
    "unlockWealth": 0,
    "tags": [
      "技能",
      "战斗",
      "防御",
      "据点"
    ],
    "description": "坚守己方据点不被攻破。"
  },
  {
    "id": "a_bandage",
    "name": "包扎伤口",
    "category": "成长",
    "minAge": 10,
    "maxAge": 120,
    "riskLevel": 3,
    "rewardLevel": 2,
    "failureLevel": 1,
    "balanceEffect": 1,
    "unlockWealth": 0,
    "tags": [
      "健康",
      "医疗",
      "急救",
      "低危"
    ],
    "description": "为伤口进行简单包扎处理。"
  },
  {
    "id": "a_treat_infection",
    "name": "治疗感染",
    "category": "成长",
    "minAge": 16,
    "maxAge": 120,
    "riskLevel": 4,
    "rewardLevel": 5,
    "failureLevel": 4,
    "balanceEffect": 0,
    "unlockWealth": 10,
    "tags": [
      "健康",
      "医疗",
      "疾病",
      "风险"
    ],
    "description": "处理伤口感染或疾病。",
    "narrative": {
      "title": "治疗感染",
      "story": "同伴感染了未知病毒，你必须尽快处理。",
      "successText": "你及时处理，病情得到了控制。",
      "failureText": "感染扩散，你无能为力，只能眼睁睁看着情况恶化。"
    }
  },
  {
    "id": "a_negotiate",
    "name": "谈判合作",
    "category": "事业",
    "minAge": 20,
    "maxAge": 80,
    "riskLevel": 6,
    "rewardLevel": 5,
    "failureLevel": 3,
    "balanceEffect": 0,
    "unlockWealth": 10,
    "tags": [
      "人脉",
      "外交",
      "合作",
      "社交"
    ],
    "description": "与其他团体谈判达成合作。"
  },
  {
    "id": "a_tech_research",
    "name": "技术研发",
    "category": "事业",
    "minAge": 20,
    "maxAge": 70,
    "riskLevel": 5,
    "rewardLevel": 7,
    "failureLevel": 3,
    "balanceEffect": -1,
    "unlockWealth": 20,
    "tags": [
      "知识",
      "科技",
      "长期"
    ],
    "description": "投入资源进行技术研发。"
  },
  {
    "id": "a_scavenge_vehicle",
    "name": "搜索废弃车辆",
    "category": "机遇",
    "minAge": 14,
    "maxAge": 70,
    "riskLevel": 4,
    "rewardLevel": 4,
    "failureLevel": 3,
    "balanceEffect": -1,
    "unlockWealth": 0,
    "tags": [
      "运气",
      "探索",
      "物资",
      "交通"
    ],
    "description": "在废弃车辆中搜寻可用物资。"
  },
  ...generatedApocalypseBehaviors
];
