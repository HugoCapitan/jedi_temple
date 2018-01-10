const pictureCtrl = require('../controllers/pictureCtrl')

module.exports = app => {
  app.route('/ROUTE/')
    .get(pictureCtrl.apiAll)
    .post(pictureCtrl.apiCreate)
  app.route('/ROUTE/:id')
    .get(pictureCtrl.apiRead)
    .put(pictureCtrl.apiUpdate)
    .delete(pictureCtrl.apiRemove)
}
