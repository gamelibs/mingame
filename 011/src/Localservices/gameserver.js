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
                    eggType: [0, 0, 1],
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

        // 寻路系统
        this.pathfindingGrid = null;

        // 地图系统
        this.mapConfig = {
            rows: 8,
            cols: 6,
            cellWidth: 150,
            cellHeight: 150,
            totalCells: 48,
            // 前端渲染需要的配置
            width: 900,           // gamebox 宽度
            height: 1200,         // gamebox 高度
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
        setTimeout(() => {
            this.initializeMapSystem();
        }, 100);
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

        // 测试默认true
        if (!userData) {//|| 
            // 新用户
            const newUserData = {
                userId: userId,
                isNewUser: true,
                currentLevel: 0,
                currentStep: 1,
                maxUnlockedEggType: 0, // 新用户只解锁了基础蛋类型0
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
            console.log('🎉 欢迎回来！');

            const existingUserData = {
                ...userData,
                isNewUser: false,
                lastPlayTime: Date.now()
            };

            // 更新最后游戏时间
            this.saveUserData(userId, existingUserData);

            console.log(`👤 老用户登录 - 等级: ${existingUserData.currentLevel}, 步骤: ${existingUserData.currentStep}`);
            console.log(`🏆 已解锁最高蛋等级: ${existingUserData.maxUnlockedEggType || 0}`);

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
     * 获取老用户算法生成数据
     * @param {number} level - 关卡等级
     * @param {number} step - 步骤
     * @param {Object} userStatus - 用户状态
     * @returns {Object} 算法生成的游戏数据
     */
    getAlgorithmData(level, step, userStatus) {
        console.log(`🎲 获取老用户算法生成数据 - 等级: ${level}, 步骤: ${step}`);
        console.log('🎉 欢迎回来！');

        // 确保地图系统已初始化
        if (!this.mapState.isInitialized) {
            console.warn('⚠️ 地图系统未初始化，等待初始化完成...');
            throw new Error('地图系统未初始化，无法获取游戏数据');
        }

        // 获取用户已解锁的最高蛋等级
        const maxUnlockedEggType = userStatus.maxUnlockedEggType || 0;
        console.log(`🏆 已解锁最高蛋等级: ${maxUnlockedEggType}`);

        // 从真实地图状态获取空位置
        const emptyPositions = this.getEmptyPositionsFromMap();
        const randomEggSeats = this.selectRandomPositions(emptyPositions, 3);

        // 根据解锁等级计算可用蛋类型
        const availableEggTypes = this.getAvailableEggTypes(maxUnlockedEggType);
        const randomEggTypes = this.selectRandomEggTypes(availableEggTypes, 3);

        // 在地图状态中标记这些位置将被占用
        this.reservePositionsForEggs(randomEggSeats, randomEggTypes);

        const algorithmData = {
            eggSeat: randomEggSeats,
            eggType: randomEggTypes,
            pointSeat: [] // 老用户不需要引导点
        };

        console.log(`🥚 老用户蛋数据 - 位置: [${randomEggSeats}], 类型: [${randomEggTypes}]`);
        console.log(`📍 地图状态 - 空闲: ${this.mapState.emptyCells.size}, 占用: ${this.mapState.occupiedCells.size}`);

        return {
            success: true,
            isNewUser: false,
            level: level,
            step: step,
            data: algorithmData,
            userStatus: userStatus,
            message: 'Algorithm data generated successfully for returning user'
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





    /**
     * 初始化并返回 A* 寻路实例
     * @param {number} type - 寻路类型 (4: 四方向, 8: 八方向)
     * @returns {Object} A* 寻路实例
     */
    getAstar(type = 4) {
        console.log(`🔍 尝试获取 A* 寻路实例，类型: ${type}`);

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
        console.log(`⏳ 等待 A* 模块加载，类型: ${type}`);

        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            const checkModule = () => {
                const astar = this.getAstar(type);
                if (astar) {
                    console.log(`✅ A* 模块加载完成，耗时: ${Date.now() - startTime}ms`);
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
     * @param {number} rows - 行数 (默认 8)
     * @param {number} cols - 列数 (默认 6)
     * @param {number} cellSize - 格子大小 (默认 150)
     * @param {number} pathType - 寻路类型 (4: 四方向, 8: 八方向)
     * @returns {Promise} 返回初始化的网格数据
     */
    initPathfindingGrid(rows = 8, cols = 6, cellSize = 150, pathType = 4) {
        console.log(`🗺️ 初始化寻路网格: ${rows}x${cols}, 格子大小: ${cellSize}, 寻路类型: ${pathType}方向`);

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

                console.log('✅ 寻路网格初始化完成');
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

            console.log(`🔄 更新网格 (${row}, ${col}): 可通行=${walkable}, 占用=${occupied}`);
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

        console.log(`🔍 寻路: (${startPos.row}, ${startPos.col}) -> (${endPos.row}, ${endPos.col})`);

        const path = astar.search(
            { x: startPos.row, y: startPos.col },
            { x: endPos.row, y: endPos.col }
        );

        console.log(`📍 找到路径，长度: ${path.length}`);
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
     * 处理蛋的选择和移动请求（类似 setMosterSear）
     * @param {string} action - 操作类型
     * @param {number} cellId - 格子ID
     * @param {Object} gameState - 当前游戏状态
     * @returns {Promise<Object>} 操作结果
     */
    // processEggAction(action, cellId, gameState) {
    //     console.log(`🎮 处理蛋操作: ${action}, 格子: ${cellId}`);

    //     return new Promise((resolve) => {
    //         // 如果已经选中了蛋
    //         if (gameState.selectedEgg) {
    //             // 检查是否点击同一个蛋（取消选择）
    //             if (gameState.selectedEgg.cellId === cellId && gameState.selectedEgg.isSelected) {
    //                 resolve({
    //                     code: 0,
    //                     step: 3, // 取消选择
    //                     cellId: cellId,
    //                     message: "取消选择蛋"
    //                 });
    //                 return;
    //             }

    //             // 检查目标位置是否为空（可以移动）
    //             if (!gameState.cells[cellId] || !gameState.cells[cellId].hasEgg) {
    //                 // 生成移动路径
    //                 const fromPos = this.cellIdToPosition(gameState.selectedEgg.cellId);
    //                 const toPos = this.cellIdToPosition(cellId);
    //                 const path = this.findPath(fromPos, toPos);

    //                 if (path.length === 0) {
    //                     resolve({
    //                         code: -1,
    //                         cellId: gameState.selectedEgg.cellId,
    //                         message: "无法找到移动路径"
    //                     });
    //                     return;
    //                 }

    //                 resolve({
    //                     code: 0,
    //                     step: 2, // 移动步骤
    //                     fromCellId: gameState.selectedEgg.cellId,
    //                     toCellId: cellId,
    //                     eggType: gameState.selectedEgg.eggType,
    //                     path: path,
    //                     message: "开始移动蛋"
    //                 });
    //                 return;
    //             } else {
    //                 // 目标位置有蛋，切换选择
    //                 resolve({
    //                     code: 0,
    //                     step: 4, // 切换选择
    //                     oldCellId: gameState.selectedEgg.cellId,
    //                     newCellId: cellId,
    //                     message: "切换选择的蛋"
    //                 });
    //                 return;
    //             }
    //         } else {
    //             // 没有选中蛋，检查点击位置是否有蛋
    //             if (gameState.cells[cellId] && gameState.cells[cellId].hasEgg) {
    //                 resolve({
    //                     code: 0,
    //                     step: 1, // 选择蛋
    //                     cellId: cellId,
    //                     eggType: gameState.cells[cellId].eggType,
    //                     message: "选择蛋"
    //                 });
    //             } else {
    //                 resolve({
    //                     code: -1,
    //                     message: "该位置没有蛋"
    //                 });
    //             }
    //         }
    //     });
    // }

    /**
     * 检查蛋合成条件（类似 getMosterClearList）
     * @param {number} cellId - 检查的格子ID
     * @param {Object} gameState - 游戏状态
     * @returns {Promise<Object>} 合成检查结果
     */
    checkEggSynthesis(cellId, gameState) {
        console.log(`🔍 检查格子 ${cellId} 的蛋合成条件`);

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
 * 查找蛋匹配（用于合成检查）
 * @param {number} cellId - 检查的格子ID（移动到的目标位置）
 * @param {Object} gameState - 游戏状态
 * @returns {Object|null} 匹配结果
 */
    findEggMatches(cellId, gameState) {
        const cell = gameState.cells[cellId];
        if (!cell || !cell.hasEgg) {
            return null;
        }

        const targetEggType = cell.eggType;
        const matches = [];
        const visited = new Set();
        const queue = [cellId];
        visited.add(cellId);

        // BFS 查找相邻的相同类型蛋
        while (queue.length > 0) {
            const currentCellId = queue.shift();
            matches.push(currentCellId);

            const adjacentCells = this.getAdjacentCells(currentCellId);
            for (const adjCellId of adjacentCells) {
                if (!visited.has(adjCellId)) {
                    const adjCell = gameState.cells[adjCellId];
                    if (adjCell && adjCell.hasEgg && adjCell.eggType === targetEggType) {
                        visited.add(adjCellId);
                        queue.push(adjCellId);
                    }
                }
            }
        }

        if (matches.length >= 3) {
            const newEggType = Math.min(targetEggType + 1, 6);
            const score = this.calculateSynthesisScore(matches.length, targetEggType);

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
     * @param {number} eggCount - 蛋数量
     * @param {number} eggType - 蛋类型
     * @returns {number} 分数
     */
    calculateSynthesisScore(eggCount, eggType) {
        const baseScore = 10;
        const typeMultiplier = (eggType + 1) * 5; // 高级蛋分数更高
        const countBonus = (eggCount - 3) * 5; // 超过3个的额外奖励
        return baseScore + typeMultiplier + countBonus;
    }

    /**
     * 获取蛋类型名称
     * @param {number} eggType - 蛋类型 (0-6)
     * @returns {string} 蛋类型名称
     */
    getEggTypeName(eggType) {
        const eggNames = {
            0: '白色', // egg_mc0
            1: '绿色', // egg_mc1
            2: '蓝色', // egg_mc2
            3: '紫色', // egg_mc3
            4: '红色', // egg_mc4
            5: '黄色', // egg_mc5
            6: '橙色'  // egg_mc6
        };
        return eggNames[eggType] || '未知';
    }

    /**
     * 生成随机蛋位置
     * @param {Object} gameState - 游戏状态
     * @param {number} count - 生成数量，默认3个
     * @returns {Array} 生成的蛋数据
     */
    generateRandomEggs(gameState, count = 3) {
        console.log(`🎲 生成 ${count} 个随机蛋...`);

        // 获取空闲位置
        const emptyCells = [];
        for (let cellId in gameState.cells) {
            if (!gameState.cells[cellId].hasEgg) {
                emptyCells.push(parseInt(cellId));
            }
        }

        if (emptyCells.length < count) {
            console.warn(`⚠️ 空闲位置不足，需要 ${count} 个，只有 ${emptyCells.length} 个`);
            count = emptyCells.length;
        }

        const newEggs = [];
        for (let i = 0; i < count; i++) {
            // 随机选择位置
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            const cellId = emptyCells.splice(randomIndex, 1)[0];

            // 随机生成蛋类型（偏向低级蛋）
            const eggType = this.generateRandomEggType();

            newEggs.push({
                cellId: cellId,
                eggType: eggType,
                eggName: this.getEggTypeName(eggType)
            });

            console.log(`🥚 在格子 ${cellId} 生成 ${this.getEggTypeName(eggType)} 蛋 (egg_mc${eggType})`);
        }

        return newEggs;
    }

    /**
     * 生成随机蛋类型（偏向低级蛋）
     * @returns {number} 蛋类型 (0-6)
     */
    generateRandomEggType() {
        // 权重分布：低级蛋出现概率更高
        const weights = [40, 25, 15, 10, 5, 3, 2]; // 对应 egg_mc0 到 egg_mc6
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

        let random = Math.random() * totalWeight;
        for (let i = 0; i < weights.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return i;
            }
        }

        return 0; // 默认返回最低级
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
            console.log(`📍 从游戏状态找到 ${emptyPositions.length} 个空位置`);
        } else {
            // 如果没有游戏状态，假设所有位置都是空的
            for (let i = 0; i < totalPositions; i++) {
                emptyPositions.push(i);
            }
            console.log(`📍 默认模式：假设所有 ${emptyPositions.length} 个位置都是空的`);
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

        console.log(`🎲 随机选择位置: [${selected}]`);
        return selected;
    }

    /**
 * 获取可用的蛋类型（基于解锁等级）
 * @param {number} maxUnlockedEggType - 最高解锁等级
 * @returns {Array} 可用蛋类型数组
 */
    getAvailableEggTypes(maxUnlockedEggType) {
        const availableTypes = [];
        for (let i = 0; i <= Math.min(maxUnlockedEggType, 6); i++) {
            availableTypes.push(i);
        }
        console.log(`🎯 可用蛋类型: [${availableTypes.join(', ')}] (解锁到: ${maxUnlockedEggType})`);
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
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * availableTypes.length);
            selectedTypes.push(availableTypes[randomIndex]);
        }
        console.log(`🎲 随机选择蛋类型: [${selectedTypes.join(', ')}]`);
        return selectedTypes;
    }

    /**
     * 更新用户的最高解锁蛋等级
     * @param {string} userId - 用户ID
     * @param {number} newEggType - 新解锁的蛋等级
     */
    updateMaxUnlockedEggType(userId, newEggType) {
        const userData = this.checkUserStatus(userId);
        if (userData) {
            const currentMax = userData.maxUnlockedEggType || 0;
            if (newEggType > currentMax) {
                userData.maxUnlockedEggType = newEggType;
                this.saveUserData(userId, userData);
                console.log(`🎉 用户 ${userId} 解锁了新蛋等级: ${newEggType} (${this.getEggTypeName(newEggType)})`);
            }
        }
    }

    /**
     * 处理蛋合成成功事件
     * @param {string} userId - 用户ID
     * @param {number} synthesizedEggType - 合成的蛋等级
     * @param {number} eggCount - 合成的蛋数量
     */
    onEggSynthesisSuccess(userId, synthesizedEggType, eggCount) {
        console.log(`🎊 用户 ${userId} 成功合成了 ${this.getEggTypeName(synthesizedEggType)} 蛋`);

        // 更新最高解锁等级
        this.updateMaxUnlockedEggType(userId, synthesizedEggType);

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
        console.log(`📍 从地图状态获取空位置: ${emptyPositions.length} 个`);
        return emptyPositions;
    }

    /**
     * 为蛋预留位置（在地图状态中标记）
     * @param {Array} positions - 位置数组
     * @param {Array} eggTypes - 蛋类型数组
     */
    reservePositionsForEggs(positions, eggTypes) {
        console.log(`📌 预留蛋位置: [${positions}]`);

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

                console.log(`📌 预留格子 ${cellId}: 蛋类型 ${eggType}`);
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

            console.log(`🗑️ 释放格子 ${cellId}`);
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

            console.log(`📍 占用格子 ${cellId}: 蛋类型 ${eggType}`);
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
        console.log(`🖱️ 处理蛋点击: 格子${cellId}`);

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
            console.log(`🚶 尝试移动蛋到空位置: ${this.selectionState.selectedEgg.cellId} -> ${cellId}`);

            // 调用移动处理逻辑
            const moveResult = this.processEggMove(this.selectionState.selectedEgg.cellId, cellId);

            if (moveResult.code === 0) {
                // 移动成功，清除选中状态
                this.clearSelection();

                return {
                    code: 0,
                    step: 2,  // 步骤2：移动蛋
                    fromCellId: moveResult.fromCellId,
                    toCellId: moveResult.toCellId,
                    path: moveResult.path,
                    eggType: moveResult.eggType,
                    positionsToDelete: moveResult.positionsToDelete, // 添加需要删除的位置
                    synthesis: moveResult.synthesis,  // 添加合成数据
                    newEggs: moveResult.newEggs,      // 添加新蛋数据
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
            console.log(`📍 点击了空位置: 格子${cellId}`);
            return {
                code: -1,
                step: 0,  // 步骤0：错误或无效操作
                message: "位置为空",
                cellId: cellId
            };
        }

        // 情况2：选择新蛋（当前没有选中任何蛋）
        if (!this.selectionState.isSelected) {
            console.log(`🎯 选择新蛋: 格子${cellId}, 类型${cell.eggType}`);

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
            console.log(`🔄 取消选择: 格子${cellId}`);

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
        console.log(`🔄 切换选择: ${oldCellId} -> ${cellId}`);

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



    /**
     * 处理蛋移动
     * @param {number} fromCellId - 起始格子ID
     * @param {number} toCellId - 目标格子ID
     * @returns {Object} 移动结果
     */
    processEggMove(fromCellId, toCellId) {
        console.log(`🚶 处理蛋移动: ${fromCellId} -> ${toCellId}`);

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

            console.log(`🗑️ 合成时需要删除的位置: [${positionsToDelete}]`);


            // 如果可以合成，先处理合成逻辑（移除旧蛋，更新地图状态）
            this.processSynthesisResult(synthesisResult, toCellId);
        }

        // 6. 无论是否合成都生成新蛋位置（基于最新地图状态）
        const newEggs = this.generateRandomEggsFromMapState(3);

        console.log(`✅ 蛋移动处理完成: ${fromCellId} -> ${toCellId}`);

        return {
            code: 0,
            fromCellId: fromCellId,
            toCellId: toCellId,
            path: path,
            eggType: eggType,
            positionsToDelete: positionsToDelete, // 返回需要删除的位置列表
            synthesis: synthesisData,
            newEggs: newEggs,
            message: "移动处理完成"
        };
    }

    /**
 * 处理合成结果（更新地图状态）
 * @param {Object} synthesisResult - 合成结果
 * @param {number} targetCellId - 移动的目标位置（合成位置）
 */
    processSynthesisResult(synthesisResult, targetCellId) {
        console.log('🎬 处理合成结果，更新地图状态...');

        // 移除被合成的蛋（除了目标位置）
        for (const cellId of synthesisResult.matches) {
            if (cellId !== targetCellId) {
                this.releasePosition(cellId);
                console.log(`🗑️ 移除合成位置: ${cellId}`);
            }
        }

        // 更新目标位置的蛋类型为合成后的新类型
        const targetCell = this.mapState.cells[targetCellId];
        if (targetCell) {
            targetCell.eggType = synthesisResult.newEggType;
            console.log(`🥚 目标位置 ${targetCellId} 更新为 ${this.getEggTypeName(synthesisResult.newEggType)} 蛋`);
        }

        console.log(`✅ 合成处理完成，生成 ${this.getEggTypeName(synthesisResult.newEggType)} 蛋`);
    }


    /**
 * 从地图状态生成随机蛋
 * @param {number} count - 生成数量
 * @returns {Array} 生成的蛋数据
 */
    generateRandomEggsFromMapState(count = 3) {
        console.log(`🎲 从地图状态生成 ${count} 个随机蛋...`);

        // 从地图状态获取空闲位置
        const emptyCells = Array.from(this.mapState.emptyCells);

        if (emptyCells.length < count) {
            console.warn(`⚠️ 空闲位置不足，需要 ${count} 个，只有 ${emptyCells.length} 个`);
            count = emptyCells.length;
        }

        // 获取用户解锁状态
        const userStatus = this.checkUserStatus('currentUser');
        const maxUnlockedEggType = userStatus ? (userStatus.maxUnlockedEggType || 0) : 0;

        // 获取可用蛋类型并随机选择
        const availableTypes = this.getAvailableEggTypes(maxUnlockedEggType);
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

        // utile.__sdklog3(`✅ 生成 ${newEggs.length} 个新蛋，后端状态已同步`,);
        // 打印当前地图所有已存在蛋的状态
        console.log('🗺️ 当前地图蛋状态:');
        const existingEggs = [];
        Object.keys(this.mapState.cells).forEach(cellId => {
            const cell = this.mapState.cells[cellId];
            if (cell.hasEgg) {
                existingEggs.push({
                    cellId: parseInt(cellId),
                    eggType: cell.eggType,
                    hasPiece: !!cell.piece
                });
                console.log(`  格子${cellId}: 蛋类型${cell.eggType} ${this.getEggTypeName(cell.eggType)} ${cell.piece ? '(有前端元件)' : '(无前端元件)'}`);
            }
        });

        utile.__sdklog3(`📊 地图统计: 总共${existingEggs.length}个蛋, 空闲格子${this.mapState.emptyCells.size}个, 占用格子${this.mapState.occupiedCells.size}个`);
        return newEggs;
    }


    /**
     * 寻找移动路径
     * @param {number} fromCellId - 起始格子ID
     * @param {number} toCellId - 目标格子ID
     * @returns {Array} 路径数组
     */
    findMovePath(fromCellId, toCellId) {
        console.log(`🔍 寻找移动路径: ${fromCellId} -> ${toCellId}`);

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

        console.log('🔄 寻路网格状态已更新');
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
}

// 创建全局 GameServer 实例
window.GameServer = new GameServer();