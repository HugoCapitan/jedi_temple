
module.exports = {
  areMinMax(min, max) {
    return parseFloat(min) < parseFloat(max) || min === 'auto' || max === 'auto'
  },
  saysNumber(val) {
    return val === 'number'
  },
  saysString(val) {
    return val === 'string'
  },
  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },
  isEmail(val) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(val)
  }
}
