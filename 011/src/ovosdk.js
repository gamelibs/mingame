
const pauseAudioForAd = () => {
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

const resumeAudioAfterAd = () => {
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



function loadGameDistributionSDK() {
    return new Promise((resolve, reject) => {
        window["GD_OPTIONS"] = {
            debug: true,
            gameId: "1726345e0eb4405a8bc8f20d14f33993",
            onEvent: function (event) {
                switch (event.name) {
                    case "SDK_GAME_START":
                        resumeAudioAfterAd();
                        break;
                    case "SDK_GAME_PAUSE":
                        pauseAudioForAd();
                        break;
                    case "SDK_GDPR_TRACKING":
                        break;
                    case "SDK_GDPR_TARGETING":
                        break;
                    case "SDK_READY":
                        console.log("GameDistribution SDK is ready");
                        if (typeof gdsdk === 'undefined') {
                            gdsdk.preloadAd()
                        }
                        break;
                }
            },
        };

        const scriptId = "gamedistribution-jssdk";
        if (document.getElementById(scriptId)) {
            resolve();
            return;
        }

        const js = document.createElement("script");
        js.id = scriptId;
        js.src = "https://html5.api.gamedistribution.com/main.min.js";

        js.onload = () => {
            // SDK script loaded
            resolve();
        };

        js.onerror = () => {
            reject(new Error("Failed to load GameDistribution SDK"));
        };

        document.getElementsByTagName("head")[0].appendChild(js);
    });
}

let isAd = false;
if(window.Platform === "gamedistribution"){

    loadGameDistributionSDK()
        .then(() => {
            console.log("GameDistribution SDK loaded successfully");
            // Initialize your game here
            window.GDAD = function (type) {
                if (isAd) {
                    console.log("Ad is already shown");
                    return Promise.resolve(false);
                }
                isAd = true;
                return new Promise((resolve, reject) => {
                    let st = setTimeout(() => {
                        isAd = false;
                        clearTimeout(st);
                        console.log("Ad timeing");
                    }, 10000);
                    if (type === "interstitial") {
                        gdsdk.showAd()
                            .then(() => {
                                console.log("Interstitial ad shown");
                                resolve(true);
                            })
                            .catch((error) => {
                                console.error("Error showing interstitial ad:", error);
                                reject(false);
                            });
                    } else if (type === "rewarded") {
                        gdsdk.showAd("rewarded")
                            .then(() => {
                                console.log("Rewarded ad shown");
                                resolve(true);
                            })
                            .catch((error) => {
                                console.error("Error showing rewarded ad:", error);
                                reject(false);
                            });
                    } else {
                        reject(new Error("Invalid ad type"));
                    }
                });
            };
    
        })
        .catch((error) => {
            console.error("Error loading GameDistribution SDK:", error);
        });
}

// Android Google Play native ad bridge
function androidShowAd(type, timeoutMs = 10000) {
    return new Promise((resolve, reject) => {
        try {
            if (typeof window.AndroidAd === 'object' && typeof window.AndroidAd.showInterstitial === 'function' && typeof window.AndroidAd.showRewarded === 'function') {
                let called = false;
                const onSuccess = () => { if (!called) { called = true; resolve(true); } };
                const onFail = () => { if (!called) { called = true; resolve(false); } };

                // Android bridge may not support callbacks; use polling/timeouts
                if (type === 'interstitial') {
                    try { window.AndroidAd.showInterstitial(); onSuccess(); } catch (e) { onFail(); }
                } else if (type === 'rewarded') {
                    try { window.AndroidAd.showRewarded(); onSuccess(); } catch (e) { onFail(); }
                } else {
                    onFail();
                }

                // safety timeout
                setTimeout(() => {
                    if (!called) {
                        called = true;
                        resolve(false);
                    }
                }, timeoutMs);
                return;
            }
        } catch (e) { }

        // no android bridge found
        resolve(false);
    });
}

let isRewardAd = false
window.showRewardedAd = function (callback) {
    pauseAudioForAd();
    try {
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
            window.gtag('event', 'ad_impression', {
                ad_platform: (window.Platform === 'googleplay') ? 'googleplay' : 'gamedistribution',
                ad_source: 'rewarded',
                ad_format: 'video',
                platform: window.Platform || 'unknown',
                send: 'sdk'
            });
        }
    } catch (e) { }
    // Prefer Android native on Google Play, otherwise fallback to GD
    (async () => {
        let ok = false;
        if (window.Platform === 'googleplay') {
            ok = await androidShowAd('rewarded');
        }
        if (!ok && typeof window.GDAD === 'function') {
            try { ok = await window.GDAD('rewarded'); } catch (e) { ok = false; }
        }

        if (ok) {
            try {
                if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                    window.gtag('event', 'earn_virtual_currency', {
                        virtual_currency_name: 'reward',
                        value: 1,
                        ad_platform: window.Platform || 'unknown',
                        platform: window.Platform || 'unknown',
                        send: 'sdk'
                    });
                }
            } catch (e) { }
            callback && callback(true);
        } else {
            try {
                if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                    window.gtag('event', 'ad_error', {
                        ad_platform: window.Platform || 'unknown',
                        ad_source: 'rewarded',
                        error_reason: 'failed',
                        platform: window.Platform || 'unknown',
                        send: 'sdk'
                    });
                }
            } catch (e) { }
            callback && callback(false);
        }

        resumeAudioAfterAd();
    })();


    // let st = setTimeout(() => {
    //     if (!isRewardAd) {
    //         callback && callback(false);
    //     }
    //     clearTimeout(st);
    //     try {
    //         if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    //             window.gtag('event', 'ad_error', {
    //                 ad_platform: 'gamedistribution',
    //                 ad_source: 'rewarded',
    //                 error_reason: 'timeout',
    //                 platform: window.Platform || 'unknown',
    //                 send: 'sdk'
    //             });
    //         }
    //     } catch (e) { }
    // }, 15000);
}


window.showInterstitialAd = function (callback) {
    pauseAudioForAd();
    try {
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
            window.gtag('event', 'ad_impression', {
                ad_platform: (window.Platform === 'googleplay') ? 'googleplay' : 'gamedistribution',
                ad_source: 'interstitial',
                ad_format: 'display',
                platform: window.Platform || 'unknown',
                send: 'sdk'
            });
        }
    } catch (e) { }
    (async () => {
        let ok = false;
        if (window.Platform === 'googleplay') {
            ok = await androidShowAd('interstitial');
        }
        if (!ok && typeof window.GDAD === 'function') {
            try { ok = await window.GDAD('interstitial'); } catch (e) { ok = false; }
        }

        if (ok) {
            try {
                if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                    window.gtag('event', 'ad_click', {
                        ad_platform: window.Platform || 'unknown',
                        ad_source: 'interstitial',
                        platform: window.Platform || 'unknown',
                        send: 'sdk'
                    });
                }
            } catch (e) { }
            callback && callback(true);
        } else {
            try {
                if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                    window.gtag('event', 'ad_error', {
                        ad_platform: window.Platform || 'unknown',
                        ad_source: 'interstitial',
                        error_reason: 'closed_or_failed',
                        platform: window.Platform || 'unknown',
                        send: 'sdk'
                    });
                }
            } catch (e) { }
            callback && callback(false);
        }

        resumeAudioAfterAd();
    })();

}






