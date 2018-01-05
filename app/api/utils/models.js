const shortUniqueId = require('short-unique-id')
const suid = new shortUniqueId()

const CustomField = require('../models/CustomField')
const HMProduct = require('../models/HMProduct')

module.exports = {
  createOrdercode(date) {
    return `${date.getDate}-${date.getMonth}-${date.getFullYear}-${suid.randomUUID(8)}`
  },
  getValidAddress: getValidAddress,
  getValidFilter: getValidFilter,
  getValidHMMatterial: getValidHMMatterial,
  getValidHMProduct: getValidHMProduct,
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

function getValidFilter() {
  const validCustom = new CustomField( getValidStringCustom() )

  return {
    custom_id: validCustom._id
  }
}

function getValidHMMatterial() {
  const validHMPRoduct = new HMProduct( getValidHMProduct() )
  
  return {
    name: 'Gold',
    price: 599.99,
    product: validHMPRoduct._id
  }
}

function getValidHMProduct() {
  return { name: 'Bracelet' }
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