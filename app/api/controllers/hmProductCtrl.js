const HMProduct = require('../models/HMProduct')

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
    let all = await HMProduct.find().exec()
    res.status(200).json(all)
  } catch (e) {
    sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiCreate(req, res) {
  try {
    let newHMProduct = await new HMProduct(req.body).save()
    res.status(200).json(newHMProduct)
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
    const foundHMProduct = await HMProduct.findById(req.params.id).exec()
    if (!foundHMProduct) {
      let notFoundError = new Error(`HMProduct ${req.params.id} not found`)
      notFoundError.name = 'NotFoundError'
      throw notFoundError
    }

    res.status(200).json(foundHMProduct)
  } catch(e) {
    if (e.name === 'NotFoundError')
      sendError(404, `HMProduct with id: ${req.params.id}, not found`, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiRemove(req, res) {
  try {
    const removedHMProduct = await HMProduct.findByIdAndRemove(req.params.id).exec()

    if (!removedHMProduct) {
      let notFoundError = new Error(`HMProduct ${req.params.id} not found`)
      notFoundError.name = "NotFoundError"
      throw notFoundError
    }

    res.status(200).json(removedHMProduct)
  } catch (e) {
    if (e.name === 'CastError' || e.name === 'NotFoundError')
      sendError(404, `HMProduct with id: ${req.params.id}, not found`, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiUpdate(req, res) {
  try {
    const specialUpdate = {}
    if (req.body.name) specialUpdate.name = req.body.name
    delete req.body.name

    let updatedHMProduct = await HMProduct.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec()
    
    Object.assign(updatedHMProduct, specialUpdate)
    updatedHMProduct = await updatedHMProduct.save()

    res.status(200).json(updatedHMProduct)
  } catch (e) {
    if (e.name === 'ValidationError')
      sendError(403, 'Validation Error', e, res)
    else if (e.name === 'CastError')
      sendError(404, `HMProduct with id: ${req.params.id}, not found`, e, res)
    else if (e.code === 11000)
      sendError(409, 'Duplicated Name', e, res)
    else
      sendError(500, 'Unexpected Error', e, res)

  }
}
