const _ = require('lodash')

const CustomField = require('../models/CustomField')
const productCtrl = require('./productCtrl')

const { sendError } = require('../utils/http')

module.exports = {
  create,
  remove,
  update,
  apiAll,
  apiCreate,
  apiRead,
  apiRemove,
  apiUpdate
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

    throw e
  }
}

async function remove(id) {
  try {
    const delCustomField = await CustomField.findByIdAndRemove(id)
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
    await CustomField.findByIdAndUpdate(id, newFieldObj)
    const updatedCustomField = await CustomField.findById(id)
    return updatedCustomField
  } catch (e) {
    if (e.customOrigin) throw e

    e.customOrigin = 'Field'
    if (e.name === 'ValidationError')
      e.customMessage = 'Validation Error'
    else if (e.name === 'CastError')
      e.customMessage = `CustomField ${id} not found`
    else if (e.code === 11000)
      e.customMessage = 'Duplicated Name'
    else
      e.customMessage = 'Unexpected Error'
    
    throw e
  }
}

async function apiAll(req, res) {
  try {
    let customFields = await CustomField.find()
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
    const foundCustomField = await CustomField.findById(req.params.id)
    if (!foundCustomField) {
      let notFoundError = new Error(`CustomField ${req.params.id} not found`)
      notFoundError.name = 'NotFoundError'
      throw notFoundError
    }

    res.status(200).json(foundCustomField)
  } catch(e) {
    if (e.name === 'NotFoundError')
      sendError(404, `CustomField ${req.params.id} not found`, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiRemove (req, res) {
  try {
    const removedCustomField = await CustomField.findByIdAndRemove(req.params.id)

    if (!removedCustomField) {
      let notFoundError = new Error(`CustomField ${req.params.id} not found`)
      notFoundError.name = "NotFoundError"
      throw notFoundError
    }

    res.status(200).send(`CustomField ${removedCustomField._id} deleted`)
  } catch (e) {
    if (e.customOrigin === 'Product')
      sendError(500, 'Products Update Error', e, res)
    else if (e.name === 'CastError' || e.name === 'NotFoundError')
      sendError(404, `CustomField ${req.params.id} not found`, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiUpdate (req, res) {
  try {
    const oldCustomField = await CustomField.findById(req.params.id)    
    
    if (req.body.values) {
      req.body.values.forEach((newVal) => {
        !!newVal.id 
        ? oldCustomField.values.id(newVal.id).value = newVal.value
        : oldCustomField.values.push({ value: newVal.value })
      })

      delete req.body.values
    }
    
    Object.assign( oldCustomField, req.body )

    const updatedCustomField = await oldCustomField.save()

    res.status(200).json(updatedCustomField)
  } catch (e) {

    if (e.customOrigin === 'Product') 
      sendError(500, 'Products Update Error', e, res)
    else if (e.name === 'ValidationError')
      sendError(403, 'Validation Error', e, res)
    else if (e.name === 'CastError')
      sendError(404, `CustomField ${req.params.id} not found`, e, res)
    else if (e.code === 11000)
      sendError(409, 'Duplicated Name', e, res)
    else
      sendError(500, 'Unexpected Error', e, res)

  }
}
