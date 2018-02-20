const clientCtrl = require('../controllers/clientCtrl')

module.exports = app => {
  app.route('/clients/')
    .get(clientCtrl.apiAll)
    .post(clientCtrl.apiCreate)
  app.route('/clients/:id')
    .get(clientCtrl.apiRead)
    .put(clientCtrl.apiUpdate)
    .delete(clientCtrl.apiRemove)
}
