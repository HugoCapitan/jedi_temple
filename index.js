const express = require('express')
const path = require('path')

const environment = process.env.NODE_ENV
const port = (environment === 'production') ? 80 : 3000
const server = express()

server.get('/', (req, res) => {
  res.send('Hi')
})

server.listen(port, () => {
  console.log(`${environment} server listening on port ${port}`)
})