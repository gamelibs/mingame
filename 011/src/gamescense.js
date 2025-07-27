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

        // 游戏运行状态
        this.gameRunState = 'init'; // init, playing, paused, ended
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

        // 开始选择
        this.startMc = null;

        // 元件移动相关
        this.selectedPiece = null;        // 当前选中的元件
        this.selectedCellId = null;       // 选中元件所在的格子ID
        this.isWaitingForTarget = false;  // 是否等待选择目标位置

        // 游戏数据状态
        this.gameDataState = {
            cells: {},           // 格子状态 {cellId: {hasEgg: boolean, eggType: number, piece: object}}
            selectedEgg: null,   // 当前选中的蛋 {cellId, eggType, isSelected}
            score: 0,           // 当前分数
            isProcessing: false // 是否正在处理操作
        };
    }

    /**
     * 初始化游戏场景
     * @param {Object} gameData - 游戏数据对象
     */
    async init(gameData) {
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

            // 异步初始化流程
            await this.initializeAsync();

            // 初始化引导手势
            // this.initGuideGesture();


            // 根据用户类型决定是否生成蛋
            // this.handlePostInitialization();

            this.isInitialized = true;
            console.log('✅ GameScense 初始化完成');

        } catch (error) {
            console.error('❌ GameScense 初始化失败:', error);
        }
    }

    // 删除了前端棋盘初始化，统一由后端 GameServer 提供

    /**
     * 异步初始化流程
     */
    async initializeAsync() {
        console.log('🔄 开始异步初始化...');

        try {

            this.selectDifficulty();
            // 1. 从 GameServer 获取地图配置
            // await this.initMapFromServer();

            // 2. 获取游戏场景中的 gamebox 元件
            // this.getGamebox();

            // 3. 初始化游戏元素
            // this.initGameElements();

            // 4. 设置事件监听
            // this.setupEventListeners();

            // 5. 验证接收到的数据
            // this.verifyGameData();

            // 6. 根据游戏配置初始化棋盘内容
            // this.initGameBoard();

            console.log('✅ 异步初始化完成');

        } catch (error) {
            console.error('❌ 异步初始化失败:', error);
            throw error;
        }
    }


    selectDifficulty() {
        console.log('🎮 选择游戏难度...');
        this.startMc = utile.findMc(this.exportRoot, 'mc_select');

        if (this.startMc) {
            console.log('✅ 找到难度选择界面');

            // 显示难度选择界面
            this.startMc.visible = true;

            // 查找三个难度按钮
            const btnEasy = utile.findMc(this.startMc, 'btn_e');
            const btnNormal = utile.findMc(this.startMc, 'btn_n');
            const btnHard = utile.findMc(this.startMc, 'btn_h');

           this.stage.on('click', (event) => {
        const target = event.target;
        console.log('🎯 舞台点击事件，目标:', target);
        console.log('🎯 目标名称:', target.name);
        console.log('🎯 目标父级:', target.parent);
        
        // 向上查找按钮容器
        const clickedButton = this.findButtonContainer(target, [btnEasy, btnNormal, btnHard]);
        
        if (clickedButton === btnEasy) {
            console.log('🟢 检测到简单难度按钮点击');
            this.onDifficultySelected('easy');
        } else if (clickedButton === btnNormal) {
            console.log('🟡 检测到普通难度按钮点击');
            this.onDifficultySelected('normal');
        } else if (clickedButton === btnHard) {
            console.log('🔴 检测到困难难度按钮点击');
            this.onDifficultySelected('hard');
        } else {
            console.log('🎯 点击了其他区域，目标路径:', this.getTargetPath(target));
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
                console.log(`✅ 找到按钮容器: ${button.name} (向上${i}层)`);
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
        console.log(`🎯 用户选择难度: ${difficulty}`);

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
    /**
     * 从 GameServer 初始化地图配置
     */
    async initMapFromServer() {
        console.log('🗺️ 从 GameServer 获取地图配置...');

        try {
            // 等待 GameServer 地图系统初始化完成
            if (!window.GameServer.mapState.isInitialized) {
                console.log('⏳ 等待 GameServer 地图系统初始化...');
                // 可以添加轮询或事件监听来等待初始化完成
                await this.waitForMapInitialization();
            }

            // 获取地图配置
            const mapInfo = window.GameServer.getMapStateInfo();
            console.log('📊 地图配置信息:', mapInfo);

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

            console.log(`✅ 地图配置获取完成: ${this.chessboard.rows}x${this.chessboard.cols}`);

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
        console.log(`🚶 开始寻路移动: ${fromCellId} -> ${toCellId}`);

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
        const moveSpeed = 200; // 每步移动时间(毫秒)

        const moveToNextCell = () => {
            // 播放点击音效

            if (currentIndex >= pathCellIds.length) {
                console.log('✅ 路径移动完成');
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
                    .to({ x: cellData.centerX, y: cellData.centerY }, moveSpeed, createjs.Ease.quadOut)
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
        console.log(`🔍 计算格子位置: 点击坐标(${x}, ${y})`);

        // 获取偏移量（如果没有设置则为0）
        const offsetX = this.chessboard.offsetX || 0;
        const offsetY = this.chessboard.offsetY || 0;

        // 转换为相对于棋盘的坐标
        const localX = x - offsetX;
        const localY = y - offsetY;

        console.log(`📐 转换后坐标: (${localX}, ${localY}), 偏移量: (${offsetX}, ${offsetY})`);
        console.log(`📏 格子尺寸: ${this.chessboard.cellWidth} x ${this.chessboard.cellHeight}`);

        // 计算行列
        const col = Math.floor(localX / this.chessboard.cellWidth);
        const row = Math.floor(localY / this.chessboard.cellHeight);

        console.log(`🎯 计算得到: 行${row}, 列${col}`);

        // 检查是否在有效范围内
        if (col >= 0 && col < this.chessboard.cols &&
            row >= 0 && row < this.chessboard.rows) {
            const cellId = this.getCellId(row, col);
            console.log(`✅ 有效格子ID: ${cellId}`);
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
     * 从 exportRoot 获取蛋元件
     */
    getEggFromFlygame(type) {
        console.log(`🔍 从 exportRoot 获取类型 ${type} 的蛋元件...`);

        // 确保类型在有效范围内 (0-6)
        const eggType = Math.max(0, Math.min(6, type));
        const eggName = `egg_mc${eggType}`;

        try {
            // 使用 utile 工具类查找蛋元件
            const egg = utile.findMc(this.exportRoot, eggName);

            if (egg) {
                console.log(`✅ 使用 utile.findMc 找到蛋元件: ${eggName}`);

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
        utile.logAvailableChildren(this.exportRoot);
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

        // 检查用户类型，决定是否需要引导
        const shouldShowGuide = this.shouldShowGuideForUser();

        if (!shouldShowGuide) {
            console.log('👤 老用户无需引导，跳过引导功能');
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
            console.log(`🔍 用户类型检查: ${isNewUser ? '新用户' : '老用户'}`);
            return isNewUser;
        }

        // 如果没有用户数据，默认显示引导（安全起见）
        console.log('⚠️ 无法确定用户类型，默认显示引导');
        return true;
    }

    /**
     * 处理初始化后的逻辑
     */
    handlePostInitialization() {
        const isNewUser = this.gameData ? this.gameData.isNewUser : true;

        this.startBackgroundMusic();

        if (isNewUser) {
            // 新用户：等待引导完成后生成蛋
            if (this.pointSeats.length === 0) {
                // 没有引导配置，直接生成蛋
                console.log('📍 新用户无引导配置，直接生成蛋');
                setTimeout(() => {
                    this.generateNewEggs();
                }, 1000);
            } else {
                console.log('📖 新用户等待引导完成后生成蛋');
            }
        } else {
            // 老用户：直接生成蛋，不需要引导
            console.log('👤 老用户直接生成蛋');
            setTimeout(() => {
                this.generateOldUserEggs();
            }, 1000);
        }
    }

    /**
     * 为老用户生成蛋（使用服务器返回的数据）
     */
    async generateOldUserEggs() {
        console.log('🥚 为老用户生成蛋...');

        try {
            // 从游戏数据中获取蛋配置
            if (this.gameData && this.gameData.data) {
                const { eggSeat, eggType } = this.gameData.data;

                if (eggSeat && eggType && eggSeat.length === eggType.length) {
                    console.log(`📊 使用服务器数据生成蛋: 位置[${eggSeat}], 类型[${eggType}]`);

                    // 根据服务器数据创建蛋
                    for (let i = 0; i < eggSeat.length; i++) {
                        await this.createEggAtPosition(eggSeat[i], eggType[i]);
                    }

                    utile.__sdklog(`✅ 成功为老用户生成 ${eggSeat.length} 个蛋`, this.chessboard);
                } else {
                    console.warn('⚠️ 服务器蛋数据格式错误，使用默认生成');
                    this.generateNewEggs();
                }
            } else {
                console.warn('⚠️ 没有游戏数据，使用默认生成');
                this.generateNewEggs();
            }
        } catch (error) {
            console.error('❌ 老用户蛋生成失败:', error);
            this.generateNewEggs();
        }
    }

    /**
     * 查找引导手势元件
     */
    findGuideGesture() {
        console.log('🔍 查找引导手势元件 guide_mc...');

        // 使用 utile 工具类查找元件
        this.guideGesture = utile.findMc(this.exportRoot, 'guide_mc');

        if (this.guideGesture) {
            console.log('✅ 找到引导手势元件 guide_mc:', this.guideGesture);
            // 初始时隐藏引导手势
            this.guideGesture.visible = false;
        } else {
            console.warn('⚠️ 未找到引导手势元件 guide_mc');
            // 打印可用的子元件名称用于调试
            console.log('📋 打印可用元件列表以便调试:');
            utile.logAvailableChildren(this.exportRoot);
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
            this.completeGuideProcess();
            return;
        }

        const targetCellId = this.pointSeats[this.currentPointIndex];
        const cellData = this.getCellData(targetCellId);

        if (cellData) {
            console.log(`👆 移动引导手势到格子 ${targetCellId} (${cellData.centerX}, ${cellData.centerY}) - 第 ${this.currentPointIndex + 1} 个指示点`);

            // 计算引导手势的正确位置
            const guidePosition = this.calculateGuidePosition(cellData);

            console.log(`📍 引导手势坐标调整: 格子坐标(${cellData.centerX}, ${cellData.centerY}) -> 引导坐标(${guidePosition.x}, ${guidePosition.y})`);

            // 设置引导手势位置
            this.guideGesture.x = guidePosition.x;
            this.guideGesture.y = guidePosition.y;
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
     * 计算引导手势的正确位置
     */
    calculateGuidePosition(cellData) {
        if (!this.guideGesture || !this.gamebox) {
            // 如果没有 gamebox 或引导手势，直接使用格子坐标
            return { x: cellData.centerX, y: cellData.centerY };
        }

        // 检查引导手势的父容器
        const guideParent = this.guideGesture.parent;
        console.log(`🔍 引导手势父容器:`, guideParent?.constructor?.name || 'unknown');
        console.log(`🔍 gamebox 容器:`, this.gamebox?.constructor?.name || 'unknown');

        // 如果引导手势在 exportRoot 中，而格子坐标是相对于 gamebox 的
        if (guideParent === this.exportRoot && this.gamebox !== this.exportRoot) {
            // 需要将 gamebox 相对坐标转换为 exportRoot 绝对坐标
            const gameboxX = this.gamebox.x || 0;
            const gameboxY = this.gamebox.y || 0;

            console.log(`📐 坐标转换: gamebox偏移(${gameboxX}, ${gameboxY})`);

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
     * 完成引导流程
     */
    completeGuideProcess() {
        console.log('🎊 引导流程完成！');

        // 重置所有引导相关状态
        this.resetGuideState();

        // 清除选中状态（如果有）
        this.clearSelection();

        // 引导完成后生成蛋
        setTimeout(() => {
            console.log('📖 新用户引导完成，生成蛋');
            this.generateNewEggs();
        }, 1000);

        // 现在用户可以自由操作元件了
        console.log('💡 现在你可以点击蛋选中它，然后点击空格子移动蛋进行合成！');
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

        // 使用 utile.findMc 统一查找元件
        this.gamebox = utile.findMc(this.exportRoot, 'gamebox');

        if (this.gamebox) {
            console.log('✅ 使用 utile.findMc 找到 gamebox:', this.gamebox);
            console.log(`📐 gamebox 位置: (${this.gamebox.x || 0}, ${this.gamebox.y || 0})`);
            console.log(`📏 gamebox 尺寸: ${this.gamebox.getBounds ? this.gamebox.getBounds() : 'unknown'}`);
            return;
        }

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
            // console.log(`  - [${i}] ${child.name || child.constructor.name}:`, child);
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
            const { row, col } = this.getRowCol(cellId);
            console.log(`🎯 点击格子 ${cellId} (行:${row}, 列:${col})`);

            // 处理格子点击逻辑
            this.handleCellClick(cellId);
        } else {
            console.log('🖱️ 点击了棋盘外区域');
        }

        // 播放点击音效
        if (this.engine && this.loadedSounds.has('popo')) {
            this.engine.playSound('popo');
        }
    }

    /**
     * 处理格子点击（蛋选择交互）
     */
    async handleCellClick(cellId) {
        console.log(`🖱️ 处理格子点击: ${cellId}`);

        // 检查是否在等待引导点击
        if (this.waitingForClick && this.expectedClickCellId === cellId) {
            console.log(`✅ 用户正确点击了引导位置 ${cellId}`);
            this.onGuideClickSuccess(cellId);
            return;
        }

        // 调用 GameServer 处理点击逻辑
        try {
            const result = window.GameServer.processEggClick(cellId);
            console.log('🎮 点击处理结果:', result);

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
        console.log(`🎯 选择蛋: 格子 ${result.cellId}, 类型 ${result.eggType}`);

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
        console.log(`🚶 移动蛋: ${result.fromCellId} -> ${result.toCellId}`);

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
                console.log('✅ 蛋移动完成，开始同步映射关系');

                // 检查是否有合成
                if (result.synthesis && result.synthesis.canSynthesize) {
                    console.log('🎉 移动后可以合成，开始合成动画');
                    console.log('🔍 合成数据详情:', result.synthesis);
                    console.log('🔍 matches数组:', result.synthesis.matches);
                    console.log('🔍 删除的位置:', result.positionsToDelete);

                    utile.__sdklog('合成数据详情:', result.synthesis);
                    return this.executeSynthesisAnimation(result.synthesis, result.positionsToDelete);
                } else {
                    this.chessboard.pieces.set(result.toCellId, piece);

                    utile.__sdklog(`📍 更新目标位置映射: 格子${result.toCellId}`);
                }
                return Promise.resolve();
            })
            .then(() => {
                // 如果有新蛋数据，创建新蛋
                if (result.newEggs && result.newEggs.length > 0) {
                    console.log('🥚 创建新蛋');
                    const createEggPromises = result.newEggs.map(eggData =>
                        this.createEggAtPosition(eggData.cellId, eggData.eggType)
                    );
                    return Promise.all(createEggPromises);
                }
                return Promise.resolve();
            })
            .then(() => {
                // 打印当前前端映射状态
                this.printCurrentPiecesMapping();
                // 清除选中状态
                this.gameDataState.selectedEgg = null;
                this.selectedPiece = null;
                this.selectedCellId = null;
                console.log('✅ 所有步骤执行完成');
            })
            .catch((error) => {
                console.error('❌ 执行过程中出现错误:', error);
            });

    }

    /**
     * 处理步骤3：取消选择
     */
    async handleStep3(result) {
        console.log(`🔄 取消选择: 格子 ${result.cellId}`);

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
        console.log(`🔄 切换选择: ${result.oldCellId} -> ${result.newCellId}`);

        // 移除旧选中效果
        if (this.selectedPiece) {
            this.removeSelectionEffect(this.selectedPiece);
        }

        // 直接从前端映射获取新蛋元件
        const newPiece = this.chessboard.pieces.get(result.newCellId);
        if (newPiece) {
            console.log(`✅ 找到新选择的蛋: 格子${result.newCellId}, 类型${newPiece.eggType}`);

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
            console.log('🔍 当前前端映射状态:');
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
        console.log(`🚶 执行蛋移动动画: ${fromCellId} -> ${toCellId}`);
        console.log('🔍 原始路径数据:', path);

        // 修正路径转换：A* 返回的是 {x: row, y: col} 格式
        const pathCellIds = path.map(step => this.getCellId(step.x, step.y));
        console.log('🔍 转换后的路径格子ID:', pathCellIds);

        return new Promise((resolve) => {
            // 只更新映射关系，不移除元件
            if (!isclear) {
                this.chessboard.pieces.delete(fromCellId);
            }
            // 执行路径动画
            this.animateAlongPath(piece, pathCellIds, (success) => {
                console.log('🔍 动画完成，成功:', success);


                if (!isclear) {

                    this.chessboard.pieces.set(toCellId, piece);
                    piece.cellId = toCellId; // 更新元件的cellId属性
                    console.log(`📍 添加目标位置映射: 格子${toCellId}`);
                }

                console.log('✅ 蛋移动完成');
                resolve();
            });
        });
    }


    /**
     * 执行合成动画
     * @param {Object} synthesisData - 合成数据
     */
    async executeSynthesisAnimation(synthesisData, positionsToDelete) {
        console.log('🎬 开始执行合成动画...');

        const { matches, eggType, newEggType, synthesisPosition, score } = synthesisData;

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
                console.log(`🥚 找到参与合成的蛋: 格子${cellId} ${cellId === synthesisPosition ? '(目标位置)' : ''}, 元件名称: ${piece.name || 'unnamed'}, 元件ID: ${piece.id || 'no-id'}`);
            } else {
                console.warn(`⚠️ 格子 ${cellId} 没有找到对应的蛋元件`);
            }
        }

        utile.__sdklog2(`🔍 总共 ${allEggsToSynthesize.length} 个蛋参与合成`);


        return this.playEggCollectionAnimation(allEggsToSynthesize, synthesisPosition)
            .then(() => {
                // 延迟后创建合成蛋
                return new Promise((resolve) => {
                    setTimeout(() => {
                        this.createSynthesizedEgg(synthesisPosition, newEggType)
                            .then(() => {
                                resolve();
                            });
                    }, 0);
                });
            })
            .then(() => {
                // 更新分数
                this.updateScore(score);
                console.log(`✅ 合成完成！${window.GameServer.getEggTypeName(eggType)} -> ${window.GameServer.getEggTypeName(newEggType)}`);
            });
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

        console.log(`🎯 合成目标位置 ${targetCellId}: (${targetPosition.centerX}, ${targetPosition.centerY})`);
        console.log(`🔍 要处理的蛋数量: ${eggs.length}`);

        const promises = [];
        // 播放合成音乐
        if (this.engine && this.loadedSounds.has('goodmin')) {
            this.engine.playSound('goodmin');
        }
        for (const eggData of eggs) {
            if (eggData.piece) {
                console.log(`🔍 处理格子 ${eggData.cellId} 的蛋，元件名称: ${eggData.piece.name || 'unnamed'}`);

                if (eggData.isTarget) {
                    // 目标位置的蛋：直接删除
                    console.log(`🎯 目标位置蛋 ${eggData.cellId} 直接删除`);

                    // 确保从父容器中移除
                    if (eggData.piece.parent) {
                        eggData.piece.parent.removeChild(eggData.piece);
                        utile.__sdklog3(`🗑️ 从父容器移除格子 ${eggData.cellId} 的蛋`);
                    }

                    // 从映射中删除
                    this.chessboard.pieces.delete(eggData.cellId);
                    console.log(`🗑️ 删除目标位置蛋映射: 格子${eggData.cellId}`);
                } else {
                    // 非目标位置的蛋：移动到目标位置后删除
                    console.log(`🚶 蛋从格子 ${eggData.cellId} 移动到目标位置 ${targetCellId}`);

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
                                console.log(`🚶 格子 ${eggData.cellId} 的蛋移动完成`);

                                // 确保从父容器中移除
                                if (eggData.piece.parent) {
                                    eggData.piece.parent.removeChild(eggData.piece);
                                }

                                this.chessboard.pieces.delete(eggData.cellId);
                                utile.__sdklog3(`🗑️ 删除移动后的蛋: 格子${eggData.cellId}`);
                                resolve();
                            });
                    });

                    promises.push(promise);
                }
            }
        }

        // 等待所有移动动画完成
        await Promise.all(promises);


        utile.__sdklog2('📦 蛋收集动画完成，所有参与合成的蛋已删除');
    }

    /**
 * 创建合成后的新蛋
 * @param {number} cellId - 合成位置
 * @param {number} newEggType - 新蛋类型
 */
    async createSynthesizedEgg(cellId, newEggType) {
        console.log(`🥚 在格子 ${cellId} 创建类型 ${newEggType} 的合成蛋 (egg_mc${newEggType})`);

        // 获取正确的位置坐标
        const position = this.getCellPosition(cellId);
        if (!position) {
            console.error(`❌ 无法获取格子 ${cellId} 的位置坐标`);
            return;
        }

        utile.__sdklog(`📍 合成蛋位置: 格子${cellId} -> (${position.centerX}, ${position.centerY})`);

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

            console.log(`✅ 成功创建 ${this.getEggTypeName(newEggType)} 蛋 (egg_mc${newEggType})`);
        }
    }

    /**
     * 生成新蛋
     */
    // async generateNewEggs() {
    //     console.log('🎲 生成新蛋...');

    //     try {
    //         // 调用 GameServer 生成随机蛋
    //         const newEggs = window.GameServer.generateRandomEggs(this.gameDataState, 3);

    //         // 在前端创建这些蛋
    //         for (const eggData of newEggs) {
    //             await this.createEggAtPosition(eggData.cellId, eggData.eggType);
    //         }

    //         console.log(`✅ 成功生成 ${newEggs.length} 个新蛋`, this.chessboard.pieces);
    //     } catch (error) {
    //         console.error('❌ 生成新蛋失败:', error);
    //     }
    // }

    /**
     * 在指定位置创建蛋
     * @param {number} cellId - 格子ID
     * @param {number} eggType - 蛋类型
     */
    async createEggAtPosition(cellId, eggType) {
        const egg = this.getEggFromFlygame(eggType);
        if (egg) {
            egg.eggType = eggType;
            egg.cellId = cellId;

            // 添加到 gamebox
            this.gamebox.addChild(egg);
            // 维护前端映射
            this.chessboard.pieces.set(cellId, egg);
            utile.__sdklog(`📍 添加新蛋到映射: ********************格子${cellId}`);
            this.chessboard.pieces.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            });
            // 放置到格子中
            this.moveElementToPosition(egg, cellId);

            // 播放出现动画
            this.playEggAppearAnimation(egg);
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

        console.log(`📍 移动元件到格子 ${cellId}`);
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
     * 引导点击成功处理
     */
    onGuideClickSuccess(cellId) {
        console.log(`🎯 引导点击成功: 格子 ${cellId}`);

        // 取消等待状态
        this.waitingForClick = false;
        this.expectedClickCellId = null;

        // 检查是否是第一个指示点（选中元件）
        if (this.currentPointIndex === 0) {
            this.selectPieceAtCell(cellId);
        } else {
            // 后续指示点作为移动目标
            this.moveSelectedPieceToTarget(cellId);
        }

        // 移动到下一个指示点
        this.currentPointIndex++;

        // 延迟一下再移动到下一个位置，让用户看到反馈
        setTimeout(() => {
            this.moveGuideToCurrentPoint();
        }, 500);
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

        console.log(`✅ 选中了格子 ${cellId} 的元件:`, this.selectedPiece.constructor.name);

        // 添加选中效果
        this.addSelectionEffect(this.selectedPiece);
    }



    /**
     * 添加选中效果
     */
    addSelectionEffect(piece) {
        if (!piece) return;

        // 创建选中指示器（发光效果）
        const indicator = new createjs.Shape();
        indicator.graphics.setStrokeStyle(3).beginStroke('#FFD700').drawCircle(0, 0, 80);
        indicator.x = piece.x;
        indicator.y = piece.y;
        indicator.name = 'selectionIndicator';

        // 添加到 gamebox
        this.gamebox.addChild(indicator);

        // 添加闪烁动画
        createjs.Tween.get(indicator, { loop: true })
            .to({ alpha: 0.3 }, 600)
            .to({ alpha: 1 }, 600);

        // 保存指示器引用
        piece.selectionIndicator = indicator;

        console.log('✨ 添加了选中效果');
    }

    /**
     * 移除选中效果
     */
    removeSelectionEffect(piece) {
        if (!piece || !piece.selectionIndicator) return;

        // 停止动画
        createjs.Tween.removeTweens(piece.selectionIndicator);

        // 移除指示器
        this.gamebox.removeChild(piece.selectionIndicator);
        piece.selectionIndicator = null;

        console.log('🗑️ 移除了选中效果');
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

        console.log('🔄 清除了选中状态');
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
        console.log(`🎊 合成成功！获得 ${eggName} 蛋 (egg_mc${newEggType})`);

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
        return new Promise((resolve) => {
            // 缩放弹出效果
            newEgg.scaleX = 0.1;
            newEgg.scaleY = 0.1;

            createjs.Tween.get(newEgg)
                .to({ scaleX: 1.2, scaleY: 1.2 }, 300, createjs.Ease.backOut)
                .to({ scaleX: 1, scaleY: 1 }, 200, createjs.Ease.backIn)
                .call(() => {
                    console.log('✨ 合成特效播放完成');
                    resolve();
                });

            // 添加粒子效果
            this.addSynthesisEffect(newEgg);
        });
    }

    /**
     * 更新分数
     * @param {number} eggCount - 合成的蛋数量
     * @param {number} eggType - 蛋类型
     */
    updateScore(score) {
        // 确保分数是数字
        const validScore = typeof score === 'number' && !isNaN(score) ? score : 0;

        if (!this.gameDataState.score) {
            this.gameDataState.score = 0;
        }

        this.gameDataState.score += validScore;
        console.log(`📊 获得分数: +${validScore}, 总分: ${this.gameDataState.score}`);

        // 这里可以更新UI显示
        // this.updateScoreDisplay(this.gameDataState.score);
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

    /**
     * 开始播放背景音乐
     */
    startBackgroundMusic() {
        if (this.engine && this.loadedSounds.has('bgm')) {
            console.log('🎵 开始播放背景音乐');
            this.engine.playSound('bgm', { loop: -1, volume: 0.5 });
        } else {
            console.warn('⚠️ 背景音乐未加载或引擎未初始化');
        }
    }

    /**
 * 打印当前前端蛋映射状态
 */
    printCurrentPiecesMapping() {
        console.log('🗺️ 当前前端蛋映射状态:');
        const mappingArray = [];

        this.chessboard.pieces.forEach((piece, cellId) => {
            mappingArray.push({
                cellId: parseInt(cellId),
                eggType: piece.eggType,
                elementName: piece.name || 'unnamed',
                elementId: piece.id || 'no-id'
            });
            console.log(`  格子${cellId}: 蛋类型${piece.eggType} ${this.getEggTypeName(piece.eggType)}, 元件名称: ${piece.name || 'unnamed'}`);
        });

        console.log(`📊 前端映射统计: 总共${mappingArray.length}个蛋元件`);

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
}

// 直接创建全局对象，避免类名冲突
console.log('🏗️ 创建 GameScense 实例...');
window.GameScense = new GameScense();
console.log('✅ GameScense 实例创建完成:', window.GameScense);
console.log('🔍 GameScense.init 方法:', typeof window.GameScense.init);