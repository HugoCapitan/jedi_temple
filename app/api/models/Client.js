const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Store = require('./Store')

const AddressSchema = require('./schemas/AddressSchema')

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
  password: {
    type: String,
    required: true
  },
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
    const currentDate = new Date()

    this.updated_at = currentDate
    if (!this.created_at) this.created_at = currentDate

    next()
  },
  preUpdate(next) {
    this._update.updated_at = new Date()
    
    next()
  },
  async preRemove(next) {
    const self = this

    try {
      
      const storesToModify = Store.find({ clients: self._conditions._id })
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

const Client = mongoose.model('Client', ClientSchema)

module.exports = Client
