const moment = require('moment')
const CustomField = require('../models/CustomField')

module.exports = {
  areBeforeAfter(before, after) {
    return moment(before).isBefore(after, 'day')
  },
  areMinMax(min, max) {
    return parseFloat(min) < parseFloat(max) || min === 'auto' || max === 'auto'
  },
  saysNumber(val) {
    return val === 'number'
  },
  saysString(val) {
    return val === 'string'
  },
  isDate(val) {
    return moment(val).isValid()
  },
  isThisMinute(val) {
    console.log(val)
    return moment(val).isSame(moment(), 'minute')
  },
  isEmail(val) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(val)
  },
  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },
  isPicture(val) {
    const valFormat = val.split('.').pop()
    const validFormats = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG']
    const isValid = validFormats.find((format) => {
      return format === valFormat
    })
    return !!isValid
  },
  async hasRequiredCustoms(val) {
    console.log('Original')
    const PriceCustom = await CustomField.findOne({ slug: 'price' })

    const hasPrice = val.find( (custom) => custom.custom_id === PriceCustom._id )    

    return !!hasPrice
  }
}
