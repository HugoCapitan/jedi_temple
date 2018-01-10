const customFieldCtrl = require('../controllers/customFieldCtrl')

module.exports = app => {
  app.route('/custom_fields/')
    .get(customFieldCtrl.apiAll)
    .post(customFieldCtrl.apiCreate)
  app.route('/custom_fields/:id')
    .get(customFieldCtrl.apiRead)
    .put(customFieldCtrl.apiUpdate)
    .delete(customFieldCtrl.apiRemove)
}