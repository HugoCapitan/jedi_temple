const clientRouter      = require('./client')
const customFieldRouter = require('./customField')
const hmProductRouter   = require('./hmProduct')
const messageRouter     = require('./message')
const orderRouter       = require('./order')
const paypalRouter      = require('./paypal')
const pictureRouter     = require('./picture')
const productRouter     = require('./product')
const reservationRouter = require('./reservation')
const storeRouter       = require('./store')
const textRouter        = require('./text')
const topRouter         = require('./top')
const unahilRouter      = require('./unahil')

module.exports = app => {
  clientRouter(app)
  customFieldRouter(app)
  hmProductRouter(app)
  messageRouter(app)
  orderRouter(app)
  paypalRouter(app)
  pictureRouter(app)
  productRouter(app)
  reservationRouter(app)
  storeRouter(app)
  textRouter(app)
  topRouter(app)
  unahilRouter(app)
}
