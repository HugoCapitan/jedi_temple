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

      if (self.isModified('materials') || self.isModified('models'))
        self.models = self.models.filter(model => !!self.materials.find( mat => _.isEqual(mat._id, model.material_id) ))

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

    preUpdateValidation(self)
    .then(() => {
      if (self._update.hasOwnProperty('models') && self._update.hasOwnProperty('materials'))
        self._update.models = self._update.models.filter(model =>
          !!self._update.materials.find(mat => mat._id == model.material_id)
        )

      self._update.updated_at = new Date()    
      return next()
    })
    .catch(err => next(err))
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
      const err = new Error('Slug is not updatable')
      err.name = 'ValidationError'
      reject(err)
    }
    if (!self.isNew && self.isModified('store')) {
      const err = new Error('Store is not updatable')
      err.name = 'ValidationError'
      reject(err)
    }
    if (validateMaterials(self.materials)) {
      const err = new Error(`Duplicated value for materials in ${self.name} HMProduct`)
      err.name = 'ValidationError'
      reject(err)
    }
    if (validateModels(self.models)) {
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
    if (self._update.hasOwnProperty('materials') && validateMaterials(self._update.materials)) {
      const err = new Error(`Duplicated value for material in ${self.name} HMProduct`)
      err.name = 'ValidationError'
      reject(err)
    }
    if (self._update.hasOwnProperty('models') && validateModels(self._update.models)) {
      const err = new Error(`Duplicated value for model in ${self.name} HMProduct`)
      err.name = 'ValidationError'
      reject(err)
    }

    resolve()
  })
}

function validateMaterials(materials) {
  const materialsCount = _.countBy(materials, 'material_name')
  return !!Object.values( materialsCount ).find( v => v > 1 )
}

function validateModels(models) {
  const modelsCount = models.reduce((modacc, model, index) => {
    const modelIdentificator = `${model.material_id}:${model.model_name}`
    !!modacc[modelIdentificator] ? ++modacc[modelIdentificator] : modacc[modelIdentificator] = 1
    return modacc
  }, {})

  return !!Object.values( modelsCount ).find( v => v > 1 )
}
