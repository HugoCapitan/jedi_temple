const unahilApiCtrl = require('../controllers/unahilApiCtrl')

module.exports = server => {
  server.post('/unahil/reservation', unahilApiCtrl.makeReservation)
}
