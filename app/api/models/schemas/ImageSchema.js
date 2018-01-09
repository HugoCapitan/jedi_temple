const mongoose = require('mongoose')
const Schema = mongoose.Schema

const { isPicture } = require('../../utils/validators')

module.exports = new Schema({
  url: {
    type: String,
    required: true,
    validate: isPicture
  },
  x: {
    type: String,
    required: true,
    validate(val) { return hasValidUnits(val) }
  },
  y: {
    type: String,
    required: true,
    validate(val) { return hasValidUnits(val) }
  }
})

function hasValidUnits(val) {
  const units = [val.substr(val.length - 1), val.substr(val.length - 2)]
  const isValid = units.find((unit) => {
    return unit === '%' || unit === 'px' || unit === 'pt'
  })
  return !!isValid
}
