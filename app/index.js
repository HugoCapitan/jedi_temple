const bodyParser    = require('body-parser')
const express       = require('express')
const mongoose      = require('mongoose')
const passport      = require('passport')
const LocalStrategy = require('passport-local').Strategy
const path          = require('path')
const session       = require('express-session')

const apiCleanData  = require('./api/config/cleanData')
const apiInitData   = require('./api/config/initData')
const apiMiddleware = require('./api/middleware/')
const apiMockData   = require('./api/config/mockData')
const apiRoutes     = require('./api/routes')

const Admin = require('./api/models/Admin')

module.exports = async server => {
  // GLOBAL MIDDLEWARE
  server.use(bodyParser.json())
  server.use(bodyParser.urlencoded({ extended: false }))

  // DATABASE
  mongoose.Promise = global.Promise
  mongoose.connect('mongodb://localhost/test', {
    useMongoClient: true
  }).catch(e => { throw e })

  // STATICFILES
  server.use('/dist/', express.static(path.resolve(__dirname, 'dist')))

  // WEB
  const webRouter = express.Router()
  passport.use(new LocalStrategy((email, password, done) => {
    Admin.findOne({ email }).exec()
    .then(user => {
      if (!user) 
        return done(null, false, { message: 'Incorrect username.' })
      
      return user.isPasswordValid(password)
    })
    .then(isValid => {
      
      return isValid ? done(null, user)   
      : done(null, false, { message: 'Incorrect password' })
    })
    .catch(err => done(err))
  }))

  webRouter.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
  })

  server.use('/app/', webRouter)

  // API
  const apiRouter = express.Router()
  apiMiddleware(apiRouter)
  apiRoutes(apiRouter)

  if (process.env.NODE_ENV === 'development') {
    await apiCleanData()
    await apiMockData() 
  }
  
  if (process.env.NODE_ENV === 'production') 
    apiInitData()

  server.use('/api/', apiRouter)  
}
