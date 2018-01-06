const mongoose = require('mongoose')
const Schema = mongoose.Schema

const WishSchema = require('./schemas/WishSchema')

const ClientSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    set(val) {
      // Encript
      return val
    }
  },
  addresses: [{
    type: Schema.Types.ObjectId,
    rel: 'Address'
  }],
  orders:[{
    type: Schema.Types.ObjectId,
    rel: 'Order'
  }],
  wishlist: [{
    type: Schema.Types.ObjectId,
    rel: 'Product'
  }],
  created_at: Date,
  updated_at: Date
})

ClientSchema.pre('save', (next) => {
  var currentDate = new Date()

  this.updated_at = currentDate

  if (!this.created_at) 
    this.created_at = currentDate

  next()
})

const Client = mongoose.model('Client', ClientSchema)

module.exports = Client
