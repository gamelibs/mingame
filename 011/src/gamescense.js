import utile from './utile.js';
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

            this.gamebox = utile.findMc(this.exportRoot, 'gamebox');

            // 初始化失败和胜利界面（隐藏状态）

            // 添加点击事件监听
            if (this.gamebox && !this.gamebox.hasEventListener("click")) {
                this.gamebox.on('click', this.onGameboxClick, this);
            }

            const mc_start_over = utile.findMc(this.exportRoot, 'mc_start_over');
            if (mc_start_over) {
                mc_start_over.visible = false; // 初始隐藏重新开始界面
                const btn_yes = utile.findMc(mc_start_over, 'btn_yes');

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
                const btn_no = utile.findMc(mc_start_over, 'btn_no');

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
            const btnRestart = utile.findMc(this.exportRoot, 'btn_restart');
            if (btnRestart) {

                btnRestart.on('click', (event) => {
                    console.log('🔄 点击重新开始按钮 (btn_restart)');
                    event.stopPropagation();
                    this.engine.playSound('select_wawa');
                    this.showPanel(mc_start_over, true);

                });
                // console.log('✅ btn_restart 按钮事件已绑定');
            }

            const failureMc = utile.findMc(this.exportRoot, 'mc_failure');
            if (failureMc) {
                failureMc.visible = false; // 初始隐藏失败界面

                // 查找屏蔽层
                const blockLayer = utile.findMc(failureMc, 'blockLayer');
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
                const btnAgain = utile.findMc(failureMc, 'btn_tryagain');
                // utile.goStop(btnAgain, true)
                btnAgain.gotoAndStop(0);

                if (btnAgain && !btnAgain.hasEventListener("click")) {

                    // AAI：失败后先弹出复活选择
                    btnAgain.on('click', (event) => {
                        // console.log('🔄 失败界面点击继续按钮');
                        event.stopPropagation();
                        this.showReviveOptions();
                    });

                    // 确保按钮在屏蔽层之上
                    if (blockLayer) {
                        failureMc.setChildIndex(btnAgain, failureMc.children.length - 1);
                    }

                    // console.log('✅ 失败界面继续按钮事件已绑定');
                }
            }

            const victoryMc = utile.findMc(this.exportRoot, 'mc_victory');
            if (victoryMc) {
                victoryMc.visible = false; // 初始隐藏胜利界面
                // 查找屏蔽层
                const blockLayer = utile.findMc(victoryMc, 'blockLayer');
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
                const btnAgain = utile.findMc(victoryMc, 'btn_playagain');
                if (btnAgain && !btnAgain.hasEventListener("click")) {

                    // 绑定重新开始按钮事件
                    btnAgain.on('click', (event) => {
                        // console.log('🔄 胜利界面点击继续按钮');
                        event.stopPropagation();

                        // AAI：根据是否完成最终关卡决定下一步
                        const isFinalLevel = (this.targetEggType >= 7);

                        // 调用插页广告
                        ovo.showInterstitialAd(() => {
                            // 广告关闭后的回调
                            if (isFinalLevel) {
                                // 最终关卡后重新开始
                                this.victoryHandler(false);
                            } else {
                                // 非最终关卡进入下一关
                                this.onNextLevel();
                            }
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

            const settingsMc = utile.findMc(this.exportRoot, 'mc_settings');
            if (settingsMc) {
                settingsMc.visible = false; // 初始隐藏设置界面
                const btnSetting = utile.findMc(this.exportRoot, 'btn_setting');

                if (btnSetting) {
                    // 绑定设置按钮事件
                    btnSetting.on('click', () => {
                        event.stopPropagation();
                        this.engine.playSound("select_wawa")
                        
                        // AAI：打开设置时暂停自动飞入倒计时
                        this.stopAutoSpawnTimer();

                        this.showPanel(settingsMc, true, () => {
                            // console.log('✅ 设置界面显示完成');
                            this.selectedDifficulty = window.GameServer.getDifficulty();

                            this.selectDifficulty(this.selectedDifficulty, this.difficultyMap); // 更新按钮状态

                            // AAI：设置页 Banner 常驻
                            if (typeof window.ovo !== 'undefined' && typeof window.ovo.showBannerAd === 'function') {
                                window.ovo.showBannerAd(() => {
                                    console.log('📢 设置页 Banner 已显示');
                                });
                            }
                        });
                    });
                    // console.log('✅ btn_setting 按钮事件已绑定');
                }

                const btn_clos_setting = utile.findMc(settingsMc, 'btn_clos_setting');

                btn_clos_setting.on('click', () => {
                    this.engine.playSound("select_wawa")
                    this.showPanel(settingsMc, false, () => {
                        console.log('🔧 设置界面已关闭');
                        // AAI：回到首页后继续显示 Banner
                        if (typeof window.ovo !== 'undefined' && typeof window.ovo.showBannerAd === 'function') {
                            window.ovo.showBannerAd(() => {
                                console.log('📢 设置关闭后 Banner 已恢复');
                            });
                        }
                        // AAI：关闭设置后恢复自动飞入倒计时
                        this.startAutoSpawnTimer();
                    });
                });


                const isMusicEnabled = (localStorage.getItem('musicEnabled') === null) ||
                    localStorage.getItem('musicEnabled') === 'true';
                const isSoundEnabled = (localStorage.getItem('soundEnabled') === null) ||
                    localStorage.getItem('soundEnabled') === 'true';
                const isVibrationEnabled = (localStorage.getItem('vibrationEnabled') === null) ||
                    localStorage.getItem('vibrationEnabled') === 'true';


                // 音乐
                const btn_bg = utile.findMc(settingsMc, 'mc_sound_bg');
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

                const btn_eff = utile.findMc(settingsMc, 'mc_sound_eff');
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
                const btn_vibra = utile.findMc(settingsMc, 'mc_vibra');
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


            const btn_easy = utile.findMc(settingsMc, 'mc_diff_easy');
            const btn_nolrmal = utile.findMc(settingsMc, 'mc_diff_normal');
            const btn_hard = utile.findMc(settingsMc, 'mc_diff_hard');

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

            const blockLayer = utile.findMc(settingsMc, 'blockLayer');
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
            // AAI：记录关卡与目标
            this.level = gameConfig.level || 1;
            this.targetEggType = gameConfig.targetEggType || 4;
            console.log(`🎯 获取到游戏配置: 第 ${this.level} 关, 目标 ${this.targetEggType} 级蛋`);

            // 验证游戏数据
            // this.verifyGameData();

            // 处理初始化后的逻辑
            setTimeout(() => {
                this.generateUserEggs();

                // 测试奖励
                // this.openCardRewardPanel(800);
            }, 1000);

            this.isInitialized = true;

            // AAI：初始化自动飞入倒计时系统
            this.initAutoSpawn();

            // AAI：首页 Banner 常驻（进入游戏主场景后显示）
            setTimeout(() => {
                if (typeof window.ovo !== 'undefined' && typeof window.ovo.showBannerAd === 'function') {
                    window.ovo.showBannerAd(() => {
                        console.log('📢 首页 Banner 已显示');
                    });
                }
            }, 500);

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

                    // AAI：非新手引导模式下，蛋生成完成后启动自动飞入倒计时
                    if (!this.userStatus?.isNewUser) {
                        this.startAutoSpawnTimer();
                    }

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
            const egg = utile.findMc(this.exportRoot, eggName);

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

            // AAI：玩家每次有效操作后重置自动飞入倒计时
            if (this.autoSpawnActive) {
                this.resetAutoSpawnTimer();
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

        // AAI：移动/合成期间暂停自动飞入倒计时
        this.stopAutoSpawnTimer();

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
                                const maskMc = utile.findMc(this.exportRoot, maskName);
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
                                    utile.addFrameEnd(maskMc, () => {

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

                // AAI：移动处理完成后恢复自动飞入倒计时（胜利/失败时不恢复，由对应面板控制）
                if (!isVictory && !isFailure) {
                    this.startAutoSpawnTimer();
                }
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

        const { eggType, synthesisPosition, score } = synthesisData;
        const scoreDetail = score;

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

        // 播放合成音乐
        if (this.engine && this.loadedSounds.has('goodmin')) {
            this.engine.playSound('goodmin');
        }

        // AAI：构建额外蛋的移动路径映射
        const extraPathMap = {};
        if (synthesisData.extraPaths) {
            for (const extra of synthesisData.extraPaths) {
                extraPathMap[extra.cellId] = extra.path;
            }
        }

        // AAI：额外蛋按路径长度排序，近的先进，逐个移动到目标位置
        const extras = positionsToDelete
            .filter(cellId => cellId !== synthesisPosition)
            .map(cellId => ({
                cellId,
                piece: this.chessboard.pieces.get(cellId),
                path: extraPathMap[cellId] || []
            }))
            .filter(item => item.piece)
            .sort((a, b) => a.path.length - b.path.length);

        let currentLevel = eggType;
        let targetPiece = this.chessboard.pieces.get(synthesisPosition);

        // 逐个移动额外蛋，每到达一个目标蛋升 1 级；达到 7 级后多余的直接消除
        for (const extra of extras) {
            if (currentLevel >= 7) {
                await this.eliminatePieceDirectly(extra.piece);
                continue;
            }

            // 沿路径移动到目标位置
            await this.animatePieceAlongPath(extra.piece, extra.path);

            // 到达目标后移除
            if (extra.piece.parent) {
                extra.piece.parent.removeChild(extra.piece);
            }
            this.chessboard.pieces.delete(extra.cellId);

            // 目标蛋升级 1 级
            currentLevel++;
            targetPiece = this.replacePieceAtCell(synthesisPosition, currentLevel);
        }

        // 最终合成特效与信息
        if (targetPiece && currentLevel > eggType) {
            await this.playSynthesisEffect(targetPiece);
            this.showSynthesisInfo(currentLevel);
        }

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
        if (currentLevel > this.maxUnlockedLevel) {
            // console.log(`🎉 解锁新等级: ${this.maxUnlockedLevel} -> ${currentLevel}`);

            this.engine.playSound('hecheng_open');

            // 播放解锁动画
            await this.playUnlockAnimation(currentLevel);

            // 更新前端记录的最高等级
            this.maxUnlockedLevel = currentLevel;

            // console.log(`🎊 恭喜解锁 ${this.getEggTypeName(currentLevel)} 蛋！`);
        }

        // console.log(`✅ 合成完成！${window.GameServer.getEggTypeName(eggType)} -> ${window.GameServer.getEggTypeName(currentLevel)}`);

        // 返回完成标识
        return { completed: true };
    }


    /**
     * 沿路径移动参与合成的蛋
     * @param {Object} piece - 蛋元件
     * @param {Array} path - 后端返回的路径数组 [{x, y}, ...]
     * @returns {Promise<boolean>}
     */
    async animatePieceAlongPath(piece, path) {
        const pathCellIds = path.map(step => {
            if (typeof step === 'number') return step;
            if (step && typeof step.x === 'number' && typeof step.y === 'number') {
                return this.getCellId(step.x, step.y);
            }
            return null;
        }).filter(id => typeof id === 'number');
        return new Promise((resolve) => {
            if (!piece || pathCellIds.length === 0) {
                resolve(false);
                return;
            }
            // 移动前先从原格子映射中移除
            this.chessboard.pieces.delete(piece.cellId);
            this.animateAlongPath(piece, pathCellIds, (success) => {
                resolve(success);
            });
        });
    }

    /**
     * 直接消除多余的蛋（达到 7 级后不再参与升级）
     * @param {Object} piece - 要消除的蛋元件
     * @returns {Promise<void>}
     */
    async eliminatePieceDirectly(piece) {
        return new Promise((resolve) => {
            if (!piece) {
                resolve();
                return;
            }
            createjs.Tween.get(piece)
                .to({ scaleX: 0, scaleY: 0, alpha: 0 }, 250, createjs.Ease.quadIn)
                .call(() => {
                    if (piece.parent) {
                        piece.parent.removeChild(piece);
                    }
                    this.chessboard.pieces.delete(piece.cellId);
                    resolve();
                });
        });
    }

    /**
     * 将指定格子的蛋替换为更高等级（保留层级与位置）
     * @param {number} cellId - 格子ID
     * @param {number} newEggType - 新蛋类型
     * @returns {Object|null} 新的蛋元件
     */
    replacePieceAtCell(cellId, newEggType) {
        const position = this.getCellPosition(cellId);
        if (!position) {
            console.error(`❌ 无法获取格子 ${cellId} 的位置坐标`);
            return null;
        }

        const oldPiece = this.chessboard.pieces.get(cellId);
        const newPiece = this.getEggFromFlygame(newEggType);
        if (!newPiece) {
            console.error(`❌ 无法创建升级蛋: egg_mc${newEggType}`);
            return oldPiece || null;
        }

        newPiece.eggType = newEggType;
        newPiece.cellId = cellId;
        newPiece.x = position.centerX;
        newPiece.y = position.centerY;
        newPiece.scaleX = 1;
        newPiece.scaleY = 1;
        newPiece.alpha = 1;

        if (oldPiece && oldPiece.parent) {
            const parent = oldPiece.parent;
            const index = parent.getChildIndex(oldPiece);
            parent.removeChild(oldPiece);
            if (index >= 0 && index <= parent.numChildren) {
                parent.addChildAt(newPiece, index);
            } else {
                parent.addChild(newPiece);
            }
        } else {
            this.gamebox.addChild(newPiece);
        }

        this.chessboard.pieces.set(cellId, newPiece);
        return newPiece;
    }


    /**
     * 播放蛋收集动画
     * @param {Array} eggs - 所有参与合成的蛋数组
     * @param {number} targetCellId - 目标位置
     * @param {Object} extraPathMap - AAI：额外蛋的 cellId -> 路径数组
     */
    async playEggCollectionAnimation(eggs, targetCellId, extraPathMap = {}) {
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
                    // AAI：非目标位置的蛋优先按行走规则移动到目标位置
                    const pathCellIds = extraPathMap[eggData.cellId];
                    if (pathCellIds && pathCellIds.length > 0) {
                        const promise = new Promise((resolve) => {
                            this.animateAlongPath(eggData.piece, pathCellIds, () => {
                                // 确保从父容器中移除
                                if (eggData.piece.parent) {
                                    eggData.piece.parent.removeChild(eggData.piece);
                                }
                                this.chessboard.pieces.delete(eggData.cellId);
                                resolve();
                            });
                        });
                        promises.push(promise);
                    } else {
                        // 没有路径信息时兜底：直接飞向目标位置
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
                                    // 确保从父容器中移除
                                    if (eggData.piece.parent) {
                                        eggData.piece.parent.removeChild(eggData.piece);
                                    }

                                    this.chessboard.pieces.delete(eggData.cellId);
                                    resolve();
                                });
                        });

                        promises.push(promise);
                    }
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
                utile.addFrameEnd(longboss, function () {
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

        const tipsMc = utile.findMc(this.exportRoot, 'mc_tips');
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

        const panelUI = utile.findMc(this.exportRoot, 'mc_failure');
        if (!panelUI) {
            console.warn('⚠️ 未找到 mc_failure 元件');
            return;
        }

        if (show) {

            this.engine.playSound('wrong2');

            // AAI：失败后暂停自动飞入倒计时
            this.stopAutoSpawnTimer();

            const btnAgain = utile.findMc(panelUI, 'btn_tryagain');
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
     * AAI：显示复活选择面板
     */
    showReviveOptions() {
        console.log('💖 显示复活选择面板');

        const failureMc = utile.findMc(this.exportRoot, 'mc_failure');
        if (!failureMc) return;

        // 如果已有复活面板，先移除
        if (this.revivePanel) {
            failureMc.removeChild(this.revivePanel);
            this.revivePanel = null;
        }

        const panel = new createjs.Container();
        panel.name = 'revivePanel';

        // 半透明背景
        const bg = new createjs.Shape();
        bg.graphics.beginFill('rgba(0,0,0,0.85)').drawRoundRect(-250, -200, 500, 400, 20);
        panel.addChild(bg);

        // 标题
        const title = new createjs.Text('游戏结束', 'bold 48px Arial', '#FFD700');
        title.textAlign = 'center';
        title.y = -160;
        panel.addChild(title);

        // 提示
        const hint = new createjs.Text('地图已满，无法继续', '24px Arial', '#FFFFFF');
        hint.textAlign = 'center';
        hint.y = -90;
        panel.addChild(hint);

        // 创建按钮的辅助函数
        const createBtn = (label, y, color, callback) => {
            const btn = new createjs.Container();
            btn.y = y;

            const shape = new createjs.Shape();
            shape.graphics.beginFill(color).drawRoundRect(-180, -30, 360, 60, 12);
            btn.addChild(shape);

            const text = new createjs.Text(label, 'bold 28px Arial', '#FFFFFF');
            text.textAlign = 'center';
            text.y = -12;
            btn.addChild(text);

            btn.cursor = 'pointer';
            btn.on('click', (e) => {
                e.stopPropagation();
                callback();
            });

            return btn;
        };

        // 看广告复活
        panel.addChild(createBtn('📺 看广告复活', -20, '#4CAF50', () => {
            this.onReviveByAd();
        }));

        // 分享复活
        panel.addChild(createBtn('📤 分享给好友复活', 60, '#2196F3', () => {
            this.onReviveByShare();
        }));

        // 放弃
        panel.addChild(createBtn('放弃并领取奖励', 140, '#9E9E9E', () => {
            this.onGiveUpAfterFailure();
        }));

        panel.x = this.stage.canvas.width / 2;
        panel.y = this.stage.canvas.height / 2;
        panel.scaleX = panel.scaleY = 0.1;
        panel.alpha = 0;

        failureMc.addChild(panel);
        this.revivePanel = panel;

        createjs.Tween.get(panel)
            .to({ scaleX: 1, scaleY: 1, alpha: 1 }, 300, createjs.Ease.backOut);
    }

    /**
     * AAI：通过激励视频复活
     */
    onReviveByAd() {
        console.log('📺 尝试看广告复活');

        if (typeof window.showRewardedAd !== 'function') {
            console.warn('⚠️ 激励视频不可用，直接复活（测试模式）');
            this.executeRevive();
            return;
        }

        window.showRewardedAd((success) => {
            if (success) {
                console.log('📺 激励视频看完，执行复活');
                this.executeRevive();
            } else {
                console.log('📺 激励视频未看完');
                this.tips('看完广告才能复活哦~');
            }
        });
    }

    /**
     * AAI：通过分享复活
     */
    onReviveByShare() {
        console.log('📤 尝试分享复活');

        // 优先使用微信分享
        if (typeof wx !== 'undefined' && wx.shareAppMessage) {
            wx.shareAppMessage({
                title: '来挑战 Dragon Egg，我已经玩到第' + (this.level || 1) + '关了！',
                imageUrl: 'assets/image/logo1.png'
            });
            // 分享回调不可信，直接复活
            this.executeRevive();
            return;
        }

        // H5 兜底：尝试 navigator.share
        if (typeof navigator !== 'undefined' && navigator.share) {
            navigator.share({
                title: 'Dragon Egg',
                text: '来挑战 Dragon Egg 吧！'
            }).then(() => {
                this.executeRevive();
            }).catch(() => {
                this.tips('分享失败，请重试');
            });
            return;
        }

        // 无分享能力时直接复活（测试）
        console.warn('⚠️ 无分享能力，直接复活（测试模式）');
        this.executeRevive();
    }

    /**
     * AAI：放弃复活，显示插屏后重开
     */
    onGiveUpAfterFailure() {
        console.log('💀 放弃复活');

        // 移除复活面板
        if (this.revivePanel) {
            const panel = this.revivePanel;
            createjs.Tween.get(panel)
                .to({ scaleX: 0.1, scaleY: 0.1, alpha: 0 }, 200)
                .call(() => {
                    if (panel.parent) panel.parent.removeChild(panel);
                    this.revivePanel = null;
                });
        }

        // 调用插页广告后重开
        ovo.showInterstitialAd(() => {
            this.failureHandler(false);
        });
    }

    /**
     * AAI：执行复活逻辑
     */
    async executeRevive() {
        console.log('💖 执行复活逻辑');

        try {
            if (!window.GameServer) {
                console.error('❌ GameServer 未找到');
                return;
            }

            const reviveResult = window.GameServer.revive(3);
            if (!reviveResult.success) {
                this.tips('复活失败，请重试');
                return;
            }

            // 更新 gameData
            this.gameData = {
                ...this.gameData,
                data: reviveResult.data,
                scoreSystem: reviveResult.scoreSystem
            };

            // 移除复活面板
            if (this.revivePanel) {
                const panel = this.revivePanel;
                if (panel.parent) panel.parent.removeChild(panel);
                this.revivePanel = null;
            }

            // 隐藏失败界面
            const failureMc = utile.findMc(this.exportRoot, 'mc_failure');
            if (failureMc) {
                failureMc.visible = false;
            }

            // 清理前端所有蛋，然后按复活后状态重新生成
            this.clearAllEggs();
            this.gameDataState.cells = {};

            // 重新生成剩余蛋
            await this.generateUserEggs();

            this.tips('复活成功！继续挑战吧！');

        } catch (error) {
            console.error('❌ 复活执行失败:', error);
            this.tips('复活失败');
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
     * 创建文本按钮（用于动态弹窗）
     */
    createTextButton(label, y, color, callback) {
        const btn = new createjs.Container();
        btn.y = y;

        const shape = new createjs.Shape();
        shape.graphics.beginFill(color).drawRoundRect(-180, -30, 360, 60, 12);
        btn.addChild(shape);

        const text = new createjs.Text(label, 'bold 28px Arial', '#FFFFFF');
        text.textAlign = 'center';
        text.y = -12;
        btn.addChild(text);

        btn.cursor = 'pointer';
        btn.on('click', (e) => {
            e.stopPropagation();
            callback();
        });

        return btn;
    }

    /**
     * AAI：显示胜利奖励领取面板
     */
    showVictoryRewardUI(panelUI) {
        if (!window.GameServer) return;

        // 移除旧奖励面板
        if (this.victoryRewardPanel && this.victoryRewardPanel.parent) {
            this.victoryRewardPanel.parent.removeChild(this.victoryRewardPanel);
        }

        const coinReward = window.GameServer.getLevelConfig(this.level).coinReward || 0;
        const isFinalLevel = (this.targetEggType >= 7);

        // 隐藏原始按钮，避免与自定义按钮冲突
        const btnAgain = utile.findMc(panelUI, 'btn_playagain');
        if (btnAgain) {
            btnAgain.visible = false;
            btnAgain.removeAllEventListeners('click');
        }

        // 更新标题文案
        try {
            if (panelUI.txt_title && panelUI.txt_title.text) {
                panelUI.txt_title.text.text = isFinalLevel ? '恭喜解锁神龙！' : `第 ${this.level} 关完成！`;
            }
            if (panelUI.txt_level && panelUI.txt_level.text) {
                panelUI.txt_level.text.text = `目标: ${this.targetEggType}级蛋`;
            }
        } catch (e) {}

        const container = new createjs.Container();
        container.name = 'victoryRewardPanel';

        // 奖励提示
        const rewardText = new createjs.Text(`奖励 ${coinReward} 金币`, 'bold 40px Arial', '#FFD700');
        rewardText.textAlign = 'center';
        rewardText.y = -150;
        container.addChild(rewardText);

        // 双倍领取按钮
        container.addChild(this.createTextButton('📺 看广告双倍领取', -50, '#FF6B35', () => {
            this.onClaimLevelReward(true);
        }));

        // 普通领取按钮
        const normalLabel = isFinalLevel ? '普通领取并重开' : '普通领取并继续';
        container.addChild(this.createTextButton(normalLabel, 40, '#4CAF50', () => {
            this.onClaimLevelReward(false);
        }));

        container.x = this.stage.canvas.width / 2;
        container.y = this.stage.canvas.height / 2;
        container.scaleX = container.scaleY = 0.1;
        container.alpha = 0;

        panelUI.addChild(container);
        this.victoryRewardPanel = container;

        createjs.Tween.get(container)
            .to({ scaleX: 1, scaleY: 1, alpha: 1 }, 300, createjs.Ease.backOut);
    }

    /**
     * AAI：领取关卡奖励并决定下一步
     * @param {boolean} double - 是否双倍领取
     */
    async onClaimLevelReward(double) {
        console.log(`💰 领取关卡奖励，双倍=${double}`);

        try {
            if (!window.GameServer) {
                console.error('❌ GameServer 未找到');
                return;
            }

            // 1. 先弹出激励视频（如果需要双倍）
            if (double) {
                if (typeof window.showRewardedAd === 'function') {
                    window.showRewardedAd((success) => {
                        if (success) {
                            this._doClaimLevelReward(true);
                        } else {
                            this.tips('看完广告才能获得双倍奖励哦~');
                        }
                    });
                    return;
                }
                console.warn('⚠️ 激励视频不可用，直接发放双倍奖励（测试模式）');
            }

            this._doClaimLevelReward(double);
        } catch (error) {
            console.error('❌ 领取关卡奖励失败:', error);
        }
    }

    /**
     * AAI：实际发放关卡奖励并跳转
     */
    _doClaimLevelReward(double) {
        if (!window.GameServer) return;

        const result = window.GameServer.claimLevelReward(double);
        if (result.success) {
            this.updateScoreDisplayDirectly(window.GameServer.getScoreStatus());
            this.tips(`获得 ${result.coinEarned} 金币`);
        }

        const isFinalLevel = (this.targetEggType >= 7);
        const currentLevel = window.GameServer.level;

        const nextAction = () => {
            if (this.victoryRewardPanel) {
                if (this.victoryRewardPanel.parent) {
                    this.victoryRewardPanel.parent.removeChild(this.victoryRewardPanel);
                }
                this.victoryRewardPanel = null;
            }

            if (isFinalLevel) {
                this.victoryHandler(false);
            } else {
                this.onNextLevel();
            }
        };

        // 每 3 关显示一次插屏广告
        if (currentLevel % 3 === 0 && currentLevel > 0) {
            ovo.showInterstitialAd(() => nextAction());
        } else {
            nextAction();
        }
    }

    /**
     * 胜利界面控制器
     * @param {boolean} show - true显示，false隐藏
     */
    victoryHandler(show) {
        // console.log(`🏆 ${show ? '显示' : '隐藏'}胜利界面...`);

        const panelUI = utile.findMc(this.exportRoot, 'mc_victory');
        if (!panelUI) {
            console.warn('⚠️ 未找到 mc_victory 元件');
            return;
        }

        if (show) {

            this.engine.playSound('win');

            // AAI：胜利后暂停自动飞入倒计时
            this.stopAutoSpawnTimer();

            this.showPanel(panelUI, true, async () => {
                if (this.gameData) {
                    this.gameData.scoreSystem = await window.GameServer.getScoreStatus();
                    panelUI.mc_ranking.mc_best.text.text = "" + this.gameData.scoreSystem.bestScore;
                    panelUI.mc_ranking.mc_score.text.text = "" + this.gameData.scoreSystem.currentScore;
                }

                // AAI：显示奖励领取 UI
                this.showVictoryRewardUI(panelUI);
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

        const victoryMc = utile.findMc(this.exportRoot, 'mc_victory');
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
     * 进入下一关
     */
    async onNextLevel() {
        console.log('🚀 进入下一关...');

        try {
            // 隐藏胜利界面
            const victoryMc = utile.findMc(this.exportRoot, 'mc_victory');
            if (victoryMc) {
                victoryMc.visible = false;
            }

            // 清理前端蛋元件和状态
            this.clearAllEggs();
            this.clearSelection();

            // 调用后端进入下一关
            if (window.GameServer) {
                const nextLevelData = window.GameServer.advanceLevel();
                if (nextLevelData.success) {
                    this.gameData = nextLevelData;
                    this.level = nextLevelData.level;
                    this.targetEggType = nextLevelData.targetEggType;
                    console.log(`✅ 已进入第 ${this.level} 关，目标 ${this.targetEggType} 级蛋`);

                    // 重置解锁动画
                    this.resetUnlockAnimations();

                    // 生成新关卡的蛋
                    setTimeout(() => {
                        this.generateUserEggs();
                    }, 500);
                } else {
                    console.error('❌ 进入下一关失败');
                }
            }
        } catch (error) {
            console.error('❌ 进入下一关出错:', error);
        }
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

                    // AAI：游戏重新开始后恢复首页 Banner 常驻
                    setTimeout(() => {
                        if (typeof window.ovo !== 'undefined' && typeof window.ovo.showBannerAd === 'function') {
                            window.ovo.showBannerAd(() => {
                                console.log('📢 重新开始后 Banner 已显示');
                            });
                        }
                    }, 500);

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
            const maskMc = utile.findMc(this.exportRoot, maskName);

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


                utile.addFrameEnd(maskMc, () => {
                    // finish();
                    if (unlockedLevel === 7) {
                        maskMc.visible = false;
                        const maskMc8 = this.unlockAnimations.get(8);
                        utile.addFrameEnd(maskMc8, null, true);
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
                    utile.addFrameEnd(maskMc, () => {
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
        const guideMc = utile.findMc(this.exportRoot, 'guide_mc');
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

        // AAI：新手引导完成后开启自动飞入倒计时
        if (show === false) {
            this.startAutoSpawnTimer();
        }

    }

    /**
     * AAI：初始化自动飞入倒计时系统
     */
    initAutoSpawn() {
        this.autoSpawnInterval = 10000; // AAI：10 秒倒计时
        this.autoSpawnRemaining = 5000;
        this.autoSpawnActive = false;
        this.autoSpawnTimer = null;
        this.autoSpawnDisplay = null;
        this.createAutoSpawnDisplay();
    }

    /**
     * AAI：创建倒计时显示文本
     */
    createAutoSpawnDisplay() {
        if (!this.exportRoot || !this.stage) return;
        const text = new createjs.Text('5.0s', 'bold 28px Arial', '#FFFFFF');
        text.name = 'autoSpawnCountdown';
        text.textAlign = 'center';
        text.x = this.stage.canvas.width / 2;
        text.y = 24;
        text.visible = false;
        this.exportRoot.addChild(text);
        // 确保倒计时在最上层
        this.exportRoot.setChildIndex(text, this.exportRoot.children.length - 1);
        this.autoSpawnDisplay = text;
    }

    /**
     * AAI：启动自动飞入倒计时
     */
    startAutoSpawnTimer() {
        if (this.autoSpawnActive) return;
        this.autoSpawnActive = true;
        if (this.autoSpawnDisplay) {
            this.autoSpawnDisplay.visible = true;
            this.exportRoot.setChildIndex(this.autoSpawnDisplay, this.exportRoot.children.length - 1);
        }
        this.resetAutoSpawnTimer();
        this.autoSpawnTimer = setInterval(() => this.tickAutoSpawn(), 100);
    }

    /**
     * AAI：停止自动飞入倒计时
     */
    stopAutoSpawnTimer() {
        this.autoSpawnActive = false;
        if (this.autoSpawnTimer) {
            clearInterval(this.autoSpawnTimer);
            this.autoSpawnTimer = null;
        }
        if (this.autoSpawnDisplay) {
            this.autoSpawnDisplay.visible = false;
        }
    }

    /**
     * AAI：重置倒计时
     */
    resetAutoSpawnTimer() {
        this.autoSpawnRemaining = this.autoSpawnInterval;
        this.updateAutoSpawnDisplay();
    }

    /**
     * AAI：倒计时 tick
     */
    tickAutoSpawn() {
        if (!this.autoSpawnActive) return;
        if (this.isInGuideMode()) return;
        if (!this.canInteract()) return;
        if (typeof createjs !== 'undefined' && createjs.Ticker && createjs.Ticker.paused) return;

        this.autoSpawnRemaining -= 100;
        if (this.autoSpawnRemaining <= 0) {
            this.doAutoSpawn();
        } else {
            this.updateAutoSpawnDisplay();
        }
    }

    /**
     * AAI：更新倒计时显示
     */
    updateAutoSpawnDisplay() {
        if (!this.autoSpawnDisplay) return;
        const seconds = (this.autoSpawnRemaining / 1000).toFixed(1);
        this.autoSpawnDisplay.text = `${seconds}s`;
        if (this.autoSpawnRemaining <= 1000) {
            this.autoSpawnDisplay.color = '#FF0000';
        } else if (this.autoSpawnRemaining <= 3000) {
            this.autoSpawnDisplay.color = '#FFAA00';
        } else {
            this.autoSpawnDisplay.color = '#FFFFFF';
        }
        // 保持最上层
        if (this.exportRoot && this.autoSpawnDisplay.parent === this.exportRoot) {
            this.exportRoot.setChildIndex(this.autoSpawnDisplay, this.exportRoot.children.length - 1);
        }
    }

    /**
     * AAI：自动飞入一波蛋
     */
    async doAutoSpawn() {
        this.resetAutoSpawnTimer();

        if (!window.GameServer) return;

        const emptyCount = window.GameServer.mapState.emptyCells.size;
        if (emptyCount === 0) {
            console.log('💀 自动飞入：棋盘已满，游戏失败');
            this.stopAutoSpawnTimer();
            this.failureHandler(true);
            return;
        }

        console.log('⏰ 自动飞入一波蛋');
        const levelConfig = window.GameServer.getLevelConfig(window.GameServer.level);
        const spawnCount = Math.min(levelConfig.spawnCount, emptyCount);
        const newEggs = window.GameServer.generateRandomEggsFromMapState(spawnCount);

        if (!newEggs || newEggs.length === 0) {
            console.log('💀 自动飞入：没有可用位置，游戏失败');
            this.stopAutoSpawnTimer();
            this.failureHandler(true);
            return;
        }

        this.playLongbossAnimation();
        for (const egg of newEggs) {
            await this.createEggAtPosition(egg.cellId, egg.eggType);
        }

        // 飞入后棋盘满了也失败
        if (window.GameServer.mapState.emptyCells.size === 0) {
            console.log('💀 自动飞入后棋盘已满，游戏失败');
            this.stopAutoSpawnTimer();
            setTimeout(() => this.failureHandler(true), 500);
        }
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