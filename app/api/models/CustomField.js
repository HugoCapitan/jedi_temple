const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { saysString, saysNumber, isNumeric, areMinMax } = require('../utils/validators')

const CustomFieldSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    unique: true
  },
  show: {
    type: Boolean,
    required: true
  },
  type: {
    type: String,
    required: true,
    validate(val) {
      return val === 'number' || val === 'string'
    }
  },
  values: {
    type: [{
      type: String,
      validate(val) { return val != '' }
    }],
    required() { return saysString(this.type) },
    validate(val) { return saysString(this.type) && val.length },
    default: undefined
  },
  min: {
    type: String,
    required() { return saysNumber(this.type) },
    validate(val) {
      return saysNumber(this.type) && (isNumeric(val) || val === 'auto') && areMinMax(val, this.max)
    }
  },
  max: {
    type: String,
    required() { return saysNumber(this.type) },
    validate(val) { 
      return saysNumber(this.type) && (isNumeric(val) || val === 'auto') && areMinMax(this.min, val)
    } 
  },
  unit: {
    type: String,
    required() { return saysNumber(this.type) },
    validate(val) { return saysNumber(this.type) }
  },
  unit_place: {
    type: String,
    required() { return saysNumber(this.type) },
    validate(val) {
      return saysNumber(this.type) && (val === 'before' || val === 'after')
    }
  },
  created_at: Date,
  updated_at: Date
})

CustomFieldSchema.pre('save', (next) => {
  next()
})

const CustomField = mongoose.model('CustomField', CustomFieldSchema)

module.exports = CustomField