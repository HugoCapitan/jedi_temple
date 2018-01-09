const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReservationSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  plan: { // Short or Long
    type: String,
    required: true
  },
  status: {
    type: Number,
    required: true
  },
  arrive_date: {
    type: Date,
    required: true
  },
  departure_date: {
    type: Date,
    required: true
  },
  created_at: Date,
  updated_at: Date
})

ReservationSchema.pre('save', (next) => {
  next()
})

const Reservation = mongoose.model('Reservation', ReservationSchema)

module.exports = Reservation
