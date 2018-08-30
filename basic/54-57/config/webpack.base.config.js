const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const SRC_PATH = path.resolve('./app');
const ASSETS_PATH = path.resolve('./build');
const HTML_PATH = path.resolve('./app/index.html');

module.exports = {
  context: SRC_PATH,
  entry: './script/index.js',
  output: {
    path: ASSETS_PATH,
    filename: '[name].bundle.js'
  },
  module:{
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: '/node_modules/'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(ASSETS_PATH),
    new HTMLWebpackPlugin({
      template: HTML_PATH
    })
  ]
};
