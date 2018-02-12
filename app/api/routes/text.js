const textCtrl = require('../controllers/textCtrl')

module.exports = app => {
  app.route('/texts/')
    .get(textCtrl.apiAll)
    .post(textCtrl.apiCreate)
  app.route('/texts/:id')
    .get(textCtrl.apiRead)
    .put(textCtrl.apiUpdate)
    .delete(textCtrl.apiRemove)
}
