

// GameDistribution Ad SDK for GameDistribution platform
// Only initializes if platform is set to "gamedistribution"

// Define gd_ad object with ad methods
const gd_ad = {
    // Initialize GameDistribution Ad SDK
    init: function() {
        // Only initialize if platform is gamedistribution
        if (window.Platform !== "gamedistribution") {
            console.log('[gd_ad] Platform is not gamedistribution, skipping initialization');
            return;
        }

        console.log('[gd_ad] Initializing for GameDistribution platform');

        // Initialize GA4
        this.initGA4();

        // Load GameDistribution SDK
        this.loadGameDistributionSDK();

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
                    gameid: "GameDistribution_97433fde06bb45aeb80c380ace3ece7f",
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
            console.error('[gd_ad] GA4 initialization failed', e);
        }
    },

    // Load GameDistribution SDK
    loadGameDistributionSDK: function() {
        return new Promise((resolve, reject) => {
            if (typeof window.gdsdk !== 'undefined') {
                console.log('[gd_ad] GameDistribution SDK already loaded');
                resolve();
                return;
            }

            // Set up GD options
            window.GD_OPTIONS = {
                debug: true,
                gameId: "1726345e0eb4405a8bc8f20d14f33993",
                onEvent: function(e) {
                    switch (e.name) {
                        case "SDK_GAME_START":
                            break;
                        case "SDK_GAME_PAUSE":
                            break;
                        case "SDK_GDPR_TRACKING":
                        case "SDK_GDPR_TARGETING":
                            break;
                        case "SDK_READY":
                            if (typeof window.gdsdk !== 'undefined') {
                                window.gdsdk.preloadAd();
                            }
                            break;
                    }
                }
            };

            const script = document.createElement("script");
            script.src = "https://html5.api.gamedistribution.com/main.min.js";
            script.onload = () => {
                console.log('[gd_ad] GameDistribution SDK loaded successfully');
                resolve();
            };
            script.onerror = (error) => {
                console.error('[gd_ad] Failed to load GameDistribution SDK', error);
                reject(error);
            };

            document.getElementsByTagName("head")[0].appendChild(script);
        });
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
    },

    // Interstitial Ad
    showInterstitialAd: function (callback, opts) {
        opts = opts || {};
        try {
            console.log('[gd_ad] showInterstitialAd invoked');
            // GA event: ad_impression
            if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                window.gtag('event', 'ad_impression', {
                    ad_platform: 'gamedistribution',
                    ad_source: 'interstitial',
                    ad_format: 'display',
                    platform: window.Platform || 'unknown',
                    send: 'sdk'
                });
            }
        } catch (e) {}

        if (typeof window.gdsdk !== 'undefined' && typeof window.gdsdk.showAd === 'function') {
            try {
                window.gdsdk.showAd().then(() => {
                    try {
                        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                            window.gtag('event', 'ad_click', {
                                ad_platform: 'gamedistribution',
                                ad_source: 'interstitial',
                                platform: window.Platform || 'unknown',
                                send: 'sdk'
                            });
                        }
                    } catch (e) {}
                    if (typeof callback === 'function') callback(true);
                }).catch((error) => {
                    try {
                        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                            window.gtag('event', 'ad_error', {
                                ad_platform: 'gamedistribution',
                                ad_source: 'interstitial',
                                error_reason: 'closed_or_failed',
                                platform: window.Platform || 'unknown',
                                send: 'sdk'
                            });
                        }
                    } catch (e) {}
                    if (typeof callback === 'function') callback(false);
                });
            } catch (e) {
                console.error('[gd_ad] showInterstitialAd failed', e);
                if (typeof callback === 'function') callback(false);
            }
        } else {
            console.warn('[gd_ad] gdsdk.showAd not available');
            // GA event: ad_error
            if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                window.gtag('event', 'ad_error', {
                    ad_platform: 'gamedistribution',
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
        try {
            console.log('[gd_ad] showRewardedAd invoked');
            // GA event: ad_impression
            if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                window.gtag('event', 'ad_impression', {
                    ad_platform: 'gamedistribution',
                    ad_source: 'rewarded',
                    ad_format: 'video',
                    platform: window.Platform || 'unknown',
                    send: 'sdk'
                });
            }
        } catch (e) {}

        if (typeof window.gdsdk !== 'undefined' && typeof window.gdsdk.showAd === 'function') {
            try {
                window.gdsdk.showAd('rewarded').then(() => {
                    try {
                        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                            window.gtag('event', 'earn_virtual_currency', {
                                virtual_currency_name: 'reward',
                                value: 1,
                                ad_platform: 'gamedistribution',
                                platform: window.Platform || 'unknown',
                                send: 'sdk'
                            });
                        }
                    } catch (e) {}
                    if (typeof callback === 'function') callback(true);
                }).catch((error) => {
                    try {
                        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                            window.gtag('event', 'ad_error', {
                                ad_platform: 'gamedistribution',
                                ad_source: 'rewarded',
                                error_reason: 'closed_or_failed',
                                platform: window.Platform || 'unknown',
                                send: 'sdk'
                            });
                        }
                    } catch (e) {}
                    if (typeof callback === 'function') callback(false);
                });
            } catch (e) {
                console.error('[gd_ad] showRewardedAd failed', e);
                if (typeof callback === 'function') callback(false);
            }
        } else {
            console.warn('[gd_ad] gdsdk.showAd not available');
            // GA event: ad_error
            if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                window.gtag('event', 'ad_error', {
                    ad_platform: 'gamedistribution',
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
            console.log('[gd_ad] showBannerAd invoked');
            // GA event: ad_impression
            if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                window.gtag('event', 'ad_impression', {
                    ad_platform: 'gamedistribution',
                    ad_source: 'banner',
                    ad_format: 'display',
                    platform: window.Platform || 'unknown',
                    send: 'sdk'
                });
            }
        } catch (e) {}

        if (typeof window.gdsdk !== 'undefined' && typeof window.gdsdk.showAd === 'function') {
            try {
                window.gdsdk.showAd('banner').then(() => {
                    try {
                        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                            window.gtag('event', 'ad_click', {
                                ad_platform: 'gamedistribution',
                                ad_source: 'banner',
                                platform: window.Platform || 'unknown',
                                send: 'sdk'
                            });
                        }
                    } catch (e) {}
                    if (typeof callback === 'function') callback(true);
                }).catch((error) => {
                    try {
                        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                            window.gtag('event', 'ad_error', {
                                ad_platform: 'gamedistribution',
                                ad_source: 'banner',
                                error_reason: 'closed_or_failed',
                                platform: window.Platform || 'unknown',
                                send: 'sdk'
                            });
                        }
                    } catch (e) {}
                    if (typeof callback === 'function') callback(false);
                });
            } catch (e) {
                console.error('[gd_ad] showBannerAd failed', e);
                if (typeof callback === 'function') callback(false);
            }
        } else {
            console.warn('[gd_ad] gdsdk.showAd not available');
            // GA event: ad_error
            if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                window.gtag('event', 'ad_error', {
                    ad_platform: 'gamedistribution',
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
            console.log('[gd_ad] hideBannerAd invoked');
        } catch (e) {}

        if (typeof window.gdsdk !== 'undefined' && typeof window.gdsdk.hideAd === 'function') {
            try {
                window.gdsdk.hideAd('banner');
                if (typeof callback === 'function') callback(true);
            } catch (e) {
                console.error('[gd_ad] hideBannerAd failed', e);
                if (typeof callback === 'function') callback(false);
            }
        } else {
            console.warn('[gd_ad] gdsdk.hideAd not available');
            if (typeof callback === 'function') callback(false);
        }
    }
};

// Initialize the SDK
gd_ad.init();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = gd_ad;
}
export default gd_ad;