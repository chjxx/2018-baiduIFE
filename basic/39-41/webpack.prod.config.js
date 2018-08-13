const config = require('./webpack.base.config.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

config.mode = 'production';

config.module.rules.push({
  test: /\.(css|scss|sass)$/,
  use: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [
      'css-loader',
      'sass-loader'
    ],
  }),
  exclude: '/node_modules/'
});

config.plugins.push(
  new ExtractTextPlugin('[name].bundle.css')
);

module.exports = config;