const orderCtrl = require('../controllers/orderCtrl')

module.exports = app => {
  app.route('/orders/')
    .get(orderCtrl.apiAll)
    .post(orderCtrl.apiCreate)
  app.route('/orders/:id')
    .get(orderCtrl.apiRead)
    .put(orderCtrl.apiUpdate)
    .delete(orderCtrl.apiRemove)

  app.put('/orders/:order_id/billing_address', orderCtrl.apiUpdateBillingAddress)
  app.put('/orders/:order_id/shipping_address', orderCtrl.apiUpdateShippingAddress)

  app.post('/orders/:order_id/products', orderCtrl.apiAddProduct)
  app.delete('/orders/:order_id/products/:product_id', orderCtrl.apiRemoveProduct)
}
