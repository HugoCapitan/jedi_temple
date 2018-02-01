const reservationCtrl = require('../controllers/reservationCtrl')

module.exports = app => {
  app.route('/reservation/')
    .get(reservationCtrl.apiAll)
    .post(reservationCtrl.apiCreate)
  app.route('/reservation/:id')
    .get(reservationCtrl.apiRead)
    .put(reservationCtrl.apiUpdate)
    .delete(reservationCtrl.apiRemove)

  api.put('/reservation/:id/specials', reservationCtrl.apiUpdateDatesPrice)
}
