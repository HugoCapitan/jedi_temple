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

MessageSchema._middlewareFuncs = {
  preSave(next) {
    const currentDate = new Date()

    this.updated_at = currentDate
    if (!this.created_at) this.created_at = currentDate

    if (this.isNew) this.read = false

    next()
  },
  preUpdate(next) {
    this._update.updated_at = new Date()

    next()
  }
}

MessageSchema.pre('save', MessageSchema._middlewareFuncs.preSave)
MessageSchema.pre('update', MessageSchema._middlewareFuncs.preUpdate)
MessageSchema.pre('findOneAndUpdate', MessageSchema._middlewareFuncs.preUpdate)

const Message = mongoose.model('Message', MessageSchema)

module.exports = Message

