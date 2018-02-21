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
    required: true
  },
  store: {
    type: String,
    required: true
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
    // required() { return validate.saysString(this.type) },
    validate(val) { return validate.saysString(this.type) },
    default: undefined
  },
  _values: {
    type: [String],
    validate(val) { return validate.saysString(this.type) },
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
    preSaveValidations(self)
    .then(() => Promise.all([productCustomRemovedValue(self), productCustomUpdatedMinMax(self, self._id)]))
    .then(updates => Promise.all(updates))
    .then(results => {
      const currentDate = new Date()
      
      if (self.type === 'string') 
        self._values = self.values.map(val => val._id.toString())
    
      if (self.isModified('name'))
        self.slug = uCommon.slugify(`${self.store}__${self.name}`)

      if (self.isNew) 
        self.created_at = currentDate
      
      self.updated_at = currentDate

      return next()
    })
    .catch(err => next(err))
  },
  preUpdate(next) {
    const self = this
    preUpdateValidations(self)
    .then(() => productCustomUpdatedMinMax(self._update, self._conditions.id))
    .then(savePromises => Promise.all(savePromises))
    .then(results => {
      const currentDate = new Date()
      self._update.updated_at = currentDate
      
      next()
    })
    .catch(err => next(err))
  },
  preRemove(next) {
    const self = this
      
    Product.find({
      customs: { $elemMatch: { custom_id: self._conditions._id } }
    }).exec()
    .then(productsToModify => {
      const saves = []            
      for (const product of productsToModify) {
        const customToRemove = product.customs.find(c => _.isEqual(c.custom_id, self._conditions._id))
        product.customs.pull({ _id: customToRemove._id })
        saves.push(product.save())
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

function preSaveValidations(self) {
  return new Promise((resolve, reject) => {
    if (self.isModified('slug')) {
      let err = new Error('Slug is not updatable')
      err.name = 'ValidationError'
      reject(err)
    }
    if (self.isModified('_values')) {
      let err = new Error('_values is not updatable')
      err.name = 'ValidationError'
      reject(err)
    }
    if (!self.isNew && self.isModified('store')) {
      let err = new Error('Store is not updatable')
      err.name = 'ValidationError'
      reject(err)
    }
    if (!self.isNew && self.isModified('type')) {
      let err = new Error('Type is not updatable')
      err.name = 'ValidationError'
      reject(err)
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
        reject(err)
      }
    }
    resolve()
  })
}

function preUpdateValidations(self) {
  return new Promise((resolve, reject) => {
    if (self._update.hasOwnProperty('slug')) {
      err = new Error('Slug is not updatable')
      err.name = 'ValidationError'
      reject(err)
    }
    if (self._update.hasOwnProperty('type')) {
      err = new Error('Type is not updatable')
      err.name = 'ValidationError'
      reject(err)
    }
    if (self._update.hasOwnProperty('store')) {
      err = new Error('Store is not updatable')
      err.name = 'ValidationError'
      reject(err)
    }
    if (self._update.hasOwnProperty('name')) {
      err = new Error('Name should be updated via CustomField.save')
      err.name = 'ValidationError'
      reject(err)
    }
    if (self._update.hasOwnProperty('values')) {
      err = new Error('Values should be updated via CustomField.save')
      err.name = 'ValidationError'
      reject(err)
    }
    if (self._update.hasOwnProperty('_values')) {
      err = new Error('_values is not updatable')
      err.name = 'ValidationError'
      reject(err)
    }

    resolve()
  })
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

async function productCustomUpdatedMinMax(context, id) {
  if (!context.hasOwnProperty('isNew')) context.isNew = false
  if (context.isNew || // <- IS NEW?
      (!context.hasOwnProperty('min') && !context.hasOwnProperty('max')) || // NONE EXISTS?
      (context.min === 'auto' && context.max === 'auto') ||  // BOTH ARE AUTO?
      (context.hasOwnProperty('isModified') && !context.isModified('min') && !context.isModified('max')) // NONE WAS MODIFIED?
     )
    return []

  const productsToModify = await Product.find({
    customs: { $elemMatch: { custom_id: id } }
  })
  .exec()
  .catch(e => { throw e })

  const saves = productsToModify
  .filter(product => {
    let shouldRemove = false
    pCustom = product.customs.find(custom => _.isEqual(custom.custom_id, id))

    if (context.min && context.min != 'auto' && parseInt(pCustom.value) < parseInt(context.min))
      shouldRemove = true
    if (context.max && context.max != 'auto' && parseInt(pCustom.value) > parseInt(context.max))
      shouldRemove = true

    return shouldRemove
  })
  .map(product => {
    const customToRemove = product.customs.find(c => _.isEqual(c.custom_id, id))
    product.customs.pull({ _id: customToRemove._id })
    return product.save()
  })

  return saves
}
