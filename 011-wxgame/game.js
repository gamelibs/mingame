/**
 * 011 Dragon Egg 微信小游戏入口
 * 流程：安装 BOM/DOM 垫片 → 加载 CreateJS/AdobeAn → 覆盖平台能力 → 加载游戏逻辑 → 触发启动。
 */

function showFatalError(message, detail) {
    console.error('[game.js] FATAL ERROR:', message, detail);
    try {
        if (typeof wx !== 'undefined' && wx.showModal) {
            wx.showModal({
                title: '启动错误',
                content: message + (detail ? '\n' + detail : ''),
                showCancel: false
            });
        }
    } catch (e) {}

    try {
        if (typeof wx !== 'undefined' && wx.createCanvas) {
            const canvas = wx.createCanvas();
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#ff4444';
                ctx.font = '24px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('启动失败', canvas.width / 2, canvas.height / 2 - 40);
                ctx.fillStyle = '#ffffff';
                ctx.font = '16px sans-serif';
                ctx.fillText(message, canvas.width / 2, canvas.height / 2);
                if (detail) {
                    ctx.fillText(String(detail).slice(0, 60), canvas.width / 2, canvas.height / 2 + 30);
                }
            }
        }
    } catch (e) {}
}

try {
    // 1. BOM/DOM 垫片（window/document/canvas/storage/XHR/Image/Audio 等）
    require('./adapter.js');

    // 2. 加载 CreateJS + Adobe Animate 运行时（微信小游戏包装版，在全局作用域执行）
    require('./resan/vendor-animate-wx.js');

    // 3. 微信小游戏平台覆盖（音频、广告、统计）
    require('./wx-sdk-shim.js');

    // 4. 加载游戏业务逻辑（webpack 打包产物）
    require('./bundle.js');

    // 5. 触发 DOMContentLoaded 启动游戏引擎
    setTimeout(() => {
        try {
            if (typeof document !== 'undefined' && document.dispatchEvent) {
                let event;
                try {
                    event = new Event('DOMContentLoaded', { bubbles: true, cancelable: true });
                } catch (e) {
                    try {
                        event = document.createEvent('Event');
                        event.initEvent('DOMContentLoaded', true, true);
                    } catch (e2) {
                        event = { type: 'DOMContentLoaded', bubbles: true };
                    }
                }
                document.dispatchEvent(event);
            }
        } catch (e) {
            showFatalError('触发 DOMContentLoaded 失败', e && e.message ? e.message : String(e));
        }
    }, 0);

    console.log('[game.js] 011 Dragon Egg 微信小游戏入口已执行');
} catch (e) {
    showFatalError('加载游戏模块失败', e && e.message ? e.message : String(e));
}
