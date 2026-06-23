# 011 Dragon Egg — 微信小游戏适配版

项目位置：`/Volumes/ovokit2t/minigame/011-wxgame`

这是一个直接把现有 H5 项目 `011/` 适配到微信小游戏的方案。核心思路是：

- 复用 `011` 已经打包好的 `bundle.js`（业务逻辑）和 `resan/vendor-animate.js`（CreateJS + Adobe Animate 运行时）
- 用 `adapter.js` 提供 BOM/DOM 垫片（`window`/`document`/`canvas`/`Image`/`Audio`/`localStorage`/`XMLHttpRequest` 等）
- 用 `wx-sdk-shim.js` 覆盖平台相关能力：音频、广告、统计、振动、平台标识

## 文件结构

```
011-wxgame/
├── game.js                 # 小游戏入口
├── game.json               # 小游戏全局配置
├── project.config.json     # 微信开发者工具项目配置
├── adapter.js              # BOM/DOM 垫片
├── wx-sdk-shim.js          # 微信音频/广告/统计覆盖
├── bundle.js               # 011 业务逻辑（webpack 产物）
├── resan/
│   ├── vendor-animate.js   # 原始 CreateJS + Adobe Animate 运行时
│   ├── vendor-animate-wx.js# 微信包装版（全局作用域执行）
│   └── images/             # Animate 图集
└── assets/                 # 图片与音效资源
```

## 快速开始

1. 打开 **微信开发者工具**。
2. 选择 **导入项目**，目录选择 `/Volumes/ovokit2t/minigame/011-wxgame`。
3. 在 `project.config.json` 中把 `appid` 从 `touristappid` 替换为你的小游戏 AppID。
4. 点击 **编译** 运行。

## 需要补充的配置

### 1. AppID

编辑 `project.config.json`：

```json
{
  "appid": "wxYourAppIdHere"
}
```

### 2. 广告单元 ID（可选）

编辑 `wx-sdk-shim.js` 中的 `AD_CONFIG`：

```js
const AD_CONFIG = {
    bannerAdUnitId: '',           // 横幅广告 ID
    interstitialAdUnitId: '',     // 插屏广告 ID
    rewardedVideoAdUnitId: ''     // 激励视频广告 ID
};
```

如果留空，广告 API 会优雅降级为无操作，不会阻断游戏流程。

### 3. 音效（已自动接管）

`wx-sdk-shim.js` 已经把 `createjs.Sound` 替换为微信 `InnerAudioContext` 实现，支持 BGM 循环、音效播放、静音/恢复。无需额外配置。

## 设计分辨率

原项目设计分辨率为竖屏 `1080×1920`。微信小游戏中使用 `fitHeight` 等效策略：适配层会让 `canvas` 铺满屏幕，CreateJS Stage 在 `init.js` 内部完成缩放与居中。

## 已知限制与注意事项

- 原项目的 HTML 加载条被替换为微信原生 `wx.showLoading`，进度仍由原逻辑驱动。
- 原项目的 Google Play / GameDistribution SDK 逻辑在微信环境下会被安全跳过或覆盖。
- 登录逻辑被 `GameServer.setLoginConfig({ forceLoginType: 'guest' })` 强制为游客模式，避免后端依赖。
- 若在微信开发者工具中遇到 `createjs`/`AdobeAn` 未定义，检查 `game.js` 是否正确以全局作用域加载了 `vendor-animate.js`。
- 真机调试时若触摸无响应，请检查 `adapter.js` 中 `wx.onTouchStart/Move/End/Cancel` 是否正确映射到 `mousedown/mousemove/mouseup`。
- 真机点击若出现闪烁，已通过在 `GameEngine` 中禁用 Stage DOM 事件 + `GameScene` 手动接管 `touchstart` 解决，详见 `docs/createjs-wxgame-adaptation-guide.md` 第 3.6 节。

## 后续可选优化

- 把 `011` 的源码直接迁入本项目，用 Webpack 重新打包，去掉冗余的 H5 DOM 逻辑。
- 使用微信分包能力，把 `resan/vendor-animate.js` 和 `bundle.js` 拆到子包。
- 接入 `wx.getUserInfo` / `wx.login` 做真正的微信登录与云存档。
- 替换 `wx.showLoading` 为游戏内自定义 Canvas 加载界面。
