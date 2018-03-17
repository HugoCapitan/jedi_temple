const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  store: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    required: true
  },
  created_at: Date,
  updated_at: Date
})

const Message = mongoose.model('Message', MessageSchema)

module.exports = Message

