const bodyParser = require('body-parser')
const express    = require('express')
const genuuid    = require('uuid')
const jwt        = require('express-jwt')
const jwks       = require('jwks-rsa')
const mongoose   = require('mongoose')
const path       = require('path')
const session    = require('express-session')

const routes   = require('./routes')
const initData = require('./config/initData')

module.exports = server => {
  const apiRouter = express.Router()

  const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: 'https://hookahdev.auth0.com/.well-known/jwks.json'
    }),
    audience: 'https://ventadmin.unahil.com',
    issuer: 'https://hookahdev.auth0.com/',
    algorithms: ['RS256']
  })
  apiRouter.use(jwtCheck)
  apiRouter.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({message:'Missing or invalid token'});
    }
  })

  server.use(session({
    genid: function(req) {
      return genuuid() // use UUIDs for session IDs
    },
    secret: 'nerds will rise',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))

  // Parsers
  server.use(bodyParser.json())
  server.use(bodyParser.urlencoded({ extended: false }))

  mongoose.Promise = global.Promise
  mongoose.connect('mongodb://localhost/test', {
    useMongoClient: true
  }).catch(e => { throw e })

  initData()
  routes(apiRouter)  

  server.use('/api/', apiRouter)
}