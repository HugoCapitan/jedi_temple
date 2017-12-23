const express = require('express')
const path = require('path')

const environment = process.env.NODE_ENV
const port = (environment === 'production') ? 80 : 8080
const server = express()

const api = require('./app/api')

api(server)

// Setup webpack hot middleware
if (environment === 'development') {
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  
  const webpackConfig = require(path.resolve(__dirname, 'app', 'webpack.dev.config'))
  const compiler = webpack(webpackConfig)

  server.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }))

  server.use(webpackHotMiddleware(compiler))
}

server.use('/dist/', express.static(path.resolve(__dirname, 'dist')))

server.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'app/public', 'index.html'))
})

server.listen(port, () => {
  console.log(`${environment} server listening on port ${port}`)
})