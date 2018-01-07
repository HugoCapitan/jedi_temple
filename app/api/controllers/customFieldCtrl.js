const CustomField = require('../models/CustomField')

module.exports = {
  create,
  apiAll
}

async function create(fieldToAdd) {
  try {
    const newCustomField = await new CustomField(fieldToAdd).save();
    return newCustomField;
  } catch (e) {
    e.customOrigin = 'Field';
    if (e.name === 'ValidationError')
      e.customMessage = 'Validation Error';
    else if (e.code === 11000)
      e.customMessage = 'Duplicated Name';
    else
      e.customMessage = 'Unexpected Error';
    
    console.log('usup ', e)

    throw e;
  }
}

async function apiAll(req, res) {
  try {
    let customFields = await CustomField.find();
    res.status(200).json(customFields);
  } catch (e) {
    utils.sendError(500, 'Unexpected Error', e, res);
  }
}
