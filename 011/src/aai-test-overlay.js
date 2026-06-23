/**
 * AAI 数值模型测试插件
 * 全局顶层覆盖，不与游戏界面冲突，按钮弹窗式打开
 * 功能：计时器、广告触发统计、失败/关卡/奖励提示、成长曲线、广告日志
 */
(function () {
    'use strict';

    // 只在测试环境启用，生产环境（wx/androip/gd 等平台）默认不加载即可
    if (window.AAITestOverlay) return;

    const START_TIME = Date.now();
    const history = [{ t: 0, level: 1 }];
    const adLog = [];
    const adCounters = { total: 0, interstitial: 0, rewarded: 0, banner: 0 };
    let latestEvent = '等待游戏事件...';

    function formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    function getGameServer() {
        return window.GameServer || null;
    }

    function getGameScense() {
        return window.GameScense || null;
    }

    function readGameState() {
        const gs = getGameServer();
        if (!gs) return { level: 1, target: 4, score: 0, best: 0 };
        const ss = gs.scoreSystem || {};
        return {
            level: gs.level || 1,
            target: gs.targetEggType || 4,
            score: ss.totalScore || 0,
            best: ss.bestScore || 0
        };
    }

    function onAdTriggered(type) {
        adCounters.total += 1;
        if (type === '插屏') adCounters.interstitial += 1;
        if (type === '激励视频') adCounters.rewarded += 1;
        if (type === 'Banner') adCounters.banner += 1;
        const entry = { time: formatTime(Date.now() - START_TIME), type, rawTime: Date.now() };
        adLog.unshift(entry);
        if (adLog.length > 50) adLog.pop();
        render();
    }

    function onLog(text) {
        if (typeof text !== 'string') return;
        // 过滤并显示关键事件
        if (text.includes('关卡完成') || text.includes('恭喜解锁神龙')) {
            latestEvent = `🎉 胜利：${text}`;
        } else if (text.includes('游戏结束') || text.includes('地图已满') || text.includes('game_over')) {
            latestEvent = `💀 失败：${text}`;
        } else if (text.includes('奖励结算') || text.includes('获得')) {
            latestEvent = `💰 奖励：${text}`;
        } else if (text.includes('复活成功')) {
            latestEvent = `💖 复活：${text}`;
        } else if (text.includes('进入第')) {
            latestEvent = `🚀 关卡：${text}`;
        }
    }

    // Hook console.log 以捕获关键事件文本
    const originalLog = console.log;
    console.log = function () {
        const text = Array.prototype.slice.call(arguments).map(function (a) {
            return typeof a === 'string' ? a : '';
        }).join(' ');
        onLog(text);
        originalLog.apply(this, arguments);
    };

    // Hook 广告函数
    function hookAdFn(obj, name, type) {
        if (!obj || typeof obj[name] !== 'function') return;
        const orig = obj[name];
        obj[name] = function (callback, opts) {
            onAdTriggered(type);
            return orig.call(this, callback, opts);
        };
    }

    function installAdHooks() {
        // ovo 包装层
        if (window.ovo) {
            hookAdFn(window.ovo, 'showInterstitialAd', '插屏');
            hookAdFn(window.ovo, 'showRewardedAd', '激励视频');
            hookAdFn(window.ovo, 'showBannerAd', 'Banner');
        }
        // 平台原生方法
        hookAdFn(window, 'showInterstitialAd', '插屏');
        hookAdFn(window, 'showRewardedAd', '激励视频');
        hookAdFn(window, 'showBannerAd', 'Banner');
    }

    // 创建样式
    function createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #aai-test-toggle {
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 2147483647;
                padding: 6px 12px;
                background: rgba(0, 0, 0, 0.75);
                color: #00ff88;
                border: 1px solid #00ff88;
                border-radius: 6px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                font-size: 13px;
                font-weight: bold;
                cursor: pointer;
                user-select: none;
                pointer-events: auto;
                backdrop-filter: blur(4px);
            }
            #aai-test-toggle:hover { background: rgba(0, 0, 0, 0.9); }
            #aai-test-panel {
                position: fixed;
                top: 46px;
                right: 10px;
                width: 360px;
                max-height: 80vh;
                overflow-y: auto;
                z-index: 2147483646;
                background: rgba(20, 20, 25, 0.92);
                color: #eee;
                border: 1px solid #444;
                border-radius: 10px;
                padding: 12px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                font-size: 12px;
                line-height: 1.5;
                pointer-events: auto;
                backdrop-filter: blur(6px);
                box-shadow: 0 8px 32px rgba(0,0,0,0.5);
                display: none;
            }
            #aai-test-panel h3 {
                margin: 0 0 10px 0;
                color: #00ff88;
                font-size: 14px;
                border-bottom: 1px solid #444;
                padding-bottom: 6px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            #aai-test-panel .section {
                margin-bottom: 12px;
                padding: 8px;
                background: rgba(255,255,255,0.05);
                border-radius: 6px;
            }
            #aai-test-panel .row { display: flex; justify-content: space-between; margin: 3px 0; }
            #aai-test-panel .label { color: #aaa; }
            #aai-test-panel .value { color: #fff; font-weight: bold; }
            #aai-test-panel .event-text {
                color: #ffd700;
                font-size: 11px;
                word-break: break-all;
                min-height: 18px;
            }
            #aai-test-panel canvas { background: rgba(0,0,0,0.3); border-radius: 4px; width: 100%; }
            #aai-test-panel .ad-log {
                max-height: 120px;
                overflow-y: auto;
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                font-size: 11px;
            }
            #aai-test-panel .ad-log-item { padding: 2px 0; border-bottom: 1px solid #333; }
            #aai-test-panel .close-btn {
                color: #ff6b6b;
                cursor: pointer;
                font-size: 16px;
                line-height: 1;
            }
        `;
        document.head.appendChild(style);
    }

    let panelEl;
    let timerEl;
    let levelEl;
    let targetEl;
    let scoreEl;
    let bestEl;
    let adTotalEl;
    let adInterstitialEl;
    let adRewardedEl;
    let adBannerEl;
    let eventEl;
    let canvasEl;
    let logEl;

    function createPanel() {
        const toggle = document.createElement('div');
        toggle.id = 'aai-test-toggle';
        toggle.textContent = 'AAI 测试';
        document.body.appendChild(toggle);

        panelEl = document.createElement('div');
        panelEl.id = 'aai-test-panel';
        panelEl.innerHTML = `
            <h3>AAI 数值测试面板 <span class="close-btn">✕</span></h3>
            <div class="section">
                <div class="row"><span class="label">运行时间</span><span class="value" id="aai-timer">00:00</span></div>
                <div class="row"><span class="label">当前关卡</span><span class="value" id="aai-level">-</span></div>
                <div class="row"><span class="label">目标等级</span><span class="value" id="aai-target">-</span></div>
                <div class="row"><span class="label">金币/总分</span><span class="value" id="aai-score">-</span></div>
                <div class="row"><span class="label">历史最高</span><span class="value" id="aai-best">-</span></div>
            </div>
            <div class="section">
                <div class="row"><span class="label">广告总触发</span><span class="value" id="aai-ad-total">0</span></div>
                <div class="row"><span class="label">插屏</span><span class="value" id="aai-ad-interstitial">0</span></div>
                <div class="row"><span class="label">激励视频</span><span class="value" id="aai-ad-rewarded">0</span></div>
                <div class="row"><span class="label">Banner</span><span class="value" id="aai-ad-banner">0</span></div>
            </div>
            <div class="section">
                <div class="label">最近事件</div>
                <div class="event-text" id="aai-event">等待游戏事件...</div>
            </div>
            <div class="section">
                <div class="label">成长曲线（横轴：分钟 / 纵轴：关卡）</div>
                <canvas id="aai-curve" width="320" height="160"></canvas>
            </div>
            <div class="section">
                <div class="label">广告触发日志</div>
                <div class="ad-log" id="aai-ad-log">暂无记录</div>
            </div>
        `;
        document.body.appendChild(panelEl);

        timerEl = document.getElementById('aai-timer');
        levelEl = document.getElementById('aai-level');
        targetEl = document.getElementById('aai-target');
        scoreEl = document.getElementById('aai-score');
        bestEl = document.getElementById('aai-best');
        adTotalEl = document.getElementById('aai-ad-total');
        adInterstitialEl = document.getElementById('aai-ad-interstitial');
        adRewardedEl = document.getElementById('aai-ad-rewarded');
        adBannerEl = document.getElementById('aai-ad-banner');
        eventEl = document.getElementById('aai-event');
        canvasEl = document.getElementById('aai-curve');
        logEl = document.getElementById('aai-ad-log');

        function togglePanel() {
            const isVisible = panelEl.style.display === 'block';
            panelEl.style.display = isVisible ? 'none' : 'block';
        }
        toggle.addEventListener('click', togglePanel);
        panelEl.querySelector('.close-btn').addEventListener('click', function () {
            panelEl.style.display = 'none';
        });
    }

    function drawCurve() {
        const ctx = canvasEl.getContext('2d');
        const width = canvasEl.width;
        const height = canvasEl.height;
        const padding = { top: 10, right: 10, bottom: 24, left: 28 };
        const chartW = width - padding.left - padding.right;
        const chartH = height - padding.top - padding.bottom;

        ctx.clearRect(0, 0, width, height);

        // 计算坐标范围
        const maxMinutes = Math.max(3, Math.ceil((Date.now() - START_TIME) / 60000));
        const maxLevel = Math.max(8, ...history.map(h => h.level));

        // 网格
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= maxMinutes; i++) {
            const x = padding.left + (i / maxMinutes) * chartW;
            ctx.beginPath(); ctx.moveTo(x, padding.top); ctx.lineTo(x, height - padding.bottom); ctx.stroke();
        }
        for (let i = 1; i <= maxLevel; i++) {
            const y = padding.top + chartH - (i / maxLevel) * chartH;
            ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(width - padding.right, y); ctx.stroke();
        }

        // 坐标轴
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        ctx.moveTo(padding.left, padding.top);
        ctx.lineTo(padding.left, height - padding.bottom);
        ctx.lineTo(width - padding.right, height - padding.bottom);
        ctx.stroke();

        // 标签
        ctx.fillStyle = '#aaa';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        for (let i = 0; i <= maxMinutes; i++) {
            const x = padding.left + (i / maxMinutes) * chartW;
            ctx.fillText(i + '分', x, height - 6);
        }
        ctx.textAlign = 'right';
        for (let i = 1; i <= maxLevel; i += Math.ceil(maxLevel / 6)) {
            const y = padding.top + chartH - (i / maxLevel) * chartH + 3;
            ctx.fillText('L' + i, padding.left - 4, y);
        }

        // 绘制曲线
        if (history.length < 2) return;
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2;
        ctx.beginPath();
        history.forEach(function (point, idx) {
            const t = (point.t / 1000) / 60;
            const x = padding.left + (t / maxMinutes) * chartW;
            const y = padding.top + chartH - (point.level / maxLevel) * chartH;
            if (idx === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // 点
        ctx.fillStyle = '#ffd700';
        history.forEach(function (point) {
            const t = (point.t / 1000) / 60;
            const x = padding.left + (t / maxMinutes) * chartW;
            const y = padding.top + chartH - (point.level / maxLevel) * chartH;
            ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
        });
    }

    let lastHistoryPush = 0;
    function updateHistory(state) {
        const now = Date.now() - START_TIME;
        const shouldPush = now - lastHistoryPush > 5000 || history[history.length - 1].level !== state.level;
        if (shouldPush) {
            history.push({ t: now, level: state.level });
            lastHistoryPush = now;
        }
    }

    function render() {
        const elapsed = Date.now() - START_TIME;
        const state = readGameState();

        timerEl.textContent = formatTime(elapsed);
        levelEl.textContent = state.level;
        targetEl.textContent = state.target;
        scoreEl.textContent = state.score;
        bestEl.textContent = state.best;

        adTotalEl.textContent = adCounters.total;
        adInterstitialEl.textContent = adCounters.interstitial;
        adRewardedEl.textContent = adCounters.rewarded;
        adBannerEl.textContent = adCounters.banner;

        eventEl.textContent = latestEvent;

        updateHistory(state);
        drawCurve();

        if (adLog.length === 0) {
            logEl.innerHTML = '暂无记录';
        } else {
            logEl.innerHTML = adLog.map(function (entry) {
                return `<div class="ad-log-item">[${entry.time}] ${entry.type}</div>`;
            }).join('');
        }
    }

    function startLoop() {
        setInterval(render, 500);
        render();
    }

    function init() {
        if (!document.body) {
            setTimeout(init, 50);
            return;
        }
        createStyles();
        createPanel();
        installAdHooks();
        startLoop();
        window.AAITestOverlay = { history: history, adLog: adLog, counters: adCounters };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
