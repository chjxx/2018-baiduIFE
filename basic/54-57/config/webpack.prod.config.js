let config = require('./webpack.base.config.js');
let ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

config.mode = 'production';

config.module.rules.push({
  test: /\.(css|sass|scss)$/,
  use: ExtractTextWebpackPlugin.extract({
    fallback: 'style-loader',
    use: ['css-loader', 'sass-loader']
  }),
  exclude: '/node_modules'
});


config.plugins.push(
  new ExtractTextWebpackPlugin('[name].bundle.css')
);

module.exports = config;