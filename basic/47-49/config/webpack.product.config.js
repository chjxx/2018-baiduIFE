let config = require('./webpack.base.config.js');
let ExtractStylePlugin = require('extract-text-webpack-plugin');

config.mode = 'production';

config.module.rules.push({
  test: /\.(scss|sass|css)$/,
  use: ExtractStylePlugin.extract({
    fallback: 'style-loader',
    use: [
      'css-loader',
      'sass-loader'
    ]
  }),
  exclude: '/node_modules/'
});

config.plugins.push(new ExtractStylePlugin('[name].bundle.css'));

module.exports = config;