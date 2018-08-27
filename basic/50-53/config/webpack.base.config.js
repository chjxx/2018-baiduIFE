const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CleanWebapckPlugin = require('clean-webpack-plugin');

let SRC_PATH = path.resolve('./app');
let ASSETS_PATH = path.resolve('./build');
let HTML_PATH = path.resolve('./app/index.html');

module.exports = {
  context: SRC_PATH,
  entry: './script/index.js',
  output:{
    path: ASSETS_PATH,
    filename: '[name].bundle.js'
  },
  module:{
    rules:[
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: '/node_modules/'
      },{
        test:/\.(png|jpg)$/,
        loader: 'url-loader?limit=8192&name=./images/[name].[ext]'
      }
    ]
  },
  plugins:[
    new CleanWebapckPlugin(ASSETS_PATH),
    new HTMLWebpackPlugin({
      template: HTML_PATH
    })
  ]
}