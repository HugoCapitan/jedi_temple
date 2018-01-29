const hmProductCtrl = require('../controllers/hmProductCtrl')

module.exports = app => {
  app.route('/hm_product/')
    .get(hmProductCtrl.apiAll)
    .post(hmProductCtrl.apiCreate)
  app.route('/hm_product/:id')
    .get(hmProductCtrl.apiRead)
    .put(hmProductCtrl.apiUpdate)
    .delete(hmProductCtrl.apiRemove)

  app.route('/hm_product/:hmproduct_id/materials/')
    .post(hmProductCtrl.apiCreateMaterial)
  app.route('/hm_product/:hmproduct_id/materials/:material_id')
    .put(hmProductCtrl.apiUpdateMaterial)
    .delete(hmProductCtrl.apiRemoveMaterial)

  app.route('/hm_product/:hmproduct_id/models/')
    .post(hmProductCtrl.apiCreateModel)
  app.route('/hm_product/:hmproduct_id/models/:model_id')
    .put(hmProductCtrl.apiUpdateModel)
    .delete(hmProductCtrl.apiRemoveModel)
}
