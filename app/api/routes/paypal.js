const paypalCtrl = require('../controllers/paypalCtrl')

module.exports = app => {
  app.post('/paypal/payment/', paypalCtrl.createPaymentEndpoint)
}