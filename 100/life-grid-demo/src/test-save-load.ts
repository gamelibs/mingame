import { createGameController } from './web/game-controller';
import { modernBehaviors } from './data/modern-behaviors';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`[保存/加载测试失败] ${message}`);
  }
}

function main(): void {
  console.log('=== 保存 / 加载 / 回放测试开始 ===\n');

  // 1. 创建一个控制器并自动运行若干年
  const controller = createGameController({ mode: 'modern', maxAge: 120 });
  const yearsToRun = 20;
  for (let i = 0; i < yearsToRun; i++) {
    const log = controller.stepAuto();
    assert(log !== null, `第 ${i + 1} 年自动执行应返回日志`);
  }

  const stateBeforeSave = controller.getState();
  const historyLength = stateBeforeSave.history.length;
  assert(historyLength === yearsToRun, `运行 ${yearsToRun} 年后历史记录应为 ${yearsToRun}，实际为 ${historyLength}`);
  console.log(`✓ 自动运行 ${yearsToRun} 年，历史记录 ${historyLength} 条`);

  // 2. 导出人生数据
  const json = controller.exportLifeData();
  assert(json.length > 0, '导出的人生数据 JSON 不应为空');
  console.log(`✓ 导出人生数据成功，JSON 长度 ${json.length}`);

  // 3. 验证 JSON 可解析且结构正确
  const data = controller.importLifeData(json);
  assert(data !== null, '应能正确解析导出的人生数据');
  assert(data!.version === 1, '人生数据版本应为 1');
  assert(data!.config.mode === 'modern', '人生数据模式应为 modern');
  assert(data!.records.length === yearsToRun, '人生数据记录数应等于运行年数');
  assert(data!.snapshots.length === yearsToRun + 1, '人生数据快照数应等于记录数 + 1');
  console.log('✓ 人生数据结构正确');

  // 4. 使用新控制器加载并回放
  const replayController = createGameController({ mode: 'modern', maxAge: 120 });
  const started = replayController.startReplay(data!);
  assert(started, '启动回放应成功');
  assert(replayController.isReplaying(), '启动回放后应处于回放模式');
  console.log('✓ 回放启动成功');

  // 5. 逐条回放并验证状态一致
  let stepCount = 0;
  while (replayController.isReplaying()) {
    const hasNext = replayController.replayStep();
    stepCount++;
    assert(stepCount <= yearsToRun + 1, '回放步数不应超过原记录数');
    if (!hasNext) break;
  }

  assert(stepCount === yearsToRun, `回放步数应为 ${yearsToRun}，实际为 ${stepCount}`);
  console.log(`✓ 回放完成，共 ${stepCount} 步`);

  const replayState = replayController.getState();
  assert(replayState.age === stateBeforeSave.age, `回放最终年龄应一致：${stateBeforeSave.age} vs ${replayState.age}`);
  assert(replayState.health === stateBeforeSave.health, `回放最终健康应一致：${stateBeforeSave.health} vs ${replayState.health}`);
  assert(replayState.wealth === stateBeforeSave.wealth, `回放最终财富应一致：${stateBeforeSave.wealth} vs ${replayState.wealth}`);
  assert(replayState.knowledge === stateBeforeSave.knowledge, `回放最终知识应一致`);
  assert(replayState.skill === stateBeforeSave.skill, `回放最终技能应一致`);
  assert(replayState.social === stateBeforeSave.social, `回放最终人脉应一致`);
  assert(replayState.happy === stateBeforeSave.happy, `回放最终幸福应一致`);
  assert(replayState.charm === stateBeforeSave.charm, `回放最终魅力应一致`);
  assert(replayState.luck === stateBeforeSave.luck, `回放最终运势应一致`);
  assert(replayState.lifeBalance === stateBeforeSave.lifeBalance, `回放最终平衡度应一致`);
  assert(replayState.history.length === yearsToRun, '回放后历史记录数应等于运行年数');
  console.log('✓ 回放后所有状态属性与原人生完全一致');

  // 6. 验证导入非法 JSON 返回 null
  assert(controller.importLifeData('not-json') === null, '非法 JSON 应返回 null');
  assert(controller.importLifeData('{"version": 999}') === null, '版本不匹配应返回 null');
  console.log('✓ 非法人生数据正确拒绝');

  // 7. 验证每个记录的行为 ID 在行为库中存在
  for (const record of data!.records) {
    const behavior = modernBehaviors.find((b) => b.id === record.behaviorId);
    assert(behavior !== undefined, `记录中的行为 ID ${record.behaviorId} 应在行为库中存在`);
  }
  console.log('✓ 所有记录的行为 ID 均合法');

  console.log('\n=== 保存 / 加载 / 回放测试通过 ===');
}

main();
