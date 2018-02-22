const productCtrl = require('../controllers/productCtrl')

module.exports = app => {
  app.route('/products/')
    .get(productCtrl.apiAll)
    .post(productCtrl.apiCreate)
  app.route('/products/:id')
    .get(productCtrl.apiRead)
    .put(productCtrl.apiUpdate)
    .delete(productCtrl.apiRemove)
}
