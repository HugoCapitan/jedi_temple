const HMProduct = require('../models/HMProduct')

const { sendError } = require('../utils/http')

module.exports = {
  create, 
  remove, 
  update,

  apiAll, 
  apiCreate, 
  apiRead, 
  apiRemove, 
  apiUpdate,

  apiCreateMaterial,
  apiRemoveMaterial,
  apiUpdateMaterial,

  apiCreateModel,
  apiRemoveModel,
  apiUpdateModel
}

async function create(newHMProduct) {
  try {
    const addedHMProduct = await new HMProduct(newHMProduct).save()
    return addedHMProduct
  } catch (e) {
    e.customOrigin = 'HMProduct'
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
    const deletedHMProduct = await HMProduct.findByIdAndRemove(id)
    return deletedHMProduct
  } catch (e) {
    e.customOrigin = 'HMProduct'
    if (e.name === 'CastError')
      e.customMessage = `HMProduct ${id} not found`
    else
      e.customMessage = 'Unexpected Error'

    throw e
  }
}

async function update(id, newHMProduct) {
  try {
    await HMProduct.find ({_id: slug}, newHMProduct)
    const updatedHMProduct = await HMProduct.findById(id)
    return updatedHMProduct
  } catch (e) {
    e.customOrigin = 'HMProduct'
    if (e.name === 'ValidationError')
      e.customMessage = 'Validation Error'
    else if (e.name === "CastError")
      e.customMessage = `HMProduct ${id} not found`
    else if (e.code === 11000)
      e.customMessage = 'Duplicated Name'
    else
      e.customMessage = 'Unexpected Error'
    
    throw e
  }
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
    const updatedHMProduct = await HMProduct.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec()

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

async function apiCreateMaterial(req, res) {
  try {
    const hmProductToUpdate = await HMProduct.findById(req.params.hmproduct_id).exec()

    if (!hmProductToUpdate) {
      let notFoundError = new Error(`HMProduct ${req.params.hmproduct_id} not found`)
      notFoundError.name = 'NotFoundError'
      throw notFoundError
    }

    hmProductToUpdate.materials.push(req.body)
    await hmProductToUpdate.save()

    res.status(200).json(hmProductToUpdate)
  } catch (e) {
    if (e.name === 'NotFoundError')
      sendError(404, `HMProduct with id: ${req.params.hmproduct_id}, not found`, e, res)
    else if (e.name === 'ValidationError')
      sendError(403, 'Validation Error', e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiRemoveMaterial(req, res) {}

async function apiUpdateMaterial(req, res) {}


async function apiCreateModel(req, res) {}

async function apiRemoveModel(req, res) {}

async function apiUpdateModel(req, res) {}
