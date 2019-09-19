const os = require('os');
const path = require('path');
const webpack = require('webpack');
const HappyPack = require('happypack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const node_modules_dir = path.resolve(__dirname, 'node_modules');

const happyThreadPool = HappyPack.ThreadPool({
    size: os.cpus().length
});

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    entry: {
        app: path.resolve(__dirname, 'app/main.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
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
            use: ExtractTextPlugin.extract({
                fallback: 'vue-style-loader',
                use: 'happypack/loader?id=css'
            })
        }, {
            test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.mp3$/,
            exclude: node_modules_dir,
            loader: 'file-loader'
        }]
    },
    optimization: {
        minimize: true,
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                uglifyOptions: {
                    output: {
                        comments: false,
                        beautify: false
                    }
                }
            }),
            new OptimizeCssAssetsPlugin({
                assetNameRegExp: /\.(sa|sc|c)ss$/g,
                cssProcessor: require('cssnano'),
                cssProcessorPluginOptions: {
                    preset: ['default', {
                        discardComments: {
                            removeAll: true
                        },
                        normalizeUnicode: false
                    }]
                },
                canPrint: true
            })
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new ExtractTextPlugin("styles.css"),
        new HtmlWebpackPlugin({
            title: 'vueProject',
            filename: 'index.html',
            template: path.resolve(__dirname, 'template.html'),
            inject: false,
            hash: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new AddAssetHtmlPlugin([{
            filepath: path.join(__dirname, 'dist', '*.dll.js'),
            hash: true
        }]),
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
        new HappyPack({
            id: 'css',
            loaders: [{
                loader: 'css-loader',
                options: {
                    importLoaders: 1
                }
            }, 'postcss-loader'],
            threadPool: happyThreadPool
        }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./dist/vendors-manifest.json')
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['**/*', '!vendors*']
        })
    ]
}