const express = require('express')
const http = require('http')
const path = require('path')

const server = express()

const api = require('./app/api')

api(server)

// Setup webpack hot middleware
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

server.use('/dist/', express.static(path.resolve(__dirname, 'dist')))

server.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'app/public', 'index.html'))
})

if (process.env.NODE_ENV === 'development') {

  http.Server(server).listen(process.env.NODE_PORT, () => {
    console.log(`${process.env.NODE_ENV} server listening on port ${process.env.NODE_PORT}`)
  })

} else if (process.env.NODE_ENV === 'production') {

}
