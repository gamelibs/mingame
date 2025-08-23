// ...existing code...
import utile from './utile.js';
import config from './config.js';
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
                this.config = config || {};
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
            this.config = config || {};
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

        // 更新进度条到 100%
        this.updateLoadingProgress(1.0);

        // 更新 HTML 界面显示，提示用户点击进入游戏
        const loadingText = document.querySelector('.loading-text');

        // If the platform is GameDistribution, require an explicit click to enter.
        // Otherwise, continue immediately (original default behavior).
        if (typeof window !== 'undefined' && window.Platform === 'gamedistribution') {
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

                // report click-to-enter using standard GA4 event
                try {
                    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                        window.gtag('event', 'select_content', { 
                            content_type: 'game_action',
                            content_id: 'enter_game_click',
                            platform: window.Platform || 'unknown',
                            send: 'sdk'
                        });
                    }
                } catch (e) { }

                // On GameDistribution, show an interstitial ad first (if available) then enter.
                try {
                    if (typeof window !== 'undefined' && typeof window.showInterstitialAd === 'function') {
                        window.showInterstitialAd(() => {
                            try { this.switchToGameScene(); } catch (e) { console.warn('switchToGameScene failed after ad', e); }
                        });
                        return;
                    }
                } catch (e) { 
                    try { window.__sdklog2 && window.__sdklog2('window.preloadAd error', e); } catch (e) { } 
                    try { this.switchToGameScene(); } catch (e) { console.warn('switchToGameScene failed after ad', e); }
                }

                // Fallback: no ad API, enter immediately
                this.switchToGameScene();
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
        console.log('🔄 切换到GameScene...');
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

                        console.log('✅ GameScene资源预加载完成');
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

                    console.log('📦 preloadGameScene: loading manifest items=', remappedManifest.length);
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
            utile.goStop(this.exportRoot.children[k], true);
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
            if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                window.gtag('event', 'level_start', { 
                    level_name: 'main_game',
                    character: 'player',
                    send: 'sdk'
                });
                console.log('🎮 level_start 事件已发送');
            }
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

            // 如果达到100%，显示完成信息
            if (progress >= 1.0) {
                console.log('🎯 Loading complete!');
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