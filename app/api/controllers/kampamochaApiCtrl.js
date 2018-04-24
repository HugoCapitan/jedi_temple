const Store = require('../models/Store')
const Product = require('../models/Product')
const CustomField = require('../models/CustomField')

const { sendError } = require('../utils/http')

module.exports = {
  getStore
}

async function getStore(req, res) {
  try {
    const products = await Product.find({ store: 'kampamocha' }).exec()
    const customFields = await CustomField.find({ store: 'kampamocha' }).exec()

    res.status(200).json({
      products,
      custom_fields: customFields
    })
  } catch (e) {
    sendError(500, 'Unexpected Error', e, res)
  }
}
