const mongoose = require('mongoose')
const Schema   = mongoose.Schema

const uModels = require('../utils/models')

const AdminSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  salt: String
})

AdminSchema._middlewareFuncs = {
  preSave(next) {
    const self = this

    if (!self.isNew && self.isModified('email'))
      return next(new Error('email is not udpatable'))
    else if (self.isModified('salt')) 
      return next(new Error('salt is not updatable'))
    else if (self.isNew || self.isModified('password')) {
      uModels.hashPassword(self.password)
      .then(hashed => { 
        self.password = hashed.hash
        self.salt = hashed.salt
        return next()
      })
      .catch(e => next(e))
    } 
    
    return next(new Error('Unexpected Error'))
  },
  preUpdate(next) {
    const self = this

    if (self._update.hasOwnProperty('email') || self._update.hasOwnProperty('salt')) {
      return next(new Error('Neither email nor salt are updatable'))
    }

    if (self._update.hasOwnProperty('password')) {
      uModels.hashPassword(self._update.password)
      .then(hashed => {
        self._update.password = hashed.hash
        self._update.salt = hashed.salt
        return next()
      })
      .catch(e => next(e))
    }

    return next(new Error('Unexpected Error'))
  }
}

AdminSchema.pre('save', AdminSchema._middlewareFuncs.preSave)
AdminSchema.pre('update', AdminSchema._middlewareFuncs.preUpdate)
AdminSchema.pre('findOneAndUpdate', AdminSchema._middlewareFuncs.preUpdate)

const Admin = mongoose.model('Admin', AdminSchema)

module.exports = Admin
