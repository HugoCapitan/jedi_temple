const messageCtrl = require('../controllers/messageCtrl')

module.exports = app => {
  app.route('/messages/')
    .get(messageCtrl.apiAll)
    .post(messageCtrl.apiCreate)
  app.route('/messages/:id')
    .get(messageCtrl.apiRead)
    .put(messageCtrl.apiUpdate)
    .delete(messageCtrl.apiRemove)
}
