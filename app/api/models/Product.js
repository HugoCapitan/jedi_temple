const _ = require('lodash')
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const uCommons = require('../utils')

const Client = require('./Client')
const Store = require('./Store')

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
  store: {
    type: String,
    required: true
  },
  description: String,
  images: [ImageSchema],
  customs: [CustomSchema],
  created_at: Date,
  updated_at: Date
})

ProductSchema._middlewareFuncs = {
  preSave(next) {
    const self = this

    if (self.isModified('slug')) {
      const err = new Error('Slug is read-only')
      err.name = 'ValidationError'
      return next(err)
    }
    if (!self.isNew && self.isModified('store')) {
      const err = new Error('Store is not updatable')
      err.name = 'ValidationError'
      return next(err)
    }
    if (areRepeatedCustoms(self.customs)) {
      const err = new Error('Repeated custom.')
      err.name = 'ValidationError'
      return next(err)
    }

    self.slug = uCommons.slugify(`${self.store}__${self.name}`)
    const currentDate = new Date()
    self.updated_at = currentDate
    if (!self.created_at) self.created_at = currentDate

    return next()
  },
  preUpdate(next) {
    const self = this

    if (self._update.hasOwnProperty('slug')) {
      const err = new Error('Slug is read-only')
      err.name = 'ValidationError'
      return next(err)
    }
    if (self._update.hasOwnProperty('store')) {
      const err = new Error('Store is not updatable')
      err.name = 'ValidationError'
      return next(err)
    }
    if (self._update.hasOwnProperty('name')) {
      const err = new Error('Name should be updated via save')
      err.name = 'ValidationError'
      return next(err)
    }
    if (self._update.hasOwnProperty('customs') && areRepeatedCustoms(self._update.customs)) {
      const err = new Error('Repeated custom.')
      err.name = 'ValidationError'
      return next(err)
    }

    self._update.updated_at = new Date()

    return next()
  },
  preRemove(next) {
    const self = this

    Client.find({ wishlist: self._conditions._id }).exec()
    .then(clientsToModify => {
      const saves = clientsToModify.map(client => {
        client.wishlist.pull(self._conditions._id)
        return client.save()
      })

      return Promise.all(saves)
    })
    .then(savedStuff => next())
    .catch(err => next(err))
  }
}

ProductSchema.pre('save', ProductSchema._middlewareFuncs.preSave)
ProductSchema.pre('update', ProductSchema._middlewareFuncs.preUpdate)
ProductSchema.pre('findOneAndUpdate', ProductSchema._middlewareFuncs.preUpdate)
ProductSchema.pre('remove', ProductSchema._middlewareFuncs.preRemove)
ProductSchema.pre('findOneAndRemove', ProductSchema._middlewareFuncs.preRemove)

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product

function areRepeatedCustoms(customs) {
  const customsCount = _.countBy(customs, 'custom_id')
  return !!Object.values( customsCount ).find(val => val > 1)
}