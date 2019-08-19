const os = require('os');
const path = require('path');
const webpack = require('webpack');
const HappyPack = require('happypack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

const node_modules_dir = path.resolve(__dirname, 'node_modules');

const happyThreadPool = HappyPack.ThreadPool({
    size: os.cpus().length
});

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: path.resolve(__dirname, 'app/main.js'),
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    resolve: {
        alias: {
            '@common': path.resolve(__dirname, 'app/common'),
            '@components': path.resolve(__dirname, 'app/components'),
            '@static': path.resolve(__dirname, 'app/static'),
            '@styles': path.resolve(__dirname, 'app/styles')
        }
    },
    module: {
        rules: [{
            test: /\.vue$/,
            exclude: node_modules_dir,
            use: [{
                loader: 'vue-loader',
                options: {
                    loaders: {
                        js: 'happypack/loader?id=babel'
                    }
                }
            }]
        }, {
            test: /\.jsx?$/,
            exclude: node_modules_dir,
            use: 'happypack/loader?id=babel'
        }, {
            test: /\.css$/,
            exclude: node_modules_dir,
            loader: 'vue-style-loader!css-loader!postcss-loader'
        }, {
            test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.mp3$/,
            exclude: node_modules_dir,
            loader: 'file-loader'
        }]
    },
    devServer: {
        host: '127.0.0.1',
        port: 8088
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, 'template.html'),
            inject: false
        }),
        new AddAssetHtmlPlugin({
            filepath: path.join(__dirname, 'build', '*.dll.js'),
            includeSourcemap: false
        }),
        new HappyPack({
            id: 'babel',
            loaders: [{
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true
                }
            }],
            threadPool: happyThreadPool
        }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./build/vendors-manifest.json')
        })
    ]
}