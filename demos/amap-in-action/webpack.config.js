const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')

module.exports = {
  context: __dirname,
  entry: './src/index.js',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      }
    ]
  },
  plugins: [
    new HtmlPlugin({
      template: 'src/index.html'
    })
  ],
  devtool: 'source-map',
  devServer: {
    port: 8000,
  }
}
