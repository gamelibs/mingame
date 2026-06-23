/**
 * 011 Dragon Egg → 微信小游戏适配层
 * 提供浏览器 BOM/DOM 垫片，使基于 CreateJS + Adobe Animate 的 H5 项目能在微信小游戏中运行。
 */

function install() {
    const G = typeof globalThis !== 'undefined' ? globalThis : (typeof global !== 'undefined' ? global : this);
    if (!G) {
        console.error('[wx-adapter] 无法获取全局对象');
        return;
    }

    // 安全设置全局属性的辅助函数
    function safeDefine(obj, prop, value) {
        try {
            obj[prop] = value;
            return true;
        } catch (e) {}
        try {
            Object.defineProperty(obj, prop, { value: value, configurable: true, writable: true });
            return true;
        } catch (e) {}
        return false;
    }
    function safeOverride(obj, prop, value) {
        try {
            Object.defineProperty(obj, prop, { value: value, configurable: true, writable: true });
            return true;
        } catch (e) {}
        try {
            obj[prop] = value;
            return true;
        } catch (e) {}
        return false;
    }
    // 微信宿主对象的 parentNode 等属性可能只有 getter，尝试直接赋值失败后改用 accessor
    function safeSetParentNode(child, parent) {
        try { child.parentNode = parent; return; } catch (e) {}
        try {
            Object.defineProperty(child, 'parentNode', {
                get: function () { return parent; },
                set: function (v) { parent = v; },
                configurable: true,
                enumerable: true
            });
        } catch (e) {}
    }

    // 1. 全局对象别名
    if (!G.window) safeDefine(G, 'window', G);
    if (!G.self) safeDefine(G, 'self', G);
    if (!G.top) safeDefine(G, 'top', G);
    if (!G.parent) safeDefine(G, 'parent', G);

    const isWX = typeof wx !== 'undefined' && wx.getSystemInfoSync;
    let sysInfo = {};
    try {
        sysInfo = isWX ? wx.getSystemInfoSync() : {};
    } catch (e) {
        sysInfo = {};
    }

    // 提前给 createjs 注入微信离屏 canvas 工厂。
    // vendor-animate-wx.js 内部的 _hitTestCanvas、Graphics._ctx、Text/SpriteSheet 工作 canvas
    // 都会优先走 createjs.createCanvas()，从而确保它们不会落到主 canvas 上。
    if (isWX && wx.createOffscreenCanvas) {
        const createjsObj = G.createjs || (G.createjs = {});
        createjsObj.createCanvas = function () {
            try { return wx.createOffscreenCanvas({ type: '2d' }); } catch (e) {}
            return null;
        };
    }

    const dpr = sysInfo.pixelRatio || 1;
    let innerWidth = sysInfo.windowWidth || 375;
    let innerHeight = sysInfo.windowHeight || 667;
    const screenWidth = sysInfo.screenWidth || innerWidth;
    const screenHeight = sysInfo.screenHeight || innerHeight;

    // 2. navigator（微信内置 Navigator 为只读，用原型继承包装后替换，失败则只覆盖 vibrate）
    let navigator;
    try {
        const originalNav = G.navigator || {};
        navigator = Object.create(originalNav);
        navigator.userAgent = sysInfo.userAgent || originalNav.userAgent || 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) WeChat MiniGame';
        navigator.platform = sysInfo.platform || originalNav.platform || 'iOS';
        navigator.language = sysInfo.language || originalNav.language || 'zh-CN';
        navigator.maxTouchPoints = 5;
        navigator.onLine = true;
        navigator.vibrate = function (pattern) {
            if (isWX) {
                try { wx.vibrateShort({ type: 'light' }); } catch (e) {}
            }
            return false;
        };
        safeDefine(G, 'navigator', navigator);
    } catch (e) {
        // 替换失败，退而只确保 vibrate 可用
        navigator = G.navigator || {};
        safeOverride(navigator, 'vibrate', function (pattern) {
            if (isWX) {
                try { wx.vibrateShort({ type: 'light' }); } catch (e) {}
            }
            return false;
        });
    }

    // 3. screen / location
    if (!G.screen) {
        safeDefine(G, 'screen', {
            width: screenWidth,
            height: screenHeight,
            availWidth: screenWidth,
            availHeight: screenHeight,
            colorDepth: 24,
            pixelDepth: 24,
        });
    }
    if (!G.location) {
        safeDefine(G, 'location', {
            href: '', protocol: 'https:', host: '', hostname: '', port: '', pathname: '', search: '', hash: ''
        });
    }
    safeDefine(G, 'devicePixelRatio', dpr);
    safeDefine(G, 'innerWidth', innerWidth);
    safeDefine(G, 'innerHeight', innerHeight);
    safeDefine(G, 'outerWidth', innerWidth);
    safeDefine(G, 'outerHeight', innerHeight);
    safeDefine(G, 'pageXOffset', 0);
    safeDefine(G, 'pageYOffset', 0);

    if (isWX) {
        try {
            wx.onWindowResize((res) => {
                innerWidth = res.windowWidth || innerWidth;
                innerHeight = res.windowHeight || innerHeight;
                G.innerWidth = innerWidth;
                G.innerHeight = innerHeight;
                G.outerWidth = innerWidth;
                G.outerHeight = innerHeight;
                dispatchWindowEvent('resize', { width: innerWidth, height: innerHeight });
            });
        } catch (e) {}
    }

    // 4. 事件监听辅助
    const windowListeners = {};
    const documentListeners = {};

    function addListener(map, type, listener) {
        if (!map[type]) map[type] = [];
        map[type].push(listener);
    }
    function removeListener(map, type, listener) {
        if (!map[type]) return;
        const idx = map[type].indexOf(listener);
        if (idx !== -1) map[type].splice(idx, 1);
    }
    function dispatchListeners(map, type, event) {
        const list = map[type];
        if (!list) return;
        const evt = normalizeEvent(event, type);
        for (let i = 0; i < list.length; i++) {
            try { list[i](evt); } catch (e) { console.warn('[wx-adapter] 事件回调出错', e); }
        }
    }

    function normalizeEvent(e, type) {
        if (!e || typeof e !== 'object') e = {};
        e.type = e.type || type;
        e.preventDefault = e.preventDefault || function () {};
        e.stopPropagation = e.stopPropagation || function () {};
        return e;
    }

    function dispatchWindowEvent(type, data) {
        dispatchListeners(windowListeners, type, data);
    }
    G.dispatchEvent = function (event) {
        dispatchListeners(windowListeners, event.type, event);
    };

    // 5. Canvas 与 DOM
    const mainCanvas = isWX ? wx.createCanvas() : null;
    const canvasLogical = { width: innerWidth, height: innerHeight };

    function defineOnCanvas(prop, value) {
        try {
            mainCanvas[prop] = value;
            return;
        } catch (e) {}
        try {
            Object.defineProperty(mainCanvas, prop, { value: value, configurable: true, writable: true });
        } catch (e) {}
    }

    if (mainCanvas) {
        defineOnCanvas('style', {
            width: innerWidth + 'px',
            height: innerHeight + 'px',
            opacity: '1',
            display: 'block',
            cursor: 'default',
            touchAction: 'none',
            msTouchAction: 'none',
            get width() { return canvasLogical.width + 'px'; },
            set width(v) { canvasLogical.width = parseFloat(v) || canvasLogical.width; },
            get height() { return canvasLogical.height + 'px'; },
            set height(v) { canvasLogical.height = parseFloat(v) || canvasLogical.height; },
        });
        defineOnCanvas('_attrs', {});
        defineOnCanvas('setAttribute', function (name, value) { this._attrs[name] = value; });
        defineOnCanvas('getAttribute', function (name) { return this._attrs[name]; });
        defineOnCanvas('getBoundingClientRect', function () {
            return {
                left: 0, top: 0,
                right: canvasLogical.width,
                bottom: canvasLogical.height,
                width: canvasLogical.width,
                height: canvasLogical.height,
                x: 0, y: 0
            };
        });
        // offsetLeft/Top 在微信 canvas 上为只读，且默认即为 0，不需要赋值
        try {
            Object.defineProperty(mainCanvas, 'offsetWidth', { get: () => canvasLogical.width, configurable: true });
            Object.defineProperty(mainCanvas, 'offsetHeight', { get: () => canvasLogical.height, configurable: true });
        } catch (e) {}

        // 命中测试已经由 wx-sdk-shim.js 移到离屏 canvas。
        // 主画布（上屏 canvas）不要默认加 willReadFrequently；
        // 在微信小游戏里给上屏 2D context 强开 willReadFrequently 反而容易引起 GPU 读回闪烁。
        try {
            const origGetContext = mainCanvas.getContext;
            mainCanvas.getContext = function (type, attrs) {
                try {
                    return origGetContext.call(this, type, attrs);
                } catch (err) {
                    // 部分环境不支持 context attributes，回退到无参数
                    return origGetContext.call(this, type);
                }
            };
        } catch (e) {}

        // 触摸事件映射为鼠标事件
        const canvasListeners = {};
        defineOnCanvas('addEventListener', function (type, listener) {
            addListener(canvasListeners, type, listener);
        });
        defineOnCanvas('removeEventListener', function (type, listener) {
            removeListener(canvasListeners, type, listener);
        });

        function makeTouch(touch) {
            return {
                identifier: touch.identifier,
                clientX: touch.clientX,
                clientY: touch.clientY,
                pageX: touch.pageX,
                pageY: touch.pageY,
                screenX: touch.screenX || touch.clientX,
                screenY: touch.screenY || touch.clientY,
                target: mainCanvas
            };
        }
        function makeMouseEvent(type, wxEvt, touch) {
            return {
                type: type,
                target: mainCanvas,
                currentTarget: mainCanvas,
                pageX: touch.pageX,
                pageY: touch.pageY,
                clientX: touch.clientX,
                clientY: touch.clientY,
                screenX: touch.screenX || touch.clientX,
                screenY: touch.screenY || touch.clientY,
                button: 0,
                buttons: 1,
                preventDefault: function () {},
                stopPropagation: function () {}
            };
        }
        function dispatchCanvas(type, evt) {
            dispatchListeners(canvasListeners, type, evt);
        }
        function dispatchWindow(type, evt) {
            dispatchListeners(windowListeners, type, evt);
        }
        function dispatchDocument(type, evt) {
            dispatchListeners(documentListeners, type, evt);
        }

        try {
            wx.onTouchStart((e) => {
                const touch = e.changedTouches && e.changedTouches[0] || e.touches && e.touches[0];
                if (!touch) return;
                const touches = (e.touches || []).map(makeTouch);
                const changed = (e.changedTouches || []).map(makeTouch);
                const wrapped = { type: 'touchstart', touches, changedTouches: changed, target: mainCanvas, preventDefault: function(){}, stopPropagation: function(){} };
                dispatchCanvas('touchstart', wrapped);
                dispatchCanvas('mousedown', makeMouseEvent('mousedown', e, touch));
                dispatchDocument('touchstart', wrapped);
            });
            wx.onTouchMove((e) => {
                const touch = e.changedTouches && e.changedTouches[0] || e.touches && e.touches[0];
                if (!touch) return;
                const touches = (e.touches || []).map(makeTouch);
                const changed = (e.changedTouches || []).map(makeTouch);
                const wrapped = { type: 'touchmove', touches, changedTouches: changed, target: mainCanvas, preventDefault: function(){}, stopPropagation: function(){} };
                dispatchCanvas('touchmove', wrapped);
                dispatchWindow('mousemove', makeMouseEvent('mousemove', e, touch));
            });
            wx.onTouchEnd((e) => {
                const touch = e.changedTouches && e.changedTouches[0] || {};
                const changed = (e.changedTouches || []).map(makeTouch);
                const wrapped = { type: 'touchend', touches: [], changedTouches: changed, target: mainCanvas, preventDefault: function(){}, stopPropagation: function(){} };
                dispatchCanvas('touchend', wrapped);
                dispatchWindow('mouseup', makeMouseEvent('mouseup', e, touch));
                // 同时触发 document click，用于解锁自动播放音频
                const clickEvt = { type: 'click', target: mainCanvas, currentTarget: document, clientX: touch.clientX || 0, clientY: touch.clientY || 0, pageX: touch.pageX || 0, pageY: touch.pageY || 0, preventDefault: function(){}, stopPropagation: function(){} };
                dispatchDocument('click', clickEvt);
            });
            wx.onTouchCancel((e) => {
                const touch = e.changedTouches && e.changedTouches[0] || {};
                dispatchWindow('mouseup', makeMouseEvent('mouseup', e, touch));
            });
        } catch (e) {
            console.warn('[wx-adapter] 绑定微信触摸事件失败', e);
        }
    }

    // 6. 假 DOM 元素工厂
    function createFakeElement(tag) {
        const el = {
            tagName: tag ? tag.toUpperCase() : 'DIV',
            nodeType: 1,
            _attrs: {},
            _style: {},
            style: {
                width: '', height: '', opacity: '1', display: 'block', cursor: 'default',
                color: '', backgroundColor: '',
                get paddingLeft() { return '0'; }, get paddingRight() { return '0'; },
                get paddingTop() { return '0'; }, get paddingBottom() { return '0'; },
                get borderLeftWidth() { return '0'; }, get borderRightWidth() { return '0'; },
                get borderTopWidth() { return '0'; }, get borderBottomWidth() { return '0'; },
            },
            className: '',
            classList: {
                add: function (c) { el.className += ' ' + c; },
                remove: function (c) { el.className = el.className.split(' ').filter(x => x !== c).join(' '); },
                contains: function (c) { return el.className.indexOf(c) !== -1; },
                toggle: function (c) { this.contains(c) ? this.remove(c) : this.add(c); }
            },
            children: [],
            childNodes: [],
            parentNode: null,
            textContent: '',
            innerHTML: '',
            src: '',
            href: '',
            async: false,
            defer: false,
            onload: null,
            onerror: null,
            setAttribute: function (name, value) { this._attrs[name] = value; },
            getAttribute: function (name) { return this._attrs[name]; },
            removeAttribute: function (name) { delete this._attrs[name]; },
            appendChild: function (child) {
                var parent = this;
                this.children.push(child);
                this.childNodes.push(child);
                safeSetParentNode(child, parent);
                return child;
            },
            removeChild: function (child) {
                var parent = null;
                const i = this.children.indexOf(child);
                if (i !== -1) this.children.splice(i, 1);
                const j = this.childNodes.indexOf(child);
                if (j !== -1) this.childNodes.splice(j, 1);
                safeSetParentNode(child, parent);
                return child;
            },
            remove: function () { if (this.parentNode) this.parentNode.removeChild(this); },
            contains: function (child) { return this.children.indexOf(child) !== -1; },
            getBoundingClientRect: function () { return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0 }; },
            addEventListener: function (type, listener) { addListener(this._listeners || (this._listeners = {}), type, listener); },
            removeEventListener: function (type, listener) { removeListener(this._listeners || {}, type, listener); },
            dispatchEvent: function (event) { dispatchListeners(this._listeners || {}, event.type, event); return true; }
        };
        return el;
    }

    // 7. document
    const body = createFakeElement('body');
    const head = createFakeElement('head');
    const html = createFakeElement('html');

    // 预创建常用 DOM 节点
    const gameContainer = createFakeElement('div');
    gameContainer.id = 'game-container';
    Object.defineProperty(gameContainer, 'clientWidth', { get: () => innerWidth });
    Object.defineProperty(gameContainer, 'clientHeight', { get: () => innerHeight });

    const animationContainer = createFakeElement('div');
    animationContainer.id = 'animation_container';

    const preloadContainer = createFakeElement('div');
    preloadContainer.id = 'preload_container';

    const siteBackground = createFakeElement('div');
    siteBackground.id = 'site-background';

    const siteLogo = createFakeElement('img');
    siteLogo.id = 'site-logo';
    siteLogo.src = 'assets/image/logo1.png';

    // 加载条代理：设置 width 时同步到微信 showLoading
    let wxLoadingShown = false;
    function updateWxLoading(percent) {
        if (!isWX) return;
        const p = Math.max(0, Math.min(100, Math.round(percent)));
        try {
            if (!wxLoadingShown) {
                wx.showLoading({ title: 'Loading...', mask: true });
                wxLoadingShown = true;
            }
            wx.showLoading({ title: 'Loading ' + p + '%', mask: true });
        } catch (e) {}
    }
    function hideWxLoading() {
        if (!isWX || !wxLoadingShown) return;
        try { wx.hideLoading(); } catch (e) {}
        wxLoadingShown = false;
    }

    const loadingProgress = createFakeElement('div');
    loadingProgress.className = 'loading-progress';
    Object.defineProperty(loadingProgress.style, 'width', {
        get() { return loadingProgress._width || '0%'; },
        set(v) {
            loadingProgress._width = v;
            const pct = parseFloat(v) || 0;
            updateWxLoading(pct);
        }
    });

    const loadingText = createFakeElement('div');
    loadingText.className = 'loading-text';
    Object.defineProperty(loadingText, 'textContent', {
        get() { return loadingText._text || ''; },
        set(v) {
            loadingText._text = String(v);
            updateWxLoading(loadingProgress._width ? parseFloat(loadingProgress._width) : 0);
        }
    });

    Object.defineProperty(preloadContainer.style, 'opacity', {
        get() { return preloadContainer._opacity || '1'; },
        set(v) { preloadContainer._opacity = v; if (parseFloat(v) <= 0.01) hideWxLoading(); }
    });
    Object.defineProperty(preloadContainer.style, 'display', {
        get() { return preloadContainer._display || 'block'; },
        set(v) { preloadContainer._display = v; if (v === 'none') hideWxLoading(); }
    });

    const elementsById = {
        'canvas': mainCanvas,
        'game-container': gameContainer,
        'animation_container': animationContainer,
        'preload_container': preloadContainer,
        'site-background': siteBackground,
        'site-logo': siteLogo
    };

    const ourDocument = {
        documentElement: html,
        body: body,
        head: head,
        readyState: 'complete',
        location: G.location,
        title: 'Dragon Egg',
        URL: '',
        createElement: function (tag) {
            tag = String(tag).toLowerCase();
            if (tag === 'canvas') {
                if (isWX && wx.createOffscreenCanvas) {
                    try { return wx.createOffscreenCanvas({ type: '2d' }); } catch (e) {}
                }
                return mainCanvas;
            }
            if (tag === 'img') return new (G.Image)();
            if (tag === 'audio') return new (G.Audio)();
            if (tag === 'script') {
                const s = createFakeElement('script');
                s._isScript = true;
                return s;
            }
            if (tag === 'style') return createFakeElement('style');
            if (tag === 'link') return createFakeElement('link');
            if (tag === 'div') return createFakeElement('div');
            return createFakeElement(tag);
        },
        createTextNode: function (text) { return { nodeType: 3, textContent: String(text) }; },
        getElementById: function (id) { return elementsById[id] || null; },
        getElementsByTagName: function (tag) {
            tag = String(tag).toLowerCase();
            if (tag === 'body') return [body];
            if (tag === 'head') return [head];
            return [];
        },
        querySelector: function (sel) {
            if (sel === '.loading-progress') return loadingProgress;
            if (sel === '.loading-text') return loadingText;
            if (sel === '.loading-container') return preloadContainer;
            if (sel === '#preload_container') return preloadContainer;
            if (sel === '#canvas') return mainCanvas;
            if (sel === '#game-container') return gameContainer;
            if (sel === '#animation_container') return animationContainer;
            return null;
        },
        querySelectorAll: function () { return []; },
        addEventListener: function (type, listener) { addListener(documentListeners, type, listener); },
        removeEventListener: function (type, listener) { removeListener(documentListeners, type, listener); },
        dispatchEvent: function (event) { dispatchListeners(documentListeners, event.type, event); return true; },
        createEvent: function (type) { return { type: type, bubbles: false, cancelable: false }; }
    };

    // 微信部分运行环境已经存在原生 document，必须强制替换/打补丁，否则 bundle 会把它当真实 DOM 使用
    if (!safeDefine(G, 'document', ourDocument)) {
        const nativeDoc = G.document;
        if (nativeDoc) {
            const methodsToPatch = ['createElement', 'createTextNode', 'getElementById', 'getElementsByTagName', 'querySelector', 'querySelectorAll', 'addEventListener', 'removeEventListener', 'dispatchEvent', 'createEvent'];
            methodsToPatch.forEach((m) => {
                safeOverride(nativeDoc, m, ourDocument[m]);
            });
            safeOverride(nativeDoc, 'body', body);
            safeOverride(nativeDoc, 'head', head);
            safeOverride(nativeDoc, 'documentElement', html);
            safeOverride(nativeDoc, 'readyState', 'complete');
            safeOverride(nativeDoc, 'title', 'Dragon Egg');
        }
    }
    const document = G.document || ourDocument;

    // body/head appendChild 特殊处理 script
    function handleAppend(parent, child) {
        parent.children.push(child);
        parent.childNodes.push(child);
        safeSetParentNode(child, parent);
        if (child._isScript && child.onload) {
            // 外部脚本不加载；本地脚本尝试 require
            setTimeout(() => {
                try {
                    if (child.src && !/^https?:\/\//.test(child.src)) {
                        require(child.src);
                    }
                } catch (e) {}
                if (typeof child.onload === 'function') child.onload();
            }, 0);
        }
        return child;
    }
    body.appendChild = function (child) { return handleAppend(body, child); };
    head.appendChild = function (child) { return handleAppend(head, child); };

    G.addEventListener = function (type, listener) { addListener(windowListeners, type, listener); };
    G.removeEventListener = function (type, listener) { removeListener(windowListeners, type, listener); };

    G.getComputedStyle = function (el) {
        if (el && el.style) return el.style;
        return {
            paddingLeft: '0', paddingRight: '0', paddingTop: '0', paddingBottom: '0',
            borderLeftWidth: '0', borderRightWidth: '0', borderTopWidth: '0', borderBottomWidth: '0',
            width: '0', height: '0'
        };
    };

    // 8. Image / Audio 垫片
    G.HTMLImageElement = G.HTMLImageElement || function () {};
    G.HTMLAudioElement = G.HTMLAudioElement || function () {};
    G.HTMLVideoElement = G.HTMLVideoElement || function () {};

    function ImageShim() {
        if (!isWX) return createFakeElement('img');
        // 直接返回微信图片对象，它天然支持 onload/onerror/src
        return wx.createImage();
    }
    G.Image = ImageShim;

    function AudioShim() {
        const audio = isWX ? wx.createInnerAudioContext() : createFakeElement('audio');
        if (!isWX) return audio;
        let _oncanplay = null;
        let _onended = null;
        let _onerror = null;
        audio.onCanplay(function () { if (_oncanplay) _oncanplay(); });
        audio.onEnded(function () { if (_onended) _onended(); });
        audio.onError(function (e) { if (_onerror) _onerror(e); });
        return new Proxy(audio, {
            get(target, prop) {
                if (prop === 'oncanplaythrough' || prop === 'oncanplay') return _oncanplay;
                if (prop === 'onended') return _onended;
                if (prop === 'onerror') return _onerror;
                return target[prop];
            },
            set(target, prop, value) {
                if (prop === 'oncanplaythrough' || prop === 'oncanplay') { _oncanplay = value; return true; }
                if (prop === 'onended') { _onended = value; return true; }
                if (prop === 'onerror') { _onerror = value; return true; }
                target[prop] = value;
                return true;
            }
        });
    }
    G.Audio = AudioShim;

    // 9. XMLHttpRequest 垫片（基于 wx.request）
    function XMLHttpRequestShim() {
        this._headers = {};
        this._method = 'GET';
        this._url = '';
        this._async = true;
        this.readyState = 0;
        this.status = 0;
        this.response = '';
        this.responseText = '';
        this.responseType = '';
        this.timeout = 0;
    }
    XMLHttpRequestShim.prototype.open = function (method, url, async) {
        this._method = method;
        this._url = url;
        this._async = async !== false;
        this.readyState = 1;
    };
    XMLHttpRequestShim.prototype.setRequestHeader = function (key, value) {
        this._headers[key] = value;
    };
    XMLHttpRequestShim.prototype.send = function (data) {
        if (!isWX) return;
        const self = this;
        const req = wx.request({
            url: this._url,
            method: this._method,
            header: this._headers,
            data: data,
            responseType: this.responseType,
            timeout: this.timeout || undefined,
            success(res) {
                self.status = res.statusCode || 200;
                self.response = res.data;
                self.responseText = (typeof res.data === 'string') ? res.data : JSON.stringify(res.data);
                self.readyState = 4;
                if (typeof self.onload === 'function') self.onload();
                if (typeof self.onreadystatechange === 'function') self.onreadystatechange();
            },
            fail(err) {
                self.readyState = 4;
                self.status = 0;
                if (typeof self.onerror === 'function') self.onerror(err);
                if (typeof self.onreadystatechange === 'function') self.onreadystatechange();
            }
        });
        this.abort = function () { try { req.abort(); } catch (e) {} };
    };
    XMLHttpRequestShim.prototype.getResponseHeader = function () { return null; };
    XMLHttpRequestShim.prototype.getAllResponseHeaders = function () { return ''; };
    G.XMLHttpRequest = XMLHttpRequestShim;

    // 10. Storage 垫片
    function makeStorage(prefix) {
        return {
            getItem(key) {
                if (!isWX) return null;
                try {
                    const value = wx.getStorageSync(prefix + key);
                    return value === undefined ? null : value;
                } catch (e) { return null; }
            },
            setItem(key, value) {
                if (!isWX) return;
                try { wx.setStorageSync(prefix + key, value); } catch (e) {}
            },
            removeItem(key) {
                if (!isWX) return;
                try { wx.removeStorageSync(prefix + key); } catch (e) {}
            },
            clear() {
                if (!isWX) return;
                try { wx.clearStorageSync(); } catch (e) {}
            },
            key(index) { return null; },
            length: 0
        };
    }
    G.localStorage = makeStorage('');
    G.sessionStorage = makeStorage('sess_');

    // 11. performance / requestAnimationFrame
    if (!G.performance) {
        safeDefine(G, 'performance', {
            now: function () { return Date.now(); },
            timing: {}
        });
    }
    if (typeof G.requestAnimationFrame !== 'function') {
        G.requestAnimationFrame = function (cb) { return setTimeout(cb, 16); };
    }
    if (typeof G.cancelAnimationFrame !== 'function') {
        G.cancelAnimationFrame = function (id) { clearTimeout(id); };
    }

    // 12. 工具兜底
    G.alert = G.alert || function (msg) { console.log('[alert]', msg); };
    G.confirm = G.confirm || function () {};
    G.prompt = G.prompt || function () {};
    G.open = G.open || function () {};
    G.close = G.close || function () {};

    // 13. 暴露常用工具
    G.__wxAdapterInstalled__ = true;
    G.__wxAdapterShowLoading__ = updateWxLoading;
    G.__wxAdapterHideLoading__ = hideWxLoading;
}

// 兼容 CommonJS / 脚本直接运行
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { install };
}
install();
