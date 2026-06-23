# Agent 协作说明

> 本文件用于指导 AI Agent 在 `mingame` 项目中高效协作。  
> 项目目标：将 H5 游戏 `011/` 适配并上架到微信小游戏（`011-wxgame/`），并按 AAI（IAA）模型改造玩法与广告系统。

---

## 一、项目结构

```
mingame/
├── 011/                    # H5 游戏源码（CreateJS + Adobe Animate + Webpack）
│   ├── src/                # 业务源码
│   │   ├── Localservices/  # 模拟后端：gameserver.js（核心玩法逻辑）
│   │   ├── modules/        # 功能模块：cardgame, guideline, leaderboard 等
│   │   ├── gamescense.js   # 游戏场景与 UI 交互
│   │   ├── init.js         # 游戏引擎初始化
│   │   ├── config.js       # 平台配置（当前为 googleplay）
│   │   └── ovosdk.js       # 平台 SDK 抽象层
│   ├── adsdk/              # 广告 SDK：android_ad.js, gd_ad.js
│   ├── dist/               # Webpack 生产构建产物
│   ├── assets/             # 图片与音效资源
│   ├── images/             # Animate 导出的图集
│   ├── libs/               # CreateJS 等外部库
│   ├── docs/               # 项目文档
│   │   └── aai-game-design.md   # AAI 改造方案
│   ├── index.html
│   ├── manifest.json
│   ├── package.json
│   └── webpack.config.js
├── 011res/                 # 美术原始资源（PSD/FLA/图标/宣传图）
└── 011-wxgame/             # 微信小游戏适配项目
    ├── game.js             # 小游戏入口
    ├── game.json
    ├── project.config.json
    ├── adapter.js          # BOM/DOM 垫片
    ├── wx-sdk-shim.js      # 微信音频/广告/平台覆盖
    ├── bundle.js           # 从 011/dist 同步的业务代码
    ├── resan/              # CreateJS + Animate 运行时
    ├── assets/             # 小游戏资源
    └── docs/               # 小游戏文档
        ├── createjs-wxgame-adaptation-guide.md
        └── wx-publish-checklist.md
```

---

## 二、开发规范

### 2.1 分支与目录约定

- **H5 源码修改**优先在 `011/src/` 进行，完成后重新运行 `npm run build` 生成 `dist/`
- **微信小游戏运行时代码**（如生命周期、分享、开放数据域）在 `011-wxgame/` 修改
- `011-wxgame/bundle.js` 通常是 `011/dist/bundle.js` 的复制/同步产物；修改玩法逻辑应改 `011/src/`，再同步到 `011-wxgame/`
- 资源文件优先放在 `011/assets/`，构建后会复制到 `dist/assets/`，再同步到 `011-wxgame/assets/`

### 2.2 构建命令

```bash
cd 011
npm install        # 首次
npm run dev        # 开发模式
npm run build      # 生产构建（输出到 dist/）
npm run build:raw  # 生产构建但不混淆
```

### 2.3 代码风格

- 使用 ES6 class/async/await
- 游戏逻辑核心在 `GameServer`（后端模拟）和 `GameScense`（前端表现）
- 广告调用统一通过 `ovo.xxxAd()` 或 `window.showXxxAd()` 桥接
- 新增模块放在 `src/modules/`，并在 `webpack.config.js` entry 中按需要加入
- 避免直接修改 `dist/` 或 `011-wxgame/bundle.js` 中的业务逻辑，应修改源码后重新构建

### 2.4 调试

- H5 本地调试：`cd 011/dist && python3 -m http.server 8888`
- 微信小游戏：用微信开发者工具导入 `011-wxgame/`

---

## 三、当前任务状态

### 已完成 ✅

- [x] 清理 `011-wxgame` 冗余文件，主包从 4.1MB 降至 2.9MB
- [x] 编写 `011/docs/aai-game-design.md` AAI 改造方案
- [x] 编写 `011-wxgame/docs/wx-publish-checklist.md` 上架清单

### 进行中 🔄

- [x] P0-1：调整每波生成数量与难度曲线（已完成）
- [x] P0-2：增加复活激励视频广告点（已完成基础实现）
- [ ] P0-3：增加双倍金币激励视频广告点
- [ ] P0-4：增加关卡胜利插屏广告
- [ ] P0-5：Banner 广告常驻

### 待办 ⬜

- [ ] P1：关卡系统、道具系统、金币经济、分享、每日任务
- [ ] P2：排行榜、成就、皮肤、活动
- [ ] 微信小游戏上架材料与合规

---

## 四、P0 实施清单（当前重点）

P0 是必须先完成的核心改造，直接决定广告变现能力：

1. **调整每波生成数量与难度曲线** ✅ 已完成
   - 已修改 `src/Localservices/gameserver.js` 和 `src/gamescense.js`
   - 新增 `getLevelConfig(level)`、`advanceLevel()` 方法
   - 关卡 1~2 每波 2 个蛋、目标 4 级；后续目标 4~7 级
   - 胜利条件改为按 `targetEggType` 判断，非最终关卡显示「下一关」

2. **增加「复活」激励视频广告点** ✅ 已完成基础实现
   - 新增 `GameServer.revive(waveCount)` 和 `spawnHistory`
   - 失败界面点击后弹出复活选择面板
   - 支持「看广告复活」「分享复活」「放弃并领取奖励"
   - 修改 `src/gamescense.js` 失败界面
   - 失败后弹出选择：看广告复活 / 分享复活 / 放弃
   - 复活效果：保留棋盘，移除最近 3 波生成的蛋

3. **增加「双倍金币」激励视频广告点**
   - 修改 `src/gamescense.js` 胜利界面
   - 关卡胜利后显示：普通领取 / 看广告双倍领取

4. **增加关卡胜利后的插屏广告**
   - 每 3 关通过后显示插屏

5. **Banner 广告常驻**
   - 首页、设置/暂停界面显示 Banner
   - 游戏主界面隐藏 Banner

---

## 五、Agent 工作指南

### 5.1 接到任务时

1. 先阅读本文件和 `011/docs/aai-game-design.md`
2. 确认修改应在 `011/src/` 还是 `011-wxgame/`
3. 修改后运行 `npm run build` 并同步相关产物到 `011-wxgame/`
4. 更新 `AGENTS.md` 中的任务状态

### 5.2 修改源码后必须执行

```bash
cd 011
npm run build
# 检查 dist/ 产物
# 将关键变更同步到 011-wxgame/bundle.js（如只改业务逻辑）
# 如新增资源，同步到 011-wxgame/assets/
```

### 5.3 文档维护

- 完成一个 P0 项后，在 `AGENTS.md` 标记 ✅
- 如实现与设计方案有偏差，同步更新 `011/docs/aai-game-design.md`

---

## 六、关键代码入口

| 功能 | 文件 | 关键方法/位置 |
|---|---|---|
| 游戏数据/地图/合成逻辑 | `src/Localservices/gameserver.js` | `getGameData`, `handleEggMove`, `generateRandomEggsFromMapState`, `getAvailableEggTypes` |
| 游戏场景/UI 交互 | `src/gamescense.js` | `initUIElements`, `onGameboxClick`, `executeEggMovement`, `failureHandler`, `victoryHandler` |
| 广告桥接 | `src/ovosdk.js` / `wx-sdk-shim.js` | `showInterstitialAd`, `showRewardedAd`, `showBannerAd` |
| 游戏入口/引擎 | `src/init.js` | `GameEngine.init`, `switchToGameScene` |
| 配置 | `src/config.js` | `window.Platform` |

---

## 七、注意事项

- 不要直接提交 git（用户未授权）
- 不要修改 `011res/` 中的原始美术文件
- 微信小游戏包体需保持 ≤ 4MB，新增资源前检查总大小
- 所有广告调用必须提供优雅降级（广告不可用时不阻断游戏）
- 修改后应在 H5 和微信开发者工具中分别验证

---

*最后更新：2026-06-17*
