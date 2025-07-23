/**
 * 游戏服务器 - 模拟后端服务
 * 负责游戏数据管理、用户数据存储、算法计算等
 */
class GameServer {
    constructor() {
        // 服务器状态
        this.isInitialized = false;
        this.serverVersion = '1.0.0';

        // 用户数据缓存
        this.userDataCache = new Map();

        // 新用户引导数据
        this.newUserGuideData = {
            lv0: {
                1: {
                    eggSeat: [0, 44, 45],
                    eggType: [0, 0, 0],
                    pointSeat: [0, 43],
                },
                2: {
                    eggSeat: [14, 3, 18],
                    eggType: [1, 4, 3],
                    pointSeat: [3, 33],
                },
                3: {
                    eggSeat: [3, 32, 17],
                    eggType: [3, 2, 2],
                    pointSeat: [32, 23],
                },
                4: {
                    eggSeat: [16, 26, 30],
                    eggType: [2, 2, 3],
                    pointSeat: [11, 24],
                },
                5: {
                    eggSeat: [8, 10, 22],
                    eggType: [2, 2, 3, 1],
                    pointSeat: [-1],
                },
                6: {
                    eggSeat: [2, 4, 23],
                    eggType: [4, 2, 3],
                    pointSeat: [-1],
                },
                7: {
                    eggSeat: [1, 12, 16],
                    eggType: [4, 3, 1],
                    pointSeat: [-1],
                }
            }
        };

        console.log('🖥️ GameServer 初始化完成');
    }

    /**
     * 初始化服务器
     */
    init() {
        console.log('🚀 GameServer 启动中...');

        // 加载用户数据缓存
        this.loadUserDataCache();

        this.isInitialized = true;
        console.log('✅ GameServer 启动完成');

        return {
            success: true,
            version: this.serverVersion,
            message: 'GameServer initialized successfully'
        };
    }

    /**
     * 加载用户数据缓存
     */
    loadUserDataCache() {
        try {
            const userData = localStorage.getItem('gameUserData');
            if (userData) {
                const parsedData = JSON.parse(userData);
                this.userDataCache.set('currentUser', parsedData);
                console.log('📂 用户数据缓存加载完成');
            }
        } catch (error) {
            console.error('❌ 用户数据缓存加载失败:', error);
        }
    }

    /**
     * 检查用户状态
     * @param {string} userId - 用户ID（可选，默认为当前用户）
     * @returns {Object} 用户状态信息
     */
    checkUserStatus(userId = 'currentUser') {
        console.log('🔍 检查用户状态...');

        const userData = this.userDataCache.get(userId);

        if (!userData) {
            // 新用户
            const newUserData = {
                userId: userId,
                isNewUser: true,
                currentLevel: 0,
                currentStep: 1,
                createTime: Date.now(),
                lastPlayTime: Date.now(),
                totalPlayTime: 0,
                completedSteps: []
            };

            // 保存新用户数据
            this.saveUserData(userId, newUserData);

            console.log('👶 检测到新用户:', newUserData);
            return newUserData;
        } else {
            // 老用户
            const existingUserData = {
                ...userData,
                isNewUser: false,
                lastPlayTime: Date.now()
            };

            // 更新最后游戏时间
            this.saveUserData(userId, existingUserData);

            console.log(`👤 老用户登录 - 等级: ${existingUserData.currentLevel}, 步骤: ${existingUserData.currentStep}`);
            return existingUserData;
        }
    }

    /**
     * 获取游戏数据
     * @param {string} userId - 用户ID
     * @param {number} level - 关卡等级
     * @param {number} step - 步骤
     * @returns {Object} 游戏数据
     */
    getGameData(userStatus = null, userId = 'currentUser', level = null, step = null) {
        console.log('📊 获取游戏数据...');

        // const userStatus = this.checkUserStatus(userId);

        // 使用传入的参数或用户当前进度
        const currentLevel = level !== null ? level : userStatus.currentLevel;
        const currentStep = step !== null ? step : userStatus.currentStep;

        if (userStatus.isNewUser) {
            return this.getNewUserGuideData(currentLevel, currentStep);
        } else {
            return this.getAlgorithmData(currentLevel, currentStep, userStatus);
        }
    }

    /**
     * 获取新用户引导数据
     * @param {number} level - 关卡等级
     * @param {number} step - 步骤
     * @returns {Object} 新用户引导数据
     */
    getNewUserGuideData(level, step) {
        console.log(`📖 获取新用户引导数据 - 等级: ${level}, 步骤: ${step}`);

        const levelKey = `lv${level}`;
        const stepData = this.newUserGuideData[levelKey]?.[step];

        if (stepData) {
            console.log('📚 新用户引导数据:', stepData);
            return {
                success: true,
                isNewUser: true,
                level: level,
                step: step,
                data: stepData,
                message: 'New user guide data retrieved successfully'
            };
        } else {
            console.warn(`⚠️ 未找到新用户引导数据 - 等级: ${level}, 步骤: ${step}`);
            return {
                success: false,
                isNewUser: true,
                level: level,
                step: step,
                data: null,
                message: 'New user guide data not found'
            };
        }
    }

    /**
     * 获取算法生成数据（暂未实现）
     * @param {number} level - 关卡等级
     * @param {number} step - 步骤
     * @param {Object} userStatus - 用户状态
     * @returns {Object} 算法生成的游戏数据
     */
    getAlgorithmData(level, step, userStatus) {
        console.log(`🎲 获取算法生成数据 - 等级: ${level}, 步骤: ${step}`);

        // TODO: 根据算法计算出的数据，此时不进行处理，后续再处理
        const algorithmData = {
            eggSeat: this.generateRandomEggSeats(level),
            eggType: this.generateRandomEggTypes(level),
            pointSeat: this.generateRandomPointSeats(level)
        };

        return {
            success: true,
            isNewUser: false,
            level: level,
            step: step,
            data: algorithmData,
            userStatus: userStatus,
            message: 'Algorithm data generated successfully'
        };
    }

    /**
     * 生成随机蛋位置（临时算法）
     */
    generateRandomEggSeats(level) {
        const baseCount = 3 + Math.floor(level / 2);
        const seats = [];
        const usedSeats = new Set();

        while (seats.length < baseCount && seats.length < 48) {
            const randomSeat = Math.floor(Math.random() * 48);
            if (!usedSeats.has(randomSeat)) {
                seats.push(randomSeat);
                usedSeats.add(randomSeat);
            }
        }

        return seats.sort((a, b) => a - b);
    }

    /**
     * 生成随机蛋类型（临时算法）
     */
    generateRandomEggTypes(level) {
        const typeCount = Math.min(4, 2 + Math.floor(level / 3));
        const types = [];

        for (let i = 0; i < this.generateRandomEggSeats(level).length; i++) {
            types.push(Math.floor(Math.random() * typeCount) + 1);
        }

        return types;
    }

    /**
     * 生成随机指示位置（临时算法）
     */
    generateRandomPointSeats(level) {
        if (level < 3) {
            // 前几关有指示
            const pointCount = Math.max(1, 3 - level);
            const points = [];

            for (let i = 0; i < pointCount; i++) {
                points.push(Math.floor(Math.random() * 48));
            }

            return points;
        } else {
            // 后面的关卡没有指示
            return [-1];
        }
    }

    /**
     * 保存用户数据
     * @param {string} userId - 用户ID
     * @param {Object} userData - 用户数据
     */
    saveUserData(userId, userData) {
        try {
            // 更新缓存
            this.userDataCache.set(userId, userData);

            // 保存到本地存储
            localStorage.setItem('gameUserData', JSON.stringify(userData));

            console.log('💾 用户数据已保存:', userData);
            return { success: true, message: 'User data saved successfully' };
        } catch (error) {
            console.error('❌ 用户数据保存失败:', error);
            return { success: false, message: 'Failed to save user data', error: error.message };
        }
    }

    /**
     * 更新用户进度
     * @param {string} userId - 用户ID
     * @param {number} level - 新等级
     * @param {number} step - 新步骤
     */
    updateUserProgress(userId = 'currentUser', level, step) {
        console.log(`📈 更新用户进度 - 等级: ${level}, 步骤: ${step}`);

        const userData = this.userDataCache.get(userId);
        if (userData) {
            userData.currentLevel = level;
            userData.currentStep = step;
            userData.lastPlayTime = Date.now();

            // 记录完成的步骤
            const stepKey = `${level}-${step}`;
            if (!userData.completedSteps.includes(stepKey)) {
                userData.completedSteps.push(stepKey);
            }

            return this.saveUserData(userId, userData);
        } else {
            console.error('❌ 用户数据不存在');
            return { success: false, message: 'User data not found' };
        }
    }

    /**
     * 获取服务器状态
     */
    getServerStatus() {
        return {
            isInitialized: this.isInitialized,
            version: this.serverVersion,
            userCount: this.userDataCache.size,
            uptime: Date.now()
        };
    }
}

// 创建全局 GameServer 实例
window.GameServer = new GameServer();