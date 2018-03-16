const topCtrl = require('../controllers/topCtrl')

module.exports = app => {
  app.route('/tops/')
    .get(topCtrl.apiAll)
    .post(topCtrl.apiCreate)
  app.route('/tops/:id')
    .get(topCtrl.apiRead)
    .put(topCtrl.apiUpdate)
    .delete(topCtrl.apiRemove)
}
