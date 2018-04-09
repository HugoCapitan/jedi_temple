const kampamochaApiCtrl = require('../controllers/kampamochaApiCtrl')

module.exports = roter => {
  server.get('/kampamocha/products', kampamochaApiCtrl.getProducts)
}
