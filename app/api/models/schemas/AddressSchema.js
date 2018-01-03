const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = new Schema({
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
  }
})