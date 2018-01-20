const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  models: [String]
})
