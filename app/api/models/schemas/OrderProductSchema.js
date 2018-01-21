const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = new Schema({
  code: { // Original ID
    type: Schema.Types.ObjectId,
    rel: 'Product',
    required: true
  },
  name: String,
  quantity: Number,
  price: Number,
  customs: [{
    key: String,
    value: String
  }]
})
