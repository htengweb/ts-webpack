const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // 自动清除打包文件
const CopyWebpackPlugin = require('copy-webpack-plugin');// 代码拷贝，开发中的静态文件直接拷贝到打包后文件中
const merge = require('webpack-merge');
const config = require('./webpack.base');

module.exports = merge(config, {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: './', // 静态资源加地址前缀
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            },
        }),
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: true
        }),
        // webpack 内置版权声明插件
        new webpack.BannerPlugin('版权声明'),
        // 拷贝代码
        new CopyWebpackPlugin([
            {
                from: './public/',
                to: './'
            }
        ]),
    ],
    // 不需要打包的外部模块
    externals: {
        // jquery: '$'
        // React: 'react'
    },
    // 源码映射文件，方便调试
    // 1 source-map 会单独生成一个map文件。
    // 2 eval-source-map 不会单独生成文件，但可以访问行和列。
    // 3 cheap-module-source-map 生成单独文件，但不会产生列。
    // 4 cheap-module-eval-source-map 不生成文件，集成到打包文件中，不产生列。
    // devtool: 'source-map', 
    // 监控打包
    // watch: true,
    // watchOptions: {
    //     poll: 1000,//每秒监控一次
    //     aggregateTimeout: 500,// 防抖，
    //     ignored: /node_modules/,// 不需要监控的文件
    // },
    // 优化项
    optimization: {
        // 分割代码块
        splitChunks: {
            cacheGroups: { // 缓存租
                common: { // 公共的模块
                    chunks: 'initial', // 从什么地方开始,刚开始
                    minSize: 0, // 大于多少抽离
                    minChunks: 1, // 使用多少次以上抽离抽离
                    name: 'common', // 提取后的文件名称，在HtmlWebpackPlugin 的 chunks中引用
                },
                vendor: { // 抽离第三方库
                    priority: 1, // 优先抽离第三方库
                    test: /node_modules/,// 从node_modules中抽
                    chunks: 'initial',
                    minSize: 0,
                    minChunks: 1,// 最小引用次数时抽离
                    name: 'vendor'
                }
            }
        }
    }
})