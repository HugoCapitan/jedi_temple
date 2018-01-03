const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = new Schema({
  url: {
    type: String,
    required: true,
    validate(val) { return hasValidFormat(val) }
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

function hasValidFormat(val) {
  const valFormat = val.split('.').pop()
  const validFormats = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG']
  const isValid = validFormats.find((format) => {
    return format === valFormat
  })
  return !!isValid
}
