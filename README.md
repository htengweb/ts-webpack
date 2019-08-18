
```javascript
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // html文件生成器
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // 自动清除打包文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');// 抽离css样式
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');// 优化打包后的css文件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');// 优化打包后的js文件
const CopyWebpackPlugin = require('copy-webpack-plugin');// 代码拷贝，开发中的静态文件直接拷贝到打包后文件中
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
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].[chunkhash:8].js',
        publicPath: './', // 静态资源加地址前缀
    },
    devServer: {
        contentBase: path.resolve(__dirname, './public'), // 开启开发服务后访问的地址
        port: 8000,
        hot: true, // 热模块替换
        open: true,// 启动自动打开页面
        compress: true, // 启动gzip压缩
        proxy: { // 配置跨域代理请求
            '/api': {
                target: 'http://localhost:3000',
                pathRewrite:{ // 重写地址
                    '/api': ''
                }
            }
        }
    },
    module: {
        // 忽略解析依赖
        noParse:/(vue|react)/,
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                        }
                    }
                ],
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            insertAt: 'top',// 打包后的css文件提取到顶部
                            publicPath: './'
                        }
                    },
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            insertAt: 'top',
                            publicPath: './'
                        }
                    },
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            outputPath: 'img',
                            publicPath: '../img', // 打包后图片引用相对地址 
                            // name: '[name].[ext]',// 配置打包后图片的名称
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'webpack typescript',
            template: './public/index.html', // 指定html的模板文件
            filename: 'index.html', // 生成后的文件名
            chunks: ['main','vendor','common'], // 只引用对应的代码模块
            minify: {
                // removeAttributeQuotes: true,// 删除引号
                // collapseWhitespace: true, // 去掉空行
                // removeComments: true, // 去掉注释
            }
        }),
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
        // 提取css文件
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        }),
        // new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),
        // new webpack.ProgressPlugin(),
        // new webpack.HotModuleReplacementPlugin(),
        // 变量注入到全局
        // new webpack.ProvidePlugin({ 
        //     $: 'jquery'
        // })
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
    // 解析 第三方包 common
    resolve: {
        // 查找的模块
        modules: [
            path.resolve('node_modules')
        ],
        // 别名
        alias: {
            '@': path.resolve(__dirname,'src'),// 注意，css中引用需加~，如：'~@/**/*.png'
        },
        // 引入文件时省略后缀名，从左（优先）往右依次查找
        extensions: ['.js', '.css', '.json']
    },
    // 优化项
    optimization: {
        minimizer: [
            // 压缩css文件
            new OptimizeCSSAssetsPlugin({}),
            // 压缩js文件
            // new UglifyJsPlugin({
            //     cache: true, // 是否缓存
            //     parallel: true,   // 是否并发
            //     sourceMap: true // 源码映射
            // }),
        ],
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
}
```