const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const uCommons = require('../utils')
// const { hasRequiredCustoms } = require('../utils/validators')

const CustomSchema = require('./schemas/CustomSchema')
const ImageSchema = require('./schemas/ImageSchema')

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  description: String,
  images: [ImageSchema],
  customs: {
    type: [CustomSchema],
  },
  created_at: Date,
  updated_at: Date
})

ProductSchema._middlewareFuncs = {
  preSave(next) {
    const self = this

    if (this.isModified('slug')) {
      const err = new Error('Slug is read-only')
      err.name = 'ValidationError'
      return next(err)
    }

    self.slug = uCommons.slugify(self.name)
    const currentDate = new Date()
    self.updated_at = currentDate
    if (!self.created_at) self.created_at = currentDate

    return next()
  },
  preUpdate(next) {
    const self = this

    if (self._update.slug) {
      const err = new Error('Slug is read-only')
      err.name = 'ValidationError'
      return next(err)
    }

    if (self._update.name) 
      self._update.slug = uCommons.slugify(self._update.name)

    self._update.updated_at = new Date()

    return next()
  },
  preRemove(next) {
    return next()
  }
}

ProductSchema.pre('save', ProductSchema._middlewareFuncs.preSave)
ProductSchema.pre('update', ProductSchema._middlewareFuncs.preUpdate)
ProductSchema.pre('findOneAndUpdate', ProductSchema._middlewareFuncs.preUpdate)
ProductSchema.pre('remove', ProductSchema._middlewareFuncs.preRemove)
ProductSchema.pre('findOneAndRemove', ProductSchema._middlewareFuncs.preRemove)

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product
