const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
  }
}

HMProductSchema.pre('save', (next) => {
  const currentDate = new Date

  this.updated_at = currentDate
  if (!this.created_at) 
    this.created_at = currentDate

  this.slug = uCommon.slugify(this.name)

  next()
})

const HMProduct = mongoose.model('HMProduct', HMProductSchema)

module.exports = HMProduct