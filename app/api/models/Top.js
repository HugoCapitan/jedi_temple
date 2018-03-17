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

TopSchema._middlewareFuncs = {
  preSave(next) {
    const currentDate = new Date()
    updated_at = currentDate
    if (!this.created_at) this.created_at = currentDate

    next()
  },
  preUpdate(next) {
    this._update.updated_at = new Date()

    next()
  }
}

const Top = mongoose.model('Top', TopSchema)

module.exports = Top

