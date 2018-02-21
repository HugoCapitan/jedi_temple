const _ = require('lodash')

const CustomField = require('../models/CustomField')
const productCtrl = require('./productCtrl')

const { sendError } = require('../utils/http')

module.exports = {
  apiAll,
  apiCreate,
  apiRead,
  apiRemove,
  apiUpdate
}

async function apiAll(req, res) {
  try {
    const customFields = await CustomField.find().exec()
    res.status(200).json(customFields)
  } catch (e) {
    sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiCreate (req, res) {
  try {
    let newCustomField = await new CustomField(req.body).save()
    res.status(200).json(newCustomField)
  } catch (e) {
    if (e.name === 'ValidationError')
      sendError(403, 'Validation Error', e, res)
    else if (e.code === 11000)
      sendError(409, 'Duplicated Name', e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiRead (req, res) {
  try {
    const foundCustomField = await CustomField.findById(req.params.id).exec()
    if (!foundCustomField) {
      let notFoundError = new Error(`CustomField ${req.params.id} not found`)
      notFoundError.name = 'NotFoundError'
      throw notFoundError
    }

    res.status(200).json(foundCustomField)
  } catch(e) {
    if (e.name === 'NotFoundError')
      sendError(404, `CustomField with id: ${req.params.id}, not found`, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiRemove (req, res) {
  try {
    const removedCustomField = await CustomField.findByIdAndRemove(req.params.id).exec()

    if (!removedCustomField) {
      let notFoundError = new Error(`CustomField ${req.params.id} not found`)
      notFoundError.name = "NotFoundError"
      throw notFoundError
    }

    res.status(200).json(removedCustomField)
  } catch (e) {
    if (e.name === 'CastError' || e.name === 'NotFoundError')
      sendError(404, `CustomField with id: ${req.params.id}, not found`, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiUpdate (req, res) {
  try {
    const updatedCustomField = await CustomField.findByIdAndUpdate(req.params.id, req.body, {new: true}).exec()

    res.status(200).json(updatedCustomField)
  } catch (e) {

    if (e.name === 'ValidationError')
      sendError(403, 'Validation Error', e, res)
    else if (e.name === 'CastError')
      sendError(404, `CustomField with id: ${req.params.id}, not found`, e, res)
    else if (e.code === 11000)
      sendError(409, 'Duplicated Name', e, res)
    else
      sendError(500, 'Unexpected Error', e, res)

  }
}
