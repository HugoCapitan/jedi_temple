const Product = require('../models/Product')

const { sendError } = require('../utils/http')

module.exports = {
  apiAll, 
  apiCreate, 
  apiRead, 
  apiRemove, 
  apiUpdate,

  apiAddCustom,
  apiRemoveCustom,
  apiUpdateCustom,

  apiAddImage,
  apiRemoveImage,
  apiUpdateImage
}

async function apiAll(req, res) {
  try {
    let all = await Product.find().exec()
    res.status(200).json(all)
  } catch (e) {
    sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiCreate(req, res) {
  try {
    let newProduct = await new Product(req.body).save()
    res.status(200).json(newProduct)
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
    const foundProduct = await Product.findById(req.params.id).exec()
    if (!foundProduct) {
      let notFoundError = new Error(`Product with id: ${req.params.id}, not found`)
      notFoundError.name = 'NotFoundError'
      throw notFoundError
    }

    res.status(200).json(foundProduct)
  } catch(e) {
    if (e.name === 'NotFoundError')
      sendError(404, e.message, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiRemove(req, res) {
  try {
    const removedProduct = await Product.findByIdAndRemove(req.params.id).exec()

    if (!removedProduct) {
      let notFoundError = new Error(`Product with id: ${req.params.id}, not found`)
      notFoundError.name = "NotFoundError"
      throw notFoundError
    }

    res.status(200).send(removedProduct)
  } catch (e) {
    if (e.name === 'CastError' || e.name === 'NotFoundError')
      sendError(404, `Product with id: ${req.params.id}, not found`, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiUpdate(req, res) {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true}).exec()
    res.status(200).json(updatedProduct)
  } catch (e) {
    if (e.name === 'ValidationError')
      sendError(403, 'Validation Error', e, res)
    else if (e.name === 'CastError')
      sendError(404, `Product with id: ${req.params.id}, not found`, e, res)
    else if (e.code === 11000)
      sendError(409, 'Duplicated Name', e, res)
    else
      sendError(500, 'Unexpected Error', e, res)

  }
}
