const reservationCtrl = require('../controllers/reservationCtrl')

module.exports = api => {
  api.route('/reservations/')
    .get(reservationCtrl.apiAll)
    .post(reservationCtrl.apiCreate)
  api.route('/reservations/:id')
    .get(reservationCtrl.apiRead)
    .put(reservationCtrl.apiUpdate)
    .delete(reservationCtrl.apiRemove)

  api.put('/reservations/:id/specials', reservationCtrl.apiUpdateDatesPrice)
}
