// import tracker from './tracker.js';

// initialize tracker as early as possible

// try {
//     tracker.init({ debug: false });
// } catch (e) {
//     console.warn('Tracker init failed', e);
// }

const config = {
    "scene": {
        "width": 1080,
        "height": 1920,
        "orientation": "portrait",
        "backgroundColor": "#ffffff",
        "fps": 30
    },
    "compositions": {
        "loading": {
            "id": "12AB51DFDAB942FF88C62B7BF520AB4C",
            "src": "resan/vendor-animate.js",
            "description": "Loading screen composition"
        },
        "game": {
            "id": "994179DFE830400BA68CFA701D2BB3AB",
            "src": "resan/vendor-animate.js",
            "description": "Main game composition"
        }
    },
    "gameconfig": {

        "sounds": [
            { "id": "bgm", "src": "assets/sound/bgm.mp3", "type": "sound" },
            { "id": "popo", "src": "assets/sound/popo.mp3", "type": "sound" },
            { "id": "goodmin", "src": "assets/sound/goodmin.mp3", "type": "sound" },
            { "id": "click", "src": "assets/sound/click.mp3", "type": "sound" },
            { "id": "win", "src": "assets/sound/win.mp3", "type": "sound" },
            { "id": "wrong", "src": "assets/sound/wrong.mp3", "type": "sound" },
            { "id": "open", "src": "assets/sound/open.mp3", "type": "sound" },
            { "id": "longhou_min", "src": "assets/sound/longhou_min.mp3", "type": "sound" },
            { "id": "select_wawa", "src": "assets/sound/select_wawa.mp3", "type": "sound" },
            { "id": "select_jiji", "src": "assets/sound/select_jiji.mp3", "type": "sound" },
            { "id": "hecheng_open", "src": "assets/sound/hecheng_open.mp3", "type": "sound" },
            { "id": "wrong2", "src": "assets/sound/wrong2.mp3", "type": "sound" },
            { "id": "card", "src": "assets/sound/card.mp3", "type": "sound" }
        ],
        "images": [
            { "id": "bg", "src": "assets/image/background.jpg", "type": "image" },
            { "id": "logo", "src": "assets/image/logo.png", "type": "image" }
        ]
    }
}

export default config;
// Expose a lightweight, early debug logger as window.__sdklog2 so
// analytics/debug prints are available before `utile` is loaded.
if (typeof window !== 'undefined') {
    window.__sdklog2 = function (...args) {
        if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production') return; // 生产环境不输出
        const formatParam = (arg) => {
            if (typeof arg === 'string') return `'${arg}'`;
            if (typeof arg === 'object') return JSON.stringify(arg);
            return String(arg);
        };

        const params = args.map(formatParam).join(' ');

        console.log(
            `%c ***CPSDK***: ${params}`,
            'background: linear-gradient(to right, #8e44ad, #ba43ff); ' +
            'color: white; ' +
            'padding: 5px 15px; ' +
            'border-radius: 5px; ' +
            'font-weight: bold; ' +
            'text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);'

        );
    };

    window.__sdklog3 = function (...args) {
        if (process.env.NODE_ENV === 'production') return; // 生产环境不输出
        const formatParam = (arg) => {
            if (typeof arg === 'string') return `'${arg}'`;
            if (typeof arg === 'object') return JSON.stringify(arg);
            return String(arg);
        };

        const params = args.map(formatParam).join(' ');

        console.log(
            `%c ***DOTGTAG***: ${params}`,
            'background: linear-gradient(to right,rgb(68, 173, 166),rgb(4, 170, 173)); ' +
            'color: white; ' +
            'padding: 5px 15px; ' +
            'border-radius: 5px; ' +
            'font-weight: bold; ' +
            'text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);'

        );
    }
}



// Enhanced GA4 (gtag) initialization with consent management and event filtering
// This runs when config.js (merged into vendor-animate) is evaluated in the head.
(function () {
    try {
        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
            // Game configuration for GA4
            const gameConfig = {
                gameid: "GooglePlay",
                dev_name: "Dragon Egg"
            };

            // Create and configure gtag script
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
                
                try { console.log('✅ gtag.js loaded with consent and game config'); } catch (e) { }
            };
            
            script.onerror = function (err) {
                try { console.warn('⚠️ gtag.js failed to load', err); } catch (e) { }
            };

            // Initialize dataLayer
            window.dataLayer = window.dataLayer || [];
            
            // Track if game_start interval has been set
            let gamePlayTimeIntervalSet = false;
            
            // Enhanced gtag wrapper with event filtering and automatic game_play_time
            window.gtag = function() {
                let args = [...arguments];
                let eventAction = args[1];
                let eventParams = args[2];
                
                // Allow specific gtag commands and events
                const allowedCommands = ["set", "js", "config", "consent"];
                const allowedGameEvents = ["game_start", "level_start", "level_end"];
                const allowedSdkEvents = [
                    // Standard GA4 events we use
                    "ad_impression", "ad_click", "ad_error", "earn_virtual_currency",
                    "select_content", "game_play_time", "tutorial_complete",
                    // Legacy events for backward compatibility
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
                    setInterval(function() {
                        if (typeof window.gtag === 'function') {
                            window.gtag("event", "game_play_time", {
                                send: "sdk"
                            });
                        }
                    }, 30000); // 30 seconds
                    
                    try { console.log('🕒 Automatic game_play_time interval started (30s)'); } catch (e) { }
                }
            };
            
            // Append script to head
            document.head.appendChild(script);
        }
    } catch (e) {
        // Non-fatal: log for debugging but don't break app
        try { console.warn('Enhanced gtag init failed', e); } catch (e) { }
    }
})();


