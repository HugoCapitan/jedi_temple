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

StoreSchema.pre('save', (next) => {
  next()
})

const Store = mongoose.model('Store', StoreSchema)

module.exports = Store
