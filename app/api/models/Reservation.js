const moment = require('moment')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AddressSchema = require('./schemas/AddressSchema')
const Store         = require('./Store')
const validate      = require('../utils/validators')

const statuses = [
  'Pending', 'Awaiting Payment', 'Payed', 'Refunded', 'Verification Required', 'Cancelled', 'Ongoing', 'Finished'
]

const ReservationSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate: validate.isEmail
  },
  status: {
    type: String,
    enum: statuses,
    required: true
  },
  payment_method: {
    type: String,
    required: true
  },
  payment_id: String,
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

    preSaveValidation(self)
    .then(() => registerDatesInStore(self._id, self.arrive_date, self.departure_date, self.store))
    .then(() => {
      const currentDate = new Date()
      self.updated_at = currentDate
      if (!self.created_at) self.created_at = currentDate

      self.total = moment(self.departure_date).diff(self.arrive_date, 'days') * self.night_price

      return next()
    })
    .catch(err => next(err))
  },
  preUpdate(next) {
    const self = this

    preUpdateValidation(self)
    .then(() => updateDatesInStore(self._conditions.id, self._update.arriving_date, self._update.departure_date, 'unahil'))
    .then(() => {
      if (self._update.hasOwnProperty('arrive_date'))
        self._update.total = moment(self._update.departure_date).diff(self._update.arrive_date, 'days') * self._update.night_price

      self._update.updated_at = new Date()

      return next()
    })
    .catch(err => next(err))
  }
}

ReservationSchema.pre('save', ReservationSchema._middlewareFuncs.preSave)
ReservationSchema.pre('update', ReservationSchema._middlewareFuncs.preUpdate)
ReservationSchema.pre('findOneAndUpdate', ReservationSchema._middlewareFuncs.preUpdate)

const Reservation = mongoose.model('Reservation', ReservationSchema)

module.exports = Reservation

function preSaveValidation(self) {
  return new Promise((resolve, reject) => {
    if (!self.isNew && self.isModified('store')) {
      const err = new Error('Store is not updatable')
      err.name = 'ValidationError'
      reject(err)
    }
    
    checkDatesInStore(self._id, self.arrive_date, self.departure_date, self.store)
    .then(resolve)
    .catch(reject)
  })
}

function preUpdateValidation(self) {
  return new Promise((resolve, reject) => {
    if (self._update.hasOwnProperty('store')) {
      const err = new Error('Store is not updatable')
      err.name = 'ValidationError'
      reject(err)
    }

    if ((self._update.hasOwnProperty('arrive_date') || self._update.hasOwnProperty('departure_date') || 
         self._update.hasOwnProperty('night_price')) && (!self._update.hasOwnProperty('arrive_date') ||
        !self._update.hasOwnProperty('departure_date') || !self._update.hasOwnProperty('night_price'))
    ) {
      const err = new Error('arrive_date, departure_date and night_price should be together in case of update of any')
      err.name = 'ValidationError'
      reject(err)
    }   

    checkDatesInStore(self._id, self._update.arrive_date, self._update.departure_date, 'unahil')
    .then(resolve)
    .catch(reject)
  })
}

function checkDatesInStore(_id, start, end, store) {
  return new Promise((resolve, reject) => {
    const theStore = Store.findOne({ slug: store }).exec()

    if (!theStore.blocked_dates)
      resolve()

    const alreadyBooked = theStore.blocked_dates.find((dates) => {
      const booked_start = moment(dates.start)
      const booked_end   = moment(dates.start)
      const this_start   = moment(start)
      const this_end     = moment(end)
      
      if ( this_start.isBetween(booked_start, booked_end, null, '[]')
        || booked_start.isBetween(this_start, this_end, null, '[]')
        && dates.reservation_id != _id ) 
        return true 
      else
        return false
    })
 
    if (alreadyBooked)
      reject('This date is already booked')
    else
      resolve()
  })
}

function registerDatesInStore(_id, start, end, store) {
  return new Promise((resolve, reject) => {
    Store.findOneAndUpdate({ slug: store }, { 
      $push: { 
        blocked_dates: { 
          start_date: start, 
          end_date: end, 
          motive: 'already_reserved', 
          reservation_id: _id 
        }
      } 
    }, { new: true }).exec()
    .catch(reject)
    .then(resolve)
  })
}

function updateDatesInStore(_id, start, end, store) {
  return new Promise((resolve, reject) => {
    if (!self.start) resolve()
      
    Store.findOneAndUpdate({ slug: store, 'blocked_dates.reservation_id': _id }, {
      $set: { 'blocked_dates.$.start_date': start, 'blocked_dates.$.end_date': end }
    }, { new: true }).exec()
    .catch(reject)
    .then(resolve)
  })
}

