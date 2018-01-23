const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CalendarConfigSchema = require('./schemas/CalendarConfigSchema')

const StoreSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  products: [{
    type: Schema.Types.ObjectId,
    default: undefined,
    rel: 'Product'
  }],
  hm_products: [{
    type: Schema.Types.ObjectId,
    default: undefined,
    rel: 'HMProduct'
  }],
  texts: [{
    type: Schema.Types.ObjectId,
    default: undefined,
    rel: 'Text'
  }],
  pictures: [{
    type: Schema.Types.ObjectId,
    default: undefined,
    rel: 'Picture'
  }],
  customs: [{
    type: Schema.Types.ObjectId,
    default: undefined,
    rel: 'CustomField'
  }],
  orders: [{
    type: Schema.Types.ObjectId,
    default: undefined,
    rel: 'Order'
  }],
  clients: [{
    type: Schema.Types.ObjectId,
    default: undefined,
    rel: 'Client'
  }],
  reservations: [{
    type: Schema.Types.ObjectId,
    default: undefined,
    rel: 'Reservation'
  }],
  calendar: CalendarConfigSchema
})

StoreSchema._middlewareFuncs = {
  preSave(next) {
    return next()
  },
  preUpdate(next) {
    return next()
  },
  preRemove(next) {
    return next()
  }
}

StoreSchema.pre('save', StoreSchema._middlewareFuncs.preSave)
StoreSchema.pre('update', StoreSchema._middlewareFuncs.preUpdate)
StoreSchema.pre('findOneAndUpdate', StoreSchema._middlewareFuncs.preUpdate)
StoreSchema.pre('remove', StoreSchema._middlewareFuncs.preRemove)
StoreSchema.pre('findOneAndRemove', StoreSchema._middlewareFuncs.preRemove)

const Store = mongoose.model('Store', StoreSchema)

module.exports = Store
