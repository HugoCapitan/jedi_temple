const CONTROLLER = require('../controllers/CONTROLLER')

module.exports = app => {
  app.route('/ROUTE/')
    .get(CONTROLLER.apiAll)
    .post(CONTROLLER.apiCreate)
  app.route('/ROUTE/:id')
    .get(CONTROLLER.apiRead)
    .put(CONTROLLER.apiUpdate)
    .delete(CONTROLLER.apiRemove)
}
