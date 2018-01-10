const Order = require('../models/Order')

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

async function create(newOrder) {
  try {
    const addedOrder = await new Order(newOrder).save()
    return addedOrder
  } catch (e) {
    e.customOrigin = 'Order'
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
    const deletedOrder = await Order.findByIdAndRemove(id)
    return deletedOrder
  } catch (e) {
    e.customOrigin = 'Order'
    if (e.name === 'CastError')
      e.customMessage = `Order ${id} not found`
    else
      e.customMessage = 'Unexpected Error'

    throw e
  }
}

async function update(id, newOrder) {
  try {
    await Order.find ({_id: slug}, newOrder)
    const updatedOrder = await Order.findById(id)
    return updatedOrder
  } catch (e) {
    e.customOrigin = 'Order'
    if (e.name === 'ValidationError')
      e.customMessage = 'Validation Error'
    else if (e.name === "CastError")
      e.customMessage = `Order ${id} not found`
    else if (e.code === 11000)
      e.customMessage = 'Duplicated Name'
    else
      e.customMessage = 'Unexpected Error'
    
    throw e
  }
}

async function apiAll(req, res) {
  try {
    let all = await Order.find()
    res.status(200).json(all)
  } catch (e) {
    sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiCreate(req, res) {
  try {
    let newOrder = await new Order(req.body).save()
    res.status(200).json(newOrder)
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
    const foundOrder = await Order.findById(req.params.id)
    if (!foundOrder) {
      let notFoundError = new Error(`Order ${req.params.id} not found`)
      notFoundError.name = 'NotFoundError'
      throw notFoundError
    }

    res.status(200).json(foundOrder)
  } catch(e) {
    if (e.name === 'NotFoundError')
      sendError(404, `Order ${req.params.id} not found`, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiRemove(req, res) {
  try {
    const removedOrder = await Order.findByIdAndRemove(req.params.id)

    if (!removedOrder) {
      let notFoundError = new Error(`Order ${req.params.id} not found`)
      notFoundError.name = "NotFoundError"
      throw notFoundError
    }

    res.status(200).send(`Order ${removedOrder._id} deleted`)
  } catch (e) {
    if (e.name === 'CastError' || e.name === 'NotFoundError')
      sendError(404, `Order ${req.params.id} not found`, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiUpdate(req, res) {
  try {
    await Order.findByIdAndUpdate(req.params.id, req.body)
    const updatedOrder = await Order.findById(req.params.id)

    res.status(200).json(updatedOrder)
  } catch (e) {
    if (e.name === 'ValidationError')
      sendError(403, 'Validation Error', e, res)
    else if (e.name === 'CastError')
      sendError(404, `Order ${req.params.id} not found`, e, res)
    else if (e.code === 11000)
      sendError(409, 'Duplicated Name', e, res)
    else
      sendError(500, 'Unexpected Error', e, res)

  }
}
