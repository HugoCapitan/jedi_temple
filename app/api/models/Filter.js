const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FilterSchema = new Schema({
  custom_id: {
    type: Schema.Types.ObjectId,
    required: true,
    rel: 'CustomField',
    unique: true
  },
  created_at: Date,
  updated_at: Date
})

FilterSchema.pre('save', (next) => {
  next()
})

const Filter = mongoose.model('Filter', FilterSchema)

module.exports = Filter
