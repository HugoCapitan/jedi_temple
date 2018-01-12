const mongoose = require('mongoose')
const _ = require('lodash')
const Schema = mongoose.Schema

const CustomValueSchema = require('./schemas/CustomValueSchema')

const Product = require('./Product')

const { saysString, saysNumber, isNumeric, areMinMax } = require('../utils/validators')
const { slugify } =  require('../utils')

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
  filter: {
    type: Boolean,
    required: true,
    default: false
  },
  type: {
    type: String,
    required: true,
    enum: ['number', 'string']
  },
  values: {
    type: [CustomValueSchema],
    required() { return saysString(this.type) },
    validate(val) { return saysString(this.type) && val.length },
    default: undefined
  },
  _values: {
    type: [String],
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

CustomFieldSchema._middlewareFuncs = {
  async preSave(next) {
    await preSaveValidations.call(this, next)

    this.slug       = slugify(this.name)

    if (this._values.length > this.values.length) {
      const removed = this._values.find(cId => 
        !this.values.find(cVal => cVal._id == cId)
      )

      const productsToMod = await Product.find({ 'custom_values.id':  removed})
      console.log(productsToMod)
    }

    this._values    = this.values.map(val => val._id)    

    const currentDate = new Date()

    this.updated_at = currentDate
    if (!this.created_at)
      this.created_at = currentDate

    next()
  },
  preUpdate(next) {
    preUpdateValidations.call(this, next)

    const currentDate = new Date()
    this._update.updated_at = currentDate

    if (this._update.name) this._update.slug = slugify(this._update.name)

    next()
  },
  preRemove(next) {
    const productError = new Error('prod')
    productError.customOrigin = ('Product')
    next(productError)
  }
}

CustomFieldSchema.pre('save', CustomFieldSchema._middlewareFuncs.preSave)
CustomFieldSchema.pre('update', CustomFieldSchema._middlewareFuncs.preUpdate)
CustomFieldSchema.pre('findOneAndUpdate', CustomFieldSchema._middlewareFuncs.preUpdate)
CustomFieldSchema.pre('remove', CustomFieldSchema._middlewareFuncs.preRemove)
CustomFieldSchema.pre('findOneAndRemove', CustomFieldSchema._middlewareFuncs.preRemove)

const CustomField = mongoose.model('CustomField', CustomFieldSchema)

module.exports = CustomField

async function preSaveValidations(next) {
  if (!this.isNew && this.isModified('slug')) {
    let err = new Error('Slug is not updatable')
    err.name = 'ValidationError'
    next(err)
  }
  if (!this.isNew && this.isModified('type')) {
    let err = new Error('Type is not updatable')
    err.name = 'ValidationError'
    next(err)
  }
  if (!this.isNew && this.isModified('min')) {
    let err = new Error('Min should be modified via update, not save.')
    err.name = 'ValidationError'
    next(err)
  }
  if (!this.isNew && this.isModified('max')) {
    let err = new Error('Max should be modified via update, not save.')
    err.name = 'ValidationError'
    next(err)
  }
  if (this.values) {
    let valCount = this.values.reduce((acc, val) => {
      !!acc[val.value] ? ++acc[val.value] : acc[val.value] = 1
      return acc
    }, {})
    valCount = Object.values(valCount)

    if ( valCount.find(val => val > 1) ) {
      let err = new Error('Duplicated value for CustomField.values')
      err.name = 'ValidationError'
      next(err)
    }
  }
}

function preUpdateValidations(next) {
  if (this._update.hasOwnProperty('slug')) {
    err = new Error('Slug is not updatable')
    err.name = 'ValidationError'
    next(err)
  } 
  if (this._update.hasOwnProperty('type')) {
    err = new Error('Type is not updatable')
    err.name = 'ValidationError'
    next(err)
  }
}
