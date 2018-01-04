const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AddressSchema = require('./schemas/AddressSchema')
const OrderProductSchema = require('./schemas/OrderProductSchema')

const OrderSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate: utils.isAnEmail
  },
  order_code: {
    type: String,
    unique: true
  },
  client: {
    type: Schema.Types.ObjectId,
    rel: 'Client'
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
  
  

  next()
})

const Order = mongoose.model('Order', OrderSchema)

module.exports = Order
