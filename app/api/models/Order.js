const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AddressSchema      = require('./schemas/AddressSchema')
const OrderProductSchema = require('./schemas/OrderProductSchema')

const { createOrdercode } = require('../utils/models')
const { isEmail }m        = require('../utils/validators') 

const OrderSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate: isEmail
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

OrderSchema.pre('save', (next) => {
  var currentDate = new Date()

  this.updated_at = currentDate

  if (!this.created_at) 
    this.created_at = currentDate

  if (!this.order_code)
    this.order_code = createOrdercode(currentDate)

  next()
})

const Order = mongoose.model('Order', OrderSchema)

module.exports = Order
