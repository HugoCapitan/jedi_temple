const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = new Schema({
  products_id: {
    type: Schema.Types.ObjectId,
    rel: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
})