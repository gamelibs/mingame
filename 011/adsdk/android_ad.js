// Android Ad SDK for Google Play platform
// Only initializes if platform is set to "googleplay"

// Helper: call Android native ad and wait for native to call back via window.SuccessAd
function androidShowAdWithCallback(callNativeFn, callback, timeoutMs) {
    timeoutMs = timeoutMs || 8000; // default 8s timeout
    let called = false;
    const prev = window.SuccessAd;

    function cleanup() {
        try {
            if (prev === undefined) delete window.SuccessAd;
            else window.SuccessAd = prev;
        } catch (e) { }
    }

    function onDone(success) {
        if (called) return;
        called = true;
        cleanup();
        try { resumeAudioAfterAd(); } catch (e) { }
        try { if (typeof callback === 'function') callback(success === false ? false : true); } catch (e) { }
    }

    // Install temporary global that native will call
    try {
        window.SuccessAd = function () {
            try { console.log('[ovosdk] native SuccessAd called'); } catch (e) { }
            onDone(true);
        };
    } catch (e) { }

    // Safety timeout
    const timer = setTimeout(function () {
        try { console.log('[ovosdk] androidShowAd timeout'); } catch (e) { }
        onDone(false);
    }, timeoutMs);

    // Wrap onDone to also clear timer
    const origOnDone = onDone;
    onDone = function (success) {
        clearTimeout(timer);
        origOnDone(success);
    };

    // Pause audio then call native
    try { pauseAudioForAd(); } catch (e) { }

    try {
        callNativeFn();
    } catch (e) {
        try { console.log('[ovosdk] callNativeFn failed, falling back', e); } catch (e) { }
        // fallback: immediately resume and call callback(false)
        onDone(false);
    }

    return {
        cancel: function () {
            onDone(false);
        }
    };
}

// Define android_ad object with ad methods
const android_ad = {
    // Initialize Android Ad SDK
    init: function() {
        // Only initialize if platform is googleplay
        if (window.Platform !== "googleplay") {
            console.log('[android_ad] Platform is not googleplay, skipping initialization');
            return;
        }

        console.log('[android_ad] Initializing for Google Play platform');

        // Initialize GA4
        this.initGA4();

        // Set up gtag wrapper
        this.setupGtagWrapper();

        // Attach methods to window
        this.attachToWindow();
    },

    // Initialize Google Analytics 4
    initGA4: function() {
        try {
            if (typeof window !== 'undefined' && typeof document !== 'undefined') {
                const gameConfig = {
                    gameid: "GooglePlay",
                    dev_name: "Dragon Egg"
                };

                const script = document.createElement("script");
                script.async = true;
                script.src = "https://www.googletagmanager.com/gtag/js?id=G-PM5MNMLL3R";
                script.setAttribute("crossorigin", "anonymous");

                script.onload = () => {
                    // Set consent configuration
                    window.gtag("consent", "default", {
                        ad_storage: "granted",
                        ad_user_data: "granted",
                        ad_personalization: "granted",
                        analytics_storage: "granted"
                    });

                    // Initialize gtag
                    window.gtag("js", new Date());
                    window.gtag("set", "cookie_flags", "SameSite=None;Secure");
                    window.gtag("config", "G-PM5MNMLL3R", {
                        game_id: gameConfig.gameid,
                        dev_name: gameConfig.dev_name
                    });

                    console.log('✅ gtag.js loaded with consent and game config');
                };

                script.onerror = function (err) {
                    console.warn('⚠️ gtag.js failed to load', err);
                };

                // Initialize dataLayer
                window.dataLayer = window.dataLayer || [];

                document.getElementsByTagName("head")[0].appendChild(script);
            }
        } catch (e) {
            console.error('[android_ad] GA4 initialization failed', e);
        }
    },

    // Set up enhanced gtag wrapper
    setupGtagWrapper: function() {
        let gamePlayTimeIntervalSet = false;

        window.gtag = function () {
            let args = [...arguments];
            let eventAction = args[1];
            let eventParams = args[2];

            // Allow specific gtag commands and events
            const allowedCommands = ["set", "js", "config", "consent"];
            const allowedGameEvents = ["game_start", "level_start", "level_end"];
            const allowedSdkEvents = [
                "ad_impression", "ad_click", "ad_error", "earn_virtual_currency",
                "select_content", "game_play_time", "tutorial_complete",
                "game_reward_open", "game_interstitialad_open",
                "game_reward_dismissed", "game_interstitialad",
                "game_reward", "game_reward_viewed", "game_interstitialad_viewed",
                "click_ad"
            ];

            // Filter events: allow commands, game events, or SDK events with send: "sdk"
            if (allowedCommands.includes(args[0]) ||
                allowedGameEvents.includes(eventAction) ||
                (allowedSdkEvents.includes(eventAction) && eventParams && eventParams.send === "sdk")) {

                // Log filtered events
                if (typeof window.__sdklog3 === 'function') {
                    window.__sdklog3('gtag_filtered', arguments);
                }

                // Push to dataLayer
                try {
                    if (window.dataLayer && typeof window.dataLayer.push === 'function') {
                        window.dataLayer.push(arguments);
                    }
                } catch (e) {
                    console.log("dataLayer error:", e);
                }
            }

            // Set up automatic game_play_time interval on first level_start
            if (eventAction === "level_start" && !gamePlayTimeIntervalSet) {
                gamePlayTimeIntervalSet = true;
                setInterval(function () {
                    if (typeof window.gtag === 'function') {
                        window.gtag("event", "game_play_time", {
                            send: "sdk"
                        });
                    }
                }, 30000); // 30 seconds

                console.log('🕒 Automatic game_play_time interval started (30s)');
            }
        };
    },

    // Attach methods to window
    attachToWindow: function() {
        window.showInterstitialAd = this.showInterstitialAd;
        window.showRewardedAd = this.showRewardedAd;
        window.showBannerAd = this.showBannerAd;
        window.hideBannerAd = this.hideBannerAd;
        window.vibrate = this.vibrate;
    },

    // Interstitial Ad
    showInterstitialAd: function (callback, opts) {
        opts = opts || {};
        const timeoutMs = opts.timeoutMs || 8000;
        try {
            console.log('[android_ad] showInterstitialAd invoked');
            // GA event: ad_impression
            if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                window.gtag('event', 'ad_impression', {
                    ad_platform: 'android',
                    ad_source: 'interstitial',
                    ad_format: 'display',
                    platform: window.Platform || 'unknown',
                    send: 'sdk'
                });
            }
        } catch (e) {}

        if (typeof window.Android !== 'undefined' && typeof window.Android.showInterstitialAd === 'function') {
            return androidShowAdWithCallback(
                () => {
                    try {
                        window.Android.showInterstitialAd();
                    } catch (e) {
                        // GA event: ad_error
                        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                            window.gtag('event', 'ad_error', {
                                ad_platform: 'android',
                                ad_source: 'interstitial',
                                error_reason: 'native_call_failed',
                                platform: window.Platform || 'unknown',
                                send: 'sdk'
                            });
                        }
                        throw e;
                    }
                },
                (success) => {
                    if (success) {
                        // GA event: ad_click (assuming success means user interacted)
                        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                            window.gtag('event', 'ad_click', {
                                ad_platform: 'android',
                                ad_source: 'interstitial',
                                platform: window.Platform || 'unknown',
                                send: 'sdk'
                            });
                        }
                    } else {
                        // GA event: ad_error
                        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                            window.gtag('event', 'ad_error', {
                                ad_platform: 'android',
                                ad_source: 'interstitial',
                                error_reason: 'closed_or_failed',
                                platform: window.Platform || 'unknown',
                                send: 'sdk'
                            });
                        }
                    }
                    if (typeof callback === 'function') callback(success);
                },
                timeoutMs
            );
        } else {
            console.warn('[android_ad] Android.showInterstitialAd not available');
            // GA event: ad_error
            if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                window.gtag('event', 'ad_error', {
                    ad_platform: 'android',
                    ad_source: 'interstitial',
                    error_reason: 'not_available',
                    platform: window.Platform || 'unknown',
                    send: 'sdk'
                });
            }
            if (typeof callback === 'function') callback(false);
        }
    },

    // Rewarded Ad
    showRewardedAd: function (callback, opts) {
        opts = opts || {};
        const timeoutMs = opts.timeoutMs || 10000; // Longer timeout for rewarded
        try {
            console.log('[android_ad] showRewardedAd invoked');
            // GA event: ad_impression
            if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                window.gtag('event', 'ad_impression', {
                    ad_platform: 'android',
                    ad_source: 'rewarded',
                    ad_format: 'video',
                    platform: window.Platform || 'unknown',
                    send: 'sdk'
                });
            }
        } catch (e) {}

        if (typeof window.Android !== 'undefined' && typeof window.Android.showRewardedAd === 'function') {
            return androidShowAdWithCallback(
                () => {
                    try {
                        window.Android.showRewardedAd();
                    } catch (e) {
                        // GA event: ad_error
                        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                            window.gtag('event', 'ad_error', {
                                ad_platform: 'android',
                                ad_source: 'rewarded',
                                error_reason: 'native_call_failed',
                                platform: window.Platform || 'unknown',
                                send: 'sdk'
                            });
                        }
                        throw e;
                    }
                },
                (success) => {
                    if (success) {
                        // GA event: earn_virtual_currency
                        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                            window.gtag('event', 'earn_virtual_currency', {
                                virtual_currency_name: 'reward',
                                value: 1,
                                ad_platform: 'android',
                                platform: window.Platform || 'unknown',
                                send: 'sdk'
                            });
                        }
                    } else {
                        // GA event: ad_error
                        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                            window.gtag('event', 'ad_error', {
                                ad_platform: 'android',
                                ad_source: 'rewarded',
                                error_reason: 'closed_or_failed',
                                platform: window.Platform || 'unknown',
                                send: 'sdk'
                            });
                        }
                    }
                    if (typeof callback === 'function') callback(success);
                },
                timeoutMs
            );
        } else {
            console.warn('[android_ad] Android.showRewardedAd not available');
            // GA event: ad_error
            if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                window.gtag('event', 'ad_error', {
                    ad_platform: 'android',
                    ad_source: 'rewarded',
                    error_reason: 'not_available',
                    platform: window.Platform || 'unknown',
                    send: 'sdk'
                });
            }
            if (typeof callback === 'function') callback(false);
        }
    },

    // Banner Ad
    showBannerAd: function (callback, opts) {
        opts = opts || {};
        try {
            console.log('[android_ad] showBannerAd invoked');
            // GA event: ad_impression
            if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                window.gtag('event', 'ad_impression', {
                    ad_platform: 'android',
                    ad_source: 'banner',
                    ad_format: 'display',
                    platform: window.Platform || 'unknown',
                    send: 'sdk'
                });
            }
        } catch (e) {}

        if (typeof window.Android !== 'undefined' && typeof window.Android.showBannerAd === 'function') {
            try {
                window.Android.showBannerAd();
                if (typeof callback === 'function') callback(true);
            } catch (e) {
                console.error('[android_ad] showBannerAd failed', e);
                // GA event: ad_error
                if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                    window.gtag('event', 'ad_error', {
                        ad_platform: 'android',
                        ad_source: 'banner',
                        error_reason: 'native_call_failed',
                        platform: window.Platform || 'unknown',
                        send: 'sdk'
                    });
                }
                if (typeof callback === 'function') callback(false);
            }
        } else {
            console.warn('[android_ad] Android.showBannerAd not available');
            // GA event: ad_error
            if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                window.gtag('event', 'ad_error', {
                    ad_platform: 'android',
                    ad_source: 'banner',
                    error_reason: 'not_available',
                    platform: window.Platform || 'unknown',
                    send: 'sdk'
                });
            }
            if (typeof callback === 'function') callback(false);
        }
    },

    hideBannerAd: function (callback) {
        try {
            console.log('[android_ad] hideBannerAd invoked');
        } catch (e) {}

        if (typeof window.Android !== 'undefined' && typeof window.Android.hideBannerAd === 'function') {
            try {
                window.Android.hideBannerAd();
                if (typeof callback === 'function') callback(true);
            } catch (e) {
                console.error('[android_ad] hideBannerAd failed', e);
                if (typeof callback === 'function') callback(false);
            }
        } else {
            console.warn('[android_ad] Android.hideBannerAd not available');
            if (typeof callback === 'function') callback(false);
        }
    },

    // Vibration
    vibrate: function (pattern) {
        try {
            console.log('[android_ad] vibrate invoked, pattern:', pattern);
            
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
                    console.error('[android_ad] Android.vibrate failed', e);
                    return false;
                }
            } else {
                console.warn('[android_ad] Android.vibrate not available');
                return false;
            }
        } catch (e) {
            console.error('[android_ad] vibrate error:', e);
            return false;
        }
    }
};

// Initialize the SDK
android_ad.init();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = android_ad;
}
export default android_ad;