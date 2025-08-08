const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackObfuscator = require('webpack-obfuscator');
const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');

module.exports = (env, argv) => {
    const isProd = argv && argv.mode === 'production';

    return {
        mode: isProd ? 'production' : 'development',
        entry: [
            './src/utile.js',
            './src/Localservices/ovoastar4.js',
            './src/Localservices/gameserver.js',
            './src/modules/cardgame.js',
            './src/modules/guideline.js',
            './src/modules/leaderboard.js',
            './src/modules/selectline.js',
            './src/gamescense.js',
            './src/init.js',
        ],
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'dist'),
            clean: true,
            publicPath: '/',
        },
        devtool: isProd ? false : 'source-map',
        devServer: {
            static: './dist',
            open: true,
        },
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader'],
                },
            ],
        },
        optimization: isProd
            ? {
                  minimize: true,
                  minimizer: [
                      // 应用于业务 bundle 的压缩（移除 console/debugger 等）
                      new TerserPlugin({
                          extractComments: false,
                          exclude: [/resan\/vendor-animate\.js$/],
                          terserOptions: {
                              compress: {
                                  drop_console: true,
                                  drop_debugger: true,
                                  pure_funcs: [
                                      'console.log',
                                      'console.info',
                                      'console.debug',
                                      'console.warn',
                                      'console.error'
                                  ],
                              },
                              format: { comments: false },
                          },
                      }),
                      // 仅对 vendor-animate.js 进行“安全压缩”（不混淆标识符）
                      new TerserPlugin({
                          extractComments: false,
                          include: [/resan\/vendor-animate\.js$/],
                          terserOptions: {
                              mangle: false,
                              keep_fnames: true,
                              keep_classnames: true,
                              compress: {
                                  drop_debugger: true,
                                  // 谨慎压缩，避免激进优化
                                  // 不做函数提升/内联，降低风险
                                  hoist_funs: false,
                                  hoist_vars: false,
                                  reduce_funcs: false,
                                  // 如果这些库包含日志，可选择去掉
                                  pure_funcs: ['console.log','console.info','console.debug','console.warn','console.error']
                              },
                              format: { comments: false },
                          },
                      }),
                  ],
              }
            : {},
        plugins: [
            new HtmlWebpackPlugin({
                template: './index.html',
                inject: 'body',
            }),
            // 合并外部全局脚本为单文件 resan/vendor-animate.js
            new MergeIntoSingleFilePlugin({
                files: {
                    'resan/vendor-animate.js': [
                        path.resolve(__dirname, 'libs/createjs.js'),
                        path.resolve(__dirname, 'loading.js'),
                        path.resolve(__dirname, 'flygame.js'),
                        path.resolve(__dirname, 'minfly.js'),
                    ],
                },
                transform: {
                    'resan/vendor-animate.js': code => code,
                },
            }),
            new CopyWebpackPlugin({
                patterns: [
                    { from: 'assets', to: 'assets' },
                    { from: 'images', to: 'resan/images' }, // 将 Animate images 移动到 resan/images
                    { from: 'style.css', to: '' },
                    { from: 'manifest.json', to: '' },
                    // 不再逐一复制外部脚本，已合并为 resan/vendor-animate.js
                ],
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
            }),
            // 对 vendor-animate.js 做混淆（仅生产）
            ...(isProd
                ? [
                      new WebpackObfuscator(
                          {
                              compact: true,
                              simplify: true,
                              rotateStringArray: false,
                              stringArray: false,
                              deadCodeInjection: false,
                          },
                          ['vendor-animate.js'] // 排除合并的外部库脚本
                      ),
                  ]
                : []),
        ],
        performance: { hints: isProd ? 'warning' : false },
    };
};