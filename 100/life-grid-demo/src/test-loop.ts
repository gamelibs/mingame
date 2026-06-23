import { runGame, GameConfig } from './game/loop';
import { renderSettlement } from './game/settlement';

const config: GameConfig = {
  mode: 'modern',
  maxAge: 20,
  autoPlay: true,
  logEachTurn: true
};

console.log('🧪 人生选择器短游戏测试\n');

const finalState = runGame(config);

console.log('\n═══════════════════════════════════════');
console.log(renderSettlement(finalState));
console.log('═══════════════════════════════════════');
