const filterCtrl = require('../controllers/filterCtrl')

module.exports = app => {
  app.route('/filter/')
    .get(filterCtrl.apiAll)
    .post(filterCtrl.apiCreate)
  app.route('/filter/:id')
    .get(filterCtrl.apiRead)
    .put(filterCtrl.apiUpdate)
    .delete(filterCtrl.apiRemove)
}
