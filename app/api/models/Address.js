const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AddressSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  address_line_1: {
    type: String,
    required: true
  },
  address_line_2: {
    type: String,
    required: false
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  zip: {
    type: Number,
    required: true
  },
  created_at: Date,
  updated_at: Date
})

AddressSchema.pre('save', (next) => {
  const currentDate = new Date()

  this.updated_at = currentDate

  if (!this.created_at) this.created_at = currentDate

  next()
})

const Address = mongoose.model('Address', AddressSchema)

module.exports = Address
