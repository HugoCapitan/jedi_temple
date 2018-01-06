const mongoose = require('mongoose')
const { Schema } = mongoose

module.exports = new Schema({
  material_name: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  products: [{
    type: Schema.Types.ObjectId,
    rel: 'Product',
    required: true,
    unique: true
  }]
})
