/**
 * 排行榜管理模块
 * 负责用户成就记录、排行榜数据管理
 */
class LeaderBoard {
    constructor() {
        // 排行榜数据存储键名
        this.STORAGE_KEY = 'gameLeaderBoard';
        
        // 排行榜数据缓存
        this.leaderboardData = new Map();
        
        console.log('🏆 LeaderBoard 排行榜模块初始化完成');
        
        // 加载排行榜数据
        this.loadLeaderboardData();
    }

    /**
     * 加载排行榜数据
     */
    loadLeaderboardData() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (data) {
                const parsedData = JSON.parse(data);
                
                // 转换为 Map 格式
                for (const [userId, userRecord] of Object.entries(parsedData)) {
                    this.leaderboardData.set(userId, userRecord);
                }
                
                console.log(`📊 排行榜数据加载完成，共 ${this.leaderboardData.size} 条记录`);
            } else {
                console.log('📊 首次使用，排行榜数据为空');
            }
        } catch (error) {
            console.error('❌ 排行榜数据加载失败:', error);
            this.leaderboardData = new Map();
        }
    }

    /**
     * 保存排行榜数据
     */
    saveLeaderboardData() {
        try {
            // 转换 Map 为普通对象
            const dataToSave = {};
            for (const [userId, userRecord] of this.leaderboardData.entries()) {
                dataToSave[userId] = userRecord;
            }
            
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));
            console.log('💾 排行榜数据保存成功');
            return true;
        } catch (error) {
            console.error('❌ 排行榜数据保存失败:', error);
            return false;
        }
    }

    /**
     * 从 GameServer 获取当前用户数据
     */
    getCurrentUserStats() {
        if (!window.GameServer) {
            console.error('❌ GameServer 未找到');
            return null;
        }

        try {
            // 获取用户状态
            const userStatus = window.GameServer.checkUserStatus('currentUser');
            if (!userStatus) {
                console.error('❌ 用户状态获取失败');
                return null;
            }

            // 获取分数系统数据
            const scoreSystem = window.GameServer.scoreSystem;
            
            return {
                userId: userStatus.userId || 'currentUser',
                currentCoins: scoreSystem ? scoreSystem.currentScore : 0,
                currentEggLevel: userStatus.maxUnlockedEggType || 0,
                userStatus: userStatus
            };
        } catch (error) {
            console.error('❌ 获取用户数据失败:', error);
            return null;
        }
    }

    /**
     * 更新用户记录
     * @param {string} userId - 用户ID，可选，默认使用当前用户
     */
    updateUserRecord(userId = null) {
        console.log('🔄 更新用户排行榜记录...');

        // 获取当前用户数据
        const currentStats = this.getCurrentUserStats();
        if (!currentStats) {
            console.error('❌ 无法获取用户数据，更新失败');
            return false;
        }

        const targetUserId = userId || currentStats.userId;
        const { currentCoins, currentEggLevel } = currentStats;

        console.log(`📊 当前用户数据 - ID: ${targetUserId}, 金币: ${currentCoins}, 蛋等级: ${currentEggLevel}`);

        // 获取历史记录
        const existingRecord = this.leaderboardData.get(targetUserId);
        
        let needUpdate = false;
        let newRecord = {
            userId: targetUserId,
            maxCoins: currentCoins,
            maxEggLevel: currentEggLevel,
            lastUpdateTime: Date.now(),
            userName: `用户${targetUserId.slice(-6)}` // 简单的用户名生成
        };

        if (existingRecord) {
            // 检查是否需要更新金币记录
            if (currentCoins > existingRecord.maxCoins) {
                console.log(`🪙 金币新记录: ${existingRecord.maxCoins} -> ${currentCoins}`);
                needUpdate = true;
            } else {
                newRecord.maxCoins = existingRecord.maxCoins;
            }

            // 检查是否需要更新蛋等级记录
            if (currentEggLevel > existingRecord.maxEggLevel) {
                console.log(`🥚 蛋等级新记录: ${existingRecord.maxEggLevel} -> ${currentEggLevel}`);
                needUpdate = true;
            } else {
                newRecord.maxEggLevel = existingRecord.maxEggLevel;
            }

            // 保留用户名
            newRecord.userName = existingRecord.userName || newRecord.userName;
        } else {
            // 新用户，直接记录
            console.log(`👤 新用户记录: ${targetUserId}`);
            needUpdate = true;
        }

        if (needUpdate) {
            // 更新记录
            this.leaderboardData.set(targetUserId, newRecord);
            this.saveLeaderboardData();
            
            console.log(`✅ 用户 ${targetUserId} 排行榜记录已更新`);
            console.log(`🏆 最高金币: ${newRecord.maxCoins}, 最高蛋等级: ${newRecord.maxEggLevel}`);
            
            return true;
        } else {
            console.log(`📊 用户 ${targetUserId} 无新记录，无需更新`);
            return false;
        }
    }

    /**
     * 获取排行榜（按金币排序）
     * @param {number} limit - 返回条数限制，默认10条
     * @returns {Array} 排行榜数组
     */
    getLeaderboard(limit = 10) {
        console.log('🏆 获取排行榜数据...');

        // 转换为数组并按金币排序
        const leaderboard = Array.from(this.leaderboardData.values())
            .sort((a, b) => {
                // 首先按金币排序
                if (b.maxCoins !== a.maxCoins) {
                    return b.maxCoins - a.maxCoins;
                }
                // 金币相同时按蛋等级排序
                return b.maxEggLevel - a.maxEggLevel;
            })
            .slice(0, limit)
            .map((record, index) => ({
                rank: index + 1,
                ...record
            }));

        console.log(`📊 排行榜获取完成，共 ${leaderboard.length} 条记录`);
        return leaderboard;
    }

    /**
     * 获取用户排名
     * @param {string} userId - 用户ID
     * @returns {Object} 用户排名信息
     */
    getUserRank(userId) {
        console.log(`🔍 查询用户 ${userId} 的排名...`);

        const userRecord = this.leaderboardData.get(userId);
        if (!userRecord) {
            console.log(`❌ 用户 ${userId} 无排行榜记录`);
            return null;
        }

        // 获取完整排行榜
        const fullLeaderboard = this.getLeaderboard(1000); // 获取所有记录
        
        // 查找用户排名
        const userRankInfo = fullLeaderboard.find(record => record.userId === userId);
        
        if (userRankInfo) {
            console.log(`🏆 用户 ${userId} 排名: ${userRankInfo.rank}`);
            return {
                rank: userRankInfo.rank,
                totalUsers: fullLeaderboard.length,
                userRecord: userRecord
            };
        } else {
            console.log(`❌ 用户 ${userId} 排名查询失败`);
            return null;
        }
    }

    /**
     * 获取排行榜统计信息
     */
    getLeaderboardStats() {
        const totalUsers = this.leaderboardData.size;
        const allRecords = Array.from(this.leaderboardData.values());
        
        const maxCoins = Math.max(...allRecords.map(r => r.maxCoins), 0);
        const maxEggLevel = Math.max(...allRecords.map(r => r.maxEggLevel), 0);
        const avgCoins = totalUsers > 0 ? 
            Math.round(allRecords.reduce((sum, r) => sum + r.maxCoins, 0) / totalUsers) : 0;

        return {
            totalUsers,
            maxCoins,
            maxEggLevel,
            avgCoins
        };
    }

    /**
     * 清空排行榜数据（调试用）
     */
    clearLeaderboard() {
        console.log('🗑️ 清空排行榜数据...');
        this.leaderboardData.clear();
        localStorage.removeItem(this.STORAGE_KEY);
        console.log('✅ 排行榜数据已清空');
    }

    /**
     * 打印排行榜数据（调试用）
     */
    printLeaderboard() {
        console.log('🏆 当前排行榜数据:');
        const leaderboard = this.getLeaderboard(10);
        
        leaderboard.forEach(record => {
            console.log(`  ${record.rank}. ${record.userName} - 金币: ${record.maxCoins}, 蛋等级: ${record.maxEggLevel}`);
        });
        
        const stats = this.getLeaderboardStats();
        console.log(`📊 统计: 总用户 ${stats.totalUsers}, 最高金币 ${stats.maxCoins}, 最高蛋等级 ${stats.maxEggLevel}`);
    }
}

// 创建全局 LeaderBoard 实例
window.LeaderBoard = new LeaderBoard();

console.log('🏆 LeaderBoard 模块加载完成');