const moment = require('moment')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Store = require('./Store')

const AddressSchema = require('./schemas/AddressSchema')

const validate = require('../utils/validators')

const ReservationSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate: validate.isEmail
  },
  status: {
    type: Number,
    required: true
  },
  arrive_date: {
    type: Date,
    required: true,
    validate(val) { return validate.isDate(val) && validate.areBeforeAfter(val, this.departure_date) },
  },
  departure_date: {
    type: Date,
    required: true,
    validate(val) { return validate.isDate(val) && validate.areBeforeAfter(this.arrive_date, val) }
  },
  billing_address: {
    type: AddressSchema
  },
  night_price: {
    type: Number,
    required: true
  },
  total: Number,
  store: {
    type: String,
    required: true
  },
  created_at: Date,
  updated_at: Date
})
ReservationSchema._middlewareFuncs = {
  preSave(next) {
    const self = this

    if (!self.isNew && self.isModified('store')) {
      const err = new Error('Store is not updatable')
      err.name = 'ValidationError'
      return next(err)
    }

    const currentDate = new Date()
    self.updated_at = currentDate
    if (!self.created_at) self.created_at = currentDate

    self.total = moment(self.departure_date).diff(self.arrive_date, 'days') * self.night_price

    return next()
  },
  preUpdate(next) {
    const self = this

    if (self._update.hasOwnProperty('store')) {
      const err = new Error('Store is not updatable')
      err.name = 'ValidationError'
      return next(err)
    }

    if ((self._update.hasOwnProperty('arrive_date') || self._update.hasOwnProperty('departure_date') || 
         self._update.hasOwnProperty('night_price')) && (!self._update.hasOwnProperty('arrive_date') ||
        !self._update.hasOwnProperty('departure_date') || !self._update.hasOwnProperty('night_price'))
    ) {
      const err = new Error('arrive_date, departure_date and night_price should be together in case of update of any')
      err.name = 'ValidationError'
      return next(err)
    }

    if (self._update.hasOwnProperty('arrive_date'))
      self._update.total = moment(self._update.departure_date).diff(self._update.arrive_date, 'days') * self._update.night_price

    self._update.updated_at = new Date()

    return next()
  }
}

ReservationSchema.pre('save', ReservationSchema._middlewareFuncs.preSave)
ReservationSchema.pre('update', ReservationSchema._middlewareFuncs.preUpdate)
ReservationSchema.pre('findOneAndUpdate', ReservationSchema._middlewareFuncs.preUpdate)

const Reservation = mongoose.model('Reservation', ReservationSchema)

module.exports = Reservation
