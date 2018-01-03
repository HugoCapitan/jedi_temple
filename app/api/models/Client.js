const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AddressSchema = require('./schemas/AddressSchema')
const WishProductSchema = require('./schemas/WishProductSchema')

const ClientSchema = new Schema({
  name: String,
  mail: String,
  addresses: [AddressSchema],
  orders:[{
    type: Schema.Types.ObjectId,
    rel: 'Order'
  }],
  wishlist: [WishedProductSchema],
  created_at: Date,
  updated_at: Date
})

ClientSchema.pre('save', (next) => {
  next()
})

const Client = mongoose.model('Client', ClientSchema)

module.exports = Client
