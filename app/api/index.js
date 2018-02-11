const bodyParser = require('body-parser')
const express    = require('express')
const genuuid    = require('uuid')
const jwt        = require('express-jwt')
const jwks       = require('jwks-rsa')
const mongoose   = require('mongoose')
const path       = require('path')
const session    = require('express-session')

const routes    = require('./routes')
const initData  = require('./config/initData')
const mockData  = require('./config/mockData')
const cleanData = require('./config/cleanData')

module.exports = async server => {
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

  function guard (req, res, next) {
    console.log('path:', req)
    switch (req.path) {
      case '/store/': {
        const permissions = ['unahil']
        for (const perm of permissions) {
          if (req.user.scope.includes(perm)) {
            next()
          } else {
            res.status(403).send({message:'Forbidden'})
          }
        }
      }
    }
  }

  apiRouter.use(jwtCheck)
  apiRouter.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({message:'Missing or invalid token'});
    }
  })
  apiRouter.use(guard)

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

  if (process.env.NODE_ENV === 'development') {
    await cleanData()
    await mockData() 
  }
  
  if (process.env.NODE_ENV === 'production') 
    initData()
  
  routes(apiRouter)  

  server.use('/api/', apiRouter)
}