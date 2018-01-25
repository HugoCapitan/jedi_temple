const clientCtrl = require('../controllers/clientCtrl')

module.exports = app => {
  app.route('/client/')
    .get(clientCtrl.apiAll)
    .post(clientCtrl.apiCreate)
  app.route('/client/:id')
    .get(clientCtrl.apiRead)
    .put(clientCtrl.apiUpdate)
    .delete(clientCtrl.apiRemove)

  app.route('/client/:client_id/addresses/')
    .post(clientCtrl.apiCreateAddress)
  app.route('/client/:client_id/addresses/:address_id')
    .put(clientCtrl.apiUpdateAddress)
    .delete(clientCtrl.apiRemoveAddress)
}
