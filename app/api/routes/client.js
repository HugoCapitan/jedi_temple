const clientCtrl = require('../controllers/clientCtrl')

module.exports = app => {
  app.route('/client/')
    .get(clientCtrl.apiAll)
    .post(clientCtrl.apiCreate)
  app.route('/client/:id')
    .get(clientCtrl.apiRead)
    .put(clientCtrl.apiUpdate)
    .delete(clientCtrl.apiRemove)
}
