const customFieldCtrl = require('../controllers/customFieldCtrl')

module.exports = app => {
  app.route('/custom_fields/')
    .get(customFieldCtrl.apiAll)
}