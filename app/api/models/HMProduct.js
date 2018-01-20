const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Store = require('./Store')

const uCommon = require('../utils')

const HandmadeMaterialSchema = require('./schemas/HandmadeMaterialSchema')

const HMProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    unique: true
  },
  materials: [HandmadeMaterialSchema],
  created_at: Date,
  updated_at: Date
})

HMProductSchema._middlewareFuncs = {
  preSave(next) {
    const self = this
    const currentDate = new Date()

    self.updated_at = currentDate
    if (!self.created_at) self.created_at = currentDate

    self.slug = uCommon.slugify(self.name)

    if (self.materials) {
      const materialsCount = self.materials.reduce((matacc, material) => {

        const modelsCount = material.models.reduce((modacc, model) => {
          !!modacc[model] ? ++modacc[model] : modacc[model] = 1
          return modacc
        }, {})

        if (Object.values( modelsCount ).find( v => v > 1 )) {
          const err = new Error(`Duplicated value for models in material ${material.name} in ${self.name} HMProduct`)
          err.name = 'ValidationError'
          next(err)
        }

        !!matacc[material.material] ? ++matacc[material.material] : matacc[material.material] = 1
        return matacc
      }, {})
  
      if (Object.values( materialsCount ).find( v => v > 1 )) {
        let err = new Error(`Duplicated value for materials in ${self.name} HMProduct`)
        err.name = 'ValidationError'
        next(err)
      }
    }

    next()
  },
  preUpdate(next) {
    const self = this

    self._update.updated_at = new Date()

    if (self._update.materials) {
      const err = new Error('Materials should be updated via HMProduct.save')
      err.name = 'ValidationError'
      next(err)
    }

    next()
  },
  preRemove(next) {
    const self = this
    Store.find({ hm_products: self._conditions._id })
    .exec()
    .then(storesToModify => {
      let saves = []
      for (const store of storesToModify) {
        store.hm_products.pull(self._conditions._id)
        saves.push(store.save())
      }

      return Promise.all(saves)
    })
    .then(results => next())
    .catch(err => next(err))
  }
}

HMProductSchema.pre('save', HMProductSchema._middlewareFuncs.preSave)
HMProductSchema.pre('update', HMProductSchema._middlewareFuncs.preUpdate)
HMProductSchema.pre('findOneAndUpdate', HMProductSchema._middlewareFuncs.preUpdate)
HMProductSchema.pre('remove', HMProductSchema._middlewareFuncs.preRemove)
HMProductSchema.pre('findOneAndRemove', HMProductSchema._middlewareFuncs.preRemove)

const HMProduct = mongoose.model('HMProduct', HMProductSchema)

module.exports = HMProduct