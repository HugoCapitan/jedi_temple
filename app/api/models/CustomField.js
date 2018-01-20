const mongoose = require('mongoose')
const _ = require('lodash')
const Schema = mongoose.Schema

const CustomValueSchema = require('./schemas/CustomValueSchema')

const Product = require('./Product')
const Store = require('./Store')

const validate = require('../utils/validators')
const uCommon = require('../utils')

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
    required() { return validate.saysString(this.type) },
    validate(val) { return validate.saysString(this.type) && val.length },
    default: undefined
  },
  _values: {
    type: [String],
    validate(val) { return validate.saysString(this.type) && val.length },
    default: undefined
  },
  min: {
    type: String,
    required() { return validate.saysNumber(this.type) },
    validate(val) {
      return validate.saysNumber(this.type) && (validate.isNumeric(val) || val === 'auto') && validate.areMinMax(val, this.max)
    }
  },
  max: {
    type: String,
    required() { return validate.saysNumber(this.type) },
    validate(val) {
      return validate.saysNumber(this.type) && (validate.isNumeric(val) || val === 'auto') && validate.areMinMax(this.min, val)
    }
  },
  unit: {
    type: String,
    required() { return validate.saysNumber(this.type) },
    validate(val) { return validate.saysNumber(this.type) }
  },
  unit_place: {
    type: String,
    required() { return validate.saysNumber(this.type) },
    validate(val) {
      return validate.saysNumber(this.type) && (val === 'before' || val === 'after')
    }
  },
  created_at: Date,
  updated_at: Date
})

CustomFieldSchema._middlewareFuncs = {
  preSave(next) {
    const self = this
    const saves = []
    preSaveValidations(self, next)

    self.slug = uCommon.slugify(self.name)

    productCustomRemovedValue(self)
    .then(results => Promise.all(results))
    .then(results => {
      if (self.type === 'string') {
        self._values = self.values.map(val => val._id.toString())
      }
  
      const currentDate = new Date()
  
      self.updated_at = currentDate
      if (!self.created_at)
        self.created_at = currentDate

      return next()
    })
    .catch(err => next(err))
  },
  preUpdate(next) {
    const self = this
    preUpdateValidations(self, next)

    const currentDate = new Date()
    self._update.updated_at = currentDate

    if (self._update.name) self._update.slug = uCommon.slugify(self._update.name)

    productCustomUpdatedMinMax(self)
    .then(results => Promise.all(results))
    .then(results => next())
    .catch(err => next(err))
  },
  preRemove(next) {
    const self = this
    const saves = []            
    Product.find({
      customs: { $elemMatch: { custom_id: self._conditions._id } }
    }).exec()
    .then(productsToModify => {
      for (const product of productsToModify) {
        const customToRemove = product.customs.find(c => _.isEqual(c.custom_id, self._conditions._id))
        product.customs.pull({ _id: customToRemove._id })
        saves.push(product.save())
      }

      return Store.find({ customs: self._conditions._id }).exec()
    })
    .then(storesToModify => {
      for (const store of storesToModify) {
        store.customs.pull(self._conditions._id)
        saves.push(store.save())
      }

      return Promise.all(saves)
    })
    .then(results => next() )
    .catch(err => next(err))
  }
}

CustomFieldSchema.pre('save', CustomFieldSchema._middlewareFuncs.preSave)
CustomFieldSchema.pre('update', CustomFieldSchema._middlewareFuncs.preUpdate)
CustomFieldSchema.pre('findOneAndUpdate', CustomFieldSchema._middlewareFuncs.preUpdate)
CustomFieldSchema.pre('remove', CustomFieldSchema._middlewareFuncs.preRemove)
CustomFieldSchema.pre('findOneAndRemove', CustomFieldSchema._middlewareFuncs.preRemove)

const CustomField = mongoose.model('CustomField', CustomFieldSchema)

module.exports = CustomField

async function preSaveValidations(self, next) {
  if (!self.isNew && self.isModified('slug')) {
    let err = new Error('Slug is not updatable')
    err.name = 'ValidationError'
    return next(err)
  }
  if (!self.isNew && self.isModified('type')) {
    let err = new Error('Type is not updatable')
    err.name = 'ValidationError'
    return next(err)
  }
  if (!self.isNew && self.isModified('_values')) {
    let err = new Error('_values is not updatable')
    err.name = 'ValidationError'
    return next(err)
  }
  if (self.values) {
    let valCount = self.values.reduce((acc, val) => {
      !!acc[val.value] ? ++acc[val.value] : acc[val.value] = 1
      return acc
    }, {})
    valCount = Object.values(valCount)

    if (valCount.find(val => val > 1)) {
      let err = new Error('Duplicated value for CustomField.values')
      err.name = 'ValidationError'
      return next(err)
    }
  }
}

function preUpdateValidations(self, next) {
  if (self._update.hasOwnProperty('slug')) {
    err = new Error('Slug is not updatable')
    err.name = 'ValidationError'
    return next(err)
  }
  if (self._update.hasOwnProperty('type')) {
    err = new Error('Type is not updatable')
    err.name = 'ValidationError'
    return next(err)
  }
  if (self._update.hasOwnProperty('values')) {
    err = new Error('Values should be updated via CustomField.save')
    err.name = 'ValidationError'
    return next(err)
  }
  if (self._update.hasOwnProperty('_values')) {
    err = new Error('_values is not updatable')
    err.name = 'ValidationError'
    return next(err)
  }
}

async function productCustomRemovedValue(self) {
  if (self.isNew || self.type != 'string' || self.values.length >= self._values.length)
    return []

  const saves = []
  const removedId = self._values.find(cId => !self.values.find(cVal => cVal._id == cId))

  const productsToModify = await Product.find({
    customs: { $elemMatch: { custom_id: self._id, value_id: removedId } }
  })
  .exec()
  .catch(e => { throw e })

  for (const product of productsToModify) {
    const customToRemove = product.customs.find(c => _.isEqual(c.custom_id, self._id))
    product.customs.pull({ _id: customToRemove._id })
    saves.push(product.save())
  }

  return saves
}

async function productCustomUpdatedMinMax(self) {
  if (!(self._update.min && self._update.min != 'auto') && !(self._update.max && self._update.max != 'auto'))
    return []

  const productsToModify = await Product.find({
    customs: { $elemMatch: { custom_id: self._conditions._id } }
  })
  .exec()
  .catch(e => { throw e })

  const filtered = []
  if (self._update.min) {
    filtered.push(...productsToModify.filter(product =>
      !!product.customs.find(custom => _.isEqual(custom.custom_id, self._conditions._id) && parseInt(custom.value) > parseInt(self._update.min))
    ))
  }
  if (self._update.max) {
    filtered.push(...productsToModify.filter(product =>
      !!product.customs.find(custom => _.isEqual(custom.custom_id, self._conditions._id) && parseInt(custom.value) < parseInt(self._update.max))
    ))
  }

  let saves = []
  for (const product of filtered) {
    const customToRemove = product.customs.find(c => _.isEqual(c.custom_id, self._conditions._id))
    product.customs.pull({ _id: customToRemove._id })
    saves.push(product.save())
  }

  return saves
}
