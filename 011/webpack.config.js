const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
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
        publicPath: '/'
    },
    devServer: {
        static: './dist',
        open: true
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            inject: 'body'
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'assets', to: 'assets' },
                { from: 'images', to: 'images' },
                { from: 'style.css', to: '' }, // 复制独立 CSS
                { from: 'manifest.json', to: '' },
                { from: 'libs/createjs.js', to: 'libs' },
                { from: 'loading.js', to: '' },
                { from: 'flygame.js', to: '' },
                { from: 'minfly.js', to: '' }
            ]
        })
    ]
};