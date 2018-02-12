const pictureCtrl = require('../controllers/pictureCtrl')

module.exports = app => {
  app.route('/pictures/')
    .get(pictureCtrl.apiAll)
    .post(pictureCtrl.apiCreate)
  app.route('/pictures/:id')
    .get(pictureCtrl.apiRead)
    .put(pictureCtrl.apiUpdate)
    .delete(pictureCtrl.apiRemove)
}
