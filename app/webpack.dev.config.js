const axis = require('axis')
const jeet = require('jeet')
const rupture = require('rupture')
const path = require('path')
const webpack = require('webpack')

module.exports = {
  resolve: {
    extensions: ['*', '.js', '.jsx', '.styl']
  },
  entry: [
    'webpack-hot-middleware/client', 
    path.resolve(__dirname, 'web', 'index.jsx')
  ],
  output: {
    path: path.resolve(__dirname, '../dist/js'),
    filename: 'app.js',
    publicPath: '/dist/'
  },
  devtool: 'cheap-module-source-map',
  module: {
    rules: [{
      test: /\.(js|jsx)?$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        query: {
          presets: [
            ['env', {loose: true, modules: false}],
            'react',
            'react-hmre'
          ],
          plugins: [
            'transform-object-rest-spread'
          ]
        }
      }],
    }, {
      test: /\.styl$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          query: {
            modules: true,
            localIdentName: '[name]__[local]__[hash:base64:5]'
          }
        }, {
          loader: 'stylus-loader',
          options: {
            use: [axis(), jeet(), rupture()]
          }
        }
      ]
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
}