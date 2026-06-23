// import androidAd;


if (typeof window !== 'undefined') window.ovo = window.ovo || {};
const ovo = (typeof window !== 'undefined') ? window.ovo : {};

// Banner广告标志（不再限制只显示一次，支持首页/设置页常驻切换）
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

    // AAI：不再限制 Banner 只显示一次，允许首页/设置页多次显示
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
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ovo;
}
export default ovo;