import * as fs from 'fs';
import * as path from 'path';
import { createGameController } from '../src/web/game-controller';

const CASES_DIR = path.resolve(__dirname, '../cases');
const COUNT = 10;

interface CaseMeta {
  file: string;
  name: string;
  age: number;
  reason: string;
  summary: string;
}

function generateSummary(finalState: ReturnType<ReturnType<typeof createGameController>['getState']>): string {
  const s = finalState;
  return `财富${Math.round(s.wealth)} 健康${Math.round(s.health)} 知识${Math.round(s.knowledge)} 技能${Math.round(s.skill)} 人脉${Math.round(s.social)} 幸福${Math.round(s.happy)}`;
}

function main(): void {
  if (!fs.existsSync(CASES_DIR)) {
    fs.mkdirSync(CASES_DIR, { recursive: true });
  }

  const manifest: CaseMeta[] = [];

  for (let i = 1; i <= COUNT; i++) {
    // 使用与 Web 版「自动人生」按钮完全相同的默认配置
    const controller = createGameController();
    while (!controller.isGameOver()) {
      controller.stepAuto();
    }

    const state = controller.getState();
    const reason = controller.getGameOverReason() || '未知';
    const summary = generateSummary(state);
    const fileName = `auto-case-${String(i).padStart(2, '0')}.json`;
    const filePath = path.join(CASES_DIR, fileName);
    const json = controller.exportLifeData();

    fs.writeFileSync(filePath, json, 'utf-8');

    manifest.push({
      file: fileName,
      name: `自动人生 #${i}`,
      age: state.age,
      reason,
      summary,
    });

    console.log(`✅ 已生成 ${fileName}：${state.age} 岁，${reason}，${summary}`);
  }

  fs.writeFileSync(path.join(CASES_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`\n🎉 共生成 ${COUNT} 个自动人生案例，保存在 ${CASES_DIR}`);
}

main();
