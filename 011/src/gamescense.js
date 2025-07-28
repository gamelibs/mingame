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

        this.difficultySelectionEnabled = false;

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

            // this.showFailure();
            this.hideFailure();

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

            // 检查是否开启难度选择
            if (this.difficultySelectionEnabled) {
                console.log('🎮 开启了难度选择，等待用户选择难度');
                // 默认调用 SelectLine 模块处理难度选择
                this.initDifficultySelection();
            } else {
                console.log('🎮 未开启难度选择，使用默认中等难度');
                // 直接使用中等难度获取游戏数据
                this.selectedDifficulty = 'normal';
                await this.loadGameDataByDifficulty('normal');
                this.continueInitialization();
            }

            console.log('✅ 异步初始化完成');

        } catch (error) {
            console.error('❌ 异步初始化失败:', error);
            throw error;
        }
    }


    /**
     * 初始化难度选择模块
     */
    initDifficultySelection() {
        console.log('🎮 初始化难度选择模块...');

        // 先隐藏选择难度UI
        this.hideDifficultyUI();

        const gameData = {
            engine: this.engine,
            stage: this.stage,
            exportRoot: this.exportRoot,
            loadedSounds: this.loadedSounds
        };

        // 初始化 SelectLine 模块
        if (window.SelectLine) {
            window.SelectLine.init(gameData, (difficulty) => {
                this.onDifficultySelected(difficulty);
            });
        } else {
            console.warn('⚠️ SelectLine 模块未找到，使用默认难度');
            this.onDifficultySelected('normal');
        }
    }

    /**
     * 难度选择完成回调
     */
    async onDifficultySelected(difficulty) {
        console.log(`🎯 接收到选择的难度: ${difficulty}`);
        this.selectedDifficulty = difficulty;

        try {
            // 根据选择的难度获取游戏数据
            await this.loadGameDataByDifficulty(difficulty);

            // 继续游戏初始化流程
            this.continueInitialization();
        } catch (error) {
            console.error('❌ 根据难度获取游戏数据失败:', error);
            // 使用默认数据继续
            this.continueInitialization();
        }
    }


    /**
 * 根据难度获取游戏数据
 * @param {string} difficulty - 难度等级 ('easy', 'normal', 'hard')
 */
    async loadGameDataByDifficulty(difficulty) {
        console.log(`📊 根据难度 ${difficulty} 获取游戏数据...`);

        // try {
        //     // 根据难度映射到游戏参数
        //     const difficultyParams = this.getDifficultyParams(difficulty);
        //     console.log(`🎯 难度参数:`, difficultyParams);

        //     // 从 GameServer 获取游戏配置数据
        //     const gameConfigData = window.GameServer.getGameData(
        //         this.userStatus,
        //         'currentUser',
        //         difficultyParams.level,
        //         difficultyParams.step
        //     );

        //     if (gameConfigData && gameConfigData.success) {
        //         this.gameData = gameConfigData;
        //         console.log('🎯 根据难度获取到游戏配置:', this.gameData);
        //     } else {
        //         console.warn('⚠️ 获取游戏数据失败，使用默认配置');
        //         // 使用默认配置
        //         this.gameData = this.getDefaultGameData(difficulty);
        //     }

        // } catch (error) {
        //     console.error('❌ 获取游戏数据时出错:', error);
        //     // 使用默认配置
        //     this.gameData = this.getDefaultGameData(difficulty);
        // }
        try {
            // 从 SelectLine 获取难度对应的参数
            const difficultyLevel = window.SelectLine ? window.SelectLine.getDifficultyLevel(difficulty) : 4;
            console.log(`🎯 难度等级: ${difficultyLevel}`);

            // 从 GameServer 获取游戏配置数据，保留完整参数
            const gameConfigData = window.GameServer.getGameData(
                this.userStatus,
                'currentUser',
                this.userStatus?.currentLevel || 0,
                this.userStatus?.currentStep || 1,
                difficultyLevel
            );

            if (gameConfigData && gameConfigData.success) {
                this.gameData = gameConfigData;
                console.log('🎯 根据难度获取到游戏配置:', this.gameData);
            } else {
                console.warn('⚠️ 获取游戏数据失败');
                this.gameData = null;
            }

        } catch (error) {
            console.error('❌ 获取游戏数据时出错:', error);
            this.gameData = null;
        }
    }

    /**
 * 继续初始化流程
 */
    continueInitialization() {
        console.log('🔄 继续游戏初始化...');

        // 验证游戏数据
        this.verifyGameData();

        // 初始化其他游戏系统
        this.initGameSystems();
    }

    /**
     * 初始化游戏系统
     */
    async initGameSystems() {
        console.log('🎯 初始化游戏系统...');

        try {
            // 1. 从 GameServer 获取地图配置
            await this.initMapFromServer();

            // 2. 获取游戏场景中的 gamebox 元件
            this.getGamebox();

            // 3. 初始化游戏元素
            this.initGameElements();

            // 4. 设置事件监听
            this.setupEventListeners();


            // 6. 初始化引导系统（如果需要）
            // this.initGuideSystem();

            // 7. 处理初始化后的逻辑
            this.handlePostInitialization();

            console.log('✅ 游戏系统初始化完成');

        } catch (error) {
            console.error('❌ 游戏系统初始化失败:', error);
        }
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

        const eggName = `egg_mc${type}`;

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

                    this.playLongbossAnimation();

                    // 同时创建所有蛋
                    const createEggPromises = eggSeat.map((cellId, index) =>
                        this.createEggAtPosition(cellId, eggType[index])
                    );

                    await Promise.all(createEggPromises);

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

        // 3. 初始化游戏元素
        this.initGoldDisplay();
        // 这里可以获取游戏中的具体元件
        // 例如：
        // this.player = this.gamebox.player;
        // this.enemies = this.gamebox.enemies;
        // this.ui = this.gamebox.ui;

        console.log('✅ 游戏元素初始化完成');
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
                goldMc.text.text = "0";
                console.log('✅ 金币显示初始化为0');
            } else {
                console.warn('⚠️ 未找到 mc_gold 或其 text 属性');
            }
        } catch (error) {
            console.error('❌ 初始化金币显示失败:', error);
        }
    }

    /**
     * 设置事件监听
     */
    setupEventListeners() {
        console.log('👂 设置事件监听...');

        // 启用舞台交互
        // if (this.stage) {
        //     createjs.Touch.enable(this.stage);
        //     this.stage.enableMouseOver(10);
        //     this.stage.mouseMoveOutside = true;
        // }

        // 添加点击事件监听
        if (this.gamebox) {
            this.gamebox.on('click', this.onGameboxClick, this);
        }

        // 添加键盘事件监听
        // document.addEventListener('keydown', this.onKeyDown.bind(this));
        // document.addEventListener('keyup', this.onKeyUp.bind(this));

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

        // 检查是否点击了蛋元件
        if (event.currentTarget.name !== this.gamebox.name) {
            console.log('🥚 点击了蛋元件，忽略gamebox事件');
            return;
        }

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

        // score 就是 scoreDetail
        const scoreDetail = score;

        console.log('🔍 使用score作为scoreDetail:', scoreDetail);

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

        // 执行蛋收集动画
        await this.playEggCollectionAnimation(allEggsToSynthesize, synthesisPosition);

        // 延迟后创建合成蛋
        await this.createSynthesizedEgg(synthesisPosition, newEggType);

        // 更新分数显示并等待完成
        // utile.__sdklog2('🔍 准备更新分数，scoreDetail:', scoreDetail);
        // if (scoreDetail && scoreDetail.totalScore) {
        //     await this.updateScoreDisplay(scoreDetail.totalScore);
        //     console.log('💰 分数更新动画完成，准备创建新蛋');
        // } else {
        //     console.warn('⚠️ scoreDetail 数据缺失:', scoreDetail);
        // }

        console.log(`✅ 合成完成！${window.GameServer.getEggTypeName(eggType)} -> ${window.GameServer.getEggTypeName(newEggType)}`);

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


        console.log(`🥚 创建蛋: 格子${cellId}, 类型${eggType}`);

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

        console.log(`📍 源蛋位置: ${sourceEggName} 舞台坐标(${sourceEgg.x}, ${sourceEgg.y})`);
        console.log(`📍 gamebox偏移: (${gameboxX}, ${gameboxY})`);
        console.log(`📍 转换后gamebox坐标: (${sourcePositionInGamebox.x}, ${sourcePositionInGamebox.y})`);

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

        console.log(`🚀 开始飞行动画: (${sourcePositionInGamebox.x}, ${sourcePositionInGamebox.y}) -> (${targetPosition.centerX}, ${targetPosition.centerY})`);

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
                    console.log(`✅ 蛋飞行完成: 格子${cellId}`);

                    // 维护前端映射
                    this.chessboard.pieces.set(cellId, newEgg);

                    console.log(`📍 添加新蛋到映射: 格子${cellId}`);
                    resolve();
                });
        });
    }


    playLongbossAnimation() {
        console.log('🐉 播放龙boss动画');

        try {
            const longboss = this.exportRoot.mc_longboss;
            if (longboss) {
                // 重置到第一帧并播放
                longboss.gotoAndPlay(0);
                console.log('✅ 龙boss动画开始播放');

                // 监听播放完成
                utile.addFrameEnd(longboss, function () {
                    longboss.gotoAndStop(0);
                    console.log('✅ 龙boss动画播放完成，停止在第0帧');
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
  * 更新分数显示
  * @param {number} addedScore - 新增分数
  */
    updateScoreDisplay(addedScore) {
        return new Promise((resolve) => {
            try {
                // 获取金币显示元件
                const goldMc = this.exportRoot.mc_gold;
                if (goldMc && goldMc.text) {
                    // 获取当前分数
                    const currentScore = parseInt(goldMc.text.text) || 0;
                    const targetScore = currentScore + addedScore;

                    console.log(`💰 分数动画: ${currentScore} -> ${targetScore} (+${addedScore})`);

                    // 创建数字递增动画
                    const animationData = { score: currentScore };

                    createjs.Tween.get(animationData)
                        .to({ score: targetScore }, 500, createjs.Ease.quadOut)
                        .addEventListener("change", () => {
                            // 实时更新显示的分数
                            goldMc.text.text = Math.floor(animationData.score).toString();
                        })
                        .call(() => {
                            // 确保最终分数正确
                            goldMc.text.text = targetScore.toString();
                            console.log(`💰 分数动画完成: ${targetScore}`);

                            // 添加分数增加动画效果
                            this.playScoreAnimation(goldMc, addedScore);

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
 * 播放分数增加动画
 * @param {Object} goldMc - 金币元件
 * @param {number} addedScore - 增加的分数
 */
    playScoreAnimation(goldMc, addedScore) {
        // 创建飞入的分数文本
        const scoreText = new createjs.Text(`+${addedScore}`, "24px Arial", "#FFD700");
        scoreText.x = goldMc.x + 50;
        scoreText.y = goldMc.y - 30;
        scoreText.alpha = 0;

        this.gamebox.addChild(scoreText);

        // 分数飞入动画
        createjs.Tween.get(scoreText)
            .to({ alpha: 1, y: goldMc.y - 50 }, 300, createjs.Ease.backOut)
            .wait(800)
            .to({ alpha: 0, y: goldMc.y - 70 }, 300)
            .call(() => {
                this.gamebox.removeChild(scoreText);
            });

        // 金币元件缩放效果
        createjs.Tween.get(goldMc)
            .to({ scaleX: 1.1, scaleY: 1.1 }, 200, createjs.Ease.backOut)
            .to({ scaleX: 1, scaleY: 1 }, 200, createjs.Ease.backIn);
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

    /**
 * 显示失败界面
 */
    showFailure() {
        console.log('💀 显示失败界面...');

        // 获取失败界面元件
        const failureMc = utile.findMc(this.exportRoot, 'mc_failure');
        if (!failureMc) {
            console.warn('⚠️ 未找到 mc_failure 元件');
            return;
        }

        // 显示失败界面
        failureMc.visible = true;
        utile.toShow(failureMc);

        // 查找屏蔽层
        const blockLayer = utile.findMc(failureMc, 'blockLayer');
        if (blockLayer) {
            blockLayer.mouseEnabled = true;

            // console.log("////////////////////////////////////",blockLayer.width, blockLayer.height);

            // 定义屏蔽层点击处理函数 - 关键：阻止所有事件传递
            this.failureBlockClickHandler = (event) => {
                console.log('🛡️ 失败界面屏蔽层拦截了点击事件');
                event.stopImmediatePropagation(); // 立即停止事件传播
                event.stopPropagation(); // 阻止事件冒泡
                event.preventDefault(); // 阻止默认行为
                return false; // 阻止事件继续传播
            };

            // 绑定屏蔽层点击事件
            blockLayer.on('click', this.failureBlockClickHandler);

            // 确保屏蔽层在最顶层
            // failureMc.setChildIndex(blockLayer, failureMc.children.length - 1);

            console.log('✅ 失败界面屏蔽层事件已绑定');
        } else {
            console.warn('⚠️ 未找到 mc_failure 下的 blockLayer 元件');
        }

        // 查找重新开始按钮
        const btnAgain = utile.findMc(failureMc, 'btnagain');
        if (btnAgain) {
            // 定义重新开始点击处理函数
            this.restartClickHandler = (event) => {
                console.log('🔄 点击重新开始按钮');
                event.stopPropagation(); // 防止触发屏蔽层事件
                this.onRestartGame();
            };

            // 绑定重新开始按钮事件
            btnAgain.on('click', this.restartClickHandler);

            // 确保按钮在屏蔽层之上
            if (blockLayer) {
                failureMc.setChildIndex(btnAgain, failureMc.children.length - 1);
            }

            console.log('✅ 重新开始按钮事件已绑定');
        } else {
            console.warn('⚠️ 未找到 mc_failure 下的 btnagain 元件');
        }

        console.log('✅ 失败界面显示完成');
    }

    /**
     * 隐藏失败界面
     */
    hideFailure() {
        console.log('🗑️ 隐藏失败界面...');

        // 获取失败界面元件
        const failureMc = utile.findMc(this.exportRoot, 'mc_failure');
        if (failureMc) {
            // 移除屏蔽层事件
            const blockLayer = utile.findMc(failureMc, 'blockLayer');
            if (blockLayer && this.failureBlockClickHandler) {
                blockLayer.off('click', this.failureBlockClickHandler);
                this.failureBlockClickHandler = null;
                console.log('✅ 屏蔽层点击事件已移除');
            }

            // 移除重新开始按钮事件
            const btnAgain = utile.findMc(failureMc, 'btnagain');
            if (btnAgain && this.restartClickHandler) {
                btnAgain.off('click', this.restartClickHandler);
                this.restartClickHandler = null;
                console.log('✅ 重新开始按钮事件已移除');
            }

            // 隐藏失败界面
            failureMc.visible = false;
        }

        console.log('✅ 失败界面隐藏完成');
    }

    /**
     * 重新开始游戏
     */
    onRestartGame() {
        console.log('🔄 重新开始游戏...');

        // 隐藏失败界面（会自动移除事件注册）
        this.hideFailure();

        // 重置游戏状态
        this.resetGame();

        console.log('✅ 游戏重新开始');
    }
}




// 直接创建全局对象，避免类名冲突
console.log('🏗️ 创建 GameScense 实例...');
window.GameScense = new GameScense();
console.log('✅ GameScense 实例创建完成:', window.GameScense);
console.log('🔍 GameScense.init 方法:', typeof window.GameScense.init);