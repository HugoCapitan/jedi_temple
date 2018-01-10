const orderCtrl = require('../controllers/orderCtrl')

module.exports = app => {
  app.route('/order/')
    .get(orderCtrl.apiAll)
    .post(orderCtrl.apiCreate)
  app.route('/order/:id')
    .get(orderCtrl.apiRead)
    .put(orderCtrl.apiUpdate)
    .delete(orderCtrl.apiRemove)
}
