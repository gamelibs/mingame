/**
 * 游戏场景管理器
 * 负责游戏的主要逻辑和交互
 */
console.log('📁 GameScense.js 开始加载...');
class GameScense {
    constructor() {
        this.engine = null;
        this.stage = null;
        this.exportRoot = null;
        this.canvas = null;
        this.config = null;
        this.loadedSounds = null;
        this.loadedImages = null;

        // 游戏场景元件
        this.gamebox = null;

        // 游戏状态
        this.gameState = 'init'; // init, playing, paused, ended
        this.isInitialized = false;

        // 游戏数据相关
        this.gameData = null;
        this.userStatus = null;

        // 引导相关
        this.guideGesture = null;
        this.pointSeats = [];
        this.currentPointIndex = 0;
        this.waitingForClick = false;
        this.expectedClickCellId = null;
    }

    /**
     * 初始化游戏场景
     * @param {Object} gameData - 游戏数据对象
     */
    init(gameData) {
        console.log('🎮 GameScense 初始化开始...');

        // 保存游戏数据
        this.engine = gameData.engine;
        this.stage = gameData.stage;
        this.exportRoot = gameData.exportRoot;
        this.canvas = gameData.canvas;
        this.config = gameData.config;
        this.loadedSounds = gameData.loadedSounds;
        this.loadedImages = gameData.loadedImages;

        try {
            // 保存用户数据和游戏配置
            this.userStatus = gameData.userStatus;
            this.gameData = gameData.gameConfig;

            console.log('👤 接收到用户状态:', this.userStatus);
            console.log('🎯 接收到游戏配置:', this.gameData);

            // 初始化棋盘系统
            this.initChessboard();

            // 获取游戏场景中的 gamebox 元件
            this.getGamebox();

            // 初始化游戏元素
            this.initGameElements();

            // 设置事件监听
            this.setupEventListeners();

            // 验证接收到的数据
            this.verifyGameData();

            // 根据游戏配置初始化棋盘内容
            this.initGameBoard();

            // 初始化引导手势
            this.initGuideGesture();

            // 开始游戏
            this.startGame();

            this.isInitialized = true;
            console.log('✅ GameScense 初始化完成');

        } catch (error) {
            console.error('❌ GameScense 初始化失败:', error);
        }
    }

    /**
 * 初始化棋盘系统
 */
    initChessboard() {
        console.log('🏁 初始化棋盘系统...');

        // 棋盘配置
        this.chessboard = {
            width: 900,           // gamebox 宽度
            height: 1200,         // gamebox 高度
            cols: 6,              // 列数
            rows: 8,              // 行数
            cellWidth: 150,       // 每个格子宽度
            cellHeight: 150,      // 每个格子高度
            offsetX: 0,           // 棋盘在 gamebox 中的 X 偏移
            offsetY: 0,           // 棋盘在 gamebox 中的 Y 偏移
            cells: new Map(),     // 存储格子数据
            pieces: new Map()     // 存储棋子/元件数据
        };

        // 初始化所有格子
        this.initCells();

        console.log('✅ 棋盘系统初始化完成');
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
        // 转换为相对于 gamebox 的坐标
        const localX = x - this.chessboard.offsetX;
        const localY = y - this.chessboard.offsetY;

        // 计算行列
        const col = Math.floor(localX / this.chessboard.cellWidth);
        const row = Math.floor(localY / this.chessboard.cellHeight);

        // 检查是否在有效范围内
        if (col >= 0 && col < this.chessboard.cols &&
            row >= 0 && row < this.chessboard.rows) {
            return this.getCellId(row, col);
        }

        return -1; // 无效位置
    }

    /**
     * 获取格子数据
     */
    getCellData(cellId) {
        return this.chessboard.cells.get(cellId);
    }

    /**
     * 在指定格子放置元件
     */
    placePiece(cellId, piece) {
        const cellData = this.getCellData(cellId);
        if (cellData && cellData.isEmpty) {
            cellData.piece = piece;
            cellData.isEmpty = false;
            this.chessboard.pieces.set(cellId, piece);

            // 设置元件位置
            piece.x = cellData.centerX;
            piece.y = cellData.centerY;

            return true;
        }
        return false;
    }

    /**
     * 移除指定格子的元件
     */
    removePiece(cellId) {
        const cellData = this.getCellData(cellId);
        if (cellData && !cellData.isEmpty) {
            const piece = cellData.piece;
            cellData.piece = null;
            cellData.isEmpty = true;
            this.chessboard.pieces.delete(cellId);

            return piece;
        }
        return null;
    }

    /**
     * 获取相邻格子
     */
    getAdjacentCells(cellId) {
        const { row, col } = this.getRowCol(cellId);
        const adjacent = [];

        // 上下左右四个方向
        const directions = [
            { dr: -1, dc: 0 },  // 上
            { dr: 1, dc: 0 },   // 下
            { dr: 0, dc: -1 },  // 左
            { dr: 0, dc: 1 }    // 右
        ];

        directions.forEach(({ dr, dc }) => {
            const newRow = row + dr;
            const newCol = col + dc;

            if (newRow >= 0 && newRow < this.chessboard.rows &&
                newCol >= 0 && newCol < this.chessboard.cols) {
                adjacent.push(this.getCellId(newRow, newCol));
            }
        });

        return adjacent;
    }


    /**
     * 初始化所有格子
     */
    initCells() {
        for (let row = 0; row < this.chessboard.rows; row++) {
            for (let col = 0; col < this.chessboard.cols; col++) {
                const cellId = this.getCellId(row, col);
                const cellData = {
                    id: cellId,
                    row: row,
                    col: col,
                    x: col * this.chessboard.cellWidth + this.chessboard.offsetX,
                    y: row * this.chessboard.cellHeight + this.chessboard.offsetY,
                    centerX: col * this.chessboard.cellWidth + this.chessboard.cellWidth / 2,
                    centerY: row * this.chessboard.cellHeight + this.chessboard.cellHeight / 2,
                    isEmpty: true,
                    piece: null
                };

                this.chessboard.cells.set(cellId, cellData);
            }
        }
    }


    /**
     * 初始化所有格子
     */
    initCells() {
        for (let row = 0; row < this.chessboard.rows; row++) {
            for (let col = 0; col < this.chessboard.cols; col++) {
                const cellId = this.getCellId(row, col);
                const cellData = {
                    id: cellId,
                    row: row,
                    col: col,
                    x: col * this.chessboard.cellWidth + this.chessboard.offsetX,
                    y: row * this.chessboard.cellHeight + this.chessboard.offsetY,
                    centerX: col * this.chessboard.cellWidth + this.chessboard.cellWidth / 2,
                    centerY: row * this.chessboard.cellHeight + this.chessboard.cellHeight / 2,
                    isEmpty: true,
                    piece: null
                };

                this.chessboard.cells.set(cellId, cellData);
            }
        }
    }


    /**
     * 初始化所有格子
     */
    initCells() {
        for (let row = 0; row < this.chessboard.rows; row++) {
            for (let col = 0; col < this.chessboard.cols; col++) {
                const cellId = this.getCellId(row, col);
                const cellData = {
                    id: cellId,
                    row: row,
                    col: col,
                    x: col * this.chessboard.cellWidth + this.chessboard.offsetX,
                    y: row * this.chessboard.cellHeight + this.chessboard.offsetY,
                    centerX: col * this.chessboard.cellWidth + this.chessboard.cellWidth / 2,
                    centerY: row * this.chessboard.cellHeight + this.chessboard.cellHeight / 2,
                    isEmpty: true,
                    piece: null
                };

                this.chessboard.cells.set(cellId, cellData);
            }
        }
    }



    /**
     * 获取格子数据
     */
    getCellData(cellId) {
        return this.chessboard.cells.get(cellId);
    }


    /**
     * 在指定格子放置元件
     */
    placePiece(cellId, piece) {
        const cellData = this.getCellData(cellId);
        if (cellData && cellData.isEmpty) {
            cellData.piece = piece;
            cellData.isEmpty = false;
            this.chessboard.pieces.set(cellId, piece);

            // 设置元件位置
            piece.x = cellData.centerX;
            piece.y = cellData.centerY;

            return true;
        }
        return false;
    }

    /**
     * 移除指定格子的元件
     */
    removePiece(cellId) {
        const cellData = this.getCellData(cellId);
        if (cellData && !cellData.isEmpty) {
            const piece = cellData.piece;
            cellData.piece = null;
            cellData.isEmpty = true;
            this.chessboard.pieces.delete(cellId);

            return piece;
        }
        return null;
    }

    /**
     * 获取相邻格子
     */
    getAdjacentCells(cellId) {
        const { row, col } = this.getRowCol(cellId);
        const adjacent = [];

        // 上下左右四个方向
        const directions = [
            { dr: -1, dc: 0 },  // 上
            { dr: 1, dc: 0 },   // 下
            { dr: 0, dc: -1 },  // 左
            { dr: 0, dc: 1 }    // 右
        ];

        directions.forEach(({ dr, dc }) => {
            const newRow = row + dr;
            const newCol = col + dc;

            if (newRow >= 0 && newRow < this.chessboard.rows &&
                newCol >= 0 && newCol < this.chessboard.cols) {
                adjacent.push(this.getCellId(newRow, newCol));
            }
        });

        return adjacent;
    }

    /**
     * 初始化游戏数据（已在 init 时传入，此方法保留用于兼容性）
     */
    initGameData() {
        console.log('🎯 游戏数据已在初始化时传入');

        if (!this.gameData) {
            console.warn('⚠️ 没有游戏数据，尝试从 GameServer 获取...');

            // 检查 GameServer 是否可用
            if (!window.GameServer) {
                console.error('❌ GameServer 未加载');
                return;
            }

            // 获取游戏数据
            this.gameData = window.GameServer.getGameData();
            console.log('📊 从 GameServer 获取的游戏数据:', this.gameData);
        }

        console.log('✅ 游戏数据准备完成');
    }

    /**
     * 验证接收到的游戏数据
     */
    verifyGameData() {
        console.log('🔍 验证游戏数据...');
        console.log('📊 完整的 gameData:', JSON.stringify(this.gameData, null, 2));
        console.log('👤 完整的 userStatus:', JSON.stringify(this.userStatus, null, 2));

        if (this.gameData && this.gameData.data) {
            const { eggSeat, eggType, pointSeat } = this.gameData.data;
            console.log('🔍 解析出的数据:');
            console.log('  eggSeat:', eggSeat);
            console.log('  eggType:', eggType);
            console.log('  pointSeat:', pointSeat);

            // 验证数据类型和长度
            if (Array.isArray(eggSeat) && Array.isArray(eggType)) {
                console.log(`✅ 数据验证通过: ${eggSeat.length} 个蛋位置, ${eggType.length} 个蛋类型`);

                // 检查每个蛋的详细信息
                for (let i = 0; i < Math.min(eggSeat.length, eggType.length); i++) {
                    console.log(`  蛋 ${i + 1}: 位置=${eggSeat[i]}, 类型=${eggType[i]}`);
                }
            } else {
                console.error('❌ 数据格式错误: eggSeat 或 eggType 不是数组');
            }
        } else {
            console.error('❌ 没有有效的游戏数据');
        }
    }



    /**
     * 根据游戏数据初始化棋盘
     */
    initGameBoard() {
        if (!this.gameData || !this.gameData.success || !this.gameData.data) {
            console.warn('⚠️ 没有游戏数据，跳过棋盘初始化');
            return;
        }

        const { eggSeat, eggType, pointSeat } = this.gameData.data;

        console.log('🥚 初始化蛋的位置:', eggSeat);
        console.log('🎨 蛋的类型:', eggType);
        console.log('📍 指示位置:', pointSeat);
        console.log('📋 游戏信息:', {
            isNewUser: this.gameData.isNewUser,
            level: this.gameData.level,
            step: this.gameData.step
        });

        // 清空现有棋盘
        this.clearBoard();

        // 放置蛋
        this.placeEggs(eggSeat, eggType);

        // 显示指示位置
        this.showPointSeats(pointSeat);
    }

    /**
     * 清空棋盘
     */
    clearBoard() {
        // 移除所有现有的游戏元件
        this.chessboard.pieces.forEach((piece) => {
            this.gamebox.removeChild(piece);
        });

        // 重置棋盘数据
        this.chessboard.pieces.clear();
        this.chessboard.cells.forEach(cellData => {
            cellData.isEmpty = true;
            cellData.piece = null;
        });

        console.log('🧹 棋盘已清空');
    }

    /**
     * 放置蛋到指定位置
     */
    placeEggs(eggSeat, eggType) {
        if (!eggSeat || !eggType) {
            console.warn('⚠️ 蛋的位置或类型数据无效');
            return;
        }

        console.log('🔍 详细的蛋放置信息:');
        console.log('  eggSeat:', eggSeat);
        console.log('  eggType:', eggType);

        for (let i = 0; i < eggSeat.length; i++) {
            const cellId = eggSeat[i];
            const type = eggType[i] !== undefined ? eggType[i] : 1; // 使用实际类型，包括0

            console.log(`🥚 放置第 ${i + 1} 个蛋: 位置=${cellId}, 类型=${type}`);
            this.createEgg(cellId, type);
        }

        console.log(`🥚 已放置 ${eggSeat.length} 个蛋`);
    }

    /**
     * 创建蛋元件
     */
    createEgg(cellId, type) {
        console.log(`🔍 开始创建蛋: 格子=${cellId}, 类型=${type}`);

        const cellData = this.getCellData(cellId);
        if (!cellData || !cellData.isEmpty) {
            console.warn(`⚠️ 格子 ${cellId} 不可用`);
            return;
        }

        console.log(`📍 格子 ${cellId} 位置: (${cellData.centerX}, ${cellData.centerY})`);

        // 从 flygame 获取蛋元件
        const egg = this.getEggFromFlygame(type);

        if (!egg) {
            console.error(`❌ 无法获取类型 ${type} 的蛋元件`);
            return;
        }

        // 添加类型标识
        egg.eggType = type;
        egg.cellId = cellId;

        // 添加到 gamebox
        this.gamebox.addChild(egg);

        // 放置到格子中
        this.placePiece(cellId, egg);

        console.log(`✅ 成功在格子 ${cellId} 创建了类型 ${type} 的蛋元件: ${egg.constructor.name}`);
    }

    /**
     * 从 exportRoot 获取蛋元件
     */
    getEggFromFlygame(type) {
        console.log(`🔍 从 exportRoot 获取类型 ${type} 的蛋元件...`);

        // 确保类型在有效范围内 (0-6)
        const eggType = Math.max(0, Math.min(6, type));
        const eggName = `egg_mc${eggType}`;

        try {
            // 直接从 exportRoot 中查找蛋元件
            if (this.exportRoot && this.exportRoot.getChildByName) {
                const egg = this.exportRoot.getChildByName(eggName);
                if (egg) {
                    console.log(`✅ 从 exportRoot 获取蛋元件: ${eggName}`);

                    // 克隆元件以避免多次使用同一个实例
                    const clonedEgg = egg.clone ? egg.clone() : this.cloneDisplayObject(egg);
                    return clonedEgg;
                }
            }

            // 如果通过名称找不到，尝试遍历查找
            if (this.exportRoot && this.exportRoot.children) {
                for (let child of this.exportRoot.children) {
                    if (child.name === eggName || child.constructor.name === eggName) {
                        console.log(`✅ 通过遍历从 exportRoot 获取蛋元件: ${eggName}`);
                        const clonedEgg = child.clone ? child.clone() : this.cloneDisplayObject(child);
                        return clonedEgg;
                    }
                }
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
        console.log('🔍 exportRoot 中的可用元件:');
        if (this.exportRoot && this.exportRoot.children) {
            this.exportRoot.children.forEach((child, index) => {
                const name = child.name || 'unnamed';
                const constructor = child.constructor.name || 'unknown';
                console.log(`  ${index}: name="${name}", constructor="${constructor}"`);

                // 特别标记蛋元件
                if (name.includes('egg_mc') || constructor.includes('egg_mc')) {
                    console.log(`    🥚 这是一个蛋元件！`);
                }
            });
        }
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
     * 初始化引导手势
     */
    initGuideGesture() {
        console.log('👆 初始化引导手势...');

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
     * 查找引导手势元件
     */
    findGuideGesture() {
        console.log('🔍 查找引导手势元件 guide_mc...');

        this.guideGesture = null;

        // 方法1: 直接通过名称查找 guide_mc
        if (this.exportRoot && this.exportRoot.getChildByName) {
            this.guideGesture = this.exportRoot.getChildByName('guide_mc');
            if (this.guideGesture) {
                console.log('✅ 通过名称找到引导手势: guide_mc');
            }
        }

        // 方法2: 遍历查找名称为 guide_mc 的元件
        if (!this.guideGesture && this.exportRoot && this.exportRoot.children) {
            for (let child of this.exportRoot.children) {
                const name = child.name || '';
                if (name === 'guide_mc') {
                    this.guideGesture = child;
                    console.log('✅ 通过遍历找到引导手势: guide_mc');
                    break;
                }
            }
        }

        // 方法3: 检查构造函数名称是否包含 guide_mc
        if (!this.guideGesture && this.exportRoot && this.exportRoot.children) {
            for (let child of this.exportRoot.children) {
                const constructorName = child.constructor.name || '';
                if (constructorName.toLowerCase().includes('guide_mc') ||
                    constructorName === 'guide_mc') {
                    this.guideGesture = child;
                    console.log('✅ 通过构造函数名找到引导手势:', constructorName);
                    break;
                }
            }
        }

        // 方法4: 递归查找子元件中的 guide_mc
        if (!this.guideGesture) {
            this.guideGesture = this.findChildByName(this.exportRoot, 'guide_mc');
            if (this.guideGesture) {
                console.log('✅ 通过递归查找找到引导手势: guide_mc');
            }
        }

        if (this.guideGesture) {
            console.log('✅ 找到引导手势元件 guide_mc:', this.guideGesture);
            // 初始时隐藏引导手势
            this.guideGesture.visible = false;
        } else {
            console.warn('⚠️ 未找到引导手势元件 guide_mc');
            // 打印可用的子元件名称用于调试
            this.logAvailableChildren();
        }
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
     * 打印可用的子元件名称（用于调试）
     */
    logAvailableChildren() {
        console.log('🔍 可用的子元件列表:');
        if (this.exportRoot && this.exportRoot.children) {
            this.exportRoot.children.forEach((child, index) => {
                console.log(`  ${index}: name="${child.name || 'unnamed'}", constructor="${child.constructor.name}"`);
            });
        }
    }

    /**
     * 移动引导手势到目标位置
     */
    moveGuideGestureToTarget() {
        if (!this.guideGesture) {
            console.log('📍 没有引导手势，跳过引导');
            return;
        }

        if (!this.pointSeats || this.pointSeats.length === 0) {
            console.log('📍 没有有效的指示位置，隐藏引导手势');
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
            console.log('🎉 所有指示点都已完成，隐藏引导手势');
            this.hideGuideGesture();
            return;
        }

        const targetCellId = this.pointSeats[this.currentPointIndex];
        const cellData = this.getCellData(targetCellId);

        if (cellData) {
            console.log(`👆 移动引导手势到格子 ${targetCellId} (${cellData.centerX}, ${cellData.centerY}) - 第 ${this.currentPointIndex + 1} 个指示点`);

            // 设置引导手势位置
            this.guideGesture.x = cellData.centerX;
            this.guideGesture.y = cellData.centerY;
            this.guideGesture.visible = true;

            // 添加动画效果
            this.animateGuideGesture();

            // 设置等待点击状态
            this.waitingForClick = true;
            this.expectedClickCellId = targetCellId;

            console.log(`⏳ 等待用户点击格子 ${targetCellId}`);
        } else {
            console.warn(`⚠️ 格子 ${targetCellId} 数据不存在`);
        }
    }

    /**
     * 引导手势动画
     */
    animateGuideGesture() {
        if (!this.guideGesture) return;

        console.log('✨ 启动引导手势动画');

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
            console.log('👆 隐藏引导手势');
            createjs.Tween.removeTweens(this.guideGesture);
            this.guideGesture.visible = false;
        }
    }

    /**
     * 显示引导手势
     */
    showGuideGesture() {
        if (this.guideGesture) {
            console.log('👆 显示引导手势');
            this.guideGesture.visible = true;
            this.animateGuideGesture();
        }
    }

    /**
     * 重置引导状态
     */
    resetGuideState() {
        console.log('🔄 重置引导状态');
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
        console.log('🎯 开始引导流程');
        this.resetGuideState();
        this.moveGuideToCurrentPoint();
    }

    /**
     * 更新用户进度（调用 GameServer）
     */
    updateUserProgress(level, step) {
        if (!window.GameServer) {
            console.error('❌ GameServer 未加载');
            return false;
        }

        const result = window.GameServer.updateUserProgress('currentUser', level, step);

        if (result.success) {
            console.log(`📈 用户进度已更新 - 等级: ${level}, 步骤: ${step}`);

            // 更新本地状态
            this.userStatus = window.GameServer.checkUserStatus();

            return true;
        } else {
            console.error('❌ 用户进度更新失败:', result.message);
            return false;
        }
    }

    /**
     * 获取下一关数据
     */
    getNextLevelData() {
        if (!this.gameData || !window.GameServer) {
            console.error('❌ 无法获取下一关数据');
            return null;
        }

        let nextLevel = this.gameData.level;
        let nextStep = this.gameData.step + 1;

        // 检查是否需要升级
        if (this.gameData.isNewUser && nextStep > 7) {
            nextLevel += 1;
            nextStep = 1;
        }

        console.log(`🎯 获取下一关数据 - 等级: ${nextLevel}, 步骤: ${nextStep}`);

        return window.GameServer.getGameData('currentUser', nextLevel, nextStep);
    }

    /**
     * 完成当前关卡
     */
    completeCurrentLevel() {
        if (!this.gameData) {
            console.error('❌ 没有当前关卡数据');
            return false;
        }

        console.log(`🎉 完成关卡 - 等级: ${this.gameData.level}, 步骤: ${this.gameData.step}`);

        // 获取下一关数据
        const nextLevelData = this.getNextLevelData();

        if (nextLevelData && nextLevelData.success) {
            // 更新用户进度
            this.updateUserProgress(nextLevelData.level, nextLevelData.step);

            // 更新游戏数据
            this.gameData = nextLevelData;

            // 重新初始化棋盘
            this.initGameBoard();

            return true;
        } else {
            console.warn('⚠️ 没有更多关卡数据');
            return false;
        }
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

        // 方法1: 直接通过属性名获取
        if (this.exportRoot.gamebox) {
            this.gamebox = this.exportRoot.gamebox;
            console.log('✅ 通过属性名找到 gamebox:', this.gamebox);
            return;
        }

        // 方法2: 遍历子元件查找
        for (let i = 0; i < this.exportRoot.children.length; i++) {
            const child = this.exportRoot.children[i];
            if (child.name === 'gamebox' || child.constructor.name.includes('gamebox')) {
                this.gamebox = child;
                console.log('✅ 通过遍历找到 gamebox:', this.gamebox);
                return;
            }
        }

        // 方法3: 如果 exportRoot 本身就是 gamebox
        if (this.exportRoot.constructor.name.includes('gamebox')) {
            this.gamebox = this.exportRoot;
            console.log('✅ exportRoot 本身就是 gamebox:', this.gamebox);
            return;
        }

        console.warn('⚠️ 未找到 gamebox 元件，将使用 exportRoot 作为游戏容器');
        this.gamebox = this.exportRoot;
    }

    /**
     * 初始化游戏元素
     */
    initGameElements() {
        console.log('🎯 初始化游戏元素...');

        if (!this.gamebox) {
            console.error('❌ gamebox 未找到，无法初始化游戏元素');
            return;
        }

        // 打印 gamebox 的子元件信息
        console.log('📦 gamebox 子元件列表:');
        for (let i = 0; i < this.gamebox.children.length; i++) {
            const child = this.gamebox.children[i];
            console.log(`  - [${i}] ${child.name || child.constructor.name}:`, child);
        }

        // 这里可以获取游戏中的具体元件
        // 例如：
        // this.player = this.gamebox.player;
        // this.enemies = this.gamebox.enemies;
        // this.ui = this.gamebox.ui;

        console.log('✅ 游戏元素初始化完成');
    }

    /**
     * 设置事件监听
     */
    setupEventListeners() {
        console.log('👂 设置事件监听...');

        // 启用舞台交互
        if (this.stage) {
            createjs.Touch.enable(this.stage);
            this.stage.enableMouseOver(10);
            this.stage.mouseMoveOutside = true;
        }

        // 添加点击事件监听
        if (this.gamebox) {
            this.gamebox.addEventListener('click', this.onGameboxClick.bind(this));
        }

        // 添加键盘事件监听
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));

        console.log('✅ 事件监听设置完成');
    }

    /**
     * 开始游戏
     */
    startGame() {
        console.log('🚀 游戏开始！');

        this.gameState = 'playing';

        // 播放背景音乐（如果有的话）
        if (this.engine && this.loadedSounds.has('bgm')) {
            this.engine.playSound('bgm', { loop: -1, volume: 0.3 });
        }

        // 开始游戏循环
        this.gameLoop();
    }

    /**
     * 游戏循环
     */
    gameLoop() {
        if (this.gameState === 'playing') {
            // 游戏逻辑更新
            this.updateGame();

            // 继续下一帧
            requestAnimationFrame(() => this.gameLoop());
        }
    }

    /**
     * 更新游戏逻辑
     */
    updateGame() {
        // 这里添加游戏的更新逻辑
        // 例如：移动角色、检测碰撞、更新UI等
    }

    /**
     * gamebox 点击事件处理
     */
    /**
    * gamebox 点击事件处理
    */
    onGameboxClick(event) {
        console.log('🖱️ gamebox 被点击:', event);

        // 获取点击位置相对于 gamebox 的坐标
        const localX = event.localX || event.stageX;
        const localY = event.localY || event.stageY;

        console.log(`📍 点击坐标: (${localX}, ${localY})`);

        // 获取被点击的格子ID
        const cellId = this.getCellIdFromPosition(localX, localY);

        if (cellId >= 0) {
            const cellData = this.getCellData(cellId);
            const { row, col } = this.getRowCol(cellId);
            console.log(`🎯 点击格子 ${cellId} (行:${row}, 列:${col}):`, cellData);

            // 处理格子点击逻辑
            this.handleCellClick(cellId, cellData);
        } else {
            console.log('🖱️ 点击了棋盘外区域');
        }

        // 播放点击音效
        if (this.engine && this.loadedSounds.has('click')) {
            this.engine.playSound('click');
        }
    }

    /**
     * 处理格子点击
     */
    handleCellClick(cellId, cellData) {
        const { row, col } = this.getRowCol(cellId);

        // 检查是否在等待引导点击
        if (this.waitingForClick && this.expectedClickCellId === cellId) {
            console.log(`✅ 用户正确点击了引导位置 ${cellId}`);
            this.onGuideClickSuccess(cellId);
            return;
        }

        // 普通点击处理
        if (cellData.isEmpty) {
            console.log(`📍 格子 ${cellId} (行:${row}, 列:${col}) 是空的，位置: (${cellData.centerX}, ${cellData.centerY})`);
            // 创建测试元件
            this.createTestPiece(cellId);
        } else {
            console.log(`🎯 格子 ${cellId} (行:${row}, 列:${col}) 有元件:`, cellData.piece);
            // 选中或移除元件
            this.selectOrRemovePiece(cellId);
        }
    }

    /**
     * 引导点击成功处理
     */
    onGuideClickSuccess(cellId) {
        console.log(`🎯 引导点击成功: 格子 ${cellId}`);

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
     * 创建测试元件（用于调试棋盘功能）
     */
    createTestPiece(cellId) {
        const cellData = this.getCellData(cellId);
        if (!cellData || !cellData.isEmpty) return;

        // 随机选择一个蛋类型 (1-6)
        const randomType = Math.floor(Math.random() * 6) + 1;

        // 使用 createEgg 方法创建测试蛋
        this.createEgg(cellId, randomType);

        console.log(`✨ 在格子 ${cellId} 创建了测试蛋元件，类型: ${randomType}`);
    }

    /**
     * 选中或移除元件
     */
    selectOrRemovePiece(cellId) {
        const cellData = this.getCellData(cellId);
        if (!cellData || cellData.isEmpty) return;

        const piece = cellData.piece;

        // 移除元件
        this.gamebox.removeChild(piece);
        this.removePiece(cellId);

        console.log(`🗑️ 移除了格子 ${cellId} 的元件`);
    }

    /**
     * 键盘按下事件处理
     */
    onKeyDown(event) {
        console.log('⌨️ 键盘按下:', event.key);

        // 处理键盘输入
        switch (event.key) {
            case ' ': // 空格键
                event.preventDefault();
                this.pauseGame();
                break;
            case 'Escape': // ESC键
                this.pauseGame();
                break;
        }
    }

    /**
     * 键盘释放事件处理
     */
    onKeyUp() {
        // 处理键盘释放事件
        // console.log('⌨️ 键盘释放:', event.key);
    }

    /**
     * 暂停/恢复游戏
     */
    pauseGame() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            console.log('⏸️ 游戏暂停');
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            console.log('▶️ 游戏恢复');
            this.gameLoop();
        }
    }

    /**
     * 结束游戏
     */
    endGame() {
        this.gameState = 'ended';
        console.log('🏁 游戏结束');

        // 停止背景音乐
        if (this.engine) {
            this.engine.stopSound('bgm');
        }
    }

    /**
     * 获取游戏状态
     */
    getGameState() {
        return this.gameState;
    }

    /**
     * 获取 gamebox 元件
     */
    getGameboxElement() {
        return this.gamebox;
    }
}

// 直接创建全局对象，避免类名冲突
console.log('🏗️ 创建 GameScense 实例...');
window.GameScense = new GameScense();
console.log('✅ GameScense 实例创建完成:', window.GameScense);
console.log('🔍 GameScense.init 方法:', typeof window.GameScense.init);