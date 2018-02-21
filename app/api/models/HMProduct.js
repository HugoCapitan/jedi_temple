const _ = require('lodash')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Store = require('./Store')

const uCommon = require('../utils')

const HandmadeMaterialSchema = require('./schemas/HandmadeMaterialSchema')
const HandmadeModelSchema = require('./schemas/HandmadeModelSchema')

const HMProductSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true
  },
  store: {
    type: String,
    required: true
  },
  materials: [HandmadeMaterialSchema],
  models: [HandmadeModelSchema],
  created_at: Date,
  updated_at: Date
})

HMProductSchema._middlewareFuncs = {
  preSave(next) {
    const self = this

    preSaveValidation(self)
    .then(() => {
      const currentDate = new Date()

      if (self.isNew) 
        self.created_at = currentDate

      if (self.isModified('name'))
        self.slug = uCommon.slugify(`${self.store}__${self.name}`)

      self.updated_at = currentDate      

      return next()
    })
    .catch(e => next(e))
  },
  preUpdate(next) {
    const self = this

    self._update.updated_at = new Date()    

    return next()
  }
}

HMProductSchema.pre('save', HMProductSchema._middlewareFuncs.preSave)
HMProductSchema.pre('update', HMProductSchema._middlewareFuncs.preUpdate)
HMProductSchema.pre('findOneAndUpdate', HMProductSchema._middlewareFuncs.preUpdate)

const HMProduct = mongoose.model('HMProduct', HMProductSchema)

module.exports = HMProduct

function preSaveValidation(self) {
  return new Promise((resolve, reject) => {
    if (self.isModified('slug')) {
      err = new Error('Slug is not updatable')
      err.name = 'ValidationError'
      reject(err)
    }
    if (!self.isNew && self.isModified('store')) {
      err = new Error('Store is not updatable')
      err.name = 'ValidationError'
      reject(err)
    }

    const materialsCount = self.materials.reduce((matacc, material) => {
      !!matacc[material.material_name] ? ++matacc[material.material_name] : matacc[material.material_name] = 1
      return matacc
    }, {})
  
    if (Object.values( materialsCount ).find( v => v > 1 )) {
      let err = new Error(`Duplicated value for materials in ${self.name} HMProduct`)
      err.name = 'ValidationError'
      reject(err)
    }

    modelsIndexesToRemove = []
    const modelsCount = self.models.reduce((modacc, model, index) => {
      if (!self.materials.find(selfMaterial => _.isEqual(model.material_id , selfMaterial._id))) {
        modelsIndexesToRemove.push(index)
        return modacc
      }

      const modelIdentificator = `${model.material_id}:${model.model_name}`
      !!modacc[modelIdentificator] ? ++modacc[modelIdentificator] : modacc[modelIdentificator] = 1
      return modacc
    }, {})

    self.models = self.models.filter((m, index) => !_.includes(modelsIndexesToRemove, index))
  
    if (Object.values( modelsCount ).find( v => v > 1 )) {
      const err = new Error(`Duplicated value for model in ${self.name} HMProduct`)
      err.name = 'ValidationError'
      reject(err)
    }

    resolve()
  })
}

function preUpdateValidation(self) {
  return new Promise((resolve, reject) => {
    if (self._update.hasOwnProperty('name')) {
      const err = new Error('Name should be updated via save')
      err.name = 'ValidationError'
      reject(err)
    }
    if (self._update.hasOwnProperty('store')) {
      const err = new Error('Store is not updatable')
      err.name = 'ValidationError'
      reject(err)
    }
    if (self._update.hasOwnProperty('slug')) {
      const err = new Error('Slug is not updatable')
      err.name = 'ValidationError'
      reject(err)
    }
    if (self._update.hasOwnProperty('materials') && !self._update.hasOwnProperty('models')) {
      const err = new Error('Update object should also have a models array')
      err.name = 'ValidationError'
      reject(err)
    }
    if (self._update.hasOwnProperty('models') && !self._update.hasOwnProperty('materials')) {
      const err = new Error('Update object should also have a materials array')
      err.name = 'ValidationError'
      reject(err)
    }

    resolve()
  })
}
