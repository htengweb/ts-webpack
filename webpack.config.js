const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // html文件生成器
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // 自动清除打包文件
const ExtractTextPlugin = require("extract-text-webpack-plugin"); // 打包分离css文件
// 获取系统网络接口
const interfaces = require('os').networkInterfaces()
let IPAdress = '';
for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
        var alias = iface[i];
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
            IPAdress = alias.address;
        }
    }
}
// 获取当前IP地址
console.log("IPAdress", IPAdress)
module.exports = {
    mode: 'production',
    entry: {
        main: './src/main.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].[chunkhash:8].js'
    },
    devServer: {
        contentBase: path.join(__dirname, './public'), // 开启开发服务后访问的地址
        port: 8000,
        hot: true, // 热模块替换
        open: true,// 启动自动打开页面
        compress: true, // 启动gzip压缩
    },
    module: {
        rules: [
            // {
            //     test: /\.scss$/,
            //     use: ExtractTextPlugin.extract({
            //         fallback: 'style-loader',
            //         use: ['css-loader', 'sass-loader']
            //     })
            // },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/i,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192
                    }
                }]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'webpack typescript',
            template: './public/index.html', // 指定html的模板文件
            filename: 'index.html', // 生成后的文件名
            minify: {
                collapseWhitespace: true, // 去掉空行
                removeComments: true, // 去掉注释
            }
        }),
        // new webpack.ProgressPlugin(),
        // new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: true
        }),
        // new ExtractTextPlugin(),
    ]
}