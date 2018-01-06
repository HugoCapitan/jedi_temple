const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = new Schema({
  // Number of days before date available
  nearest_available_date: {
    type: Number,
    required: true
  },
  // Number of days before maximum
  furthest_available_date: {
    type: Number,
    required: true,
    max: 365,
    default: 182
  },
  // Max number of days available for reservation
  maximum_reservation: {
    type: Number,
    required: true,
    max: 180,
    default: 30
  }
})
