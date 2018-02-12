const paypalCtrl = require('../controllers/paypalCtrl')

module.exports = app => {
  app.post('/paypal/payments/', paypalCtrl.createPaymentEndpoint)
}