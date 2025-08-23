import utile from '../utile.js';
/**
 * 游戏服务器 - 模拟后端服务
 * 负责游戏数据管理、用户数据存储、算法计算等
 */
class GameServer {
    constructor() {
        // 服务器状态
        this.isInitialized = false;
        this.serverVersion = '1.0.0';

        // 🔥 登录配置
        this.loginConfig = {
            forceLoginType: 'null', // 强制登录类型：'wechat', 'google', 'local', 'guest', null(自动检测)
            enableMockLogin: false, // 是否启用模拟登录
            mockLoginDelay: 5000, // 模拟登录延迟时间(毫秒)
            mockUserType: 'old', // 模拟用户类型：'new', 'old', 'random'
        };

        // 分数系统
        this.scoreSystem = {
            currentScore: 0,
            totalScore: 0,
            sessionScore: 0,
            bestScore: 0,
            synthesisHistory: [] // 合成历史记录
        };

        // 用户数据缓存
        this.userDataCache = new Map();

        this.difficulty = 4; //难度

        this.maxUnlockedEggType = 1;
        // 新用户引导数据
        this.newUserGuideData = {
            lv0: [
                { eggSeat: [0, 10, 11], eggType: [1, 1, 1], pointSeat: [0, 9] },
                { eggSeat: [14, 3, 18], eggType: [1, 2, 2], pointSeat: [18, 15] },

                { eggSeat: [8, 32, 17], eggType: [2, 3, 3], pointSeat: [32, 16] },
                { eggSeat: [18, 26, 30], eggType: [4, 2, 3], pointSeat: [-1] },
                // { eggSeat: [9, 10, 22], eggType: [4, 4, 3], pointSeat: [-1] },
            ]
        };

        this.currentUserStatus = null; // 未初始化
        this.currentGameStatus = null;
        this.guidestaute = {
            currentLevel: 0, // 当前等级
            currentStep: 0, // 当前步骤
            maxUnlockedEggType: 1, // 最大解锁蛋类型
            totalScore: 0, // 总分数
            completedSteps: [] // 完成的步骤列表
        }

        // 寻路系统
        this.pathfindingGrid = null;

        // 地图系统
        this.mapConfig = {
            rows: 6,
            cols: 6,
            cellWidth: 150,
            cellHeight: 150,
            totalCells: 36,
            // 前端渲染需要的配置
            width: 900,           // gamebox 宽度
            height: 900,         // gamebox 高度
            offsetX: 0,           // 棋盘在 gamebox 中的 X 偏移
            offsetY: 0            // 棋盘在 gamebox 中的 Y 偏移
        };

        // 地图状态 - 全局唯一的地图数据
        this.mapState = {
            cells: {},           // 格子状态 {cellId: {isEmpty: boolean, hasEgg: boolean, eggType: number, piece: null}}
            occupiedCells: new Set(), // 被占用的格子ID集合
            emptyCells: new Set(),    // 空闲格子ID集合
            isInitialized: false
        };

        // 选择状态管理
        this.selectionState = {
            selectedEgg: null,    // 当前选中的蛋 {cellId, eggType}
            isSelected: false     // 是否有选中状态
        };

        console.log('🖥️ GameServer 初始化完成');

        // 延迟初始化地图系统，等待 A* 模块加载

        // 生成或加载本地随机混淆 key，优先从 sessionStorage 读取以便同一 tab 内重载时可解密
        try {
            const storageKeyName = 'GameServer_crypto_key_v1';
            let existingKey = null;
            try { existingKey = sessionStorage.getItem(storageKeyName); } catch (e) { existingKey = null; }
            if (existingKey) {
                this._localCryptoKey = existingKey;
            } else {
                const rand = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(36) + Date.now().toString(36);
                this._localCryptoKey = rand;
                try { sessionStorage.setItem(storageKeyName, this._localCryptoKey); } catch (e) { /* ignore */ }
            }
        } catch (e) {
            this._localCryptoKey = 'k_default';
        }

        // 启动时如果 localStorage 中存在明文敏感字段（cardBoosts/scoreSystem/eggs/maxUnlockedEggType），立即迁移为加密字段并删除明文
        // try {
        //     const existing = this.loadGameData();
        //     if (existing && (existing.cardBoosts || existing.scoreSystem || existing.eggs || existing.maxUnlockedEggType)) {
        //         try { this._persistGameData(existing); } catch (e) {}
        //     }
        // } catch (e) {}

        this.initializeMapSystem();

    }

    /**
     * 将游戏数据写入 localStorage，自动对 cardBoosts 做混淆并删除明文字段
     * @param {Object} obj - 要持久化的 gameData 对象
     */
    _persistGameData(obj) {
        try {
            if (!obj) return;
            // 保存为明文（取消混淆/加密逻辑）
            // 深拷贝以免修改原对象
            const copy = JSON.parse(JSON.stringify(obj));
            if (!copy.saveTime) copy.saveTime = Date.now();
            try {
                localStorage.setItem('GameData', JSON.stringify(copy));
            } catch (e) {
                // 在某些环境 localStorage 可能失败，尝试用备用键
                try { localStorage.setItem('GameData_backup', JSON.stringify(copy)); } catch (e) { }
            }
        } catch (e) {
            console.error('❌ _persistGameData failed:', e);
        }
    }

    /**
     * 初始化地图系统（棋盘 + 寻路）
     */
    async initializeMapSystem() {
        console.log('🗺️ 初始化地图系统...');

        try {
            // 检查依赖模块
            this.checkDependencies();

            // 1. 初始化棋盘系统
            await this.initChessboard();

            // 2. 初始化寻路系统
            await this.initPathfinding();

            // 3. 标记初始化完成
            this.mapState.isInitialized = true;

            console.log('✅ 地图系统初始化完成');
        } catch (error) {
            console.error('❌ 地图系统初始化失败:', error);

            // 设置重试机制
            console.log('🔄 5秒后重试初始化...');
            setTimeout(() => {
                this.initializeMapSystem();
            }, 5000);
        }
    }

    /**
     * 检查依赖模块
     */
    checkDependencies() {
        console.log('🔍 检查依赖模块...');

        const dependencies = [
            { name: 'window.OvoAstar4', value: window.OvoAstar4 },
            { name: 'window.OvoAstar8', value: window.OvoAstar8 },
            { name: 'window.graphType', value: window.graphType }
        ];

        dependencies.forEach(dep => {
            if (dep.value) {
                console.log(`✅ ${dep.name} 已加载`);
            } else {
                console.warn(`⚠️ ${dep.name} 未加载`);
            }
        });
    }

    /**
     * 初始化棋盘系统
     */
    async initChessboard() {
        console.log('♟️ 初始化棋盘系统...');

        const { rows, cols, cellWidth, cellHeight } = this.mapConfig;

        // 初始化所有格子状态
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const cellId = this.getCellId(row, col);

                // 计算格子的像素位置
                const x = col * cellWidth;
                const y = row * cellHeight;
                const centerX = x + cellWidth / 2;
                const centerY = y + cellHeight / 2;

                // 初始化格子数据
                this.mapState.cells[cellId] = {
                    id: cellId,
                    row: row,
                    col: col,
                    x: x,
                    y: y,
                    centerX: centerX,
                    centerY: centerY,
                    isEmpty: true,
                    hasEgg: false,
                    eggType: null,
                    piece: null,
                    walkable: true,
                    occupied: false
                };

                // 添加到空闲格子集合
                this.mapState.emptyCells.add(cellId);
            }
        }

        console.log(`✅ 棋盘系统初始化完成: ${rows}x${cols} = ${this.mapConfig.totalCells} 个格子`);
    }

    /**
     * 初始化寻路系统
     */
    async initPathfinding() {
        console.log('🗺️ 初始化寻路系统...');

        try {
            const { rows, cols, cellWidth } = this.mapConfig;

            // 创建网格节点数组（用于 A* 算法）
            const nodes = [];
            for (let i = 0; i < rows; i++) {
                nodes[i] = [];
                for (let j = 0; j < cols; j++) {
                    const cellId = this.getCellId(i, j);
                    const cellData = this.mapState.cells[cellId];

                    nodes[i][j] = {
                        id: cellId,
                        row: i,
                        col: j,
                        x: cellData.x,
                        y: cellData.y,
                        centerX: cellData.centerX,
                        centerY: cellData.centerY,
                        type: cellData.hasEgg ? (window.graphType ? window.graphType.wall : 1) : (window.graphType ? window.graphType.open : 0),
                        walkable: !cellData.hasEgg,
                        occupied: cellData.hasEgg
                    };
                }
            }

            // 等待 A* 寻路实例加载
            const astar = await this.waitForAstarModule(4); // 使用4方向寻路

            // 初始化 A* 寻路
            astar.init(rows, cols, cellWidth, nodes);

            // 保存寻路数据
            this.pathfindingGrid = {
                nodes: nodes,
                rows: rows,
                cols: cols,
                cellSize: cellWidth,
                pathType: 4,
                astar: astar
            };

            console.log('✅ 寻路系统初始化完成');
        } catch (error) {
            console.error('❌ 寻路系统初始化失败:', error);
            throw error;
        }
    }

    /**
     * 获取格子ID（行列转换为ID）
     * @param {number} row - 行
     * @param {number} col - 列
     * @returns {number} 格子ID
     */
    getCellId(row, col) {
        return row * this.mapConfig.cols + col;
    }

    /**
     * 获取行列坐标（ID转换为行列）
     * @param {number} cellId - 格子ID
     * @returns {Object} {row, col}
     */
    getRowCol(cellId) {
        const row = Math.floor(cellId / this.mapConfig.cols);
        const col = cellId % this.mapConfig.cols;
        return { row, col };
    }

    /**
     * 初始化服务器
     */
    async init() {
    console.log('🚀 GameServer 启动中...');
    console.log(`🕒 GameServer.init() start @ ${new Date().toISOString()}`);
        // 🔥 使用新的用户数据初始化流程
        this.currentUserStatus = await this.initializeUserData();

        this.isInitialized = true;
        console.log('✅ GameServer 启动完成');
    console.log(`🕒 GameServer.init() end @ ${new Date().toISOString()}`);

        return {
            success: true,
            version: this.serverVersion,
            message: 'GameServer initialized successfully'
        };
    }

    /**
     * 用户数据初始化
     */
    async initializeUserData() {
        console.log('👤 开始用户数据初始化...');

        // 把 loginType 提升到外层作用域，以便 catch 中也可访问
        let loginType = null;
        try {
            // 1. 检测登录方式
            loginType = this.detectLoginType();
            console.log(`🔍 检测到登录方式: ${loginType}`);

            let isNewUser = null
            // 2. 🔥 修正：优先加载本地用户数据
            let userData = this.loadUserDataCache();

            // 3. 🔥 修正：如果没有本地数据，则通过登录方式获取
            if (!userData) {
                console.log('📱 没有本地用户数据，通过登录方式获取...');
                userData = await this.loadUserDataByLoginType(loginType);
                isNewUser = true;
            } else {
                console.log('💾 找到本地用户数据，使用本地数据');
                // 更新最后登录时间
                isNewUser = userData.isNewUser
                userData.lastLoginTime = Date.now();
            }

            // 如果是新用户默认是esay
            if (isNewUser) {
                this.difficulty = this.getDifficultyLevel('easy')
            }

            // 6. 合并最终用户数据
            const finalUserData = {
                // 用户身份信息（优先使用登录获取的数据）
                ...userData,

                // 游戏状态标记
                isNewUser: isNewUser,

                // 更新时间
                lastLoginTime: Date.now()
            };

            // 8. 保存用户身份数据（始终保存）
            this.saveUserData('currentUser', finalUserData);
            console.log(`👤 用户初始化完成: ${isNewUser ? '新用户(需要引导)' : '老用户(恢复数据)'}`);

            // 🔥 初始化 cardBoosts（每次启动都使用代码默认值，不从缓存读取也不保存到缓存）
            this.cardBoosts = {
                1: 0.5, // 灰
                2: 0.5, // 绿
                3: 0.5, // 蓝
                4: 0.4, // 紫
                5: 0.3, // 红
                6: 0.2, // 黄
                7: 0.08 // 橙 - 调整为0.08以达到约10%胜率
            };
            
            // 注释掉持久化代码，确保每次启动都使用代码中的默认值
            // 📊 胜率分析: Level 7权重=0.08 → 预期胜率≈10.5% (目标10%)
            // try {
            //     const gd = this.loadGameData() || {};
            //     gd.cardBoosts = this.cardBoosts;
            //     gd.saveTime = Date.now();
            //     this._persistGameData(gd);
            //     console.log('🔁 初始化并持久化默认 cardBoosts');
            // } catch (e) { }
            
            console.log('🔁 使用代码默认 cardBoosts 配置 (不从缓存读取)');

            return finalUserData;

        } catch (error) {
            console.error('❌ 用户数据初始化失败:', error);
            // 如果登录方式是 wechat，则将错误向上抛出，由前端决定是否降级为游客登录
            try {
                if (loginType === 'wechat') {
                    console.log('🔁 WeChat 登录失败，向上抛出错误以便前端处理（then/catch）');
                    throw error;
                }
            } catch (e) {
                // 如果 loginType 不可用或比较出错，继续退回游客
            }
            // 非 wechat 模式仍旧回退为游客
            return await this.createGuestUser();
        }
    }

    /**
     * 加载用户数据缓存
     */
    loadUserDataCache() {
        try {
            const userData = localStorage.getItem('UserData');
            if (userData) {
                const parsedData = JSON.parse(userData);
                this.userDataCache.set('currentUser', parsedData);
                console.log('📂 用户数据缓存加载完成');
                return parsedData; // 🔥 返回解析后的数据
            }
            return null; // 🔥 没有数据时返回null
        } catch (error) {
            console.error('❌ 用户数据缓存加载失败:', error);
            return null; // 🔥 出错时返回null
        }
    }

    /**
     * 🔥 新增：加载游戏数据
     */
    loadGameData() {
        try {
            const gameData = localStorage.getItem('GameData');
            if (gameData) {
                const parsedData = JSON.parse(gameData);
                // 已禁用混淆/加密功能：不再尝试解密或迁移旧的 encryptedXxx 字段
                /*
                // 尝试解密一组可能被混淆的字段
                const decryptFields = ['CardBoosts', 'ScoreSystem', 'MaxUnlockedEggType', 'Eggs'];
                let _didAnyDecrypt = false;
                try {
                    for (const f of decryptFields) {
                        const encName = 'encrypted' + f;
                        const plainName = f.charAt(0).toLowerCase() + f.slice(1);
                        if (parsedData[encName] && utile && typeof utile.xorDecryptToObject === 'function') {
                            try {
                                const dec = utile.xorDecryptToObject(parsedData[encName], this._localCryptoKey);
                                if (dec !== null && dec !== undefined) {
                                    parsedData[plainName] = dec;
                                    _didAnyDecrypt = true;
                                }
                            } catch (e) {
                                // ignore field-level decryption errors
                            }
                        }
                    }
                } catch (e) { }

                // 如果我们解密出了任意字段并且原始数据仍包含明文，立即覆写存储以移除明文
                try {
                    if (_didAnyDecrypt) {
                        this._persistGameData(parsedData);
                    }
                } catch (e) { }
                */
                console.log('📊 游戏数据加载成功');
                return parsedData;
            }
            console.log('📊 没有游戏数据（新用户）');
            return null;
        } catch (error) {
            console.error('❌ 游戏数据加载失败:', error);
            return null;
        }
    }


    /**
    * 获取游戏数据 - 统一入口
    * @param {Object} userStatus - 用户状态
    * @param {string} difficulty - 游戏难度 ('easy', 'normal', 'hard')
    * @returns {Object} 游戏数据
    */
    getGameData(userStatus = null, difficulty = 'normal') {
        console.log('📊 获取游戏数据...');

        if (userStatus.isNewUser) {
            return this.getNewUserGuideData();
        } else {
            return this.getAlgorithmData(userStatus);
        }
    }

    /**
     * 获取新用户引导数据
     * @returns {Object} 引导数据
     */
    getNewUserGuideData() {

        const userStatus = this.userDataCache.get('currentUser');
        if (!userStatus) {
            console.error('❌ 用户状态不存在');
            return {
                success: false,
                isNewUser: true,
                message: 'User status not found'
            };
        }


        // console.log(`📖 获取新用户引导数据 - 等级: ${this.guidestaute.currentLevel}, 步骤: ${this.guidestaute.currentStep}`);

        // 检查是否达到引导结束条件
        const guideSteps = this.newUserGuideData[`lv${this.guidestaute.currentLevel}`];
        if (!guideSteps || this.guidestaute >= guideSteps.length) {
            // console.log('🎉 ////////////////新手引导完成，退出引导模式');
            userStatus.isNewUser = false;
            this.saveUserData('currentUser', userStatus);
            return {
                success: false,
                isNewUser: false,
                message: 'New user guide completed'
            };
        }

        // 使用 this.guidestaute 获取引导数据
        const guideData = guideSteps[this.guidestaute.currentStep];
        if (guideData) {
            // console.log('📚 新用户引导数据:', guideData);

            // 同步引导数据到地图状态
            guideData.eggSeat.forEach((cellId, index) => {
                this.occupyPosition(cellId, guideData.eggType[index], null);
            });

            return {
                success: true,
                isNewUser: true,
                data: guideData,
                message: 'New user guide data retrieved successfully'
            };
        } else {
            userStatus.isNewUser = false;
            this.saveUserData('currentUser', userStatus);
            console.warn(`⚠️ 未找到新用户引导数据 - 等级: ${userStatus.currentLevel}, 步骤: ${this.guidestaute.currentStep}`);
            return {
                success: false,
                isNewUser: false,
                data: null,
                message: 'New user guide data not found'
            };
        }
    }

    getAlgorithmData(userStatus = null) {

        const gameData = this.loadGameData();

        // 检查是否超时
        if (gameData && gameData.saveTime) {
            const now = Date.now();
            const diff = now - gameData.saveTime;
            if (diff > 1 * 60 * 60 * 1000) { // 超过24小时
                // console.log('⏰ 超过24小时，重置蛋数据');
                this.resetGame(); // 重置数据
                // 重新加载重置后的数据
                return this.getAlgorithmData(userStatus);
            }
        }

        // 🔥 设置全局游戏状态
        this.currentGameStatus = {
            // 游戏进度数据
            eggs: gameData ? gameData.eggs : [],
            scoreSystem: gameData ? gameData.scoreSystem : this.scoreSystem,
            difficulty: gameData ? gameData.difficulty : this.difficulty,
            maxUnlockedEggType: gameData ? gameData.maxUnlockedEggType : 1,

            // 状态标记
            isInitialized: !!gameData,
            hasGameData: !!gameData,
            saveTime: gameData ? gameData.saveTime : Date.now(),

            // 游戏状态
            isPlaying: false,
            isPaused: false,
            isCompleted: false
        };

        // 检查是否有保存的游戏状态
        if (gameData && gameData.eggs && gameData.eggs.length > 0) {
            // console.log('🔄 恢复保存的游戏状态');

            // 🔥 恢复游戏状态到地图
            this.loadSavedGameState(gameData);

            // console.log('📊 恢复后的地图状态验证:');
            // const mapInfo = this.getMapStateInfo();
            // console.log(`  占用格子数: ${mapInfo.occupiedCells}`);
            // console.log(`  空闲格子数: ${mapInfo.emptyCells}`);
            // console.log(`  总分数: ${this.scoreSystem ? this.scoreSystem.totalScore : 'N/A'}`);


            return {
                success: true,
                isNewUser: false,
                difficulty: this.getDifficultyLevel(gameData.difficulty, true),
                scoreSystem: gameData.scoreSystem || this.scoreSystem,
                data: {
                    eggSeat: gameData.eggs.map(egg => egg.cellId),
                    eggType: gameData.eggs.map(egg => egg.eggType),
                    pointSeat: [] // 老用户不需要引导点
                },
                unlockData: {
                    maxUnlockedEggType: gameData.maxUnlockedEggType || 1
                },
                message: 'Restored saved game state'
            };
        }

        const eggCount = this.difficulty;
        // 随机生成数据
        const newEggs = this.generateRandomEggsFromMapState(eggCount);

        return {
            success: true,
            isNewUser: false,
            scoreSystem: this.scoreSystem,
            difficulty: this.getDifficultyLevel(this.difficulty, true),
            data: {
                eggSeat: newEggs.map(egg => egg.cellId),
                eggType: newEggs.map(egg => egg.eggType),
                pointSeat: [] // 老用户不需要引导点
            },

            unlockData: {
                maxUnlockedEggType: this.maxUnlockedEggType || 1
            },
            message: 'Algorithm data generated successfully'
        };

    }

    /**
     * 更新游戏难度
     * @param {string} difficulty - 新的难度 ('easy', 'normal', 'hard')
     */
    updateDifficulty(difficulty) {
        const difficultyLevel = this.getDifficultyLevel(difficulty);

        if (difficultyLevel) {
            this.difficulty = difficultyLevel;
            const gameData = this.loadGameData() || {};
            gameData.difficulty = this.difficulty;
            gameData.scoreSystem = this.scoreSystem;
            gameData.maxUnlockedEggType = this.maxUnlockedEggType;
            gameData.eggs = gameData.eggs || [];
            gameData.saveTime = Date.now();
            this._persistGameData(gameData);
            // console.log(`🎯 游戏难度已更新: ${difficulty} (${difficultyLevel} 个蛋)`);
        } else {
            console.warn(`⚠️ 无效的难度: ${difficulty}`);
        }
    }

    getDifficulty() {
        return this.getDifficultyLevel(this.difficulty, true);
    }
    /**
     * 获取难度对应的蛋数量
     * @param {string} difficulty - 难度等级
     * @returns {number} 蛋数量
     */
    getDifficultyLevel(input, returnKey = false) {
        const difficultyMap = {
            'easy': 3,
            'normal': 4,
            'hard': 5
        };

        if (returnKey) {
            // 传入的是数字，查找对应的 key
            for (const [key, value] of Object.entries(difficultyMap)) {
                if (value === input) return key;
            }
            return 'normal'; // 默认返回 normal
        } else {
            // 传入的是 key，查找对应的 value
            return difficultyMap[input] || 4; // 默认是 normal 难度
        }
    }
    /**
     * 重置游戏状态
     */
    resetGame() {
        // console.log('🔄 重置 GameServer 游戏状态...');

        try {
            // 1. 获取当前的 gameData
            const gameData = this.loadGameData();
            const bestScore = gameData?.scoreSystem?.bestScore || 0; // 保留最高分

            // 2. 清空地图状态中的所有蛋数据
            for (const cellId in this.mapState.cells) {
                const cell = this.mapState.cells[cellId];
                if (cell) {
                    cell.isEmpty = true;
                    cell.hasEgg = false;
                    cell.eggType = null;
                    cell.piece = null;
                    cell.occupied = false;
                }
            }

            // 3. 重置集合状态
            this.mapState.occupiedCells.clear();
            this.mapState.emptyCells.clear();

            // 重新填充空闲格子集合
            for (let cellId = 0; cellId < this.mapConfig.totalCells; cellId++) {
                this.mapState.emptyCells.add(cellId);
            }

            // 4. 清除选择状态
            this.clearSelection();

            // 5. 重置分数系统，但保留最高分
            if (this.scoreSystem) {
                this.scoreSystem.currentScore = 0;
                this.scoreSystem.totalScore = 0;
                this.scoreSystem.sessionScore = 0;
                this.scoreSystem.synthesisHistory = [];
                this.scoreSystem.bestScore = bestScore; // 恢复最高分
                // console.log(`💰 当前游戏分数系统已重置为0，但保留最高分: ${bestScore}`);
            }

            // 6. 重置用户解锁蛋等级为0（从蛋1重新开始解锁）
            this.maxUnlockedEggType = 1;
            this.difficulty = gameData ? gameData.difficulty : 4; // 恢复之前的难度

            // 7. 重置全局游戏状态
            if (this.currentGameStatus) {
                this.currentGameStatus.eggs = [];
                this.currentGameStatus.totalScore = 0;
                this.currentGameStatus.maxUnlockedEggType = 1;
                this.currentGameStatus.hasGameData = false;
                this.currentGameStatus.isInitialized = false;
                this.currentGameStatus.saveTime = null;
            }

            // 8. 保存新的 gameData，保留最高分
            const newGameData = {
                eggs: [],
                scoreSystem: this.scoreSystem,
                difficulty: this.difficulty,
                maxUnlockedEggType: this.maxUnlockedEggType,
                saveTime: Date.now()
            };
            this._persistGameData(newGameData);

            // console.log('✅ GameServer 游戏状态重置完成');
            // console.log(`📊 地图状态 - 空闲: ${this.mapState.emptyCells.size}, 占用: ${this.mapState.occupiedCells.size}`);

            return {
                success: true,
                message: 'Game state reset successfully'
            };

        } catch (error) {
            console.error('❌ GameServer 游戏状态重置失败:', error);
            return {
                success: false,
                message: error.message
            };
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

            localStorage.setItem('UserData', JSON.stringify(userData));
            // console.log('💾 用户身份数据已保存:', userData);

            return { success: true, message: 'User data saved successfully' };
        } catch (error) {
            console.error('❌ 用户数据保存失败:', error);
            return { success: false, message: 'Failed to save user data', error: error.message };
        }
    }

    /**
     * 初始化并返回 A* 寻路实例
     * @param {number} type - 寻路类型 (4: 四方向, 8: 八方向)
     * @returns {Object} A* 寻路实例
     */
    getAstar(type = 4) {
        // console.log(`🔍 尝试获取 A* 寻路实例，类型: ${type}`);

        if (type === 4) {
            if (window.OvoAstar4) {
                console.log('✅ 找到 OvoAstar4 模块');
                return window.OvoAstar4.getInstance();
            } else {
                console.warn('⚠️ OvoAstar4 模块未加载');
                return null;
            }
        }
        if (type === 8) {
            if (window.OvoAstar8) {
                console.log('✅ 找到 OvoAstar8 模块');
                return window.OvoAstar8.getInstance();
            } else {
                console.warn('⚠️ OvoAstar8 模块未加载');
                return null;
            }
        }
        console.warn(`⚠️ 不支持的寻路类型: ${type}`);
        return null;
    }

    /**
     * 等待 A* 模块加载完成
     * @param {number} type - 寻路类型
     * @param {number} maxWaitTime - 最大等待时间（毫秒）
     * @returns {Promise<Object>} A* 寻路实例
     */
    async waitForAstarModule(type = 4, maxWaitTime = 5000) {
        // console.log(`⏳ 等待 A* 模块加载，类型: ${type}`);

        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            const checkModule = () => {
                const astar = this.getAstar(type);
                if (astar) {
                    // console.log(`✅ A* 模块加载完成，耗时: ${Date.now() - startTime}ms`);
                    resolve(astar);
                    return;
                }

                // 检查是否超时
                if (Date.now() - startTime > maxWaitTime) {
                    console.error(`❌ A* 模块加载超时，类型: ${type}`);
                    reject(new Error(`A* 模块加载超时，类型: ${type}`));
                    return;
                }

                // 继续等待
                setTimeout(checkModule, 100);
            };

            checkModule();
        });
    }


    /**
     * 初始化游戏地图的寻路网格
     * @param {number} rows - 行数 (默认 6)
     * @param {number} cols - 列数 (默认 6)
     * @param {number} cellSize - 格子大小 (默认 150)
     * @param {number} pathType - 寻路类型 (4: 四方向, 8: 八方向)
     * @returns {Promise} 返回初始化的网格数据
     */
    initPathfindingGrid(rows = 6, cols = 6, cellSize = 150, pathType = 4) {
        // console.log(`🗺️ 初始化寻路网格: ${rows}x${cols}, 格子大小: ${cellSize}, 寻路类型: ${pathType}方向`);

        return new Promise((resolve, reject) => {
            try {
                // 创建网格节点数组
                const nodes = [];

                // 初始化网格数据
                for (let i = 0; i < rows; i++) {
                    nodes[i] = [];
                    for (let j = 0; j < cols; j++) {
                        const cellId = i * cols + j;
                        const cell = {
                            id: cellId,
                            row: i,
                            col: j,
                            x: j * cellSize,
                            y: i * cellSize,
                            centerX: j * cellSize + cellSize / 2,
                            centerY: i * cellSize + cellSize / 2,
                            type: window.graphType ? window.graphType.open : 0, // 默认为可通行
                            walkable: true,
                            occupied: false // 是否被占用
                        };
                        nodes[i][j] = cell;
                    }
                }

                // 获取 A* 寻路实例
                const astar = this.getAstar(pathType);
                if (!astar) {
                    throw new Error(`无法获取 A* 寻路实例，类型: ${pathType}`);
                }

                // 初始化 A* 寻路
                astar.init(rows, cols, cellSize, nodes);

                // 保存网格数据到服务器
                this.pathfindingGrid = {
                    nodes: nodes,
                    rows: rows,
                    cols: cols,
                    cellSize: cellSize,
                    pathType: pathType,
                    astar: astar
                };

                // console.log('✅ 寻路网格初始化完成');
                resolve({
                    nodes: nodes,
                    astar: astar,
                    config: {
                        rows: rows,
                        cols: cols,
                        cellSize: cellSize,
                        pathType: pathType
                    }
                });

            } catch (error) {
                console.error('❌ 寻路网格初始化失败:', error);
                reject(error);
            }
        });
    }

    /**
     * 更新网格中某个位置的可通行状态
     * @param {number} row - 行
     * @param {number} col - 列
     * @param {boolean} walkable - 是否可通行
     * @param {boolean} occupied - 是否被占用
     */
    updateGridCell(row, col, walkable = true, occupied = false) {
        if (!this.pathfindingGrid || !this.pathfindingGrid.nodes) {
            console.warn('⚠️ 寻路网格未初始化');
            return;
        }

        const { nodes, rows, cols } = this.pathfindingGrid;
        if (row >= 0 && row < rows && col >= 0 && col < cols) {
            const cell = nodes[row][col];
            cell.walkable = walkable;
            cell.occupied = occupied;
            cell.type = walkable ? (window.graphType ? window.graphType.open : 0) : (window.graphType ? window.graphType.wall : 1);

            // console.log(`🔄 更新网格 (${row}, ${col}): 可通行=${walkable}, 占用=${occupied}`);
        }
    }

    /**
     * 寻找路径
     * @param {Object} start - 起始点 {x, y} 或 {row, col}
     * @param {Object} end - 终点 {x, y} 或 {row, col}
     * @returns {Array} 路径数组
     */
    findPath(start, end) {
        if (!this.pathfindingGrid || !this.pathfindingGrid.astar) {
            console.warn('⚠️ 寻路系统未初始化');
            return [];
        }

        const { astar } = this.pathfindingGrid;

        // 转换坐标格式
        const startPos = start.row !== undefined ? start : this.positionToGrid(start.x, start.y);
        const endPos = end.row !== undefined ? end : this.positionToGrid(end.x, end.y);

        // console.log(`🔍 寻路: (${startPos.row}, ${startPos.col}) -> (${endPos.row}, ${endPos.col})`);

        const path = astar.search(
            { x: startPos.row, y: startPos.col },
            { x: endPos.row, y: endPos.col }
        );

        // console.log(`📍 找到路径，长度: ${path.length}`);
        return path;
    }

    /**
     * 将像素坐标转换为网格坐标
     * @param {number} x - 像素 X 坐标
     * @param {number} y - 像素 Y 坐标
     * @returns {Object} 网格坐标 {row, col}
     */
    positionToGrid(x, y) {
        if (!this.pathfindingGrid) {
            return { row: 0, col: 0 };
        }

        const { cellSize } = this.pathfindingGrid;
        return {
            row: Math.floor(y / cellSize),
            col: Math.floor(x / cellSize)
        };
    }



    /**
     * 验证蛋移动的有效性
     */
    validateEggMove(fromCellId, toCellId) {
        // 这里可以添加移动规则验证
        // 比如：是否有蛋、目标是否为空等
        return {
            code: 0,
            message: "移动有效"
        };
    }

    /**
     * 将格子ID转换为行列坐标
     */
    cellIdToPosition(cellId) {
        if (!this.pathfindingGrid) {
            return { row: 0, col: 0 };
        }

        const { cols } = this.pathfindingGrid;
        return {
            row: Math.floor(cellId / cols),
            col: cellId % cols
        };
    }


    /**
     * 查找合成匹配
     * @param {number} cellId - 检查的格子ID
     * @returns {Object} 匹配结果
     */
    findSynthesisMatches(cellId) {
        // 模拟合成逻辑 - 查找相邻的相同类型蛋
        const matches = [];
        const visited = new Set();
        const queue = [cellId];
        visited.add(cellId);

        // 假设的蛋类型（实际应该从游戏状态获取）
        const targetEggType = 0; // 这里应该从实际游戏状态获取

        // BFS 查找相邻的相同类型蛋
        while (queue.length > 0) {
            const currentCellId = queue.shift();
            matches.push(currentCellId);

            // 获取相邻格子
            const adjacentCells = this.getAdjacentCells(currentCellId);

            for (const adjCellId of adjacentCells) {
                if (!visited.has(adjCellId)) {
                    // 这里应该检查实际的蛋类型
                    // 暂时模拟：假设相邻格子有相同类型的蛋
                    const hasMatchingEgg = Math.random() > 0.7; // 模拟

                    if (hasMatchingEgg) {
                        visited.add(adjCellId);
                        queue.push(adjCellId);
                    }
                }
            }
        }

        return {
            matches: matches,
            eggType: targetEggType,
            newEggType: targetEggType + 1, // 合成后的新类型
            synthesisPosition: cellId, // 合成位置
            score: matches.length * 10 // 分数计算
        };
    }

    /**
     * 获取相邻格子
     * @param {number} cellId - 格子ID
     * @returns {Array} 相邻格子ID数组
     */
    getAdjacentCells(cellId) {
        if (!this.pathfindingGrid) {
            return [];
        }

        const { rows, cols } = this.pathfindingGrid;
        const pos = this.cellIdToPosition(cellId);
        const adjacent = [];

        // 四个方向：上、下、左、右
        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1]
        ];

        for (const [dRow, dCol] of directions) {
            const newRow = pos.row + dRow;
            const newCol = pos.col + dCol;

            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                const adjCellId = newRow * cols + newCol;
                adjacent.push(adjCellId);
            }
        }

        return adjacent;
    }


    /**
     * 检查蛋合成条件（类似 getMosterClearList）
     * @param {number} cellId - 检查的格子ID
     * @param {Object} gameState - 游戏状态
     * @returns {Promise<Object>} 合成检查结果
     */
    checkEggSynthesis(cellId, gameState) {
        // console.log(`🔍 检查格子 ${cellId} 的蛋合成条件`);

        return new Promise((resolve) => {
            const synthesisResult = this.findEggMatches(cellId, gameState);

            if (synthesisResult && synthesisResult.matches.length >= 3) {
                resolve({
                    code: 0,
                    matches: synthesisResult.matches,
                    eggType: synthesisResult.eggType,
                    newEggType: synthesisResult.newEggType,
                    synthesisPosition: synthesisResult.synthesisPosition,
                    score: synthesisResult.score,
                    message: "找到合成匹配"
                });
            } else {
                resolve({
                    code: -1,
                    message: "没有找到合成匹配"
                });
            }
        });
    }

    /**
     * 查找蛋匹配（用于合成检测）
     * @param {number} cellId - 检查的格子ID
     * @param {Object} gameState - 游戏状态
     * @returns {Object|null} 匹配结果
     */
    findEggMatches(cellId, gameState) {
        if (!gameState.cells[cellId] || !gameState.cells[cellId].hasEgg) {
            return null;
        }

        const targetEggType = gameState.cells[cellId].eggType;
        const matches = [];
        const visited = new Set();
        const queue = [cellId];
        visited.add(cellId);

        // BFS 查找相邻的相同类型蛋
        while (queue.length > 0) {
            const currentCellId = queue.shift();
            matches.push(currentCellId);

            // 获取相邻格子
            const adjacentCells = this.getAdjacentCells(currentCellId);

            for (const adjCellId of adjacentCells) {
                if (!visited.has(adjCellId) &&
                    gameState.cells[adjCellId] &&
                    gameState.cells[adjCellId].hasEgg &&
                    gameState.cells[adjCellId].eggType === targetEggType) {

                    visited.add(adjCellId);
                    queue.push(adjCellId);
                }
            }
        }

        if (matches.length >= 3) {
            const newEggType = Math.min(targetEggType + 1, 8);
            const score = this.calculateSynthesisScore(matches.length, targetEggType, newEggType);

            return {
                matches: matches,
                eggType: targetEggType,
                newEggType: newEggType,
                synthesisPosition: cellId,  // 合成位置就是目标位置
                score: score
            };
        }

        return null;
    }

    /**
     * 计算合成分数
     * @param {number} eggCount - 参与合成的蛋数量
     * @param {number} eggType - 原蛋类型（被合成的蛋等级）
     * @param {number} newEggType - 合成后的新蛋类型
     * @returns {Object} 分数详情
     */
    calculateSynthesisScore(eggCount, eggType, newEggType) {
        // 🔥 修正：使用原蛋等级（eggType）计算分数，不是新蛋等级
        const baseScore = Math.min(eggType * 2, 20);
        const typeMultiplier = eggType;//eggType * 10;
        const countBonus = Math.round(Math.pow(eggCount - 3, 1.5))//Math.round(Math.pow(eggCount - 3, 1.5) * 10);
        const levelBonus = Math.pow(eggType, 2)//Math.pow(eggType, 2) * 5;
        // 新加难度分
        const totalScore = Math.round(baseScore + typeMultiplier + countBonus + levelBonus) * this.difficulty;

        // console.log(`🧮 合成分数计算 - 原等级${eggType}, 数量${eggCount}:`);
        // console.log(`  基础分: min(${eggType} × 2, 20) = ${baseScore}`);
        // console.log(`  类型倍数: ${eggType} × 10 = ${typeMultiplier}`);
        // console.log(`  数量奖励: (${eggCount} - 3)^1.5 × 10 = ${countBonus}`);
        // console.log(`  等级奖励: ${eggType}² × 5 = ${levelBonus}`);
        // console.log(`  总分: ${totalScore}`);

        return {
            baseScore: baseScore,
            typeMultiplier: typeMultiplier,
            countBonus: countBonus,
            levelBonus: levelBonus,
            totalScore: totalScore,
            eggCount: eggCount,
            fromType: eggType,
            toType: newEggType
        };
    }

    /**
     * 更新分数系统
     * @param {Object} scoreDetail - 分数详情
     * @returns {Object} 更新后的分数状态
     */
    updateScoreSystem(scoreDetail) {



        this.scoreSystem.currentScore += scoreDetail.totalScore;
        this.scoreSystem.totalScore += scoreDetail.totalScore;
        this.scoreSystem.sessionScore += scoreDetail.totalScore;

        // 更新历史最高分
        if (this.scoreSystem.totalScore > this.scoreSystem.bestScore) {
            this.scoreSystem.bestScore = this.scoreSystem.totalScore;
            // console.log(`🏆 新的历史最高分: ${this.scoreSystem.bestScore}`);
        }

        // 记录合成历史
        this.scoreSystem.synthesisHistory.push({
            timestamp: Date.now(),
            scoreDetail: scoreDetail,
            currentTotal: this.scoreSystem.currentScore
        });

        // console.log(`📊 分数更新: +${scoreDetail.totalScore}, 当前总分: ${this.scoreSystem.currentScore}`);

        return {
            currentScore: this.scoreSystem.currentScore,
            addedScore: scoreDetail.totalScore,
            scoreDetail: scoreDetail,
            bestScore: this.scoreSystem.bestScore  // 返回历史最高分
        };
    }

    /**s
     * 获取当前分数状态
     * @returns {Object} 分数状态
     */
    getScoreStatus() {
        return {
            currentScore: this.scoreSystem.currentScore,
            totalScore: this.scoreSystem.totalScore,
            sessionScore: this.scoreSystem.sessionScore,
            synthesisCount: this.scoreSystem.synthesisHistory.length,
            bestScore: this.scoreSystem.bestScore // 返回历史最高分
        };
    }

    /**
     * 获取蛋类型名称
     * @param {number} eggType - 蛋类型 (1-7)
     * @returns {string} 蛋类型名称
     */
    getEggTypeName(eggType) {
        const eggNames = {
            1: '白色', // egg_mc1
            2: '绿色', // egg_mc2
            3: '蓝色', // egg_mc3
            4: '紫色', // egg_mc4
            5: '红色', // egg_mc5
            6: '黄色', // egg_mc6
            7: '橙色'  // egg_mc7
        };
        return eggNames[eggType] || '未知';
    }



    /**
     * 计算空位置（从游戏状态获取）
     * @param {Object} gameState - 可选的游戏状态，如果不提供则返回所有位置
     * @returns {Array} 空位置数组
     */
    calculateEmptyPositions(gameState = null) {
        const totalPositions = 48; // 8 * 6
        const emptyPositions = [];

        if (gameState && gameState.cells) {
            // 从实际游戏状态获取空位置
            for (let i = 0; i < totalPositions; i++) {
                const cellState = gameState.cells[i];
                if (!cellState || !cellState.hasEgg) {
                    emptyPositions.push(i);
                }
            }
            // console.log(`📍 从游戏状态找到 ${emptyPositions.length} 个空位置`);
        } else {
            // 如果没有游戏状态，假设所有位置都是空的
            for (let i = 0; i < totalPositions; i++) {
                emptyPositions.push(i);
            }
            // console.log(`📍 默认模式：假设所有 ${emptyPositions.length} 个位置都是空的`);
        }

        return emptyPositions;
    }

    /**
     * 从空位置中随机选择指定数量的位置
     * @param {Array} emptyPositions - 空位置数组
     * @param {number} count - 需要选择的数量
     * @returns {Array} 选中的位置
     */
    selectRandomPositions(emptyPositions, count) {
        const selected = [];
        const available = [...emptyPositions]; // 复制数组

        for (let i = 0; i < count && available.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * available.length);
            const selectedPosition = available.splice(randomIndex, 1)[0];
            selected.push(selectedPosition);
        }

        // console.log(`🎲 随机选择位置: [${selected}]`);
        return selected;
    }

    /**
     * 获取可用的蛋类型（基于解锁等级）
     * @param {number} maxUnlockedEggType - 最高解锁等级
     * @returns {Array} 可用蛋类型数组
     */
    getAvailableEggTypes(maxUnlockedEggType) {
        const availableTypes = [];
        for (let i = 1; i <= Math.min(maxUnlockedEggType, 8); i++) {
            availableTypes.push(i);
        }
        // console.log(`🎯 可用蛋类型: [${availableTypes.join(', ')}] (解锁到: ${maxUnlockedEggType})`);
        return availableTypes;
    }

    /**
     * 从可用类型中随机选择蛋类型
     * @param {Array} availableTypes - 可用蛋类型数组
     * @param {number} count - 需要的数量
     * @returns {Array} 随机选择的蛋类型
     */
    selectRandomEggTypes(availableTypes, count) {
        const selectedTypes = [];

        // 处理 value===1 的强制包含类型（去重、按类型id升序）。
        // 如果强制类型数量 >= count，则直接返回前 count 个强制类型。
        try {
            // 解释：cardBoosts 的语义为：0 = 不参与，0~1 = 权重比例，1 = 最高权重（参与但不强制占位）
            // 不从缓存读取，直接使用实例中已初始化的cardBoosts
            this.cardBoosts = this.cardBoosts || {};
            const DEFAULT_WEIGHT = 0.5; // 未配置时的中性权重，可调整

            // 构建类型-权重池（跳过权重为0的类型）
            const pool = [];
            for (const t of availableTypes) {
                let v = Number(this.cardBoosts[t]);
                if (!isFinite(v)) v = DEFAULT_WEIGHT;
                v = Math.max(0, Math.min(1, v));
                if (v > 0) pool.push({ type: t, weight: v });
            }

            // 如果池为空，则退化为等概率选择（包含所有 availableTypes）
            if (pool.length === 0) {
                const fallback = [];
                for (let i = 0; i < count; i++) {
                    fallback.push(availableTypes[Math.floor(Math.random() * availableTypes.length)]);
                }
                // console.log('ℹ️ 所有权重为0，回退到等概率选择:', fallback);
                return fallback;
            }

            // 带权重的不放回抽样（每次选中后移除该类型，避免重复）
            const take = Math.min(count, pool.length);
            for (let k = 0; k < take; k++) {
                const total = pool.reduce((s, p) => s + p.weight, 0);
                let r = Math.random() * total;
                let idx = 0;
                for (; idx < pool.length; idx++) {
                    r -= pool[idx].weight;
                    if (r <= 0) break;
                }
                if (idx >= pool.length) idx = pool.length - 1;
                selectedTypes.push(pool[idx].type);
                pool.splice(idx, 1);
            }

            // 如果仍不足 count（pool 被耗尽），用可用类型等概率补足
            while (selectedTypes.length < count) {
                selectedTypes.push(availableTypes[Math.floor(Math.random() * availableTypes.length)]);
            }

            // console.log(`🎲 带权重选择蛋类型: [${selectedTypes.join(', ')}] (可用范围: [${availableTypes.join(', ')}])`);
            return selectedTypes;
        } catch (e) {
            console.error('❌ selectRandomEggTypes 失败，回退到等概率选择:', e);
            // 兜底等概率选择
            const fallback = [];
            const pool = [...availableTypes];
            for (let i = 0; i < count; i++) {
                fallback.push(pool[Math.floor(Math.random() * pool.length)]);
            }
            return fallback;
        }
    }

    /**
     * 根据权重生成随机蛋类型
     * @param {Array} availableTypes - 可用蛋类型数组
     * @returns {number} 选中的蛋类型
     */
    generateWeightedRandomEggType(availableTypes) {
        if (availableTypes.length === 0) return 1;
        if (availableTypes.length === 1) return availableTypes[0];

        // 算法1
        // 权重分别为：

        // 1号蛋： (5-1+1)×10 = 50
        // 2号蛋： (5-2+1)×10 = 40
        // 3号蛋： (5-3+1)×10 = 30
        // 4号蛋： (5-4+1)×10 = 20
        // 5号蛋： (5-5+1)×10 = 10
        // 总权重：50+40+30+20+10 = 150

        // 概率分别为：

        // 1号蛋：50/150 = 33.3%
        // 2号蛋：40/150 = 26.7%
        // 3号蛋：30/150 = 20%
        // 4号蛋：20/150 = 13.3%
        // 5号蛋：10/150 = 6.7%
        // // 为每个可用类型分配权重（低级蛋权重更高）
        // const weights = [];
        // const maxType = Math.max(...availableTypes);

        // for (const eggType of availableTypes) {
        //     // 权重计算：最高级的权重最低，最低级的权重最高
        //     const weight = Math.max(1, (maxType - eggType + 1) * 10);
        //     weights.push(weight);
        // }

        // // 根据权重随机选择
        // const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        // let random = Math.random() * totalWeight;

        // for (let i = 0; i < availableTypes.length; i++) {
        //     random -= weights[i];
        //     if (random <= 0) {
        //         // console.log(`🎯 权重选择: 类型${availableTypes[i]} (权重${weights[i]}/${totalWeight})`);
        //         return availableTypes[i];
        //     }
        // }

        // 算法2
        // 以7种蛋为例，权重如下（可根据实际解锁数量调整）
        // const customWeights = {
        //     1: 40,
        //     2: 35,
        //     3: 25,
        //     4: 23,
        //     5: 1,   
        //     6: 1,
        //     7: 1
        // };

        // const weights = availableTypes.map(type => customWeights[type] || 1);

        // const totalWeight = weights.reduce((sum, w) => sum + w, 0);
        // let random = Math.random() * totalWeight;

        // for (let i = 0; i < availableTypes.length; i++) {
        //     random -= weights[i];
        //     if (random <= 0) {
        //         return availableTypes[i];
        //     }
        // }

        // // 兜底返回最低级
        // return availableTypes[0];


        // 算法3：使用 this.cardBoosts 作为基础权重（initializeUserData 时已设置默认值），
        // 并将 cardBoosts 的值视作 base 权重，抽卡时会在此基础上累加额外 boost。
        // 使用 this.cardBoosts 的 0..1 数值作为权重（0 = 永不出现，1 = 保证出现）。
        // 不从缓存读取，直接使用实例中已初始化的cardBoosts
        this.cardBoosts = this.cardBoosts || {};

        // 构建权重数组，语义：0 = 不参与，0..1 = 权重，1 = 最大权重（参与但不强制）
        const DEFAULT_WEIGHT = 0.5;
        const weights = [];
        const types = [];
        for (const type of availableTypes) {
            let w = Number(this.cardBoosts[type]);
            if (!isFinite(w)) w = DEFAULT_WEIGHT;
            w = Math.max(0, Math.min(1, w));
            if (w <= 0) continue; // 不参与抽取
            weights.push(w);
            types.push(type);
        }

        // 如果没有任何参与类型，则回退到等概率选择包含所有 availableTypes
        if (weights.length === 0) {
            const idx = Math.floor(Math.random() * availableTypes.length);
            return availableTypes[idx];
        }

        const totalWeight = weights.reduce((s, x) => s + x, 0);
        if (totalWeight <= 0) return types[0] || availableTypes[0];

        let random = Math.random() * totalWeight;
        for (let i = 0; i < weights.length; i++) {
            random -= weights[i];
            if (random <= 0) return types[i];
        }

        return types[types.length - 1] || availableTypes[0];

        // 算法3测试方法
        // 在浏览器控制台输出
        // const gs = window.GameServer;
        // const pool = gs.getAvailableEggTypes(gs.maxUnlockedEggType);
        // const counts = {};
        // for (let i=0;i<5000;i++){
        // const arr = gs.selectRandomEggTypes(pool, 3); // 取3个
        // arr.forEach(t => counts[t] = (counts[t]||0)+1);
        // }
        // console.log(counts);
    }


    /**
     * 处理蛋合成成功事件
     * @param {string} userId - 用户ID
     * @param {number} synthesizedEggType - 合成的蛋等级
     * @param {number} eggCount - 合成的蛋数量
     */
    onEggSynthesisSuccess(userId, synthesizedEggType, eggCount) {
        let newEggType = synthesizedEggType;
        // console.log(`🎊 用户 ${userId} 成功合成了 ${this.getEggTypeName(synthesizedEggType)} 蛋`);

        // 更新最高解锁等级
        // 🔥 修正：从gameData获取当前解锁等级
        // const gameData = this.loadGameData();
        const currentMax = this.maxUnlockedEggType || 1;

        // console.log(`🔍 当前解锁等级检查: ${currentMax} vs 新等级: ${newEggType}`);

        if (newEggType > currentMax) {
            {
                this.maxUnlockedEggType = newEggType;

            }

            // console.log(`🎉 用户 ${userId} 解锁了新蛋等级: ${newEggType} (${this.getEggTypeName(newEggType)})`);
            // console.log(`📈 解锁进度: ${currentMax} -> ${newEggType}`);
        } else {
            console.log(`📊 用户 ${userId} 当前最高解锁等级: ${currentMax}, 合成等级: ${newEggType} (无需更新)`);
        }

        // 可以在这里添加其他奖励逻辑
        // 比如：经验值、成就、分数等
    }

    /**
     * 将网格坐标转换为像素坐标
     * @param {number} row - 行
     * @param {number} col - 列
     * @returns {Object} 像素坐标 {x, y, centerX, centerY}
     */
    gridToPosition(row, col) {
        if (!this.pathfindingGrid) {
            return { x: 0, y: 0, centerX: 0, centerY: 0 };
        }

        const { cellSize } = this.pathfindingGrid;
        return {
            x: col * cellSize,
            y: row * cellSize,
            centerX: col * cellSize + cellSize / 2,
            centerY: row * cellSize + cellSize / 2
        };
    }

    /**
     * 从地图状态获取空位置
     * @returns {Array} 空位置数组
     */
    getEmptyPositionsFromMap() {
        const emptyPositions = Array.from(this.mapState.emptyCells);
        // console.log(`📍 从地图状态获取空位置: ${emptyPositions.length} 个`);
        return emptyPositions;
    }

    /**
     * 为蛋预留位置（在地图状态中标记）
     * @param {Array} positions - 位置数组
     * @param {Array} eggTypes - 蛋类型数组
     */
    reservePositionsForEggs(positions, eggTypes) {
        // console.log(`📌 预留蛋位置: [${positions}]`);

        for (let i = 0; i < positions.length; i++) {
            const cellId = positions[i];
            const eggType = eggTypes[i];

            if (this.mapState.cells[cellId]) {
                // 更新格子状态
                this.mapState.cells[cellId].isEmpty = false;
                this.mapState.cells[cellId].hasEgg = true;
                this.mapState.cells[cellId].eggType = eggType;
                this.mapState.cells[cellId].occupied = true;

                // 更新集合
                this.mapState.emptyCells.delete(cellId);
                this.mapState.occupiedCells.add(cellId);

                // console.log(`📌 预留格子 ${cellId}: 蛋类型 ${eggType}`);
            }
        }
    }

    /**
     * 释放位置（移除蛋后调用）
     * @param {number} cellId - 格子ID
     */
    releasePosition(cellId) {
        if (this.mapState.cells[cellId]) {
            // 更新格子状态
            this.mapState.cells[cellId].isEmpty = true;
            this.mapState.cells[cellId].hasEgg = false;
            this.mapState.cells[cellId].eggType = null;
            this.mapState.cells[cellId].piece = null;
            this.mapState.cells[cellId].occupied = false;

            // 更新集合
            this.mapState.occupiedCells.delete(cellId);
            this.mapState.emptyCells.add(cellId);

            // console.log(`🗑️ 释放格子 ${cellId}`);
        }
    }

    /**
     * 占用位置（放置蛋后调用）
     * @param {number} cellId - 格子ID
     * @param {number} eggType - 蛋类型
     * @param {Object} piece - 蛋元件（可选）
     */
    occupyPosition(cellId, eggType, piece = null) {
        if (this.mapState.cells[cellId]) {
            // 更新格子状态
            this.mapState.cells[cellId].isEmpty = false;
            this.mapState.cells[cellId].hasEgg = true;
            this.mapState.cells[cellId].eggType = eggType;
            this.mapState.cells[cellId].piece = piece;
            this.mapState.cells[cellId].occupied = true;

            // 更新集合
            this.mapState.emptyCells.delete(cellId);
            this.mapState.occupiedCells.add(cellId);

            // console.log(`📍 占用格子 ${cellId}: 蛋类型 ${eggType}`);
        }
    }

    /**
     * 保存当前游戏状态到localStorage
     */
    saveCurrentGameState() {
        if (this.currentUserStatus?.isNewUser) {
            console.log('🆕 新用户，不保存游戏状态');
            return;
        }
        try {
            // 收集当前地图中的蛋信息
            const currentEggs = [];
            for (const [cellId, cellData] of Object.entries(this.mapState.cells)) {
                if (cellData.hasEgg && cellData.eggType !== null) {
                    currentEggs.push({
                        cellId: parseInt(cellId),
                        eggType: cellData.eggType
                    });
                }
            }


            const gameState = {
                eggs: currentEggs,
                scoreSystem: this.scoreSystem, // 只保存总分数
                difficulty: this.difficulty || 4,
                maxUnlockedEggType: this.maxUnlockedEggType || 1,
                // 注释掉保存 cardBoosts，确保不保存到缓存
                // cardBoosts: this.cardBoosts || {},
                saveTime: Date.now()
            };

            // 注释掉禁用加密的 cardBoosts 保存
            // try {
            //     gameState.cardBoosts = this.cardBoosts || {};
            // } catch (e) {}
            this._persistGameData(gameState);

            // console.log(`💾 游戏状态已保存: ${currentEggs.length}个蛋, 总分数${gameState.totalScore}`);

        } catch (error) {
            console.error('❌ 保存游戏状态失败:', error);
        }
    }

    /**
     * 将抽卡结果写入 cardBoosts（并持久化）
     * @param {number|string} cardType - 卡牌/蛋 类型
     * @param {number} amount - 增量（默认为 1）
     */
    applyCardBoost(cardType, amount = 0) {
        try {
            if (cardType === undefined || cardType === null) return;
            const key = String(cardType);
            if (!this.cardBoosts) this.cardBoosts = {};
            const cur = Number(this.cardBoosts[key]) || 0;
            // amount is expected to be a decimal in 0..1
            let delta = Number(amount || 0);
            if (!isFinite(delta)) delta = 0;
            let next = cur + delta;
            // 上限为 1
            const MAX_BOOST = 1;
            next = Math.max(0, Math.min(MAX_BOOST, next));
            // 保留两位小数，避免浮点数尾数过长
            this.cardBoosts[key] = Number(next.toFixed(2));
            
            // 注释掉持久化代码，确保不保存到缓存
            // 立即持久化：优先直接写入 GameData.cardBoosts（避免新手引导期间 saveCurrentGameState 被阻止）
            // try {
            //     const gd = this.loadGameData() || {};
            //     gd.cardBoosts = this.cardBoosts;
            //     // 禁用混淆：保持 cardBoosts 明文
            //     try { gd.cardBoosts = this.cardBoosts; } catch (e) {}
            //     gd.saveTime = Date.now();
            //     this._persistGameData(gd);
            // } catch (e) {
            //     // 兜底尝试 saveCurrentGameState（老逻辑）
            //     try { this.saveCurrentGameState(); } catch (e2) { /* ignore */ }
            // }
            
            console.log(`🔔 applyCardBoost: type=${key}, +${delta} -> ${next} (不保存到缓存)`);
            // console.log(`🔔 applyCardBoost: type=${key}, +${delta} -> ${next}`);
            return this.cardBoosts;
        } catch (e) {
            console.error('❌ applyCardBoost 失败:', e);
            return null;
        }
    }

    /**
   * 从游戏数据恢复游戏状态
   * @param {Object} gameData - 游戏数据对象
   */
    loadSavedGameState(gameData) {
        try {
            // 🔥 修正：检查 eggs 而不是 currentEggs
            if (!gameData || !gameData.eggs) {
                console.log('📝 没有需要恢复的游戏状态');
                return null;
            }

            // console.log(`🔄 恢复游戏状态: ${gameData.eggs.length}个蛋`);

            // 恢复地图中的蛋
            for (const eggData of gameData.eggs) {
                this.occupyPositionSilently(eggData.cellId, eggData.eggType);
            }

            // 🔥 恢复分数系统
            if (gameData.scoreSystem) {
                this.scoreSystem = gameData.scoreSystem;
                // console.log(`💰 分数系统已恢复: 总分${this.scoreSystem.totalScore}`);
            }

            // 🔥 恢复难度设置
            if (gameData.difficulty !== undefined) {
                this.difficulty = gameData.difficulty;
                // console.log(`🎯 难度已恢复: ${this.difficulty}`);
            }

            // 🔥 恢复用户解锁等级
            if (gameData.maxUnlockedEggType !== undefined) {
                this.maxUnlockedEggType = gameData.maxUnlockedEggType;
                // console.log(`🏆 解锁等级已恢复: ${gameData.maxUnlockedEggType}`);

            }

            // 🔥 注释掉恢复 cardBoosts 的代码，确保每次启动都使用代码默认值
            // if (gameData.cardBoosts !== undefined) {
            //     // 恢复并规范化为两位小数
            //     this.cardBoosts = gameData.cardBoosts || {};
            //     try {
            //         Object.keys(this.cardBoosts).forEach(k => {
            //             const v = Number(this.cardBoosts[k]) || 0;
            //             this.cardBoosts[k] = Number(v.toFixed(2));
            //         });
            //     } catch (e) {
            //         // ignore
            //     }
            //     // console.log('🔁 cardBoosts 已恢复并规范化:', this.cardBoosts);
            // } else {
            //     this.cardBoosts = this.cardBoosts || {};
            // }
            
            console.log('🔁 跳过 cardBoosts 恢复，使用代码默认值');

            // console.log('✅ 游戏状态恢复完成');
            return gameData;

        } catch (error) {
            console.error('❌ 恢复游戏状态失败:', error);
            return null;
        }
    }

    /**
     * 静默占用位置（恢复时使用，不触发保存）
     */
    occupyPositionSilently(cellId, eggType) {
        if (this.mapState.cells[cellId]) {
            this.mapState.cells[cellId].isEmpty = false;
            this.mapState.cells[cellId].hasEgg = true;
            this.mapState.cells[cellId].eggType = eggType;
            this.mapState.cells[cellId].piece = null;
            this.mapState.cells[cellId].occupied = true;

            this.mapState.emptyCells.delete(cellId);
            this.mapState.occupiedCells.add(cellId);
        }
    }

    /**
     * 获取地图状态信息
     * @returns {Object} 地图状态信息
     */
    getMapStateInfo() {
        return {
            totalCells: this.mapConfig.totalCells,
            emptyCells: this.mapState.emptyCells.size,
            occupiedCells: this.mapState.occupiedCells.size,
            isInitialized: this.mapState.isInitialized,
            config: this.mapConfig
        };
    }


    /**
     * 处理蛋点击逻辑
     * @param {number} cellId - 点击的格子ID
     * @returns {Object} 操作结果
     */
    processEggClick(cellId) {
        // console.log(`🖱️ 处理蛋点击: 格子${cellId}`);

        this.printMapState();

        // 检查格子是否存在
        if (!this.mapState.cells[cellId]) {
            return {
                code: -1,
                message: "无效的格子位置",
                cellId: cellId
            };
        }

        const cell = this.mapState.cells[cellId];

        // 情况0：点击空位置 + 有选中蛋 → 尝试移动
        if ((cell.isEmpty || !cell.hasEgg) && this.selectionState.isSelected) {
            // console.log(`🚶 尝试移动蛋到空位置: ${this.selectionState.selectedEgg.cellId} -> ${cellId}`);

            // 调用移动处理逻辑
            const moveResult = this.processEggMove(this.selectionState.selectedEgg.cellId, cellId);

            if (moveResult.code === 0) {
                // 移动成功，清除选中状态
                this.clearSelection();

                return {
                    code: 0,
                    step: 2,  // 步骤2：移动蛋
                    guideData: moveResult.guideData, // 添加引导数据
                    fromCellId: moveResult.fromCellId,
                    toCellId: moveResult.toCellId,
                    path: moveResult.path,
                    eggType: moveResult.eggType,
                    positionsToDelete: moveResult.positionsToDelete, // 添加需要删除的位置
                    synthesis: moveResult.synthesis,  // 添加合成数据
                    newEggs: moveResult.newEggs,      // 添加新蛋数据
                    isVictory: moveResult.isVictory,
                    isFailure: moveResult.isFailure,
                    message: "点击空位置，移动蛋"
                };
            } else {
                // 移动失败
                return {
                    code: -1,
                    step: 0,  // 步骤0：错误或无效操作
                    message: moveResult.message || "无法移动到该位置",
                    cellId: cellId
                };
            }
        }

        // 情况-1：点击空位置 + 没有选中蛋
        if (cell.isEmpty || !cell.hasEgg) {
            // console.log(`📍 点击了空位置: 格子${cellId}`);
            return {
                code: -1,
                step: 0,  // 步骤0：错误或无效操作
                message: "位置为空",
                cellId: cellId
            };
        }

        // 情况2：选择新蛋（当前没有选中任何蛋）
        if (!this.selectionState.isSelected) {
            // console.log(`🎯 选择新蛋: 格子${cellId}, 类型${cell.eggType}`);

            this.selectionState.selectedEgg = {
                cellId: cellId,
                eggType: cell.eggType
            };
            this.selectionState.isSelected = true;

            return {
                code: 0,
                step: 1,  // 步骤1：选择蛋
                cellId: cellId,
                eggType: cell.eggType,
                message: "选择蛋"
            };
        }

        // 情况3：取消选择（点击当前选中的蛋）
        if (this.selectionState.selectedEgg.cellId === cellId) {
            // console.log(`🔄 取消选择: 格子${cellId}`);

            this.selectionState.selectedEgg = null;
            this.selectionState.isSelected = false;

            return {
                code: 0,
                step: 3,  // 步骤3：取消选择
                cellId: cellId,
                message: "取消选择"
            };
        }

        // 情况4：切换选择（点击其他蛋）
        const oldCellId = this.selectionState.selectedEgg.cellId;
        // console.log(`🔄 切换选择: ${oldCellId} -> ${cellId}`);

        this.selectionState.selectedEgg = {
            cellId: cellId,
            eggType: cell.eggType
        };

        return {
            code: 0,
            step: 4,  // 步骤4：切换选择
            oldCellId: oldCellId,
            newCellId: cellId,
            eggType: cell.eggType,
            message: "切换选择"
        };
    }

    /**
     * 获取当前选择状态
     * @returns {Object} 选择状态信息
     */
    getSelectionState() {
        return {
            isSelected: this.selectionState.isSelected,
            selectedEgg: this.selectionState.selectedEgg
        };
    }

    /**
     * 清除选择状态
     */
    clearSelection() {
        console.log('🔄 清除选择状态');
        this.selectionState.selectedEgg = null;
        this.selectionState.isSelected = false;
    }


    currNum = 0;
    /**
     * 处理蛋移动
     * @param {number} fromCellId - 起始格子ID
     * @param {number} toCellId - 目标格子ID
     * @returns {Object} 移动结果
     */
    processEggMove(fromCellId, toCellId) {
        // console.log(`🚶 处理蛋移动: ${fromCellId} -> ${toCellId}`);

        // 1. 验证起始位置
        const fromCell = this.mapState.cells[fromCellId];
        if (!fromCell || fromCell.isEmpty || !fromCell.hasEgg) {
            return {
                code: -1,
                message: "起始位置没有蛋"
            };
        }

        // 2. 验证目标位置
        const toCell = this.mapState.cells[toCellId];
        if (!toCell || !toCell.isEmpty || toCell.hasEgg) {
            return {
                code: -1,
                message: "目标位置不可用"
            };
        }

        // 3. 寻找移动路径
        const path = this.findMovePath(fromCellId, toCellId);
        if (!path || path.length === 0) {
            return {
                code: -1,
                message: "无法找到移动路径"
            };
        }

        // 4. 执行移动（更新地图状态）
        const eggType = fromCell.eggType;
        const piece = fromCell.piece;

        // 清空起始位置
        this.releasePosition(fromCellId);

        // 占用目标位置
        this.occupyPosition(toCellId, eggType, piece);


        // 5. 检查移动后是否可以合成
        const synthesisResult = this.findEggMatches(toCellId, { cells: this.mapState.cells });

        let positionsToDelete = [fromCellId]; // 默认只删除起始位置
        let synthesisData = { canSynthesize: false };
        if (synthesisResult && synthesisResult.matches.length >= 3) {
            synthesisData = {
                canSynthesize: true,
                matches: synthesisResult.matches,
                eggType: synthesisResult.eggType,
                newEggType: synthesisResult.newEggType,
                synthesisPosition: toCellId,  // 合成位置就是移动的目标位置
                score: synthesisResult.score

            };

            // 如果可以合成，需要删除所有参与合成的位置（除了目标位置）
            positionsToDelete = synthesisResult.matches.filter(cellId => cellId !== toCellId);

            // 添加起始位置（如果不在合成列表中）
            if (!positionsToDelete.includes(fromCellId)) {
                positionsToDelete.push(fromCellId);
            }

            // console.log(`🗑️ 合成时需要删除的位置: [${positionsToDelete}]`);


            // 如果可以合成，先处理合成逻辑（移除旧蛋，更新地图状态）
            this.processSynthesisResult(synthesisResult, toCellId);
        }

        // const newEggsResult = this.generateRandomEggsFromMapState(this.difficulty) || [];
        // 加入新用户判定
        let newEggsResult;
        if (this.currentUserStatus.isNewUser) {
            // console.log('🆕 当前用户是新用户，调用引导数据');

            this.guidestaute.currentStep += 1;
            const guideData = this.getNewUserGuideData();
            if (guideData.success) {
                newEggsResult = guideData.data.eggSeat.map((cellId, index) => ({
                    cellId: cellId,
                    eggType: guideData.data.eggType[index]
                }));

                // 🔥 修复：同时返回新的引导指示位置
                return {
                    code: 0,
                    fromCellId: fromCellId,
                    toCellId: toCellId,
                    path: path,
                    eggType: eggType,
                    positionsToDelete: positionsToDelete,
                    synthesis: synthesisData,
                    newEggs: newEggsResult,
                    // 🔥 添加引导数据，包含新的指示位置
                    guideData: {
                        isNewUser: true,
                        pointSeat: guideData.data.pointSeat,
                        currentStep: guideData.step,
                        currentLevel: guideData.level
                    },
                    message: "移动处理完成"
                };
            } else if (!guideData.isNewUser) {
                // 引导完成的情况
                // console.log('🎉 引导完成，切换到老用户模式');

                newEggsResult = this.generateRandomEggsFromMapState(this.difficulty) || [];

            } else {
                console.warn('⚠️ 未找到引导数据，使用随机生成数据');
                newEggsResult = this.generateRandomEggsFromMapState(this.difficulty) || [];
            }
        } else {
            // console.log('🎮 当前用户是老用户，使用随机生成数据');
            newEggsResult = this.generateRandomEggsFromMapState(this.difficulty) || [];
        }

        // this.currNum++;
        // if(this.currNum > 4){
        //     // 测试胜利
        //     // console.log(`当前用户的合成次数：${this.currNum}`);
        //     return {
        //             code: 0,
        //             fromCellId: fromCellId,
        //             toCellId: toCellId,
        //             path: path,
        //             eggType: eggType,
        //             positionsToDelete: positionsToDelete,
        //             synthesis: synthesisData,
        //             newEggs: [],
        //             isVictory: true,
        //             reason: 'max_egg_level_reached',
        //             message: "恭喜！您合成了最高等级的蛋！"
        //         };
        // }


        // 测试失败
        // return {
        //         code: 0,
        //         fromCellId: fromCellId,
        //         toCellId: toCellId,
        //         path: path,
        //         eggType: eggType,
        //         positionsToDelete: positionsToDelete,
        //         synthesis: synthesisData,
        //         newEggs: newEggsResult,
        //         isFailure: true,
        //         reason: 'map_full',
        //         message: '地图已满，游戏结束！'
        //     };

        // 旧的胜利条件
        // if (synthesisData.canSynthesize && synthesisData.newEggType > 7) {
        //     console.log('🏆 达成胜利条件：合成最高等级蛋！');
        //     return {
        //         code: 0,
        //         fromCellId: fromCellId,
        //         toCellId: toCellId,
        //         path: path,
        //         eggType: eggType,
        //         positionsToDelete: positionsToDelete,
        //         synthesis: synthesisData,
        //         newEggs: newEggsResult,
        //         isVictory: true,
        //         reason: 'max_egg_level_reached',
        //         message: "恭喜！您合成了最高等级的蛋！"
        //     };
        // }
        // 6. 检查胜利条件
        if (synthesisData.canSynthesize && synthesisData.newEggType > 7) {
            // console.log('🏆 达成胜利条件：合成最高等级蛋！');
            // 将返回的参与合成位置改为地图上所有有蛋的位置，便于前端清除/收集所有蛋
            const allEggPositions = [];
            try {
                // 优先使用 mapState.occupiedCells（性能优），兜底遍历 cells
                if (this.mapState && this.mapState.occupiedCells && this.mapState.occupiedCells.size > 0) {
                    allEggPositions.push(...Array.from(this.mapState.occupiedCells));
                } else if (this.mapState && this.mapState.cells) {
                    for (const [cid, cell] of Object.entries(this.mapState.cells)) {
                        if (cell && cell.hasEgg) allEggPositions.push(Number(cid));
                    }
                }
            } catch (e) {
                // ignore errors and fallback to positionsToDelete
                console.error('⚠️ 获取所有蛋位置失败，使用默认参与位置', e);
            }

            // 将地图上所有蛋位置追加到原始参与合成的位置后面（去重）
            const mergedPositions = Array.isArray(positionsToDelete) ? positionsToDelete.slice() : [];
            try {
                const seen = new Set(mergedPositions.map(p => Number(p)));
                for (const p of allEggPositions) {
                    const n = Number(p);
                    if (!seen.has(n)) {
                        mergedPositions.push(n);
                        seen.add(n);
                    }
                }
            } catch (e) {
                console.error('⚠️ 合并全图蛋位置失败，使用原参与位置', e);
            }

            return {
                code: 0,
                fromCellId: fromCellId,
                toCellId: toCellId,
                path: path,
                eggType: eggType,
                // 重要：返回的 positionsToDelete 现在包含原参与合成的位置，随后追加地图上所有蛋的位置
                positionsToDelete: mergedPositions,
                synthesis: synthesisData,
                newEggs: [],//newEggsResult,
                isVictory: true,
                reason: 'max_egg_level_reached',
                message: "恭喜！您合成了最高等级的蛋！"
            };
        }



        // 7. 检查地图是否已满（失败条件）
        if (this.mapState.emptyCells.size === 0) {
            console.warn('💀 地图已满，游戏结束');

            return {
                code: 0,
                fromCellId: fromCellId,
                toCellId: toCellId,
                path: path,
                eggType: eggType,
                positionsToDelete: positionsToDelete,
                synthesis: synthesisData,
                newEggs: newEggsResult,
                isFailure: true,
                reason: 'map_full',
                message: '地图已满，游戏结束！'
            };
        }

        // 操作完成后保存游戏状态

        this.saveCurrentGameState();

        // console.log(`✅ 蛋移动处理完成: ${fromCellId} -> ${toCellId}`);

        return {
            code: 0,
            fromCellId: fromCellId,
            toCellId: toCellId,
            path: path,
            eggType: eggType,
            positionsToDelete: positionsToDelete, // 返回需要删除的位置列表
            synthesis: synthesisData,
            newEggs: newEggsResult,
            message: "移动处理完成"
        };
    }

    /**
     * 处理合成结果（更新地图状态）
     * @param {Object} synthesisResult - 合成结果
     * @param {number} targetCellId - 移动的目标位置（合成位置）
     */
    processSynthesisResult(synthesisResult, targetCellId) {
        // console.log('🎬 处理合成结果，更新地图状态...');

        // 移除被合成的蛋（除了目标位置）
        for (const cellId of synthesisResult.matches) {
            if (cellId !== targetCellId) {
                this.releasePosition(cellId);
                // console.log(`🗑️ 移除合成位置: ${cellId}`);
            }
        }

        // 更新目标位置的蛋类型为合成后的新类型
        const targetCell = this.mapState.cells[targetCellId];
        if (targetCell) {
            targetCell.eggType = synthesisResult.newEggType;
            // console.log(`🥚 目标位置 ${targetCellId} 更新为 ${this.getEggTypeName(synthesisResult.newEggType)} 蛋`);
        }

        // 🔥 修正：使用已有的分数数据，不要重复计算
        const scoreDetail = synthesisResult.score;
        const scoreUpdate = this.updateScoreSystem(scoreDetail);

        // 将分数信息添加到合成结果中
        synthesisResult.scoreDetail = scoreDetail;
        synthesisResult.scoreUpdate = scoreUpdate;

        // 合成成功后更新解锁等级
        this.onEggSynthesisSuccess('currentUser', synthesisResult.newEggType, synthesisResult.matches.length);

        // 异步更新排行榜数据
        if (!this.currentUserStatus.isNewUser) {
            console.log('🆕 新用户，跳过排行榜更新');
            this.updateLeaderboardAsync();
        }

        // console.log(`✅ 合成处理完成，生成 ${this.getEggTypeName(synthesisResult.newEggType)} 蛋，获得 ${scoreDetail.totalScore} 分`);
    }


    /**
     * 异步更新排行榜数据
     */
    updateLeaderboardAsync() {
        // 异步执行，不阻塞主流程
        // setTimeout(() => {
        //     try {
        //         if (window.LeaderBoard) {
        //             console.log('📊 异步更新排行榜数据...');
        //             // const updateResult = window.LeaderBoard.updateUserRecord('currentUser');

        //             if (updateResult) {
        //                 utitle.__sdklog3('排行榜数据更新成功');
        //             } else {
        //                 console.log('📊 排行榜数据无变化');
        //             }
        //         } else {
        //             console.warn('⚠️ LeaderBoard 模块未找到');
        //         }
        //     } catch (error) {
        //         console.error('❌ 异步更新排行榜失败:', error);
        //     }
        // }, 0);
    }


    /**
     * 从地图状态生成随机蛋
     * @param {number} count - 生成数量
     * @returns {Array} 生成的蛋数据
     */
    generateRandomEggsFromMapState(count = 3) {
        // console.log(`🎲 从地图状态生成 ${count} 个随机蛋...`);

        // 从地图状态获取空闲位置
        const emptyCells = Array.from(this.mapState.emptyCells);

        if (emptyCells.length < count) {
            console.warn(`⚠️ 空闲位置不足，需要 ${count} 个，只有 ${emptyCells.length} 个`);
            count = emptyCells.length;
        }

        // 获取用户解锁状态
        const maxUnlockedEggType = this.maxUnlockedEggType;

        // console.log(`🏆 用户当前最高解锁等级: ${maxUnlockedEggType}`);

        // 获取可用蛋类型并随机选择
        const availableTypes = this.getAvailableEggTypes(maxUnlockedEggType);//
        const selectedTypes = this.selectRandomEggTypes(availableTypes, count);

        // 随机选择位置
        const selectedPositions = this.selectRandomPositions(emptyCells, count);

        // 立即更新后端地图状态
        for (let i = 0; i < selectedPositions.length; i++) {
            const cellId = selectedPositions[i];
            const eggType = selectedTypes[i];

            this.occupyPosition(cellId, eggType, null); // piece为null，等前端创建后再关联
        }

        // 返回生成的蛋数据
        const newEggs = selectedPositions.map((cellId, index) => ({
            cellId: cellId,
            eggType: selectedTypes[index]
        }));

        // console.log('🗺️ 当前地图蛋状态:');
        const existingEggs = [];
        Object.keys(this.mapState.cells).forEach(cellId => {
            const cell = this.mapState.cells[cellId];
            if (cell.hasEgg) {
                existingEggs.push({
                    cellId: parseInt(cellId),
                    eggType: cell.eggType,
                    hasPiece: !!cell.piece
                });
                // console.log(`  格子${cellId}: 蛋类型${cell.eggType} ${this.getEggTypeName(cell.eggType)} ${cell.piece ? '(有前端元件)' : '(无前端元件)'}`);
            }
        });

        // utile.__sdklog3(`📊 地图统计: 总共${existingEggs.length}个蛋, 空闲格子${this.mapState.emptyCells.size}个, 占用格子${this.mapState.occupiedCells.size}个`);
        return newEggs;
    }


    /**
     * 寻找移动路径
     * @param {number} fromCellId - 起始格子ID
     * @param {number} toCellId - 目标格子ID
     * @returns {Array} 路径数组
     */
    findMovePath(fromCellId, toCellId) {
        // console.log(`🔍 寻找移动路径: ${fromCellId} -> ${toCellId}`);

        // 更新寻路网格状态（同步当前地图状态）
        this.updatePathfindingGrid();

        // 转换为行列坐标
        const fromPos = this.getCellPosition(fromCellId);
        const toPos = this.getCellPosition(toCellId);

        try {
            // 使用寻路系统查找路径
            const path = this.findPath(fromPos, toPos);

            if (path && path.length > 0) {
                console.log(`📍 找到路径，步数: ${path.length}`);
                return path;
            } else {
                console.log('❌ 未找到可行路径');
                return [];
            }
        } catch (error) {
            console.error('❌ 寻路失败:', error);
            return [];
        }
    }


    /**
     * 更新寻路网格状态
     */
    updatePathfindingGrid() {
        if (!this.pathfindingGrid || !this.pathfindingGrid.nodes) {
            console.warn('⚠️ 寻路网格未初始化');
            return;
        }

        const { nodes, rows, cols } = this.pathfindingGrid;

        // 遍历所有格子，更新可通行状态
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const cellId = this.getCellId(i, j);
                const cellData = this.mapState.cells[cellId];
                const node = nodes[i][j];

                // 根据地图状态更新节点
                node.walkable = !cellData.hasEgg;
                node.occupied = cellData.hasEgg;
                node.type = cellData.hasEgg ? (window.graphType ? window.graphType.wall : 1) : (window.graphType ? window.graphType.open : 0);
            }
        }

        // console.log('🔄 寻路网格状态已更新');
    }
    /**
     * 根据格子ID获取位置坐标
     * @param {number} cellId - 格子ID
     * @returns {Object} 位置坐标 {row, col}
     */
    getCellPosition(cellId) {
        const row = Math.floor(cellId / this.mapConfig.cols);
        const col = cellId % this.mapConfig.cols;
        return { row: row, col: col };
    }


    /**
     * 打印当前地图状态（调试用）
     */
    printMapState() {
        // console.log('🗺️ 当前后端地图状态:');

        const occupiedCells = [];
        for (const [cellId, cellData] of Object.entries(this.mapState.cells)) {
            if (!cellData.isEmpty && cellData.hasEgg) {
                occupiedCells.push({
                    cellId: parseInt(cellId),
                    eggType: cellData.eggType,
                    hasEgg: cellData.hasEgg,
                    occupied: cellData.occupied
                });
                // utile.__sdklog3(`  格子${cellId}: 蛋类型${cellData.eggType} ${this.getEggTypeName(cellData.eggType)}`);
            }
        }

        // console.log(`📊 后端地图统计: 总共${occupiedCells.length}个蛋`);
        return occupiedCells;
    }



    /**
     * 设置登录配置
     * @param {Object} config - 登录配置
     */
    setLoginConfig(config) {
        this.loginConfig = { ...this.loginConfig, ...config };
        // console.log('🔧 登录配置已更新:', this.loginConfig);
    }

    /**
     * 检测登录方式
     */
    detectLoginType() {
        // 🔥 如果强制指定了登录类型，直接返回
        if (this.loginConfig.forceLoginType) {
            console.log(`🎯 强制使用登录方式: ${this.loginConfig.forceLoginType}`);
            return this.loginConfig.forceLoginType;
        }

        // 🔥 模拟登录检测
        if (this.loginConfig.enableMockLogin) {
            // 检查URL参数
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('mock_wechat') === 'true') {
                console.log('🔍 URL参数强制微信模拟');
                return 'wechat';
            }

            // 随机模拟微信环境
            if (Math.random() < this.loginConfig.mockWechatProbability) {
                console.log('🔍 随机模拟微信环境');
                return 'wechat';
            }
        }

        // 检查是否有微信环境
        if (window.wx && window.wx.miniProgram) {
            return 'wechat';
        }

        // 检查是否有Google登录
        if (window.gapi && window.gapi.auth2) {
            return 'google';
        }

        // 检查本地是否有用户数据
        const localData = localStorage.getItem('gameUserData');
        if (localData) {
            return 'local';
        }

        // 默认游客模式
        return 'guest';
    }


    /**
     * 根据登录方式加载用户数据
     */
    async loadUserDataByLoginType(loginType) {
        switch (loginType) {
            case 'wechat':
                return await this.loadWechatUserData();
            case 'google':
                return await this.loadGoogleUserData();
            case 'local':
                return await this.loadLocalUserData();
            case 'guest':
            default:
                return await this.createGuestUser();
        }
    }

    /**
     * 加载微信用户数据
     */
    async loadWechatUserData() {
        // console.log('🔐 加载微信用户数据...');

        try {
            // 🔥 支持配置的模拟登录延迟
            const delay = this.loginConfig.mockLoginDelay || 1000;
           
            await new Promise(resolve => setTimeout(resolve, delay));

            // 测试用：注释掉正常返回，强制模拟登录失败以便前端走 catch -> 游客流程
            console.warn('⚠️ 强制模拟微信登录失败（测试用），将抛出错误以便前端处理');
            throw new Error('模拟微信登录失败（测试）');

            // 模拟微信用户信息
            const userInfo = {
                openid: 'mock_openid_' + Date.now(),
                nickname: '微信用户' + Math.floor(Math.random() * 1000),
                avatar: 'https://example.com/avatar.jpg',
                unionid: 'mock_unionid_' + Date.now()
            };

            // 模拟50%概率是老用户
            const isExistingUser = Math.random() > 0.5;

            if (isExistingUser) {
                utile.__sdklog3('☁️ 模拟找到云存档数据（老用户）');
                return {
                    userId: userInfo.openid,
                    loginType: 'wechat',
                    userInfo: userInfo,
                    // 🔥 只返回用户身份信息，不包含游戏进度数据
                    lastLoginTime: Date.now(),
                    fromCloud: true
                };
            } else {
                console.log('👶 微信新用户，创建初始数据');
                return this.createNewUser('wechat', userInfo);
            }
        } catch (error) {
            console.error('❌ 微信登录失败:', error);
            // 不在此处回退为游客，向上抛出错误由调用方决定是否降级到游客登录
            throw new Error('WeChat login failed: ' + (error && error.message ? error.message : String(error)));
        }
    }

    /**
 * 加载Google用户数据
 */
    async loadGoogleUserData() {
        console.log('🔐 加载Google用户数据...');

        try {
            // 获取Google用户信息
            const userInfo = await this.getGoogleUserInfo();

            // 尝试从云存档加载
            const cloudData = await this.loadFromGoogleCloud(userInfo.id);

            if (cloudData) {
                console.log('☁️ 从Google云存档恢复数据');
                return {
                    ...cloudData,
                    loginType: 'google',
                    userInfo: userInfo,
                    lastLoginTime: Date.now()
                };
            } else {
                console.log('👶 Google新用户，创建初始数据');
                return this.createNewUser('google', userInfo);
            }
        } catch (error) {
            console.error('❌ Google登录失败，使用游客模式:', error);
            return await this.createGuestUser();
        }
    }

    /**
     * 加载本地用户数据
     */
    async loadLocalUserData() {
        console.log('💾 加载本地用户数据...');

        try {
            const userData = localStorage.getItem('gameUserData');
            if (userData) {
                const parsedData = JSON.parse(userData);
                console.log('📂 本地数据加载成功');
                return {
                    ...parsedData,
                    loginType: parsedData.loginType || 'local',
                    lastLoginTime: Date.now()
                };
            }
        } catch (error) {
            console.error('❌ 本地数据解析失败:', error);
        }

        return await this.createGuestUser();
    }

    /**
     * 创建游客用户
     */
    async createGuestUser() {
        console.log('👤 创建游客用户...');

        // 🔥 支持模拟登录延迟
        if (this.loginConfig.mockLoginDelay && this.loginConfig.mockLoginDelay > 0) {
            console.log(`⏳ 模拟游客登录延迟 ${this.loginConfig.mockLoginDelay / 1000} 秒...`);
            await new Promise(resolve => setTimeout(resolve, this.loginConfig.mockLoginDelay));
        }

        const guestId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

        return this.createNewUser('guest', { id: guestId, name: 'vidar' });
    }

    /**
     * 创建新用户数据
     */
    createNewUser(loginType, userInfo) {
        return {
            userId: userInfo.id || userInfo.openid || 'guest_' + Date.now(),
            loginType: loginType,
            userInfo: userInfo,
            // 🔥 只包含用户身份信息，不包含游戏数据
            createTime: Date.now(),
            lastLoginTime: Date.now(),
            fromCloud: false
        };
    }


}

// 创建全局 GameServer 实例
window.GameServer = new GameServer();