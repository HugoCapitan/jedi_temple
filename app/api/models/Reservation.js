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

    const currentDate = new Date()
    self.updated_at = currentDate
    if (!self.created_at) self.created_at = currentDate

    if (!self.hasOwnProperty('total')) self.total = moment(self.departure_date).diff(self.arrive_date, 'days') * self.night_price

    return next()
  },
  preUpdate(next) {
    const self = this

    self._update.updated_at = new Date()

    if (self._update.hasOwnProperty('arrive_date')) {
      const err = new Error('arrive_date should be updated via Save')
      err.name = 'ValidationError'
      return next(err)
    }
    if (self._update.hasOwnProperty('departure_date')) {
      const err = new Error('departure_date should be updated via Save')
      err.name = 'ValidationError'
      return next(err)
    }
    if  (self._update.hasOwnProperty('night_price')) {
      const err = new Error('night_price should be updated via Save')
      err.name = 'ValidationError'
      return next(err)
    }

    return next()
  },
  preRemove(next) {
    const self = this

    Store.find({ reservations: self._conditions._id }).exec()
    .then(storesToModify => {
      const saves = []
      for(store of storesToModify) {
        store.reservations.pull(self._conditions._id)
        saves.push(store.save())
      }
      return Promise.all(saves)
    })
    .then(saved => next())
    .catch(err => next(err))
  }
}

ReservationSchema.pre('save', ReservationSchema._middlewareFuncs.preSave)
ReservationSchema.pre('update', ReservationSchema._middlewareFuncs.preUpdate)
ReservationSchema.pre('findOneAndUpdate', ReservationSchema._middlewareFuncs.preUpdate)
ReservationSchema.pre('remove', ReservationSchema._middlewareFuncs.preRemove)
ReservationSchema.pre('findOneAndRemove', ReservationSchema._middlewareFuncs.preRemove)

const Reservation = mongoose.model('Reservation', ReservationSchema)

module.exports = Reservation
