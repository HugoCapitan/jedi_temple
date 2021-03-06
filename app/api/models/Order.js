const _ = require('lodash')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const Product = require('./Product')
const CustomField = require('./CustomField')

const AddressSchema      = require('./schemas/AddressSchema')
const OrderProductSchema = require('./schemas/OrderProductSchema')

const uModels = require('../utils/models')
const validate = require('../utils/validators')

const statuses = [
  'Pending', 'Awaiting Payment', 'Awaiting Fulfillment', 'Awaiting Shipment', 'Awaiting Pickup',
  'Partially Shipped', 'Completed', 'Shipped', 'Cancelled', 'Declined', 'Refunded', 'Disputed',
  'Verification Required', 'Partially Refunded'
]

const OrderSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate: validate.isEmail
  },
  order_code: {
    type: String,
    unique: true
  },
  store: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: statuses,
    required: true
  },
  payment_method: {
    type: String,
    required: true
  },
  payment_id: String,
  products: {
    type: [OrderProductSchema],
    default: undefined,
    required: true,
    validate(val) { return val.length }
  },
  shipping: {
    type: Number,
    required: true
  },
  billing_address: {
    type: AddressSchema,
    required: true
  },
  shipping_address: {
    type: AddressSchema,
    required: true
  },
  tracking_code: String,
  created_at: Date,
  updated_at: Date
})

OrderSchema._middlewareFuncs = {
  preSave(next) {
    const self = this

    if (self.isModified('order_code')) {
      const err = new Error('Order code is read-only')
      err.name = 'ValidationError'
      return next(err)
    }

    const populations = self.products.map(handleProductPopulation)    
    Promise.all(populations)
    .then(results => {
      self.products = results
      const currentDate = new Date()
      self.updated_at = currentDate
      if (!self.created_at) self.created_at = currentDate 
      if (!self.order_code) self.order_code = uModels.createOrdercode(currentDate)

      return next()
    })
    .catch(e => next(e))

  },
  preUpdate(next) {
    const self = this

    if (self._update.hasOwnProperty('order_code')) {
      const err = new Error('order_code is read only')
      err.name = 'Validation Error'
      return next(err)
    }

    let populations = self._update.hasOwnProperty('products')
      ? self._update.products.map(handleProductPopulation)
      : []

    Promise.all(populations)
    .then(results => {
      if (results.length) self._update.products = results

      self._update.updated_at = new Date()

      return next()
    }) 
    .catch(e => next(e))
  }
}

OrderSchema.pre('save', OrderSchema._middlewareFuncs.preSave)
OrderSchema.pre('update', OrderSchema._middlewareFuncs.preUpdate)
OrderSchema.pre('findOneAndUpdate', OrderSchema._middlewareFuncs.preUpdate)

const Order = mongoose.model('Order', OrderSchema)

module.exports = Order

function handleProductPopulation(orderProduct) {
  return new Promise((resolve, reject) => {
    if (orderProduct.is_populated) resolve(orderProduct)
    
    Product.findById(orderProduct.code).exec()
    .then(fullProduct => {
      if (!fullProduct) reject(new Error('Product not found'))

      const cQueries = fullProduct.customs.map(c => CustomField.findById(c.custom_id).exec())

      Promise.all(cQueries)
      .then(customsObjects => {        
        orderProduct.customs = customsObjects.map(customObject => {
          const fullProductCustom = fullProduct.customs.find(custom => _.isEqual(custom.custom_id, customObject._id))
          const key = customObject.name
          let value
    
          if (customObject.type === 'string') 
            value = customObject.values.find(value => _.isEqual(value._id, new ObjectId(fullProductCustom.value))).value
          else 
            value = customObject.unit_place === 'before' 
              ? `${customObject.unit}${fullProductCustom.value}` 
              : `${fullProductCustom.value}${customObject.unit}`

          return { key, value }
        })

        orderProduct.name         = fullProduct.name
        orderProduct.price        = fullProduct.price
        orderProduct.is_populated = true
    
        resolve(orderProduct)
      })
      .catch(reject)
    })
    .catch(reject)
  })
}
