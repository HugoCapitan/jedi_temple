const express = require('express')
const http    = require('http')
const path    = require('path')

const server = express()
const app    = require('./app')

app(server)

if (process.env.NODE_ENV === 'development') {
  // WEBPACK
  // if (environment === 'development') {
  //   const webpack = require('webpack')
  //   const webpackDevMiddleware = require('webpack-dev-middleware')
  //   const webpackHotMiddleware = require('webpack-hot-middleware')
    
  //   const webpackConfig = require(path.resolve(__dirname, 'app', 'webpack.dev.config'))
  //   const compiler = webpack(webpackConfig)

  //   server.use(webpackDevMiddleware(compiler, {
  //     noInfo: true,
  //     quiet: true,
  //     publicPath: webpackConfig.output.publicPath
  //   }))

  //   server.use(webpackHotMiddleware(compiler, {
  //     quiet: true
  //   }))
  // }

  http.Server(server).listen(process.env.NODE_PORT, () => {
    console.log(`${process.env.NODE_ENV} server listening on port ${process.env.NODE_PORT}`)
  })

} else if (process.env.NODE_ENV === 'production') {

}
