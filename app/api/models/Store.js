const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BlockedDateSchema = require('./schemas/BlockedDateSchema')
const CalendarConfigSchema = require('./schemas/CalendarConfigSchema')

const StoreSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  calendar: CalendarConfigSchema,
  blocked_dates: [BlockedDateSchema]
})

const Store = mongoose.model('Store', StoreSchema)

module.exports = Store
