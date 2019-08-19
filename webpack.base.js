const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');// html文件生成器
const MiniCssExtractPlugin = require('mini-css-extract-plugin');// 抽离css样式
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');// 优化打包后的css文件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');// 优化打包后的js文件

module.exports = {
    entry:{
        main: './src/main.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].[hash:8].js',
    },
    module: {
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
                            hmr: true,// 修改scss热更新
                            reloadAll: true,
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
                            hmr: true,// 修改css热更新
                            reloadAll: true,
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
                removeAttributeQuotes: true,// 删除引号
                collapseWhitespace: true, // 去掉空行
                removeComments: true, // 去掉注释
            }
        }),
        // 提取css文件
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        }),
    ],
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
    optimization: {
        minimizer: [
            // 压缩css文件
            new OptimizeCSSAssetsPlugin({}),
            // 压缩js文件
            new UglifyJsPlugin({
                cache: true, // 是否缓存
                parallel: true,   // 是否并发
                sourceMap: true // 源码映射
            }),
        ]
    }
}