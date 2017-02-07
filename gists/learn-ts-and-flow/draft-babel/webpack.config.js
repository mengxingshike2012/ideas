const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.jsx',
  output: {
    filename: "bundle.js",
    path:__dirname + "/dist"
  },
  devtool: "source-map",
  resolve: {
    extensions: ["", ".js", ".jsx"]
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: "babel"
      }
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './index.html'
    })
  ]
}
