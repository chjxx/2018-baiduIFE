const config = require('./webpack.base.config.js');
const webpack = require('webpack');

config.mode = 'development';
config.devtool = 'eval-source-map';

config.devServer = {
  contentBase: './build/',
  hot: true
};


config.module.rules.push({
  test: /\.(css|scss|sass)$/,
  use: [
    'style-loader',
    'css-loader',
    'sass-loader'
  ],
  exclude: '/node_modules/'
});

config.module.rules.push({
  test:/\.html$/,
  loader: 'raw-loader'
})

config.plugins.push(
  new webpack.HotModuleReplacementPlugin()
);

module.exports = config;