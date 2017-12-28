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
    validate: function (val) {
      return isNumber(val) || isString(val);
    }
  },
  values: {
    type: Array,
    required: isString.bind(this)
  },
  min: {
    type: String,
    required: isNumber.bind(this)
  },
  max: {
    type: String,
    required: isNumber.bind(this)
  },
  unit: {
    type: String,
    required: isNumber.bind(this),
    validate: isNumber.bind(this)
  },
  unit_place: {
    type: String,
    required: isNumber.bind(this),
    validate(val) {
      return isNumber(this.type) && (val === 'before' || val === 'after')
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

function isNumber(val) {
  if (val) return val === 'number'
  
  return this.type === 'number'
}

function isString(val) {
  if (val) return val === 'string'
  
  return this.type === 'string'
}