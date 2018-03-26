const unahilApiCtrl = require('../controllers/unahilApiCtrl')

module.exports = server => {
  server.post('/unahil/reservation', unahilApiCtrl.makeReservation)
  server.get('/unahil/execute_payment/:token/', unahilApiCtrl.executePayment)
  server.get('/unahil/calendar', unahilApiCtrl.getCalendar)
}
