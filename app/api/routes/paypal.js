const paypalCtrl = require('../controllers/paypalCtrl')

module.exports = app => {
  app.get('/paypal/token', paypalCtrl.tokenEndpoint)
  app.get('/paypal/set_experiences', paypalCtrl.setXpsEndpoint)
  app.get('/paypal/get_experiences', paypalCtrl.getXps)
}