const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AddressSchema = require('./schemas/AddressSchema')

const { areBeforeAfter, isEmail, isDate } = require('../utils/validators')

const ReservationSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate: isEmail
  },
  status: {
    type: Number,
    required: true
  },
  arrive_date: {
    type: Date,
    required: true,
    validate(val) { return isDate(val) && areBeforeAfter(val, this.departure_date) },
  },
  departure_date: {
    type: Date,
    required: true,
    validate(val) { return isDate(val) && areBeforeAfter(this.arrive_date, val) }
  },
  billing_address: {
    type: AddressSchema
  },
  total: {
    type: Number,
    // set
  },
  created_at: Date,
  updated_at: Date
})

ReservationSchema.pre('save', (next) => {
  next()
})

const Reservation = mongoose.model('Reservation', ReservationSchema)

module.exports = Reservation
