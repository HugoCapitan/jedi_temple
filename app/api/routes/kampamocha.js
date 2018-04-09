const kampamochaApiCtrl = require('../controllers/kampamochaApiCtrl')

module.exports = router => {
  router.get('/kampamocha/products/', kampamochaApiCtrl.getProducts)
}
