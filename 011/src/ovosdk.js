
window.Platform = "gamedistribution";

window.GD_OPTIONS = {
    gameId: "1726345e0eb4405a8bc8f20d14f33993",
    onEvent: function (a) {
        window.__sdklog2("GD EVENT: ", a);
        switch (a.name) {
            case "SDK_GAME_START":
                window.__sdklog2("GD - START");
                game.sound.volume = 1;
                !gdist_ad_clbck_fail || "Advertisement(s) are cancelled. Start / resume the game." !== a.message && "success" === a.status || (gdist_ad_clbck_fail(),
                    gdist_ad_clbck_fail = gdist_ad_clbck = !1);
                break;
            case "SDK_GAME_PAUSE":
                window.__sdklog2("GD - PAUSE");
                game.sound.volume = 0;
                containerShop.visible || containerSettings.visible || containerProgressions.visible || showSettings();
                break;
            case "SDK_REWARDED_WATCH_COMPLETE":
                window.__sdklog2("GD - REW WATCH COMPLETE");
                null != game && (game.sound.mute = !1,
                    game.sound.volume = 1);
                if (!1 === gdist_ad_clbck)
                    break;
                gdist_ad_clbck[0].call(gdist_ad_clbck[1]);
                gdist_ad_clbck_fail = gdist_ad_clbck = !1;
                break;
            case "AD_ERROR":
                window.__sdklog2("GD - REW AD_ERROR"),
                    null != game && (game.sound.mute = !1,
                        game.sound.volume = 1),
                    !1 !== gdist_ad_clbck_fail && (gdist_ad_clbck_fail(),
                        gdist_ad_clbck_fail = gdist_ad_clbck = !1)
        }
    }
};
(function (a, b, e) {
    var h = a.getElementsByTagName(b)[0];
    a.getElementById(e) || (a = a.createElement(b),
        a.id = e,
        a.src = "https://html5.api.gamedistribution.com/main.min.js",
        h.parentNode.insertBefore(a, h))
}
)(document, "script", "gamedistribution-jssdk");


window.showRewardedAd = function (callback) {
    // Pause audio before showing ad, then resume afterwards
    const pauseAudioForAd = () => {
        try {
            // If a GameEngine instance is exposed, prefer its pauseAudio method
            if (window.__GAME_ENGINE_INSTANCE__ && typeof window.__GAME_ENGINE_INSTANCE__.pauseAudio === 'function') {
                window.__GAME_ENGINE_INSTANCE__.pauseAudio();
                window.__adPausedBySdk__ = 'engine';
                return;
            }
            // Fallback: mute all SoundJS audio (safe and available in most builds)
            if (typeof createjs !== 'undefined' && createjs.Sound && typeof createjs.Sound.setMute === 'function') {
                // Respect user's choice: only unmute later if user had music enabled
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

    pauseAudioForAd();
    // Track ad requested
    try { if (window.tracker && typeof window.tracker.trackEvent === 'function') window.tracker.trackEvent('ad_rewarded_request', { platform: window.Platform || null }); } catch (e) {}
    if (typeof gdsdk === 'function') {
        gdsdk("reward").then(() => {
            try { window.__sdklog2('🎁 激励广告完成'); } catch (e) { }
            try { if (window.tracker && typeof window.tracker.trackEvent === 'function') window.tracker.trackEvent('ad_rewarded_completed', { platform: window.Platform || null }); } catch (e) {}
            resumeAudioAfterAd();
            callback && callback();
        }).catch(() => {
            try { if (window.tracker && typeof window.tracker.trackEvent === 'function') window.tracker.trackEvent('ad_rewarded_failed', { platform: window.Platform || null }); } catch (e) {}
            resumeAudioAfterAd();
            callback && callback();
        })
    } else {
        try { if (window.tracker && typeof window.tracker.trackEvent === 'function') window.tracker.trackEvent('ad_rewarded_unavailable', { platform: window.Platform || null }); } catch (e) {}
        resumeAudioAfterAd();
        callback && callback();
        try { window.__sdklog2('🎁 激励广告API不可用，直接执行回调'); } catch (e) { }
    }
}

window.showInterstitialAd = function (callback) {
    // Pause audio before showing ad, resume afterwards
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

    pauseAudioForAd();
    // Track interstitial requested
    try { if (window.tracker && typeof window.tracker.trackEvent === 'function') window.tracker.trackEvent('ad_interstitial_request', { platform: window.Platform || null }); } catch (e) {}
    if (typeof gdsdk === 'function') {
        gdsdk().then(() => {
            try { window.__sdklog2('📺 插页广告关闭'); } catch (e) { }
            try { if (window.tracker && typeof window.tracker.trackEvent === 'function') window.tracker.trackEvent('ad_interstitial_closed', { platform: window.Platform || null }); } catch (e) {}
            resumeAudioAfterAd();
            callback && callback();
        }).catch(() => {
            try { if (window.tracker && typeof window.tracker.trackEvent === 'function') window.tracker.trackEvent('ad_interstitial_failed', { platform: window.Platform || null }); } catch (e) {}
            resumeAudioAfterAd();
            callback && callback();
        })
    } else {
        try { if (window.tracker && typeof window.tracker.trackEvent === 'function') window.tracker.trackEvent('ad_interstitial_unavailable', { platform: window.Platform || null }); } catch (e) {}
        resumeAudioAfterAd();
        callback && callback();
        try { window.__sdklog2('📺 插页广告API不可用，直接执行回调'); } catch (e) { }
    }
}




