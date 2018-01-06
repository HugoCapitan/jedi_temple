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
    defauñt: undefined,
    rel: 'Product'
  }],
  texts: [{
    type: Schema.Types.ObjectId,
    defauñt: undefined,
    rel: 'Text'
  }],
  pictures: [{
    type: Schema.Types.ObjectId,
    defauñt: undefined,
    rel: 'Picture'
  }],
  Customs: [{
    type: Schema.Types.ObjectId,
    defauñt: undefined,
    rel: 'CustomField'
  }],
  Filters: [{
    type: Schema.Types.ObjectId,
    defauñt: undefined,
    rel: 'Filter'
  }],
  Orders: [{
    type: Schema.Types.ObjectId,
    defauñt: undefined,
    rel: 'Order'
  }],
  Clients: [{
    type: Schema.Types.ObjectId,
    defauñt: undefined,
    rel: 'Client'
  }],
  Reservations: [{
    type: Schema.Types.ObjectId,
    defauñt: undefined,
    rel: 'Reservation'
  }],
  Calendar: CalendarConfigSchema
})

StoreSchema.pre('save', (next) => {
  next()
})

const Store = mongoose.model('Store', StoreSchema)

module.exports = Store
