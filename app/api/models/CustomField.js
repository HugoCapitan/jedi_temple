const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
    required() { return saysString.call(this) },
    validate(val) { return saysString.call(this) && val.length },
    default: undefined
  },
  min: {
    type: String,
    required() { return saysNumber.call(this) },
    validate(val) {
      return saysNumber.call(this) && (isNumeric(val) || val === 'auto') && isMaxBigger(val, this.max)
    }
  },
  max: {
    type: String,
    required() { return saysNumber.call(this) },
    validate(val) { 
      return saysNumber.call(this) && (isNumeric(val) || val === 'auto') && isMaxBigger(this.min, val)
    } 
  },
  unit: {
    type: String,
    required() { return saysNumber.call(this) },
    validate(val) { return saysNumber.call(this) }
  },
  unit_place: {
    type: String,
    required() { return saysNumber.call(this) },
    validate(val) {
      return saysNumber.call(this) && (val === 'before' || val === 'after')
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

function isMaxBigger(min, max) {
  return parseFloat(min) < parseFloat(max) || min === 'auto' || max === 'auto'
}

function saysNumber() {
  return this.type === 'number'
}

function saysString() {
  return this.type === 'string'
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}