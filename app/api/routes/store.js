const storeCtrl = require('../controllers/storeCtrl')

module.exports = app => {
  app.route('/stores/')
    .get(storeCtrl.apiAll)
    .post(storeCtrl.apiCreate)
  app.route('/stores/:id')
    .get(storeCtrl.apiRead)
    .put(storeCtrl.apiUpdate)
    .delete(storeCtrl.apiRemove)
}
