const clientCtrl = require('../controllers/clientCtrl')

module.exports = app => {
  app.route('/client/')
    .get(clientCtrl.apiAll)
    .post(clientCtrl.apiCreate)
  app.route('/client/:id')
    .get(clientCtrl.apiRead)
    .put(clientCtrl.apiUpdate)
    .delete(clientCtrl.apiRemove)

  app.post('/client/:client_id/addresses/', clientCtrl.apiCreateAddress)
  app.route('/client/:client_id/addresses/:address_id')
    .put(clientCtrl.apiUpdateAddress)
    .delete(clientCtrl.apiRemoveAddress)

  app.post('/client/:client_id/orders/:order_id', clientCtrl.apiAddOrder)
  app.delete('/client/:client_id/orders/:order_id', clientCtrl.apiRemoveOrder)

  app.post('/client/:client_id/reservations/:reservation_id', clientCtrl.apiAddReservation)
  app.delete('/client/:client_id/reservations/:reservation_id', clientCtrl.apiRemoveReservation)

  app.post('/client/:client_id/wishlist/:wish_id', clientCtrl.apiAddWish)
  app.delete('/client/:client_id/wishlist/:wish_id', clientCtrl.apiRemoveWish)
}
