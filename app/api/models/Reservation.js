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
