const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/build/',
    filename: 'project.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: { loader: 'babel-loader'},
        exclude: /node_modules/
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: 'raw-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      // phaser plugins.
      'CANVAS_RENDERED': JSON.stringify(true),
      'WEBGL_RENDERED': JSON.stringify(true)
    })
  ]
};