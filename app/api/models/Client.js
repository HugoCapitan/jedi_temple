const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Store = require('./Store')

const AddressSchema = require('./schemas/AddressSchema')

const uModels = require('../utils/models')

const ClientSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  salt: String,
  addresses: [AddressSchema],
  orders:[{
    type: Schema.Types.ObjectId,
    rel: 'Order',
    default: []
  }],
  reservations: [{
    type: Schema.Types.ObjectId,
    rel: 'Reservation',
    default: []
  }],
  wishlist: [{
    type: Schema.Types.ObjectId,
    rel: 'Product',
    default: []
  }],
  created_at: Date,
  updated_at: Date
})

ClientSchema._middlewareFuncs = {
  async preSave(next) {
    const self = this
    try {
      const currentDate = new Date()

      self.updated_at = currentDate
      if (!self.created_at) self.created_at = currentDate

      if (self.isNew && !self.password) {
        const e = new Error('Password Required')
        e.name = 'ValidationError'
        throw e
      }

      if (self.password) {
        const hashed = await uModels.hashPassword(self.password)

        self.password = hashed.hash
        self.salt = hashed.salt
      }

      next()
    } catch (e) {
      next(e)
    }
    
  },
  async preUpdate(next) {
    const self = this
    try {
      self._update.updated_at = new Date()

      if (self._update.password) {
        const hashed = await uModels.hashPassword(self._update.password)

        self._update.password = hashed.hash
        self._update.salt = hashed.salt
      }
    
      next()
    } catch (e) {
      next(e)
    }
    
  },
  async preRemove(next) {
    const self = this

    try {
      
      const storesToModify = await Store.find({ clients: self._conditions._id })
      let saves = []

      for (const store of storesToModify) {
        store.clients.pull(self._conditions._id)
        saves.push(store.save())
      }

      Promise.all(saves)
      .then(results => {
        next()
      })
      .catch(err => {
        throw err
      })
    } catch (e) {
      next(e)
    }
  }
}

ClientSchema.pre('save', ClientSchema._middlewareFuncs.preSave)
ClientSchema.pre('udpate', ClientSchema._middlewareFuncs.preUpdate)
ClientSchema.pre('findOneAndUpdate', ClientSchema._middlewareFuncs.preUpdate)
ClientSchema.pre('remove', ClientSchema._middlewareFuncs.preRemove)
ClientSchema.pre('findOneAndRemove', ClientSchema._middlewareFuncs.preRemove)

const Client = mongoose.model('Client', ClientSchema)

module.exports = Client
