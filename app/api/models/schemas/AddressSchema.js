const mongoose = require('mongoose')
const Schema = mongoose.Schema

const { isEmail } = require('../../utils/validators')

const AddressSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    validate: isEmail
  },
  address_line_1: {
    type: String,
    required: true
  },
  address_line_2: String,
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
  }
})

module.exports = AddressSchema
