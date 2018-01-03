const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = new Schema({
  custom_id: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  value: {
    type: String,
    required: true
  }
})
