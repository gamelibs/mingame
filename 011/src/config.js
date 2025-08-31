
// 先设置全局平台变量，确保在导入广告模块前可用
window.Platform = "googleplay";

import ovo from './ovosdk.js'
import android_ad from '../adsdk/android_ad.js';
import gd_ad from '../adsdk/gd_ad.js';

// window.Platform = "gamedistribution";
// window.Platform = "default";

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



