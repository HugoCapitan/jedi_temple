const textCtrl = require('../controllers/textCtrl')

module.exports = app => {
  app.route('/text/')
    .get(textCtrl.apiAll)
    .post(textCtrl.apiCreate)
  app.route('/text/:id')
    .get(textCtrl.apiRead)
    .put(textCtrl.apiUpdate)
    .delete(textCtrl.apiRemove)
}
