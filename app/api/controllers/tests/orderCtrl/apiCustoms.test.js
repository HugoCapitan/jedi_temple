const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const orderCtrl = require('../../orderCtrl')

jest.mock('../../../models/Order')
const Order = require('../../../models/Order')

const uSchemas = require('../../../utils/validSchemas')

describe('orderCtrl -> api custom methods', () => {

  describe('updateShippingAddress', () => {})

  describe('updateBillingAddress', () => {})


  describe('addProduct', () => {})

  describe('removeProduct', () => {})

})