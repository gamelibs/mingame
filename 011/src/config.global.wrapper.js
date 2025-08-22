// Non-module wrapper to be loaded early in <head> as resan/config.global.js
// Provides a minimal queueing tracker and early debug logger so events can be
// captured before the real module-based tracker is loaded.
(function () {
    if (typeof window === 'undefined') return;

    // Early debug logger available as window.__sdklog2
    if (typeof window.__sdklog2 !== 'function') {
        window.__sdklog2 = function (...args) {
            try {
                if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production') return;
            } catch (e) {}
            try {
                const formatParam = (arg) => {
                    if (typeof arg === 'string') return `'${arg}'`;
                    if (typeof arg === 'object') return JSON.stringify(arg);
                    return String(arg);
                };
                const params = args.map(formatParam).join(' ');
                console.log(`%c ***CPSDK***: ${params}`, 'background: linear-gradient(to right, #8e44ad, #ba43ff); color: white; padding: 5px 15px; border-radius: 5px; font-weight: bold;');
            } catch (e) {
                try { console.log('***CPSDK***', ...args); } catch (e2) {}
            }
        };
    }

    // Queue for events or calls made before the real tracker loads
    window.__preTrackerEvents = window.__preTrackerEvents || [];

    // If there is already a tracker implemented (rare), don't override it
    if (window.tracker && window.tracker.__isRealTracker) return;

    // Minimal queueing tracker API
    window.tracker = window.tracker || {
        __isShim: true,
        __isRealTracker: false,
        __opts: null,
        init(opts) {
            this.__opts = opts || {};
            window.__preTrackerEvents.push({ type: 'init', opts: this.__opts, ts: Date.now() });
        },
        startGameTimer() { window.__preTrackerEvents.push({ type: 'startGameTimer', ts: Date.now() }); },
        sendPlayTime() { window.__preTrackerEvents.push({ type: 'sendPlayTime', ts: Date.now() }); },
        stopGameTimer() { window.__preTrackerEvents.push({ type: 'stopGameTimer', ts: Date.now() }); },
        trackEvent(eventName, params) {
            try { window.__sdklog2(eventName, params); } catch (e) {}
            window.__preTrackerEvents.push({ type: 'event', name: eventName, params: params || {}, ts: Date.now() });
        },
        // internal: called by the real tracker to flush queued events and replace the shim
        __flushTo(realTracker) {
            try {
                if (!realTracker) return;
                const q = window.__preTrackerEvents || [];
                for (let i = 0; i < q.length; i++) {
                    const item = q[i];
                    try {
                        if (!item) continue;
                        if (item.type === 'init' && typeof realTracker.init === 'function') realTracker.init(item.opts || {});
                        else if (item.type === 'startGameTimer' && typeof realTracker.startGameTimer === 'function') realTracker.startGameTimer();
                        else if (item.type === 'sendPlayTime' && typeof realTracker.sendPlayTime === 'function') realTracker.sendPlayTime();
                        else if (item.type === 'stopGameTimer' && typeof realTracker.stopGameTimer === 'function') realTracker.stopGameTimer();
                        else if (item.type === 'event' && typeof realTracker.trackEvent === 'function') realTracker.trackEvent(item.name, item.params || {});
                    } catch (e) {
                        try { console.warn('Failed flushing preTracker item', item, e); } catch (e2) {}
                    }
                }
            } catch (e) {
                try { console.warn('Failed to flush preTracker events', e); } catch (e2) {}
            } finally {
                // replace shim with real tracker reference for future calls
                try { window.tracker = realTracker; } catch (e) {}
                // clear the queue
                try { window.__preTrackerEvents = []; } catch (e) {}
            }
        }
    };

    // Expose a helper so module tracker can trigger a flush when it's ready.
    if (typeof window.__flushPreTracker !== 'function') {
        window.__flushPreTracker = function (realTracker) {
            try {
                if (window.tracker && typeof window.tracker.__flushTo === 'function') {
                    window.tracker.__flushTo(realTracker);
                } else if (window.__preTrackerEvents && realTracker) {
                    // fallback: naive replay
                    const q = window.__preTrackerEvents.slice();
                    for (let it of q) {
                        try {
                            if (it.type === 'init' && typeof realTracker.init === 'function') realTracker.init(it.opts || {});
                            else if (it.type === 'event' && typeof realTracker.trackEvent === 'function') realTracker.trackEvent(it.name, it.params || {});
                        } catch (e) { }
                    }
                    window.tracker = realTracker;
                    window.__preTrackerEvents = [];
                }
            } catch (e) { try { console.warn('flushPreTracker failed', e); } catch (e2) {} }
        };
    }

})();
