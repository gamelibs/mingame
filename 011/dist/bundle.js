/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 15:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _utile_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(911);

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
        // console.log('🗺️ 初始化地图系统...');

        try {
            // 检查依赖模块
            this.checkDependencies();

            // 1. 初始化棋盘系统
            await this.initChessboard();

            // 2. 初始化寻路系统
            await this.initPathfinding();

            // 3. 标记初始化完成
            this.mapState.isInitialized = true;

            // console.log('✅ 地图系统初始化完成');
        } catch (error) {
            console.error('❌ 地图系统初始化失败:', error);

            // 设置重试机制
            // console.log('🔄 5秒后重试初始化...');
            setTimeout(() => {
                this.initializeMapSystem();
            }, 5000);
        }
    }

    /**
     * 检查依赖模块
     */
    checkDependencies() {
        // console.log('🔍 检查依赖模块...');

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
        // console.log('♟️ 初始化棋盘系统...');

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

        // console.log(`✅ 棋盘系统初始化完成: ${rows}x${cols} = ${this.mapConfig.totalCells} 个格子`);
    }

    /**
     * 初始化寻路系统
     */
    async initPathfinding() {
        // console.log('🗺️ 初始化寻路系统...');

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

            // console.log('✅ 寻路系统初始化完成');
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
    // console.log('🚀 GameServer 启动中...');
    // console.log(`🕒 GameServer.init() start @ ${new Date().toISOString()}`);
        // 🔥 使用新的用户数据初始化流程
        this.currentUserStatus = await this.initializeUserData();

        this.isInitialized = true;
        // console.log('✅ GameServer 启动完成');
    // console.log(`🕒 GameServer.init() end @ ${new Date().toISOString()}`);

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
        // console.log('👤 开始用户数据初始化...');

        // 把 loginType 提升到外层作用域，以便 catch 中也可访问
        let loginType = null;
        try {
            // 1. 检测登录方式
            loginType = this.detectLoginType();
            // console.log(`🔍 检测到登录方式: ${loginType}`);

            let isNewUser = null
            // 2. 🔥 修正：优先加载本地用户数据
            let userData = this.loadUserDataCache();

            // 3. 🔥 修正：如果没有本地数据，则通过登录方式获取
            if (!userData) {
                // console.log('📱 没有本地用户数据，通过登录方式获取...');
                userData = await this.loadUserDataByLoginType(loginType);
                isNewUser = true;
            } else {
                // console.log('💾 找到本地用户数据，使用本地数据');
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
            // console.log(`👤 用户初始化完成: ${isNewUser ? '新用户(需要引导)' : '老用户(恢复数据)'}`);

            // 🔥 初始化 cardBoosts（每次启动都使用代码默认值，不从缓存读取也不保存到缓存）
            this.cardBoosts = {
                1: 0.5, // 灰
                2: 0.5, // 绿
                3: 0.4, // 蓝
                4: 0.3, // 紫
                5: 0.2, // 红
                6: 0.1, // 黄
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
            
            // console.log('🔁 使用代码默认 cardBoosts 配置 (不从缓存读取)');

            return finalUserData;

        } catch (error) {
            console.error('❌ 用户数据初始化失败:', error);
            // 如果登录方式是 wechat，则将错误向上抛出，由前端决定是否降级为游客登录
            try {
                if (loginType === 'wechat') {
                    // console.log('🔁 WeChat 登录失败，向上抛出错误以便前端处理（then/catch）');
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
                // console.log('📂 用户数据缓存加载完成');
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
                // console.log('📊 游戏数据加载成功');
                return parsedData;
            }
            // console.log('📊 没有游戏数据（新用户）');
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
                // console.log('✅ 找到 OvoAstar4 模块');
                return window.OvoAstar4.getInstance();
            } else {
                console.warn('⚠️ OvoAstar4 模块未加载');
                return null;
            }
        }
        if (type === 8) {
            if (window.OvoAstar8) {
                // console.log('✅ 找到 OvoAstar8 模块');
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
        } 
        // else {
        //     console.log(`📊 用户 ${userId} 当前最高解锁等级: ${currentMax}, 合成等级: ${newEggType} (无需更新)`);
        // }

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
            
            // console.log('🔁 跳过 cardBoosts 恢复，使用代码默认值');

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
        // console.log('🔄 清除选择状态');
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
            // console.log('🆕 新用户，跳过排行榜更新');
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
                // console.log(`📍 找到路径，步数: ${path.length}`);
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
            // console.log(`🎯 强制使用登录方式: ${this.loginConfig.forceLoginType}`);
            return this.loginConfig.forceLoginType;
        }

        // 🔥 模拟登录检测
        if (this.loginConfig.enableMockLogin) {
            // 检查URL参数
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('mock_wechat') === 'true') {
                // console.log('🔍 URL参数强制微信模拟');
                return 'wechat';
            }

            // 随机模拟微信环境
            if (Math.random() < this.loginConfig.mockWechatProbability) {
                // console.log('🔍 随机模拟微信环境');
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
            // removed by dead control flow
{}

            // 模拟50%概率是老用户
            // removed by dead control flow
{}

            // removed by dead control flow
{}
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
        // console.log('🔐 加载Google用户数据...');

        try {
            // 获取Google用户信息
            const userInfo = await this.getGoogleUserInfo();

            // 尝试从云存档加载
            const cloudData = await this.loadFromGoogleCloud(userInfo.id);

            if (cloudData) {
                // console.log('☁️ 从Google云存档恢复数据');
                return {
                    ...cloudData,
                    loginType: 'google',
                    userInfo: userInfo,
                    lastLoginTime: Date.now()
                };
            } else {
                // console.log('👶 Google新用户，创建初始数据');
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
        // console.log('💾 加载本地用户数据...');

        try {
            const userData = localStorage.getItem('gameUserData');
            if (userData) {
                const parsedData = JSON.parse(userData);
                // console.log('📂 本地数据加载成功');
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
        // console.log('👤 创建游客用户...');

        // 🔥 支持模拟登录延迟
        if (this.loginConfig.mockLoginDelay && this.loginConfig.mockLoginDelay > 0) {
            // console.log(`⏳ 模拟游客登录延迟 ${this.loginConfig.mockLoginDelay / 1000} 秒...`);
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

/***/ }),

/***/ 104:
/***/ (() => {

/**
 * 引导功能模块
 * 负责游戏引导的交互逻辑
 */
// console.log('📁 GuideLine.js 开始加载...');

class GuideLine {
    constructor() {
        this.engine = null;
        this.stage = null;
        this.exportRoot = null;
        this.gamebox = null;
        this.loadedSounds = null;
        this.gameData = null;

        // 引导相关
        this.guideGesture = null;
        this.pointSeats = [];
        this.currentPointIndex = 0;
        this.waitingForClick = false;
        this.expectedClickCellId = null;
        this.onGuideCompleteCallback = null;
        this.getCellDataCallback = null;
    }

    /**
     * 初始化引导模块
     * @param {Object} gameData - 游戏数据对象
     * @param {Function} onComplete - 引导完成回调
     * @param {Function} getCellData - 获取格子数据的回调
     */
    init(gameData, onComplete, getCellData) {
        // console.log('🎮 GuideLine 初始化...');
        
        this.engine = gameData.engine;
        this.stage = gameData.stage;
        this.exportRoot = gameData.exportRoot;
        this.gamebox = gameData.gamebox;
        this.loadedSounds = gameData.loadedSounds;
        this.gameData = gameData.gameData;
        this.onGuideCompleteCallback = onComplete;
        this.getCellDataCallback = getCellData;
    }

    

    /**
     * 显示指示位置（不创建指示圈，仅记录位置）
     */
    showPointSeats(pointSeat) {
        if (!pointSeat || pointSeat.length === 0) {
            // console.log('📍 没有指示位置');
            this.pointSeats = [];
            return;
        }

        // 保存有效的指示位置
        this.pointSeats = pointSeat.filter(seat => seat >= 0);
        this.currentPointIndex = 0; // 当前指示位置索引

        // console.log(`📍 记录了 ${this.pointSeats.length} 个指示位置:`, this.pointSeats);
    }

    /**
     * 初始化引导手势
     */
    initGuideGesture() {
        // console.log('👆 初始化引导手势...');

        // 检查用户类型，决定是否需要引导
        const shouldShowGuide = this.shouldShowGuideForUser();

        if (!shouldShowGuide) {
            // console.log('👤 老用户无需引导，跳过引导功能');
            return;
        }

        // 查找场景中的引导手势元件
        this.findGuideGesture();

        // 如果找到引导手势且有指示位置，开始引导流程
        if (this.guideGesture && this.pointSeats && this.pointSeats.length > 0) {
            this.startGuideProcess();
        } else {
            console.log('📍 没有引导手势或指示位置，跳过引导');
        }
    }

    /**
     * 判断是否需要为当前用户显示引导
     * @returns {boolean} 是否需要显示引导
     */
    shouldShowGuideForUser() {
        // 从游戏数据中获取用户状态
        if (this.gameData && this.gameData.isNewUser !== undefined) {
            const isNewUser = this.gameData.isNewUser;
            // console.log(`🔍 用户类型检查: ${isNewUser ? '新用户' : '老用户'}`);
            return isNewUser;
        }

        // 如果没有用户数据，默认显示引导（安全起见）
        // console.log('⚠️ 无法确定用户类型，默认显示引导');
        return true;
    }

    /**
     * 查找引导手势元件
     */
    findGuideGesture() {
        // console.log('🔍 查找引导手势元件 guide_mc...');

        // 使用 utile 工具类查找元件
        this.guideGesture = utile.findMc(this.exportRoot, 'guide_mc');

        if (this.guideGesture) {
            // console.log('✅ 找到引导手势元件 guide_mc:', this.guideGesture);
            // 初始时隐藏引导手势
            this.guideGesture.visible = false;
        } else {
            console.warn('⚠️ 未找到引导手势元件 guide_mc');
            // 打印可用的子元件名称用于调试
            // console.log('📋 打印可用元件列表以便调试:');
            utile.logAvailableChildren(this.exportRoot);
        }
    }

    /**
     * 移动引导手势到目标位置
     */
    moveGuideGestureToTarget() {
        if (!this.guideGesture) {
            // console.log('📍 没有引导手势，跳过引导');
            return;
        }

        if (!this.pointSeats || this.pointSeats.length === 0) {
            // console.log('📍 没有有效的指示位置，隐藏引导手势');
            this.guideGesture.visible = false;
            return;
        }

        // 移动到当前指示位置
        this.moveGuideToCurrentPoint();
    }

    /**
     * 移动引导手势到当前指示点
     */
    moveGuideToCurrentPoint() {
        if (this.currentPointIndex >= this.pointSeats.length) {
            // console.log('🎉 所有指示点都已完成，隐藏引导手势');
            this.hideGuideGesture();
            this.completeGuideProcess();
            return;
        }

        const targetCellId = this.pointSeats[this.currentPointIndex];
        const cellData = this.getCellDataCallback ? this.getCellDataCallback(targetCellId) : null;

        if (cellData) {
            // console.log(`👆 移动引导手势到格子 ${targetCellId} (${cellData.centerX}, ${cellData.centerY}) - 第 ${this.currentPointIndex + 1} 个指示点`);

            // 计算引导手势的正确位置
            const guidePosition = this.calculateGuidePosition(cellData);

            // console.log(`📍 引导手势坐标调整: 格子坐标(${cellData.centerX}, ${cellData.centerY}) -> 引导坐标(${guidePosition.x}, ${guidePosition.y})`);

            // 设置引导手势位置
            this.guideGesture.x = guidePosition.x;
            this.guideGesture.y = guidePosition.y;
            this.guideGesture.visible = true;

            // 添加动画效果
            this.animateGuideGesture();

            // 设置等待点击状态
            this.waitingForClick = true;
            this.expectedClickCellId = targetCellId;

            // console.log(`⏳ 等待用户点击格子 ${targetCellId}`);
        } else {
            console.warn(`⚠️ 格子 ${targetCellId} 数据不存在`);
        }
    }

    /**
     * 计算引导手势的正确位置
     */
    calculateGuidePosition(cellData) {
        if (!this.guideGesture || !this.gamebox) {
            // 如果没有 gamebox 或引导手势，直接使用格子坐标
            return { x: cellData.centerX, y: cellData.centerY };
        }

        // 检查引导手势的父容器
        const guideParent = this.guideGesture.parent;
        // console.log(`🔍 引导手势父容器:`, guideParent?.constructor?.name || 'unknown');
        // console.log(`🔍 gamebox 容器:`, this.gamebox?.constructor?.name || 'unknown');

        // 如果引导手势在 exportRoot 中，而格子坐标是相对于 gamebox 的
        if (guideParent === this.exportRoot && this.gamebox !== this.exportRoot) {
            // 需要将 gamebox 相对坐标转换为 exportRoot 绝对坐标
            const gameboxX = this.gamebox.x || 0;
            const gameboxY = this.gamebox.y || 0;

            // console.log(`📐 坐标转换: gamebox偏移(${gameboxX}, ${gameboxY})`);

            return {
                x: cellData.centerX + gameboxX,
                y: cellData.centerY + gameboxY
            };
        }

        // 如果引导手势和格子在同一个坐标系中，直接使用格子坐标
        return { x: cellData.centerX, y: cellData.centerY };
    }

    /**
     * 引导手势动画
     */
    animateGuideGesture() {
        if (!this.guideGesture) return;

        // console.log('✨ 启动引导手势动画');

        // 停止之前的动画
        createjs.Tween.removeTweens(this.guideGesture);

        // 创建点击动画：缩放 + 透明度变化
        createjs.Tween.get(this.guideGesture, { loop: true })
            .to({ scaleX: 1.2, scaleY: 1.2, alpha: 0.8 }, 600, createjs.Ease.sineInOut)
            .to({ scaleX: 1.0, scaleY: 1.0, alpha: 1.0 }, 600, createjs.Ease.sineInOut)
            .wait(500);
    }

    /**
     * 隐藏引导手势
     */
    hideGuideGesture() {
        if (this.guideGesture) {
            // console.log('👆 隐藏引导手势');
            createjs.Tween.removeTweens(this.guideGesture);
            this.guideGesture.visible = false;
        }
    }

    /**
     * 显示引导手势
     */
    showGuideGesture() {
        if (this.guideGesture) {
            // console.log('👆 显示引导手势');
            this.guideGesture.visible = true;
            this.animateGuideGesture();
        }
    }

    /**
     * 重置引导状态
     */
    resetGuideState() {
        // console.log('🔄 重置引导状态');
        this.currentPointIndex = 0;
        this.waitingForClick = false;
        this.expectedClickCellId = null;

        if (this.guideGesture) {
            createjs.Tween.removeTweens(this.guideGesture);
            this.guideGesture.visible = false;
        }
    }

    /**
     * 开始引导流程
     */
    startGuideProcess() {
        // console.log('🎯 开始引导流程');
        this.resetGuideState();
        this.moveGuideToCurrentPoint();
    }

    /**
     * 完成引导流程
     */
    completeGuideProcess() {
        // console.log('🎊 引导流程完成！');

        // 重置所有引导相关状态
        this.resetGuideState();

        // 引导完成回调
        if (this.onGuideCompleteCallback) {
            this.onGuideCompleteCallback();
        }

        // console.log('💡 现在你可以点击蛋选中它，然后点击空格子移动蛋进行合成！');
    }

    /**
     * 引导点击成功处理
     */
    onGuideClickSuccess(cellId) {
        // console.log(`🎯 引导点击成功: 格子 ${cellId}`);

        // 取消等待状态
        this.waitingForClick = false;
        this.expectedClickCellId = null;

        // 移动到下一个指示点
        this.currentPointIndex++;

        // 延迟一下再移动到下一个位置，让用户看到反馈
        setTimeout(() => {
            this.moveGuideToCurrentPoint();
        }, 500);
    }

    /**
     * 检查是否在等待引导点击
     */
    isWaitingForGuideClick(cellId) {
        return this.waitingForClick && this.expectedClickCellId === cellId;
    }
}

// 创建全局实例
window.GuideLine = new GuideLine();
// console.log('✅ GuideLine 模块加载完成');

/***/ }),

/***/ 289:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _utile_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(911);

// import tracker from './tracker.js'; // Removed - now using window.gtag directly
/**
 * 游戏场景管理器
 * 负责游戏的主要逻辑和交互
 */
// console.log('📁 GameScense.js 开始加载...');
class GameScense {
    constructor() {
        this.engine = null;
        this.stage = null;
        this.exportRoot = null;
        this.canvas = null;
        // this.config = null;
        this.loadedSounds = null;
        this.loadedImages = null;

        // 游戏场景元件
        this.gamebox = null;
        this.tipsPanel = null; // 提示面板
        this.showFps = false; // 是否显示FPS

        // 游戏运行状态
        this.gameRunState = 'init'; // init, playing, paused, ended
        this.isInitialized = false;

        this.selectedDifficulty = 'easy';

        // 游戏数据相关
        this.gameData = null;
        this.userStatus = null;

        // 引导相关
        this.guideGesture = null;
        this.guidePoints = []; // 引导点列表
        this.pointSeats = [];
        this.currentPointIndex = 0;
        this.waitingForClick = false;
        this.expectedClickCellId = null;

        // 开始选择
        this.startMc = null;

        // 奖励
        this.cardGame = null;
        this.cardGameReady = false;

        // 元件移动相关
        this.selectedPiece = null;        // 当前选中的元件
        this.selectedCellId = null;       // 选中元件所在的格子ID
        this.isWaitingForTarget = false;  // 是否等待选择目标位置
        this.selectionIndicator = null; // 选中指示器

        // 游戏数据状态
        this.gameDataState = {
            cells: {},           // 格子状态 {cellId: {hasEgg: boolean, eggType: number, piece: object}}
            selectedEgg: null,   // 当前选中的蛋 {cellId, eggType, isSelected}
            score: 0,           // 当前分数
            isProcessing: false // 是否正在处理操作
        };


    }

    /**
     * 初始化UI元件
     */
    async initUIElements() {
        console.log('🎨 初始化UI元件...');

        try {
            // 验证 exportRoot
            if (!this.exportRoot || !this.exportRoot.children) {
                console.warn('⚠️ exportRoot 仍然无效，跳过UI初始化');
                return;
            }

            this.gamebox = _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.findMc(this.exportRoot, 'gamebox');

            // 初始化失败和胜利界面（隐藏状态）

            // 添加点击事件监听
            if (this.gamebox && !this.gamebox.hasEventListener("click")) {
                this.gamebox.on('click', this.onGameboxClick, this);
            }

            const mc_start_over = _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.findMc(this.exportRoot, 'mc_start_over');
            if (mc_start_over) {
                mc_start_over.visible = false; // 初始隐藏重新开始界面
                const btn_yes = _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.findMc(mc_start_over, 'btn_yes');

                btn_yes.on('click', (event) => {
                    // console.log('🔄 重新开始界面点击重新开始按钮');
                    event.stopPropagation();
                    this.engine.playSound('select_wawa');
                    // 调用插页广告
                    ovo.showInterstitialAd(() => {
                        // 广告关闭后的回调
                        this.showPanel(mc_start_over, false, () => {

                            // increment restart confirmation count for guest users
                            try {
                                const key = 'guest_restart_confirm_count';
                                let count = parseInt(localStorage.getItem(key) || '0', 10) || 0;
                                count += 1;
                                localStorage.setItem(key, String(count));
                                // emit tracking event using ovo method
                                if (typeof window.ovo !== 'undefined' && typeof window.ovo.dotSelectContent === 'function') {
                                    window.ovo.dotSelectContent('game_action', 'restart_confirm');
                                }
                            } catch (e) {
                                // ignore storage/tracker errors
                            }

                            this.resetGame(false);
                        });
                    });
                });
                const btn_no = _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.findMc(mc_start_over, 'btn_no');

                btn_no.on('click', (event) => {
                    // console.log('🔄 重新开始界面点击不再重新开始按钮');
                    event.stopPropagation();
                    this.engine.playSound('select_wawa');
                    // 调用插页广告
                    ovo.showInterstitialAd(() => {

                        mc_start_over.visible = false; // 隐藏重新开始界面
                    });
                });
            }

            // 查找并绑定重新开始按钮
            const btnRestart = _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.findMc(this.exportRoot, 'btn_restart');
            if (btnRestart) {

                btnRestart.on('click', (event) => {
                    console.log('🔄 点击重新开始按钮 (btn_restart)');
                    event.stopPropagation();
                    this.engine.playSound('select_wawa');
                    this.showPanel(mc_start_over, true);

                });
                // console.log('✅ btn_restart 按钮事件已绑定');
            }

            const failureMc = _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.findMc(this.exportRoot, 'mc_failure');
            if (failureMc) {
                failureMc.visible = false; // 初始隐藏失败界面

                // 查找屏蔽层
                const blockLayer = _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.findMc(failureMc, 'blockLayer');
                if (blockLayer) {
                    blockLayer.mouseEnabled = true;

                    // 绑定屏蔽层点击事件
                    if (!blockLayer.hasEventListener("click")) {
                        blockLayer.on('click', function (event) {
                            // console.log('🛡️ 失败界面屏蔽层拦截了点击事件');
                            event.stopImmediatePropagation();
                            event.stopPropagation();
                            event.preventDefault();
                            return false;
                        });
                    }
                }

                // 查找重新开始按钮 (btnagain)
                const btnAgain = _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.findMc(failureMc, 'btn_tryagain');
                // utile.goStop(btnAgain, true)
                btnAgain.gotoAndStop(0);

                if (btnAgain && !btnAgain.hasEventListener("click")) {

                    // 绑定重新开始按钮事件
                    btnAgain.on('click', (event) => {
                        // console.log('🔄 失败界面点击重新开始按钮');
                        event.stopPropagation();

                        // 调用插页广告
                        ovo.showInterstitialAd(() => {
                            // 广告关闭后的回调
                            this.failureHandler(false);
                        });
                    });

                    // 确保按钮在屏蔽层之上
                    if (blockLayer) {
                        failureMc.setChildIndex(btnAgain, failureMc.children.length - 1);
                    }

                    // console.log('✅ 失败界面重新开始按钮事件已绑定');
                }
            }

            const victoryMc = _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.findMc(this.exportRoot, 'mc_victory');
            if (victoryMc) {
                victoryMc.visible = false; // 初始隐藏胜利界面
                // 查找屏蔽层
                const blockLayer = _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.findMc(victoryMc, 'blockLayer');
                if (blockLayer) {
                    blockLayer.mouseEnabled = true;

                    // 绑定屏蔽层点击事件
                    if (!blockLayer.hasEventListener("click")) {
                        blockLayer.on('click', function (event) {
                            // console.log('🛡️ 胜利界面屏蔽层拦截了点击事件');
                            event.stopImmediatePropagation();
                            event.stopPropagation();
                            event.preventDefault();
                            return false;
                        });
                    }
                }

                // 查找重新开始按钮 (btnagain)
                const btnAgain = _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.findMc(victoryMc, 'btn_playagain');
                if (btnAgain && !btnAgain.hasEventListener("click")) {

                    // 绑定重新开始按钮事件
                    btnAgain.on('click', (event) => {
                        // console.log('🔄 胜利界面点击重新开始按钮');
                        event.stopPropagation();

                        // 调用插页广告
                        ovo.showInterstitialAd(() => {
                            // 广告关闭后的回调
                            this.victoryHandler(false);
                        });
                    });

                    // 确保按钮在屏蔽层之上
                    if (blockLayer) {
                        victoryMc.setChildIndex(btnAgain, victoryMc.children.length - 1);
                    }

                    // console.log('✅ 胜利界面重新开始按钮事件已绑定');
                }
            }


            /**
             * 设置界面
             */

            const settingsMc = _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.findMc(this.exportRoot, 'mc_settings');
            if (settingsMc) {
                settingsMc.visible = false; // 初始隐藏设置界面
                const btnSetting = _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.findMc(this.exportRoot, 'btn_setting');

                if (btnSetting) {
                    // 绑定设置按钮事件
                    btnSetting.on('click', () => {
                        event.stopPropagation();
                        this.engine.playSound("select_wawa")
                        
                        this.showPanel(settingsMc, true, () => {
                            // console.log('✅ 设置界面显示完成');
                            this.selectedDifficulty = window.GameServer.getDifficulty();

                            this.selectDifficulty(this.selectedDifficulty, this.difficultyMap); // 更新按钮状态
                        });
                    });
                    // console.log('✅ btn_setting 按钮事件已绑定');
                }

                const btn_clos_setting = _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.findMc(settingsMc, 'btn_clos_setting');

                btn_clos_setting.on('click', () => {
                    this.engine.playSound("select_wawa")
                    this.showPanel(settingsMc, false, () => {
                        console.log('🔧 设置界面已关闭');
                    });
                });


                const isMusicEnabled = (localStorage.getItem('musicEnabled') === null) ||
                    localStorage.getItem('musicEnabled') === 'true';
                const isSoundEnabled = (localStorage.getItem('soundEnabled') === null) ||
                    localStorage.getItem('soundEnabled') === 'true';
                const isVibrationEnabled = (localStorage.getItem('vibrationEnabled') === null) ||
                    localStorage.getItem('vibrationEnabled') === 'true';


                // 音乐
                const btn_bg = _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.findMc(settingsMc, 'mc_sound_bg');
                if (btn_bg) {
                    // 约定：帧0 = 开启图标，帧1 = 关闭图标
                    btn_bg.gotoAndStop(isMusicEnabled ? 0 : 1);

                    btn_bg.removeAllEventListeners('click');
                    btn_bg.on('click', () => {
                        const current = localStorage.getItem('musicEnabled') === null || localStorage.getItem('musicEnabled') === 'true';
                        const next = !current;
                        btn_bg.gotoAndStop(next ? 0 : 1);
                        if (this.engine) {
                            this.engine.setMusicEnabled(next);
                        } else {
                            localStorage.setItem('musicEnabled', next ? 'true' : 'false');
                        }
                        console.log(`🎵 音乐状态已切换 -> ${next ? 'ON' : 'OFF'}`);
                    });
                }

                const btn_eff = _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.findMc(settingsMc, 'mc_sound_eff');
                if (btn_eff) {
                    btn_eff.gotoAndStop(isSoundEnabled ? 0 : 1);
                    btn_eff.removeAllEventListeners('click');
                    btn_eff.on('click', () => {
                        const current = localStorage.getItem('soundEnabled') === null || localStorage.getItem('soundEnabled') === 'true';
                        const next = !current;
                        btn_eff.gotoAndStop(next ? 0 : 1);
                        if (this.engine) {
                            this.engine.setSoundEnabled(next);
                        } else {
                            localStorage.setItem('soundEnabled', next ? 'true' : 'false');
                        }
                        console.log(`🔊 音效状态已切换 -> ${next ? 'ON' : 'OFF'}`);
                    });
                }

                // 震动
                const btn_vibra = _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.findMc(settingsMc, 'mc_vibra');
                if (btn_vibra) {
                    btn_vibra.gotoAndStop(isVibrationEnabled ? 0 : 1);
                    btn_vibra.removeAllEventListeners('click');
                    btn_vibra.on('click', () => {
                        const current = localStorage.getItem('vibrationEnabled') === null || localStorage.getItem('vibrationEnabled') === 'true';
                        const next = !current;
                        btn_vibra.gotoAndStop(next ? 0 : 1);
                        localStorage.setItem('vibrationEnabled', next ? 'true' : 'false');
                        console.log(`📳 震动状态已切换 -> ${next ? 'ON' : 'OFF'}`);
                    });
                }


            }


            const btn_easy = _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.findMc(settingsMc, 'mc_diff_easy');
            const btn_nolrmal = _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.findMc(settingsMc, 'mc_diff_normal');
            const btn_hard = _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.findMc(settingsMc, 'mc_diff_hard');

            let btns = [btn_easy, btn_nolrmal, btn_hard];
            this.difficultyMap = {
                easy: btn_easy,
                normal: btn_nolrmal,
                hard: btn_hard
            };

            for (let i = 0; i < btns.length; i++) {
                const btn = btns[i];
                btn.on('click', () => {
                    // console.log(`🔧 切换难度到 ${btn.name}`);
                    this.selectedDifficulty = btn.name.replace('mc_diff_', '');

                    if (this.userStatus.isNewUser) {
                        this.tips('🚫 新手引导模式下无法切换难度');
                        return;
                    }

                    this.selectDifficulty(this.selectedDifficulty, this.difficultyMap); // 更新按钮状态

                    // 同步难度到后端
                    if (window.GameServer) {
                        window.GameServer.updateDifficulty(this.selectedDifficulty);
                        console.log(`🔄 难度已同步到后端: ${this.selectedDifficulty}`);
                    } else {
                        console.warn('⚠️ 后端 GameServer 未初始化');
                    }
                });
            }

            this.showFps = localStorage.getItem('fpsNum') === "60" || 60; // 默认60FPS

            // const btn_fps = utile.findMc(settingsMc, 'mc_fps');
            // btn_fps.on('click', () => {
            //     // console.log('🔧 切换FPS显示状态');
            //     this.showFps = !this.showFps;
            //     btn_fps.gotoAndStop(this.showFps ? 0 : 1); // 播放/停止状态
            //     localStorage.setItem('fpsNum', this.showFps ? "60" : "30"); // 保存到本地存储
            // });

            const blockLayer = _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.findMc(settingsMc, 'blockLayer');
            if (blockLayer) {
                blockLayer.mouseEnabled = true;

                // 绑定屏蔽层点击事件
                if (!blockLayer.hasEventListener("click")) {
                    blockLayer.on('click', function (event) {
                        // console.log('🛡️ 设置界面屏蔽层拦截了点击事件');
                        event.stopImmediatePropagation();
                        event.stopPropagation();
                        event.preventDefault();
                        return false;
                    });
                }
            }

            // 初始化解锁动画元件
            this.initUnlockAnimations();

            // const cardReward = utile.findMc(failureMc, 'mc_card_reward');
            // if (cardReward) {
            //     cardReward.visible = false;
            //     cardReward.gotoAndStop && cardReward.gotoAndStop(0);
            //     // console.log('🎴 抽卡面板已默认隐藏');
            // }


            this.exportRoot.visible = true;

            // console.log('✅ UI元件初始化完成');
        } catch (error) {
            console.error('❌ UI元件初始化失败:', error);
        }
    }

    // 惰性初始化抽卡
    async ensureCardGame() {
        if (this.cardGameReady) return;
        if (typeof window.CardGame !== 'function') {
            console.warn('⚠️ CardGame 类尚未加载');
            return;
        }
        this.cardGame = new window.CardGame();
        try {
            await this.cardGame.init({
                stage: this.stage,
                exportRoot: this.exportRoot,
                engine: this.engine,
                scene: this, // 传入gamescense实例，让CardGame可以调用failureHandler和tips方法
                loadedSounds: this.loadedSounds
            });
            this.cardGameReady = true;
            // console.log('✅ CardGame 初始化完成');
        } catch (e) {
            console.error('❌ CardGame 初始化失败:', e);
        }
    }

    // 打开抽卡面板（胜利/失败后调用）
    async openCardRewardPanel(delay = 800) {
        await this.ensureCardGame();
        if (!this.cardGame || !this.cardGame.card_reward_Mc) {
            console.warn('⚠️ 抽卡面板不可用');
            return;
        }
        setTimeout(() => {
            this.cardGame.card_reward_Mc.visible = true;
            this.cardGame.card_reward_Mc.gotoAndStop && this.cardGame.card_reward_Mc.gotoAndStop(0);
            // console.log('🎴 抽卡面板已显示，等待玩家点击 GO');
        }, delay);
    }

    // 关闭抽卡面板
    closeCardRewardPanel() {
        if (!this.cardGame || !this.cardGame.card_reward_Mc) return;
        const panel = this.cardGame.card_reward_Mc;
        if (!panel.visible) return;

        createjs.Tween.removeTweens(panel);
        createjs.Tween.get(panel)
            .to({ scaleX: 1.05, scaleY: 1.05 }, 100)
            .to({ scaleX: 0.2, scaleY: 0.2, alpha: 0 }, 180, createjs.Ease.quadIn)
            .call(() => {
                panel.visible = false;
                panel.alpha = 1;
                panel.scaleX = panel.scaleY = 1;
                // 复位 GO 按钮状态
                if (this.cardGame.goButton) {
                    this.cardGame.goButton.mouseEnabled = true;
                }
                // console.log('🎴 抽卡面板已关闭');
            });
    }
    /**
     * 初始化游戏场景
     * @param {Object} sysData - 系统数据对象
     */
    async init(sysData) {

        // 初始化UI
        try {

            // console.log('🎮 GameScense 初始化开始...');

            // 保存游戏数据
            this.engine = sysData.engine;
            this.stage = sysData.stage;
            this.exportRoot = sysData.exportRoot;
            this.canvas = sysData.canvas;
            this.config = sysData.config;
            this.loadedSounds = sysData.loadedSounds;
            this.loadedImages = sysData.loadedImages;

            this.difficultySelectionEnabled = false; //难度

            this.maxUnlockedLevel = 1; // 初始只解锁等级1
            this.isProcessingClick = false; // 防抖标识
            this.clickDebounceTime = 300; // 防抖时间（毫秒）

            // 初始化游戏系统
            await this.initUIElements();
            await this.initGameSystems();
            this.initTipsPanel();
            // this.startBackgroundMusic();
            // this.playUnlockedAnimations(this.userStatus);

            // 保存用户数据和游戏配置
            this.userStatus = sysData.userStatus;


            // console.log('👤 接收到用户状态:', this.userStatus);
            // console.log('🎯 接收到游戏配置:', this.gameData);


            const isNewUser = this.userStatus?.isNewUser;
            // console.log(`👤 用户类型检查: ${isNewUser ? '新用户' : '老用户'}`);

            if (isNewUser) {
                //     // 🔥 新用户：直接使用默认中等难度，不显示选择界面
                //     console.log('👶 新用户跳过难度选择，使用默认中等难度');

                this.waitingForClick = true;
                // 初始化引导系统
                this.initGuideGesture();

            }

            const gameConfig = await window.GameServer.getGameData(
                this.userStatus,
                this.selectedDifficulty
            );
            this.gameData = gameConfig;
            // console.log('🎯 获取到游戏配置:', gameConfig);

            // 验证游戏数据
            // this.verifyGameData();

            // 处理初始化后的逻辑
            setTimeout(() => {
                this.generateUserEggs();

                // 测试奖励
                // this.openCardRewardPanel(800);
            }, 1000);

            this.isInitialized = true;
            // console.log('✅ GameScense 初始化完成');

        } catch (error) {
            console.error('❌ GameScense 初始化失败:', error);
        }
    }


    /**
     * 为用户生成蛋（使用服务器返回的数据）
     */
    async generateUserEggs() {
        // console.log('🥚 生成蛋...');

        try {

            // 从游戏数据中获取蛋配置
            if (this.gameData && this.gameData.data) {

                const { eggSeat, eggType, pointSeat } = this.gameData.data;

                // 🔥 处理分数恢复
                if (this.gameData.scoreSystem) {
                    // console.log('💰 恢复分数数据:', this.gameData.scoreSystem);
                    this.updateScoreDisplayDirectly(this.gameData.scoreSystem);

                }

                this.playUnlockedAnimations(this.gameData.unlockData)

                this.selectedDifficulty = this.gameData.difficulty;

                if (this.userStatus.isNewUser) {
                    if (pointSeat.length > 0) {
                        this.expectedClickCellId = pointSeat[0];
                        setTimeout(() => {

                            this.moveGuideGestureToCell(pointSeat[0]);
                        }, 500);
                    }

                }
                if (eggSeat && eggType && eggSeat.length === eggType.length) {
                    // console.log(`📊 使用服务器数据生成蛋: 位置[${eggSeat}], 类型[${eggType}]`);

                    this.playLongbossAnimation();

                    // 同时创建所有蛋
                    const createEggPromises = eggSeat.map((cellId, index) =>
                        this.createEggAtPosition(cellId, eggType[index])
                    );

                    await Promise.all(createEggPromises);

                    // utile.__sdklog(`✅ 成功为生成 ${eggSeat.length} 个蛋`, this.chessboard);
                }
            }
        } catch (error) {
            console.error('❌ 蛋生成失败:', error);

        }
    }

    /**
     * 锁定游戏交互
     * @param {string} reason - 锁定原因
     */
    lockGameInteraction(reason = '处理中') {
        this.isGameLocked = true;
        this.lockReason = reason;
        // console.log(`🔒 游戏交互已锁定: ${reason}`);
    }

    /**
     * 解锁游戏交互
     */
    unlockGameInteraction() {
        const previousReason = this.lockReason;
        this.isGameLocked = false;
        this.lockReason = '';
        // console.log(`🔓 游戏交互已解锁，之前锁定原因: ${previousReason}`);
    }


    /**
     * 检查游戏是否可以交互
     * @returns {boolean} 是否可以交互
     */
    canInteract() {
        if (this.isGameLocked) {
            // console.log(`⛔ 游戏交互被锁定: ${this.lockReason}`);
            return false;
        }

        if (this.isProcessingClick) {
            // console.log('⛔ 正在处理点击，请稍候');
            return false;
        }

        return true;
    }


    /**
     * 初始化游戏系统
     */
    async initGameSystems() {
        // console.log('🎯 初始化游戏系统...');

        try {
            // 1. 从 GameServer 获取地图配置
            await this.initMapFromServer();

            // 2. 获取游戏场景中的 gamebox 元件
            // this.getGamebox();

            // 3. 初始化游戏元素
            this.initGoldDisplay();

            // 4. 设置事件监听
            // this.setupEventListeners();



            // console.log('✅ 游戏系统初始化完成');

        } catch (error) {
            console.error('❌ 游戏系统初始化失败:', error);
        }
    }

    /**
     * 从 GameServer 初始化地图配置
     */
    async initMapFromServer() {
        // console.log('🗺️ 从 GameServer 获取地图配置...');

        try {
            // 等待 GameServer 地图系统初始化完成
            if (!window.GameServer.mapState.isInitialized) {
                // console.log('⏳ 等待 GameServer 地图系统初始化...');
                // 可以添加轮询或事件监听来等待初始化完成
                await this.waitForMapInitialization();
            }

            // 获取地图配置
            const mapInfo = window.GameServer.getMapStateInfo();
            // console.log('📊 地图配置信息:', mapInfo);

            // 使用后端完整配置
            this.chessboard = {
                // 基础配置
                rows: mapInfo.config.rows,
                cols: mapInfo.config.cols,
                cellWidth: mapInfo.config.cellWidth,
                cellHeight: mapInfo.config.cellHeight,
                totalCells: mapInfo.config.totalCells,

                // 渲染配置
                width: mapInfo.config.width,
                height: mapInfo.config.height,
                offsetX: mapInfo.config.offsetX,
                offsetY: mapInfo.config.offsetY,

                // 前端渲染管理
                pieces: new Map()
            };

            // console.log(`✅ 地图配置获取完成: ${this.chessboard.rows}x${this.chessboard.cols}`);

        } catch (error) {
            console.error('❌ 地图配置获取失败:', error);
            // 使用默认配置（与后端保持一致）
            this.chessboard = {
                rows: 6,
                cols: 6,
                cellWidth: 150,
                cellHeight: 150,
                totalCells: 36,
                width: 900,
                height: 900,
                offsetX: 0,
                offsetY: 0,
                pieces: new Map()
            };
        }
    }

    /**
     * 等待地图初始化完成
     */
    async waitForMapInitialization() {
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                if (window.GameServer && window.GameServer.mapState.isInitialized) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100); // 每100ms检查一次

            // 设置超时
            setTimeout(() => {
                clearInterval(checkInterval);
                console.warn('⚠️ 等待地图初始化超时');
                resolve();
            }, 5000); // 5秒超时
        });
    }


    /**
     * 移动元件到指定位置（带寻路动画）
     * @param {Object} piece - 要移动的元件
     * @param {number} fromCellId - 起始格子ID
     * @param {number} toCellId - 目标格子ID
     * @param {Function} onComplete - 移动完成回调
     */
    moveElementWithPathfinding(piece, fromCellId, toCellId, onComplete) {
        // console.log(`🚶 开始寻路移动: ${fromCellId} -> ${toCellId}`);

        // 寻找路径
        const pathCellIds = this.findMovePath(fromCellId, toCellId);

        if (pathCellIds.length === 0) {
            console.warn('⚠️ 无法找到移动路径');
            if (onComplete) onComplete(false);
            return;
        }

        // 执行路径动画
        this.animateAlongPath(piece, pathCellIds, onComplete);
    }

    /**
     * 沿路径执行动画
     * @param {Object} piece - 要移动的元件
     * @param {Array} pathCellIds - 路径格子ID数组
     * @param {Function} onComplete - 完成回调
     */
    animateAlongPath(piece, pathCellIds, onComplete) {
        if (!piece || pathCellIds.length === 0) {
            if (onComplete) onComplete(false);
            return;
        }

        let currentIndex = 0;
        const moveSpeed = 100; // 每步移动时间(毫秒)

        const moveToNextCell = () => {
            // 播放点击音效

            if (currentIndex >= pathCellIds.length) {
                // console.log('✅ 路径移动完成');
                if (onComplete) onComplete(true);
                return;
            }

            const cellId = pathCellIds[currentIndex];
            const cellData = this.getCellData(cellId);

            if (cellData) {
                // console.log(`🚶 移动到格子 ${cellId} (${cellData.centerX}, ${cellData.centerY})`);
                if (this.engine && this.loadedSounds.has('popo')) {
                    this.engine.playSound('popo');
                }
                // 使用 CreateJS Tween 进行平滑移动
                createjs.Tween.get(piece)
                    .to({
                        x: cellData.centerX,
                        y: cellData.centerY,
                        scaleX: 1.1,
                        scaleY: 1.1,
                    }, moveSpeed, createjs.Ease.quadOut)
                    .to({
                        scaleX: 1,
                        scaleY: 1,
                    }, moveSpeed, createjs.Ease.quadOut)
                    .call(() => {

                        currentIndex++;
                        moveToNextCell();
                    });
            } else {
                console.error(`❌ 格子 ${cellId} 数据不存在`);
                if (onComplete) onComplete(false);
            }
        };

        moveToNextCell();
    }

    /**
     * 根据行列获取格子ID
     */
    getCellId(row, col) {
        return row * this.chessboard.cols + col;
    }

    /**
     * 根据格子ID获取行列
     */
    getRowCol(cellId) {
        const row = Math.floor(cellId / this.chessboard.cols);
        const col = cellId % this.chessboard.cols;
        return { row, col };
    }

    /**
     * 根据鼠标位置获取格子ID
     */
    getCellIdFromPosition(x, y) {
        // console.log(`🔍 计算格子位置: 点击坐标(${x}, ${y})`);

        // 获取偏移量（如果没有设置则为0）
        const offsetX = this.chessboard.offsetX || 0;
        const offsetY = this.chessboard.offsetY || 0;

        // 转换为相对于棋盘的坐标
        const localX = x - offsetX;
        const localY = y - offsetY;

        // console.log(`📐 转换后坐标: (${localX}, ${localY}), 偏移量: (${offsetX}, ${offsetY})`);
        // console.log(`📏 格子尺寸: ${this.chessboard.cellWidth} x ${this.chessboard.cellHeight}`);

        // 计算行列
        const col = Math.floor(localX / this.chessboard.cellWidth);
        const row = Math.floor(localY / this.chessboard.cellHeight);

        // console.log(`🎯 计算得到: 行${row}, 列${col}`);

        // 检查是否在有效范围内
        if (col >= 0 && col < this.chessboard.cols &&
            row >= 0 && row < this.chessboard.rows) {
            const cellId = this.getCellId(row, col);
            // console.log(`✅ 有效格子ID: ${cellId}`);
            return cellId;
        }

        console.log(`❌ 超出范围: 行${row}(0-${this.chessboard.rows - 1}), 列${col}(0-${this.chessboard.cols - 1})`);
        return -1; // 无效位置
    }

    /**
     * 根据格子ID计算位置（纯计算，不依赖数据）
     */
    getCellPosition(cellId) {
        const { row, col } = this.getRowCol(cellId);
        const x = col * this.chessboard.cellWidth;
        const y = row * this.chessboard.cellHeight;
        return {
            x: x,
            y: y,
            centerX: x + this.chessboard.cellWidth / 2,
            centerY: y + this.chessboard.cellHeight / 2
        };
    }



    /**
     * 获取格子数据（从 GameServer）
     */
    getCellData(cellId) {
        // 从 GameServer 获取格子数据
        if (window.GameServer && window.GameServer.mapState && window.GameServer.mapState.cells) {
            const serverCellData = window.GameServer.mapState.cells[cellId];
            if (serverCellData) {
                return {
                    id: serverCellData.id,
                    row: serverCellData.row,
                    col: serverCellData.col,
                    x: serverCellData.x,
                    y: serverCellData.y,
                    centerX: serverCellData.centerX,
                    centerY: serverCellData.centerY,
                    isEmpty: serverCellData.isEmpty,
                    hasEgg: serverCellData.hasEgg,
                    eggType: serverCellData.eggType,
                    piece: serverCellData.piece,
                    walkable: serverCellData.walkable,
                    occupied: serverCellData.occupied
                };
            }
        }

        console.warn(`⚠️ 无法从 GameServer 获取格子 ${cellId} 的数据`);
        return null;
    }


    /**
     * 🔥直接更新分数显示（不带动画）
     */
    updateScoreDisplayDirectly(dataScore) {
        try {
            const goldMc = this.exportRoot.mc_gold;
            if (goldMc && goldMc.text) {
                goldMc.text.text = "score: " + dataScore.totalScore;

            }

            const high_score = this.exportRoot.mc_high_score;
            if (high_score && high_score.text) {
                high_score.text.text = "best: " + dataScore.bestScore;
            }
        } catch (error) {
            console.error('❌ 更新分数显示失败:', error);
        }
    }

    /**
     * 验证接收到的游戏数据
     */
    // verifyGameData() {
    //     console.log('🔍 验证游戏数据...');
    //     console.log('📊 完整的 gameData:', JSON.stringify(this.gameData, null, 2));
    //     console.log('👤 完整的 userStatus:', JSON.stringify(this.userStatus, null, 2));

    //     if (this.gameData && this.gameData.data) {
    //         const { eggSeat, eggType, pointSeat } = this.gameData.data;
    //         console.log('🔍 解析出的数据:');
    //         console.log('  eggSeat:', eggSeat);
    //         console.log('  eggType:', eggType);
    //         console.log('  pointSeat:', pointSeat);

    //         // 验证数据类型和长度
    //         if (Array.isArray(eggSeat) && Array.isArray(eggType)) {
    //             console.log(`✅ 数据验证通过: ${eggSeat.length} 个蛋位置, ${eggType.length} 个蛋类型`);

    //             // 检查每个蛋的详细信息
    //             for (let i = 0; i < Math.min(eggSeat.length, eggType.length); i++) {
    //                 console.log(`  蛋 ${i + 1}: 位置=${eggSeat[i]}, 类型=${eggType[i]}`);
    //             }
    //         } else {
    //             console.error('❌ 数据格式错误: eggSeat 或 eggType 不是数组');
    //         }
    //     } else {
    //         console.error('❌ 没有有效的游戏数据');
    //     }
    // }


    /**
     * 从 exportRoot 获取蛋元件
     */
    getEggFromFlygame(type) {
        // console.log(`🔍 从 exportRoot 获取类型 ${type} 的蛋元件...`);

        const eggName = `egg_mc${type}`;

        try {
            // 使用 utile 工具类查找蛋元件
            const egg = _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.findMc(this.exportRoot, eggName);

            if (egg) {
                // console.log(`✅ 使用 utile.findMc 找到蛋元件: ${eggName}`);

                // 克隆元件以避免多次使用同一个实例
                const clonedEgg = egg.clone ? egg.clone() : this.cloneDisplayObject(egg);
                return clonedEgg;
            }

            console.warn(`⚠️ 在 exportRoot 中未找到蛋元件: ${eggName}`);
            this.logAvailableEggs();

            return null;

        } catch (error) {
            console.error(`❌ 从 exportRoot 获取蛋元件失败: ${eggName}`, error);
            return null;
        }
    }

    /**
     * 克隆显示对象（简单实现）
     */
    cloneDisplayObject(original) {
        try {
            // 如果有 clone 方法，直接使用
            if (original.clone) {
                return original.clone();
            }

            // 尝试创建新实例
            if (original.constructor) {
                const cloned = new original.constructor();

                // 复制基本属性
                cloned.x = original.x;
                cloned.y = original.y;
                cloned.scaleX = original.scaleX;
                cloned.scaleY = original.scaleY;
                cloned.rotation = original.rotation;
                cloned.alpha = original.alpha;
                cloned.visible = original.visible;

                return cloned;
            }

            console.warn('⚠️ 无法克隆元件，返回原始元件');
            return original;

        } catch (error) {
            console.error('❌ 克隆元件失败:', error);
            return original;
        }
    }

    /**
     * 打印 exportRoot 中可用的蛋元件
     */
    logAvailableEggs() {
        console.log('🥚 查找可用的蛋元件:');
        _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.logAvailableChildren(this.exportRoot);
    }



    /**
     * 显示指示位置（不创建指示圈，仅记录位置）
     */
    showPointSeats(pointSeat) {
        if (!pointSeat || pointSeat.length === 0) {
            console.log('📍 没有指示位置');
            this.pointSeats = [];
            return;
        }

        // 保存有效的指示位置
        this.pointSeats = pointSeat.filter(seat => seat >= 0);
        this.currentPointIndex = 0; // 当前指示位置索引

        console.log(`📍 记录了 ${this.pointSeats.length} 个指示位置:`, this.pointSeats);
    }





    /**
     * 递归查找子元件
     */
    findChildByName(parent, targetName) {
        if (!parent || !parent.children) return null;

        for (let child of parent.children) {
            // 检查当前子元件
            if (child.name === targetName) {
                return child;
            }

            // 递归检查子元件的子元件
            const found = this.findChildByName(child, targetName);
            if (found) {
                return found;
            }
        }

        return null;
    }




    /**
     * 重新开始当前关卡
     */
    restartCurrentLevel() {
        if (!this.gameData) {
            console.error('❌ 没有当前关卡数据');
            return false;
        }

        console.log(`🔄 重新开始关卡 - 等级: ${this.gameData.level}, 步骤: ${this.gameData.step}`);

        // 重新初始化棋盘
        this.initGameBoard();

        return true;
    }

    /**
     * 获取游戏场景中的 gamebox 元件
     */
    getGamebox() {
        console.log('🔍 查找 gamebox 元件...');

        if (!this.exportRoot) {
            throw new Error('exportRoot 未找到');
        }

        // 使用 utile.findMc 统一查找元件


        if (this.gamebox) {
            console.log('✅ 使用 utile.findMc 找到 gamebox:', this.gamebox);
            console.log(`📐 gamebox 位置: (${this.gamebox.x || 0}, ${this.gamebox.y || 0})`);
            console.log(`📏 gamebox 尺寸: ${this.gamebox.getBounds ? this.gamebox.getBounds() : 'unknown'}`);
            return;
        }

        this.gamebox = this.exportRoot;
    }

    /**
     * 格式化数字显示
     * @param {number} num - 数字
     * @returns {string} 格式化后的字符串
     */
    formatNumber(num) {
        if (num < 1000) return num.toString();
        if (num < 1000000) return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + 'k';
        if (num < 1000000000) return (num / 1000000).toFixed(1) + 'm';
        return (num / 1000000000).toFixed(1) + 'b';
    }

    /**
     * 初始化金币显示
     */
    initGoldDisplay() {
        console.log('💰 初始化金币显示...');

        try {
            // 获取金币显示元件
            const goldMc = this.exportRoot.mc_gold;
            if (goldMc && goldMc.text) {
                // 设置初始金币为0
                const totalScore = this.userStatus && this.userStatus.currentScore || 0;

                // 设置金币显示
                goldMc.text.text = "score: 0";
            } else {
                console.warn('⚠️ 未找到 mc_gold 或其 text 属性');
            }

            const high_score = this.exportRoot.mc_high_score;
            if (high_score && high_score.text) {
                // 设置初始最高分为0
                const bestScore = this.userStatus && this.userStatus.bestScore || 0;

                // 设置最高分显示
                high_score.text.text = "best: 0";
            }
            else {
                console.warn('⚠️ 未找到 mc_high_score 或其 text 属性');
            }
        } catch (error) {
            console.error('❌ 初始化金币显示失败:', error);
        }
    }


    /**
    * gamebox 点击事件处理
    */
    onGameboxClick(event) {
        // console.log('🖱️ gamebox 被点击:', event);

        // 获取点击位置相对于 gamebox 的坐标
        const localX = event.localX || event.stageX;
        const localY = event.localY || event.stageY;

        // console.log(`📍 点击坐标: (${localX}, ${localY})`);

        // 检查是否点击了蛋元件
        if (event.currentTarget.name !== this.gamebox.name) {
            // console.log('🥚 点击了蛋元件，忽略gamebox事件');
            return;
        }

        // 获取被点击的格子ID
        const cellId = this.getCellIdFromPosition(localX, localY);

        if (cellId >= 0) {
            const { row, col } = this.getRowCol(cellId);
            // console.log(`🎯 点击格子 ${cellId} (行:${row}, 列:${col})`);

            // 处理格子点击逻辑
            this.handleCellClick(cellId);
        } else {
            // console.log('🖱️ 点击了棋盘外区域');
        }

        // 播放点击音效
        // if (this.engine && this.loadedSounds.has('open')) {
        //     this.engine.playSound('open');
        // }
    }

    /**
     * 检查是否在引导模式
     */
    isInGuideMode() {
        return this.gameData && this.userStatus.isNewUser && this.waitingForClick;
    }

    /**
     * 检查引导阶段是否允许点击该位置
     */
    isGuideClickAllowed(cellId) {
        // 如果正在等待引导点击，只允许点击预期位置
        if (this.waitingForClick && this.expectedClickCellId !== null) {
            return cellId === this.expectedClickCellId;
        }
        return false;
    }

    /**
    * 引导点击成功处理
    */
    onGuideClickSuccess(cellId) {
        console.log(`🎯 引导点击成功: 格子 ${cellId}`);

        // 取消当前等待状态
        this.waitingForClick = false;
        this.expectedClickCellId = null;

        // 移动到下一个引导位置
        this.moveToNextGuidePoint();
    }

    /**
     * 移动到下一个引导点
     */
    moveToNextGuidePoint() {
        if (!this.gameData?.data?.pointSeat) {
            console.log('📍 没有引导点数据');
            return;
        }

        const { pointSeat } = this.gameData.data;
        this.currentPointIndex = (this.currentPointIndex || 0) + 1;

        if (this.currentPointIndex >= pointSeat.length) {
            console.log('🎉 所有引导点都已完成');
            this.completeGuide();
            return;
        }

        const nextCellId = pointSeat[this.currentPointIndex];
        if (nextCellId >= 0) {
            console.log(`👉 移动引导手势到下一个位置: ${nextCellId}`);
            this.expectedClickCellId = nextCellId;
            this.waitingForClick = true;
            this.moveGuideGestureToCell(nextCellId);
        } else {
            console.log('🎉 引导完成（遇到-1标记）');
            this.completeGuide();
        }
    }

    /**
     * 处理格子点击（蛋选择交互）
     */
    async handleCellClick(cellId) {
        // console.log(`🖱️ 处理格子点击: ${cellId}`);
        try {
            // 检查是否可以交互
            if (!this.canInteract()) {
                return;
            }

            if (this.userStatus?.isNewUser) {

                // 🔥 检查是否在引导阶段，如果是则只允许点击引导位置
                if (this.isInGuideMode()) {
                    if (!this.isGuideClickAllowed(cellId)) {
                        console.log(`🚫 引导阶段：只能点击引导指示位置，当前点击格子${cellId}被忽略`);
                        return;
                    }
                    console.log(`✅ 引导阶段：允许点击引导位置${cellId}`);
                }

                // 检查是否在等待引导点击
                if (this.waitingForClick && this.expectedClickCellId === cellId) {
                    // console.log(`✅ 用户正确点击了引导位置 ${cellId}`);
                    this.onGuideClickSuccess(cellId);

                }
            }



            // 设置防抖标识
            this.isProcessingClick = true;


            // 调用 GameServer 处理点击逻辑

            const result = window.GameServer.processEggClick(cellId);
            // console.log('🎮 点击处理结果:', result);

            // 根据返回结果执行相应操作
            if (result.code === -1) {
                // 错误或无效操作
                await this.handleStep0(result);
            } else if (result.code === 0) {
                // 根据步骤执行相应操作
                switch (result.step) {
                    case 1:
                        await this.handleStep1(result);
                        break;
                    case 2:
                        // this.lockGameInteraction('蛋移动中');
                        await this.handleStep2(result);
                        break;
                    case 3:
                        await this.handleStep3(result);
                        break;
                    case 4:
                        await this.handleStep4(result);
                        break;
                    default:
                        console.warn('⚠️ 未知的步骤:', result.step);
                }
            }
        } catch (error) {
            console.error('❌ 处理点击失败:', error);
        } finally {
            // 延迟重置防抖标识
            setTimeout(() => {
                this.isProcessingClick = false;
                // console.log('🔓 防抖解除，可以处理下一次点击');
            }, this.clickDebounceTime);
        }
    }



    /**
     * 处理步骤0：错误或无效操作
     */
    async handleStep0(result) {
        console.log('⚠️ 无效操作:', result.message);
        // 可以添加错误提示UI
    }

    /**
     * 处理步骤1：选择蛋
     */
    async handleStep1(result) {
        // console.log(`🎯 选择蛋: 格子 ${result.cellId}, 类型 ${result.eggType}`);

        this.engine.playSound('select_jiji');
        // 更新游戏状态
        this.gameDataState.selectedEgg = {
            cellId: result.cellId,
            eggType: result.eggType,
            isSelected: true
        };

        // 添加选中效果
        const cellData = this.getCellData(result.cellId);
        if (cellData && !cellData.isEmpty) {
            const piece = this.chessboard.pieces.get(result.cellId);  // 直接从前端获取
            this.addSelectionEffect(piece);
            this.selectedPiece = piece;
            this.selectedCellId = result.cellId;
        }
    }

    /**
     * 处理步骤2：移动蛋
     */
    async handleStep2(result) {
        // console.log(`🚶 移动蛋: ${result.fromCellId} -> ${result.toCellId}`);

        // 🔥 检查游戏胜利和失败
        const isVictory = result.isVictory || false;
        const isFailure = result.isFailure || false;

        // 直接从前端获取蛋元件，不依赖后端数据
        const piece = this.chessboard.pieces.get(result.fromCellId);

        if (!piece) {
            console.error('❌ 前端找不到蛋元件:', result.fromCellId);
            return;
        }

        // 移除选中效果
        this.removeSelectionEffect(piece);

        // 执行移动动画
        this.executeEggMovement(piece, result.fromCellId, result.toCellId, result.path, result.synthesis.canSynthesize)
            .then(() => {
                // console.log('✅ 蛋移动完成，开始同步映射关系');

                // 检查是否有合成
                if (result.synthesis && result.synthesis.canSynthesize) {

                    // utile.__sdklog('合成数据详情:', result.synthesis);
                    return this.executeSynthesisAnimation(result.synthesis, result.positionsToDelete);
                } else {
                    this.chessboard.pieces.set(result.toCellId, piece);

                    // utile.__sdklog(`📍 更新目标位置映射: 格子${result.toCellId}`);
                }
                return Promise.resolve();
            })
            .then(() => {

                // 🔥 处理引导数据更新
                if (result.guideData) {
                    if (result.guideData.isNewUser && result.guideData.pointSeat) {

                        this.gameData.data.pointSeat = result.guideData.pointSeat;
                        this.gameData.step = result.guideData.currentStep;
                        this.gameData.level = result.guideData.currentLevel;

                        // 更新引导指示位置
                        const { pointSeat } = result.guideData;
                        if (pointSeat.length > 0 && pointSeat[0] >= 0) {
                            // console.log(`👉 后端返回新的引导位置: ${pointSeat[0]}`);
                            this.expectedClickCellId = pointSeat[0];
                            this.waitingForClick = true;

                            // 延迟显示引导手势
                            setTimeout(() => {
                                this.moveGuideGestureToCell(pointSeat[0]);
                            }, 500);
                        } else {
                            // console.log('🎉 引导完成（遇到-1标记）');
                            this.waitingForClick = false;
                            this.expectedClickCellId = null;
                            this.completeGuide(false);
                        }
                    } else if (result.guideData.completed) {
                        // console.log('🎉 引导流程完成');
                        this.completeGuide(false);
                    }
                }

                // 如果有新蛋数据，创建新蛋
                if (result.newEggs && result.newEggs.length > 0) {
                    // console.log('🥚 创建新蛋');
                    // 播放龙boss动画
                    this.playLongbossAnimation();
                    const createEggPromises = result.newEggs.map(eggData =>
                        this.createEggAtPosition(eggData.cellId, eggData.eggType)
                    );

                    return Promise.all(createEggPromises);
                }
                return Promise.resolve();
            })
            .then(() => {
                // 打印当前前端映射状态
                // this.printCurrentPiecesMapping();

                // 清除选中状态
                this.gameDataState.selectedEgg = null;
                this.selectedPiece = null;
                this.selectedCellId = null;
                if (isVictory) {
                    // 优先使用合成后创建的新蛋（位于 synthesis.synthesisPosition），如果不存在则回退到原始 piece
                    const synthPos = result.synthesis && result.synthesis.synthesisPosition;
                    let targetPiece = null;
                    if (typeof synthPos === 'number') {
                        targetPiece = this.chessboard.pieces.get(synthPos) || null;
                    }
                    if (!targetPiece) {
                        targetPiece = piece; // fallback
                    }

                    // console.log('🏆 合成动画完成，显示胜利界面，移动目标元件:', targetPiece && (targetPiece.cellId || 'unknown'));

                    const targetContainer = this.gamebox || this.exportRoot;

                    // 如果 targetPiece 不在 targetContainer 下，先把它转换到 targetContainer（保持视觉位置不变）
                    if (targetPiece && targetPiece.parent !== targetContainer) {
                        const parent = targetPiece.parent || this.exportRoot;
                        const globalX = (targetPiece.x || 0) + (parent.x || 0);
                        const globalY = (targetPiece.y || 0) + (parent.y || 0);

                        // 将 targetPiece 添加到 targetContainer，并把位置调整为相对于 targetContainer
                        try {
                            targetContainer.addChild(targetPiece);
                        } catch (e) {
                            // 如果添加失败，仍然继续尝试使用当前 parent 坐标
                        }
                        targetPiece.x = globalX - (targetContainer.x || 0);
                        targetPiece.y = globalY - (targetContainer.y || 0);
                    }

                    // 计算 targetContainer 的中点作为目标位置
                    const b = (typeof targetContainer.getBounds === 'function') ? targetContainer.getBounds() : null;
                    const centerX = b && b.width ? b.width / 2 : (this.mapConfig?.width || 900) / 2;
                    const centerY = b && b.height ? b.height / 2 : (this.mapConfig?.height || 900) / 2;

                    if (targetPiece) {
                        createjs.Tween.get(targetPiece)
                            .to({ x: centerX, y: centerY }, 500, createjs.Ease.quadOut)
                            .call(() => {
                                try { targetPiece.visible = false; } catch (e) { }
                                const maskName = `mc_egg_mask${8}`;
                                const maskMc = _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.findMc(this.exportRoot, maskName);
                                // 直接使用最终的中心坐标，不做额外偏移计算
                                if (maskMc) {

                                    // 先把 targetContainer 的中心点转换到全局坐标
                                    let globalPt = { x: centerX, y: centerY };
                                    if (targetContainer && typeof targetContainer.localToGlobal === 'function') {
                                        globalPt = targetContainer.localToGlobal(centerX, centerY);
                                    }

                                    // 将全局坐标转换为 maskMc 父容器的本地坐标
                                    const maskParent = maskMc.parent || this.exportRoot;
                                    let localPt = { x: globalPt.x, y: globalPt.y };
                                    if (maskParent && typeof maskParent.globalToLocal === 'function') {
                                        localPt = maskParent.globalToLocal(globalPt.x, globalPt.y);
                                    } else if (this.stage && typeof this.stage.globalToLocal === 'function') {
                                        localPt = this.stage.globalToLocal(globalPt.x, globalPt.y);
                                    } else {
                                        // 退化方案：减去父容器偏移
                                        localPt = { x: globalPt.x - (maskParent.x || 0), y: globalPt.y - (maskParent.y || 0) };
                                    }

                                    maskMc.x = localPt.x;
                                    maskMc.y = localPt.y;
                                    maskMc.alpha = 1;


                                    maskMc.play();
                                    _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.addFrameEnd(maskMc, () => {

                                        createjs.Tween.get(maskMc)
                                            .to({ scaleX: 1.5, scaleY: 1.5, alpha: 0 }, 500)
                                            .call(() => {

                                                this.victoryHandler(true);
                                            })
                                    }, true);
                                }
                            });
                    }

                }
                if (isFailure) {
                    // console.log('💀 游戏失败，显示失败界面');

                    setTimeout(() => {
                        this.failureHandler(true);
                    }, 1000);
                }
                // console.log('✅ 所有步骤执行完成');
                return Promise.resolve();

            })
            .catch((error) => {
                console.error('❌ 执行过程中出现错误:', error);
                return Promise.resolve();
            }).finally(() => {
                // 🔥 重要：无论成功还是失败，都要解锁游戏交互
                // this.unlockGameInteraction();
            });

    }

    /**
     * 处理步骤3：取消选择
     */
    async handleStep3(result) {
        // console.log(`🔄 取消选择: 格子 ${result.cellId}`);
        this.engine.playSound('select_jiji');
        // 移除选中效果
        if (this.selectedPiece) {
            this.removeSelectionEffect(this.selectedPiece);
        }

        // 清除选中状态
        this.gameDataState.selectedEgg = null;
        this.selectedPiece = null;
        this.selectedCellId = null;
    }

    /**
     * 处理步骤4：切换选择
     */
    async handleStep4(result) {
        // console.log(`🔄 切换选择: ${result.oldCellId} -> ${result.newCellId}`);
        this.engine.playSound('select_jiji');
        // 移除旧选中效果
        if (this.selectedPiece) {
            this.removeSelectionEffect(this.selectedPiece);
        }

        // 直接从前端映射获取新蛋元件
        const newPiece = this.chessboard.pieces.get(result.newCellId);
        if (newPiece) {
            // console.log(`✅ 找到新选择的蛋: 格子${result.newCellId}, 类型${newPiece.eggType}`);

            // 添加选中效果
            this.addSelectionEffect(newPiece);
            this.selectedPiece = newPiece;
            this.selectedCellId = result.newCellId;

            // 更新游戏状态
            this.gameDataState.selectedEgg = {
                cellId: result.newCellId,
                eggType: newPiece.eggType,
                isSelected: true
            };
        } else {
            console.error(`❌ 前端映射中找不到格子${result.newCellId}的蛋元件`);
            // console.log('🔍 当前前端映射状态:');
            this.printCurrentPiecesMapping();

            // 清除选中状态
            this.selectedPiece = null;
            this.selectedCellId = null;
            this.gameDataState.selectedEgg = null;
        }
    }

    /**
     * 执行蛋移动动画
     * @param {Object} piece - 蛋元件
     * @param {number} fromCellId - 起始格子ID
     * @param {number} toCellId - 目标格子ID
     * @param {Array} path - 移动路径
     */
    async executeEggMovement(piece, fromCellId, toCellId, path, isclear) {
        // console.log(`🚶 执行蛋移动动画: ${fromCellId} -> ${toCellId}`);
        // console.log('🔍 原始路径数据:', path);

        // 修正路径转换：A* 返回的是 {x: row, y: col} 格式
        const pathCellIds = path.map(step => this.getCellId(step.x, step.y));
        // console.log('🔍 转换后的路径格子ID:', pathCellIds);

        return new Promise((resolve) => {
            // 只更新映射关系，不移除元件
            if (!isclear) {
                this.chessboard.pieces.delete(fromCellId);
            }
            // 执行路径动画
            this.animateAlongPath(piece, pathCellIds, (success) => {
                // console.log('🔍 动画完成，成功:', success);


                if (!isclear) {

                    this.chessboard.pieces.set(toCellId, piece);
                    piece.cellId = toCellId; // 更新元件的cellId属性
                    // console.log(`📍 添加目标位置映射: 格子${toCellId}`);
                }

                // console.log('✅ 蛋移动完成');
                resolve();
            });
        });
    }


    /**
 * 执行合成动画
 * @param {Object} synthesisData - 合成数据
 */
    async executeSynthesisAnimation(synthesisData, positionsToDelete) {
        // console.log('🎬 开始执行合成动画...');

        const { matches, eggType, newEggType, synthesisPosition, score } = synthesisData;

        // score 就是 scoreDetail
        const scoreDetail = score;

        // console.log('🔍 使用score作为scoreDetail:', scoreDetail);

        // 🎯 合成开始时触发震动（如果开启）
        const isVibrationEnabled = localStorage.getItem('vibrationEnabled') === null ||
            localStorage.getItem('vibrationEnabled') === 'true';
        if (isVibrationEnabled && typeof window.ovo !== 'undefined' && typeof window.ovo.vibrate === 'function') {
            console.log('📳 合成蛋，触发振动反馈');
            window.ovo.vibrate([200, 100, 200]); // 振动模式：200ms 振动，100ms 暂停，200ms 振动
        } else if (!isVibrationEnabled) {
            console.log('🔕 震动已关闭，跳过振动反馈');
        } else {
            console.log('⚠️ 振动功能不可用，跳过振动反馈');
        }

        // 收集所有参与合成的蛋元件（包括目标位置）
        const allEggsToSynthesize = [];
        for (const cellId of positionsToDelete) {
            const piece = this.chessboard.pieces.get(cellId);
            if (piece) {
                allEggsToSynthesize.push({
                    cellId: cellId,
                    piece: piece,
                    isTarget: cellId === synthesisPosition
                });
                // console.log(`🥚 找到参与合成的蛋: 格子${cellId} ${cellId === synthesisPosition ? '(目标位置)' : ''}, 元件名称: ${piece.name || 'unnamed'}, 元件ID: ${piece.id || 'no-id'}`);
            } else {
                console.warn(`⚠️ 格子 ${cellId} 没有找到对应的蛋元件`);
            }
        }

        // utile.__sdklog2(`🔍 总共 ${allEggsToSynthesize.length} 个蛋参与合成`);

        // 执行蛋收集动画
        await this.playEggCollectionAnimation(allEggsToSynthesize, synthesisPosition);

        // 延迟后创建合成蛋
        await this.createSynthesizedEgg(synthesisPosition, newEggType);

        // 更新分数显示并等待完成
        // utile.__sdklog2('🔍 准备更新分数，scoreDetail:', scoreDetail);
        if (scoreDetail && scoreDetail.totalScore) {
            // 显示浮动分数在合成位置
            this.showFloatingScore(scoreDetail.totalScore, synthesisPosition);
            this.updateScoreDisplay(scoreDetail.totalScore);
            // console.log('💰 分数更新动画完成，准备创建新蛋');
        } else {
            console.warn('⚠️ scoreDetail 数据缺失:', scoreDetail);
        }
        // 检查是否解锁了新等级（简单检查）
        if (newEggType > this.maxUnlockedLevel) {
            // console.log(`🎉 解锁新等级: ${this.maxUnlockedLevel} -> ${newEggType}`);

            this.engine.playSound('hecheng_open');

            // 播放解锁动画
            await this.playUnlockAnimation(newEggType);

            // 更新前端记录的最高等级
            this.maxUnlockedLevel = newEggType;

            // console.log(`🎊 恭喜解锁 ${this.getEggTypeName(newEggType)} 蛋！`);
        }

        // console.log(`✅ 合成完成！${window.GameServer.getEggTypeName(eggType)} -> ${window.GameServer.getEggTypeName(newEggType)}`);

        // 返回完成标识
        return { completed: true };
    }


    /**
     * 播放蛋收集动画
     * @param {Array} eggs - 所有参与合成的蛋数组
     * @param {number} targetCellId - 目标位置
     */
    async playEggCollectionAnimation(eggs, targetCellId) {
        const targetPosition = this.getCellPosition(targetCellId);
        if (!targetPosition) {
            console.error(`❌ 无法获取目标位置 ${targetCellId} 的坐标`);
            return;
        }

        // console.log(`🎯 合成目标位置 ${targetCellId}: (${targetPosition.centerX}, ${targetPosition.centerY})`);
        // console.log(`🔍 要处理的蛋数量: ${eggs.length}`);

        const promises = [];
        // 播放合成音乐
        if (this.engine && this.loadedSounds.has('goodmin')) {
            this.engine.playSound('goodmin');
        }
        for (const eggData of eggs) {
            if (eggData.piece) {
                // console.log(`🔍 处理格子 ${eggData.cellId} 的蛋，元件名称: ${eggData.piece.name || 'unnamed'}`);
                eggData.piece.setChildIndex(100);
                if (eggData.isTarget) {
                    // 目标位置的蛋：直接删除
                    // console.log(`🎯 目标位置蛋 ${eggData.cellId} 直接删除`);

                    // 确保从父容器中移除
                    if (eggData.piece.parent) {
                        eggData.piece.parent.removeChild(eggData.piece);
                        // utile.__sdklog3(`🗑️ 从父容器移除格子 ${eggData.cellId} 的蛋`);
                    }

                    // 从映射中删除
                    this.chessboard.pieces.delete(eggData.cellId);
                    // console.log(`🗑️ 删除目标位置蛋映射: 格子${eggData.cellId}`);
                } else {
                    // 非目标位置的蛋：移动到目标位置后删除
                    // console.log(`🚶 蛋从格子 ${eggData.cellId} 移动到目标位置 ${targetCellId}`);

                    const promise = new Promise((resolve) => {
                        createjs.Tween.get(eggData.piece)
                            .to({
                                x: targetPosition.centerX,
                                y: targetPosition.centerY,
                                scaleX: 0.8,
                                scaleY: 0.8,
                                alpha: 0.8
                            }, 300, createjs.Ease.quadInOut)
                            .call(() => {
                                // console.log(`🚶 格子 ${eggData.cellId} 的蛋移动完成`);

                                // 确保从父容器中移除
                                if (eggData.piece.parent) {
                                    eggData.piece.parent.removeChild(eggData.piece);
                                }

                                this.chessboard.pieces.delete(eggData.cellId);
                                // utile.__sdklog3(`🗑️ 删除移动后的蛋: 格子${eggData.cellId}`);
                                resolve();
                            });
                    });

                    promises.push(promise);
                }
            }
        }

        // 等待所有移动动画完成
        await Promise.all(promises);


        // utile.__sdklog2('📦 蛋收集动画完成，所有参与合成的蛋已删除');
    }

    /**
 * 创建合成后的新蛋
 * @param {number} cellId - 合成位置
 * @param {number} newEggType - 新蛋类型
 */
    async createSynthesizedEgg(cellId, newEggType) {
        // console.log(`🥚 在格子 ${cellId} 创建类型 ${newEggType} 的合成蛋 (egg_mc${newEggType})`);

        // 获取正确的位置坐标
        const position = this.getCellPosition(cellId);
        if (!position) {
            console.error(`❌ 无法获取格子 ${cellId} 的位置坐标`);
            return;
        }

        // utile.__sdklog(`📍 合成蛋位置: 格子${cellId} -> (${position.centerX}, ${position.centerY})`);

        // 创建新蛋
        const newEgg = this.getEggFromFlygame(newEggType);
        if (newEgg) {
            newEgg.eggType = newEggType;
            newEgg.cellId = cellId;

            // 设置正确位置
            newEgg.x = position.centerX;
            newEgg.y = position.centerY;

            // 添加到 gamebox
            this.gamebox.addChild(newEgg);

            // 更新映射
            this.chessboard.pieces.set(cellId, newEgg);

            // 播放合成特效
            await this.playSynthesisEffect(newEgg);

            // 显示合成信息
            this.showSynthesisInfo(newEggType);

            // console.log(`✅ 成功创建 ${this.getEggTypeName(newEggType)} 蛋 (egg_mc${newEggType})`);
        }
    }


    /**
     * 在指定位置创建蛋
     * @param {number} cellId - 格子ID
     * @param {number} eggType - 蛋类型
     */
    async createEggAtPosition(cellId, eggType) {


        // console.log(`🥚 创建蛋: 格子${cellId}, 类型${eggType}`);

        // 获取目标位置
        const targetPosition = this.getCellPosition(cellId);
        if (!targetPosition) {
            console.error(`❌ 无法获取格子 ${cellId} 的位置坐标`);
            return;
        }

        // 获取源蛋元件的初始位置（egg_mc[n]）
        const sourceEggName = `egg_mc${eggType}`;
        const sourceEgg = this.exportRoot[sourceEggName];

        if (!sourceEgg) {
            console.error(`❌ 找不到源蛋元件: ${sourceEggName}`);
            return;
        }

        // 将源蛋位置转换为gamebox坐标系
        const gameboxX = this.gamebox.x || 0;
        const gameboxY = this.gamebox.y || 0;

        const sourcePositionInGamebox = {
            x: sourceEgg.x - gameboxX,
            y: sourceEgg.y - gameboxY
        };

        // console.log(`📍 源蛋位置: ${sourceEggName} 舞台坐标(${sourceEgg.x}, ${sourceEgg.y})`);
        // console.log(`📍 gamebox偏移: (${gameboxX}, ${gameboxY})`);
        // console.log(`📍 转换后gamebox坐标: (${sourcePositionInGamebox.x}, ${sourcePositionInGamebox.y})`);

        // 创建新蛋元件
        const newEgg = this.getEggFromFlygame(eggType);
        if (!newEgg) {
            console.error(`❌ 无法创建蛋元件: egg_mc${eggType}`);
            return;
        }

        // 设置新蛋的初始状态（在gamebox坐标系中）
        newEgg.eggType = eggType;
        newEgg.cellId = cellId;
        newEgg.x = sourcePositionInGamebox.x;
        newEgg.y = sourcePositionInGamebox.y;
        // newEgg.scaleX = 0.1;
        // newEgg.scaleY = 0.1;
        newEgg.alpha = 1;

        // 添加到 gamebox
        this.gamebox.addChild(newEgg);
        this.engine.playSound("longhou_min")
        // console.log(`🚀 开始飞行动画: (${sourcePositionInGamebox.x}, ${sourcePositionInGamebox.y}) -> (${targetPosition.centerX}, ${targetPosition.centerY})`);

        // 执行飞行动画
        return new Promise((resolve) => {
            createjs.Tween.get(newEgg)
                // 第一阶段：闪烁出现效果 500ms
                // .to({ alpha: 0 }, 100, createjs.Ease.quadInOut)
                // .to({ alpha: 1 }, 100, createjs.Ease.quadInOut)
                // .to({ alpha: 0 }, 100, createjs.Ease.quadInOut)
                // .to({ alpha: 1 }, 100, createjs.Ease.quadInOut)
                // .to({ alpha: 0 }, 50, createjs.Ease.quadInOut)
                // .to({ alpha: 1 }, 50, createjs.Ease.quadInOut)
                // 第二阶段：快速飞入到目标位置
                .to({
                    x: targetPosition.centerX,
                    y: targetPosition.centerY,
                    scaleX: 1.0,
                    scaleY: 1.0
                }, 300, createjs.Ease.quadOut)
                .call(() => {
                    // console.log(`✅ 蛋飞行完成: 格子${cellId}`);

                    // 维护前端映射
                    this.chessboard.pieces.set(cellId, newEgg);

                    // console.log(`📍 添加新蛋到映射: 格子${cellId}`);
                    resolve();
                });
        });
    }


    playLongbossAnimation() {
        // console.log('🐉 播放龙boss动画');

        try {
            const longboss = this.exportRoot.mc_longboss;
            if (longboss) {
                // 重置到第一帧并播放
                longboss.gotoAndPlay(0);
                // console.log('✅ 龙boss动画开始播放');

                // 监听播放完成
                _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.addFrameEnd(longboss, function () {
                    longboss.gotoAndStop(0);
                    // console.log('✅ 龙boss动画播放完成，停止在第0帧');
                });
            } else {
                console.warn('⚠️ 未找到 mc_longboss 元件');
            }
        } catch (error) {
            console.error('❌ 播放龙boss动画失败:', error);
        }
    }

    /**
        * 移动元件到指定位置（纯渲染操作）
        */
    moveElementToPosition(piece, cellId) {
        if (!piece) {
            console.error(`❌ 元件为空，无法移动到格子 ${cellId}`);
            return false;
        }

        const position = this.getCellPosition(cellId);
        piece.x = position.centerX;
        piece.y = position.centerY;
        piece.cellId = cellId;

        // 更新本地映射
        // this.chessboard.pieces.set(cellId, piece);

        // console.log(`📍 移动元件到格子 ${cellId}`);
        return true;
    }

    /**
     * 播放蛋出现动画
     * @param {Object} egg - 蛋元件
     */
    playEggAppearAnimation(egg) {
        egg.scaleX = 0;
        egg.scaleY = 0;
        egg.alpha = 0;

        createjs.Tween.get(egg)
            .to({ scaleX: 1, scaleY: 1, alpha: 1 }, 300, createjs.Ease.backOut);
    }



    /**
     * 选中指定格子的元件
     */
    selectPieceAtCell(cellId) {
        const cellData = this.getCellData(cellId);

        if (!cellData || cellData.isEmpty) {
            console.warn(`⚠️ 格子 ${cellId} 没有元件可选中`);
            return;
        }

        // 选中元件
        this.selectedPiece = cellData.piece;
        this.selectedCellId = cellId;
        this.isWaitingForTarget = true;

        // console.log(`✅ 选中了格子 ${cellId} 的元件:`, this.selectedPiece.constructor.name);

        // 添加选中效果
        this.addSelectionEffect(this.selectedPiece);
    }



    /**
     * 添加选中效果
     */
    addSelectionEffect(piece) {
        if (!piece) return;

        // 如果已有选中指示器，先移除
        // 如果已有选中指示器，则复用并移动到新元件所在位置，
        // 同时确保旧元件的 tween 被移除并为新元件创建 tween
        if (this.selectionIndicator) {
            try {
                // 如果指示器不在同一父容器，移动到目标元件的父容器
                if (this.selectionIndicator.parent !== piece.parent) {
                    if (this.selectionIndicator.parent) {
                        this.selectionIndicator.parent.removeChild(this.selectionIndicator);
                    }
                    if (piece.parent) {
                        piece.parent.addChild(this.selectionIndicator);
                    } else {
                        // 兜底到 gamebox
                        this.gamebox.addChild(this.selectionIndicator);
                    }
                }

                this.selectionIndicator.visible = true;
                this.selectionIndicator.x = piece.x;
                this.selectionIndicator.y = piece.y;

                // 清理上一个选中元件的动画与状态
                if (this.selectedPiece && this.selectedPiece !== piece) {
                    try {
                        createjs.Tween.removeTweens(this.selectedPiece);
                        this.selectedPiece.scaleX = this.selectedPiece.scaleY = 1;
                    } catch (e) {
                        // ignore
                    }
                }

                // 确保新元件没有残留的 tween，然后添加缩放 tween
                createjs.Tween.removeTweens(piece);
                createjs.Tween.get(piece, { loop: true })
                    .to({ scaleX: 1.05, scaleY: 1.05 }, 300)
                    .to({ scaleX: 1, scaleY: 1 }, 300);

                this.selectedPiece = piece;
                // console.log('✨ 复用选中指示器并为新元件添加选中效果');
            } catch (err) {
                console.error('❌ 复用选中指示器失败:', err);
            }

            return;
        }

        // 为元件添加缩放 tween
        createjs.Tween.get(piece, { loop: true })
            .to({ scaleX: 1.05, scaleY: 1.05 }, 300)
            .to({ scaleX: 1.0, scaleY: 1.0 }, 300)

        // 创建新的选中指示器
        const indicator = new createjs.Shape();
        indicator.graphics.setStrokeStyle(12).beginStroke('#ffffffff').drawCircle(0, 0, 60);
        indicator.x = piece.x;
        indicator.y = piece.y;
        indicator.name = 'selectionIndicator';

        // 添加到与元件相同的父容器以保证层级和坐标一致
        if (piece.parent) {
            piece.parent.addChild(indicator);
        } else {
            this.gamebox.addChild(indicator);
        }

        // 添加闪烁动画
        createjs.Tween.get(indicator, { loop: true })
            .to({ alpha: 0, scaleX: 1.0, scaleY: 1.2 }, 300)
            .to({ alpha: 1, scaleX: 0.4, scaleY: 0.6 }, 300);

        // 记录全局唯一指示器
        this.selectionIndicator = indicator;

        // 记录当前选中元件
        this.selectedPiece = piece;

        // console.log('✨ 添加了选中效果');
    }

    /**
     * 移除选中效果
     */
    removeSelectionEffect(piece) {
        if (this.selectionIndicator) {
            // 隐藏并移除指示器
            try {
                this.selectionIndicator.visible = false;
                if (this.selectionIndicator.parent) {
                    this.selectionIndicator.parent.removeChild(this.selectionIndicator);
                }
            } catch (e) {
                // ignore
            }
            this.selectionIndicator = null;
        }

        // 移除元件的 tween 并复位缩放
        try {
            if (piece) {
                createjs.Tween.removeTweens(piece);
                piece.scaleX = piece.scaleY = 1;
            }
        } catch (e) {
            // ignore
        }
        this.selectedPiece = null;
    }

    /**
     * 清除选中状态
     */
    clearSelection() {
        if (this.selectedPiece) {
            this.removeSelectionEffect(this.selectedPiece);

        }

        this.selectedPiece = null;
        this.selectedCellId = null;
        this.isWaitingForTarget = false;

        // console.log('🔄 清除了选中状态');
    }


    /**
     * 获取蛋类型名称
     * @param {number} eggType - 蛋类型
     * @returns {string} 蛋类型名称
     */
    getEggTypeName(eggType) {
        const eggNames = {
            0: '白色',
            1: '绿色',
            2: '蓝色',
            3: '紫色',
            4: '红色',
            5: '黄色',
            6: '橙色'
        };
        return eggNames[eggType] || '未知';
    }

    /**
     * 显示合成信息
     * @param {number} newEggType - 新蛋类型
     */
    showSynthesisInfo(newEggType) {
        const eggName = this.getEggTypeName(newEggType);
        // console.log(`🎊 合成成功！获得 ${eggName} 蛋 (egg_mc${newEggType})`);

        // 这里可以添加UI提示
        // this.showFloatingText(`合成 ${eggName} 蛋！`, cellData.centerX, cellData.centerY);
    }

    /**
  * 添加合成特效
  * @param {Object} piece - 蛋元件
  */
    addSynthesisEffect(piece) {
        if (!piece) {
            console.warn('⚠️ 蛋元件为空，无法添加合成特效');
            return;
        }

        // 创建发光效果
        const glowEffect = new createjs.Shape();
        glowEffect.graphics.beginRadialGradientFill(
            ['rgba(255, 215, 0, 0.8)', 'rgba(255, 215, 0, 0)'],
            [0, 1],
            piece.x, piece.y, 0,
            piece.x, piece.y, 100
        ).drawCircle(piece.x, piece.y, 100);

        this.gamebox.addChild(glowEffect);

        // 闪烁动画
        createjs.Tween.get(glowEffect)
            .to({ alpha: 0 }, 1000)
            .call(() => {
                this.gamebox.removeChild(glowEffect);
            });
    }

    /**
     * 播放合成特效
     * @param {Object} newEgg - 新蛋元件
     */
    playSynthesisEffect(newEgg) {
        new Promise((resolve) => {
            // 缩放弹出效果
            newEgg.scaleX = 0.1;
            newEgg.scaleY = 0.1;

            createjs.Tween.get(newEgg)
                .to({ scaleX: 1.2, scaleY: 1.2 }, 300, createjs.Ease.backOut)
                .to({ scaleX: 1, scaleY: 1 }, 200, createjs.Ease.backIn)
                .call(() => {
                    // console.log('✨ 合成特效播放完成');
                    resolve();
                });

            // 添加粒子效果
            this.addSynthesisEffect(newEgg);
        });
    }

    /**
    * 更新分数显示（支持格式化数字）
    * @param {number} addedScore - 新增分数
    */
    updateScoreDisplay(addedScore) {
        return new Promise((resolve) => {
            try {
                // 获取金币显示元件
                const goldMc = this.exportRoot.mc_gold;
                if (goldMc && goldMc.text) {
                    // 解析当前显示的分数（去除k/m/b后缀）
                    const currentScore = this.parseFormattedNumber(goldMc.text.text.replace('score:', '').trim());
                    const targetScore = currentScore + addedScore;


                    // 创建数字递增动画
                    const animationData = { score: currentScore };

                    createjs.Tween.get(animationData)
                        .to({ score: targetScore }, 500, createjs.Ease.quadOut)
                        .addEventListener("change", () => {
                            // 实时更新显示的分数（格式化）
                            goldMc.text.text = "score: " + Math.floor(animationData.score);
                        })
                        .call(() => {
                            // 确保最终分数正确
                            goldMc.text.text = "score: " + targetScore;

                            resolve();
                        });
                } else {
                    console.warn('⚠️ 未找到 mc_gold 或其 text 属性');
                    resolve();
                }
            } catch (error) {
                console.error('❌ 更新分数显示失败:', error);
                resolve();
            }
        });
    }

    /**
     * 显示浮动分数文本
     * @param {number} score - 获得的分数
     * @param {number} cellId - 合成位置的格子ID（可选）
     */
    showFloatingScore(score, cellId = null) {
        try {
            // console.log(`✨ 显示浮动分数: +${score}`);

            // 创建文本对象
            // const floatingText = new createjs.Text(`+${score}`, "bold 42px Arial", "#FFD700");
            // floatingText.textAlign = "center";
            // floatingText.textBaseline = "middle";

            // 确定显示位置
            if (cellId !== null) {
                // 在合成位置显示
                const position = this.getCellPosition(cellId);
                if (position) {
                    // floatingText.x = position.centerX;
                    // floatingText.y = position.centerY - 40; // 稍微向上偏移
                    // console.log(`📍 在合成位置显示浮动分数: 格子${cellId} (${floatingText.x}, ${floatingText.y})`);
                    this.tips(`+${score}`, { x: position.centerX, y: position.centerY }, "bold 42px Arial", "#FFD700", 1)
                } else {
                    console.warn(`⚠️ 无法获取格子 ${cellId} 的位置，使用默认位置`);
                    // this.setDefaultFloatingPosition(floatingText);
                }
            } else {
                // 使用默认位置（金币附近）
                // this.setDefaultFloatingPosition(floatingText);
            }

            // 添加到 gamebox（因为合成位置是相对于 gamebox 的）

            // this.gamebox.addChild(floatingText);
            // this.gamebox.setChildIndex(floatingText, 99)


            // 创建浮动动画：向上移动并淡出


        } catch (error) {
            console.error('❌ 显示浮动分数失败:', error);
        }
    }

    /**
     * 设置浮动分数的默认位置
     * @param {Object} floatingText - 浮动文本对象
     */
    setDefaultFloatingPosition(floatingText) {
        const goldMc = this.exportRoot.mc_gold;
        if (goldMc) {
            // 需要将金币位置转换为 gamebox 坐标系
            const gameboxX = this.gamebox.x || 0;
            const gameboxY = this.gamebox.y || 0;

            floatingText.x = goldMc.x - gameboxX + 50;
            floatingText.y = goldMc.y - gameboxY;
            // console.log(`📍 使用金币附近位置: (${floatingText.x}, ${floatingText.y})`);
        } else {
            // 完全默认位置
            floatingText.x = 600;
            floatingText.y = 100;
            // console.log(`📍 使用完全默认位置: (${floatingText.x}, ${floatingText.y})`);
        }
    }

    /**
     * 解析格式化的数字字符串为实际数值
     * @param {string} formattedStr - 格式化的字符串（如 "1.2k", "3.5m"）
     * @returns {number} 实际数值
     */
    parseFormattedNumber(formattedStr) {
        if (!formattedStr || formattedStr === '0') return 0;

        const str = formattedStr.toLowerCase();
        const num = parseFloat(str);

        if (str.includes('k')) {
            return Math.floor(num * 1000);
        } else if (str.includes('m')) {
            return Math.floor(num * 1000000);
        } else if (str.includes('b')) {
            return Math.floor(num * 1000000000);
        } else {
            return Math.floor(num);
        }
    }


    /**
     * 获取 gamebox 元件
     */
    getGameboxElement() {
        return this.gamebox;
    }


    /**
     * 打印当前前端蛋映射状态
     */
    printCurrentPiecesMapping() {
        // console.log('🗺️ 当前前端蛋映射状态:');
        const mappingArray = [];

        this.chessboard.pieces.forEach((piece, cellId) => {
            mappingArray.push({
                cellId: parseInt(cellId),
                eggType: piece.eggType,
                elementName: piece.name || 'unnamed',
                elementId: piece.id || 'no-id'
            });
            // console.log(`  格子${cellId}: 蛋类型${piece.eggType} ${this.getEggTypeName(piece.eggType)}, 元件名称: ${piece.name || 'unnamed'}`);
        });

        // console.log(`📊 前端映射统计: 总共${mappingArray.length}个蛋元件`);

        // 对比后端状态
        if (window.GameServer) {
            const backendInfo = window.GameServer.getMapStateInfo();
            console.log(`🔍 后端vs前端对比: 后端${backendInfo.occupiedCells}个蛋 vs 前端${mappingArray.length}个元件`);

            if (backendInfo.occupiedCells !== mappingArray.length) {
                console.warn('⚠️ 后端蛋数量与前端元件数量不匹配！');
            }
        }

        return mappingArray;
    }

    /**
     * 初始化提示文本面板
     */
    initTipsPanel() {
        // console.log('🎨 初始化提示文本面板...');

        const tipsMc = _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.findMc(this.exportRoot, 'mc_tips');
        if (!tipsMc) {
            console.warn('⚠️ 未找到 mc_tips 元件');
            return;
        }

        this.tipsPanel = tipsMc; // 保存引用
        // console.log('✅ 提示文本面板初始化完成');
    }

    /**
     * 显示提示文本
     * @param {string} message - 要显示的提示内容
     */
    tips(message, pos = null, _textStyle = "bold 28px Arial", _color = "#FFFFFF", acting = null) {
        if (!this.tipsPanel) {
            console.warn('⚠️ 提示文本面板未初始化');
            return;
        }

        // console.log(`💬 显示提示文本: ${message}`);
        let style = _textStyle;
        let color = _color;
        // 创建文本对象
        const text = new createjs.Text(message, style, color);
        text.textAlign = "center";
        text.textBaseline = "middle";
        text.lineWidth = 600;

        // 设置文本位置到面板正中
        if (pos) {
            try {
                // pos is specified in gamebox local coordinates. Convert to global then to tipsPanel local.
                if (this.gamebox && typeof this.gamebox.localToGlobal === 'function' && this.tipsPanel && typeof this.tipsPanel.globalToLocal === 'function') {
                    const globalPt = this.gamebox.localToGlobal(pos.x, pos.y);
                    const localPt = this.tipsPanel.globalToLocal(globalPt.x, globalPt.y);
                    text.x = localPt.x;
                    text.y = localPt.y;
                } else if (this.tipsPanel && typeof this.tipsPanel.globalToLocal === 'function') {
                    // If gamebox not available, assume pos is already global
                    const localPt = this.tipsPanel.globalToLocal(pos.x, pos.y);
                    text.x = localPt.x;
                    text.y = localPt.y;
                } else {
                    // Fallback: place relative to scene
                    text.x = pos.x || (this.config.scene.width / 2);
                    text.y = pos.y || (this.config.scene.height / 2 - 100);
                }
            } catch (e) {
                console.warn('tips: position conversion failed, using fallback', e);
                text.x = this.config.scene.width / 2;
                text.y = this.config.scene.height / 2 - 100;
            }
        } else {
            text.x = this.config.scene.width / 2;
            text.y = this.config.scene.height / 2 - 100;
        }

        // 清空面板并添加新文本
        // this.tipsPanel.removeAllChildren();
        this.tipsPanel.addChild(text);

        // 显示面板
        // this.tipsPanel.visible = true;
        if (acting == 1) {
            const initialY = text.y;
            createjs.Tween.get(text)
                .to({
                    y: initialY - 80,
                    alpha: 0.8,
                    scaleX: 1.2,
                    scaleY: 1.2
                }, 400, createjs.Ease.quadOut)
                .to({
                    y: initialY - 120,
                    alpha: 0,
                    scaleX: 1.0,
                    scaleY: 1.0
                }, 800, createjs.Ease.quadIn)
                .call(() => {
                    // 动画完成后移除文本
                    this.gamebox.removeChild(text);
                    // console.log(`✅ 浮动分数文本已移除: +${score}`);
                });
        } else {

            // 创建动画：显示2秒后消失
            createjs.Tween.get(text)
                .to({ alpha: 1 }, 200) // 渐入效果
                .wait(2000)            // 显示2秒
                .to({ alpha: 0 }, 300) // 渐出效果
                .call(() => {
                    if (text.parent) {
                        text.parent.removeChild(text); // 从面板中移除文本
                        // console.log('✅ 提示文本已消失');
                    }
                });
        }
    }


    /**
     * 根据难度选择对应的按钮并更新状态
     * @param {string} difficulty - 难度 ('easy', 'normal', 'hard')
     * @param {Object} difficultyMap - 难度与按钮的映射关系
     */
    selectDifficulty(difficulty, difficultyMap) {

        const selectedButton = difficultyMap[difficulty];
        if (selectedButton) {
            // 更新按钮状态
            for (const btn in difficultyMap) {
                const button = difficultyMap[btn];
                button.gotoAndStop(button === selectedButton ? 1 : 0); // 播放状态或停止状态
            }
            // console.log(`✅ 难度选择成功: ${difficulty}`);
        } else {
            console.warn(`⚠️ 未找到对应难度的按钮: ${difficulty}`);
        }
    }


    /**
     * 失败界面控制器
     * @param {boolean} show - true显示，false隐藏
     */
    failureHandler(show) {
        // console.log(`💀 ${show ? '显示' : '隐藏'}失败界面...`);

        const panelUI = _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.findMc(this.exportRoot, 'mc_failure');
        if (!panelUI) {
            console.warn('⚠️ 未找到 mc_failure 元件');
            return;
        }

        if (show) {

            this.engine.playSound('wrong2');
            const btnAgain = _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.findMc(panelUI, 'btn_tryagain');
            btnAgain.alpha = 0;
            // const angin_x = btnAgain.x;
            const angin_y = btnAgain.y;

            btnAgain.y = angin_y + 300;
            this.showPanel(panelUI, true, async () => {
                if (this.gameData) {
                    this.gameData.scoreSystem = await window.GameServer.getScoreStatus();
                    panelUI.mc_ranking.mc_best.text.text = "" + this.gameData.scoreSystem.bestScore;
                    panelUI.mc_ranking.mc_score.text.text = "" + this.gameData.scoreSystem.currentScore;
                }

                this.openCardRewardPanel(100);

                createjs.Tween.get(btnAgain)
                    .wait(3000)
                    .to({
                        y: angin_y,
                        alpha: 1
                    }, 300, createjs.Ease.backOut)

            });

            try {
                // report failure event using ovo method
                const bestScore = this.gameData && this.gameData.scoreSystem ? this.gameData.scoreSystem.bestScore : null;
                if (typeof window.ovo !== 'undefined' && typeof window.ovo.dotGameOver === 'function') {
                    window.ovo.dotGameOver(bestScore || 0, 1, 'game_over');
                }

                // 隐藏banner广告
                if (typeof window.ovo !== 'undefined' && typeof window.ovo.hideBannerAd === 'function') {
                    window.ovo.hideBannerAd(() => {
                        console.log('📢 Banner ad hidden on game failure');
                    });
                }
            } catch (e) { }

            // console.log('✅ 失败界面显示完成');
        } else {
            this.closeCardRewardPanel()
            this.engine.playSound('select_jiji');
            this.showPanel(panelUI, false, () => {
                // console.log('✅ 失败界面隐藏动画完成');

                // 重新开始游戏
                this.onRestartGame();
            });
        }
    }

    /**
     * 关闭失败面板
     */
    showPanel(panelMc, isTF = true, callback) {
        // console.log('💀 关闭失败面板...');


        if (!panelMc) {
            console.warn('⚠️ 未找到 panelMc 元件');
            return;
        }

        panelMc.visible = true;
        panelMc.alpha = 1;
        // panelMc.scaleX = panelMc.scaleY = 0.8;

        if (isTF) {
            // 显示失败界面动画
            createjs.Tween.get(panelMc)
                // 第一阶段：快速弹出到1.1倍大小
                .to({
                    scaleX: 1.05,
                    scaleY: 1.05
                }, 200, createjs.Ease.backOut)
                // 第二阶段：回弹到正常大小
                .to({
                    scaleX: 1.0,
                    scaleY: 1.0
                }, 200, createjs.Ease.backIn)
                .call(() => {
                    // console.log('✅ 面板伸缩动画完成');

                    callback && callback();
                });
        } else {
            // 播放关闭动画
            createjs.Tween.get(panelMc)
                .to({
                    scaleX: 1.05,
                    scaleY: 1.05
                }, 200, createjs.Ease.backOut)
                .to({
                    scaleX: 0.1,
                    scaleY: 0.1,
                    alpha: 0
                }, 200, createjs.Ease.backIn)
                .call(() => {

                    panelMc.visible = false;

                    callback && callback();

                    // console.log('✅ 面板关闭完成');
                });
        }


    }

    /**
     * 胜利界面控制器
     * @param {boolean} show - true显示，false隐藏
     */
    victoryHandler(show) {
        // console.log(`🏆 ${show ? '显示' : '隐藏'}胜利界面...`);

        const panelUI = _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.findMc(this.exportRoot, 'mc_victory');
        if (!panelUI) {
            console.warn('⚠️ 未找到 mc_victory 元件');
            return;
        }

        if (show) {

            this.engine.playSound('win');

            this.showPanel(panelUI, true, async () => {
                if (this.gameData) {
                    this.gameData.scoreSystem = await window.GameServer.getScoreStatus();
                    panelUI.mc_ranking.mc_best.text.text = "" + this.gameData.scoreSystem.bestScore;
                    panelUI.mc_ranking.mc_score.text.text = "" + this.gameData.scoreSystem.currentScore;
                }
                // this.openCardRewardPanel();
            })
            try {
                // report victory event using ovo method
                const bestScore = this.gameData && this.gameData.scoreSystem ? this.gameData.scoreSystem.bestScore : null;
                if (typeof window.ovo !== 'undefined' && typeof window.ovo.dotGameWin === 'function') {
                    window.ovo.dotGameWin(bestScore || 0, 1, 0);
                }

                // 隐藏banner广告
                if (typeof window.ovo !== 'undefined' && typeof window.ovo.hideBannerAd === 'function') {
                    window.ovo.hideBannerAd(() => {
                        console.log('📢 Banner ad hidden on game victory');
                    });
                }
            } catch (e) { }
            // console.log('✅ 胜利界面显示完成');
        } else {
            this.closeCardRewardPanel()
            this.showPanel(panelUI, false, () => {
                // console.log('✅ 胜利界面隐藏动画完成');
                // 重新开始游戏
                this.onRestartGame();
            })

        }
    }

    /**
     * 检查目标是否是指定元件或其子元件
     */
    isTargetOrChild(event, parent) {
        if (!event || !parent) return false;

        // 优先检查 currentTarget（事件绑定的元件）
        if (event.currentTarget === parent) {
            return true;
        }

        // 检查 currentTarget 的名称
        if (event.currentTarget && event.currentTarget.name === parent.name) {
            return true;
        }

        // 回退到原来的逻辑检查 target
        let current = event.target;
        while (current) {
            if (current === parent) {
                return true;
            }
            current = current.parent;
        }

        return false;
    }

    /**
     * 关闭胜利面板
     */
    closeVictoryPanel() {
        // console.log('🏆 关闭胜利面板...');

        const victoryMc = _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.findMc(this.exportRoot, 'mc_victory');
        if (!victoryMc) {
            console.warn('⚠️ 未找到 mc_victory 元件');
            return;
        }

        // 播放关闭动画
        createjs.Tween.get(victoryMc)
            .to({
                scaleX: 0.1,
                scaleY: 0.1,
            }, 300, createjs.Ease.backIn)
            .call(() => {
                // 隐藏胜利界面
                this.victoryHandler(false);

                // 重新开始游戏
                this.onRestartGame();

                // console.log('✅ 胜利面板关闭完成');
            });
    }

    /**
     * 重新开始游戏
     */
    onRestartGame() {
        // console.log('🔄 重新开始游戏...');

        // 隐藏失败界面（会自动移除事件注册）
        // this.hideFailure();
        if (!this.userStatus.isNewUser) {

            // 重置游戏状态
            this.resetGame();
            // console.log('✅ 游戏重新开始');
        } else {
            this.tips('In tutorial mode, the game cannot be restarted. Please complete the current task.');
        }

    }

    /**
     * 重置游戏
     */
    async resetGame() {
        // console.log('🔄 重置游戏状态...');

        try {
            // 1. 清理前端蛋元件和状态
            this.clearAllEggs();
            this.clearSelection();

            // 2. 重置前端游戏状态
            this.gameRunState = 'init';
            this.gameDataState = {
                selectedEgg: null
            };

            // 🎯 重置banner广告标志，允许重新开始后再次显示
            if (typeof window.ovo !== 'undefined') {
                window.ovo.bannerShown = false;
                console.log('📢 Banner ad flag reset for game restart');
            }

            // 3. 重置金币显示为0
            this.resetGoldDisplay(false);
            // 3. 停止所有动画
            createjs.Tween.removeAllTweens();

            // 4. 重置后端地图数据和游戏状态
            if (window.GameServer) {
                const resetResult = window.GameServer.resetGame();

                if (resetResult.success) {
                    // console.log('✅ 后端清理成功，开始重新请求游戏数据');

                    // 5. 重新请求游戏数据
                    // await this.loadGameDataByDifficulty(this.selectedDifficulty || 'normal');
                    const gameConfig = await window.GameServer.getGameData(
                        this.userStatus//,
                        // this.selectedDifficulty
                    );
                    this.gameData = gameConfig;
                    // 6. 验证游戏数据
                    // this.verifyGameData();
                    // 重置所有解锁动画到初始状态
                    this.resetUnlockAnimations();

                    // 7. 执行生成蛋的动作
                    setTimeout(() => {
                        this.generateUserEggs();
                    }, 500);

                    // 🎯 游戏重新开始30秒后显示banner广告
                    setTimeout(() => {
                        if (typeof window.ovo !== 'undefined' && typeof window.ovo.showBannerAd === 'function') {
                            window.ovo.showBannerAd(() => {
                                console.log('📢 Banner ad shown 30s after game restart');
                            });
                        }
                    }, 30000); // 30秒 = 30000毫秒

                    // console.log('✅ 游戏重置完成');
                } else {
                    console.error('❌ 后端清理失败:', resetResult.message);
                }
            } else {
                console.error('❌ GameServer 未找到');
            }

        } catch (error) {
            console.error('❌ 游戏重置失败:', error);
        }
    }

    /**
    * 重置金币显示
    */
    resetGoldDisplay(reBestScore = true) {
        // console.log('💰 重置金币显示为0...');

        try {
            // 获取金币显示元件
            const goldMc = this.exportRoot.mc_gold;
            if (goldMc && goldMc.text) {
                // 重置金币显示为0
                goldMc.text.text = "score: 0";
                // console.log('✅ 金币显示已重置为0');
            } else {
                console.warn('⚠️ 未找到 mc_gold 或其 text 属性');
            }


            const high_scoreMc = this.exportRoot.mc_high_score;
            if (high_scoreMc && high_scoreMc.text && reBestScore) {
                // 重置最佳显示为0
                high_scoreMc.text.text = "best: 0";
                // console.log('✅ 最佳显示已重置为0');
            }
        } catch (error) {
            console.error('❌ 重置金币显示失败:', error);
        }
    }

    /**
    * 清理所有蛋元件
    */
    clearAllEggs() {
        // console.log('🧹 清理所有蛋元件...');

        if (this.chessboard && this.chessboard.pieces) {
            // 移除所有蛋元件
            this.chessboard.pieces.forEach((piece, cellId) => {
                if (piece && piece.parent) {
                    piece.parent.removeChild(piece);
                }
            });

            // 清空映射
            this.chessboard.pieces.clear();
            // console.log('✅ 所有蛋元件已清理');
        }
    }

    /**
     * 初始化解锁动画元件
     */
    initUnlockAnimations() {
        // console.log('🎭 初始化解锁动画元件...');

        this.unlockAnimations = new Map();

        // 获取 mc_egg_mask1~6 元件
        for (let i = 1; i <= 7; i++) {
            const maskName = `mc_egg_mask${i}`;
            const maskMc = _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.findMc(this.exportRoot, maskName);

            if (maskMc) {
                this.unlockAnimations.set(i + 1, maskMc); // 等级2~7对应mask1~6
                // console.log(`✅ 找到解锁动画元件: ${maskName} -> 等级${i + 1}`);


            } else {
                console.warn(`⚠️ 未找到解锁动画元件: ${maskName}`);
            }
        }

        // console.log(`📊 解锁动画元件初始化完成，共找到 ${this.unlockAnimations.size} 个`);
    }


    /**
     * 播放解锁动画
     * @param {number} unlockedLevel - 解锁的等级 (2~8)
     */
    async playUnlockAnimation(unlockedLevel) {
        // console.log(`🎉 播放解锁动画: 等级 ${unlockedLevel}`);
        new Promise((resolve) => {
            const maskMc = this.unlockAnimations.get(unlockedLevel);
            if (!maskMc) {
                console.warn(`⚠️ 未找到等级 ${unlockedLevel} 对应的解锁动画元件`);
                // resolve immediately so callers don't hang
                return resolve();
            }

            try {
                // 显示并播放动画
                maskMc.visible = true;
                maskMc.gotoAndPlay(0);

                // console.log(`✨ 开始播放解锁动画: mc_egg_mask${unlockedLevel - 1} (等级${unlockedLevel})`);


                _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.addFrameEnd(maskMc, () => {
                    // finish();
                    if (unlockedLevel === 7) {
                        maskMc.visible = false;
                        const maskMc8 = this.unlockAnimations.get(8);
                        _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.addFrameEnd(maskMc8, null, true);
                        maskMc8.play();

                    }
                    resolve();
                }, true);


            } catch (error) {
                console.error(`❌ 播放解锁动画失败: 等级${unlockedLevel}`, error);
                resolve();
            }
        });
    }


    /**
     * 播放用户已解锁等级的动画
     */
    playUnlockedAnimations(gameStatus = null) {
        // console.log('🎭 播放用户已解锁等级的动画...');

        // 获取用户当前最高解锁等级

        this.maxUnlockedLevel = gameStatus ? (gameStatus.maxUnlockedEggType || 0) : 0;

        // console.log(`🏆 用户最高解锁等级: ${this.maxUnlockedLevel}`);

        // 播放对应等级的解锁动画 (等级2~7对应mask1~6)
        for (let level = 2; level <= Math.min(this.maxUnlockedLevel, 8); level++) {
            setTimeout(() => {

                const maskMc = this.unlockAnimations.get(level);
                if (maskMc) {
                    // console.log(`✨ 播放已解锁动画: 等级${level}`);

                    // 显示并播放动画
                    maskMc.visible = true;
                    maskMc.gotoAndPlay(0);

                    // 监听播放完成
                    _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.addFrameEnd(maskMc, () => {
                        // console.log(`✅ 等级${level}解锁动画播放完成`);
                    }, true);
                }
            }, 100 * level);
        }

        if (this.maxUnlockedLevel <= 1) {
            console.log('📝 用户尚未解锁高级蛋类型，无需播放解锁动画');
        }
    }

    /**
     * 重置所有解锁动画到初始状态
     */
    resetUnlockAnimations() {
        // console.log('🔄 重置所有解锁动画到初始状态...');

        if (!this.unlockAnimations) {
            console.warn('⚠️ 解锁动画元件未初始化');
            return;
        }

        // 重置所有解锁动画到第0帧
        this.unlockAnimations.forEach((maskMc, level) => {
            if (maskMc) {
                maskMc.gotoAndStop(0);
                maskMc.visible = true; // 确保可见但停在第0帧
                // console.log(`🔄 重置等级${level}解锁动画到第0帧`);
            }
        });

        // console.log('✅ 所有解锁动画已重置到初始状态');
    }

    /**
     * 初始化新手引导元件
     */
    initGuideGesture() {
        const guideMc = _utile_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.findMc(this.exportRoot, 'guide_mc');
        if (!guideMc) {
            console.warn('⚠️ 未找到 guide_mc 元件');
            return;
        }
        this.guideGesture = guideMc;
        this.guidePoints = [guideMc.x, guideMc.y]; // 初始化引导点
        guideMc.visible = true;
        guideMc.gotoAndPlay(0);
        console.log('✅ guide_mc 已赋值给 guideGesture 并开始播放');

    }

    /**
     * 移动引导手势到指定格子
     * @param {number} cellId - 目标格子ID
     */
    moveGuideGestureToCell(cellId) {
        if (!this.guideGesture) {
            console.warn('⚠️ guideGesture 未初始化');
            return;
        }

        // 🔥 使用 getCellData 获取完整的格子数据
        const cellData = this.getCellData(cellId);
        if (!cellData) {
            console.warn(`⚠️ 无法获取格子 ${cellId} 的数据`);
            return;
        }

        // 🔥 使用 GuideLine 模块的坐标计算逻辑
        const guidePosition = this.calculateGuidePosition(cellData);

        // 使用动画移动
        createjs.Tween.get(this.guideGesture)
            .to({ x: guidePosition.x, y: guidePosition.y }, 600, createjs.Ease.quadOut);
        // console.log(`👉 引导手势移动到格子${cellId} (${guidePosition.x}, ${guidePosition.y})`);
    }


    /**
     * 完成引导
     */
    completeGuide(show = true) {


        this.guideGesture.visible = true;
        createjs.Tween.get(this.guideGesture)
            .to({ x: this.guidePoints[0], y: this.guidePoints[1] }, 400, createjs.Ease.quadOut);
        // 隐藏引导手势
        if (this.guideGesture && !show) {
            // console.log('🎊 引导流程完成！');
            // console.log('💡 现在可以自由点击蛋进行游戏了！');
            this.guideGesture.gotoAndStop(0);
            this.guideGesture.visible = false;
            // report tutorial completion using ovo method
            try {
                if (typeof window.ovo !== 'undefined' && typeof window.ovo.dotTutorialComplete === 'function') {
                    window.ovo.dotTutorialComplete();
                }
            } catch (e) { }
        }

        // 重置引导状态
        this.waitingForClick = false;
        this.expectedClickCellId = null;
        this.currentPointIndex = 0;



    }

    /**
     * 计算引导手势的正确位置（从 GuideLine 模块复制）
     */
    calculateGuidePosition(cellData) {
        if (!this.guideGesture || !this.gamebox) {
            return { x: cellData.centerX, y: cellData.centerY };
        }

        const guideParent = this.guideGesture.parent;

        if (guideParent === this.exportRoot && this.gamebox !== this.exportRoot) {
            const gameboxX = this.gamebox.x || 0;
            const gameboxY = this.gamebox.y || 0;

            return {
                x: cellData.centerX + gameboxX,
                y: cellData.centerY + gameboxY
            };
        }

        return { x: cellData.centerX, y: cellData.centerY };
    }
}




// 直接创建全局对象，避免类名冲突
// console.log('🏗️ 创建 GameScense 实例...');
window.GameScense = new GameScense();
// console.log('✅ GameScense 实例创建完成:', window.GameScense);
// console.log('🔍 GameScense.init 方法:', typeof window.GameScense.init);

/***/ }),

/***/ 296:
/***/ ((module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* module decorator */ module = __webpack_require__.hmd(module);


// GameDistribution Ad SDK for GameDistribution platform
// Only initializes if platform is set to "gamedistribution"

// Define gd_ad object with ad methods
const gd_ad = {
    // Initialize GameDistribution Ad SDK
    init: function() {
        // Only initialize if platform is gamedistribution
        if (window.Platform !== "gamedistribution") {
            console.log('[gd_ad] Platform is not gamedistribution, skipping initialization');
            return;
        }

        console.log('[gd_ad] Initializing for GameDistribution platform');

        // Initialize GA4
        this.initGA4();

        // Load GameDistribution SDK
        this.loadGameDistributionSDK();

        // Set up gtag wrapper
        this.setupGtagWrapper();

        // Attach methods to window
        this.attachToWindow();
    },

    // Initialize Google Analytics 4
    initGA4: function() {
        try {
            if (typeof window !== 'undefined' && typeof document !== 'undefined') {
                const gameConfig = {
                    gameid: "GameDistribution_97433fde06bb45aeb80c380ace3ece7f",
                    dev_name: "Dragon Egg"
                };

                const script = document.createElement("script");
                script.async = true;
                script.src = "https://www.googletagmanager.com/gtag/js?id=G-PM5MNMLL3R";
                script.setAttribute("crossorigin", "anonymous");

                script.onload = () => {
                    // Set consent configuration
                    window.gtag("consent", "default", {
                        ad_storage: "granted",
                        ad_user_data: "granted",
                        ad_personalization: "granted",
                        analytics_storage: "granted"
                    });

                    // Initialize gtag
                    window.gtag("js", new Date());
                    window.gtag("set", "cookie_flags", "SameSite=None;Secure");
                    window.gtag("config", "G-PM5MNMLL3R", {
                        game_id: gameConfig.gameid,
                        dev_name: gameConfig.dev_name
                    });

                    console.log('✅ gtag.js loaded with consent and game config');
                };

                script.onerror = function (err) {
                    console.warn('⚠️ gtag.js failed to load', err);
                };

                // Initialize dataLayer
                window.dataLayer = window.dataLayer || [];

                document.getElementsByTagName("head")[0].appendChild(script);
            }
        } catch (e) {
            console.error('[gd_ad] GA4 initialization failed', e);
        }
    },

    // Load GameDistribution SDK
    loadGameDistributionSDK: function() {
        return new Promise((resolve, reject) => {
            if (typeof window.gdsdk !== 'undefined') {
                console.log('[gd_ad] GameDistribution SDK already loaded');
                resolve();
                return;
            }

            // Set up GD options
            window.GD_OPTIONS = {
                debug: true,
                gameId: "1726345e0eb4405a8bc8f20d14f33993",
                onEvent: function(e) {
                    switch (e.name) {
                        case "SDK_GAME_START":
                            break;
                        case "SDK_GAME_PAUSE":
                            break;
                        case "SDK_GDPR_TRACKING":
                        case "SDK_GDPR_TARGETING":
                            break;
                        case "SDK_READY":
                            if (typeof window.gdsdk !== 'undefined') {
                                window.gdsdk.preloadAd();
                            }
                            break;
                    }
                }
            };

            const script = document.createElement("script");
            script.src = "https://html5.api.gamedistribution.com/main.min.js";
            script.onload = () => {
                console.log('[gd_ad] GameDistribution SDK loaded successfully');
                resolve();
            };
            script.onerror = (error) => {
                console.error('[gd_ad] Failed to load GameDistribution SDK', error);
                reject(error);
            };

            document.getElementsByTagName("head")[0].appendChild(script);
        });
    },

    // Set up enhanced gtag wrapper
    setupGtagWrapper: function() {
        let gamePlayTimeIntervalSet = false;

        window.gtag = function () {
            let args = [...arguments];
            let eventAction = args[1];
            let eventParams = args[2];

            // Allow specific gtag commands and events
            const allowedCommands = ["set", "js", "config", "consent"];
            const allowedGameEvents = ["game_start", "level_start", "level_end"];
            const allowedSdkEvents = [
                "ad_impression", "ad_click", "ad_error", "earn_virtual_currency",
                "select_content", "game_play_time", "tutorial_complete",
                "game_reward_open", "game_interstitialad_open",
                "game_reward_dismissed", "game_interstitialad",
                "game_reward", "game_reward_viewed", "game_interstitialad_viewed",
                "click_ad"
            ];

            // Filter events: allow commands, game events, or SDK events with send: "sdk"
            if (allowedCommands.includes(args[0]) ||
                allowedGameEvents.includes(eventAction) ||
                (allowedSdkEvents.includes(eventAction) && eventParams && eventParams.send === "sdk")) {

                // Log filtered events
                if (typeof window.__sdklog3 === 'function') {
                    window.__sdklog3('gtag_filtered', arguments);
                }

                // Push to dataLayer
                try {
                    if (window.dataLayer && typeof window.dataLayer.push === 'function') {
                        window.dataLayer.push(arguments);
                    }
                } catch (e) {
                    console.log("dataLayer error:", e);
                }
            }

            // Set up automatic game_play_time interval on first level_start
            if (eventAction === "level_start" && !gamePlayTimeIntervalSet) {
                gamePlayTimeIntervalSet = true;
                setInterval(function () {
                    if (typeof window.gtag === 'function') {
                        window.gtag("event", "game_play_time", {
                            send: "sdk"
                        });
                    }
                }, 30000); // 30 seconds

                console.log('🕒 Automatic game_play_time interval started (30s)');
            }
        };
    },

    // Attach methods to window
    attachToWindow: function() {
        window.showInterstitialAd = this.showInterstitialAd;
        window.showRewardedAd = this.showRewardedAd;
        window.showBannerAd = this.showBannerAd;
        window.hideBannerAd = this.hideBannerAd;
    },

    // Interstitial Ad
    showInterstitialAd: function (callback, opts) {
        opts = opts || {};
        try {
            console.log('[gd_ad] showInterstitialAd invoked');
            // GA event: ad_impression
            if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                window.gtag('event', 'ad_impression', {
                    ad_platform: 'gamedistribution',
                    ad_source: 'interstitial',
                    ad_format: 'display',
                    platform: window.Platform || 'unknown',
                    send: 'sdk'
                });
            }
        } catch (e) {}

        if (typeof window.gdsdk !== 'undefined' && typeof window.gdsdk.showAd === 'function') {
            try {
                window.gdsdk.showAd().then(() => {
                    try {
                        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                            window.gtag('event', 'ad_click', {
                                ad_platform: 'gamedistribution',
                                ad_source: 'interstitial',
                                platform: window.Platform || 'unknown',
                                send: 'sdk'
                            });
                        }
                    } catch (e) {}
                    if (typeof callback === 'function') callback(true);
                }).catch((error) => {
                    try {
                        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                            window.gtag('event', 'ad_error', {
                                ad_platform: 'gamedistribution',
                                ad_source: 'interstitial',
                                error_reason: 'closed_or_failed',
                                platform: window.Platform || 'unknown',
                                send: 'sdk'
                            });
                        }
                    } catch (e) {}
                    if (typeof callback === 'function') callback(false);
                });
            } catch (e) {
                console.error('[gd_ad] showInterstitialAd failed', e);
                if (typeof callback === 'function') callback(false);
            }
        } else {
            console.warn('[gd_ad] gdsdk.showAd not available');
            // GA event: ad_error
            if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                window.gtag('event', 'ad_error', {
                    ad_platform: 'gamedistribution',
                    ad_source: 'interstitial',
                    error_reason: 'not_available',
                    platform: window.Platform || 'unknown',
                    send: 'sdk'
                });
            }
            if (typeof callback === 'function') callback(false);
        }
    },

    // Rewarded Ad
    showRewardedAd: function (callback, opts) {
        opts = opts || {};
        try {
            console.log('[gd_ad] showRewardedAd invoked');
            // GA event: ad_impression
            if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                window.gtag('event', 'ad_impression', {
                    ad_platform: 'gamedistribution',
                    ad_source: 'rewarded',
                    ad_format: 'video',
                    platform: window.Platform || 'unknown',
                    send: 'sdk'
                });
            }
        } catch (e) {}

        if (typeof window.gdsdk !== 'undefined' && typeof window.gdsdk.showAd === 'function') {
            try {
                window.gdsdk.showAd('rewarded').then(() => {
                    try {
                        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                            window.gtag('event', 'earn_virtual_currency', {
                                virtual_currency_name: 'reward',
                                value: 1,
                                ad_platform: 'gamedistribution',
                                platform: window.Platform || 'unknown',
                                send: 'sdk'
                            });
                        }
                    } catch (e) {}
                    if (typeof callback === 'function') callback(true);
                }).catch((error) => {
                    try {
                        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                            window.gtag('event', 'ad_error', {
                                ad_platform: 'gamedistribution',
                                ad_source: 'rewarded',
                                error_reason: 'closed_or_failed',
                                platform: window.Platform || 'unknown',
                                send: 'sdk'
                            });
                        }
                    } catch (e) {}
                    if (typeof callback === 'function') callback(false);
                });
            } catch (e) {
                console.error('[gd_ad] showRewardedAd failed', e);
                if (typeof callback === 'function') callback(false);
            }
        } else {
            console.warn('[gd_ad] gdsdk.showAd not available');
            // GA event: ad_error
            if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                window.gtag('event', 'ad_error', {
                    ad_platform: 'gamedistribution',
                    ad_source: 'rewarded',
                    error_reason: 'not_available',
                    platform: window.Platform || 'unknown',
                    send: 'sdk'
                });
            }
            if (typeof callback === 'function') callback(false);
        }
    },

    // Banner Ad
    showBannerAd: function (callback, opts) {
        opts = opts || {};
        try {
            console.log('[gd_ad] showBannerAd invoked');
            // GA event: ad_impression
            if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                window.gtag('event', 'ad_impression', {
                    ad_platform: 'gamedistribution',
                    ad_source: 'banner',
                    ad_format: 'display',
                    platform: window.Platform || 'unknown',
                    send: 'sdk'
                });
            }
        } catch (e) {}

        if (typeof window.gdsdk !== 'undefined' && typeof window.gdsdk.showAd === 'function') {
            try {
                window.gdsdk.showAd('banner').then(() => {
                    try {
                        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                            window.gtag('event', 'ad_click', {
                                ad_platform: 'gamedistribution',
                                ad_source: 'banner',
                                platform: window.Platform || 'unknown',
                                send: 'sdk'
                            });
                        }
                    } catch (e) {}
                    if (typeof callback === 'function') callback(true);
                }).catch((error) => {
                    try {
                        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                            window.gtag('event', 'ad_error', {
                                ad_platform: 'gamedistribution',
                                ad_source: 'banner',
                                error_reason: 'closed_or_failed',
                                platform: window.Platform || 'unknown',
                                send: 'sdk'
                            });
                        }
                    } catch (e) {}
                    if (typeof callback === 'function') callback(false);
                });
            } catch (e) {
                console.error('[gd_ad] showBannerAd failed', e);
                if (typeof callback === 'function') callback(false);
            }
        } else {
            console.warn('[gd_ad] gdsdk.showAd not available');
            // GA event: ad_error
            if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                window.gtag('event', 'ad_error', {
                    ad_platform: 'gamedistribution',
                    ad_source: 'banner',
                    error_reason: 'not_available',
                    platform: window.Platform || 'unknown',
                    send: 'sdk'
                });
            }
            if (typeof callback === 'function') callback(false);
        }
    },

    hideBannerAd: function (callback) {
        try {
            console.log('[gd_ad] hideBannerAd invoked');
        } catch (e) {}

        if (typeof window.gdsdk !== 'undefined' && typeof window.gdsdk.hideAd === 'function') {
            try {
                window.gdsdk.hideAd('banner');
                if (typeof callback === 'function') callback(true);
            } catch (e) {
                console.error('[gd_ad] hideBannerAd failed', e);
                if (typeof callback === 'function') callback(false);
            }
        } else {
            console.warn('[gd_ad] gdsdk.hideAd not available');
            if (typeof callback === 'function') callback(false);
        }
    }
};

// Initialize the SDK
gd_ad.init();

// Export for module systems
if ( true && module.exports) {
    module.exports = gd_ad;
}
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (gd_ad)));

/***/ }),

/***/ 434:
/***/ (() => {

/**
 * 难度选择模块
 * 负责游戏难度选择的交互逻辑
 */
// console.log('📁 SelectLine.js 开始加载...');

class SelectLine {
    constructor() {
        this.engine = null;
        this.stage = null;
        this.exportRoot = null;
        this.loadedSounds = null;

        // 难度选择相关
        this.startMc = null;
        this.selectedDifficulty = null;
        this.onDifficultyCallback = null;
    }

    /**
 * 获取难度对应的等级参数
 * @param {string} difficulty - 难度等级 ('easy', 'normal', 'hard')
 * @returns {number} 难度等级数值
 */
    getDifficultyLevel(difficulty) {
        const difficultyMap = {
            'easy': 3,    // 简单：3个蛋
            'normal': 4,  // 中等：4个蛋
            'hard': 5     // 困难：5个蛋
        };

        return difficultyMap[difficulty] || 4; // 默认中等难度
    }

    /**
     * 初始化难度选择模块
     * @param {Object} gameData - 游戏数据对象
     * @param {Function} callback - 难度选择完成回调
     */
    init(gameData, callback) {
        // console.log('🎮 SelectLine 初始化...');

        this.engine = gameData.engine;
        this.stage = gameData.stage;
        this.exportRoot = gameData.exportRoot;
        this.loadedSounds = gameData.loadedSounds;
        this.onDifficultyCallback = callback;

        this.selectDifficulty();
    }

    /**
 * 隐藏选择难度UI
 */
    hideDifficultyUI() {
        // console.log('🙈 隐藏选择难度UI...');

        const selectMc = utile.findMc(this.exportRoot, 'mc_select');
        if (selectMc) {
            selectMc.visible = false;
            // console.log('✅ 已隐藏 mc_select');
        } else {
            // console.log('⚠️ 未找到 mc_select 元件');
        }
    }
    /**
     * 显示难度选择界面
     */
    selectDifficulty() {
        // console.log('🎮 选择游戏难度...');
        this.startMc = utile.findMc(this.exportRoot, 'mc_select');

        if (this.startMc) {
            // console.log('✅ 找到难度选择界面');
            this.startMc.visible = true;

            const btnEasy = utile.findMc(this.startMc, 'btn_e');
            const btnNormal = utile.findMc(this.startMc, 'btn_n');
            const btnHard = utile.findMc(this.startMc, 'btn_h');

            this.stage.on('click', (event) => {
                const target = event.target;
                // console.log('🎯 舞台点击事件，目标:', target);

                const clickedButton = this.findButtonContainer(target, [btnEasy, btnNormal, btnHard]);

                if (clickedButton === btnEasy) {
                    // console.log('🟢 检测到简单难度按钮点击');
                    this.onDifficultySelected('easy');
                } else if (clickedButton === btnNormal) {
                    // console.log('🟡 检测到普通难度按钮点击');
                    this.onDifficultySelected('normal');
                } else if (clickedButton === btnHard) {
                    // console.log('🔴 检测到困难难度按钮点击');
                    this.onDifficultySelected('hard');
                }
            });

            [btnEasy, btnNormal, btnHard].forEach(btn => {
                if (btn) {
                    btn.mouseEnabled = true;
                    btn.cursor = "pointer";
                }
            });
        } else {
            console.warn('⚠️ 未找到难度选择界面，使用默认难度');
            this.onDifficultySelected('normal');
        }
    }

    /**
     * 查找按钮容器
     */
    findButtonContainer(target, buttons) {
        let current = target;

        for (let i = 0; i < 5 && current; i++) {
            for (const button of buttons) {
                if (current === button) {
                    // console.log(`✅ 找到按钮容器: ${button.name} (向上${i}层)`);
                    return button;
                }
            }
            current = current.parent;
        }
        return null;
    }

    /**
     * 获取目标对象的路径（调试用）
     */
    getTargetPath(target) {
        const path = [];
        let current = target;

        for (let i = 0; i < 5 && current; i++) {
            const name = current.name || current.constructor.name;
            path.push(name);
            current = current.parent;
        }
        return path.join(' -> ');
    }

    /**
     * 处理难度选择
     */
    onDifficultySelected(difficulty) {
        // console.log(`🎯 用户选择难度: ${difficulty}`);

        // 播放点击音效
        if (this.engine && this.loadedSounds.has('popo')) {
            this.engine.playSound('popo');
        }

        // 隐藏难度选择界面
        if (this.startMc) {
            this.startMc.visible = false;
        }

        this.selectedDifficulty = difficulty;

        // 调用回调函数，通知游戏场景难度选择完成
        if (this.onDifficultyCallback) {
            this.onDifficultyCallback(difficulty);
        }
    }

    /**
     * 获取选择的难度
     */
    getSelectedDifficulty() {
        return this.selectedDifficulty;
    }


    selectDifficulty() {
        // console.log('🎮 选择游戏难度...');
        this.startMc = utile.findMc(this.exportRoot, 'mc_select');

        if (this.startMc) {
            // console.log('✅ 找到难度选择界面');

            // 显示难度选择界面
            this.startMc.visible = true;

            // 查找三个难度按钮
            const btnEasy = utile.findMc(this.startMc, 'btn_e');
            const btnNormal = utile.findMc(this.startMc, 'btn_n');
            const btnHard = utile.findMc(this.startMc, 'btn_h');

            this.stage.on('click', (event) => {
                const target = event.target;
                // console.log('🎯 舞台点击事件，目标:', target);
                // console.log('🎯 目标名称:', target.name);
                // console.log('🎯 目标父级:', target.parent);

                // 向上查找按钮容器
                const clickedButton = this.findButtonContainer(target, [btnEasy, btnNormal, btnHard]);

                if (clickedButton === btnEasy) {
                    // console.log('🟢 检测到简单难度按钮点击');
                    this.onDifficultySelected('easy');
                } else if (clickedButton === btnNormal) {
                    // console.log('🟡 检测到普通难度按钮点击');
                    this.onDifficultySelected('normal');
                } else if (clickedButton === btnHard) {
                    // console.log('🔴 检测到困难难度按钮点击');
                    this.onDifficultySelected('hard');
                } else {
                    // console.log('🎯 点击了其他区域，目标路径:', this.getTargetPath(target));
                }
            });
            // 设置按钮样式
            [btnEasy, btnNormal, btnHard].forEach(btn => {
                if (btn) {
                    btn.mouseEnabled = true;
                    btn.cursor = "pointer";
                }
            });
        } else {
            console.warn('⚠️ 未找到难度选择界面，跳过难度选择');
            this.onDifficultySelected('normal');
        }


    }
    /**
     * 查找按钮容器
     * @param {Object} target - 点击的目标对象
     * @param {Array} buttons - 按钮数组
     * @returns {Object|null} 找到的按钮容器
     */
    findButtonContainer(target, buttons) {
        let current = target;

        // 向上遍历父级，最多查找5层
        for (let i = 0; i < 5 && current; i++) {
            // 检查当前对象是否是按钮之一
            for (const button of buttons) {
                if (current === button) {
                    // console.log(`✅ 找到按钮容器: ${button.name} (向上${i}层)`);
                    return button;
                }
            }
            current = current.parent;
        }

        return null;
    }
    /**
     * 获取目标对象的路径（用于调试）
     * @param {Object} target - 目标对象
     * @returns {string} 路径字符串
     */
    getTargetPath(target) {
        const path = [];
        let current = target;

        for (let i = 0; i < 5 && current; i++) {
            const name = current.name || current.constructor.name;
            path.push(name);
            current = current.parent;
        }

        return path.join(' -> ');
    }

    // 辅助方法：检查target是否是parent的子元素
    isChildOf(target, parent) {
        if (!target || !parent) return false;
        let current = target.parent;
        while (current) {
            if (current === parent) return true;
            current = current.parent;
        }
        return false;
    }

    /**
 * 处理难度选择
 * @param {string} difficulty - 选择的难度 ('easy', 'normal', 'hard')
 */
    onDifficultySelected(difficulty) {
        // console.log(`🎯 用户选择难度: ${difficulty}`);

        // 播放点击音效
        if (this.engine && this.loadedSounds.has('popo')) {
            this.engine.playSound('popo');
        }

        // 隐藏难度选择界面
        if (this.startMc) {
            this.startMc.visible = false;
        }

        // 保存选择的难度
        this.selectedDifficulty = difficulty;

        // 根据难度设置游戏参数
        // this.applyDifficultySettings(difficulty);

        // 继续游戏初始化流程
        // this.continueInitialization();
    }
}

// 创建全局实例
window.SelectLine = new SelectLine();
// console.log('✅ SelectLine 模块加载完成');

/***/ }),

/***/ 604:
/***/ ((module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* module decorator */ module = __webpack_require__.hmd(module);
// import androidAd;


if (typeof window !== 'undefined') window.ovo = window.ovo || {};
const ovo = (typeof window !== 'undefined') ? window.ovo : {};

// Banner广告标志，确保只显示一次
ovo.bannerShown = false;

// 插页广告冷却时间控制
ovo.lastInterstitialAdTime = 0;
ovo.interstitialAdCooldown = 30000; // 30秒冷却时间

// 激励广告冷却时间控制
ovo.lastRewardedAdTime = 0;
ovo.rewardedAdCooldown = 30000; // 30秒冷却时间

// 广告冷却时间管理方法
ovo.getInterstitialAdCooldownRemaining = function() {
    const now = Date.now();
    const timeSinceLastAd = now - ovo.lastInterstitialAdTime;
    return Math.max(0, ovo.interstitialAdCooldown - timeSinceLastAd);
};

ovo.getRewardedAdCooldownRemaining = function() {
    const now = Date.now();
    const timeSinceLastAd = now - ovo.lastRewardedAdTime;
    return Math.max(0, ovo.rewardedAdCooldown - timeSinceLastAd);
};

ovo.resetInterstitialAdCooldown = function() {
    ovo.lastInterstitialAdTime = 0;
    try { console.log('[ovosdk] Interstitial ad cooldown reset'); } catch (e) { }
};

ovo.resetRewardedAdCooldown = function() {
    ovo.lastRewardedAdTime = 0;
    try { console.log('[ovosdk] Rewarded ad cooldown reset'); } catch (e) { }
};

ovo.pauseAudioForAd = () => {
    try {
        if (window.__GAME_ENGINE_INSTANCE__ && typeof window.__GAME_ENGINE_INSTANCE__.pauseAudio === 'function') {
            window.__GAME_ENGINE_INSTANCE__.pauseAudio();
            window.__adPausedBySdk__ = 'engine';
            return;
        }
        if (typeof createjs !== 'undefined' && createjs.Sound && typeof createjs.Sound.setMute === 'function') {
            window.__adUserMusicEnabled__ = (localStorage.getItem('musicEnabled') === null || localStorage.getItem('musicEnabled') === 'true');
            createjs.Sound.setMute(true);
            window.__adPausedBySdk__ = 'soundjs';
            return;
        }
    } catch (e) { try { window.__sdklog2('pauseAudioForAd error', e); } catch (e) { } }
};

ovo.resumeAudioAfterAd = () => {
    try {
        if (window.__adPausedBySdk__ === 'engine') {
            if (window.__GAME_ENGINE_INSTANCE__ && typeof window.__GAME_ENGINE_INSTANCE__.resumeAudio === 'function') {
                window.__GAME_ENGINE_INSTANCE__.resumeAudio();
            }
            window.__adPausedBySdk__ = null;
            return;
        }
        if (window.__adPausedBySdk__ === 'soundjs') {
            const shouldUnmute = (localStorage.getItem('musicEnabled') === null || localStorage.getItem('musicEnabled') === 'true');
            if (shouldUnmute) {
                if (typeof createjs !== 'undefined' && createjs.Sound && typeof createjs.Sound.setMute === 'function') {
                    createjs.Sound.setMute(false);
                }
            }
            window.__adPausedBySdk__ = null;
            return;
        }
    } catch (e) { try { window.__sdklog2('resumeAudioAfterAd error', e); } catch (e) { } }
};

// 游戏暂停和恢复方法
ovo.pauseGame = () => {
    try {
        // 暂停CreateJS Ticker
        if (typeof createjs !== 'undefined' && createjs.Ticker) {
            createjs.Ticker.paused = true;
            window.__gamePausedBySdk__ = true;
            try { console.log('[ovosdk] Game paused via Ticker'); } catch (e) { }
        }
        
        // 如果有游戏引擎实例，也暂停它
        if (window.__GAME_ENGINE_INSTANCE__ && typeof window.__GAME_ENGINE_INSTANCE__.pause === 'function') {
            window.__GAME_ENGINE_INSTANCE__.pause();
        }
    } catch (e) { try { window.__sdklog2('pauseGame error', e); } catch (e) { } }
};

ovo.resumeGame = () => {
    try {
        // 恢复CreateJS Ticker
        if (typeof createjs !== 'undefined' && createjs.Ticker) {
            createjs.Ticker.paused = false;
            window.__gamePausedBySdk__ = false;
            try { console.log('[ovosdk] Game resumed via Ticker'); } catch (e) { }
        }
        
        // 如果有游戏引擎实例，也恢复它
        if (window.__GAME_ENGINE_INSTANCE__ && typeof window.__GAME_ENGINE_INSTANCE__.resume === 'function') {
            window.__GAME_ENGINE_INSTANCE__.resume();
        }
    } catch (e) { try { window.__sdklog2('resumeGame error', e); } catch (e) { } }
};

// 振动功能
ovo.vibrate = function(pattern) {
    try {
        console.log('[ovosdk] vibrate invoked, pattern:', pattern);
        
        // 默认振动模式：短振动
        if (!pattern) {
            pattern = [100]; // 100ms 振动
        }
        
        // 优先使用 Android 原生振动
        if (typeof window.Android !== 'undefined' && typeof window.Android.vibrate === 'function') {
            try {
                if (Array.isArray(pattern)) {
                    // 如果是数组，转换为字符串传递给 Android
                    window.Android.vibrate(pattern.join(','));
                } else {
                    window.Android.vibrate(String(pattern));
                }
                return true;
            } catch (e) {
                console.warn('[ovosdk] Android.vibrate failed, falling back to navigator', e);
            }
        }
        
        // 回退到 Web Vibration API
        if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
            navigator.vibrate(pattern);
            return true;
        }
        
        console.log('[ovosdk] Vibration not supported on this platform');
        return false;
    } catch (e) {
        try { console.log('[ovosdk] vibrate error:', e); } catch (e) { }
        return false;
    }
};

// Banner广告方法
ovo.showBannerAd = function (callback, opts) {
    opts = opts || {};
    try { console.log('[ovosdk] showBannerAd invoked, Platform=', window.Platform); } catch (e) { }

    // 检查是否已经显示过banner
    if (ovo.bannerShown) {
        try { console.log('[ovosdk] Banner already shown, skipping'); } catch (e) { }
        if (typeof callback === 'function') callback(false);
        return;
    }

    if (typeof window.showBannerAd === 'function') {
        window.showBannerAd(function (result) {
            if (result) {
                ovo.bannerShown = true; // 设置标志，表示已显示
            }
            if (typeof callback === 'function') callback(result);
        }, opts);
    } else {
        try { console.log('[ovosdk] no banner ad bridge available'); } catch (e) { }
        if (typeof callback === 'function') callback(false);
    }
};

ovo.hideBannerAd = function (callback, opts) {
    opts = opts || {};
    try { console.log('[ovosdk] hideBannerAd invoked, Platform=', window.Platform); } catch (e) { }

    if (typeof window.hideBannerAd === 'function') {
        window.hideBannerAd(function (result) {
            if (result) {
                ovo.bannerShown = false; // 重置标志
            }
            if (typeof callback === 'function') callback(result);
        }, opts);
    } else {
        try { console.log('[ovosdk] no banner ad bridge available'); } catch (e) { }
        if (typeof callback === 'function') callback(false);
    }
};

// 游戏事件上报方法
ovo.dotScore = function (score, level) {
    try {
        console.log('[ovosdk] dotScore:', score, 'level:', level);

        // GA4 event
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
            window.gtag('event', 'score_update', {
                score: score,
                level: level || 'unknown',
                platform: window.Platform || 'unknown',
                send: 'sdk'
            });
        }
    } catch (e) { try { window.__sdklog2('dotScore error', e); } catch (e) { } }
};

ovo.dotLevel = function (level, score) {
    try {
        console.log('[ovosdk] dotLevel:', level, 'score:', score);

        // GA4 event
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
            window.gtag('event', 'level_up', {
                level: level,
                score: score || 0,
                platform: window.Platform || 'unknown',
                send: 'sdk'
            });
        }
    } catch (e) { try { window.__sdklog2('dotLevel error', e); } catch (e) { } }
};

ovo.dotGameOver = function (score, level, reason) {
    try {
        console.log('[ovosdk] gameOver - score:', score, 'level:', level, 'reason:', reason);

        // GA4 event
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
            window.gtag('event', 'level_end', {
                level: level || 1,
                score: score || 0,
                success: false,
                reason: reason || 'game_over',
                platform: window.Platform || 'unknown',
                send: 'sdk'
            });
        }
    } catch (e) { try { window.__sdklog2('gameOver error', e); } catch (e) { } }
};

ovo.dotGameWin = function (score, level, timeSpent) {
    try {
        console.log('[ovosdk] dotGameWin - score:', score, 'level:', level, 'time:', timeSpent);

        // GA4 event
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
            window.gtag('event', 'level_end', {
                level: level || 1,
                score: score || 0,
                success: true,
                time_spent: timeSpent || 0,
                platform: window.Platform || 'unknown',
                send: 'sdk'
            });
        }
    } catch (e) { try { window.__sdklog2('gameWin error', e); } catch (e) { } }
};

// 游戏开始事件
ovo.dotGameStart = function (levelName, character) {
    try {
        console.log('[ovosdk] dotGameStart - level:', levelName, 'character:', character);

        // GA4 event
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
            window.gtag('event', 'level_start', {
                level_name: levelName || 'main_game',
                character: character || 'player',
                platform: window.Platform || 'unknown',
                send: 'sdk'
            });
        }
    } catch (e) { try { window.__sdklog2('dotGameStart error', e); } catch (e) { } }
};

// 游戏内容选择事件
ovo.dotSelectContent = function (contentType, contentId) {
    try {
        console.log('[ovosdk] dotSelectContent - type:', contentType, 'id:', contentId);

        // GA4 event
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
            window.gtag('event', 'select_content', {
                content_type: contentType || 'game_action',
                content_id: contentId || 'unknown',
                platform: window.Platform || 'unknown',
                send: 'sdk'
            });
        }
    } catch (e) { try { window.__sdklog2('dotSelectContent error', e); } catch (e) { } }
};

// 引导完成事件
ovo.dotTutorialComplete = function () {
    try {
        console.log('[ovosdk] dotTutorialComplete');

        // GA4 event
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
            window.gtag('event', 'tutorial_complete', {
                platform: window.Platform || 'unknown',
                send: 'sdk'
            });
        }
    } catch (e) { try { window.__sdklog2('dotTutorialComplete error', e); } catch (e) { } }
};

ovo.timeAd = 30000;

ovo.showInterstitialAd = function (callback, opts) {
    opts = opts || {};
    const timeoutMs = (opts && opts.timeoutMs) || 8000;
    const force = opts.force || false; // 新增：强制显示参数
    try { console.log('[ovosdk] showInterstitialAd invoked, Platform=', window.Platform); } catch (e) { }
    
    // 检查冷却时间（除非强制显示）
    if (!force) {
        const now = Date.now();
        const timeSinceLastAd = now - ovo.lastInterstitialAdTime;
        
        if (timeSinceLastAd < ovo.interstitialAdCooldown) {
            const remainingTime = Math.ceil((ovo.interstitialAdCooldown - timeSinceLastAd) / 1000);
            try { 
                console.log(`[ovosdk] Interstitial ad on cooldown. ${remainingTime} seconds remaining.`); 
            } catch (e) { }
            
            // 直接调用回调，表示广告未显示
            if (typeof callback === 'function') callback(false);
            return;
        }
    }
    
    // 暂停声音和游戏
    ovo.pauseAudioForAd();
    ovo.pauseGame();

    if (typeof window.showInterstitialAd === 'function') {
        window.showInterstitialAd(function (result) {
            // 更新最后调用时间
            if (result) {
                ovo.lastInterstitialAdTime = Date.now();
            }
            ovo.resumeAudioAfterAd();
            ovo.resumeGame();
            if (typeof callback === 'function') callback(result);
        }, { timeoutMs: timeoutMs });
    } else {
        // No native or web ad available — call callback immediately (no ad shown)
        try { console.log('[ovosdk] no ad bridge available, invoking callback immediately'); } catch (e) { }
        ovo.resumeAudioAfterAd();
        ovo.resumeGame();
        if (typeof callback === 'function') callback(false);
    }
};

ovo.showRewardedAd = function (callback, opts) {
    opts = opts || {};
    const timeoutMs = (opts && opts.timeoutMs) || 8000;
    const force = opts.force || false; // 新增：强制显示参数

    try { console.log('[ovosdk] showRewardedAd invoked, Platform=', window.Platform); } catch (e) { }
    
    // 检查冷却时间（除非强制显示）
    if (!force) {
        const now = Date.now();
        const timeSinceLastAd = now - ovo.lastRewardedAdTime;
        
        if (timeSinceLastAd < ovo.rewardedAdCooldown) {
            const remainingTime = Math.ceil((ovo.rewardedAdCooldown - timeSinceLastAd) / 1000);
            try { 
                console.log(`[ovosdk] Rewarded ad on cooldown. ${remainingTime} seconds remaining.`); 
            } catch (e) { }
            
            // 直接调用回调，表示广告未显示
            if (typeof callback === 'function') callback(false);
            return;
        }
    }
    
    // 暂停声音和游戏
    ovo.pauseAudioForAd();
    ovo.pauseGame();

    if (typeof window.showRewardedAd === 'function') {
        window.showRewardedAd(function (result) {
            // 更新最后调用时间
            if (result) {
                ovo.lastRewardedAdTime = Date.now();
            }
            ovo.resumeAudioAfterAd();
            ovo.resumeGame();
            if (typeof callback === 'function') callback(result);
        }, { timeoutMs: timeoutMs });
    } else {
        // No native or web ad available — call callback immediately (no ad shown)
        try { console.log('[ovosdk] no ad bridge available, invoking callback immediately'); } catch (e) { }
        ovo.resumeAudioAfterAd();
        ovo.resumeGame();
        if (typeof callback === 'function') callback(false);
    }
};
// Export for module imports
if ( true && module.exports) {
    module.exports = ovo;
}
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (ovo)));

/***/ }),

/***/ 801:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";

// EXTERNAL MODULE: ./src/utile.js
var utile = __webpack_require__(911);
// EXTERNAL MODULE: ./src/ovosdk.js
var ovosdk = __webpack_require__(604);
// EXTERNAL MODULE: ./adsdk/android_ad.js
var android_ad = __webpack_require__(864);
// EXTERNAL MODULE: ./adsdk/gd_ad.js
var gd_ad = __webpack_require__(296);
;// ./src/config.js

// 先设置全局平台变量，确保在导入广告模块前可用
window.Platform = "googleplay";





// window.Platform = "gamedistribution";
// window.Platform = "default";

const config = {
    "scene": {
        "width": 1080,
        "height": 1920,
        "orientation": "portrait",
        "backgroundColor": "#ffffff",
        "fps": 30
    },
    "compositions": {
        "loading": {
            "id": "12AB51DFDAB942FF88C62B7BF520AB4C",
            "src": "resan/vendor-animate.js",
            "description": "Loading screen composition"
        },
        "game": {
            "id": "994179DFE830400BA68CFA701D2BB3AB",
            "src": "resan/vendor-animate.js",
            "description": "Main game composition"
        }
    },
    "gameconfig": {

        "sounds": [
            { "id": "bgm", "src": "assets/sound/bgm.mp3", "type": "sound" },
            { "id": "popo", "src": "assets/sound/popo.mp3", "type": "sound" },
            { "id": "goodmin", "src": "assets/sound/goodmin.mp3", "type": "sound" },
            { "id": "click", "src": "assets/sound/click.mp3", "type": "sound" },
            { "id": "win", "src": "assets/sound/win.mp3", "type": "sound" },
            { "id": "wrong", "src": "assets/sound/wrong.mp3", "type": "sound" },
            { "id": "open", "src": "assets/sound/open.mp3", "type": "sound" },
            { "id": "longhou_min", "src": "assets/sound/longhou_min.mp3", "type": "sound" },
            { "id": "select_wawa", "src": "assets/sound/select_wawa.mp3", "type": "sound" },
            { "id": "select_jiji", "src": "assets/sound/select_jiji.mp3", "type": "sound" },
            { "id": "hecheng_open", "src": "assets/sound/hecheng_open.mp3", "type": "sound" },
            { "id": "wrong2", "src": "assets/sound/wrong2.mp3", "type": "sound" },
            { "id": "card", "src": "assets/sound/card.mp3", "type": "sound" }
        ],
        "images": [
            { "id": "bg", "src": "assets/image/background.jpg", "type": "image" },
            { "id": "logo", "src": "assets/image/logo.png", "type": "image" }
        ]
    }
}

/* harmony default export */ const src_config = (config);

window.__sdklog2 = function (...args) {
    if (typeof process !== 'undefined' && process.env && "production" === 'production') return; // 生产环境不输出
    const formatParam = (arg) => {
        if (typeof arg === 'string') return `'${arg}'`;
        if (typeof arg === 'object') return JSON.stringify(arg);
        return String(arg);
    };

    const params = args.map(formatParam).join(' ');

    console.log(
        `%c ***CPSDK***: ${params}`,
        'background: linear-gradient(to right, #8e44ad, #ba43ff); ' +
        'color: white; ' +
        'padding: 5px 15px; ' +
        'border-radius: 5px; ' +
        'font-weight: bold; ' +
        'text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);'

    );
};

window.__sdklog3 = function (...args) {
    if (true) return; // 生产环境不输出
    // removed by dead control flow
{}

    // removed by dead control flow
{}

    // removed by dead control flow
{}
}




;// ./src/init.js
// ...existing code...



// 兼容旧脚本对 window.utile 的依赖
if (typeof window !== 'undefined') {
    window.utile = utile/* default */.A;
    window.__GAME_ENGINE_STARTED__ = window.__GAME_ENGINE_STARTED__ || false;
}
/**
 * 小游戏引擎初始化器
 */
class GameEngine {
    constructor() {
        this.config = null;
        this.gameContainer = null;
        this.animationContainer = null;
        this.canvas = null;
        this.stage = null;
        this.loadingProgress = null;
        this.currentProgress = 0;
        this.loadingCompleteLogged = false; // 防止重复显示"Loading complete!"消息

        // 游戏相关变量
        this.publicRoot = null;
        this.exportRoot = null;
        this.mainComp = null;
        this.pubComp = null;
        this.mainLib = null;
        this.pubLib = null;
        this.pubSound = [];
        this.soundArr = [];
        this.imgArr = [];
        this.gl_mc = null;
        this.gl_loadBar = null;
        this.template = null;
        this.mainCode = null;
        this.mainName = null;
        this.config_data = {};
        this.soundInitialized = false;
        this.loadedSounds = new Map();
        this.loadedImages = new Map();
        this.soundStatus = {};
        this.__resourcesLoading__ = false;
        this.__sceneSwitching__ = false;
        this.bgmInstance = null;
        this._bgmNext = null;
        this._bgmTicker = null;
        this._bgmCrossfadeMs = 50;   // 提前 80ms 交叠，按需微调 50~120
        this._bgmOffsetMs = 0;       // 如音频前端有静默可设置偏移起点
        this._bgmDurMs = null;       // 如已知“有效循环时长”，可设置；否则用实例 duration
        this.activeSFX = new Set();  // 仅保存需要恢复的短音效实例 id

    }

    // Wait for critical assets to be ready: preloaded images and non-bgm sounds.
    // Returns when all assets are present or when timeoutMs elapses.
    ensureAllAssetsReady(timeoutMs = 10000) {
        const start = Date.now();
        const checkInterval = 250;

        const hasImage = (id) => {
            try {
                if (!this.loadedImages) return false;
                // support either Map or plain object
                if (this.loadedImages instanceof Map) {
                    return !!this.loadedImages.get(id);
                }
                return !!this.loadedImages[id];
            } catch (e) {
                return false;
            }
        };

        const hasSound = (id) => {
            try {
                // CreateJS Sound stores registrations in createjs.Sound._masterPlayPropsHash or registry; feature-detect
                if (!window.createjs || !window.createjs.Sound) return false;
                // soundJS exposes .registerSound calls but no official query; use internal registry if available
                const reg = window.createjs.Sound._soundInstances || window.createjs.Sound._idHash || window.createjs.Sound._namedSounds;
                if (!reg) return true; // can't verify, assume ready
                return !!reg[id] || !!window.createjs.Sound._idHash && !!window.createjs.Sound._idHash[id];
            } catch (e) {
                return true; // be permissive on error
            }
        };

        return new Promise((resolve) => {
            console.log('ensureAllAssetsReady: start, timeoutMs=', timeoutMs, 'sceneManifest=', !!this.sceneManifest);
            const check = () => {
                // Determine critical images from the currently selected scene manifest if available
                let imagesOk = true;
                if (this.sceneManifest && Array.isArray(this.sceneManifest.images)) {
                    for (const img of this.sceneManifest.images) {
                        if (!hasImage(img.id) && !hasImage(img.src)) {
                            imagesOk = false;
                            break;
                        }
                    }
                }

                // Determine critical sounds (non-bgm) from manifest
                let soundsOk = true;
                if (this.sceneManifest && Array.isArray(this.sceneManifest.sounds)) {
                    for (const s of this.sceneManifest.sounds) {
                        if (s.id === 'bgm') continue;
                        if (!hasSound(s.id) && !hasSound(s.src)) {
                            soundsOk = false;
                            break;
                        }
                    }
                }

                const elapsed = Date.now() - start;
                if (imagesOk && soundsOk) {
                    console.log('ensureAllAssetsReady: all critical assets ready after', elapsed, 'ms');
                    return resolve(true);
                }

                if (elapsed >= timeoutMs) {
                    console.warn('ensureAllAssetsReady: timeout after', elapsed, 'ms — proceeding anyway');
                    return resolve(false);
                }

                setTimeout(check, checkInterval);
            };

            check();
        });
    }

    async init() {

        if (window.__GAME_ENGINE_STARTED__) {
            console.warn('⚠️ GameEngine 已启动，跳过重复初始化');
            return;
        }
        window.__GAME_ENGINE_STARTED__ = true;
        // console.log('Game Engine Starting...');

        // 并行执行：加载配置 + 预加载关键库文件

        await this.loadConfig();
        this.applyConfig();

        // 开始加载游戏资源
        // 必须先创建loading舞台与元件
        await this.loadPreloader();
        // 这里显式启动并等待游戏资源加载（唯一入口）
        await this.startGameConfigLoading();

        // 添加用户交互检测
        this.setupAutoplayHandler();
        // 不在这里隐藏加载界面，等登录完成后再隐藏
        // this.hideBasicLoading();
        // 添加焦点事件监听
        this.setupFocusBlurHandler();
    }


    pauseAudio() {
        // 只暂停，不改变 soundEnabled / musicEnabled
        if (this.bgmInstance && this.bgmInstance.playState === createjs.Sound.PLAY_SUCCEEDED && !this.bgmInstance.paused) {
            try {
                if (typeof this.bgmInstance.pause === 'function') {
                    this.bgmInstance.pause();
                } else if (typeof this.bgmInstance.setPaused === 'function') {
                    this.bgmInstance.setPaused(true);
                } else if ('paused' in this.bgmInstance) {
                    this.bgmInstance.paused = true;
                } else {
                    // 无直接 pause 接口时，尽量保持实例存在，不强制 stop（避免永久中断）
                    try {
                        if (this.bgmInstance && typeof this.bgmInstance.setPaused === 'function') {
                            this.bgmInstance.setPaused(true);
                        } else if (this.bgmInstance && 'paused' in this.bgmInstance) {
                            this.bgmInstance.paused = true;
                        }
                    } catch (e) {
                        // 如果无法 pause，避免调用 stop 导致实例被置空，改为记录状态仅用于恢复时重新 play
                        this.soundStatus['bgm'] = false;
                    }
                }
            } catch (e) {
                console.warn('暂停 BGM 失败, 采用 stop 回退', e);
                this.stopSound('bgm');
            }
        }
        // 恢复时才需要的记录：把当前在播放且已记录的 sfx 暂停
        this._pausedSFX = [];
        this.activeSFX.forEach(id => {
            const inst = createjs.Sound._instances && createjs.Sound._instances[id]; // 若你未修改 SoundJS 内部，可跳过
            // 简化：直接用 stop，不做位置恢复；如果想保留位置改 setPaused(true)
            try {
                createjs.Sound.stop(id);
                this._pausedSFX.push(id); // 标记可重启
            } catch (e) { }
        });
    }

    resumeAudio() {
        // 恢复 BGM（尊重用户是否关闭音乐）
        const musicOn = localStorage.getItem('musicEnabled') === null || localStorage.getItem('musicEnabled') === 'true';
        if (musicOn) {
            if (this.bgmInstance) {
                try {
                    if (this.bgmInstance.paused) {
                        if (typeof this.bgmInstance.resume === 'function') {
                            this.bgmInstance.resume();
                        } else if (typeof this.bgmInstance.play === 'function' && typeof this.bgmInstance.setPaused !== 'function') {
                            // 某些实现 pause()/play() 配对
                            this.bgmInstance.play();
                        } else if (typeof this.bgmInstance.setPaused === 'function') {
                            this.bgmInstance.setPaused(false);
                        } else if ('paused' in this.bgmInstance) {
                            this.bgmInstance.paused = false;
                        } else {
                            // 回退方案：重新播放
                            this.playSound('bgm', { loop: -1, volume: 0.4 });
                        }
                        this.soundStatus['bgm'] = true;
                    }
                } catch (e) {
                    console.warn('恢复 BGM 失败，重新播放回退', e);
                    this.playSound('bgm', { loop: -1, volume: 0.4 });
                }
            } else if (!this.soundStatus['bgm']) {
                this.playSound('bgm', { loop: -1, volume: 0.4 });
            }
        }
        // 恢复需要的循环短音效
        const soundOn = localStorage.getItem('soundEnabled') === null || localStorage.getItem('soundEnabled') === 'true';
        if (soundOn && Array.isArray(this._pausedSFX)) {
            this._pausedSFX.forEach(id => this.playSound(id, { loop: -1, volume: 1 }));
        }
        this._pausedSFX = null;
    }

    setupFocusBlurHandler() {
        const pauseGame = () => {
            // console.log('🛑 页面失去焦点，暂停');
            // createjs.Ticker.paused = true;
            this.pauseAudio();
        };
        const resumeGame = () => {
            // console.log('▶️ 页面获得焦点，恢复');
            // createjs.Ticker.paused = false;
            this.resumeAudio();
        };
        window.addEventListener('blur', pauseGame);
        window.addEventListener('focus', resumeGame);
        // console.log('🎮 焦点事件监听已添加');
    }

    getLoadingCompositionId() {
        // 现在使用 HTML 加载条，不再需要 Adobe Animate loading composition
        // console.log('使用 HTML 加载条，不需要 loading composition ID');
        return null;
    }

    getGameCompositionId() {
        // 从配置文件获取游戏组合ID
        if (this.config && this.config.compositions && this.config.compositions.game) {
            const gameId = this.config.compositions.game.id;
            // console.log('从配置文件获取game组合ID:', gameId);
            return gameId;
        }

        // 回退到硬编码ID
        console.warn('无法从配置获取游戏组合ID，使用默认值');
        return "994179DFE830400BA68CFA701D2BB3AB";
    }


    applyStageTransform() {
        if (!this.stage) return;

        // 应用变换到 stage
        this.stage.rotation = this.stageRotation;
        this.stage.x = this.stageX;
        this.stage.y = this.stageY;
        this.stage.scaleX = this.stageScale;
        this.stage.scaleY = this.stageScale;

        // 更新 stage
        this.stage.update();

        // console.log(`Stage transform applied: rotation=${this.stageRotation}, x=${this.stageX}, y=${this.stageY}, scale=${this.stageScale}`);
    }

    async loadConfig() {
        try {
            // 优先从 manifest.json 加载配置
            // const response = await fetch('./manifest.json');
            // if (response.ok) {
            //     this.config = await response.json();
                // console.log('Config loaded from manifest.json:', this.config);
            // } else {
                // 回退到模块化 config
                this.config = src_config || {};
                // console.log('Config loaded from config.js (fallback):', this.config);
            // }

            // 兼容 manifest.json 中的 initial 字段，优先使用 config.initial，其次尝试 config.gameconfig.initial
            const initialList = this.config.initial || (this.config.gameconfig && this.config.gameconfig.initial) || null;
            if (initialList && Array.isArray(initialList)) {
                // console.log('开始加载 initial 资源:', initialList);
                for (const resource of initialList) {
                    await this.loadScript(resource);
                }
                // console.log('✅ initial 资源加载完成');
            }
        } catch (error) {
            console.error('Failed to load config:', error);
            // 最终回退到模块化 config
            this.config = src_config || {};
            // console.log('Using fallback config.js due to error');
        }
    }

    /**
     * 检测是否为PC设备
     * @returns {boolean} 是否为PC设备
     */
    isPCDevice() {
        // 方法1：检测用户代理字符串
        const userAgent = navigator.userAgent.toLowerCase();
        const mobileKeywords = [
            'android', 'iphone', 'ipad', 'ipod', 'blackberry',
            'windows phone', 'mobile', 'tablet', 'webos', 'opera mini'
        ];

        const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));

        // 方法2：检测触摸支持（辅助判断）
        const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        // 方法3：检测屏幕尺寸（辅助判断）
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const minScreenSize = Math.min(screenWidth, screenHeight);
        const maxScreenSize = Math.max(screenWidth, screenHeight);

        // PC端通常屏幕较大，且宽高比不会太极端
        const isLargeScreen = minScreenSize >= 768 && maxScreenSize >= 1024;

        // 综合判断：不是移动设备UA 且 (屏幕较大 或 无触摸支持)
        const isPCDevice = !isMobileUA && (isLargeScreen || !hasTouchSupport);

        // console.log('🔍 设备检测详情:', {
        //     userAgent: userAgent,
        //     isMobileUA: isMobileUA,
        //     hasTouchSupport: hasTouchSupport,
        //     screenSize: `${screenWidth}x${screenHeight}`,
        //     isLargeScreen: isLargeScreen,
        //     finalResult: isPCDevice ? 'PC' : 'Mobile'
        // });

        return isPCDevice;
    }

    applyConfig() {

        this.gameContainer = document.getElementById('game-container');
        this.animationContainer = document.getElementById('animation_container');
        this.canvas = document.getElementById('canvas');
        
        // 设置Canvas willReadFrequently属性以优化getImageData性能
        if (this.canvas) {
            this.canvas.setAttribute('willReadFrequently', 'true');
        }
        
        this.loadingProgress = document.querySelector('.loading-progress');

        // 移除之前的事件监听器，避免重复
        window.removeEventListener('resize', this.resizeHandler);


        this.resizeHandler = () => {
            if (!this.designWidth || !this.designHeight) return;

            // 获取容器尺寸（逻辑像素）
            const stageWidth = this.gameContainer.clientWidth;
            const stageHeight = this.gameContainer.clientHeight;

            // 高分屏支持
            this.dpr = window.devicePixelRatio || 1;
            const enableHiDPI = (localStorage.getItem('hiDPI') || 'true') === 'true';
            const effectiveDpr = enableHiDPI ? this.dpr : 1;

            // Canvas 视觉尺寸
            this.canvas.style.width = stageWidth + 'px';
            this.canvas.style.height = stageHeight + 'px';
            // Canvas 实际像素尺寸
            this.canvas.width = Math.round(stageWidth * effectiveDpr);
            this.canvas.height = Math.round(stageHeight * effectiveDpr);



            // 根据配置的设计尺寸进行适配
            const designWidth = this.designWidth;
            const designHeight = this.designHeight;

            // 检测是否为PC端
            const isPCDevice = this.isPCDevice();
            // console.log(`🖥️ 设备类型检测: ${isPCDevice ? 'PC端' : '移动端'}`);


            // 判断当前屏幕是否为竖屏
            const isScreenPortrait = stageWidth < stageHeight;
            // 判断设计尺寸是否为竖屏
            const isDesignPortrait = designWidth < designHeight;

            if (isPCDevice) {
                this.baseStageScale = Math.min(stageWidth / designWidth, stageHeight / designHeight);
                this.stageRotation = 0;
                this.stageX = (stageWidth - designWidth * this.baseStageScale) / 2;
                this.stageY = (stageHeight - designHeight * this.baseStageScale) / 2;
            } else {
                if (isScreenPortrait === isDesignPortrait) {
                    this.baseStageScale = Math.min(stageWidth / designWidth, stageHeight / designHeight);
                    this.stageRotation = 0;
                    this.stageX = stageWidth / 2 - designWidth * this.baseStageScale / 2;
                    this.stageY = stageHeight / 2 - designHeight * this.baseStageScale / 2;
                } else {
                    this.baseStageScale = Math.min(stageWidth / designHeight, stageHeight / designWidth);
                    this.stageRotation = 90;
                    this.stageX = designHeight * this.baseStageScale + stageWidth / 2 - designHeight * this.baseStageScale / 2;
                    this.stageY = stageHeight / 2 - designWidth * this.baseStageScale / 2;
                }
            }

            // 综合 DPR 的真实缩放
            this.stageScale = this.baseStageScale * effectiveDpr;
            this.stageX = Math.round(this.stageX * effectiveDpr);
            this.stageY = Math.round(this.stageY * effectiveDpr);

            this.applyStageTransform();
            this.updateImageSmoothing();
        }


        // 添加事件监听
        window.addEventListener('resize', this.resizeHandler);

        const { width = 1920, height = 1080, orientation = 'landscape', backgroundColor = '#CED1D3' } = this.config.scene || {};

        // 保存设计尺寸
        this.designWidth = width;
        this.designHeight = height;
        this.orientation = orientation;

        // 应用场景尺寸
        // this.animationContainer.style.backgroundColor = backgroundColor;

        // 设置canvas初始尺寸
        const initDpr = window.devicePixelRatio || 1;
        this.canvas.width = width * initDpr;
        this.canvas.height = height * initDpr;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        
        // 确保willReadFrequently属性已设置
        if (this.canvas) {
            this.canvas.setAttribute('willReadFrequently', 'true');
        }

        // 应用方向设置
        if (orientation === 'portrait') {
            this.animationContainer.classList.add('portrait');
        } else {
            this.animationContainer.classList.remove('portrait');
        }

        // console.log(`Scene configured: ${width}x${height}, ${orientation}`);

        // 重新调整大小
        this.resizeHandler();
    }

    async loadGameResources() {

        const initialScripts = Array.isArray(this.config.initial) ? this.config.initial : [];
        const gameScripts = Array.isArray(this.config.game) ? this.config.game : [];
        const scripts = [...initialScripts, ...gameScripts];


        const sounds = this.config.gameconfig.sounds || [];
        const images = this.config.gameconfig.images || [];

        // 将背景音乐资源优先加载
        const bgmResource = sounds.find(sound => sound.id === 'bgm');
        const otherSounds = sounds.filter(sound => sound.id !== 'bgm');
        const prioritizedSounds = bgmResource ? [bgmResource, ...otherSounds] : otherSounds;

        const total = scripts.length + prioritizedSounds.length + images.length;
        let loaded = 0;

        // console.log(`开始并行加载 ${total} 个资源...`);

        // 并行加载所有资源
        const loadPromises = [
            ...scripts.map(async (script) => {
                await this.loadScript(script);
                loaded++;
                this.updateLoadingProgress((loaded / total) * 100);
            }),
            ...prioritizedSounds.map(async (sound) => {
                await this.loadSound(sound.id, sound.src);
                loaded++;
                this.updateLoadingProgress((loaded / total) * 100);
            }),
            ...images.map(async (image) => {
                await this.loadImage(image.id, image.src);
                loaded++;
                this.updateLoadingProgress((loaded / total) * 100);
            })
        ];
        // 等待所有脚本加载完成
        await Promise.all(loadPromises);
        // console.log('所有脚本加载完成');
    }


    async loadPreloader() {
        return new Promise((resolve) => {
            // console.log('使用 HTML 加载条，跳过 Adobe Animate loading composition');

            // 直接初始化 CreateJS 舞台，不需要加载 loading composition
            this.stage = new createjs.Stage(this.canvas);
            this.stage.snapToPixelEnabled = true;
            createjs.Ticker.framerate = this.config.scene?.fps || 30;
            createjs.Ticker.addEventListener("tick", this.stageUpdateHandler.bind(this));

            // 应用舞台变换设置
            this.applyStageTransform();

            // 直接完成，使用 HTML 加载条显示进度
            resolve();
        });
    }

    updateImageSmoothing() {
        try {
            const smooth = (localStorage.getItem('imageSmooth') || 'true') === 'true';
            const ctx = this.canvas.getContext('2d');
            if (ctx) ctx.imageSmoothingEnabled = smooth;
        } catch (e) { }
    }

    // Convert screen client coordinates (e.g. touch/mouse) to design coordinates
    screenToDesign(clientX, clientY) {
        if (!this.canvas || !this.designWidth || !this.designHeight) return { x: clientX, y: clientY };
        const rect = this.canvas.getBoundingClientRect();
        // normalized to 0..1 in visual canvas
        const nx = (clientX - rect.left) / rect.width;
        const ny = (clientY - rect.top) / rect.height;
        // map to design coordinates
        const designX = nx * this.designWidth;
        const designY = ny * this.designHeight;
        return { x: designX, y: designY };
    }



    async startGameConfigLoading() {

        if (this.__resourcesLoading__) {
            console.warn('⚠️ 资源加载已在进行或完成，跳过重复调用');
            return;
        }
        this.__resourcesLoading__ = true;
        try {
            // console.log('🚀 开始加载游戏资源...');

            // 获取游戏配置
            const gameConfig = this.config.gameconfig || {};
            const scripts = gameConfig.scripts || [];
            const sounds = gameConfig.sounds || [];
            const images = gameConfig.images || [];

            // 计算总资源数量
            const totalResources = scripts.length + sounds.length + images.length;

            if (totalResources === 0) {
                // console.log('没有游戏资源需要加载，直接切换场景');
                this.updateLoadingProgress(1.0);
                // setTimeout(() => {
                // }, 300);
                this.switchToGameScene();
                return;
            }

            let loadedResources = 0;

            // 显示初始进度
            this.updateLoadingProgress(0);
            this.loadingCompleteLogged = false; // 重置完成标志

            //. 优先加载图片资源（背景和Logo）
            console.log('🖼️ 优先加载UI资源...');
            for (const imageConfig of images) {
                try {
                    await this.loadResource(imageConfig, loadedResources, totalResources);
                    loadedResources++;

                    // 🔥 图片加载完成后立即应用到UI
                    if (imageConfig.id === 'bg' || imageConfig.id === 'logo') {
                        // this.applyLoadingAssets();
                    }
                } catch (error) {
                    console.warn(`⚠️ 图片加载失败: ${imageConfig.src}`, error.message);
                    loadedResources++;
                }
            }

            // 加载脚本文件
            // console.log('📜 阶段1: 加载脚本文件...');
            for (const scriptConfig of scripts) {
                try {
                    await this.loadResource(scriptConfig, loadedResources, totalResources);
                } catch (error) {
                    console.error(`💥 脚本加载失败，但继续加载其他资源: ${scriptConfig.src}`, error);
                }
                loadedResources++;
            }

            // 加载声音文件
            // console.log('🎵 阶段2: 加载声音文件...');
            for (const soundConfig of sounds) {
                try {
                    await this.loadResource(soundConfig, loadedResources, totalResources);
                } catch (error) {
                    // 声音加载失败已经在 loadResource 中处理，这里不应该到达
                    console.error(`声音加载异常: ${soundConfig.src}`, error);
                }
                loadedResources++;
            }

            createjs.Sound.muted = false; // 关闭状态静音
            // 资源全部加载后尝试自动播放 BGM（如果允许并且浏览器未拦截）
            this.tryAutoStartBGM();
            // utile.__sdklog2('🎉 所有游戏资源加载完成！');

            // 确保显示100%进度
            this.updateLoadingProgress(1.0);

            this.loadedHandler();

        } catch (error) {
            console.error('游戏资源加载失败:', error);
            // 即使失败也尝试切换场景
        }
    }

    loadedHandler() {
        console.log('🎮 资源加载完成，开始用户登录流程');

        // Update HTML loading text but keep it visible
        const loadingText = document.querySelector('.loading-text');
        if (loadingText) {
            loadingText.textContent = 'Fetching user data...';
            try {
                // inject a small stylesheet once to enlarge and blink the loading text
                if (!document.getElementById('sdk-loading-text-style')) {
                    const style = document.createElement('style');
                    style.id = 'sdk-loading-text-style';
                    style.textContent = "@keyframes sdk-blink{0%,100%{opacity:1}50%{opacity:0.15}}.sdk-loading-blink{animation:sdk-blink 1s linear infinite}.sdk-loading-large{font-size:22px !important;font-weight:600 !important;}";
                    document.head.appendChild(style);
                }
                loadingText.classList.add('sdk-loading-blink', 'sdk-loading-large');
            } catch (e) { }
        }

        // 重置进度条到 90%，为登录流程留出空间
        this.updateLoadingProgress(0.9);

        // 启动计时器（可选）
        this.startUserDataTimer();

        // 启动游戏逻辑（包含登录）
        this.startGameLogic();
    }

    /**
     * 启动用户数据加载计时器
     */
    startUserDataTimer() {
        this.userDataStartTime = Date.now();
        this.userDataTimerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.userDataStartTime) / 1000);

            const loadingText = document.querySelector('.loading-text');

            if (loadingText) {
                // show warning after 10s
                if (elapsed > 10) {
                    loadingText.textContent = `Network is slow, please wait... (${elapsed}s)`;
                    loadingText.style.color = '#FF6B6B';
                }
                // show error after 20s
                else if (elapsed > 20) {
                    loadingText.textContent = `Loading timed out, please try again... (${elapsed}s)`;
                    loadingText.style.color = '#FF0000';
                }
                else {
                    loadingText.textContent = `Fetching user data... (${elapsed}s)`;
                }
            }

        }, 1000);
    }

    /**
     * 登录完成处理
     */
    onLoginComplete() {
    // console.log('✅ User login complete');

        // 停止计时器
        if (this.userDataTimerInterval) {
            clearInterval(this.userDataTimerInterval);
            this.userDataTimerInterval = null;
        }

        // 重置加载完成标志，确保可以显示新的完成消息
        this.loadingCompleteLogged = false;

        // 更新进度条到 100%
        this.updateLoadingProgress(1.0);

        // 更新 HTML 界面显示，提示用户点击进入游戏
        const loadingText = document.querySelector('.loading-text');

        // Determine platform behavior:
        // - If platform is empty, default, or googleplay -> auto-enter
        // - Otherwise require explicit click-to-enter and show an interstitial first
        const platform = (typeof window !== 'undefined' && window.Platform) ? String(window.Platform).toLowerCase() : '';

        if (!platform || platform === 'default' || platform === 'googleplay') {
            // Default/platform not provided, or Google Play -> proceed immediately
            if (loadingText) {
                loadingText.textContent = 'Entering...';
                loadingText.style.color = '#FFFFFF';
            }
            this.switchToGameScene();
            return;
        }

        // For other platforms (like gamedistribution), require explicit click-to-enter
        if (platform) {
            if (loadingText) {
                loadingText.textContent = 'Top to enter game';
                loadingText.style.color = '#00FF00';
            }

            const preloadContainer = document.getElementById('preload_container') || document.querySelector('.loading-container') || document.body;
            const enterHandler = () => {
                try {
                    if (loadingText) {
                        loadingText.textContent = 'Entering...';
                        loadingText.style.color = '#FFFFFF';
                    }
                    if (preloadContainer) preloadContainer.style.cursor = 'default';
                } catch (e) { }
                try { if (preloadContainer) preloadContainer.removeEventListener('click', enterHandler); } catch (e) { }

                try { console.log('[init] enterHandler click detected, Platform=', window.Platform); } catch (e) { }

                // report click-to-enter using ovo method
                try {
                    if (typeof window.ovo !== 'undefined' && typeof window.ovo.dotSelectContent === 'function') {
                        window.ovo.dotSelectContent('game_action', 'enter_game_click');
                    }
                } catch (e) { }

                // Show an interstitial ad first (provider-agnostic wrapper in ovosdk.js
                // will route to GameDistribution or Android native as appropriate).
                try {
                    // Diagnostic: prefer explicit window.ovo access to avoid ReferenceError
                    try { console.log('[init] window.ovo =', window.ovo); } catch (e) { }

                    // For other platforms, show interstitial ad
                    if (typeof window !== 'undefined' && window.ovo && typeof window.ovo.showInterstitialAd === 'function') {
                        console.log('[init] calling window.ovo.showInterstitialAd()');
                        window.ovo.showInterstitialAd(() => {
                            try { console.log('[init] showInterstitialAd callback — switching to game scene'); } catch (e) { }
                            try { this.switchToGameScene(); } catch (e) { console.warn('switchToGameScene failed after ad', e); }
                        });
                        return;
                    } else {
                        try { console.log('[init] ovo.showInterstitialAd not available (will fallback)'); } catch (e) { }
                    }
                } catch (e) {
                    try { window.__sdklog2 && window.__sdklog2('window.preloadAd error', e); } catch (e) { }
                    // try { this.switchToGameScene(); } catch (e) { console.warn('switchToGameScene failed after ad', e); }
                }

                // Fallback: no ad API, enter immediately
                // this.switchToGameScene();
            };

            try {
                if (preloadContainer) {
                    preloadContainer.style.cursor = 'pointer';
                    preloadContainer.addEventListener('click', enterHandler, { once: true });
                } else {
                    // Fallback: no container found, proceed immediately
                    this.switchToGameScene();
                }
            } catch (e) {
                console.warn('Failed to attach click-to-enter handler, auto-entering', e);
                this.switchToGameScene();
            }
        } else {
            // Non-GD platforms: proceed immediately
            if (loadingText) {
                loadingText.textContent = 'Entering...';
                loadingText.style.color = '#FFFFFF';
            }
            this.switchToGameScene();
        }
    }

    async startGameLogic() {
        // console.log('🎮 启动游戏逻辑...');

        // 强制使用微信登录
        //  window.GameServer.setLoginConfig({
        //     forceLoginType: 'wechat',
        //     enableMockLogin: true,
        //     mockLoginDelay: 5000
        // });

        // // 强制使用游客模式
        window.GameServer.setLoginConfig({
            forceLoginType: 'guest',
            mockLoginDelay: 500
        })
        // 为了避免长时间卡住，设置一个 10s 的前端超时作为兜底
        const FRONTEND_TIMEOUT_MS = 10000;

        const initPromise = (async () => {
            // console.log(`🕒 calling GameServer.init() @ ${new Date().toISOString()}`);
            const res = await window.GameServer.init();
            // console.log(`🕒 GameServer.init() returned @ ${new Date().toISOString()}`);
            return res;
        })();

        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('FRONTEND_TIMEOUT')),
                FRONTEND_TIMEOUT_MS);
        });

        try {
            // 等待要么 init 成功，要么超时/失败
            const serverResult = await Promise.race([initPromise, timeoutPromise]);

            // 如果成功，进入登录完成流程
            if (serverResult?.success) {
                this.onLoginComplete();
                return;
            }
        } catch (err) {
            console.warn('🟠 GameServer.init() failed or timed out:', err && err.message ? err.message : err);
        }

        // 到这里表示后端 init() 要么 reject（例如 wechat 抛出），要么前端超时
        // 作为兜底，立刻调用游客登录逻辑，并继续进入游戏
        try {
            console.log('➡️ 触发游客登录回退流程');
            const guest = await window.GameServer.createGuestUser();
            // 保存为当前用户并继续
            window.GameServer.saveUserData('currentUser', guest);
            window.GameServer.currentUserStatus = guest;
            this.onLoginComplete();
        } catch (e) {
            console.error('❌ 游客登录回退失败:', e);
        }

    }


    updateLoadingProgress(progress) {
        // 更新 HTML 加载条
        if (this.loadingProgress) {
            // 确保进度在0-1之间
            progress = Math.max(0, Math.min(1, progress));

            const percentage = Math.round(progress * 100);
            this.loadingProgress.style.width = `${percentage}%`;

            // console.log(`📊 HTML Loading progress: ${percentage}%`);

            // 如果达到100%，显示完成信息
            if (progress >= 1.0) {
                console.log('🎯 Loading complete!');
            }
        }
    }

    async switchToGameScene() {
        if (this.__sceneSwitching__) {
            console.warn('⚠️ 场景切换已在进行，跳过重复调用');
            return;
        }
        this.__sceneSwitching__ = true;
        // console.log('🔄 切换到GameScene...');
        try {
            // 🔥 第一步：先加载GameScene（保持loading界面显示）
            // console.log('📦 预加载GameScene资源...');
            await this.preloadGameScene();

            // Ensure critical assets (scene images and non-bgm sounds) are ready before hiding loading
            await this.ensureAllAssetsReady(10000);
            // Hide the HTML loading overlay now that scene resources are preloaded
            this.hideBasicLoading();

            // 🔥 第二步：GameScene准备完成后，开始切换动画
            // console.log('✅ GameScene准备完成，开始切换动画');
            await this.performSceneTransition();

            // 🔥 第三步：清理loading场景
            this.cleanupLoadingScene();

            // 🔥 第四步：激活GameScene
            await this.activateGameScene();

            // console.log('🎉 场景切换完成！');

        } catch (error) {
            console.error('❌ 场景切换失败:', error);
            // 失败时也要清理loading场景，避免卡住
            this.cleanupLoadingScene();
        }
    }

    /**
     * 预加载GameScene资源
     */
    async preloadGameScene() {
        return new Promise((resolve, reject) => {
            // 动态获取游戏组合ID
            const gameCompositionId = this.getGameCompositionId();
            // console.log('🎮 预加载游戏组合ID:', gameCompositionId);

            const comp = AdobeAn.getComposition(gameCompositionId);
            const lib = comp.getLibrary();

            // 检查是否有manifest需要加载
            // keep the manifest so other helpers (ensureAllAssetsReady) can inspect critical assets
            this.sceneManifest = lib.properties.manifest || [];

            if (lib.properties.manifest && lib.properties.manifest.length > 0) {
                const loader = new createjs.LoadQueue(false);
                let loadedCount = 0;
                const totalCount = lib.properties.manifest.length;

                loader.addEventListener("fileload", (evt) => {
                    loadedCount++;
                    const progress = loadedCount / totalCount;

                    // 🔥 更新loading进度条显示预加载进度
                    this.updateLoadingProgress(0.8 + progress * 0.2); // 80%-100%

                    const images = comp.getImages();
                    if (evt && evt.item.type === "image") {
                        images[evt.item.id] = evt.result;
                        // also record into engine-level loadedImages map for readiness checks
                        try {
                            if (!this.loadedImages) this.loadedImages = new Map();
                            if (this.loadedImages instanceof Map) {
                                this.loadedImages.set(evt.item.id, evt.result);
                                // also try to set by src key for flexibility
                                if (evt.item && evt.item.src) this.loadedImages.set(evt.item.src, evt.result);
                            } else {
                                this.loadedImages[evt.item.id] = evt.result;
                                if (evt.item && evt.item.src) this.loadedImages[evt.item.src] = evt.result;
                            }
                        } catch (e) {
                            // non-fatal
                        }
                    }

                    // console.log(`📦 GameScene资源加载: ${loadedCount}/${totalCount}`);
                });

                loader.addEventListener("complete", () => {
                    loader.removeAllEventListeners();

                    const ss = comp.getSpriteSheet();
                    const ssMetadata = lib.ssMetadata;

                    try {
                        for (let i = 0; i < ssMetadata.length; i++) {
                            const name = ssMetadata[i].name;
                            const img = loader.getResult(name);
                            if (!img) {
                                console.warn('⚠️ SpriteSheet image missing for', name, '— loader result is null');
                            }
                            ss[name] = new createjs.SpriteSheet({
                                "images": [img],
                                "frames": ssMetadata[i].frames
                            });
                        }

                        // create exportRoot inside try/catch — missing images can throw inside Animate lib
                        let exportRoot = null;
                        try {
                            exportRoot = new lib.flygame();
                        } catch (e) {
                            console.error('❌ exportRoot creation failed:', e);
                            // still set preloadedGameScene so caller can inspect, but do not reject to avoid hard failure
                            this.preloadedGameScene = { comp: comp, lib: lib, exportRoot: null };
                            return resolve();
                        }

                        // 🔥 预创建GameScene对象（但不添加到舞台）
                        this.preloadedGameScene = {
                            comp: comp,
                            lib: lib,
                            exportRoot: exportRoot
                        };

                        // console.log('✅ GameScene资源预加载完成');
                        resolve();
                    } catch (ex) {
                        console.error('❌ Error during GameScene sprite setup:', ex);
                        this.preloadedGameScene = { comp: comp, lib: lib, exportRoot: null };
                        resolve();
                    }
                });

                loader.addEventListener("error", (evt) => {
                    console.error('❌ GameScene资源加载失败:', evt);
                    reject(new Error(`GameScene资源加载失败: ${evt.item && evt.item.src}`));
                });

                // 设置超时
                setTimeout(() => {
                    if (loadedCount < totalCount) {
                        console.warn('⚠️ GameScene加载超时，强制继续');
                        loader.removeAllEventListeners();
                        resolve();
                    }
                }, 10000); // 10秒超时

                    // 关键：将 images/ 重定向到 resan/images/
                    const remappedManifest = lib.properties.manifest.map(item => ({
                        ...item,
                        src: item.src && item.src.startsWith('images/') ? `resan/${item.src}` : item.src,
                    }));

                    // 保存 manifest 供 ensureAllAssetsReady 检查
                    this.sceneManifest = remappedManifest;

                    // 当 CreateJS loader 加载图片时，也把图片放入 this.loadedImages 和 window.gameImages
                    // 这样全局的就绪检查可以检测到由 CreateJS 直接加载的图片
                    loader.addEventListener("fileload", (evt) => {
                        try {
                            if (evt && evt.item && evt.item.type === 'image') {
                                const id = evt.item.id;
                                // 保持向后兼容的全局缓存
                                if (!this.loadedImages) this.loadedImages = new Map();
                                this.loadedImages.set(id, evt.result);
                                if (!window.gameImages) window.gameImages = {};
                                window.gameImages[id] = evt.result;
                            }
                        } catch (e) {
                            console.warn('预加载场景时缓存图片失败', e);
                        }
                    });

                    // console.log('📦 preloadGameScene: loading manifest items=', remappedManifest.length);
                    loader.loadManifest(remappedManifest);
            } else {
                // 没有manifest时直接创建
                // console.log('📦 GameScene无manifest，直接创建');
                const lib = comp.getLibrary();
                this.preloadedGameScene = {
                    comp: comp,
                    lib: lib,
                    exportRoot: new lib.flygame()
                };
                resolve();
            }
        });
    }

    /**
     * 执行场景切换动画
     */
    async performSceneTransition() {
        return new Promise((resolve) => {
            if (!this.gl_mc) {
                resolve();
                return;
            }

            // console.log('🎭 执行loading淡出动画');

            // loading场景淡出动画
            createjs.Tween.get(this.gl_mc)
                .to({ alpha: 0 }, 500, createjs.Ease.quadOut)
                .call(() => {
                    // console.log('✅ Loading淡出完成');
                    resolve();
                });
        });
    }

    /**
     * 清理loading场景
     */
    cleanupLoadingScene() {
        // console.log('🧹 清理loading场景');

        // 删除 loading 场景
        if (this.gl_mc) {
            this.stage.removeChild(this.gl_mc);
            this.gl_mc = null;
            this.gl_loadBar = null;
        }

        // 清空舞台
        this.stage.removeAllChildren();
    }

    /**
     * 激活GameScene
     */
    async activateGameScene() {
        // console.log('🚀 激活GameScene');

        if (!this.preloadedGameScene) {
            console.error('❌ 预加载的GameScene不存在');
            return;
        }



        // this.stopAllMovieClips(this.exportRoot);

        // 🔥 添加预加载的GameScene到舞台
        if (!this.preloadedGameScene.exportRoot) {
            console.error('❌ activateGameScene: exportRoot is null — preload likely failed or timed out. Aborting activation.');
            return;
        }

        this.exportRoot = this.preloadedGameScene.exportRoot;

        for (var k in this.exportRoot.children) {
            utile/* default */.A.goStop(this.exportRoot.children[k], true);
        }
        this.exportRoot.visible = false;
        this.stage.addChild(this.exportRoot);



        // 获取用户状态
        const userStatus = window.GameServer.currentUserStatus;
        // utile.__sdklog2('📊 用户状态:', userStatus);

        const gameData = {
            engine: this,
            stage: this.stage,
            exportRoot: this.exportRoot,
            canvas: this.canvas,
            config: this.config,
            loadedSounds: this.loadedSounds,
            loadedImages: this.loadedImages,
            userStatus: userStatus
        };

        if (window.GameScense) {
            window.GameScense.init(gameData);
        }

        // 🎯 启动游戏时长统计和发送游戏开始事件
        try {
            // 发送标准 GA4 游戏开始事件 
            if (typeof window.ovo !== 'undefined' && typeof window.ovo.dotGameStart === 'function') {
                window.ovo.dotGameStart('main_game', 'player');
                console.log('🎮 level_start 事件已发送');
            }

            // 🎯 游戏开始30秒后显示banner广告
            setTimeout(() => {
                if (typeof window.ovo !== 'undefined' && typeof window.ovo.showBannerAd === 'function') {
                    window.ovo.showBannerAd(() => {
                        console.log('📢 Banner ad shown 30s after game start');
                    });
                }
            }, 30000); // 30秒 = 30000毫秒

        } catch (e) {
            console.warn('⚠️ 发送游戏开始事件失败', e);
        }

        this.preloadedGameScene = null;
        // 清理预加载数据
    }


    /**
     * 更新loading进度（支持更精细的进度控制）
     */
    updateLoadingProgress(progress) {
        // 更新 HTML 加载条
        if (this.loadingProgress) {
            // 确保进度在0-1之间
            progress = Math.max(0, Math.min(1, progress));

            const percentage = Math.round(progress * 100);
            this.loadingProgress.style.width = `${percentage}%`;

            // console.log(`📊 HTML Loading progress: ${percentage}%`);

            // 如果达到100%，显示完成信息（只显示一次）
            if (progress >= 1.0 && !this.loadingCompleteLogged) {
                console.log('🎯 Loading complete!');
                this.loadingCompleteLogged = true;
            }
        }
    }

    testAudioPlayback(callback) {
        if (this.pubSound.length === 0) {
            callback();
            return;
        }

        let loadedNum = 0;
        const testSound = (id) => {
            createjs.Sound.play(id);
            setTimeout(() => {
                createjs.Sound.stop();
                loadedNum++;
                this.goPlayFrameEnd(this.gl_loadBar, 50 + loadedNum);
                this.pubSound.shift();

                if (this.pubSound.length === 0) {
                    createjs.Sound.muted = false;
                    callback();
                } else {
                    testSound(this.pubSound[0]);
                }
            }, 100);
        };

        testSound(this.pubSound[0]);
    }

    stageUpdateHandler() {
        if (this.stage) {
            this.stage.update();
        }
    }

    updateProgress(percent) {
        this.currentProgress = percent;
        this.loadingProgress.style.width = percent + '%';
    }

    goPlayFrameEnd(target, num) {
        if (target) {
            target.gotoAndStop(num - 2);
        }
    }

    /**
     * 隐藏基本加载界面
     */
    hideBasicLoading() {
        // console.log('🎯 基本资源加载完成，隐藏HTML加载界面');
        const preloadContainer = document.getElementById('preload_container');
        if (preloadContainer) {
            preloadContainer.style.opacity = '0';
            setTimeout(() => {
                preloadContainer.style.display = 'none';
            }, 500);
        }
    }

    // 声音管理方法
    playSound(id, options = {}) {
        if (!this.soundInitialized) {
            console.warn(`🎵 SoundJS 未初始化，无法播放声音: ${id}`);
            return null;
        }


        const isMusicEnabled = localStorage.getItem('musicEnabled') === null || localStorage.getItem('musicEnabled') === 'true'; // 默认开启音乐
        const isSoundEnabled = localStorage.getItem('soundEnabled') === null || localStorage.getItem('soundEnabled') === 'true'; // 默认开启音效



        if (id === 'bgm') {
            return this.playBGM({ volume: (typeof options.volume === 'number') ? options.volume : 0.4 });
        }

        if (id !== 'bgm' && !isSoundEnabled) {
            console.warn(`🎵 音效已被禁用: ${id}`);
            return null;
        }

        if (this.loadedSounds.has(id)) {

            try {

                const instance = createjs.Sound.play(id, options);
                if (instance) {

                    if (instance.playState === createjs.Sound.PLAY_SUCCEEDED) {
                        // console.log(`🎵 声音正在播放: ${id}`);
                        this.soundStatus[id] = true;
                    } else if (instance.playState === createjs.Sound.PLAY_FAILED) {
                        // console.error(`🎵 声音播放失败: ${id}`);
                        this.soundStatus[id] = false;
                    }
                    return instance;
                } else {
                    this.soundStatus[id] = false;
                    console.warn(`🎵 声音播放失败: ${id}`);
                    return null;
                }

            } catch (error) {
                console.error(`🎵 声音播放异常: ${id}`, error);
                return null;
            }
        } else {
            console.warn(`🎵 声音未加载或加载失败: ${id}`);
            return null;
        }
    }

    stopSound(id) {
        if (!this.soundInitialized) {
            console.warn(`🎵 SoundJS 未初始化，无法停止声音: ${id}`);
            return;
        }

        try {
            createjs.Sound.stop(id);
            this.soundStatus[id] = false; // 重置播放状态标记
            if (id === 'bgm') {
                this.bgmInstance = null;
            }
            console.log(`🎵 停止声音: ${id}`);
        } catch (error) {
            console.error(`🎵 停止声音异常: ${id}`, error);
        }
    }

    /**
     * 背景音乐是否在播放
     */
    isBGMPlaying() {
        return !!this.soundStatus['bgm'];
    }



    setBGMLoopWindow(startOffsetMs = 0, loopDurationMs = null, crossfadeMs = 80) {
        this._bgmOffsetMs = Math.max(0, startOffsetMs);
        this._bgmDurMs = loopDurationMs != null ? Math.max(100, loopDurationMs) : null;
        this._bgmCrossfadeMs = Math.max(0, crossfadeMs);
    }

    playBGM(opts = { volume: 0.5 }) {
        const musicEnabled = (localStorage.getItem('musicEnabled') === null) ||
            localStorage.getItem('musicEnabled') === 'true';
        if (!musicEnabled) return;

        // 若已在播，直接返回
        if (this.bgmInstance && this.bgmInstance.playState === createjs.Sound.PLAY_SUCCEEDED) return;

        // 使用简单无限循环播放（保持旧行为，避免分段切换逻辑导致中断）
        try {
            const vol = opts.volume != null ? opts.volume : 0.5;
            const inst = createjs.Sound.play('bgm', { loop: -1, volume: vol, offset: this._bgmOffsetMs || 0 });
            if (inst && inst.playState === createjs.Sound.PLAY_SUCCEEDED) {
                this.bgmInstance = inst;
                this.soundStatus && (this.soundStatus['bgm'] = true);
            }
        } catch (e) {
            console.warn('⚠️ playBGM fallback failed', e);
        }
    }

    stopBGM() {
        if (this._bgmTicker) {
            createjs.Ticker.off('tick', this._bgmTicker);
            this._bgmTicker = null;
        }
        try { this.bgmInstance && this.bgmInstance.stop && this.bgmInstance.stop(); } catch (e) { }
        try { this._bgmNext && this._bgmNext.stop && this._bgmNext.stop(); } catch (e) { }
        this.bgmInstance = null;
        this._bgmNext = null;
        this.soundStatus && (this.soundStatus['bgm'] = false);
    }


    _startBgmSegment(volume = 0.5) {
        try {
            const props = {
                loop: 0,              // 非循环，靠监视+兜底
                volume,
                offset: this._bgmOffsetMs || 0
            };
            if (this._bgmDurMs != null) props.duration = this._bgmDurMs;

            const inst = createjs.Sound.play('bgm', props);
            if (inst && inst.playState === createjs.Sound.PLAY_SUCCEEDED) {
                this.bgmInstance = inst;
                this.soundStatus && (this.soundStatus['bgm'] = true);

                // 兜底：如果没能在尾部提前预启下一段，当前段 complete 时立刻起下一段，避免长时间静音
                inst.on('complete', () => {
                    this.soundStatus['bgm'] = false;
                    // 若 _bgmNext 还没准备好，则直接起下一段
                    if (!this._bgmNext) {
                        this._startBgmSegment(volume);
                    }
                });
                inst.on('failed', () => { this.soundStatus['bgm'] = false; });
                inst.on('interrupted', () => { this.soundStatus['bgm'] = false; });
            }
        } catch (e) {
            console.warn('⚠️ BGM 段播放失败', e);
        }
    }

    _beginBgmMonitor() {
        if (this._bgmTicker) return;

        this._bgmTicker = () => {
            const cur = this.bgmInstance;
            if (!cur) return;

            const total = (this._bgmDurMs != null) ? this._bgmDurMs : (cur.duration || 0);
            const pos = cur.position || 0;

            // 临近尾部：提前启动下一段并淡入
            if (total && total - pos <= this._bgmCrossfadeMs) {
                // 如果还没有预启动
                if (!this._bgmNext) {
                    try {
                        this._bgmNext = createjs.Sound.play('bgm', {
                            loop: 0,
                            offset: this._bgmOffsetMs || 0,
                            volume: 0
                        });

                    } catch (e) { }
                }

                // 到了尾声：淡出旧实例并切换引用
                if (total - pos <= 10) {
                    try { cur.stop(); } catch (e) { }
                    this.bgmInstance = this._bgmNext || this.bgmInstance;
                    this._bgmNext = null;
                }
            }
        };
        createjs.Ticker.on('tick', this._bgmTicker);
    }


    /**
     * 设置音乐总开关，并立即生效
     * @param {boolean} enabled 
     */
    setMusicEnabled(enabled) {
        localStorage.setItem('musicEnabled', enabled ? 'true' : 'false');
        if (!enabled) {
            this.stopBGM();
        } else {
            this.playBGM({ loop: -1, volume: 0.4 });
        }
    }

    /**
     * 设置音效总开关，仅记录（播放时读取）
     * @param {boolean} enabled 
     */
    setSoundEnabled(enabled) {
        localStorage.setItem('soundEnabled', enabled ? 'true' : 'false');
        if (!enabled) {
            // 立即停止所有非 BGM 音效（可选，这里简单 stop 全部）
            try { createjs.Sound.stop(); } catch (e) { }
        }
    }

    setSoundVolume(volume) {
        if (!this.soundInitialized) {
            console.warn(`🎵 SoundJS 未初始化，无法设置音量`);
            return;
        }

        try {
            const clampedVolume = Math.max(0, Math.min(1, volume));
            createjs.Sound.volume = clampedVolume;
            // console.log(`🎵 设置音量: ${clampedVolume}`);
        } catch (error) {
            console.error(`🎵 设置音量异常:`, error);
        }
    }

    /**
     * 检查指定音效是否正在播放
     * @param {string} soundName - 音效名称
     * @returns {boolean} 是否正在播放
     */
    isSoundPlaying(soundName) {
        return !!this.soundStatus[soundName];

    }

    setupAutoplayHandler() {
        // 已经有 BGM 在播放则不需要再绑定
        // if (this.isSoundPlaying && this.isSoundPlaying('bgm')) {
        //     return;
        // }
        // if (this.__autoPlayBound__) {
        //     return; // 避免重复绑定
        // }
        // this.__autoPlayBound__ = true;
        // const enableAudio = () => {
        //     if (!this.audioEnabled) {
        //         console.log('🎵 用户交互检测到，启用音频');
        //         this.audioEnabled = true;
        //         // 仅此处解锁并播放 BGM
        //         createjs.Sound.muted = false;
        //         // 避免短时间重复点击多次触发
        //         if (!this.isSoundPlaying('bgm')) {
        //             this.playSound('bgm', { loop: -1, volume: 1, userTriggered: true });
        //         }
        //     }
        //     document.removeEventListener('click', enableAudio);
        //     document.removeEventListener('touchstart', enableAudio);
        //     document.removeEventListener('keydown', enableAudio);
        // };
        // document.addEventListener('click', enableAudio);
        // document.addEventListener('touchstart', enableAudio);
        // document.addEventListener('keydown', enableAudio);

        if (this.isSoundPlaying && this.isSoundPlaying('bgm')) return;
        if (this.__autoPlayBound__) return;
        this.__autoPlayBound__ = true;

        const enableAudio = () => {
            if (!this.audioEnabled) {
                this.audioEnabled = true;
                createjs.Sound.muted = false;
                if (!this.isSoundPlaying('bgm')) {
                    // 改为调用分段交叠播放
                    this.playBGM({ volume: 0.4 });
                }
            }
            document.removeEventListener('click', enableAudio);
            document.removeEventListener('touchstart', enableAudio);
            document.removeEventListener('keydown', enableAudio);
        };
        document.addEventListener('click', enableAudio);
        document.addEventListener('touchstart', enableAudio);
        document.addEventListener('keydown', enableAudio);
    }

    /**
     * 尝试自动播放背景音乐（无需用户点击）。
     * 若被浏览器策略阻止，则保留后续点击触发逻辑。
     */
    tryAutoStartBGM() {
        // 已播放或用户关闭音乐则跳过
        const isMusicEnabled = localStorage.getItem('musicEnabled') === null || localStorage.getItem('musicEnabled') === 'true';
        if (!isMusicEnabled) return;
        if (this.isSoundPlaying && this.isSoundPlaying('bgm')) return;

        // 有些浏览器需要先创建 AudioContext
        try {
            if (createjs.Sound && createjs.Sound.activePlugin && createjs.Sound.activePlugin.context) {
                const ctx = createjs.Sound.activePlugin.context;
                // 不能直接 resume（可能被策略限制），但可以检测状态
            }
        } catch (e) { }

        const instance = this.playSound('bgm', { loop: -1, volume: 0.4, autoAttempt: true });
        // 如果成功，并且 WebAudio context 处于 running 状态，则视为无需用户交互
        let contextRunning = true;
        try {
            const ctx = createjs.Sound.activePlugin && createjs.Sound.activePlugin.context;
            if (ctx && ctx.state !== 'running') contextRunning = false;
        } catch (e) { }

        if (instance && instance.playState === createjs.Sound.PLAY_SUCCEEDED && contextRunning) {
            // console.log('✅ 自动播放 BGM 成功（无需用户点击）');
            this.audioEnabled = true;
            // 如果已经绑定了交互监听可以移除（谨慎：只有我们自己绑定的）
            if (this.__autoPlayBound__) {
                document.removeEventListener('click', this.__autoPlayClickHandler__);
                document.removeEventListener('touchstart', this.__autoPlayClickHandler__);
                document.removeEventListener('keydown', this.__autoPlayClickHandler__);
            }
        } else {
            console.log('⚠️ 自动播放 BGM 失败或被阻止，等待用户点击');
        }
    }

    // 图片管理方法
    getImage(id) {
        if (this.loadedImages.has(id)) {
            return this.loadedImages.get(id);
        } else {
            console.warn(`🖼️ 图片未找到: ${id}`);
            return null;
        }
    }

    async loadCoreGameFiles() {

        const gameConfig = this.config.gameconfig;
        // console.log('🔍 gameConfig:', gameConfig);

        // 将 gameconfig 转换为 preloadjs 期望的数组格式
        const mainJson = [];

        if (gameConfig && gameConfig.scripts) {
            mainJson.push(...gameConfig.scripts);
        }
        if (gameConfig && gameConfig.sounds) {
            mainJson.push(...gameConfig.sounds);
        }
        if (gameConfig && gameConfig.images) {
            mainJson.push(...gameConfig.images);
        }

        // console.log('📦 准备加载的资源清单:', mainJson);

        if (mainJson.length === 0) {
            console.log('⚠️ 没有资源需要加载，直接完成');
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            const loader = new createjs.LoadQueue(false);

            loader.on("fileload", (evt) => {
                const item = evt.item;
                const id = item.id;
                const result = evt.result;

                switch (item.type) {
                    case createjs.Types.JAVASCRIPT:
                        if (id === this.compName) {
                            this.pubComp = AdobeAn.getComposition(this.commCode);
                            this.pubLib = this.pubComp.getLibrary();
                        }
                        if (id === this.mainName) {
                            this.mainComp = AdobeAn.getComposition(this.mainCode);
                            this.mainLib = this.mainComp.getLibrary();
                        }
                        break;

                    case createjs.Types.JSON:
                        if (id === "resdata_" + this.mainName) {
                            this.soundArr = [];
                            this.imgArr = [];
                            for (const k in result) {
                                if (result[k].soundData) {
                                    const route = result[k].route || "";
                                    this.soundArr.push({
                                        "id": result[k].soundid,
                                        "src": "sounds/" + route + result[k].soundData + ".mp3"
                                    });
                                }
                                if (result[k].imgData) {
                                    const image = result[k].image || "";
                                    this.imgArr.push({
                                        "id": result[k].imgid,
                                        "src": "images/" + image + result[k].imgData
                                    });
                                }
                            }
                        }
                        break;
                }
            });

            loader.on("complete", () => {
                this.goPlayFrameEnd(this.gl_loadBar, 10);
                resolve();
            });

            loader.loadManifest(mainJson);
        });
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            // 检查脚本是否已经加载过
            if (this.loadedScripts && this.loadedScripts.has(src)) {
                // console.log(`脚本已缓存: ${src}`);
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.async = false;
            script.src = src;
            script.onload = () => {
                // 标记为已加载
                if (!this.loadedScripts) this.loadedScripts = new Set();
                this.loadedScripts.add(src);

                script.remove();
                resolve();
            };
            script.onerror = (error) => {
                console.error(`脚本加载失败: ${src}`, error);
                reject(error);
            };
            document.body.appendChild(script);
        });
    }

    async loadImageResources() {
        if (this.imgArr.length === 0) return;

        return new Promise((resolve) => {
            const loader = new createjs.LoadQueue(false);

            loader.on("fileload", (evt) => {
                const item = evt.item;
                const id = item.id;

                // 处理公共组件图片
                if (this.pubComp && id === this.imgArr[0].id) {
                    const images = this.pubComp.getImages();
                    if (evt && evt.item.type === "image") {
                        images[evt.item.id] = evt.result;
                    }

                    const ss = this.pubComp.getSpriteSheet();
                    const lib = this.pubComp.getLibrary();
                    const ssMetadata = lib.ssMetadata;

                    for (let i = 0; i < ssMetadata.length; i++) {
                        ss[ssMetadata[i].name] = new createjs.SpriteSheet({
                            "images": [loader.getResult(ssMetadata[i].name)],
                            "frames": ssMetadata[i].frames
                        });
                    }
                }

                // 处理主游戏组件图片
                if (this.mainComp) {
                    const main_lib = this.mainComp.getLibrary();
                    const main_ss = this.mainComp.getSpriteSheet();
                    const main_ssMetadata = main_lib.ssMetadata;

                    for (const k in main_lib.properties.manifest) {
                        const images = this.mainComp.getImages();

                        if (id === main_lib.properties.manifest[k].id) {
                            if (evt && evt.item.type === "image") {
                                images[evt.item.id] = evt.result;
                            }

                            for (let i = 0; i < main_ssMetadata.length; i++) {
                                if (id === main_ssMetadata[i].name) {
                                    main_ss[main_ssMetadata[i].name] = new createjs.SpriteSheet({
                                        "images": [loader.getResult(main_ssMetadata[i].name)],
                                        "frames": main_ssMetadata[i].frames
                                    });
                                }
                            }
                        }
                    }
                }
            });

            loader.on("complete", () => {
                this.goPlayFrameEnd(this.gl_loadBar, 100);
                setTimeout(() => {
                    this.stage.removeAllChildren();
                    resolve();
                }, 500);
            });

            loader.loadManifest(this.imgArr);
        });
    }

    async loadResource(resourceConfig, currentIndex, totalResources) {
        const { id, src, type } = resourceConfig;

        // console.log(`📦 正在加载 ${type}: ${src}`);
        if (type === 'sound' && this.loadedSounds.has(id)) {
            // console.log(`🎵 声音已加载，跳过: ${id}`);
            return;
        }

        try {
            switch (type) {
                case 'script':
                    // 脚本加载失败会抛出异常，阻止游戏运行
                    await this.loadScript(src);
                    // console.log(`✅ 脚本加载完成: ${src}`);
                    break;

                case 'sound':
                    // For background music (bgm) we don't want to block the entire
                    // preload process on its load. Start bgm loading in background
                    // (fire-and-forget) so the progress bar and other resources
                    // continue. Other sounds remain blocking to ensure critical
                    // SFX are ready.
                    try {
                        if (id === 'bgm') {
                            // start loading but don't await
                            this.loadSound(id, src).catch(err => {
                                console.warn(`⚠️ bgm background load failed: ${src}`, err && err.message ? err.message : err);
                            });
                        } else {
                            await this.loadSound(id, src);
                        }
                        // console.log(`✅ 声音加载完成 (or started): ${src}`);
                    } catch (soundError) {
                        console.warn(`⚠️ 声音加载失败，但不影响游戏运行: ${src}`, soundError && soundError.message ? soundError.message : soundError);
                    }
                    break;

                case 'image':
                    // 图片加载失败不阻止游戏运行
                    try {
                        await this.loadImage(id, src);
                        // console.log(`✅ 图片加载完成: ${src}`);
                    } catch (imageError) {
                        console.warn(`⚠️ 图片加载失败，但不影响游戏运行: ${src}`, imageError.message);
                    }
                    break;

                default:
                    console.warn(`未知的资源类型: ${type}`);
                    break;
            }

        } catch (error) {
            // 只有脚本加载失败才会到这里，这种情况下需要记录严重错误
            console.error(`❌ 关键资源加载失败: ${src}`, error);
            throw error; // 重新抛出脚本加载错误
        }

        // 更新进度条
        const progress = (currentIndex + 1) / totalResources;
        this.updateLoadingProgress(progress);

        // console.log(`📊 加载进度: ${currentIndex + 1}/${totalResources} (${Math.round(progress * 100)}%)`);

        // 每个资源加载完成后稍微延迟，让进度条动画更平滑
        await new Promise(resolve => setTimeout(resolve, 150));
    }

    async loadSound(id, src) {
        return new Promise((resolve, reject) => {
            if (!this.soundInitialized) {
                try {
                    createjs.Sound.registerPlugins([createjs.WebAudioPlugin]);//
                    createjs.Sound.alternateExtensions = ["mp3", "ogg"];
                    createjs.Sound.muted = true; // 初始状态静音
                    this.soundInitialized = true;
                } catch (error) {
                    console.error('🎵 SoundJS 初始化失败:', error);
                    reject(new Error(`SoundJS initialization failed: ${error.message}`));
                    return;
                }
            }

            const timeout = setTimeout(() => {
                console.warn(`🎵 声音加载超时: ${id} (${src})`);
                reject(new Error(`Sound load timeout: ${src}`));
            }, 10000);

            const onFileLoad = (event) => {
                if (event.id === id) {
                    clearTimeout(timeout);
                    createjs.Sound.removeEventListener("fileload", onFileLoad);
                    createjs.Sound.removeEventListener("fileerror", onFileError);
                    this.loadedSounds.set(id, src);
                    // createjs.Sound.play(id, { volume: 0 });
                    resolve();
                }
            };

            const onFileError = (event) => {
                if (event.id === id) {
                    clearTimeout(timeout);
                    createjs.Sound.removeEventListener("fileload", onFileLoad);
                    createjs.Sound.removeEventListener("fileerror", onFileError);
                    console.error(`🎵 声音文件加载失败: ${id}`, event);
                    reject(new Error(`Sound load failed: ${src} - ${event.message || 'Unknown error'}`));
                }
            };

            createjs.Sound.addEventListener("fileload", onFileLoad);
            createjs.Sound.addEventListener("fileerror", onFileError);

            try {
                createjs.Sound.registerSound(src, id);
            } catch (error) {
                clearTimeout(timeout);
                createjs.Sound.removeEventListener("fileload", onFileLoad);
                createjs.Sound.removeEventListener("fileerror", onFileError);
                reject(new Error(`Failed to register sound: ${src} - ${error.message}`));
            }
        });
    }


    async loadImage(id, src) {
        return new Promise((resolve, reject) => {
            const img = new Image();

            // 设置超时机制（15秒）
            const timeout = setTimeout(() => {
                console.warn(`🖼️ 图片加载超时: ${id} (${src})`);
                reject(new Error(`Image load timeout: ${src}`));
            }, 15000);

            img.onload = () => {
                clearTimeout(timeout);

                // 将图片存储到实例变量中
                this.loadedImages.set(id, img);

                // 同时存储到全局对象中供游戏使用（向后兼容）
                if (!window.gameImages) window.gameImages = {};
                window.gameImages[id] = img;

                // console.log(`🖼️ 图片加载成功: ${id} (${img.width}x${img.height})`);
                resolve(img);
            };

            img.onerror = (error) => {
                clearTimeout(timeout);
                console.error(`🖼️ 图片加载失败: ${id}`, error);
                reject(new Error(`Image load failed: ${src} - ${error.message || 'Unknown error'}`));
            };

            // 设置跨域属性（如果需要）
            img.crossOrigin = 'anonymous';
            img.src = src;
        });
    }
}

// 页面加载完成后启动引擎
document.addEventListener('DOMContentLoaded', () => {
    if (window.__GAME_ENGINE_INSTANCE__) {
        console.warn('⚠️ 引擎实例已存在，跳过创建');
        return;
    }
    const engine = new GameEngine();
    engine.init().catch(error => {
        console.error('Game engine failed to start:', error);
    });
});

/***/ }),

/***/ 804:
/***/ (() => {

/**
 * 抽卡游戏类
 */
class CardGame {
    constructor() {
        this.stage = null;
        this.exportRoot = null;
        this.engine = null;
        this.scene = null; // gamescense实例引用
        this.loadedSounds = null;

        // 游戏状态
        this.isDrawing = false;
        this.playerScore = 0;
        this.drawCost = 100;

        // UI元件引用
        this.goButton = null;
        this.cardContainer = null;
        this.scoreDisplay = null;
        this.block = null;

        // console.log('🎴 CardGame 初始化完成');

        // 卡牌配置
        this.cardConfig = {
            0: { name: '锤子', eggid: 7, rarity: 'hammer', probability: 0 },//+100
            1: { name: '黄金龙', eggid: 6, rarity: 'legendary', probability: 70 },//+30
            2: { name: '红龙', eggid: 5, rarity: 'legendary', probability: 80 },//+20
            3: { name: '紫龙', eggid: 4, rarity: 'legendary', probability: 50 },//+50
            4: { name: '黑龙', eggid: 0, rarity: 'evildragon', probability: 100 },//+0
            5: { name: '灰龙', eggid: 1, rarity: 'common', probability: 90 },//+10
            6: { name: '绿龙', eggid: 2, rarity: 'rare', probability: 40 },//+60
            7: { name: '蓝龙', eggid: 3, rarity: 'epic', probability: 20 },//80
        };

        // UI元件
        this.cardContainer = null;
        this.cardSlots = [];
        this.goButton = null;
        this.scoreDisplay = null;

        console.log('🎴 CardGame 初始化完成');
    }
    /**
     * 初始化抽卡游戏
     */
    async init(gameData) {
        console.log('🎴 抽卡游戏初始化开始...');

        this.stage = gameData.stage;
        this.exportRoot = gameData.exportRoot;
        this.engine = gameData.engine;
        this.scene = gameData.scene; // 保存gamescense实例引用
        this.loadedSounds = gameData.loadedSounds;

        // 获取玩家积分
        this.playerScore = this.getPlayerScore();

        // 查找 mc_victory 元件
        const failureMc = utile.findMc(this.exportRoot, 'mc_failure');
        this.card_reward_Mc = utile.findMc(failureMc, 'mc_card_reward');
        if (!this.card_reward_Mc) {
            console.error('❌ 未找到 mc_card_reward 元件');
            return;
        }

        this.block = utile.findMc(this.card_reward_Mc, 'mc_card_container');
        if (this.block) {
            this.block.mouseEnabled = true;

            // 绑定屏蔽层点击事件
            if (!this.block.hasEventListener("click")) {
                this.block.on('click', function (event) {
                    console.log('🛡️ 胜利界面屏蔽层拦截了点击事件');
                    event.stopImmediatePropagation();
                    event.stopPropagation();
                    event.preventDefault();
                    return false;
                });
            }
        }

        // 卡牌容器
        this.cardContainer = utile.findMc(this.card_reward_Mc, 'mc_card_container');
        if (!this.cardContainer) {
            console.warn('⚠️ 未找到 mc_card_container，动画逻辑将退化');
        }

        // GO 按钮
        this.goButton = utile.findMc(this.card_reward_Mc, 'btn_go');
        if (!this.goButton) {
            console.error('❌ 未找到 btn_go');
            return;
        }

        this.goButton.play();
        // 初始化积分显示
        // this.initScoreDisplay();

        // 绑定事件
        this.bindEvents();

        console.log('✅ 抽卡游戏初始化完成');
        console.log(`📽️ mc_card_container 总帧数: ${this.cardContainer.totalFrames}`);
    }

    // 新增：等待音效播放结束
    playSoundWait(id) {
        if (!this.engine || !this.loadedSounds || !this.loadedSounds.has(id)) {
            return Promise.resolve();
        }
        return new Promise(resolve => {
            try {
                const inst = this.engine.playSound(id);
                if (!inst || !inst.on) return resolve();
                const done = () => resolve();
                inst.on('complete', done);
                inst.on('failed', done);
                inst.on('interrupted', done);
            } catch (e) {
                resolve();
            }
        });
    }

    /**
     * 初始化积分显示
     */
    initScoreDisplay() {
        // 查找现有的积分显示元件
        const scoreContainer = utile.findMc(this.cardContainer, 'mc_score');
        if (scoreContainer) {
            this.scoreDisplay = utile.findMc(scoreContainer, 'text_score');
            if (this.scoreDisplay) {
                this.updateScoreDisplay();
                console.log('💰 积分显示初始化完成');
            } else {
                console.error('❌ 未找到 text_score 元件');
            }
        } else {
            console.error('❌ 未找到 mc_score 元件');
        }
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        console.log('🔗 绑定抽卡事件...');

        // 延迟绑定，确保在屏蔽层事件之后
        setTimeout(() => {
            // 移除可能存在的旧事件
            this.goButton.removeAllEventListeners('click');

            // 绑定新的点击事件
            this.goButton.on('click', (event) => {
                console.log('🎯 GO按钮被点击');
                event.stopImmediatePropagation(); // 阻止事件继续传播到屏蔽层

                ovo.showRewardedAd(() => {
                     this.startCardDraw();
                })
                
            });

            // 设置按钮可点击
            this.goButton.cursor = 'pointer';
            this.goButton.mouseEnabled = true;

            console.log('✅ GO按钮事件绑定完成');
        }, 100);
    }

    /**
     * 开始抽卡
     */
    async startCardDraw() {
        this.goButton.stop();
        if (!this.cardContainer || this.isDrawing) return;
        this.isDrawing = true;
        if (this.goButton) this.goButton.mouseEnabled = false;

        try {
            const result = this.getCardByProbability();
            // 将抽卡结果写回服务端概率池（记录 boost），默认增量为1
            try {
                if (window.GameServer && typeof window.GameServer.applyCardBoost === 'function') {
                    // 使用 n = (100 - probability) / 100 作为小数增量
                    const prob = Number(result.probability) || 0;
                    const n = Math.max(0, Math.min(1, (100 - prob) / 1000));
                    if(n!==0){
                        window.GameServer.applyCardBoost(result.eggid, n);
                    }
                }
            } catch (e) { }
            // 随机圈数（可调 5~8 / 6~9）
            const rotations = 9 + Math.floor(Math.random() * 4); // 6~9
            await this.spinToResultSimple(result, {
                rotations,
                framesPerTick: 1,   // 每 tick 前进帧数(提高=更快)
                loopSound: true
            });
            this.playSound('cardReveal');
            // this.showMessage(`恭喜获得: ${result.name}`);
            this.showRewardedAd(result);
        } catch (e) {
            console.error('❌ 抽卡失败:', e);
        } finally {
            this.isDrawing = false;
            if (this.goButton) this.goButton.mouseEnabled = true;
        }
    }

    /**
   * 简单恒速旋转：按固定帧步长推进；开始播放音效，结束立即停止
   * @param {Object} cardResult
   * @param {Object} opts { rotations, framesPerTick, loopSound }
   */
    spinToResultSimple(cardResult, opts = {}) {
        return new Promise(resolve => {
            const mc = this.cardContainer;
            if (!mc || !mc.totalFrames) return resolve();

            const totalFrames = mc.totalFrames;
            const startFrame = mc.currentFrame || 0;
            const targetFrame = this.getFrameByCardId(cardResult.id);

            const rotations = Math.max(1, opts.rotations || 6);
            const framesPerTick = Math.max(1, opts.framesPerTick || 6);

            // 计算需要前进的总帧数（保证正向）
            const forwardDelta = ((targetFrame - startFrame) + totalFrames) % totalFrames;
            const totalAdvance = rotations * totalFrames + forwardDelta;

            let advanced = 0;
            let spinSoundInstance = null;

            // 播放旋转音效（持续到结束）
            if (opts.loopSound && this.engine && this.loadedSounds && this.loadedSounds.has('card')) {
                try {
                    spinSoundInstance = this.engine.playSound('card', { loop: -1, volume: 1 });
                } catch (e) { }
            }

            mc.gotoAndStop(startFrame);

            let finished = false;
            const finish = () => {
                this.goButton.play();
                if (finished) return;
                finished = true;
                try {
                    mc.gotoAndStop(targetFrame);
                    if (spinSoundInstance) spinSoundInstance.stop && spinSoundInstance.stop();

                } catch (e) { }
                createjs.Ticker.off('tick', tickHandler);
                resolve();
            };

            const tickHandler = () => {
                if (finished) return;
                const remain = totalAdvance - advanced;
                if (remain <= 0) {
                    finish();
                    return;
                }
                const step = remain < framesPerTick ? remain : framesPerTick;
                advanced += step;
                const frame = (startFrame + advanced) % totalFrames;
                mc.gotoAndStop(frame);
                if (advanced >= totalAdvance) finish();
            };

            createjs.Ticker.on('tick', tickHandler);
            // 兜底（极少数情况下防止意外不结束）
            setTimeout(() => finish(), 30000);
        });
    }

    /**
  * 播放卡牌动画
  */
    /**
       * 播放卡牌动画缓慢停止 + 等待音效(card.mp3)结束后才显示结果
       * @param {string} soundId
       */
    async playCardAnimation(soundId = 'card') {
        // console.log('🎬 播放卡牌动画并等待音效结束...');
        return new Promise(async (resolve) => {
            if (!this.cardContainer) {
                console.error('❌ cardContainer 为空');
                return resolve();
            }

            this.cardContainer.gotoAndStop(0);

            const totalFrames = this.cardContainer.totalFrames;
            let currentFrame = 0;
            let phase = 'slow';
            let spinning = true;
            let soundFinished = false;

            // 启动音效并等待
            this.playSoundWait(soundId).then(() => {
                soundFinished = true;
            }).catch(() => { soundFinished = true; });

            const slowSpeed = 100; // 前 30% 慢速
            const fastSpeed = 30;  // 中段快速
            const extraSpinFastSpeed = 40; // 等待音效时的额外旋转速度

            // const tickSpin = () => {
            //     if (!spinning) return;

            //     // 选择当前速度
            //     if (phase === 'slow') {
            //         this.cardContainer.gotoAndStop(currentFrame % totalFrames);
            //         currentFrame++;
            //         if (currentFrame >= totalFrames * 0.3) {
            //             phase = 'fast';
            //         }
            //         setTimeout(tickSpin, slowSpeed);
            //     } else if (phase === 'fast') {
            //         this.cardContainer.gotoAndStop(currentFrame % totalFrames);
            //         currentFrame++;
            //         if (currentFrame >= totalFrames * 2) {
            //             phase = 'waitSound';
            //         }
            //         setTimeout(tickSpin, fastSpeed);
            //     } else if (phase === 'waitSound') {
            //         // 音效未结束：继续匀速转
            //         if (!soundFinished) {
            //             this.cardContainer.gotoAndStop(currentFrame % totalFrames);
            //             currentFrame++;
            //             setTimeout(tickSpin, extraSpinFastSpeed);
            //         } else {
            //             // 进入最终收敛
            //             phase = 'final';
            //             finalPhase();
            //         }
            //     }
            // };

            const finalPhase = () => {
                // 根据概率确定最终卡牌
                const cardResult = this.getCardByProbability();
                const targetFrame = this.getFrameByCardId(cardResult.id);

                const currentPos = currentFrame % totalFrames;
                const frameDistance = Math.abs(targetFrame - currentPos);
                const steps = Math.min(frameDistance, 10);
                let step = 0;

                const easeStep = () => {
                    if (step < steps) {
                        const progress = step / steps;
                        const framePos = Math.round(currentPos + (targetFrame - currentPos) * progress);
                        this.cardContainer.gotoAndStop(framePos % totalFrames);
                        step++;
                        setTimeout(easeStep, 100);
                    } else {
                        this.cardContainer.gotoAndStop(targetFrame);
                        // console.log(`🎲 最终停在帧 ${targetFrame} -> ${cardResult.name}`);
                        // 结果音效
                        this.playSound('cardReveal');
                        // this.showMessage(`恭喜获得: ${cardResult.name}`);
                        this.showRewardedAd(cardResult);
                        spinning = false;
                        resolve();
                    }
                };
                easeStep();
            };

            // tickSpin();
        });
    }

    // /**
    //  * 根据帧数获取对应的卡牌
    //  * @param {number} frame - 动画停止的帧数
    //  * @returns {Object} 卡牌配置对象
    //  */
    // getCardByFrame(frame) {
    //     // 使用概率抽取卡牌，而不是简单的帧数映射
    //     const randomNum = Math.random() * 100;
    //     let currentProbability = 0;

    //     for (const [cardId, config] of Object.entries(this.cardConfig)) {
    //         currentProbability += config.probability;
    //         if (randomNum <= currentProbability) {
    //             return config;
    //         }
    //     }

    //     // 默认返回灰龙
    //     return this.cardConfig[0];
    // }

    /**
     * 更新积分显示
     */
    updateScoreDisplay() {
        if (this.scoreDisplay && this.scoreDisplay.text !== undefined) {
            this.scoreDisplay.text = `${this.playerScore}`;
        }
    }


    /**
 * 根据概率获取卡牌
 * @returns {Object} 卡牌配置对象（包含id）
 */
    getCardByProbability() {
        // 将 cardConfig[].probability 视为权重（weight），更灵活且易于和转盘增量相加
        const entries = Object.entries(this.cardConfig);
        const types = entries.map(([id, cfg]) => ({ id, config: cfg }));

        // 构造权重数组，负值或非数视为 0
        const weights = types.map(t => {
            const w = Number(t.config.probability);
            return (isFinite(w) && w > 0) ? w : 0;
        });

        const total = weights.reduce((s, x) => s + x, 0);
        // console.log(`🎲 权重总和: ${total}`);

        // 全为 0 的兜底 -> 均匀随机
        if (total <= 0) {
            const idx = Math.floor(Math.random() * types.length);
            // console.log(`⚠️ 所有权重为0，均匀随机选中 ${types[idx].config.name}`);
            return { ...types[idx].config, id: types[idx].id };
        }

        // 快速路径：若所有权重相等（例如全 1 或全 100），直接均匀随机
        const mn = Math.min(...weights);
        const mx = Math.max(...weights);
        if (mn === mx) {
            const idx = Math.floor(Math.random() * types.length);
            // console.log(`ℹ️ 权重相等，均匀随机选中 ${types[idx].config.name}`);
            return { ...types[idx].config, id: types[idx].id };
        }

        // 标准加权随机（累减法）
        let r = Math.random() * total;
        for (let i = 0; i < types.length; i++) {
            r -= weights[i];
            if (r <= 0) {
                // console.log(`✅ 按权重抽中: ${types[i].config.name} (weight=${weights[i]}/${total})`);
                return { ...types[i].config, id: types[i].id };
            }
        }

        // 浮点误差兜底
        const last = types[types.length - 1];
        // console.log(`⚠️ 浮点误差兜底，返回 ${last.config.name}`);
        return { ...last.config, id: last.id };
    }

    /**
     * 根据卡牌ID获取对应的帧数
     * @param {string} cardId - 卡牌ID
     * @returns {number} 对应的帧数
     */
    getFrameByCardId(cardId) {
        const totalFrames = this.cardContainer.totalFrames;
        const cardIndex = parseInt(cardId);
        // 将8个卡牌平均分布到总帧数中
        return Math.floor((cardIndex * totalFrames) / 8);
    }

    /**
     * 调用激励广告
     * @param {Object} cardResult - 抽中的卡牌结果
     */
    showRewardedAd(cardResult) {


        // 这里调用激励广告API
        // 假设广告成功后会调用回调函数
        if (window.showRewardedVideo) {
            window.showRewardedVideo(() => {
                // 广告观看完成后的回调
                this.onAdWatchComplete(cardResult);
            });
        } else {
            console.log('🎬 激励广告API不可用，直接给予奖励');
            this.onAdWatchComplete(cardResult);
        }
    }

    /**
     * 广告观看完成回调
     * @param {Object} cardResult - 抽中的卡牌结果
     */
    onAdWatchComplete(cardResult) {
        console.log(`🎉 广告观看完成，获得奖励: ${cardResult.name} (+${100 - cardResult.probability}分)`);

        // 显示奖励提示文字（1秒后自动消失）
        const rewardText = `获得 ${cardResult.name} (+${100 - cardResult.probability}分)`;
        this.showRewardMessage(rewardText);

        // 1秒后关闭失败面板并重新开始游戏
        setTimeout(() => {
            // 关闭失败面板并重新开始游戏
            if (this.scene && typeof this.scene.failureHandler === 'function') {
                this.scene.failureHandler(false);
            } else {
                console.warn('⚠️ scene.failureHandler 方法不可用');
            }
        }, 1000);
    }

    /**
     * 显示奖励消息（1秒后自动消失）
     */
    showRewardMessage(message) {
        console.log(`💬 奖励消息: ${message}`);

        // 使用scene的tips方法在mc_tips中显示消息
        if (this.scene && typeof this.scene.tips === 'function') {
            this.scene.tips(message, null, "bold 28px Arial", "#FFD700", 1);
        } else {
            console.warn('⚠️ scene.tips 方法不可用，使用备用方式');
            // 备用方式：直接创建文本对象
            const messageText = new createjs.Text(message, 'bold 24px Arial', '#FFD700');
            messageText.textAlign = 'center';
            messageText.x = this.cardContainer.x || 400;
            messageText.y = (this.cardContainer.y || 300) - 100;
            messageText.alpha = 0;

            this.stage.addChild(messageText);

            // 奖励消息动画（1秒后消失）
            createjs.Tween.get(messageText)
                .to({ alpha: 1, y: messageText.y - 20 }, 300)
                .wait(700) // 等待0.7秒，总共1秒
                .to({ alpha: 0, y: messageText.y - 40 }, 300)
                .call(() => {
                    this.stage.removeChild(messageText);
                });
        }
    }

    /**
     * 播放音效
     */
    playSound(soundName) {
        if (this.engine && this.loadedSounds && this.loadedSounds.has(soundName)) {
            this.engine.playSound(soundName);
        }
    }

    /**
     * 获取玩家积分
     */
    getPlayerScore() {
        return 1000; // 默认积分
    }

    /**
     * 显示抽卡界面
     */
    show() {
        if (this.cardContainer) {
            this.cardContainer.visible = true;
        }
    }

    /**
     * 隐藏抽卡界面
     */
    hide() {
        if (this.cardContainer) {
            this.cardContainer.visible = false;
        }
    }
}

// 导出类
window.CardGame = CardGame;

/***/ }),

/***/ 864:
/***/ ((module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* module decorator */ module = __webpack_require__.hmd(module);
// Android Ad SDK for Google Play platform
// Only initializes if platform is set to "googleplay"

// Helper: call Android native ad and wait for native to call back via window.SuccessAd
function androidShowAdWithCallback(callNativeFn, callback, timeoutMs) {
    timeoutMs = timeoutMs || 8000; // default 8s timeout
    let called = false;
    const prev = window.SuccessAd;

    function cleanup() {
        try {
            if (prev === undefined) delete window.SuccessAd;
            else window.SuccessAd = prev;
        } catch (e) { }
    }

    function onDone(success) {
        if (called) return;
        called = true;
        cleanup();
        try { resumeAudioAfterAd(); } catch (e) { }
        try { if (typeof callback === 'function') callback(success === false ? false : true); } catch (e) { }
    }

    // Install temporary global that native will call
    try {
        window.SuccessAd = function () {
            try { console.log('[ovosdk] native SuccessAd called'); } catch (e) { }
            onDone(true);
        };
    } catch (e) { }

    // Safety timeout
    const timer = setTimeout(function () {
        try { console.log('[ovosdk] androidShowAd timeout'); } catch (e) { }
        onDone(false);
    }, timeoutMs);

    // Wrap onDone to also clear timer
    const origOnDone = onDone;
    onDone = function (success) {
        clearTimeout(timer);
        origOnDone(success);
    };

    // Pause audio then call native
    try { pauseAudioForAd(); } catch (e) { }

    try {
        callNativeFn();
    } catch (e) {
        try { console.log('[ovosdk] callNativeFn failed, falling back', e); } catch (e) { }
        // fallback: immediately resume and call callback(false)
        onDone(false);
    }

    return {
        cancel: function () {
            onDone(false);
        }
    };
}

// Define android_ad object with ad methods
const android_ad = {
    // Initialize Android Ad SDK
    init: function() {
        // Only initialize if platform is googleplay
        if (window.Platform !== "googleplay") {
            console.log('[android_ad] Platform is not googleplay, skipping initialization');
            return;
        }

        console.log('[android_ad] Initializing for Google Play platform');

        // Initialize GA4
        this.initGA4();

        // Set up gtag wrapper
        this.setupGtagWrapper();

        // Attach methods to window
        this.attachToWindow();
    },

    // Initialize Google Analytics 4
    initGA4: function() {
        try {
            if (typeof window !== 'undefined' && typeof document !== 'undefined') {
                const gameConfig = {
                    gameid: "GooglePlay",
                    dev_name: "Dragon Egg"
                };

                const script = document.createElement("script");
                script.async = true;
                script.src = "https://www.googletagmanager.com/gtag/js?id=G-PM5MNMLL3R";
                script.setAttribute("crossorigin", "anonymous");

                script.onload = () => {
                    // Set consent configuration
                    window.gtag("consent", "default", {
                        ad_storage: "granted",
                        ad_user_data: "granted",
                        ad_personalization: "granted",
                        analytics_storage: "granted"
                    });

                    // Initialize gtag
                    window.gtag("js", new Date());
                    window.gtag("set", "cookie_flags", "SameSite=None;Secure");
                    window.gtag("config", "G-PM5MNMLL3R", {
                        game_id: gameConfig.gameid,
                        dev_name: gameConfig.dev_name
                    });

                    console.log('✅ gtag.js loaded with consent and game config');
                };

                script.onerror = function (err) {
                    console.warn('⚠️ gtag.js failed to load', err);
                };

                // Initialize dataLayer
                window.dataLayer = window.dataLayer || [];

                document.getElementsByTagName("head")[0].appendChild(script);
            }
        } catch (e) {
            console.error('[android_ad] GA4 initialization failed', e);
        }
    },

    // Set up enhanced gtag wrapper
    setupGtagWrapper: function() {
        let gamePlayTimeIntervalSet = false;

        window.gtag = function () {
            let args = [...arguments];
            let eventAction = args[1];
            let eventParams = args[2];

            // Allow specific gtag commands and events
            const allowedCommands = ["set", "js", "config", "consent"];
            const allowedGameEvents = ["game_start", "level_start", "level_end"];
            const allowedSdkEvents = [
                "ad_impression", "ad_click", "ad_error", "earn_virtual_currency",
                "select_content", "game_play_time", "tutorial_complete",
                "game_reward_open", "game_interstitialad_open",
                "game_reward_dismissed", "game_interstitialad",
                "game_reward", "game_reward_viewed", "game_interstitialad_viewed",
                "click_ad"
            ];

            // Filter events: allow commands, game events, or SDK events with send: "sdk"
            if (allowedCommands.includes(args[0]) ||
                allowedGameEvents.includes(eventAction) ||
                (allowedSdkEvents.includes(eventAction) && eventParams && eventParams.send === "sdk")) {

                // Log filtered events
                if (typeof window.__sdklog3 === 'function') {
                    window.__sdklog3('gtag_filtered', arguments);
                }

                // Push to dataLayer
                try {
                    if (window.dataLayer && typeof window.dataLayer.push === 'function') {
                        window.dataLayer.push(arguments);
                    }
                } catch (e) {
                    console.log("dataLayer error:", e);
                }
            }

            // Set up automatic game_play_time interval on first level_start
            if (eventAction === "level_start" && !gamePlayTimeIntervalSet) {
                gamePlayTimeIntervalSet = true;
                setInterval(function () {
                    if (typeof window.gtag === 'function') {
                        window.gtag("event", "game_play_time", {
                            send: "sdk"
                        });
                    }
                }, 30000); // 30 seconds

                console.log('🕒 Automatic game_play_time interval started (30s)');
            }
        };
    },

    // Attach methods to window
    attachToWindow: function() {
        window.showInterstitialAd = this.showInterstitialAd;
        window.showRewardedAd = this.showRewardedAd;
        window.showBannerAd = this.showBannerAd;
        window.hideBannerAd = this.hideBannerAd;
        window.vibrate = this.vibrate;
    },

    // Interstitial Ad
    showInterstitialAd: function (callback, opts) {
        opts = opts || {};
        const timeoutMs = opts.timeoutMs || 8000;
        try {
            console.log('[android_ad] showInterstitialAd invoked');
            // GA event: ad_impression
            if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                window.gtag('event', 'ad_impression', {
                    ad_platform: 'android',
                    ad_source: 'interstitial',
                    ad_format: 'display',
                    platform: window.Platform || 'unknown',
                    send: 'sdk'
                });
            }
        } catch (e) {}

        if (typeof window.Android !== 'undefined' && typeof window.Android.showInterstitialAd === 'function') {
            return androidShowAdWithCallback(
                () => {
                    try {
                        window.Android.showInterstitialAd();
                    } catch (e) {
                        // GA event: ad_error
                        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                            window.gtag('event', 'ad_error', {
                                ad_platform: 'android',
                                ad_source: 'interstitial',
                                error_reason: 'native_call_failed',
                                platform: window.Platform || 'unknown',
                                send: 'sdk'
                            });
                        }
                        throw e;
                    }
                },
                (success) => {
                    if (success) {
                        // GA event: ad_click (assuming success means user interacted)
                        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                            window.gtag('event', 'ad_click', {
                                ad_platform: 'android',
                                ad_source: 'interstitial',
                                platform: window.Platform || 'unknown',
                                send: 'sdk'
                            });
                        }
                    } else {
                        // GA event: ad_error
                        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                            window.gtag('event', 'ad_error', {
                                ad_platform: 'android',
                                ad_source: 'interstitial',
                                error_reason: 'closed_or_failed',
                                platform: window.Platform || 'unknown',
                                send: 'sdk'
                            });
                        }
                    }
                    if (typeof callback === 'function') callback(success);
                },
                timeoutMs
            );
        } else {
            console.warn('[android_ad] Android.showInterstitialAd not available');
            // GA event: ad_error
            if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                window.gtag('event', 'ad_error', {
                    ad_platform: 'android',
                    ad_source: 'interstitial',
                    error_reason: 'not_available',
                    platform: window.Platform || 'unknown',
                    send: 'sdk'
                });
            }
            if (typeof callback === 'function') callback(false);
        }
    },

    // Rewarded Ad
    showRewardedAd: function (callback, opts) {
        opts = opts || {};
        const timeoutMs = opts.timeoutMs || 10000; // Longer timeout for rewarded
        try {
            console.log('[android_ad] showRewardedAd invoked');
            // GA event: ad_impression
            if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                window.gtag('event', 'ad_impression', {
                    ad_platform: 'android',
                    ad_source: 'rewarded',
                    ad_format: 'video',
                    platform: window.Platform || 'unknown',
                    send: 'sdk'
                });
            }
        } catch (e) {}

        if (typeof window.Android !== 'undefined' && typeof window.Android.showRewardedAd === 'function') {
            return androidShowAdWithCallback(
                () => {
                    try {
                        window.Android.showRewardedAd();
                    } catch (e) {
                        // GA event: ad_error
                        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                            window.gtag('event', 'ad_error', {
                                ad_platform: 'android',
                                ad_source: 'rewarded',
                                error_reason: 'native_call_failed',
                                platform: window.Platform || 'unknown',
                                send: 'sdk'
                            });
                        }
                        throw e;
                    }
                },
                (success) => {
                    if (success) {
                        // GA event: earn_virtual_currency
                        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                            window.gtag('event', 'earn_virtual_currency', {
                                virtual_currency_name: 'reward',
                                value: 1,
                                ad_platform: 'android',
                                platform: window.Platform || 'unknown',
                                send: 'sdk'
                            });
                        }
                    } else {
                        // GA event: ad_error
                        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                            window.gtag('event', 'ad_error', {
                                ad_platform: 'android',
                                ad_source: 'rewarded',
                                error_reason: 'closed_or_failed',
                                platform: window.Platform || 'unknown',
                                send: 'sdk'
                            });
                        }
                    }
                    if (typeof callback === 'function') callback(success);
                },
                timeoutMs
            );
        } else {
            console.warn('[android_ad] Android.showRewardedAd not available');
            // GA event: ad_error
            if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                window.gtag('event', 'ad_error', {
                    ad_platform: 'android',
                    ad_source: 'rewarded',
                    error_reason: 'not_available',
                    platform: window.Platform || 'unknown',
                    send: 'sdk'
                });
            }
            if (typeof callback === 'function') callback(false);
        }
    },

    // Banner Ad
    showBannerAd: function (callback, opts) {
        opts = opts || {};
        try {
            console.log('[android_ad] showBannerAd invoked');
            // GA event: ad_impression
            if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                window.gtag('event', 'ad_impression', {
                    ad_platform: 'android',
                    ad_source: 'banner',
                    ad_format: 'display',
                    platform: window.Platform || 'unknown',
                    send: 'sdk'
                });
            }
        } catch (e) {}

        if (typeof window.Android !== 'undefined' && typeof window.Android.showBannerAd === 'function') {
            try {
                window.Android.showBannerAd();
                if (typeof callback === 'function') callback(true);
            } catch (e) {
                console.error('[android_ad] showBannerAd failed', e);
                // GA event: ad_error
                if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                    window.gtag('event', 'ad_error', {
                        ad_platform: 'android',
                        ad_source: 'banner',
                        error_reason: 'native_call_failed',
                        platform: window.Platform || 'unknown',
                        send: 'sdk'
                    });
                }
                if (typeof callback === 'function') callback(false);
            }
        } else {
            console.warn('[android_ad] Android.showBannerAd not available');
            // GA event: ad_error
            if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                window.gtag('event', 'ad_error', {
                    ad_platform: 'android',
                    ad_source: 'banner',
                    error_reason: 'not_available',
                    platform: window.Platform || 'unknown',
                    send: 'sdk'
                });
            }
            if (typeof callback === 'function') callback(false);
        }
    },

    hideBannerAd: function (callback) {
        try {
            console.log('[android_ad] hideBannerAd invoked');
        } catch (e) {}

        if (typeof window.Android !== 'undefined' && typeof window.Android.hideBannerAd === 'function') {
            try {
                window.Android.hideBannerAd();
                if (typeof callback === 'function') callback(true);
            } catch (e) {
                console.error('[android_ad] hideBannerAd failed', e);
                if (typeof callback === 'function') callback(false);
            }
        } else {
            console.warn('[android_ad] Android.hideBannerAd not available');
            if (typeof callback === 'function') callback(false);
        }
    },

    // Vibration
    vibrate: function (pattern) {
        try {
            console.log('[android_ad] vibrate invoked, pattern:', pattern);
            
            if (typeof window.Android !== 'undefined' && typeof window.Android.vibrate === 'function') {
                try {
                    if (Array.isArray(pattern)) {
                        // 如果是数组，转换为字符串传递给 Android
                        window.Android.vibrate(pattern.join(','));
                    } else {
                        window.Android.vibrate(String(pattern));
                    }
                    return true;
                } catch (e) {
                    console.error('[android_ad] Android.vibrate failed', e);
                    return false;
                }
            } else {
                console.warn('[android_ad] Android.vibrate not available');
                return false;
            }
        } catch (e) {
            console.error('[android_ad] vibrate error:', e);
            return false;
        }
    }
};

// Initialize the SDK
android_ad.init();

// Export for module systems
if ( true && module.exports) {
    module.exports = android_ad;
}
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (android_ad)));

/***/ }),

/***/ 883:
/***/ ((module) => {

// 图形类型枚举
const graphType = {
    open: 0,
    wall: 1,
    clos: -1
};

// A* 4方向寻路算法类
class OvoAstar4 {
    constructor() {
        this.grid = null;
        this.mapWidth = 0;
        this.mapHeight = 0;
        this.moveD = 10;
        this.moveR = 14;
        this.move = [this.moveD, this.moveR];
        this.mapCell = [];
        this.lastOpenCell = null;
        this.markTag = 0;
    }

    // 单例模式
    static getInstance() {
        if (!OvoAstar4._instance) {
            OvoAstar4._instance = new OvoAstar4();
        }
        return OvoAstar4._instance;
    }

    // 静态变量只包含四个方向的移动（上、下、左、右）
    static get posXarr() { return [0, 1, 0, -1]; }
    static get posYarr() { return [-1, 0, 1, 0]; }

    init(rows, clos, _size, gridCell) {
        this.grid = gridCell;
        this.mapWidth = rows;
        this.mapHeight = clos;
        this.moveD = _size;
        this.move = [this.moveD, this.moveD, this.moveD, this.moveD];

        let cellLen = this.mapWidth * this.mapHeight;
        if (cellLen > this.mapCell.length) {
            this.mapCell.length = cellLen;
        }

        let cid = 0;

        for (let i = 0; i < this.mapWidth; ++i) {
            for (let j = 0; j < this.mapHeight; ++j) {
                this.mapCell[cid] = new MapCell();
                this.mapCell[cid].x = i;
                this.mapCell[cid].y = j;
                this.mapCell[cid].unMove = gridCell[i][j].type !== graphType.open;
                cid++;
            }
        }
    }

    search(p1, p2) {
        if (p1.x === p2.x && p1.y === p2.y) return [];

        this.reStartXY(p1.x, p1.y);

        let isPath = false;
        let currX = p1.x;
        let currY = p1.y;

        let currCell = this.mapCell[currX * this.mapHeight + currY];
        currCell.lastX = -1;
        currCell.lastY = -1;
        currCell.x = currX;
        currCell.y = currY;
        currCell.markTag = this.markTag;
        currCell.h = Math.abs(p2.x - p1.x) + Math.abs(p2.y - p1.y);

        while (true) {
            if (currX === p2.x && currY === p2.y) {
                isPath = true;
                break;
            }

            if (currCell.state !== MapCell.close) {
                this.closeCell(currCell);
            }

            for (let i = 0; i < 4; i++) {
                let x = currX + OvoAstar4.posXarr[i];
                let y = currY + OvoAstar4.posYarr[i];

                if (x < 0 || x >= this.mapWidth || y < 0 || y >= this.mapHeight)
                    continue;

                let cell = this.mapCell[x * this.mapHeight + y];
                cell.unMove = this.grid[x][y].type !== graphType.open;
                if (cell.unMove) continue;

                let moveCost = this.moveD;
                if (cell.markTag !== this.markTag || cell.state === MapCell.none) {
                    cell.markTag = this.markTag;
                    cell.lastX = currX;
                    cell.lastY = currY;
                    cell.dir = i;
                    cell.g = currCell.g + moveCost;
                    cell.h = Math.abs(p2.x - x) + Math.abs(p2.y - y);
                    this.openCell(cell);
                } else if (cell.state === MapCell.open) {
                    if (cell.g > currCell.g + moveCost) {
                        cell.lastX = currX;
                        cell.lastY = currY;
                        cell.dir = i;
                        cell.g = currCell.g + moveCost;
                        this.reopenCell(cell);
                    }
                }
            }

            if (!this.lastOpenCell) break;

            currCell = this.lastOpenCell;
            currX = currCell.x;
            currY = currCell.y;
        }

        if (isPath) {
            let result = [];
            while (currCell && currCell.lastX >= 0 && currCell.lastY >= 0) {
                let lastNode = {
                    x: currCell.x,
                    y: currCell.y,
                    dir: currCell.dir,
                };
                result.unshift(lastNode);
                if (currCell.lastX === p1.x && currCell.lastY === p1.y) break;
                currCell = this.mapCell[currCell.lastX * this.mapHeight + currCell.lastY];
            }
            return result.length > 0 ? result : [];
        }

        return [];
    }

    reopenCell(cell) {
        let f = cell.h + cell.g;
        cell.f = f;

        let nextCell = cell.next;
        if (nextCell && nextCell.f > f) {
            do {
                nextCell = nextCell.next;
            } while (nextCell && nextCell.f > f);
            if (cell.prev) {
                cell.prev.next = cell.next;
            }
            if (cell.next) {
                cell.next.prev = cell.prev;
            }
            if (nextCell) {
                cell.next = nextCell;
                if (nextCell.prev) {
                    cell.prev = nextCell.prev;
                    nextCell.prev.next = cell;
                } else {
                    cell.prev = this.lastOpenCell;
                    cell.next = null;
                    this.lastOpenCell.next = cell;
                    this.lastOpenCell = cell;
                }
            }
        }
    }

    openCell(cell) {
        cell.state = MapCell.open;
        let f = cell.h + cell.g;
        cell.f = f;
        let lastCell = this.lastOpenCell;
        if (!lastCell) {
            this.lastOpenCell = cell;
            cell.prev = null;
            cell.next = null;
        } else {
            while (lastCell.f < f) {
                if (lastCell.prev == null) {
                    lastCell.prev = cell;
                    cell.prev = null;
                    cell.next = lastCell;
                    return;
                }
                lastCell = lastCell.prev;
            }

            cell.prev = lastCell;
            if (lastCell.next) {
                cell.next = lastCell.next;
                lastCell.next.prev = cell;
                lastCell.next = cell;
            } else {
                cell.next = null;
                lastCell.next = cell;
                this.lastOpenCell = cell;
            }
        }
    }

    closeCell(cell) {
        if (cell.state == MapCell.open) {
            if (cell.prev) {
                cell.prev.next = cell.next;
            }
            if (cell.next) {
                cell.next.prev = cell.prev;
            }
            if (cell == this.lastOpenCell) {
                this.lastOpenCell = cell.prev;
            }
        }
        cell.state = MapCell.close;
    }

    reStartXY(x, y) {
        let cell = this.mapCell[x * this.mapHeight + y];
        cell.lastX = 0;
        cell.lastY = 0;
        cell.h = 0;
        cell.g = 0;
        cell.f = 0;
        cell.prev = null;
        cell.next = null;
        cell.state = 0;
        cell.dir = 0;
        this.lastOpenCell = null;
        this.markTag = this.markTag + 1;
    }
}

// MapCell 类
class MapCell {
    static get none() { return 0; }
    static get open() { return 1; }
    static get close() { return 2; }

    constructor() {
        this.x = 0;
        this.y = 0;
        this.unMove = false;
        this.markTag = 0;
        this.lastX = -1;
        this.lastY = -1;
        this.h = 0;
        this.g = 0;
        this.f = 0;
        this.prev = null;
        this.next = null;
        this.dir = 0;
        this.state = MapCell.none;
    }
}

// 导出类和常量
if (typeof window !== 'undefined') {
    window.OvoAstar4 = OvoAstar4;
    window.MapCell = MapCell;
    window.graphType = graphType;
}
if ( true && module.exports) {
    module.exports = { OvoAstar4, MapCell, graphType };
}


/***/ }),

/***/ 905:
/***/ (() => {

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

        // console.log('🏆 LeaderBoard 排行榜模块初始化完成');

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

                // console.log(`📊 排行榜数据加载完成，共 ${this.leaderboardData.size} 条记录`);
            } else {
                // console.log('📊 首次使用，排行榜数据为空');
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
            // console.log('💾 排行榜数据保存成功');
            return true;
        } catch (error) {
            console.error('❌ 排行榜数据保存失败:', error);
            return false;
        }
    }

    /**
     * 从 GameServer 获取当前用户数据
     * @param {Object} gameServer - GameServer 实例
     * @returns {Object|null} 当前用户数据
     */
    getCurrentUserStats(gameServer) {
        if (!gameServer) {
            console.error('❌ GameServer 未找到');
            return {
                userId: 'guest',
                currentCoins: 0,
                currentEggLevel: 0,
                userStatus: null,
                message: 'GameServer 未初始化，返回默认数据'
            };
        }

        try {
            // 获取用户状态
            const userStatus = gameServer.checkUserStatus('currentUser');
            if (!userStatus) {
                console.error('❌ 用户状态获取失败');
                return {
                    userId: 'guest',
                    currentCoins: 0,
                    currentEggLevel: 0,
                    userStatus: null,
                    message: '用户状态获取失败，返回默认数据'
                };
            }

            // 获取分数系统数据
            const scoreSystem = gameServer.scoreSystem || { currentScore: 0 };

            return {
                userId: userStatus.userId || 'guest',
                currentCoins: scoreSystem.currentScore,
                currentEggLevel: userStatus.maxUnlockedEggType || 0,
                userStatus: userStatus,
                message: '用户数据获取成功'
            };
        } catch (error) {
            console.error('❌ 获取用户数据失败:', error);
            return {
                userId: 'guest',
                currentCoins: 0,
                currentEggLevel: 0,
                userStatus: null,
                message: '发生错误，返回默认数据'
            };
        }
    }

    /**
     * 更新用户记录
     * @param {string} userId - 用户ID，可选，默认使用当前用户
     */
    updateUserRecord(userId = null) {
        // console.log('🔄 更新用户排行榜记录...');

        // 获取当前用户数据
        const gameServer = window.GameServer || null;
        const userStats = leaderboard.getCurrentUserStats(gameServer);

        if (userStats.userStatus) {
            // console.log(`✅ 用户数据: ID=${userStats.userId}, 金币=${userStats.currentCoins}, 蛋等级=${userStats.currentEggLevel}`);
        } else {
            console.warn(`⚠️ 用户数据不可用: ${userStats.message}`);
        }

        const targetUserId = userId || currentStats.userId;
        const { currentCoins, currentEggLevel } = currentStats;

        // console.log(`📊 当前用户数据 - ID: ${targetUserId}, 金币: ${currentCoins}, 蛋等级: ${currentEggLevel}`);

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
                // console.log(`🪙 金币新记录: ${existingRecord.maxCoins} -> ${currentCoins}`);
                needUpdate = true;
            } else {
                newRecord.maxCoins = existingRecord.maxCoins;
            }

            // 检查是否需要更新蛋等级记录
            if (currentEggLevel > existingRecord.maxEggLevel) {
                // console.log(`🥚 蛋等级新记录: ${existingRecord.maxEggLevel} -> ${currentEggLevel}`);
                needUpdate = true;
            } else {
                newRecord.maxEggLevel = existingRecord.maxEggLevel;
            }

            // 保留用户名
            newRecord.userName = existingRecord.userName || newRecord.userName;
        } else {
            // 新用户，直接记录
            // console.log(`👤 新用户记录: ${targetUserId}`);
            needUpdate = true;
        }

        if (needUpdate) {
            // 更新记录
            this.leaderboardData.set(targetUserId, newRecord);
            this.saveLeaderboardData();

            // console.log(`✅ 用户 ${targetUserId} 排行榜记录已更新`);
            // console.log(`🏆 最高金币: ${newRecord.maxCoins}, 最高蛋等级: ${newRecord.maxEggLevel}`);

            return true;
        } else {
            // console.log(`📊 用户 ${targetUserId} 无新记录，无需更新`);
            return false;
        }
    }

    /**
     * 获取排行榜（按金币排序）
     * @param {number} limit - 返回条数限制，默认10条
     * @returns {Array} 排行榜数组
     */
    getLeaderboard(limit = 10) {
        // console.log('🏆 获取排行榜数据...');

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

        // console.log(`📊 排行榜获取完成，共 ${leaderboard.length} 条记录`);
        return leaderboard;
    }

    /**
     * 获取用户排名
     * @param {string} userId - 用户ID
     * @returns {Object} 用户排名信息
     */
    getUserRank(userId) {
        // console.log(`🔍 查询用户 ${userId} 的排名...`);

        const userRecord = this.leaderboardData.get(userId);
        if (!userRecord) {
            // console.log(`❌ 用户 ${userId} 无排行榜记录`);
            return null;
        }

        // 获取完整排行榜
        const fullLeaderboard = this.getLeaderboard(1000); // 获取所有记录

        // 查找用户排名
        const userRankInfo = fullLeaderboard.find(record => record.userId === userId);

        if (userRankInfo) {
            // console.log(`🏆 用户 ${userId} 排名: ${userRankInfo.rank}`);
            return {
                rank: userRankInfo.rank,
                totalUsers: fullLeaderboard.length,
                userRecord: userRecord
            };
        } else {
            // console.log(`❌ 用户 ${userId} 排名查询失败`);
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
        // console.log('🗑️ 清空排行榜数据...');
        this.leaderboardData.clear();
        localStorage.removeItem(this.STORAGE_KEY);
        // console.log('✅ 排行榜数据已清空');
    }

    /**
     * 打印排行榜数据（调试用）
     */
    printLeaderboard() {
        // console.log('🏆 当前排行榜数据:');
        const leaderboard = this.getLeaderboard(10);

        leaderboard.forEach(record => {
            // console.log(`  ${record.rank}. ${record.userName} - 金币: ${record.maxCoins}, 蛋等级: ${record.maxEggLevel}`);
        });

        const stats = this.getLeaderboardStats();
        // console.log(`📊 统计: 总用户 ${stats.totalUsers}, 最高金币 ${stats.maxCoins}, 最高蛋等级 ${stats.maxEggLevel}`);
    }
}

// 创建全局 LeaderBoard 实例
window.LeaderBoard = new LeaderBoard();

// console.log('🏆 LeaderBoard 模块加载完成');

/***/ }),

/***/ 911:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var utile = utile || {};

/**
 * 查找影片剪辑
 * @param {Object} mc - 要搜索的容器对象
 * @param {string} name - 要查找的元件名称
 * @returns {Object|null} 找到的元件或null
 */
utile.findMc = function (mc, name) {
    if (!mc || !name) {
        console.warn('⚠️ findMc: 参数无效', { mc: !!mc, name });
        return null;
    }

    // console.log(`🔍 在容器中查找元件: ${name}`);

    // 检查当前元件本身
    if (mc.name === name) {
        // console.log(`✅ 找到目标元件 (自身): ${name}`);
        return mc;
    }

    // 方法1: 直接通过名称查找
    if (mc.getChildByName) {
        const found = mc.getChildByName(name);
        if (found) {
            // console.log(`✅ 通过 getChildByName 找到元件: ${name}`);
            return found;
        }
    }

    // 方法2: 遍历查找名称匹配的元件
    if (mc.children && mc.children.length > 0) {
        for (let child of mc.children) {
            const childName = child.name || '';
            if (childName === name) {
                // console.log(`✅ 通过遍历找到元件: ${name}`);
                return child;
            }
        }
    }

    // 方法3: 检查构造函数名称
    if (mc.children && mc.children.length > 0) {
        for (let child of mc.children) {
            const constructorName = child.constructor.name || '';
            if (constructorName.toLowerCase().includes(name.toLowerCase()) ||
                constructorName === name) {
                // console.log(`✅ 通过构造函数名找到元件: ${name} (构造函数: ${constructorName})`);
                return child;
            }
        }
    }

    // 方法4: 递归查找子元件
    if (mc.children && mc.children.length > 0) {
        for (let child of mc.children) {
            const found = utile.findMc(child, name);
            if (found) {
                // console.log(`✅ 通过递归查找找到元件: ${name}`);
                return found;
            }
        }
    }

    console.log(`❌ 未找到元件: ${name}`);
    return null;
}

// ========== 简单可逆异或混淆工具（用于本地存储轻量加密 / 非高安全） ==========
// 注意：此方法只是对明文做轻量混淆，不能替代真实加密；适合防止 casual 查看 localStorage
utile._strToUint8 = function (str) {
    try {
        return new TextEncoder().encode(String(str));
    } catch (e) {
        // 兼容性回退
        const arr = new Uint8Array(str.length);
        for (let i = 0; i < str.length; i++) arr[i] = str.charCodeAt(i);
        return arr;
    }
};

utile._uint8ToStr = function (u8) {
    try {
        return new TextDecoder().decode(u8);
    } catch (e) {
        let s = '';
        for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]);
        return s;
    }
};

utile._base64Encode = function (u8) {
    let s = '';
    for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]);
    return btoa(s);
};

utile._base64Decode = function (b64) {
    const s = atob(String(b64));
    const u8 = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) u8[i] = s.charCodeAt(i);
    return u8;
};

utile._xorBytes = function (dataU8, keyStr) {
    const keyU8 = utile._strToUint8(String(keyStr || 'k'));
    const out = new Uint8Array(dataU8.length);
    if (!keyU8 || keyU8.length === 0) return dataU8;
    for (let i = 0; i < dataU8.length; i++) {
        out[i] = dataU8[i] ^ keyU8[i % keyU8.length];
    }
    return out;
};

/**
 * 将对象加密为 base64 字符串（使用简单异或混淆）
 * @param {Object} obj
 * @param {string} key
 * @returns {string|null}
 */
utile.xorEncryptObject = function (obj, key) {
    try {
        const json = JSON.stringify(obj);
        const dataU8 = utile._strToUint8(json);
        const x = utile._xorBytes(dataU8, key);
        return utile._base64Encode(x);
    } catch (e) {
        console.error('❌ xorEncryptObject 失败:', e);
        return null;
    }
};

/**
 * 从 base64 异或混淆串解密为对象
 * @param {string} b64
 * @param {string} key
 * @returns {Object|null}
 */
utile.xorDecryptToObject = function (b64, key) {
    try {
        if (!b64) return null;
        const u8 = utile._base64Decode(b64);
        const plainU8 = utile._xorBytes(u8, key);
        const json = utile._uint8ToStr(plainU8);
        return JSON.parse(json);
    } catch (e) {
        console.error('❌ xorDecryptToObject 失败:', e);
        return null;
    }
};


/**
 * 打印可用的子元件名称（用于调试）
 * @param {Object} mc - 要检查的容器对象
 */
utile.logAvailableChildren = function (mc) {
    console.log('🔍 可用的子元件列表:');
    if (mc && mc.children) {
        mc.children.forEach((child, index) => {
            const name = child.name || 'unnamed';
            const constructor = child.constructor.name || 'unknown';
            console.log(`  ${index}: name="${name}", constructor="${constructor}"`);

            // 特别标记包含特定关键词的元件
            if (name.includes('guide') || constructor.includes('guide') ||
                name.includes('egg') || constructor.includes('egg')) {
                console.log(`    🎯 这可能是目标元件！`);
            }
        });
    } else {
        console.log('  ❌ 容器为空或没有子元件');
    }
}


/**
 * 默认不可见不绘制
 * 使影片剪辑停止播放
 */
utile.goStop = function (mc, isShow) {
    if (!mc) return;
    if (mc["visible"] == undefined) return;
    if (mc["visible"] == null) return;
    if (mc["stop"] == undefined) return;
    if (mc["stop"]) {
        mc.gotoAndStop(0);
    }
    mc.visible = isShow || false;

    if (mc["children"] && mc.children.length > 0) {
        for (var k in mc.children) {
            //if (mc.children[k]) mc.children[k].stop();
            if (mc.children[k]["children"] && mc.children[k]["children"].length > 0) {
                utile.goStop(mc.children[k], isShow);
            }
        }
    }
}

utile.goPlay = function (mc) {
    if (mc["visible"] != null || mc["visible"] != undefined) {

        mc.visible = true;
        mc.play();
    };
    if (mc["parent"] && mc["parent"]["play"]) {
        utile.goPlay(mc["parent"]);
    }
}
/**
 * 
 * @param {显示} mc 
 */
utile.toShow = function (mc) {

    function downShow(mc) {
        if (!mc) return;
        if (mc["visible"] == undefined) return;
        if (mc["visible"] == null) return
        mc.visible = true;

        if (mc["children"] && mc.children.length > 0) {
            for (var k in mc.children) {
                if (mc.children[k]["children"] && mc.children[k]["children"].length > 0) {
                    downShow(mc.children[k])
                }
            }
        }
    }
    downShow(mc);

    function upShow(mc) {
        if (!mc) return;
        if (mc["visible"] == undefined) return;
        if (mc["visible"] == null) return
        mc.visible = true;
        mc.visible = true;

        if (mc["parent"] && mc["parent"]["play"]) {
            upShow(mc["parent"]);
        }
    }

    upShow(mc);
}

/**
 * 从字库中随机文字
 * long指定范围
 * range取出范围
 */
utile.randomWord = function (long, range) {
    var tempArr = [];
    for (var k = 0; k < long; k++) {
        tempArr.push(k);
    }
    var arr = [];
    for (var j = 0; j < range; j++) {
        var len = tempArr.length;
        var n = Math.floor(Math.random() * len);
        arr.push(tempArr.splice(n, 1)[0]);
    }
    return arr;
}

/**
 * 正确答案只有一个的情况,随机出每轮5关的出题数组
 * @param {long} 指定范围
 * @param {totalLevel} 每轮关数
 * @param {answerLength} 选项个数（每轮的关数）
 * @param {maxTurn} 最大轮数
 * @returns 
 */
var turnArr = [];
var turnIndex = 0;
utile.randomWordByTurn = function (long, totalLevel, answerLength, maxTurn) {
    var result = [];

    turnIndex++;

    if (turnIndex > maxTurn) {
        turnIndex = 1;
    }

    var startIndex = (turnIndex - 1) * totalLevel;
    if (startIndex > (long - 1)) {
        turnIndex = 1;
    }

    if (turnIndex == 1) {
        turnArr = utile.randomWord(long, long);
    }

    var endIndex = turnIndex * totalLevel;
    if (endIndex > turnArr.length) {
        endIndex = turnArr.length;
    }



    var tempList = [];
    for (var i = startIndex; i < endIndex; i++) {
        tempList.push(turnArr[i]);
    }

    if (tempList.length < totalLevel) {
        var tempArr = utile.copyAry(turnArr).slice(0, startIndex - 1);
        tempArr = utile.getRandomByNum(tempArr, totalLevel - tempList.length);
        tempList = tempList.concat(tempArr);
    }

    for (var j = 0; j < tempList.length; j++) {
        var tObj = {};
        tObj.answer = tempList[j];
        var tOptions = utile.getRanNumWithout(turnArr, answerLength - 1, tObj.answer).concat([tObj.answer]);
        utile.randomArray(tOptions)
        tObj.options = tOptions;
        result.push(tObj);
    }



    return result;
}

utile.randomWordByTurnNoAnswer = function (long, totalLevel, maxTurn) {
    var result = [];

    turnIndex++;

    if (turnIndex > maxTurn) {
        turnIndex = 1;
    }

    var startIndex = (turnIndex - 1) * totalLevel;
    if (startIndex > (long - 1)) {
        turnIndex = 1;
    }

    if (turnIndex == 1) {
        turnArr = utile.randomWord(long, long);
    }

    var endIndex = turnIndex * totalLevel;
    if (endIndex > turnArr.length) {
        endIndex = turnArr.length;
    }



    var tempList = [];
    for (var i = startIndex; i < endIndex; i++) {
        tempList.push(turnArr[i]);
    }

    if (tempList.length < totalLevel) {
        var tempArr = utile.copyAry(turnArr).slice(0, startIndex - 1);
        tempArr = utile.getRandomByNum(tempArr, totalLevel - tempList.length);
        tempList = tempList.concat(tempArr);
    }

    return tempList;
}

/**随机不重复数组 */
utile.randomArr = function (a) {
    var stack = [];
    stack.push(a);
    while (true) {
        var ok = true;
        if (stack.length >= 3) break;
        var index = Math.floor(Math.random() * 10) + 1;
        for (var k in stack) {
            if (stack[k] == index) {
                ok = false;
            };
        };
        if (ok) {
            stack.push(index);
        }
    };
    return stack;
}
/**
 * 随机范围内整数
 */
utile.randomInt = function (range) {
    return Math.floor(Math.random() * range);
}

/** 获取随机数，包含min和max */
utile.getRandom = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 获取范围内N个不重复的随机数 
 * @param num: 数量
*/
utile.getMultRandom = function (min, max, num) {
    if ((max - min) < num) return [];
    let out = [];
    for (var i = 0; i < num; ++i) {
        let result = this.getRandom(min, max);
        if (out.indexOf(result) != -1) {
            --i;
        } else {
            out.push(result);
        }
    }
    return out;
}

/** 打乱数组 */
utile.randomArray = utile.randomAry = function (value) {
    //Fisher–Yates随机算法:
    let m = value.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = value[m];
        value[m] = value[i];
        value[i] = t;
    }
}

/**监听播放完成 */
utile.addFrameEnd = function (taget, callback, tf) {
    taget.timeline.addTween(
        createjs.Tween.get(taget)
            .wait(taget.totalFrames - 1)
            .call(function () {
                if (tf) {
                    taget.gotoAndStop(taget.totalFrames - 2);
                } else {
                    taget.gotoAndStop(0)
                }
                taget.timeline.removeTween();
                taget.removeAllEventListeners();
                callback && callback(taget);
            }).wait(1)
    );
}

/**播放声音 */
utile.addPlaySound = function (name, callback) {
    var sound = createjs.Sound.play(name);
    sound.name = name;
    if (callback) {
        sound.on("complete", function (evt) {
            sound.removeAllEventListeners()
            sound = null;
            callback(evt)
        });
    }
    //sound.on("failed", this.onErrorHandler, this);
}
/**延迟 */
utile.delayTimer = function (time, callback) {
    createjs.Tween.get(stage)
        .wait(time || 1000)
        .call(function () {
            createjs.Tween.removeAllTweens();
            if (callback) callback()
        })
}

utile.get16To10 = function (num) {
    var n = -1;
    switch (num) {
        case "A":
            n = 10;
            break;
        case "B":
            n = 11;
            break;
        case "C":
            n = 12;
            break;
        case "D":
            n = 13;
            break;
        case "E":
            n = 14;
            break;
        case "F":
            n = 15;
            break;
        case "G":
            n = 16;
            break;
        default:
            n = Number(num);
            break;
    }
    return n;
}
utile.randomOK = function () {
    return Math.random() > .5 ? true : false;
}

utile.randomSortArray = function (arr) {
    var stack = [];
    while (arr.length) {
        var index = parseInt(Math.random() * arr.length);
        stack.push(arr[index]);
        arr.splice(index, 1);
    }
    return stack;
}

var whether = false;

/**
 * 生成不重复的随机数
 * from: 开始数字（包含）
 * to：结束数字（包含）
 * exclued：需要排除的数组
*/
utile.getUniqueRandom = function (from, to, exclude) {
    var tempArr = [];
    var excludeArr = exclude ? exclude : [];

    for (var i = from; i <= to; i++) {
        if (excludeArr.indexOf(i) == -1) {
            tempArr.push(i);
        }
    }

    var randomIndex = Math.floor(Math.random() * tempArr.length);

    return tempArr[randomIndex]
}

/** 随机从数组中取出count个元素 原数组不变 */
utile.getRandomByNum = function (ary, count) {
    if (!ary || ary.length == 0) return [];
    let indexs = [], out = [], i;
    for (i = 0; i < ary.length; ++i) {
        indexs.push(i);
    }
    this.randomArray(indexs);
    let length = Math.min(ary.length, count);
    for (i = 0; i < length; ++i) {
        out.push(ary[indexs[i]]);
    }
    return out;
}

utile.getRanNumWithout = function (ary, count, without) {
    let newAry = utile.copyAry(ary)
    let index = newAry.indexOf(without)
    if (index != -1) {
        newAry.splice(index, 1);
    }
    return this.getRandomByNum(newAry, count)
}

utile.copyAry = function (value) {
    let out = [];
    for (i = 0; i < value.length; ++i) {
        out[i] = value[i];
    }
    return out;
}


utile.shake = function (mc) {
    if (createjs.Tween.hasActiveTweens(mc)) {
        return;
    }

    let initx = mc.x;
    let inity = mc.y;
    createjs.Tween.get(mc)
        .to({ x: mc.x + 30 }, 30)
        .wait(50)
        .to({ x: mc.x - 30 }, 30)
        .wait(50)
        .to({ x: mc.x + 20 }, 20)
        .wait(50)
        .to({ x: mc.x - 20 }, 20)
        .wait(50)
        .to({ x: mc.x + 10 }, 10)
        .wait(50)
        .to({ x: mc.x - 10 }, 10)
        .wait(50)
        .call(() => {
            mc.x = initx;
            mc.y = inity;
            createjs.Tween.removeTweens(mc);
        })
}


utile.__sdklog = function (...args) {
    if (true) return; // 生产环境不输出
    // removed by dead control flow
{}

    // removed by dead control flow
{}

    // removed by dead control flow
{}
}


utile.__sdklog2 = function (...args) {
    if (true) return; // 生产环境不输出
    // removed by dead control flow
{}

    // removed by dead control flow
{}

    // removed by dead control flow
{}
}


utile.__sdklog3 = function (...args) {
    if (true) return; // 生产环境不输出
    // removed by dead control flow
{}

    // removed by dead control flow
{}

    // removed by dead control flow
{}
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (utile);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/harmony module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.hmd = (module) => {
/******/ 			module = Object.create(module);
/******/ 			if (!module.children) module.children = [];
/******/ 			Object.defineProperty(module, 'exports', {
/******/ 				enumerable: true,
/******/ 				set: () => {
/******/ 					throw new Error('ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: ' + module.id);
/******/ 				}
/******/ 			});
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	__webpack_require__(911);
/******/ 	__webpack_require__(883);
/******/ 	__webpack_require__(15);
/******/ 	__webpack_require__(804);
/******/ 	__webpack_require__(104);
/******/ 	__webpack_require__(905);
/******/ 	__webpack_require__(434);
/******/ 	__webpack_require__(289);
/******/ 	var __webpack_exports__ = __webpack_require__(801);
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle.js.map