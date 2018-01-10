const pictureCtrl = require('../controllers/pictureCtrl')

module.exports = app => {
  app.route('/picture/')
    .get(pictureCtrl.apiAll)
    .post(pictureCtrl.apiCreate)
  app.route('/picture/:id')
    .get(pictureCtrl.apiRead)
    .put(pictureCtrl.apiUpdate)
    .delete(pictureCtrl.apiRemove)
}
