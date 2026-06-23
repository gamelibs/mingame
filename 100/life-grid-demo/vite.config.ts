import { defineConfig } from 'vite';
import * as fs from 'fs';
import * as path from 'path';
import { chat } from './server/ai-client';
import { AI_CONFIG } from './server/ai-config';

const CASES_DIRS = [
  path.resolve(__dirname, 'cases'),
  path.resolve(__dirname, 'public/cases'),
  path.resolve(__dirname, 'dist-web/cases'),
];

function parseJsonBody(req: any): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function aiApiPlugin() {
  return {
    name: 'ai-api',
    configureServer(server: any) {
      server.middlewares.use('/api/ai/chat', async (req: any, res: any, next: any) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ success: false, message: 'Method Not Allowed' }));
          return;
        }
        try {
          if (!AI_CONFIG.enabled) {
            res.statusCode = 503;
            res.end(JSON.stringify({ success: false, message: 'AI 功能未启用，请配置 KIMI_API_KEY' }));
            return;
          }
          const body = await parseJsonBody(req);
          const { messages, options } = body;
          if (!messages || !Array.isArray(messages)) {
            res.statusCode = 400;
            res.end(JSON.stringify({ success: false, message: '缺少 messages 参数' }));
            return;
          }
          const result = await chat(messages, options || {});
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, data: result }));
        } catch (err: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ success: false, message: err.message }));
        }
      });
    },
  };
}

function clearCasesPlugin() {
  return {
    name: 'clear-cases',
    configureServer(server: any) {
      server.middlewares.use('/api/clear-cases', (req: any, res: any, next: any) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ success: false, message: 'Method Not Allowed' }));
          return;
        }
        try {
          for (const dir of CASES_DIRS) {
            if (fs.existsSync(dir)) {
              fs.rmSync(dir, { recursive: true, force: true });
            }
          }
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true }));
        } catch (err: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ success: false, message: err.message }));
        }
      });
    },
    configurePreviewServer(server: any) {
      server.middlewares.use('/api/clear-cases', (req: any, res: any, next: any) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ success: false, message: 'Method Not Allowed' }));
          return;
        }
        try {
          for (const dir of CASES_DIRS) {
            if (fs.existsSync(dir)) {
              fs.rmSync(dir, { recursive: true, force: true });
            }
          }
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true }));
        } catch (err: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ success: false, message: err.message }));
        }
      });
    },
  };
}

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist-web',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
  plugins: [aiApiPlugin(), clearCasesPlugin()],
});
