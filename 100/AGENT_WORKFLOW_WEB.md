# 人生选择器 Web 版 Agent 工作流

> 基于现有 `life-grid-demo` 终端 Demo，升级为浏览器交互版 Demo。
> 
> 新增能力：10×10 页面交互、日志记录、每局能量数据图表。

---

## 工作流总览

```
Phase 1: Web 项目脚手架
    ↓
Phase 2: 核心逻辑浏览器适配
    ↓
Phase 3: 10×10 网格 + 属性面板 + 日志面板
    ↓
Phase 4: 能量曲线 Canvas 图表
    ↓
Phase 5: 主循环整合（手动点击 / 自动播放 / 重置）
    ↓
Phase 6: 构建 + 浏览器验证
```

---

## Phase 1: Web 项目脚手架

**负责 Agent**: `life-grid-web-scaffold-agent`

**输入**: 现有 `life-grid-demo/` 项目

**输出**:
- 安装 Vite 依赖
- `index.html` 主页面
- `vite.config.ts` 配置
- 更新 `package.json` scripts: `dev`, `build:web`, `preview`
- `src/web/main.ts` 浏览器入口
- `src/web/style.css` 基础样式

**页面布局**:
```
┌─────────────────────────────────────────────────────────────┐
│  人生选择器 Web Demo                          [自动播放] [重置] │
├───────────────────────────────┬─────────────────────────────┤
│                               │                             │
│      10×10 风险网格            │      属性面板               │
│      （可点击）                │      年龄/财富/健康等        │
│                               │                             │
├───────────────────────────────┤      日志面板               │
│      能量曲线图表              │      （逐年记录）            │
│      （Canvas）                │                             │
├───────────────────────────────┴─────────────────────────────┤
│      行为详情 / 操作提示                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 2: 核心逻辑浏览器适配

**负责 Agent**: `life-grid-web-logic-agent`

**输出**:
- `src/web/game-controller.ts`
  - 封装现有 core 模块
  - 暴露 `getState()`、`getGrid()`、`selectBehavior(x, y, weight)`、`stepAuto()`、`reset()`、`playOneYear()`
  - 维护当前游戏状态、历史日志、能量曲线数据

要求：
- 不破坏终端 Demo 的 `src/index.ts`
- 复用 `src/core/` 和 `src/data/` 已有逻辑
- 移除 Node.js 特有 API（如 process），确保能在浏览器运行

---

## Phase 3: 10×10 网格 + 属性面板 + 日志面板

**负责 Agent**: `life-grid-web-ui-agent`

**输出**:
- `src/web/components/grid.ts` — 渲染 10×10 网格，绑定点击事件
- `src/web/components/attributes.ts` — 渲染属性面板
- `src/web/components/logs.ts` — 渲染日志面板，支持滚动
- `src/web/components/modal.ts` — 行为详情弹窗/提示

**网格交互要求**:
- 每个格子显示行为名称（最多 4 字）
- 空格子显示为灰色禁用
-  hover 显示完整行为名称 + 风险等级
- 点击后弹出确认，显示行为描述、预计收益、倒计时模拟
- 确认后执行该行为，进入下一年
- 网格按风险等级着色：n1~n3 绿色，n4~n6 黄色，n7~n8 橙色，n9~n10 红色

**日志面板要求**:
- 每回合追加一行：年龄、选择行为、结果、触发事件
- 保留完整历史，可滚动查看
- 大成功/大失败高亮显示

---

## Phase 4: 能量曲线 Canvas 图表

**负责 Agent**: `life-grid-web-chart-agent`

**输出**:
- `src/web/components/chart.ts`

**功能**:
- 使用 HTML5 Canvas 绘制人生能量曲线
- X 轴：年龄
- Y 轴：能量值
- 曲线颜色随能量值变化（高绿 / 中黄 / 低红）
- 实时更新：每过一年重新绘制
- 显示当前年龄位置

---

## Phase 5: 主循环整合

**负责 Agent**: `life-grid-web-integration-agent`

**输出**:
- 更新 `src/web/main.ts`

**功能**:
- 手动模式：玩家点击网格 → 确认 → 执行 → 更新 UI
- 自动模式：点击「自动播放」按钮，每年自动选择并执行，有延迟动画
- 重置：清空状态，重新开始
- 速度控制：自动播放速度可选（慢/中/快）

---

## Phase 6: 构建 + 浏览器验证

**负责 Agent**: `life-grid-web-integration-agent`（继续）

**执行步骤**:
1. `npm install` 安装 Vite
2. `npm run build:web` 构建
3. `npm run preview` 启动预览服务器
4. 使用 `curl` 或浏览器截图工具验证页面可访问
5. 检查控制台无报错

**验收标准**:
- 页面能正常加载
- 10×10 网格可点击
- 点击后更新状态、日志、图表
- 自动播放可运行
- 重置可用

---

## 与终端版的关系

- 终端版 `src/index.ts` 保留，用于快速验证核心逻辑
- Web 版 `src/web/main.ts` 为新增入口
- 核心逻辑 `src/core/` 和 `src/data/` 被两者共享
