const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const genuuid = require('uuid')

const routes = require('./routes')
const initData = require('./config/initData')

module.exports = server => {

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
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: false }))

  // Database
  mongoose.Promise = global.Promise;

  mongoose.connect('mongodb://localhost/test', {
    useMongoClient: true
  }).catch(e => { throw e })

  routes(server)

  initData()

}