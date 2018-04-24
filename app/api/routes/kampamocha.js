const kampamochaApiCtrl = require('../controllers/kampamochaApiCtrl')

module.exports = router => {
  router.get('/kampamocha/store/', kampamochaApiCtrl.getStore)
}
