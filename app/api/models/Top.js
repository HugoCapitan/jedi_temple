const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TopSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  store: {
    type: String,
    required: true
  },
  time: Number,
  priority: Number,
  created_at: Date,
  updated_at: Date
})

const Top = mongoose.model('Top', TopSchema)

module.exports = Top

