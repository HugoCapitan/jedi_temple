const mongoose = require('mongoose')
const { Schema } = mongoose

module.exports = new Schema({
  material: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  models: [{
    type: String,
    unique: true
  }]
})
