const Store = require('../models/Store')
const Product = require('../models/Product')

const { sendError } = require('../utils/http')

module.exports = {
  getStoreInfo,
  getProducts
}

async function getStoreInfo(req, res) {

}

async function getProducts(req, res) {
  try {
    const kampaProducts = await Product.find({ store: 'kampamocha' }).exec();
    res.status(200).json(kampaProducts)
  } catch (e) {
    sendError(500, 'Unexpected Error', e, res)
  }
}
