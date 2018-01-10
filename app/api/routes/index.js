const addressRouter     = require('./address')
const customFieldRouter = require('./customField')

module.exports = app => {
  customFieldRouter(app)
  addressRouter(app)
}