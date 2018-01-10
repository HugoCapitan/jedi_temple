const addressCtrl = require('../controllers/addressCtrl')

module.exports = app => {
  app.route('/address/')
    .get(addressCtrl.apiAll)
    .post(addressCtrl.apiCreate)
  app.route('/address/:id')
    .get(addressCtrl.apiRead)
    .put(addressCtrl.apiUpdate)
    .delete(addressCtrl.apiRemove)
}
