const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BlockedDateSchema = require('./schemas/BlockedDateSchema')
const CalendarConfigSchema = require('./schemas/CalendarConfigSchema')

const uCommons = require('../utils')

const StoreSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    unique: true
  },
  calendar: CalendarConfigSchema,
  blocked_dates: [BlockedDateSchema]
})

StoreSchema._middlewareFuncs = {
  preSave(next) {
    this.slug = uCommons.slugify(this.name)
    return next()
  },
  preUpdate(next) {
    if (this._update.name) 
      this._update.slug = uCommons.slugify(this._update.name)
    return next()
  }
}

StoreSchema.pre('save', StoreSchema._middlewareFuncs.preSave)
StoreSchema.pre('update', StoreSchema._middlewareFuncs.preUpdate)
StoreSchema.pre('findOneAndUpdate', StoreSchema._middlewareFuncs.preUpdate)

const Store = mongoose.model('Store', StoreSchema)

module.exports = Store
