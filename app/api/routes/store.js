const storeCtrl = require('../controllers/storeCtrl')

module.exports = app => {
  app.route('/store/')
    .get(storeCtrl.apiAll)
    .post(storeCtrl.apiCreate)
  app.route('/store/:id')
    .get(storeCtrl.apiRead)
    .put(storeCtrl.apiUpdate)
    .delete(storeCtrl.apiRemove)
}
