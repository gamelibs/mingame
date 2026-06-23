import * as fs from 'fs';
import * as path from 'path';

const dirs = [
  path.resolve(__dirname, '../cases'),
  path.resolve(__dirname, '../public/cases'),
  path.resolve(__dirname, '../dist-web/cases'),
];

function main(): void {
  for (const dir of dirs) {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
      console.log(`🗑️ 已删除 ${dir}`);
    }
  }
  console.log('\n✅ 自动人生案例已清空。如需重新生成，请运行 npx ts-node scripts/generate-auto-cases.ts');
}

main();
