const express = require('express')
const path = require('path')

const environment = process.env.NODE_ENV
const port = (environment === 'production') ? 80 : 3000
const server = express()

server.use('/dist/', express.static(path.resolve(__dirname, 'dist')))

server.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'app/public', 'index.html'))
})

server.listen(port, () => {
  console.log(`${environment} server listening on port ${port}`)
})