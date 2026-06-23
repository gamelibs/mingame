import { createGameController } from './game-controller';
import {
  renderGrid,
  bindGridClick,
  renderAttributes,
  renderLogs,
  scrollLogsToBottom,
} from './components';

/**
 * UI 集成验证：
 * 在浏览器环境下渲染人生棋盘、属性与日志，并绑定网格点击。
 */
export function runUIIntegrationCheck(): void {
  if (typeof document === 'undefined') {
    console.log('DOM 不可用，跳过 UI 集成验证');
    return;
  }

  const gridContainer = document.getElementById('grid');
  const attrContainer = document.getElementById('attributes-content');
  const logsContainer = document.getElementById('logs-content');

  if (!gridContainer || !attrContainer || !logsContainer) {
    console.warn('缺少必要的 DOM 容器');
    return;
  }

  const controller = createGameController({ mode: 'modern', maxAge: 100 });

  renderGrid(gridContainer, controller.getGrid());
  renderAttributes(attrContainer, controller.getState());
  renderLogs(logsContainer, controller.getLogs());
  scrollLogsToBottom(logsContainer);

  bindGridClick(gridContainer, (x, y, behavior) => {
    if (!behavior) return;
    console.log(`点击格子 ${x}, ${y}: ${behavior.name}`);
  });

  console.log('UI 集成验证完成');
}

// 若直接作为脚本运行（如浏览器环境），执行检查
if (typeof window !== 'undefined') {
  runUIIntegrationCheck();
}
