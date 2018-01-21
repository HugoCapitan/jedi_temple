const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = new Schema({
  name: {
    type: String,
    required: true
  },
  code: { // Original ID
    type: Schema.Types.ObjectId,
    rel: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  customs: [{
    key: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  }]
})
