/**
 * 微信小游戏平台层覆盖
 * 覆盖 011 原项目中的平台相关逻辑：音频、广告、统计、登录、振动等。
 * 在 vendor-animate.js（CreateJS/AdobeAn）加载完成后执行。
 */

(function () {
    const G = typeof globalThis !== 'undefined' ? globalThis : window;
    const isWX = typeof wx !== 'undefined';

    // 1. 平台标识覆盖为微信小游戏
    G.Platform = 'wechat';

    // 1.1 默认开启音效/音乐（首次适配时强制重置一次，后续尊重用户手动设置）
    try {
        if (G.localStorage && G.localStorage.getItem('__wx_sound_defaults_v1__') !== 'done') {
            G.localStorage.setItem('soundEnabled', 'true');
            G.localStorage.setItem('musicEnabled', 'true');
            G.localStorage.setItem('__wx_sound_defaults_v1__', 'done');
        }
    } catch (e) {}

    // 2. ovo SDK 覆盖
    const ovo = G.ovo || (G.ovo = {});

    // 日志/埋点：优先使用微信官方分析，否则控制台输出
    function report(eventName, data) {
        if (isWX && wx.reportAnalytics) {
            try { wx.reportAnalytics(eventName, data || {}); } catch (e) {}
        }
        console.log('[wx-ovo]', eventName, data);
    }

    ovo.dotScore = function (score, level) { report('score_update', { score, level }); };
    ovo.dotGameStart = function (level, role) { report('game_start', { level, role }); };
    ovo.dotGameOver = function (score, level, reason) { report('game_over', { score, level, reason }); };
    ovo.dotGameWin = function (score, level, stars) { report('game_win', { score, level, stars }); };
    ovo.dotSelectContent = function (type, id) { report('select_content', { type, id }); };
    ovo.dotTutorialComplete = function () { report('tutorial_complete', {}); };
    ovo.dotLevelStart = function (level) { report('level_start', { level }); };
    ovo.dotLevelComplete = function (level, score) { report('level_complete', { level, score }); };
    ovo.dotAdStart = function (type) { report('ad_start', { type }); };
    ovo.dotAdComplete = function (type) { report('ad_complete', { type }); };

    // 振动
    ovo.vibrate = function (pattern) {
        if (!isWX) return false;
        try {
            if (Array.isArray(pattern) && pattern.length > 1) {
                wx.vibrateLong();
            } else {
                wx.vibrateShort({ type: 'light' });
            }
            return true;
        } catch (e) { return false; }
    };

    // 广告配置（请替换为真实广告单元 ID）
    const AD_CONFIG = {
        bannerAdUnitId: '',
        interstitialAdUnitId: '',
        rewardedVideoAdUnitId: '',
        videoAdUnitId: ''
    };
    G.__wxAdConfig__ = AD_CONFIG;

    let bannerAd = null;
    function createBannerAd() {
        if (!isWX || !wx.createBannerAd || !AD_CONFIG.bannerAdUnitId) return null;
        try {
            const sys = wx.getSystemInfoSync();
            return wx.createBannerAd({
                adUnitId: AD_CONFIG.bannerAdUnitId,
                style: { left: 0, top: sys.windowHeight - 80, width: sys.windowWidth }
            });
        } catch (e) { return null; }
    }

    function _showBannerAd(callback) {
        if (!isWX) { if (callback) callback(false); return; }
        if (!bannerAd) bannerAd = createBannerAd();
        if (!bannerAd) { if (callback) callback(false); return; }
        bannerAd.show().then(() => {
            ovo.bannerShown = true;
            if (callback) callback(true);
        }).catch((err) => {
            console.warn('[wx-ovo] banner show failed', err);
            if (callback) callback(false);
        });
    }
    function _hideBannerAd(callback) {
        if (!isWX) { if (callback) callback(false); return; }
        if (!bannerAd) { if (callback) callback(false); return; }
        bannerAd.hide().then(() => {
            ovo.bannerShown = false;
            if (callback) callback(true);
        }).catch(() => { if (callback) callback(false); });
    }
    ovo.showBannerAd = _showBannerAd;
    ovo.hideBannerAd = _hideBannerAd;

    let interstitialAd = null;
    function _showInterstitialAd(callback) {
        if (!isWX) { if (callback) callback(false); return; }
        if (!wx.createInterstitialAd || !AD_CONFIG.interstitialAdUnitId) { if (callback) callback(false); return; }
        if (!interstitialAd) interstitialAd = wx.createInterstitialAd({ adUnitId: AD_CONFIG.interstitialAdUnitId });
        interstitialAd.show().then(() => {
            ovo.lastInterstitialAdTime = Date.now();
            if (callback) callback(true);
        }).catch((err) => {
            console.warn('[wx-ovo] interstitial show failed', err);
            if (callback) callback(false);
        });
    }
    ovo.showInterstitialAd = _showInterstitialAd;

    let rewardedAd = null;
    function _showRewardedAd(callback) {
        if (!isWX || !wx.createRewardedVideoAd || !AD_CONFIG.rewardedVideoAdUnitId) { if (callback) callback(false); return; }
        if (!rewardedAd) rewardedAd = wx.createRewardedVideoAd({ adUnitId: AD_CONFIG.rewardedVideoAdUnitId });
        rewardedAd.show().catch(() => {
            rewardedAd.load().then(() => rewardedAd.show()).catch((err) => {
                console.warn('[wx-ovo] rewarded load failed', err);
                if (callback) callback(false);
            });
        });
        const onClose = (res) => {
            rewardedAd.offClose(onClose);
            ovo.lastRewardedAdTime = Date.now();
            if (callback) callback(!!res && res.isEnded);
        };
        rewardedAd.onClose(onClose);
    }
    ovo.showRewardedAd = _showRewardedAd;

    // 兼容旧代码中的 window.showBannerAd / window.hideBannerAd 桥
    // 使用内部函数引用，避免 bundle.js 覆盖 ovo.showBannerAd 后形成循环调用
    G.showBannerAd = function (cb) { _showBannerAd(cb); };
    G.hideBannerAd = function (cb) { _hideBannerAd(cb); };
    G.showInterstitialAd = function (cb) { _showInterstitialAd(cb); };
    G.showRewardedAd = function (cb) { _showRewardedAd(cb); };

    // gtag 兜底
    G.gtag = G.gtag || function () { console.log('[gtag]', arguments); };
    G.dataLayer = G.dataLayer || [];

    // 3. CreateJS Sound 微信音频覆盖（使用 Proxy，避免非 configurable 的 muted/volume 无法 redefine）
    if (typeof createjs !== 'undefined' && createjs.Sound) {
        const S = createjs.Sound;
        const audioMap = {};     // id -> InnerAudioContext
        const instanceList = []; // 当前播放实例
        let wxMuted = false;
        let wxVolume = 1;

        function resolveSrc(src) {
            if (!src) return '';
            if (src.indexOf('://') !== -1 || src.startsWith('/')) return src;
            return src;
        }

        function createInnerAudio(src) {
            if (!isWX || !wx.createInnerAudioContext) return null;
            const a = wx.createInnerAudioContext();
            a.src = resolveSrc(src);
            a.volume = wxMuted ? 0 : wxVolume;
            return a;
        }

        function updateAllVolumes() {
            for (const id in audioMap) {
                const a = audioMap[id];
                if (a) a.volume = wxMuted ? 0 : wxVolume;
            }
            instanceList.forEach(inst => {
                if (inst._audio) inst._audio.volume = wxMuted ? 0 : (inst._baseVolume * wxVolume);
            });
        }

        function dispatchFileLoad(id, src) {
            if (S.dispatchEvent) {
                try { S.dispatchEvent({ type: 'fileload', id: id, src: src, item: { id: id, src: src } }); } catch (e) {}
            }
        }
        function dispatchFileError(id, src, msg) {
            if (S.dispatchEvent) {
                try { S.dispatchEvent({ type: 'fileerror', id: id, src: src, message: msg }); } catch (e) {}
            }
        }

        function registerSound(src, id, data, basePath, defaultPlayProps) {
            if (typeof src === 'object') { id = src.id; src = src.src; }
            if (!id) id = src;
            if (audioMap[id]) return { src: src, id: id };
            const a = createInnerAudio(src);
            if (!a) { dispatchFileError(id, src, 'createInnerAudioContext failed'); return null; }
            audioMap[id] = a;
            a.onCanplay(function () {
                if (!a._loaded) {
                    a._loaded = true;
                    dispatchFileLoad(id, src);
                }
            });
            a.onError(function (res) {
                dispatchFileError(id, src, res ? res.errMsg : 'unknown');
            });
            a.onPlay(function () {
                if (!a._loaded) {
                    a._loaded = true;
                    dispatchFileLoad(id, src);
                }
            });
            return { src: src, id: id };
        }

        function registerSounds(sounds, basePath) {
            if (!Array.isArray(sounds)) return [];
            return sounds.map(s => registerSound(s.src, s.id, s.data, basePath, s.defaultPlayProps));
        }

        function loadComplete(id) {
            const a = audioMap[id];
            return !!a && a._loaded;
        }

        function removeSound(id) {
            const a = audioMap[id];
            if (a) { try { a.destroy(); } catch (e) {} delete audioMap[id]; }
        }
        function removeAllSounds() {
            for (const id in audioMap) removeSound(id);
        }

        function WxAudioInstance(id, src, options) {
            options = options || {};
            this.id = id;
            this.src = src;
            this.playState = S.PLAY_SUCCEEDED;
            this.paused = false;
            this._loop = options.loop === -1 || !!options.loop;
            this._baseVolume = (typeof options.volume === 'number') ? options.volume : 1;
            this._audio = audioMap[id];
            if (!this._audio) {
                this._audio = createInnerAudio(src);
                if (this._audio) audioMap[id] = this._audio;
            }
            if (this._audio) {
                this._audio.loop = this._loop;
                this._audio.volume = wxMuted ? 0 : (this._baseVolume * wxVolume);
                try { this._audio.stop(); this._audio.seek(0); this._audio.play(); } catch (e) {}
                const self = this;
                this._audio.onEnded(function () {
                    self.paused = true;
                    self.playState = S.PLAY_FAILED;
                });
                this._audio.onPause(function () { self.paused = true; });
                this._audio.onPlay(function () { self.paused = false; self.playState = S.PLAY_SUCCEEDED; });
            }
            instanceList.push(this);
        }
        WxAudioInstance.prototype.pause = function () {
            if (this._audio) this._audio.pause();
            this.paused = true;
        };
        WxAudioInstance.prototype.resume = function () {
            if (this._audio) this._audio.play();
            this.paused = false;
        };
        WxAudioInstance.prototype.play = function () {
            if (this._audio) { try { this._audio.stop(); this._audio.seek(0); this._audio.play(); } catch (e) {} }
            this.paused = false;
            this.playState = S.PLAY_SUCCEEDED;
        };
        WxAudioInstance.prototype.stop = function () {
            if (this._audio) { try { this._audio.stop(); } catch (e) {} }
            this.paused = true;
            this.playState = S.PLAY_FAILED;
        };
        WxAudioInstance.prototype.setPaused = function (v) {
            if (v) this.pause(); else this.resume();
        };
        WxAudioInstance.prototype.setVolume = function (v) {
            this._baseVolume = v;
            if (this._audio) this._audio.volume = wxMuted ? 0 : (v * wxVolume);
        };
        WxAudioInstance.prototype.setLoop = function (v) {
            this._loop = v === -1 || !!v;
            if (this._audio) this._audio.loop = this._loop;
        };
        WxAudioInstance.prototype.destroy = function () {
            this.stop();
            const i = instanceList.indexOf(this);
            if (i !== -1) instanceList.splice(i, 1);
        };

        function createInstance(id) {
            const src = audioMap[id] ? audioMap[id].src : id;
            return new WxAudioInstance(id, src, {});
        }
        function play(id, options) {
            return new WxAudioInstance(id, audioMap[id] ? audioMap[id].src : id, options);
        }
        function stop(id) {
            if (id) {
                const a = audioMap[id];
                if (a) { try { a.stop(); } catch (e) {} }
            } else {
                instanceList.forEach(inst => inst.stop());
            }
        }
        function setMute(value) {
            wxMuted = !!value;
            updateAllVolumes();
        }
        function setVolume(value) {
            wxVolume = Math.max(0, Math.min(1, value));
            updateAllVolumes();
        }

        const wxSoundProxy = new Proxy(S, {
            get(target, prop) {
                if (prop === 'muted') return wxMuted;
                if (prop === 'volume') return wxVolume;
                if (prop === 'registerPlugins') return function () { return true; };
                if (prop === 'initializeDefaultPlugins') return function () { return true; };
                if (prop === 'isReady') return function () { return true; };
                if (prop === 'capabilities') return { mp3: true, ogg: false, m4a: true, wav: false };
                if (prop === 'registerSound') return registerSound;
                if (prop === 'registerSounds') return registerSounds;
                if (prop === 'loadComplete') return loadComplete;
                if (prop === 'removeSound') return removeSound;
                if (prop === 'removeAllSounds') return removeAllSounds;
                if (prop === 'play') return play;
                if (prop === 'createInstance') return createInstance;
                if (prop === 'stop') return stop;
                if (prop === 'setMute') return setMute;
                if (prop === 'setVolume') return setVolume;
                return target[prop];
            },
            set(target, prop, value) {
                if (prop === 'muted') { wxMuted = !!value; updateAllVolumes(); return true; }
                if (prop === 'volume') { wxVolume = Math.max(0, Math.min(1, value)); updateAllVolumes(); return true; }
                target[prop] = value;
                return true;
            }
        });

        createjs.Sound = wxSoundProxy;
        console.log('[wx-sdk-shim] CreateJS Sound 已接管为微信 InnerAudioContext');

        // 微信 createImage() 返回的不是标准 HTMLImageElement，Patch isImageTag 判断
        function isWxImageTag(item) {
            return !!(item && typeof item.src === 'string' && 'width' in item && 'height' in item);
        }
        if (createjs.LoadItem && createjs.LoadItem.isImageTag) {
            createjs.LoadItem.isImageTag = function (item) {
                return isWxImageTag(item);
            };
        }
        if (createjs.DomUtils && createjs.DomUtils.isImageTag) {
            createjs.DomUtils.isImageTag = function (item) {
                return isWxImageTag(item);
            };
        }

        // 微信图片对象可能没有 complete 属性；若缺失则尝试安全写入，避免 PreloadJS 格式化阶段卡住
        function safeSetTagComplete(tag) {
            if (!tag || tag.complete === true) return;
            try { tag.complete = true; return; } catch (e) {}
            try { Object.defineProperty(tag, 'complete', { value: true, configurable: true, enumerable: true, writable: true }); return; } catch (e) {}
            try { Object.defineProperty(tag, 'complete', { value: true, configurable: true, enumerable: true }); return; } catch (e) {}
        }
        if (createjs.TagRequest && createjs.TagRequest.prototype._handleTagComplete) {
            const origHandleTagComplete = createjs.TagRequest.prototype._handleTagComplete;
            createjs.TagRequest.prototype._handleTagComplete = function () {
                if (this._tag) { safeSetTagComplete(this._tag); }
                return origHandleTagComplete.apply(this, arguments);
            };
        }

        // 修复：CreateJS 的点击命中测试 canvas 若与主 canvas 为同一个对象，
        // 命中测试时绘制的内容会直接闪现在主 canvas 左上角。
        // 这里强制把命中测试移到离屏 canvas，并增加降级与校验。
        if (createjs.DisplayObject) {
            try {
                function makeOffscreenCanvas() {
                    if (isWX && wx.createOffscreenCanvas) {
                        try { return wx.createOffscreenCanvas({ type: '2d' }); } catch (e) {}
                    }
                    return null;
                }
                createjs.createCanvas = createjs.createCanvas || makeOffscreenCanvas;
                const hitCanvas = makeOffscreenCanvas();
                if (hitCanvas && hitCanvas.getContext) {
                    hitCanvas.width = hitCanvas.height = 1;
                    let ctx = null;
                    try { ctx = hitCanvas.getContext('2d', { willReadFrequently: true }); } catch (e) {}
                    if (!ctx) { try { ctx = hitCanvas.getContext('2d'); } catch (e) {} }
                    // 安全校验：确保没有命中到上屏 canvas
                    const mainCanvas = (typeof document !== 'undefined' && document.getElementById) ? document.getElementById('canvas') : null;
                    if (ctx && hitCanvas !== mainCanvas) {
                        createjs.DisplayObject._hitTestCanvas = hitCanvas;
                        createjs.DisplayObject._hitTestContext = ctx;
                        console.log('[wx-sdk-shim] 命中测试 canvas 已替换为离屏 canvas');
                    } else {
                        console.warn('[wx-sdk-shim] 命中测试 canvas 校验失败，仍可能闪烁');
                    }
                } else {
                    console.warn('[wx-sdk-shim] 无法创建离屏 canvas，命中测试可能闪烁');
                }
            } catch (e) {
                console.warn('[wx-sdk-shim] 替换命中测试 canvas 失败', e);
            }
        }

        // 修复：Stage._getElementRect 在微信 canvas 上可能返回 null，导致点击判定失败
        if (createjs.Stage && createjs.Stage.prototype) {
            const proto = createjs.Stage.prototype;
            proto._getElementRect = function (e) {
                const dpr = G.devicePixelRatio || 1;
                let bounds;
                try { bounds = e.getBoundingClientRect(); } catch (err) {}
                if (!bounds || bounds.left == null || bounds.top == null || bounds.width == null || bounds.height == null) {
                    const w = e.width ? e.width / dpr : (G.innerWidth || 0);
                    const h = e.height ? e.height / dpr : (G.innerHeight || 0);
                    bounds = { left: 0, top: 0, right: w, bottom: h, width: w, height: h };
                }
                const offX = (G.pageXOffset || G.document && G.document.scrollLeft || 0) - (G.document && G.document.clientLeft || G.document && G.document.body && G.document.body.clientLeft || 0);
                const offY = (G.pageYOffset || G.document && G.document.scrollTop || 0) - (G.document && G.document.clientTop || G.document && G.document.body && G.document.body.clientTop || 0);
                const styles = G.getComputedStyle ? G.getComputedStyle(e) : {};
                const padL = parseInt(styles && styles.paddingLeft) || 0;
                const padT = parseInt(styles && styles.paddingTop) || 0;
                const padR = parseInt(styles && styles.paddingRight) || 0;
                const padB = parseInt(styles && styles.paddingBottom) || 0;
                return {
                    left: bounds.left + offX + padL,
                    right: bounds.right + offX - padR,
                    top: bounds.top + offY + padT,
                    bottom: bounds.bottom + offY - padB
                };
            };
        }
    } else {
        console.warn('[wx-sdk-shim] createjs.Sound 不存在，音频垫片未生效');
    }

    // 4. 暴露配置修改入口
    G.__setWxAdConfig__ = function (cfg) {
        Object.assign(AD_CONFIG, cfg);
        console.log('[wx-sdk-shim] 广告配置已更新', AD_CONFIG);
    };
})();
