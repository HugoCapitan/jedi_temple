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

  passport.use(new LocalStrategy({
      usernameField: 'email', 
      passwordField: 'password'
    }, (email, password, done) => {
      let admin

      Admin.findOne({ email }).exec()
      .then(found => {
        admin = found

        return found ? 
          found.isPasswordValid(password) :
          done(null, false, { message: 'Incorrect username.' })
      })
      .then(isValid => isValid 
        ? done(null, admin)   
        : done(null, false, { message: 'Incorrect password.' })
      )
      .catch(err => done(err))
    }
  ))

  function checkUser(req, res, next) {
    console.log(req)
    return next()
  }

  const sessionOptions = {
    secret: 'ILOVELA',
    resave: false,
    saveUninitialized: true
  }

  webRouter.use(session(sessionOptions))
  webRouter.use(passport.initialize())
  webRouter.use(passport.session())
  webRouter.use(checkUser)

  webRouter.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
  })

  webRouter.route('/login')
    .get((req, res) => {
      res.sendFile(path.resolve(__dirname, 'public/login.html'))
    })
    .post(passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    }))

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
