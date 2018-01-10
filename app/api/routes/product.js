const productCtrl = require('../controllers/productCtrl')

module.exports = app => {
  app.route('/product/')
    .get(productCtrl.apiAll)
    .post(productCtrl.apiCreate)
  app.route('/product/:id')
    .get(productCtrl.apiRead)
    .put(productCtrl.apiUpdate)
    .delete(productCtrl.apiRemove)
}
