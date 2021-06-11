//const webpack = require('webpack');
const path = require('path');
//const HtmlPlugin = require('html-webpack-plugin');
//const CaseSensitivePathsWebpackPlugin = require('case-sensitive-paths-webpack-plugin');

module.exports = {
    mode: 'production',
    context: path.resolve(__dirname, 'assets/js'),
    entry: './main',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js','.ts']
    },
    watch: false,
    plugins: [
        //new HtmlPlugin(),
        //new CaseSensitivePathsWebpackPlugin()
    ],
    devtool: 'source-map',
    module: {
        /*loaders: [
          {
            test: /\.ts$/,
            loader: 'awesome-typescript-loader'
          },
        ],*/
        rules: [
          {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: "defaults" }]
                ]
              }
            }
          }
        ]
    }
};