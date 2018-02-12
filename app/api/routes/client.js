const clientCtrl = require('../controllers/clientCtrl')

module.exports = app => {
  app.route('/clients/')
    .get(clientCtrl.apiAll)
    .post(clientCtrl.apiCreate)
  app.route('/clients/:id')
    .get(clientCtrl.apiRead)
    .put(clientCtrl.apiUpdate)
    .delete(clientCtrl.apiRemove)

  app.post('/clients/:client_id/addresses/', clientCtrl.apiCreateAddress)
  app.route('/clients/:client_id/addresses/:address_id')
    .put(clientCtrl.apiUpdateAddress)
    .delete(clientCtrl.apiRemoveAddress)

  app.post('/clients/:client_id/orders/:order_id', clientCtrl.apiAddOrder)
  app.delete('/clients/:client_id/orders/:order_id', clientCtrl.apiRemoveOrder)

  app.post('/clients/:client_id/reservations/:reservation_id', clientCtrl.apiAddReservation)
  app.delete('/clients/:client_id/reservations/:reservation_id', clientCtrl.apiRemoveReservation)

  app.post('/clients/:client_id/wishlist/:wish_id', clientCtrl.apiAddWish)
  app.delete('/clients/:client_id/wishlist/:wish_id', clientCtrl.apiRemoveWish)
}
