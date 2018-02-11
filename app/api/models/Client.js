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
    required: true
  },
  store: {
    type: String,
    required: true
  },
  uniqueness: {
    type: String,
    unique: true
  },
  password: { 
    type: String,
    required: true
  },
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
  preSave(next) {
    const self = this

    preSaveValidation(self)
    .then(()     => handlePassword(self))
    .then(hashed => {
      const currentDate = new Date()
      
      if (self.isNew) 
        self.uniqueness = `${self.store}__${self.email}`
      
      if (hashed && hashed.hasOwnProperty('hash') && hashed.hasOwnProperty('salt')) {
        self.password = hashed.hash
        self.salt = hashed.salt
      }

      if (!self.created_at) 
        self.created_at = currentDate

      self.updated_at = currentDate

      return next() 
    })
    .catch(err => next(err))
    
  },
  preUpdate(next) {
    const self = this

    preUpdateValidation(self)
    .then(()     => handlePassword(self._update))
    .then(hashed => {
      if (hashed && hashed.hasOwnProperty('hash') && hashed.hasOwnProperty('salt')) {
        self._update.password = hashed.hash
        self._update.salt = hashed.salt
      }

      self._update.updated_at = new Date()
      return next()
    })
    .catch(err => next(err))
  }
}

ClientSchema.pre('save', ClientSchema._middlewareFuncs.preSave)
ClientSchema.pre('udpate', ClientSchema._middlewareFuncs.preUpdate)
ClientSchema.pre('findOneAndUpdate', ClientSchema._middlewareFuncs.preUpdate)

const Client = mongoose.model('Client', ClientSchema)

module.exports = Client

async function handlePassword(context) {
  if (context.hasOwnProperty('isNew') && !context.isNew) 
    return false

  const hashed = await uModels.hashPassword(context.password)
    .catch(err => { throw err })

  return hashed
}

function preSaveValidation(self) {
  return new Promise((resolve, reject) => {
    if (self.isModified('salt')) {
      const e = new Error('Salt is not updatable')
      e.name = 'ValidationError'
      reject(e)
    }
    if (self.isModified('uniqueness')) {
      const e = new Error('Uniqueness is not updatable')
      e.name = 'ValidationError'
      reject(e)
    }
    if (self.isNew && !self.password) {
      const e = new Error('Password Required')
      e.name = 'ValidationError'
      reject(e)
    }
    if (!self.isNew && self.isModified('password')) {
      const e = new Error('Password should be modified via update')
      e.name = 'ValidationError'
      reject(e)
    }
    if (!self.isNew && self.isModified('store')) {
      const e = new Error('Store is not updatable')
      e.name = 'ValidationError'
      reject(e)
    }
    if (!self.isNew && self.isModified('email')) { 
      const e = new Error('Email is not updatable')
      e.name = 'ValidationError'
      reject(e)
    }

    resolve()
  })
}

function preUpdateValidation(self) {
  return new Promise((resolve, reject) => {
    if (self._update.hasOwnProperty('store')) {
      const err = new Error('Store is not updatable')
      err.name = 'ValidationError'
      reject(err)
    }
    if (self._update.hasOwnProperty('email')) {
      const err = new Error('Email is not updatable')
      err.name = 'ValidationError'
      reject(err)
    }
    if (self._update.hasOwnProperty('uniqueness')) {
      const err = new Error('Uniqueness is not updatable')
      err.name = 'ValidationError'
      reject(err)
    }
    if (self._update.hasOwnProperty('salt')) {
      const err = new Error('Salt is not updatable')
      err.name = 'ValidationError'
      reject(err)
    }
    
    resolve()
  })
}
