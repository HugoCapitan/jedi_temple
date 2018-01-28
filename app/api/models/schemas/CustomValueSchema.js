const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CustomValueSchema = new Schema({
  value: {
    type: String,
    required: true
  }
})

module.exports = CustomValueSchema
