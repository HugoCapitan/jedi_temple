const hmProductCtrl = require('../controllers/hmProductCtrl')

module.exports = app => {
  app.route('/hm_products/')
    .get(hmProductCtrl.apiAll)
    .post(hmProductCtrl.apiCreate)
  app.route('/hm_products/:id')
    .get(hmProductCtrl.apiRead)
    .put(hmProductCtrl.apiUpdate)
    .delete(hmProductCtrl.apiRemove)
}
