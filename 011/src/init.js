// ...existing code...
import utile from './utile.js';
// 兼容旧脚本对 window.utile 的依赖
if (typeof window !== 'undefined') {
    window.utile = utile;
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

    }

    async init() {

        if (window.__GAME_ENGINE_STARTED__) {
            console.warn('⚠️ GameEngine 已启动，跳过重复初始化');
            return;
        }
        window.__GAME_ENGINE_STARTED__ = true;
        console.log('Game Engine Starting...');

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
        this.hideBasicLoading();
        // 添加焦点事件监听
        this.setupFocusBlurHandler();
    }


    setupFocusBlurHandler() {
        const pauseGame = () => {
            console.log('🛑 页面失去焦点，暂停游戏和音乐');
            // createjs.Ticker.setPaused(true); // 暂停游戏逻辑
            // if (this.loadedSounds.has('bgm')) {
            //     this.stopSound('bgm'); // 停止背景音乐
            // }
        };

        const resumeGame = () => {
            console.log('▶️ 页面获得焦点，恢复游戏和音乐');
            // createjs.Ticker.setPaused(false); // 恢复游戏逻辑
            // if (this.loadedSounds.has('bgm')) {
            //     this.playSound('bgm', { loop: -1, volume: 0.5 }); // 恢复背景音乐
            // }
        };

        // 添加事件监听
        window.addEventListener('blur', pauseGame);
        window.addEventListener('focus', resumeGame);

        console.log('🎮 焦点事件监听已添加');
    }

    getLoadingCompositionId() {
        // 方法1：从配置文件获取loading组合ID（推荐）
        if (this.config && this.config.compositions && this.config.compositions.loading) {
            const loadingId = this.config.compositions.loading.id;
            console.log('从配置文件获取loading组合ID:', loadingId);
            return loadingId;
        }

        // 方法2：从 AdobeAn.compositions 获取第一个可用的组合ID
        if (typeof AdobeAn !== 'undefined' && AdobeAn.compositions) {
            const compositionIds = Object.keys(AdobeAn.compositions);
            if (compositionIds.length > 0) {
                console.log('从AdobeAn.compositions获取ID:', compositionIds[0]);
                return compositionIds[0];
            }
        }

        // 方法3：尝试从全局 lib 对象获取
        if (typeof lib !== 'undefined' && lib.properties && lib.properties.id) {
            console.log('从lib.properties获取ID:', lib.properties.id);
            return lib.properties.id;
        }

        // 方法4：回退到硬编码ID（兼容性）
        console.warn('无法动态获取组合ID，使用默认值');
        return "12AB51DFDAB942FF88C62B7BF520AB4C";
    }

    getGameCompositionId() {
        // 从配置文件获取游戏组合ID
        if (this.config && this.config.compositions && this.config.compositions.game) {
            const gameId = this.config.compositions.game.id;
            console.log('从配置文件获取game组合ID:', gameId);
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
            const response = await fetch('./manifest.json?v=' + Math.random());
            this.config = await response.json();
            console.log('Config loaded:', this.config);

            // 加载 initial 中的资源（顺序加载）
            if (this.config.initial && Array.isArray(this.config.initial)) {
                console.log('开始加载 initial 资源:', this.config.initial);
                for (const resource of this.config.initial) {
                    await this.loadScript(resource); // 顺序加载 initial 资源
                }
                console.log('✅ initial 资源加载完成');
            }
        } catch (error) {
            console.error('Failed to load config:', error);
            throw error;
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
        this.loadingProgress = document.querySelector('.loading-progress');

        // 移除之前的事件监听器，避免重复
        window.removeEventListener('resize', this.resizeHandler);


        this.resizeHandler = () => {
            if (!this.designWidth || !this.designHeight) return;

            // 获取容器尺寸
            const stageWidth = this.gameContainer.clientWidth;
            const stageHeight = this.gameContainer.clientHeight;

            // 设置 canvas 尺寸为容器尺寸（关键！）
            this.canvas.width = stageWidth;
            this.canvas.height = stageHeight;

            // 设置 animation_container 尺寸
            this.animationContainer.style.width = stageWidth + 'px';
            this.animationContainer.style.height = stageHeight + 'px';
            this.animationContainer.style.position = 'absolute';
            this.animationContainer.style.left = '0px';
            this.animationContainer.style.top = '0px';

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
                // PC端：不执行旋转，直接按比例缩放
                console.log('🖥️ PC端模式：禁用旋转，使用等比缩放');
                this.stageScale = Math.min(stageWidth / designWidth, stageHeight / designHeight);
                this.stageRotation = 0;
                this.stageX = (stageWidth - designWidth * this.stageScale) / 2;
                this.stageY = (stageHeight - designHeight * this.stageScale) / 2;
            } else {
                // 移动端：保持原有的旋转逻辑
                if (isScreenPortrait === isDesignPortrait) {
                    // 屏幕方向与设计方向一致，不需要旋转
                    this.stageScale = Math.min(stageWidth / designWidth, stageHeight / designHeight);
                    this.stageRotation = 0;
                    this.stageX = stageWidth / 2 - designWidth * this.stageScale / 2;
                    this.stageY = stageHeight / 2 - designHeight * this.stageScale / 2;
                } else {
                    // 屏幕方向与设计方向不一致，需要旋转90度
                    this.stageScale = Math.min(stageWidth / designHeight, stageHeight / designWidth);
                    this.stageRotation = 90;
                    this.stageX = designHeight * this.stageScale + stageWidth / 2 - designHeight * this.stageScale / 2;
                    this.stageY = stageHeight / 2 - designWidth * this.stageScale / 2;
                }
            }

            this.applyStageTransform();
            // console.log(`Stage resized: ${stageWidth}x${stageHeight}, scale: ${this.stageScale}, rotation: ${this.stageRotation}`);
        }


        // 添加事件监听
        window.addEventListener('resize', this.resizeHandler);

        const { width = 1920, height = 1080, orientation = 'landscape', backgroundColor = '#CED1D3' } = this.config.scene || {};

        // 保存设计尺寸
        this.designWidth = width;
        this.designHeight = height;
        this.orientation = orientation;

        // 应用场景尺寸
        this.animationContainer.style.backgroundColor = backgroundColor;

        // 设置canvas初始尺寸
        this.canvas.width = width;
        this.canvas.height = height;

        // 应用方向设置
        if (orientation === 'portrait') {
            this.animationContainer.classList.add('portrait');
        } else {
            this.animationContainer.classList.remove('portrait');
        }

        console.log(`Scene configured: ${width}x${height}, ${orientation}`);

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

        console.log(`开始并行加载 ${total} 个资源...`);

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
        console.log('所有脚本加载完成');
    }


    async loadPreloader() {
        return new Promise((resolve) => {
            // 动态获取第一个可用的组合ID
            const compositionId = this.getLoadingCompositionId();
            console.log('使用组合ID:', compositionId);

            const comp = AdobeAn.getComposition(compositionId);
            const lib = comp.getLibrary();
            const loader = new createjs.LoadQueue(false);

            // 检查是否有manifest需要加载
            if (lib.properties.manifest && lib.properties.manifest.length > 0) {
                loader.addEventListener("fileload", (evt) => {
                    const images = comp.getImages();
                    if (evt && evt.item.type === "image") {
                        images[evt.item.id] = evt.result;
                    }
                });

                loader.addEventListener("complete", () => {
                    loader.removeAllEventListeners();

                    const ss = comp.getSpriteSheet();
                    const ssMetadata = lib.ssMetadata;

                    for (let i = 0; i < ssMetadata.length; i++) {
                        ss[ssMetadata[i].name] = new createjs.SpriteSheet({
                            "images": [loader.getResult(ssMetadata[i].name)],
                            "frames": ssMetadata[i].frames
                        });
                    }

                    this.createLoadingElement(lib);

                    resolve();
                });

                // 关键：将 images/ 重定向到 resan/images/
                const remappedManifest = lib.properties.manifest.map(item => ({
                    ...item,
                    src: item.src && item.src.startsWith('images/') ? `resan/${item.src}` : item.src,
                }));

                loader.loadManifest(remappedManifest);
            } else {

                this.createLoadingElement(lib);
                resolve();
            }
        });
    }

    createLoadingElement(lib) {

        // 初始化CreateJS舞台
        this.stage = new createjs.Stage(this.canvas);
        createjs.Ticker.framerate = this.config.scene?.fps || 30;
        createjs.Ticker.addEventListener("tick", this.stageUpdateHandler.bind(this));


        // Stage 创建后立即应用变换
        this.applyStageTransform();


        // 创建loading元件
        this.gl_mc = new lib.loading();
        this.gl_loadBar = this.gl_mc["loadBar"];
        this.gl_loadBar.gotoAndStop(0);

        // 🔥 确保loading元件背景透明
        if (this.gl_mc.graphics) {
            this.gl_mc.graphics.clear();
        }

        this.stage.addChild(this.gl_mc);

        // 获取进度条总帧数
        this.loadBarTotalFrames = this.gl_loadBar.totalFrames || 100;
        console.log(`Loading bar total frames: ${this.loadBarTotalFrames}`);


        // 开始加载游戏配置资源
        // this.startGameConfigLoading();
    }



    async startGameConfigLoading() {

        if (this.__resourcesLoading__) {
            console.warn('⚠️ 资源加载已在进行或完成，跳过重复调用');
            return;
        }
        this.__resourcesLoading__ = true;
        try {
            console.log('🚀 开始加载游戏资源...');

            // 获取游戏配置
            const gameConfig = this.config.gameconfig || {};
            const scripts = gameConfig.scripts || [];
            const sounds = gameConfig.sounds || [];
            const images = gameConfig.images || [];

            // 计算总资源数量
            const totalResources = scripts.length + sounds.length + images.length;

            if (totalResources === 0) {
                console.log('没有游戏资源需要加载，直接切换场景');
                this.updateLoadingProgress(1.0);
                setTimeout(() => {
                    this.switchToGameScene();
                }, 300);
                return;
            }

            let loadedResources = 0;

            // 显示初始进度
            this.updateLoadingProgress(0);

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
            utile.__sdklog2('🎉 所有游戏资源加载完成！');

            // 确保显示100%进度
            this.updateLoadingProgress(1.0);

            this.loadedHandler();

        } catch (error) {
            console.error('游戏资源加载失败:', error);
            // 即使失败也尝试切换场景
        }
    }

    loadedHandler() {


        const bounds = this.gl_mc.getBounds();
        const centerX = bounds ? bounds.width / 2 : 540; // 默认值基于 loading.js 中的设计尺寸
        const centerY = bounds ? bounds.height / 2 : 960;

        console.log('📐 Loading元件尺寸:', bounds, '中心点:', centerX, centerY);

        // 创建等待文本
        this.loadingText = new createjs.Text('正在获取用户数据...', 'bold 32px Arial', '#FFFFFF');
        this.loadingText.textAlign = 'center';
        this.loadingText.x = centerX; // 🔥 loading 元件的中心 X
        this.loadingText.y = centerY - 50; // 🔥 loading 元件中心向上偏移

        // 创建计时器文本
        this.timerText = new createjs.Text('0s', 'bold 24px Arial', '#FFD700');
        this.timerText.textAlign = 'center';
        this.timerText.x = centerX; // 🔥 loading 元件的中心 X
        this.timerText.y = centerY + 20; // 🔥 loading 元件中心向下偏移

        // 创建加载动画点
        this.loadingDots = new createjs.Text('', 'bold 32px Arial', '#FFFFFF');
        this.loadingDots.textAlign = 'center';
        this.loadingDots.x = centerX; // 🔥 loading 元件的中心 X
        this.loadingDots.y = centerY + 60; // 🔥 loading 元件中心向下偏移

        // 添加到 loading 元件中
        this.gl_mc.addChild(this.loadingText);
        this.gl_mc.addChild(this.timerText);
        this.gl_mc.addChild(this.loadingDots);

        // 启动计时器
        this.startUserDataTimer();

        this.startGameLogic();
    }

    /**
     * 启动用户数据加载计时器
     */
    startUserDataTimer() {
        this.userDataStartTime = Date.now();
        this.userDataTimerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.userDataStartTime) / 1000);

            if (this.timerText) {
                this.timerText.text = `${elapsed}s`;

                // 超过10秒显示警告
                if (elapsed > 10) {
                    this.timerText.color = '#FF6B6B';
                    this.loadingText.text = '网络较慢，请稍候...';
                }

                // 超过20秒显示错误提示
                if (elapsed > 20) {
                    this.timerText.color = '#FF0000';
                    this.loadingText.text = '加载超时，将使用游客模式';
                }
            }

        }, 1000);
    }

    /**
     * 登录完成处理
     */
    onLoginComplete() {
        console.log('✅ 用户登录完成');

        // 停止计时器
        if (this.userDataTimerInterval) {
            clearInterval(this.userDataTimerInterval);
            this.userDataTimerInterval = null;
        }

        // 更新界面显示
        if (this.loadingText) {
            this.loadingText.text = 'login...';
            this.loadingText.color = '#00FF00';
        }

        if (this.timerText) {
            this.timerText.text = 'ok';
            this.timerText.color = '#00FF00';
        }

        // 延迟一下让用户看到成功提示，然后切换场景
        setTimeout(() => {
            this.switchToGameScene();
        }, 1000);
    }

    async startGameLogic() {
        console.log('🎮 启动游戏逻辑...');

        // 强制使用微信登录
        window.GameServer.setLoginConfig({
            forceLoginType: 'wechat',
            enableMockLogin: true,
            mockLoginDelay: 5000
        });

        // // 强制使用游客模式
        // window.GameServer.setLoginConfig({
        //     forceLoginType: 'guest'
        // });

        try {
            // 1. 初始化 GameServer（包含完整的用户数据初始化）
            if (!window.GameServer?.isInitialized) {
                console.log('🖥️ 初始化 GameServer...');
                const serverResult = await window.GameServer.init(); // 🔥 改为 await
                if (!serverResult?.success) {
                    console.error('❌ GameServer 初始化失败:', serverResult);
                    return;
                }
            }
            // 2) 无论是否已初始化，都进入登录完成流程
            this.onLoginComplete();
            // // 2. 获取用户状态
            // const userStatus = window.GameServer.currentUserStatus;
            // utile.__sdklog2('📊 用户状态:', userStatus);

            // // 3. 🔥 获取游戏配置数据
            // const gameConfig = window.GameServer.getGameData(
            //     userStatus,
            //     'currentUser',
            //     userStatus.currentLevel,
            //     userStatus.currentStep,
            //     4
            // );
            // utile.__sdklog2('🎯 获取到游戏配置:', gameConfig);

            // // 4. 传递完整数据给 GameScense
            // const gameData = {
            //     engine: this,
            //     stage: this.stage,
            //     exportRoot: this.exportRoot,
            //     canvas: this.canvas,
            //     config: this.config,
            //     loadedSounds: this.loadedSounds,
            //     loadedImages: this.loadedImages,
            //     userStatus: userStatus,
            //     gameConfig: gameConfig // 🔥 传递游戏配置
            // };

            // await window.GameScense.init(gameData);
            // console.log('✅ GameScense 初始化成功');

        } catch (error) {
            console.error('❌ 游戏逻辑启动失败:', error);
        }
    }


    updateLoadingProgress(progress) {
        if (!this.gl_loadBar) return;

        // 确保进度在0-1之间
        progress = Math.max(0, Math.min(1, progress));

        // 将进度转换为帧数（从0开始）
        const targetFrame = Math.floor(progress * (this.loadBarTotalFrames - 1));

        // 更新进度条
        this.gl_loadBar.gotoAndStop(targetFrame);

        // 更新舞台显示
        if (this.stage) {
            this.stage.update();
        }

        const percentage = Math.round(progress * 100);
        // console.log(`📊 Loading progress: ${percentage}% (frame: ${targetFrame}/${this.loadBarTotalFrames - 1})`);

        // 如果达到100%，显示完成信息
        if (progress >= 1.0) {
            console.log('🎯 Loading complete!');
        }
    }

    async switchToGameScene() {
        if (this.__sceneSwitching__) {
            console.warn('⚠️ 场景切换已在进行，跳过重复调用');
            return;
        }
        this.__sceneSwitching__ = true;
        console.log('🔄 切换到GameScene...');
        try {
            // 🔥 第一步：先加载GameScene（保持loading界面显示）
            console.log('📦 预加载GameScene资源...');
            await this.preloadGameScene();

            // 🔥 第二步：GameScene准备完成后，开始切换动画
            console.log('✅ GameScene准备完成，开始切换动画');
            await this.performSceneTransition();

            // 🔥 第三步：清理loading场景
            this.cleanupLoadingScene();

            // 🔥 第四步：激活GameScene
            await this.activateGameScene();

            console.log('🎉 场景切换完成！');

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
            console.log('🎮 预加载游戏组合ID:', gameCompositionId);

            const comp = AdobeAn.getComposition(gameCompositionId);
            const lib = comp.getLibrary();

            // 检查是否有manifest需要加载
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
                    }

                    // console.log(`📦 GameScene资源加载: ${loadedCount}/${totalCount}`);
                });

                loader.addEventListener("complete", () => {
                    loader.removeAllEventListeners();

                    const ss = comp.getSpriteSheet();
                    const ssMetadata = lib.ssMetadata;

                    for (let i = 0; i < ssMetadata.length; i++) {
                        ss[ssMetadata[i].name] = new createjs.SpriteSheet({
                            "images": [loader.getResult(ssMetadata[i].name)],
                            "frames": ssMetadata[i].frames
                        });
                    }

                    // 🔥 预创建GameScene对象（但不添加到舞台）
                    this.preloadedGameScene = {
                        comp: comp,
                        lib: lib,
                        exportRoot: new lib.flygame()
                    };

                    console.log('✅ GameScene资源预加载完成');
                    resolve();
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

                loader.loadManifest(remappedManifest);
            } else {
                // 没有manifest时直接创建
                console.log('📦 GameScene无manifest，直接创建');
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

            console.log('🎭 执行loading淡出动画');

            // loading场景淡出动画
            createjs.Tween.get(this.gl_mc)
                .to({ alpha: 0 }, 500, createjs.Ease.quadOut)
                .call(() => {
                    console.log('✅ Loading淡出完成');
                    resolve();
                });
        });
    }

    /**
     * 清理loading场景
     */
    cleanupLoadingScene() {
        console.log('🧹 清理loading场景');

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
        console.log('🚀 激活GameScene');

        if (!this.preloadedGameScene) {
            console.error('❌ 预加载的GameScene不存在');
            return;
        }



        // this.stopAllMovieClips(this.exportRoot);

        // 🔥 添加预加载的GameScene到舞台
        this.exportRoot = this.preloadedGameScene.exportRoot;

        for (var k in this.exportRoot.children) {
            utile.goStop(this.exportRoot.children[k], true);
        }
        this.exportRoot.visible = false;
        this.stage.addChild(this.exportRoot);



        // 获取用户状态
        const userStatus = window.GameServer.currentUserStatus;
        utile.__sdklog2('📊 用户状态:', userStatus);

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

        this.preloadedGameScene = null;
        // 清理预加载数据
    }


    /**
     * 更新loading进度（支持更精细的进度控制）
     */
    updateLoadingProgress(progress) {
        if (!this.gl_loadBar) return;

        // 确保进度在0-1之间
        progress = Math.max(0, Math.min(1, progress));

        // 将进度转换为帧数（从0开始）
        const targetFrame = Math.floor(progress * (this.loadBarTotalFrames - 1));

        // 更新进度条
        this.gl_loadBar.gotoAndStop(targetFrame);

        // 更新舞台显示
        if (this.stage) {
            this.stage.update();
        }

        const percentage = Math.round(progress * 100);
        // console.log(`📊 Loading progress: ${percentage}% (frame: ${targetFrame}/${this.loadBarTotalFrames - 1})`);

        // 如果达到100%，显示完成信息
        if (progress >= 1.0) {
            console.log('🎯 Loading complete!');
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
        console.log('🎯 基本资源加载完成，隐藏HTML加载界面');
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

        // 检查是否允许自动播放
        // if (!this.audioEnabled && !options.userTriggered) {
        //     console.warn(`🎵 浏览器阻止自动播放，需要用户交互: ${id}`);
        //     return null;
        // }
        const isMusicEnabled = localStorage.getItem('musicEnabled') === null || localStorage.getItem('musicEnabled') === 'true'; // 默认开启音乐
        const isSoundEnabled = localStorage.getItem('soundEnabled') === null || localStorage.getItem('soundEnabled') === 'true'; // 默认开启音效

        if (id === 'bgm') {
            if (!isMusicEnabled) {
                this.stopSound("bgm")
                return
            }
            if (this.soundStatus[id]) {

                return
            } else {
                setTimeout(() => {
                    // this.playSound('bgm', { loop: -1 });
                    if (createjs.Sound.muted) createjs.Sound.muted = false
                    createjs.Sound.play(id, options);
                }, 100)
            }

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
                        console.log(`🎵 声音正在播放: ${id}`);
                        this.soundStatus[id] = true;
                    } else if (instance.playState === createjs.Sound.PLAY_FAILED) {
                        console.error(`🎵 声音播放失败: ${id}`);
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
            this.soundStatus[id] = false;
            console.log(`🎵 停止声音: ${id}`);
        } catch (error) {
            console.error(`🎵 停止声音异常: ${id}`, error);
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
            console.log(`🎵 设置音量: ${clampedVolume}`);
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

        // 检查音效是否正在播放
        return this.soundStatus[soundName]


    }

    setupAutoplayHandler() {
        const enableAudio = () => {
            if (!this.audioEnabled) {
                console.log('🎵 用户交互检测到，启用音频');
                this.audioEnabled = true;
                // 仅此处解锁并播放 BGM
                createjs.Sound.muted = false;
                this.playSound('bgm', { loop: -1, volume: 0.5, userTriggered: true });
            }
            document.removeEventListener('click', enableAudio);
            document.removeEventListener('touchstart', enableAudio);
            document.removeEventListener('keydown', enableAudio);
        };
        document.addEventListener('click', enableAudio);
        document.addEventListener('touchstart', enableAudio);
        document.addEventListener('keydown', enableAudio);
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
        console.log('🔍 gameConfig:', gameConfig);

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

        console.log('📦 准备加载的资源清单:', mainJson);

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
                console.log(`脚本已缓存: ${src}`);
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
            console.log(`🎵 声音已加载，跳过: ${id}`);
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
                    // 声音加载失败不阻止游戏运行
                    try {
                        await this.loadSound(id, src);
                        // console.log(`✅ 声音加载完成: ${src}`);
                    } catch (soundError) {
                        console.warn(`⚠️ 声音加载失败，但不影响游戏运行: ${src}`, soundError.message);
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