// Lightweight GA4 tracker for game play time

class Tracker {
    constructor() {
        this.started = false;
        this.timerId = null;
        this.startTs = null;
        this.intervalMs = 30000; // 30s
        this.opts = {};
    }

    init(opts = {}) {
        this.opts = opts || {};
    // do not cache window.gtag/dataLayer here; read them at send time so tracker
    // can be initialized before the gtag loader/script finishes loading.
    this.gtag = null;
    this.dataLayer = null;

        // ensure final flush on page hide/unload
        if (typeof window !== 'undefined') {
            window.addEventListener('pagehide', () => this.stopGameTimer(), { passive: true });
            window.addEventListener('beforeunload', () => this.stopGameTimer(), { passive: true });
        }
    }

    startGameTimer() {
        if (this.started) return;
        this.started = true;
        this.startTs = Date.now();

        // Start interval; first send will occur after intervalMs
        this.timerId = setInterval(() => {
            this.sendPlayTime();
        }, this.intervalMs);
    }

    sendPlayTime() {
        if (!this.startTs) return;
        const seconds = Math.floor((Date.now() - this.startTs) / 1000);
        const payload = {
            play_time_seconds: seconds,
            timestamp: Date.now()
        };

       
        try {
            if (typeof window !== 'undefined' && typeof window.__sdklog3 === 'function') {
                window.__sdklog3('game_play_time', payload);
            } else {
                console.log('game_play_time', payload);
            }
        } catch (e) { /* ignore logging errors */ }

        // Prefer gtag (GA4). If available at send time, send custom event via gtag.
        try {
            const gtag = (typeof window !== 'undefined' && typeof window.gtag === 'function') ? window.gtag : null;
            const dataLayer = (typeof window !== 'undefined' && window.dataLayer) ? window.dataLayer : null;

            if (gtag) {
                gtag('event', 'game_play_time', Object.assign({}, payload, this.opts.gtagParams || {}));
                return;
            }

            // Fallback to dataLayer push if present
            if (dataLayer && typeof dataLayer.push === 'function') {
                dataLayer.push(Object.assign({ event: 'game_play_time' }, payload));
                return;
            }

            // Last fallback: if an endpoint is configured, use sendBeacon
            if (this.opts && this.opts.endpoint && typeof navigator !== 'undefined' && navigator.sendBeacon) {
                try {
                    const body = JSON.stringify({ event: 'game_play_time', payload });
                    navigator.sendBeacon(this.opts.endpoint, body);
                    return;
                } catch (e) {
                    // fall through to console
                }
            }

            // Debug: no analytics available
            if (this.opts && this.opts.debug) {
                console.log('[Tracker] game_play_time', payload);
            }
        } catch (e) {
            if (this.opts && this.opts.debug) console.warn('[Tracker] sendPlayTime failed', e);
        }
    }

    // Generic event tracker: sends a named event with params to gtag/dataLayer or fallback
    trackEvent(eventName, params = {}) {
        try {
            const payload = Object.assign({}, params, { timestamp: Date.now() });
            
            try {
                if (typeof window !== 'undefined' && typeof window.__sdklog3 === 'function') {
                    window.__sdklog3(eventName, payload);
                }  else {
                    console.log(eventName, payload);
                }
            } catch (e) {}
            
            // Prefer gtag (GA4). Read runtime globals so tracker works before/after the gtag script loads.
            const gtag = (typeof window !== 'undefined' && typeof window.gtag === 'function') ? window.gtag : null;
            const dataLayer = (typeof window !== 'undefined' && window.dataLayer) ? window.dataLayer : null;
            
            if (gtag) {
                gtag('event', eventName, Object.assign({}, payload, this.opts.gtagParams || {}));
                return;
            }
            if (dataLayer && typeof dataLayer.push === 'function') {
                dataLayer.push(Object.assign({ event: eventName }, payload));
                return;
            }
            if (this.opts && this.opts.endpoint && typeof navigator !== 'undefined' && navigator.sendBeacon) {
                try {
                    const body = JSON.stringify({ event: eventName, payload });
                    navigator.sendBeacon(this.opts.endpoint, body);
                    return;
                } catch (e) {}
            }
            if (this.opts && this.opts.debug) {
                console.log('[Tracker] trackEvent', eventName, payload);
            }
        } catch (e) {
            if (this.opts && this.opts.debug) console.warn('[Tracker] trackEvent failed', e);
        }
    }

    stopGameTimer() {
        if (!this.started) return;
        // send final value synchronously where possible
        try {
            this.sendPlayTime();
            if (this.timerId) {
                clearInterval(this.timerId);
                this.timerId = null;
            }
        } catch (e) {
            // ignore
        }
        this.started = false;
    }
}

const tracker = new Tracker();



export default tracker;
