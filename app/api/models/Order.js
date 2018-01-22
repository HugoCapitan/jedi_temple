const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Product = require('./Product')
const CustomField = require('./CustomField')

const AddressSchema      = require('./schemas/AddressSchema')
const OrderProductSchema = require('./schemas/OrderProductSchema')

const uModels = require('../utils/models')
const validate = require('../utils/validators') 

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
  status: {
    type: Number,
    required: true
  },
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
    var currentDate = new Date()

    self.updated_at = currentDate

    if (!self.created_at) 
      self.created_at = currentDate

    if (!self.order_code)
      self.order_code = uModels.createOrdercode(currentDate)

    
    const populations = []
    for (const product of self.products)
      populations.push( handleProductPopulation(product) )
    
    Promise.all(populations)
    .then(results => {
      return next()
    })
    .catch(e => next(e))

  },
  preUpdate(next) {
    return next()
  },
  preRemove(next) {
    return next()
  }
}

OrderSchema.pre('save', OrderSchema._middlewareFuncs.preSave)
OrderSchema.pre('update', OrderSchema._middlewareFuncs.preUpdate)
OrderSchema.pre('findOneAndUpdate', OrderSchema._middlewareFuncs.preUpdate)
OrderSchema.pre('remove', OrderSchema._middlewareFuncs.preRemove)
OrderSchema.pre('findOneAndUpdate', OrderSchema._middlewareFuncs.preRemove)

const Order = mongoose.model('Order', OrderSchema)

module.exports = Order

function handleProductPopulation(orderProduct) {
  return new Promise((resolve, reject) => {
    if (orderProduct.is_populated) resolve(orderProduct)
    
    Product.findById(orderProduct.code).exec()
    .then(fullProduct => {
      if (!fullProduct) reject(new Error('Product not found'))

      const cQueries = []
      for (const c of fullProduct.customs) {
        cQueries.push(
          CustomField.findById(c.custom_id).exec()
        )
      }

      Promise.all(cQueries)
      .then(customsObjects => {
        orderProduct.customs = customsObjects.map(customObject => {
          const fullProductCustom = fullProduct.customs.find({ custom_id: customObject._id })
          const key = customObject.name
          let value
    
          if (customObject.type === 'string') 
            value = customObject.values.find({ _id: fullProductCustom.value }).value
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
