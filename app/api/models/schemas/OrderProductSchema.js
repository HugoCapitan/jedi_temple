const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = new Schema({
  product_code: {
    type: String,
    required: true,
    unique: true
  },
  product_price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
})
