const orderCtrl = require('../controllers/orderCtrl')

module.exports = app => {
  app.route('/order/')
    .get(orderCtrl.apiAll)
    .post(orderCtrl.apiCreate)
  app.route('/order/:id')
    .get(orderCtrl.apiRead)
    .put(orderCtrl.apiUpdate)
    .delete(orderCtrl.apiRemove)

  app.put('/order/:order_id/billing_address', orderCtrl.apiUpdateBillingAddress)
  app.put('/order/:order_id/shipping_address', orderCtrl.apiUpdateShippingAddress)

  app.post('/order/:order_id/products', orderCtrl.apiAddProduct)
  app.delete('/order/:order_id/products/:product_id', orderCtrl.apiRemoveProduct)
}
