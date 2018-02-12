const bodyParser = require('body-parser')
const express    = require('express')
const genuuid    = require('uuid')
const mongoose   = require('mongoose')
const path       = require('path')
const session    = require('express-session')

const middleware = require('./middleware/api')
const routes     = require('./routes')
const initData   = require('./config/initData')
const mockData   = require('./config/mockData')
const cleanData  = require('./config/cleanData')

module.exports = async server => {
  const apiRouter = express.Router()
  middleware(apiRouter)

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