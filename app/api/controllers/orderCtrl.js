const Order = require('../models/Order')

const { sendError } = require('../utils/http')

module.exports = {
  apiAll, 
  apiCreate, 
  apiRead, 
  apiRemove, 
  apiUpdate,

  apiUpdateBillingAddress,
  apiUpdateShippingAddress,

  apiAddProduct,
  apiRemoveProduct
}

async function apiAll(req, res) {
  try {
    let all = await Order.find().exec()
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
    const foundOrder = await Order.findById(req.params.id).exec()
    if (!foundOrder) {
      let notFoundError = new Error(`Order with id: ${req.params.id}, not found`)
      notFoundError.name = 'NotFoundError'
      throw notFoundError
    }

    res.status(200).json(foundOrder)
  } catch(e) {
    if (e.name === 'NotFoundError')
      sendError(404, e.message, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiRemove(req, res) {
  try {
    const removedOrder = await Order.findByIdAndRemove(req.params.id).exec()

    res.status(200).json(removedOrder)
  } catch (e) {
    if (e.name === 'CastError' || e.name === 'NotFoundError')
      sendError(404, `Order with id: ${req.params.id}, not found`, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiUpdate(req, res) {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, {new: true}).exec()

    res.status(200).json(updatedOrder)
  } catch (e) {
    if (e.name === 'ValidationError')
      sendError(403, 'Validation Error', e, res)
    else if (e.name === 'CastError')
      sendError(404, `Order with id: ${req.params.id}, not found`, e, res)
    else if (e.code === 11000)
      sendError(409, 'Duplicated Name', e, res)
    else
      sendError(500, 'Unexpected Error', e, res)

  }
}

async function apiUpdateBillingAddress(req, res) {
  try {
    const orderToUpdate = await Order.findById(req.params.order_id).exec()
    if (!orderToUpdate) {
      const err = new Error(`Order with id: ${req.params.order_id}, not found`)
      err.name = 'NotFoundError'
      throw err
    }

    Object.assign(orderToUpdate.billing_address, req.body)
    await orderToUpdate.save()
    res.status(200).json(orderToUpdate)
  } catch (e) {
    if (e.name === 'ValidationError')
      sendError(403, 'Validation Error', e, res)
    else if (e.name === 'NotFoundError')
      sendError(404, e.message, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
} 

async function apiUpdateShippingAddress(req, res) {
  try {
    const orderToUpdate = await Order.findById(req.params.order_id).exec()
    if (!orderToUpdate) {
      const err = new Error(`Order with id: ${req.params.order_id}, not found`)
      err.name = 'NotFoundError'
      throw err
    }

    Object.assign(orderToUpdate.shipping_address, req.body)
    await orderToUpdate.save()
    res.status(200).json(orderToUpdate)
  } catch (e) {
    if (e.name === 'ValidationError')
      sendError(403, 'Validation Error', e, res)
    else if (e.name === 'NotFoundError')
      sendError(404, e.message, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiAddProduct(req, res) {

}

async function apiRemoveProduct(req, res) {

}
