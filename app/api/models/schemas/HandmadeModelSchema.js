const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = new Schema({
  model_name: {
    type: String,
    required: true
  },
  material_id: {
    type: Schema.Types.ObjectId,
    required: true
  }
})
