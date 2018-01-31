const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
  created_at: Date,
  updated_at: Date
})
ReservationSchema._middlewareFuncs = {
  preSave(next) {
    next()
  },
  preUpdate(next) {
    next()
  },
  preRemove(next) {
    next()
  }
}

ReservationSchema.pre('save', ReservationSchema._middlewareFuncs.preSave)
ReservationSchema.pre('update', ReservationSchema._middlewareFuncs.preUpdate)
ReservationSchema.pre('findOneAndUpdate', ReservationSchema._middlewareFuncs.preUpdate)
ReservationSchema.pre('remove', ReservationSchema._middlewareFuncs.preRemove)
ReservationSchema.pre('findOneAndRemove', ReservationSchema._middlewareFuncs.preRemove)

const Reservation = mongoose.model('Reservation', ReservationSchema)

module.exports = Reservation
