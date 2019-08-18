const os = require('os');
const path = require('path');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const dllPath = path.resolve(__dirname, 'dist');

module.exports = {
    mode: "production",
    entry: {
        vendors: ['vue']
    },
    output: {
        path: dllPath,
        filename: '[name].dll.js',
        library: '[name]_lib'
    },
    optimization: {
        minimize: true,
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(dllPath, '[name]-manifest.json'),
            name: '[name]_lib'
        }),
        // new BundleAnalyzerPlugin()
    ]
}