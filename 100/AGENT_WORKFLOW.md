# 人生选择器 TypeScript Demo 自动生成工作流

> 本工作流由 Kimi Code 自动执行，无需用户介入。
> 
> 目标：生成一个完整的 TypeScript Demo，涵盖数据定义、核心逻辑、UI 渲染、事件交互、游戏循环与结算。

---

## 工作流总览

```
Phase 1: 项目脚手架 + 数据层
    ↓
Phase 2: 核心游戏逻辑
    ↓
Phase 3: UI 渲染与事件交互
    ↓
Phase 4: 游戏循环 + 结算 + 入口整合
    ↓
Phase 5: 编译构建 + 运行验证
```

---

## Phase 1: 项目脚手架 + 数据层

**负责 Agent**: `life-grid-data-agent`

**输入**: 项目根目录下的 `行为数据库.md`、`末世行为库.md`、`人生选择器_设计总结.md`

**输出文件**:
- `life-grid-demo/package.json`
- `life-grid-demo/tsconfig.json`
- `life-grid-demo/src/types.ts`（所有核心类型定义）
- `life-grid-demo/src/data/modern-behaviors.ts`（现代社会行为库）
- `life-grid-demo/src/data/apocalypse-behaviors.ts`（末世行为库）
- `life-grid-demo/src/data/age-config.ts`（年龄段配置）
- `life-grid-demo/src/data/death-table.ts`（基础死亡概率表）
- `life-grid-demo/src/data/events.ts`（示例事件库）

**验收标准**:
- 项目可通过 `npm install` 安装依赖
- TypeScript 类型定义完整
- 两个行为库各至少转换 50 个核心行为（带完整字段）

---

## Phase 2: 核心游戏逻辑

**负责 Agent**: `life-grid-logic-agent`

**输入**: Phase 1 生成的所有类型和数据文件

**输出文件**:
- `life-grid-demo/src/core/state.ts`（初始状态）
- `life-grid-demo/src/core/behavior-pool.ts`（行为池生成）
- `life-grid-demo/src/core/resolve.ts`（结果判定）
- `life-grid-demo/src/core/balance.ts`（生态平衡度）
- `life-grid-demo/src/core/chains.ts`（连锁系统）
- `life-grid-demo/src/core/death.ts`（死亡判定）
- `life-grid-demo/src/core/events.ts`（事件触发）
- `life-grid-demo/src/core/utils.ts`（通用工具函数）

**验收标准**:
- 每个核心函数可独立调用
- 提供单元测试式调用示例
- 行为池生成、结果判定、死亡判定逻辑符合设计总结文档

---

## Phase 3: UI 渲染与事件交互

**负责 Agent**: `life-grid-ui-agent`

**输入**: Phase 1 和 Phase 2 生成的文件

**输出文件**:
- `life-grid-demo/src/ui/grid.ts`（10×10 网格渲染）
- `life-grid-demo/src/ui/modal.ts`（行为详情弹窗）
- `life-grid-demo/src/ui/render.ts`（整体界面渲染）
- `life-grid-demo/src/ui/input.ts`（玩家输入模拟）

**设计约束**:
- 采用终端/控制台 UI（ASCII 网格），便于在 Node.js 中运行
- 网格按风险等级 Y 轴排列
- 低龄时只显示底部几行
- 提供视觉化的属性面板

**验收标准**:
- 可在终端打印出 10×10 网格
- 能显示行为名称、风险等级、玩家属性

---

## Phase 4: 游戏循环、结算与入口整合

**负责 Agent**: `life-grid-integration-agent`

**输入**: Phase 1~3 生成的所有文件

**输出文件**:
- `life-grid-demo/src/game/loop.ts`（主游戏循环）
- `life-grid-demo/src/game/settlement.ts`（结算：能量曲线 + 人生评价）
- `life-grid-demo/src/index.ts`（Demo 入口）

**验收标准**:
- 能运行一局完整游戏
- 从 1 岁开始，每年推进，直到死亡或最大年龄
- 输出人生能量曲线和结局评价

---

## Phase 5: 编译构建 + 运行验证

**负责 Agent**: `life-grid-integration-agent`（继续）

**执行步骤**:
1. `cd life-grid-demo && npm install`
2. `npx tsc --noEmit` 检查类型
3. `npx ts-node src/index.ts` 或编译后 `node dist/index.js` 运行
4. 捕获输出，检查是否有错误
5. 如有错误，回退到对应 Phase 修复

**验收标准**:
- TypeScript 编译无错误
- Demo 能完整运行一次
- 生成可阅读的运行日志

---

## 工作流执行规则

1. **顺序执行**：每个 Phase 依赖前一个 Phase 的输出
2. **自动修复**：如果构建失败，自动回到对应 Phase 修复
3. **无需用户介入**：所有决策由 Agent 自主完成
4. **产物留存**：所有中间文件保留在项目目录中
