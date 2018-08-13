const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const SRC_PATH = path.resolve('./app');
const ASSETS_PATH = path.resolve('./build');


module.exports = {
  context: SRC_PATH,
  entry: {
    app: './script/app.js'
  },
  output: {
    path: ASSETS_PATH,
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: '/node_modules/'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(ASSETS_PATH),
    new HTMLWebpackPlugin({
      template: __dirname + "/app/index.html"
    })
  ]
};