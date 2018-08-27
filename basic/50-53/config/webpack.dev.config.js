let config = require('./webpack.base.config.js');
let webpack = require('webpack');

config.mode = 'development';
config.devtool = 'eval-source-map';

config.devServer = {
  contentBase: './build/',
  hot: true
};

config.module.rules.push({
  test: /\.(scss|sass|css)$/,
  use: [
    'style-loader',
    'css-loader',
    'sass-loader'
  ],
  exclude: '/node_modules/'
});

config.plugins.push(new webpack.HotModuleReplacementPlugin());

module.exports = config;