const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const orderCtrl = require('../../orderCtrl')

jest.mock('../../../models/Order')
const Order = require('../../../models/Order')

const uSchemas = require('../../../utils/validSchemas')

describe('orderCtrl -> api custom methods', () => {

  describe('updateBillingAddress', () => {

    test('Should call Order.findById with sent order_id')

    test('Should update foundOrder.billingAddress')

    test('Should call foundOrder.save')

    test('Should return updated Order')

    test('Should return NotFoundError')

    test('Should return ValidationError')

    test('Should return UnexpectedError')

  })

  describe('updateShippingAddress', () => {

    test('Should call Order.findById with sent order_id')

    test('Should update foundOrder.shippingAddress')

    test('Should call foundOrder.save')

    test('Should return updated Order')

    test('Should return NotFoundError')

    test('Should return ValidationError')

    test('Should return UnexpectedError')

  })


  describe('addProduct', () => {

    test('Should call Order.findById')

    test('Should push product id to foundOrder.products')

    test('Should call foundOrder.save')

    test('Should return updated Order')

    test('Should return NotFoundError')

    test('Should return ValidationError')

    test('Should return UnexpectedError')

  })

  describe('removeProduct', () => {

    test('Should call Order.findById')

    test('Should pull product id from foundOrder.products')

    test('Should call foundOrder.save')

    test('Should return updated Order')

    test('Should return NotFoundError')

    test('Should return UnexpectedError')

  })

})