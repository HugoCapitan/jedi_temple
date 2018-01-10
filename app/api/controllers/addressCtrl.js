const Address = require('../models/Address')

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

async function create(newAddress) {
  try {
    const addedAddress = await new Address(newAddress).save()
    return addedAddress
  } catch (e) {
    e.customOrigin = 'Address'
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
    const deletedAddress = await Address.findByIdAndRemove(id)
    return deletedAddress
  } catch (e) {
    e.customOrigin = 'Address'
    if (e.name === 'CastError')
      e.customMessage = `Address ${id} not found`
    else
      e.customMessage = 'Unexpected Error'

    throw e
  }
}

async function update(id, newAddress) {
  try {
    await Address.find ({_id: slug}, newAddress)
    const updatedAddress = await Address.findById(id)
    return updatedAddress
  } catch (e) {
    e.customOrigin = 'Address'
    if (e.name === 'ValidationError')
      e.customMessage = 'Validation Error'
    else if (e.name === "CastError")
      e.customMessage = `Address ${id} not found`
    else if (e.code === 11000)
      e.customMessage = 'Duplicated Name'
    else
      e.customMessage = 'Unexpected Error'
    
    throw e
  }
}

async function apiAll(req, res) {
  try {
    let all = await Address.find()
    res.status(200).json(all)
  } catch (e) {
    sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiCreate(req, res) {
  try {
    let newAddress = await new Address(req.body).save()
    res.status(200).json(newAddress)
  } catch (e) {
    if (e.name === 'ValidationError')
      sendError(403, 'Validation Error', e, res)
    else if (e.code === 11000)
      sendError(409, 'Duplicated Name', e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiRead(req, res) {
  try {
    const foundAddress = await Address.findById(req.params.id)
    if (!foundAddress) {
      let notFoundError = new Error(`Address ${req.params.id} not found`)
      notFoundError.name = 'NotFoundError'
      throw notFoundError
    }

    res.status(200).json(foundAddress)
  } catch(e) {
    if (e.name === 'NotFoundError')
      sendError(404, `Address ${req.params.id} not found`, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiRemove(req, res) {
  try {
    const removedAddress = await Address.findByIdAndRemove(req.params.id)

    if (!removedAddress) {
      let notFoundError = new Error(`Address ${req.params.id} not found`)
      notFoundError.name = "NotFoundError"
      throw notFoundError
    }

    res.status(200).send(`Address ${removedAddress._id} deleted`)
  } catch (e) {
    if (e.name === 'CastError' || e.name === 'NotFoundError')
      sendError(404, `Address ${req.params.id} not found`, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiUpdate(req, res) {
  try {
    await Address.findByIdAndUpdate(req.params.id, req.body)
    const updatedAddress = await Address.findById(req.params.id)

    res.status(200).json(updatedAddress)
  } catch (e) {
    if (e.name === 'ValidationError')
      sendError(403, 'Validation Error', e, res)
    else if (e.name === 'CastError')
      sendError(404, `Address ${req.params.id} not found`, e, res)
    else if (e.code === 11000)
      sendError(409, 'Duplicated Name', e, res)
    else
      sendError(500, 'Unexpected Error', e, res)

  }
}
