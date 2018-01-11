const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = new Schema({
  custom_id: {
    type: Schema.Types.ObjectId,
    rel: 'CustomField',
    required: true
  },
  value_id: {
    type: String,
    required: true
  }
})
