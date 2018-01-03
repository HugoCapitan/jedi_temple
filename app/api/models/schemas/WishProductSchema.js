const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = new Schema({
  product_id: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  added_at: Date
})