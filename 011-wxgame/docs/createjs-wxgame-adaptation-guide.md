# CreateJS + Adobe Animate H5 → 微信小游戏 适配规则

> 项目：`011-wxgame`（Dragon Egg）  
> 用途：记录把现有 CreateJS / Adobe Animate H5 项目迁移到微信小游戏时的关键修改点，作为后续同类项目的兼容性规则参考。

---

## 1. 整体架构

不要重写业务逻辑，而是给 H5 运行时“造一个浏览器壳”。核心文件：

| 文件 | 职责 |
|------|------|
| `game.js` | 小游戏入口，按顺序加载垫片、运行时、业务代码，并触发 `DOMContentLoaded` |
| `adapter.js` | BOM/DOM 垫片层：`window`/`document`/`canvas`/`Image`/`Audio`/`localStorage`/`XHR` 等 |
| `wx-sdk-shim.js` | 平台能力覆盖层：音频、广告、统计、振动、CreateJS 运行时补丁 |
| `resan/vendor-animate-wx.js` | 原 `vendor-animate.js` 的微信包装版，确保在全局作用域执行 |
| `bundle.js` | 原 H5 业务逻辑（Webpack 产物），交互部分需要按本规则接管 |
| `game.json` / `project.config.json` | 小游戏项目配置 |

加载顺序（`game.js`）：

```js
require('./adapter.js');                 // 1. 先造浏览器环境
require('./resan/vendor-animate-wx.js'); // 2. 加载 CreateJS / AdobeAn 运行时
require('./wx-sdk-shim.js');             // 3. 覆盖平台相关能力
require('./bundle.js');                  // 4. 加载业务逻辑
// 5. 触发 DOMContentLoaded 启动引擎
```

---

## 2. BOM/DOM 垫片规则（adapter.js）

### 2.1 全局对象

- `globalThis` 即 `window`/`self`/`top`/`parent`，避免业务代码找不到 `window`。
- `navigator` 必须可写；微信的 `Navigator` 是只读宿主对象，采用**原型继承包装**后替换：

```js
const originalNav = G.navigator || {};
const navigator = Object.create(originalNav);
navigator.userAgent = sysInfo.userAgent || '...';
navigator.platform  = sysInfo.platform || 'iOS';
navigator.language  = sysInfo.language || 'zh-CN';
navigator.maxTouchPoints = 5;
navigator.vibrate = function () { wx.vibrateShort({ type: 'light' }); };
safeDefine(G, 'navigator', navigator);
```

- `screen`、`location`、`devicePixelRatio`、`innerWidth/Height`、`pageXOffset/Y` 等全部补齐。
- `addEventListener`/`removeEventListener`/`dispatchEvent` 用 Map 自行管理，不要依赖微信宿主对象。

### 2.2 Canvas

- 主画布使用 `wx.createCanvas()`。
- 给主画布补全浏览器属性：`style`、`offsetWidth/Height`、`setAttribute/getAttribute`、`getBoundingClientRect`。
- `getBoundingClientRect()` 返回**逻辑像素尺寸**（`innerWidth × innerHeight`），不要返回物理像素。
- 不要把主 canvas 2D 上下文强制设为 `willReadFrequently: true`，这会影响渲染性能；需要频繁读像素的是 CreateJS 内部的离屏命中测试 canvas，见 3.2。

### 2.3 触摸事件映射

微信只提供 `wx.onTouchStart/Move/End/Cancel`，需要把它们映射成 CreateJS 需要的鼠标/触摸事件：

| 微信事件 | 分发到 canvas | 分发到 window | 分发到 document |
|----------|---------------|---------------|-----------------|
| `touchstart` | `touchstart`、`mousedown` | - | `touchstart` |
| `touchmove`  | `touchmove` | `mousemove` | - |
| `touchend`   | `touchend` | `mouseup` | `click`（用于解锁音频） |
| `touchcancel`| - | `mouseup` | - |

注意：
- `mousedown` 必须派发到 **canvas**，因为 Stage 把 `mousedown`/`dblclick` 监听器挂在 canvas 上。
- `mouseup`/`mousemove` 必须派发到 **window**，因为 Stage 把它们挂在 `window` 上。
- `document` 需要收到 `click`/`touchstart`，否则 `bundle.js` 里通过 `document.addEventListener('click', enableAudio)` 解锁 BGM 的逻辑不会生效。
- 如果决定禁用 Stage DOM 事件（推荐，见 3.6），则 `mousedown`/`mouseup`/`mousemove` 不再被 Stage 消费，但仍建议保留映射，因为可能有其他库依赖。

### 2.4 假 DOM 元素

- `document.createElement('div'/'script'/'style'/'link'...)` 返回自研的假元素对象。
- `appendChild`/`removeChild` 设置 `parentNode` 时，必须用 `safeSetParentNode` 兼容只读 getter：

```js
function safeSetParentNode(child, parent) {
    try { child.parentNode = parent; return; } catch (e) {}
    try {
        Object.defineProperty(child, 'parentNode', {
            get() { return parent; },
            set(v) { parent = v; },
            configurable: true, enumerable: true
        });
    } catch (e) {}
}
```

### 2.5 Image / Audio 垫片

- `Image` → `wx.createImage()`。
- `Audio` → `wx.createInnerAudioContext()`，并用 `Proxy` 把 `oncanplay`/`onended`/`onerror` 映射到微信事件。
- `HTMLImageElement` / `HTMLAudioElement` / `HTMLVideoElement` 至少给个空构造函数，避免 `instanceof` 报错。

### 2.6 Storage / XHR

- `localStorage` / `sessionStorage` → `wx.getStorageSync` / `wx.setStorageSync`。
- `XMLHttpRequest` → `wx.request`。

---

## 3. CreateJS 运行时补丁规则

### 3.1 vendor-animate.js 必须在全局作用域执行

原 `vendor-animate.js` 是 IIFE，在 CommonJS `require` 时会在模块作用域执行，导致 `createjs`/`AdobeAn` 挂不到全局。包装版 `vendor-animate-wx.js` 用 `.call(globalThis)` 强制在全局作用域执行：

```js
(function (window) {
    // ... 原 vendor-animate.js 完整内容 ...
}).call(globalThis);
```

### 3.2 必须提前注入 `createjs.createCanvas`

CreateJS 在加载时会立即创建多个内部 canvas：

- `DisplayObject._hitTestCanvas`（点击命中测试）
- `Graphics._ctx`（测量绘制）
- `Text._workingContext`
- `SpriteSheetUtils._workingCanvas`
- `SpriteSheetBuilder` / `DisplayObject.cache` 等

如果 `document.createElement('canvas')` 返回的是主 canvas，命中测试绘制的内容会直接画到主屏幕上，表现为**点击时左上角闪现被点击区域的画面**。

**规则：在 vendor 加载前，先把 `createjs.createCanvas` 指向微信离屏 canvas 工厂。**

```js
if (isWX && wx.createOffscreenCanvas) {
    const createjsObj = G.createjs || (G.createjs = {});
    createjsObj.createCanvas = function () {
        try { return wx.createOffscreenCanvas({ type: '2d' }); } catch (e) {}
        return null;
    };
}
```

同时在 `wx-sdk-shim.js` 里再做一次兜底替换并校验：

```js
function makeOffscreenCanvas() {
    if (isWX && wx.createOffscreenCanvas) {
        try { return wx.createOffscreenCanvas({ type: '2d' }); } catch (e) {}
    }
    return null;
}
createjs.createCanvas = createjs.createCanvas || makeOffscreenCanvas;
const hitCanvas = makeOffscreenCanvas();
if (hitCanvas && hitCanvas.getContext) {
    hitCanvas.width = hitCanvas.height = 1;
    let ctx = null;
    try { ctx = hitCanvas.getContext('2d', { willReadFrequently: true }); } catch (e) {}
    if (!ctx) ctx = hitCanvas.getContext('2d');
    const mainCanvas = document.getElementById('canvas');
    if (ctx && hitCanvas !== mainCanvas) {
        createjs.DisplayObject._hitTestCanvas = hitCanvas;
        createjs.DisplayObject._hitTestContext = ctx;
    }
}
```

> **核心规则**：命中测试 canvas 绝对不能和主 canvas 是同一个对象。  
> **注意**：这一步能消除“左上角闪现画面”的现象，但**不一定能消除所有点击闪烁**，见 3.6。

### 3.3 图片加载相关补丁

#### (1) `isImageTag` 判断

微信 `wx.createImage()` 返回的不是标准 `HTMLImageElement`，需要 patch `LoadItem.isImageTag` / `DomUtils.isImageTag`：

```js
function isWxImageTag(item) {
    return !!(item && typeof item.src === 'string' && 'width' in item && 'height' in item);
}
```

#### (2) `tag.complete` 只读

微信 Image 的 `complete` 可能是只读 getter。`TagRequest._handleTagComplete` 原来会写 `tag.complete = true`，需要安全写入：

```js
function safeSetTagComplete(tag) {
    if (!tag || tag.complete === true) return;
    try { tag.complete = true; return; } catch (e) {}
    try { Object.defineProperty(tag, 'complete', { value: true, configurable: true, enumerable: true, writable: true }); } catch (e) {}
}
```

#### (3) `parentNode` 只读

微信宿主对象的 `parentNode` 可能只有 getter，参考 2.4 的 `safeSetParentNode` 处理。

### 3.4 点击坐标映射

微信 `canvas.getBoundingClientRect()` 可能返回 `null`，导致 `Stage._getElementRect` 算出无效矩形，点击永远在画布外。需要覆盖：

```js
createjs.Stage.prototype._getElementRect = function (e) {
    const dpr = G.devicePixelRatio || 1;
    let bounds;
    try { bounds = e.getBoundingClientRect(); } catch (err) {}
    if (!bounds || bounds.left == null || bounds.width == null) {
        const w = e.width ? e.width / dpr : G.innerWidth;
        const h = e.height ? e.height / dpr : G.innerHeight;
        bounds = { left: 0, top: 0, right: w, bottom: h, width: w, height: h };
    }
    // ... 计算 left/right/top/bottom
};
```

### 3.5 音频接管

CreateJS `Sound` 默认基于 Web Audio / HTMLAudio，在微信小游戏里必须替换为 `InnerAudioContext`：

- 用 `Proxy` 包装原 `createjs.Sound`。
- 拦截 `registerSound` / `play` / `stop` / `muted` / `volume` 等属性和方法。
- `registerSound` 时创建 `InnerAudioContext` 并预加载。
- `play` 返回自定义实例，内部调用 `audio.play()`，`loop` 对应 `audio.loop`。
- `muted` / `volume` 改为管理所有活跃音频的 `volume`。

同时需要在首次用户交互时解锁音频：

```js
// adapter.js 触摸结束时向 document 派发 click
dispatchDocument('click', clickEvt);
```

并在 `wx-sdk-shim.js` 里重置默认音效/音乐开关（原 H5 可能把 `soundEnabled` 存成了 `false`）：

```js
if (G.localStorage.getItem('__wx_sound_defaults_v1__') !== 'done') {
    G.localStorage.setItem('soundEnabled', 'true');
    G.localStorage.setItem('musicEnabled', 'true');
    G.localStorage.setItem('__wx_sound_defaults_v1__', 'done');
}
```

### 3.6 点击闪烁问题（核心修复规则）

#### 3.6.1 现象

- 点击按钮或屏幕时，整个画面闪烁一下。
- Console 出现 `Canvas2D: Multiple readback operations using getImageData...`。
- 偶发“左上角闪现被点击对象”。

#### 3.6.2 根本原因

CreateJS 的 Stage 鼠标事件默认会调用 `_getObjectsUnderPoint`。该函数会把显示对象绘制到**命中测试 canvas** 上，然后调用 `getImageData` 读像素判断命中。在微信小游戏环境下，这个“绘制 → 读回”操作会触发 GPU 同步，导致整屏闪烁。

原因分两层：

1. **命中测试 canvas 和主 canvas 是同一个对象**（3.2 已解决）。  
   这时绘制命中测试内容会直接画到屏幕上，表现为左上角闪现。
2. **命中测试 canvas 已经是离屏 canvas，但复杂 Adobe Animate 矢量形状仍被绘制、读取像素**。  
   这就是即使做了 3.2，复杂按钮/弹窗仍然闪烁的原因。

#### 3.6.3 完整修复方案

**推荐方案：禁用 Stage DOM 事件 + 手动触摸分发。**

步骤如下：

**① 创建 Stage 后立即关闭 DOM 事件**

```js
this.stage = new createjs.Stage(this.canvas);
this.stage.enableDOMEvents(false);
this.stage.enableMouseOver(0);
```

这样 Stage 不再监听 `mousedown`/`mouseup`/`mousemove`/`dblclick`，`_getObjectsUnderPoint` 不会被触发，从根本上避免绘制/读像素。

**② 用 canvas 原生 `touchstart` 接管所有交互**

在业务代码中维护一个手动目标列表，绕过 CreateJS 命中测试：

```js
// 初始化
this._manualTouchTargets = [];

// 注册手动目标（同时把 mouseEnabled 关掉，防止 Stage 命中测试）
_addManualTouchTarget(mc, handler) {
    if (!mc || typeof handler !== 'function') return;
    mc.mouseEnabled = false; // 让 Stage 命中测试跳过它
    this._manualTouchTargets.push({ mc, handler });
}

// 基于 bounds 的命中测试（包含可见性检查）
_hitTestMc(mc, globalX, globalY) {
    if (!mc || !mc.visible) return false;
    let p = mc.parent;
    while (p) { if (!p.visible) return false; p = p.parent; }
    const local = mc.globalToLocal(globalX, globalY);
    let bounds;
    try { bounds = mc.getBounds(); } catch (e) {}
    if (!bounds) return false;
    return local.x >= bounds.x && local.y >= bounds.y
        && local.x <= bounds.x + bounds.width && local.y <= bounds.y + bounds.height;
}

// 绑定 canvas touchstart
_setupManualTouch() {
    if (this._manualTouchBound || !this.canvas) return;
    this._manualTouchBound = true;

    this.canvas.addEventListener('touchstart', (e) => {
        const touch = e.changedTouches && e.changedTouches[0] || e.touches && e.touches[0];
        if (!touch) return;

        const rect = this.canvas.getBoundingClientRect();
        const dprFactor = this.canvas.width / rect.width;
        const globalX = (touch.clientX - rect.left) * dprFactor;
        const globalY = (touch.clientY - rect.top) * dprFactor;

        // 从后往前（顶层优先）命中
        for (let i = this._manualTouchTargets.length - 1; i >= 0; i--) {
            const { mc, handler } = this._manualTouchTargets[i];
            if (!this._hitTestMc(mc, globalX, globalY)) continue;
            const local = mc.globalToLocal(globalX, globalY);
            handler({
                type: 'click',
                currentTarget: mc,
                target: mc,
                localX: local.x,
                localY: local.y,
                stageX: globalX,
                stageY: globalY,
                stopPropagation: function () {},
                preventDefault: function () {}
            });
            return;
        }
    });
}
```

**③ 把所有可交互对象改为手动注册**

原代码中所有 `.on('click', ...)` 都要改成：

```js
this._addManualTouchTarget(buttonMc, () => {
    // 原 click 逻辑
});
```

需要接管的典型对象：

- 游戏主交互区（如 `gamebox`）
- 顶部功能按钮（如 `btn_restart`、`btn_setting`）
- 弹窗按钮（设置关闭、难度选择、音乐/音效/震动开关、START OVER 确认、失败/胜利重试）
- 弹窗屏蔽层（`blockLayer`）
- 抽卡/奖励面板按钮（如 `btn_go`）

**④ 面板容器也要禁用命中测试**

对于弹窗/面板容器，设置 `mouseEnabled = false`，只让子按钮走手动分发：

```js
settingsMc.mouseEnabled = false;
failureMc.mouseEnabled = false;
victoryMc.mouseEnabled = false;
mc_start_over.mouseEnabled = false;
```

**⑤ 坐标一定要用物理像素**

`canvas.getBoundingClientRect()` 返回逻辑像素，CreateJS 内部使用物理像素。手动分发时必须乘以 `canvas.width / rect.width`：

```js
const dprFactor = this.canvas.width / rect.width;
const globalX = (touch.clientX - rect.left) * dprFactor;
const globalY = (touch.clientY - rect.top) * dprFactor;
```

**⑥ 可见性检查必不可少**

手动分发函数必须跳过不可见对象，否则一个隐藏弹窗的 `blockLayer` 可能错误地吸走点击：

```js
// _hitTestMc 里已检查 mc.visible 及所有父级的 visible
```

**⑦ 不要调用 `createjs.Touch.enable(stage)`**

`Touch.enable` 会在 canvas 上挂 `touchstart`/`touchmove`/`touchend` 并转回 Stage 鼠标事件，重新触发命中测试。如果已经禁用了 Stage DOM 事件，再启用 `Touch` 会把闪烁问题带回来。

#### 3.6.4 备选方案

如果项目交互极少、形状简单，也可以尝试：

- 对所有复杂显示对象调用 `.cache()` / `.updateCache()`，让命中测试走缓存位图而不是重绘矢量。  
- 为按钮设置 `hitArea`（一个纯色 Shape），减少命中测试绘制面积。  

但在 Adobe Animate 导出的大型 MovieClip 上，手动接管触摸是最稳定、最具可维护性的方案。

---

## 4. 平台能力覆盖规则（wx-sdk-shim.js）

### 4.1 平台标识

```js
G.Platform = 'wechat';
```

原 `bundle.js` 会根据 `Platform` 走不同分支（如 Google Play / GameDistribution），设置为微信后这些分支会自然降级或跳过。

### 4.2 ovo SDK 桥接

原项目通过 `window.ovo` 调用广告、统计、振动。直接覆盖这些 API：

| ovo API | 微信实现 |
|---------|----------|
| `ovo.showBannerAd` | `wx.createBannerAd` |
| `ovo.showInterstitialAd` | `wx.createInterstitialAd` |
| `ovo.showRewardedAd` | `wx.createRewardedVideoAd` |
| `ovo.vibrate` | `wx.vibrateShort` / `wx.vibrateLong` |
| `ovo.dotXxx` | `wx.reportAnalytics` |

注意：`bundle.js` 加载后会覆盖 `ovo.showBannerAd` 为调用 `window.showBannerAd` 的版本。因此 `window.showBannerAd` 必须引用**内部实现函数**而不是 `ovo.showBannerAd`，否则会循环调用栈溢出。

```js
function _showBannerAd(cb) { /* 微信实现 */ }
ovo.showBannerAd = _showBannerAd;
G.showBannerAd = function (cb) { _showBannerAd(cb); }; // 不要写成 ovo.showBannerAd(cb)
```

### 4.3 gtag / dataLayer

原项目可能调用 `gtag`。给个空实现兜底：

```js
G.gtag = function () { console.log('[gtag]', arguments); };
G.dataLayer = [];
```

---

## 5. 小游戏项目配置

### 5.1 game.json

```json
{
  "deviceOrientation": "portrait",
  "showStatusBar": false,
  "networkTimeout": {
    "request": 10000,
    "connectSocket": 10000,
    "uploadFile": 10000,
    "downloadFile": 10000
  }
}
```

### 5.2 project.config.json

- `compileType` 必须为 `"game"`。
- `appid` 替换为真实小游戏 AppID。
- `libVersion` 可指定基础库版本。

---

## 6. 常见问题速查

### Q1：启动时报 `createjs is not defined`

A：检查 `vendor-animate-wx.js` 是否用 `.call(globalThis)` 在全局作用域执行；检查 `game.js` 加载顺序是否正确。

### Q2：图片加载卡住，报 `complete` 或 `parentNode` 只读

A：参考 3.3 的 `safeSetTagComplete` 和 2.4 的 `safeSetParentNode`。

### Q3：界面能渲染，但点击没反应

A：
1. 确认 `wx.onTouchStart` 是否正常触发。
2. 确认 `mousedown` 派发到了 canvas，`mouseup`/`mousemove` 派发到了 window。
3. 检查 `Stage._getElementRect` 是否返回了有效矩形（不能是 `null`）。
4. 如果已经禁用了 Stage DOM 事件，确认对应按钮已走 `_addManualTouchTarget` 手动注册。

### Q4：点击时左上角闪现被点击区域的画面

A：这是 `DisplayObject._hitTestCanvas` 和主 canvas 是同一个对象导致的。必须：
1. 在 `adapter.js` 提前注入 `createjs.createCanvas = () => wx.createOffscreenCanvas(...)`。
2. 在 `wx-sdk-shim.js` 里替换 `createjs.DisplayObject._hitTestCanvas` 为离屏 canvas，并校验 `hitCanvas !== mainCanvas`。

### Q5：点击时整屏闪烁 / Console 报 `Canvas2D: Multiple readback operations using getImageData...`

A：即使命中测试 canvas 已经是离屏 canvas，CreateJS 仍会在每次点击时把复杂矢量形状绘制到离屏 canvas 并 `getImageData`。微信小游戏里这个 GPU 读回操作会造成闪烁。完整修复：
1. 创建 Stage 后调用 `stage.enableDOMEvents(false)` 和 `stage.enableMouseOver(0)`。
2. 用 canvas `touchstart` 手动分发所有点击事件（参考 3.6）。
3. 所有可交互元件和面板容器设置 `mouseEnabled = false`。
4. 不要调用 `createjs.Touch.enable(stage)`。

### Q6：没有声音

A：
1. 确认 `wx-sdk-shim.js` 已接管 `createjs.Sound`。
2. 确认触摸结束时已向 `document` 派发 `click` 事件解锁音频。
3. 检查 `localStorage` 中 `soundEnabled` / `musicEnabled` 是否为 `'true'`。

### Q7：`showBannerAd` 循环调用栈溢出

A：`G.showBannerAd` 不要指向 `ovo.showBannerAd`，要指向内部实现函数。

---

## 7. 后续迁移 checklist

- [ ] 复制 H5 产物：`bundle.js`、`vendor-animate.js`、图集、资源。
- [ ] 创建 `vendor-animate-wx.js` 包装版（全局作用域执行）。
- [ ] 编写 `adapter.js` 垫片（全局对象、canvas、触摸、Image/Audio、Storage、XHR）。
- [ ] 编写 `wx-sdk-shim.js`（音频、广告、统计、CreateJS 补丁）。
- [ ] 提前注入 `createjs.createCanvas` 使用离屏 canvas。
- [ ] 替换 `DisplayObject._hitTestCanvas` 为离屏 canvas 并校验 `!== mainCanvas`。
- [ ] 覆盖 `Stage._getElementRect` 防 `null`。
- [ ] **创建 Stage 后禁用 DOM 事件**：`stage.enableDOMEvents(false)` + `stage.enableMouseOver(0)`。
- [ ] **把所有 `.on('click', ...)` 改为手动触摸分发**，并设置 `mouseEnabled = false`。
- [ ] 面板容器设置 `mouseEnabled = false`。
- [ ] 手动命中测试时坐标乘以 `canvas.width / rect.width` 转为物理像素。
- [ ] 手动命中测试包含可见性检查（自身 + 父级）。
- [ ] 不调用 `createjs.Touch.enable(stage)`。
- [ ] 配置 `game.json` / `project.config.json`。
- [ ] 在微信开发者工具中测试：渲染 → 点击无闪烁 → 音效 → 广告回调不报错。

---

## 8. 参考资料

- 微信小游戏官方文档：Canvas / 触摸事件 / InnerAudioContext / 广告 / 数据上报
- CreateJS 官方文档：`Stage`、`DisplayObject._hitTestCanvas`、`Touch`、`Sound`
- 本项目关键文件：`adapter.js`、`wx-sdk-shim.js`、`game.js`、`resan/vendor-animate-wx.js`、`bundle.js`
