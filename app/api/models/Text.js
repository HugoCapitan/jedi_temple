const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TextSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  created_at: Date,
  updated_at: Date
})

TextSchema.pre('save', (next) => {
  next()
})

const Text = mongoose.model('Text', TextSchema)

module.exports = Text
