const mongoose = require('mongoose')
const Schema = mongoose.Schema

const { areMinMax } = require('../../utils/validators')

module.exports = new Schema({
  // Number of days before date available
  nearest_available_date: {
    type: Number,
    required: true,
    validate(val) { return areMinMax(val, this.furthest_available_date) }
  },
  // Number of days before maximum
  furthest_available_date: {
    type: Number,
    required: true,
    max: 365,
    default: 182,
    validate(val) { return areMinMax(this.nearest_available_date, val) }
  },
  // Max number of days available for reservation
  maximum_reservation: {
    type: Number,
    required: true,
    max: 180,
    default: 30,
    validate(val) {
      return val <= this.furthest_available_date - this.nearest_available_date
    }
  }
})
