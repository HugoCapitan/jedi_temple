const customFieldCtrl = require('../controllers/customFieldCtrl')

module.exports = app => {
  app.route('/custom_fields/')
    .get(customFieldCtrl.apiAll)
    .post(customFieldCtrl.apiCreate)
  app.route('/custom_fields/:id')
    .get(customFieldCtrl.apiRead)
    .put(customFieldCtrl.apiUpdate)
    .delete(customFieldCtrl.apiRemove)
    
  app.route('/custom_fields/:custom_id/values')
    .post(customFieldCtrl.apiCreateValue)
  app.route('/custom_fields/:custom_id/values/:value_id')
    .put(customFieldCtrl.apiUpdateValue)
    .delete(customFieldCtrl.apiRemoveValue)
}