# 011 Dragon Egg 微信小游戏上架待办清单

> 本文档汇总当前 `011-wxgame` 项目距离微信小游戏正式上架还需要完成的所有事项。  
> 已完成项用 ✅ 标记，待完成项用 ⬜ 标记。后续按优先级逐步实施。

---

## 一、已具备条件

| 序号 | 条件 | 状态 | 说明 |
|---|---|---|---|
| 1 | 小游戏项目基础配置 | ✅ | `game.json`、`project.config.json` 已创建，`compileType: "game"` |
| 2 | BOM/DOM 垫片 | ✅ | `adapter.js` 已提供 window/document/canvas/Image/Audio/Storage/XHR 等 |
| 3 | CreateJS 音频接管 | ✅ | `createjs.Sound` 已 Proxy 到 `wx.InnerAudioContext` |
| 4 | 点击命中测试修复 | ✅ | 已替换为离屏 canvas，并给出手动触摸分发方案 |
| 5 | 平台标识 | ✅ | `G.Platform = 'wechat'` |
| 6 | 广告 API 桥接 | ✅ | Banner / 插屏 / 激励视频代码已写好，但 ID 未填充 |
| 7 | 本地存储垫片 | ✅ | `localStorage` 已映射到 `wx.getStorageSync` |
| 8 | 软著 | ✅ | 已拥有软件著作权登记证书 |

---

## 二、🔴 阻塞项（必须先解决，否则无法提交审核/上传）

### 2.1 主包体积超过 4MB 上限

- **当前状态**：`011-wxgame` 目录总大小约 **4.1MB**，微信小游戏主包上限为 **4MB**。
- **原因**：`resan/vendor-animate.js`（1.1MB）与 `resan/vendor-animate-wx.js`（1.1MB）并存，而 `game.js` 实际只引用 `vendor-animate-wx.js`。
- **解决方案**：
  - [x] 删除 `resan/vendor-animate.js`（已删除，释放 1.1MB）
  - [x] 检查 `bundle.js` 内对 `"src": "resan/vendor-animate.js"` 的引用，统一改为 `"resan/vendor-animate-wx.js"`（已替换 2 处）
  - [x] 重新用微信开发者工具查看「代码包大小」，确保主包 ≤ 4MB（当前约 2.9MB，已满足）
- **本次清理额外删除的无用资源**：
  - `assets/image/background.png`（4KB，无任何引用）
  - `assets/image/background3.jpg`（32KB，仅被未加载的 style.css 引用）
  - `assets/sound/HappyWinGame.mp3`（8KB，无任何引用）
  - `style.css`（4KB，微信小游戏不会加载 CSS 文件）
- **预期结果**：删除后主包约 3.0MB，满足上传要求。

### 2.2 广告单元 ID 未配置

- **位置**：`wx-sdk-shim.js` 第 59 行
- **当前状态**：
  ```js
  const AD_CONFIG = {
      bannerAdUnitId: '',
      interstitialAdUnitId: '',
      rewardedVideoAdUnitId: '',
      videoAdUnitId: ''
  };
  ```
- **解决方案**：
  - [ ] 在微信公众平台「流量主」模块创建广告位
  - [ ] 获取 Banner、插屏、激励视频广告单元 ID
  - [ ] 填入 `AD_CONFIG`，并测试真机广告展示
- **注意**：如果不上广告变现，可保留空值，但需在审核说明中注明「暂无广告」。

### 2.3 登录仍为强制游客模式

- **当前状态**：`bundle.js` 中调用 `GameServer.setLoginConfig({ forceLoginType: 'guest' })`
- **影响**：无法使用微信账号体系、云存档、好友排行榜等功能；部分类目审核可能要求账号体系。
- **解决方案**：
  - [ ] 决定登录策略：纯游客 / 微信登录 + 游客降级 / 强制微信登录
  - [ ] 如接微信登录，实现 `wx.login()` 获取 code → 后端换取 openid/session_key
  - [ ] 如需头像/昵称，接入 `wx.getUserProfile` 或开放数据域
  - [ ] 与 `011/src/Localservices/gameserver.js` 的 `loadWechatUserData()` 真实逻辑对接
  - [ ] 处理登录失败后的游客降级逻辑（`init.js` 中已有兜底框架）

### 2.4 AppID 与项目配置确认

- **当前状态**：`project.config.json` 中 `appid: "wx98f65deaf874e522"`
- **待确认**：
  - [ ] 该 AppID 已注册为「小游戏」类型，而非公众号/小程序
  - [ ] 已在微信公众平台设置游戏类目
  - [ ] 已在「开发管理 → 开发设置」中配置服务器域名（如有网络请求）
  - [ ] 已添加开发者/体验者权限

---

## 三、🟡 功能项（影响用户体验与收入，建议在上架前完成）

### 3.1 微信分享功能

- **当前状态**：未接入 `wx.shareAppMessage` / `wx.showShareMenu`
- **待完成**：
  - [ ] 调用 `wx.showShareMenu({ withShareTicket: true })`
  - [ ] 配置 `wx.onShareAppMessage` 分享标题、图片、路径
  - [ ] 准备分享图（建议 `assets/image/share.png`，尺寸 500×400）
  - [ ] 如需带分数/关卡信息的分享，生成动态分享内容

### 3.2 生命周期处理（前后台切换）

- **当前状态**：未处理 `wx.onShow` / `wx.onHide`
- **待完成**：
  - [ ] `wx.onHide`：暂停 `createjs.Ticker`、暂停所有音频
  - [ ] `wx.onShow`：恢复 Ticker、恢复音频
  - [ ] 处理切后台导致的游戏状态异常（如倒计时、动画）

### 3.3 音频打断恢复

- **当前状态**：未处理系统音频打断
- **待完成**：
  - [ ] `wx.onAudioInterruptionBegin`：暂停 BGM/音效
  - [ ] `wx.onAudioInterruptionEnd`：恢复音频播放

### 3.4 好友排行榜/开放数据域

- **当前状态**：`011/src/modules/leaderboard.js` 存在，但微信版未接入开放数据域
- **待完成**：
  - [ ] 确认是否要在微信版上线好友排行榜
  - [ ] 创建 `openDataContext/` 目录及入口 `index.js`
  - [ ] 主域调用 `wx.getOpenDataContext()` 并 `postMessage`
  - [ ] 开放数据域绘制排行榜并共享到主屏

### 3.5 自定义加载页

- **当前状态**：使用 `wx.showLoading` 系统加载
- **待完成**：
  - [ ] 设计并接入游戏内 Canvas 加载界面
  - [ ] 显示资源加载进度百分比
  - [ ] 避免白屏时间过长

### 3.6 屏幕适配

- **当前状态**：基础适配已完成，但未针对异形屏优化
- **待完成**：
  - [ ] 通过 `wx.getSystemInfoSync().safeArea` 获取安全区域
  - [ ] 顶部 UI 避开刘海/状态栏
  - [ ] 底部 UI 避开 iPhone 底部横条（Home Indicator）
  - [ ] 横竖屏旋转锁定为竖屏（`game.json` 已配置）

### 3.7 屏幕常亮

- **当前状态**：未设置
- **待完成**：
  - [ ] 游戏运行时调用 `wx.setKeepScreenOn({ keepScreenOn: true })`

---

## 四、🟢 合规与上架材料（非代码，但必须准备）

### 4.1 隐私政策与用户协议

- **当前状态**：`011res/privacy.html` 为 H5 版，需适配微信小游戏
- **待完成**：
  - [ ] 编写微信小游戏专用隐私政策页面（可放服务端或项目内）
  - [ ] 如收集 openid、昵称、头像，首次启动需弹出隐私授权弹窗
  - [ ] 在微信公众平台「用户隐私保护指引」中声明收集的信息类型
  - [ ] 提供用户协议页面链接

### 4.2 ICP 备案

- **适用情况**：如果游戏有用户系统、排行榜、网络请求到自己的服务器
- **待完成**：
  - [ ] 确认是否需要域名 ICP 备案
  - [ ] 在微信公众平台「服务器域名」中配置已备案域名
  - [ ] 所有网络请求使用 HTTPS

### 4.3 版号（ISBN）

- **当前状态**：未明确是否需要
- **待完成**：
  - [ ] 根据游戏类目确认是否需要版号
  - [ ] 如属于网络游戏类，需申请版号并在上架时提交
  - [ ] 休闲单机小游戏多数地区暂不需要，但需以平台最新政策为准

### 4.4 适龄提示与内容自审

- **待完成**：
  - [ ] 确定适龄提示（如 8+、12+）
  - [ ] 准备游戏内容自审报告
  - [ ] 确保无赌博、诱导付费、过度广告、违规内容

### 4.5 上架素材

- **待准备**：
  - [ ] 游戏图标：16:9、1:1、3:4 等多种尺寸
  - [ ] 宣传图/截图：5 张以内，展示核心玩法
  - [ ] 分享图：`assets/image/share.png`
  - [ ] 游戏简介、关键词、类目、版本号
  - [ ] 软著证书扫描件/电子版

---

## 五、🔵 优化项（可后续迭代，但建议上架前评估）

| 序号 | 优化项 | 说明 |
|---|---|---|
| 1 | 分包加载 | 将 `resan/vendor-animate-wx.js` 或 `assets/sound` 拆到子包，降低首包体积 |
| 2 | SourceMap 不上传 | `project.config.json` 中 `uploadWithSourceMap: true`，正式发布可关闭 |
| 3 | 音效资源压缩 | `bgm.mp3` 448KB，可考虑降低码率；部分短音效可合并为精灵图/音频图集 |
| 4 | 图片资源压缩 | `logo1.png` 76KB、`flygame_atlas_*.png` 较大，可用 TinyPNG 等工具压缩 |
| 5 | 内存优化 | 真机测试内存占用，避免低端机闪退 |
| 6 | 帧率稳定 | 微信开发者工具性能面板检查 DrawCall、帧率 |
| 7 | 启动耗时 | 记录 `game.js` 到首屏可交互的时间，优化大于 5 秒的情况 |

---

## 六、建议实施顺序

### 第一阶段：硬门槛（必须全部完成才能上传）

1. 删除 `resan/vendor-animate.js`，统一 `bundle.js` 引用路径
2. 确认 `project.config.json` 的 AppID 可用
3. 配置广告单元 ID（或确认不上广告）
4. 确认登录策略并接入（或保留游客模式并在隐私指引中说明）

### 第二阶段：核心体验（建议上架前完成）

5. 接入 `wx.onShow` / `wx.onHide` 生命周期
6. 接入 `wx.onAudioInterruptionBegin/End`
7. 接入 `wx.showShareMenu` / `wx.onShareAppMessage`
8. 处理刘海屏/安全区域适配
9. 设置屏幕常亮

### 第三阶段：合规材料（可与开发并行）

10. 准备微信小游戏版隐私政策
11. 在微信公众平台填写用户隐私保护指引
12. 确认 ICP 备案需求
13. 确认版号需求
14. 准备适龄提示与内容自审
15. 准备图标、截图、分享图等上架素材

### 第四阶段：测试与提审

16. iOS 真机测试（重点：点击、音频、广告、分享）
17. Android 真机测试
18. 微信开发者工具「代码包大小」检查
19. 微信开发者工具「性能面板」检查
20. 提交审核

---

## 七、备注

- 本清单基于 `011-wxgame` 当前代码状态整理，后续每完成一项可在此文件对应复选框 `[ ]` 中打勾 `[x]`。
- 如遇微信政策变动，以微信公众平台最新要求为准。
- 文档最后更新：2026-06-17
