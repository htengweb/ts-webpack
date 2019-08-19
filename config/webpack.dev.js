const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const config = require('./webpack.base');
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
console.log("IPAdress", IPAdress)
module.exports = merge(config, {
    mode: 'development',
    devServer: {
        contentBase: path.resolve(__dirname, 'public'),// 开启开发服务后访问的地址
        watchContentBase: true,
        port: 9001,
        hot: true,
        open: true,
        inline: true,
        compress: true, // 启动gzip压缩
    },
    module: {
        // 忽略解析依赖
        // noParse:/(vue|react)/,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            process: {
                env: {
                    NODE_ENV: JSON.stringify('development')
                }
            }
        })
    ]
})