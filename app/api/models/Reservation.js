const mongoose = require('mongoose')
const Schema = mongoose.Schema

const { areBeforeAfter, isEmail, isDate } = require('../utils/validators')

const ReservationSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate: isEmail
  },
  plan: { // Short or Long
    type: String,
    required: true,
    enum: ['short', 'long']
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
  billing_address:{
    type: Schema.Types.ObjectId,
    rel: 'Address'
  },
  created_at: Date,
  updated_at: Date
})

ReservationSchema.pre('save', (next) => {
  next()
})

const Reservation = mongoose.model('Reservation', ReservationSchema)

module.exports = Reservation
