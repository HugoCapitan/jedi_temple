const productCtrl = require('../controllers/productCtrl')

module.exports = app => {
  app.route('/products/')
    .get(productCtrl.apiAll)
    .post(productCtrl.apiCreate)
  app.route('/products/:id')
    .get(productCtrl.apiRead)
    .put(productCtrl.apiUpdate)
    .delete(productCtrl.apiRemove)


  app.post('/products/:product_id/customs/', productCtrl.apiAddCustom)
  app.route('/products/:product_id/customs/:custom_id')
    .put(productCtrl.apiUpdateCustom)
    .delete(productCtrl.apiRemoveCustom)

  app.post('/products/:product_id/images/', productCtrl.apiAddImage)
  app.route('/products/:product_id/images/:image_id')
    .put(productCtrl.apiUpdateImage)
    .delete(productCtrl.apiRemoveImage)
}
