const Product = require('../models/Product')

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

async function create(newProduct) {
  try {
    const addedProduct = await new Product(newProduct).save()
    return addedProduct
  } catch (e) {
    e.customOrigin = 'Product'
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
    const deletedProduct = await Product.findByIdAndRemove(id)
    return deletedProduct
  } catch (e) {
    e.customOrigin = 'Product'
    if (e.name === 'CastError')
      e.customMessage = `Product ${id} not found`
    else
      e.customMessage = 'Unexpected Error'

    throw e
  }
}

async function update(id, newProduct) {
  try {
    await Product.find ({_id: slug}, newProduct)
    const updatedProduct = await Product.findById(id)
    return updatedProduct
  } catch (e) {
    e.customOrigin = 'Product'
    if (e.name === 'ValidationError')
      e.customMessage = 'Validation Error'
    else if (e.name === "CastError")
      e.customMessage = `Product ${id} not found`
    else if (e.code === 11000)
      e.customMessage = 'Duplicated Name'
    else
      e.customMessage = 'Unexpected Error'
    
    throw e
  }
}

async function apiAll(req, res) {
  try {
    let all = await Product.find()
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
    const foundProduct = await Product.findById(req.params.id)
    if (!foundProduct) {
      let notFoundError = new Error(`Product ${req.params.id} not found`)
      notFoundError.name = 'NotFoundError'
      throw notFoundError
    }

    res.status(200).json(foundProduct)
  } catch(e) {
    if (e.name === 'NotFoundError')
      sendError(404, `Product ${req.params.id} not found`, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiRemove(req, res) {
  try {
    const removedProduct = await Product.findByIdAndRemove(req.params.id)

    if (!removedProduct) {
      let notFoundError = new Error(`Product ${req.params.id} not found`)
      notFoundError.name = "NotFoundError"
      throw notFoundError
    }

    res.status(200).send(`Product ${removedProduct._id} deleted`)
  } catch (e) {
    if (e.name === 'CastError' || e.name === 'NotFoundError')
      sendError(404, `Product ${req.params.id} not found`, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiUpdate(req, res) {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body)
    const updatedProduct = await Product.findById(req.params.id)

    res.status(200).json(updatedProduct)
  } catch (e) {
    if (e.name === 'ValidationError')
      sendError(403, 'Validation Error', e, res)
    else if (e.name === 'CastError')
      sendError(404, `Product ${req.params.id} not found`, e, res)
    else if (e.code === 11000)
      sendError(409, 'Duplicated Name', e, res)
    else
      sendError(500, 'Unexpected Error', e, res)

  }
}
