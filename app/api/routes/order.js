const orderCtrl = require('../controllers/orderCtrl')

module.exports = app => {
  app.route('/orders/')
    .get(orderCtrl.apiAll)
    .post(orderCtrl.apiCreate)
  app.route('/orders/:id')
    .get(orderCtrl.apiRead)
    .put(orderCtrl.apiUpdate)
    .delete(orderCtrl.apiRemove)
}
