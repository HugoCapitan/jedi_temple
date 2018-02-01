const productCtrl = require('../controllers/productCtrl')

module.exports = app => {
  app.route('/product/')
    .get(productCtrl.apiAll)
    .post(productCtrl.apiCreate)
  app.route('/product/:id')
    .get(productCtrl.apiRead)
    .put(productCtrl.apiUpdate)
    .delete(productCtrl.apiRemove)


  app.post('/product/:product_id/customs/', productCtrl.apiAddCustom)
  app.route('/product/:product_id/customs/:custom_id')
    .put(productCtrl.apiUpdateCustom)
    .delete(productCtrl.apiRemoveCustom)

  app.post('/product/:product_id/images/', productCtrl.apiAddImage)
  app.route('/product/:product_id/images/:image_id')
    .put(productCtrl.apiUpdateImage)
    .delete(productCtrl.apiRemoveImage)
}
