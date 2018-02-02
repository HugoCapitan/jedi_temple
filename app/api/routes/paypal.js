const paypalCtrl = require('../controllers/paypalCtrl')

module.exports = app => {
  app.get('/paypal/token', paypalCtrl.tokenEndpoint)
}