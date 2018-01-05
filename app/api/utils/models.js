const shortUniqueId = require('short-unique-id')
const suid = new shortUniqueId()

module.exports = {
  createOrdercode(date) {
    return `${date.getDate}-${date.getMonth}-${date.getFullYear}-${suid.randomUUID(8)}`
  },
  getValidAddress: getValidAddress,
  getValidNumberCustom: getValidNumberCustom,
  getValidStringCustom: getValidStringCustom
}

function getValidAddress () {
  return {
    name: 'Some Name',
    email: 'some@mail.com',
    address_line_1: 'Address number etc',
    address_line_2: 'Appartment number',
    city: 'Maybe a mayor city',
    state: 'Who cares',
    country: 'PR',
    zip: '89231'
  }
}

function getValidNumberCustom() {
  return {
    name: 'Number CustomField',
    show: true,
    type: 'number',
    min: 'auto',
    max: '500',
    unit: 'cm',
    unit_place: 'after'
  }
}

function getValidStringCustom() {
  return {
    name: 'String CustomField',
    show: true, 
    type: 'string',
    values: ['A value', 'Another Value']
  }
}