# 人生选择器（Life Grid）TypeScript Demo

一个完整的人生经营模拟游戏 Demo，基于 10×10 风险决策网格。

包含两个版本：
- **终端版**：`src/index.ts`，快速验证核心逻辑
- **Web 交互版**：`src/web/main.ts`，支持 10×10 页面点击交互、日志记录、能量曲线图表、人生数据保存/加载/回放

## 核心机制

- **10×10 网格**：每一年，当前年龄可选的行为按风险等级（n1~n10）分布在网格中
- **年龄展开**：低龄时只有底部低风险区有 3~5 个行为；成年后网格逐渐填满，高风险高收益选择出现
- **结果判定**：行为收益 × 风险等级 × 属性修正 × 随机事件
- **生态平衡**：隐藏的平衡度惩罚偏科行为，鼓励全面发展
- **连锁反馈**：连续成功会提升幸运、降低死亡概率；连续失败会限制选择、增加危机
- **死亡模型**：年龄基础死亡率 + 健康/平衡/连锁/风险修正

## 文件结构

```
src/
├── types.ts                    # 核心类型定义
├── index.ts                    # 终端 Demo 入口
├── core/                       # 核心逻辑（终端/Web 共享）
│   ├── state.ts
│   ├── behavior-pool.ts
│   ├── resolve.ts
│   ├── effects.ts
│   ├── balance.ts
│   ├── chains.ts
│   ├── death.ts
│   ├── events.ts
│   └── utils.ts
├── data/                       # 数据层（终端/Web 共享）
│   ├── modern-behaviors.ts
│   ├── apocalypse-behaviors.ts
│   ├── age-config.ts
│   ├── death-table.ts
│   └── events.ts
├── scripts/                    # 构建/生成脚本
│   └── generate-sample-life.ts # 生成 120 年示例人生数据
└── public/                     # Web 静态资源
    └── sample-life.json        # 示例人生数据（构建时复制到 dist-web）
├── ui/                         # 终端 UI
│   ├── grid.ts
│   ├── render.ts
│   ├── modal.ts
│   ├── input.ts
│   └── index.ts
├── game/                       # 终端游戏流程
│   ├── loop.ts
│   └── settlement.ts
└── web/                        # Web 交互版
    ├── main.ts                 # 浏览器入口
    ├── game-controller.ts      # 游戏控制器
    ├── style.css               # 页面样式
    ├── components/
    │   ├── grid.ts             # 10×10 可点击网格
    │   ├── attributes.ts       # 属性面板
    │   ├── logs.ts             # 日志面板
    │   ├── modal.ts            # 行为确认弹窗
    │   ├── chart.ts            # 能量曲线 Canvas 图表
    │   └── index.ts
    ├── test-controller.ts
    ├── test-ui-integration.ts
    ├── test-chart.ts
    └── test-e2e.spec.ts        # Playwright 端到端测试
```

## 测试与验收

项目测试机制与验收标准详见根目录 `测试与验收.md`。

```bash
# 一键运行全部测试
npm run test

# 单独测试
npm run test-data       # 数据完整性
npm run test-core       # 核心逻辑
npm run test-ui         # UI 渲染
npm run test-age        # 年龄合理性
npm run test-save-load  # 保存/加载/回放
```

## 运行方式

### 终端版

```bash
# 安装依赖
npm install

# TypeScript 类型检查
npx tsc --noEmit

# 编译
npm run build

# 运行完整 Demo（自动模拟 120 年）
npm start

# 运行短测试（20 年）
npx ts-node src/test-loop.ts
```

### Web 交互版

```bash
# 开发服务器
npm run dev

# 打开浏览器访问 http://localhost:5173

# 生产构建
npm run build:web

# 预览生产构建
npm run preview
```

### AI 叙事支持（可选）

项目已接入 Kimi（Moonshot）API，用于在选择人生目标后生成开局寄语，并在每次手动选择后对玩家行为进行 AI 点评。

```bash
# 复制示例环境变量文件并填写你的 Kimi API Key
cp .env.example .env
# 编辑 .env，将 KIMI_API_KEY 替换为你的真实 Key

# 开发服务器会自动读取 .env 中的配置
KIMI_API_KEY=your_key npm run dev
```

未配置 Key 时，AI 相关弹窗会提示加载失败，游戏本身仍可正常运行。

### 端到端测试

```bash
# 先启动预览服务器（或开发服务器）
npm run preview

# 运行 Playwright 测试
npx playwright test src/web/test-e2e.spec.ts
```

## Web 版功能

- **10×10 可点击网格**：按风险等级着色，hover 显示详情，点击弹出确认
- **属性面板**：实时显示年龄、财富、健康、知识、技能、社交、幸福、影响力、幸运、生态平衡度、成功/失败链
- **日志面板**：逐年记录选择、结果、触发事件
- **能量曲线图表**：Canvas 实时绘制人生能量变化曲线
- **自动播放**：按选定速度自动推进人生
- **重置**：重新开始一局
- **保存人生**：将当前人生导出为 JSON 文件
- **加载人生**：导入 JSON 人生数据并进入回放模式
- **回放人生**：按年逐步回放已保存的人生，回放结束后状态与原人生一致

## 运行模式

修改 `src/web/main.ts` 中的配置：

```ts
const controller = createGameController({ mode: 'modern', maxAge: 100 });
// mode: 'modern' 现代社会 或 'apocalypse' 末世生存
```

## 说明

本 Demo 重点展示完整游戏逻辑结构：数据层 → 核心规则 → UI 渲染 → 主循环 → 结算。Web 版 additionally 展示了页面交互、日志系统和数据可视化。游戏数值平衡可在此基础上继续调优。
