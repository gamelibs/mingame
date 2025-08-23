/**
 * 蛋生成算法胜率分析
 * 分析当前算法3的胜率并计算达到10%胜率所需的调整
 */

// 当前 cardBoosts 配置
const currentCardBoosts = {
    1: 0.5, // 灰
    2: 0.5, // 绿
    3: 0.5, // 蓝
    4: 0.4, // 紫
    5: 0.3, // 红
    6: 0.2, // 黄
    7: 0.1  // 橙
};

/**
 * 计算各级别蛋的出现概率
 */
function calculateProbabilities(cardBoosts) {
    const totalWeight = Object.values(cardBoosts).reduce((sum, weight) => sum + weight, 0);
    const probabilities = {};
    
    for (const [level, weight] of Object.entries(cardBoosts)) {
        probabilities[level] = weight / totalWeight;
    }
    
    return { probabilities, totalWeight };
}

/**
 * 估算胜率（简化模型）
 * 胜率取决于能否在游戏过程中生成足够的7级蛋并让它们相邻
 */
function estimateWinRate(probabilities) {
    const level7Prob = probabilities[7];
    
    // 简化模型：假设游戏中会生成大约100-150个蛋
    // 需要至少3个7级蛋在相邻位置才能获胜
    const avgEggsGenerated = 125;
    const expectedLevel7Count = avgEggsGenerated * level7Prob;
    
    console.log(`Level 7 蛋出现概率: ${(level7Prob * 100).toFixed(2)}%`);
    console.log(`预期生成 Level 7 蛋数量: ${expectedLevel7Count.toFixed(2)}`);
    
    // 相邻合成概率估算
    // 这是一个简化模型，实际情况更复杂
    let winProbability = 0;
    
    if (expectedLevel7Count >= 6) {
        winProbability = 0.8; // 高概率获胜
    } else if (expectedLevel7Count >= 4) {
        winProbability = 0.4; // 中等概率
    } else if (expectedLevel7Count >= 3) {
        winProbability = 0.15; // 较低概率
    } else if (expectedLevel7Count >= 2) {
        winProbability = 0.05; // 很低概率
    } else {
        winProbability = 0.01; // 几乎不可能
    }
    
    return winProbability;
}

/**
 * 寻找达到目标胜率的 cardBoosts 配置
 */
function findOptimalCardBoosts(targetWinRate = 0.1) {
    console.log(`\n=== 寻找 ${(targetWinRate * 100)}% 胜率的最优配置 ===`);
    
    // 保持其他级别的相对比例，只调整 Level 7 的权重
    const baseConfig = {
        1: 0.5,
        2: 0.5,
        3: 0.5,
        4: 0.4,
        5: 0.3,
        6: 0.2,
        7: 0.1  // 这个会被调整
    };
    
    let bestConfig = null;
    let bestDiff = Infinity;
    
    // 尝试不同的 Level 7 权重（更细粒度）
    for (let level7Weight = 0.02; level7Weight <= 0.6; level7Weight += 0.02) {
        const testConfig = { ...baseConfig, 7: level7Weight };
        const { probabilities } = calculateProbabilities(testConfig);
        const estimatedWinRate = preciseWinRateCalculation(probabilities);
        
        const diff = Math.abs(estimatedWinRate - targetWinRate);
        if (diff < bestDiff) {
            bestDiff = diff;
            bestConfig = testConfig;
        }
        
        if (level7Weight <= 0.3 || level7Weight % 0.1 < 0.02) {
            console.log(`Level 7 权重: ${level7Weight.toFixed(2)}, 预估胜率: ${(estimatedWinRate * 100).toFixed(1)}%`);
        }
    }
    
    if (bestConfig) {
        const { probabilities } = calculateProbabilities(bestConfig);
        const finalWinRate = preciseWinRateCalculation(probabilities);
        console.log(`\n📊 找到最优配置 (胜率 ≈ ${(finalWinRate * 100).toFixed(1)}%):`);
        console.log(JSON.stringify(bestConfig, null, 2));
        return bestConfig;
    }
    
    return null;
}

/**
 * 更精确的胜率计算（考虑地图大小和实际游戏难度）
 */
function preciseWinRateCalculation(probabilities) {
    const level7Prob = probabilities[7];
    
    // 更现实的游戏参数
    const mapSize = 36; // 6x6 网格  
    const avgMovesPerGame = 50; // 平均每局移动次数
    const newEggsPerMove = 3; // 每次移动后生成3个新蛋
    const totalEggsInGame = avgMovesPerGame * newEggsPerMove;
    
    // 期望的 Level 7 蛋数量
    const expectedLevel7s = totalEggsInGame * level7Prob;
    
    console.log(`\n=== 精确胜率计算 ===`);
    console.log(`平均游戏移动数: ${avgMovesPerGame}`);
    console.log(`总生成蛋数: ${totalEggsInGame}`);
    console.log(`预期 Level 7 蛋数: ${expectedLevel7s.toFixed(2)}`);
    
    // 胜利条件：需要至少3个Level 7蛋能够相邻并合成
    // 考虑以下因素：
    // 1. Level 7蛋的空间分布
    // 2. 地图填充度对相邻概率的影响  
    // 3. 游戏中其他蛋的干扰
    
    let winProbability = 0;
    
    if (expectedLevel7s < 1) {
        winProbability = 0;
    } else if (expectedLevel7s < 2) {
        winProbability = 0.01; // 几乎不可能
    } else if (expectedLevel7s < 3) {
        winProbability = 0.03; // 很低
    } else if (expectedLevel7s < 4) {
        winProbability = 0.08; // 较低
    } else if (expectedLevel7s < 5) {
        winProbability = 0.15; // 中等偏低
    } else if (expectedLevel7s < 6) {
        winProbability = 0.25; // 中等
    } else if (expectedLevel7s < 8) {
        winProbability = 0.40; // 较高
    } else {
        winProbability = 0.60; // 高概率
    }
    
    // 考虑地图填充对游戏难度的影响
    const fillRate = Math.min(totalEggsInGame / (mapSize * 2), 1);
    const difficultyMultiplier = 1 - (fillRate * 0.3); // 填充度越高，难度越大
    
    winProbability *= difficultyMultiplier;
    
    console.log(`地图填充率: ${(fillRate * 100).toFixed(1)}%`);
    console.log(`难度调整系数: ${difficultyMultiplier.toFixed(2)}`);
    
    return Math.min(winProbability, 0.8); // 最高胜率限制在80%
}

// === 执行分析 ===
console.log('=== 当前配置分析 ===');
const current = calculateProbabilities(currentCardBoosts);
console.log('当前各级别概率:');
for (const [level, prob] of Object.entries(current.probabilities)) {
    console.log(`Level ${level}: ${(prob * 100).toFixed(2)}%`);
}

const currentWinRate = preciseWinRateCalculation(current.probabilities);
console.log(`\n当前预估胜率: ${(currentWinRate * 100).toFixed(1)}%`);

// 寻找最优配置
const optimalConfig = findOptimalCardBoosts(0.1);

if (optimalConfig) {
    console.log('\n=== 推荐配置验证 ===');
    const optimal = calculateProbabilities(optimalConfig);
    const optimalWinRate = preciseWinRateCalculation(optimal.probabilities);
    console.log(`推荐配置胜率: ${(optimalWinRate * 100).toFixed(1)}%`);
}

// 导出配置供游戏使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateProbabilities,
        estimateWinRate,
        findOptimalCardBoosts,
        preciseWinRateCalculation,
        currentCardBoosts,
        optimalConfig
    };
}
