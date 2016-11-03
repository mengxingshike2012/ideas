const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: 'app.js',
  output: {
    filename: 'main.js',
  },

  cache: false,
  debug: true,
  devtool: 'eval',

  module: {
    loaders: {
      test: /\.scss/,
      loader: ExtractTextPlugin.extract(
        'style',
        ['css',
         'postcss',
        'sass?outputStyle=expanded']
      )
    }
  },
  plugins: [
    new HtmlPlugin({
      template: 'index.html',
      cache: false
    })
    new ExtractTextPlugin('styles.css')
  ]
};
