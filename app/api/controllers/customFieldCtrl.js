const CustomField = require('../models/CustomField')
const productCtrl = require('./productCtrl')

module.exports = {
  create,
  apiAll
}

async function create(fieldObj) {
  try {
    const newCustomField = await new CustomField(fieldObj).save()
    return newCustomField
  } catch (e) {
    e.customOrigin = 'Field'
    if (e.name === 'ValidationError')
      e.customMessage = 'Validation Error'
    else if (e.code === 11000)
      e.customMessage = 'Duplicated Name'
    else
      e.customMessage = 'Unexpected Error'

    throw e;
  }
}

async function remove(id) {
  try {
    const delCustomField = await CustomField.findByIdAndRemove(id)
    await productCtrl.removeAllProductsCustom(id)
    return delCustomField
  } catch (e) {
    if (e.customOrigin) throw e // <- error from product

    e.customOrigin = 'Field'
    if (e.name === 'CastError')
      e.customMessage = `CustomField ${id} not found`
    else
      e.customMessage = 'Unexpected Error'

    throw e
  }
}

async function update(id, newFieldObj) {
  try {

  } catch (e) {
    
  }
}

async function apiAll(req, res) {
  try {
    let customFields = await CustomField.find()
    res.status(200).json(customFields)
  } catch (e) {
    utils.sendError(500, 'Unexpected Error', e, res)
  }
}
