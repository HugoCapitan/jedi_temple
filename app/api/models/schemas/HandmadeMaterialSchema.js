const mongoose = require('mongoose')
const { Schema } = mongoose

module.exports = new Schema({
  product_id: {
    type: Schema.Types.ObjectI,
    rel: 'Product',
    required: true,
    unique: true
  },
  material: {
    type: String,
    required: true,
    unique: true
  }
})
