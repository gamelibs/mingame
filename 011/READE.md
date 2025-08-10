# 简单的测试服务
python3 -m http.server 8888

1. 1080x1920 竖屏设计：
{
    "scene": {
        "width": 1080,
        "height": 1920,
        "orientation": "portrait"
    }
}
. 768x1024 竖屏设计：
{
    "scene": {
        "width": 768,
        "height": 1024,
        "orientation": "portrait"
    }
}

 960x540 横屏设计：
{
    "scene": {
        "width": 768,
        "height": 1024,
        "orientation": "portrait"
    }
}

# 打包与部署说明

## 一、依赖安装

首次使用请先安装依赖：

```sh
npm install
```

## 二、开发模式（本地调试）

使用 webpack-dev-server 启动热更新开发环境：

```sh
npm run dev
```

- 默认会自动打开浏览器，端口一般为 8080。
- 代码变更会自动热更新，无需手动刷新。
- 资源路径与生产环境一致，便于联调。

## 三、生产环境打包

执行以下命令进行生产环境打包，产物输出到 `dist/` 目录：

```sh
npm run build
```

- 业务代码会自动压缩、去除日志、混淆（仅 bundle.js）。
- Adobe Animate 导出与 CreateJS 等外部库会合并为 `dist/resan/vendor-animate.js`，仅做安全压缩不混淆。
- 所有 Animate 导出的图片资源会统一复制到 `dist/resan/images/`。

## 四、产物结构

```
dist/
  ├── index.html
  ├── bundle.js           # 业务逻辑主包
  ├── resan/
  │     ├── vendor-animate.js   # 合并后的 CreateJS+Animate 脚本
  │     └── images/             # Animate 导出图片资源
  ├── assets/             # 其他音效、图片等静态资源
  ├── style.css
  └── manifest.json
```

## 五、本地预览/部署

建议在 dist 目录下启动静态服务器：

```sh
cd dist
npx http-server -p 8888
# 或
npx serve -s .
```

然后访问 http://localhost:8888/

> 注意：index.html 内的脚本和资源路径均为相对路径，确保 dist 为服务器根目录。

## 六、常见问题

- **404 找不到 vendor-animate.js 或图片**
  - 请确认服务器根目录为 dist，且访问路径为 http://localhost:端口/。
  - 不要在项目根目录直接启动服务器，否则路径会错位。
- **路径问题**
  - 如需部署到子目录，请将 index.html 及 manifest.json 内所有资源路径改为相对路径（如 `./resan/vendor-animate.js`）。
- **新增 Animate 导出**
  - 新增的 js 或图片只需放到指定目录，重跑 `npm run build` 即可自动合并和复制。

## 七、其他

如需自定义构建、拆分 vendor、按需加载等高级优化，请参考 webpack.config.js 或联系维护者。