const _        = require('lodash')
const moment   = require('moment')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const Order = require('../Order')

jest.mock('../Client')
const Client = require('../Client')
jest.mock('../Product')
const Product = require('../Product')
jest.mock('../Store')
const Store = require('../Store')

jest.mock('../../utils/models')
const uModels = require('../../utils/models')
const uCommon = require('../../utils')
const uSchemas = require('../../utils/validSchemas')
const uValid = require('../../utils/validators')

describe('Order model', () => {
  let validOrder

  beforeEach(() => { setupTest() })

  test('Should be valid', () => {
    const m = new Order( validOrder )
    const v = m.validateSync()

    expect(v).toBeFalsy()
  })

  test('Should be invalid if no: email, status, products, shipping, shipping_address, billing_address', () => {
    const m = new Order({ })
    const v = m.validateSync()

    expect(uCommon.howManyKeys(v.errors)).toBe(6)
    expect(v.errors.email).toBeTruthy()
    expect(v.errors.status).toBeTruthy()
    expect(v.errors.products).toBeTruthy()
    expect(v.errors.shipping).toBeTruthy()
    expect(v.errors.billing_address).toBeTruthy()
    expect(v.errors.shipping_address).toBeTruthy()
  })

  test('Should be invalid if email wrong format', () => {
    const m = new Order( Object.assign( validOrder, { email: 'thisaintanemail' } ) )
    const v = m.validateSync()

    expect(uCommon.howManyKeys(v.errors)).toBe(1)
    expect(v.errors.email).toBeTruthy()
  })

  test('Should be invalid if wrong address id if for billing or shipping', () => {
    const m = new Order( Object.assign( validOrder, { shipping_address: 'wrong id babe', billing_address: 'haha' } ) )
    const v = m.validateSync()

    expect(uCommon.howManyKeys(v.errors)).toBe(2)
    expect(v.errors.billing_address).toBeTruthy()
    expect(v.errors.shipping_address).toBeTruthy()
  })

  test('Should be invalid if wrong quantity in product', () => {
    const malformed = uSchemas.getValidOrder()
    malformed.products[0].quantity = 'whatup'

    const m = new Order(malformed)
    const v = m.validateSync()

    // expect(uCommon.howManyKeys(v.errors)).toBe(1)
    expect(v.errors['products.0.quantity']).toBeTruthy()
  })

  test('Should be invalid if wrong product_id in product', () => {
    const malformed = uSchemas.getValidOrder()
    malformed.products[0].code = 'heyhey'

    const m = new Order(malformed)
    const v = m.validateSync()
    
    expect(uCommon.howManyKeys(v.errors)).toBe(2)
    expect(v.errors['products.0.code']).toBeTruthy()
    expect(v.errors['products.0.products.0.code']).toBeTruthy()
  })

  describe('preSave Middleware', () => {
    const bindMiddleware = context => 
      Order.schema._middlewareFuncs.preSave.bind(context)

    beforeEach(() => {
      const firsProduct = {
        _id: new ObjectId('0a0a0a0a0a0a0a0a0a0a0a0a'),
        name: 'The great product',
        customs: [{
          custom_id: new ObjectId('cfcfcfcfcfcfcfcfcfcfcfcf'), // <- PRICE CUSTOM
          value: '549.99'
        },{
          custom_id: new ObjectId('afafafafafafafafafafafaf'),
          value: 'ffaaffaaffaaffaaffaaffaa'
        }]
      }
      const secondProduct = {
        _id: new ObjectId('a0a0a0a0a0a0a0a0a0a0a0a0'),
        name: 'The great product',
        customs: [{
          custom_id: new ObjectId('cfcfcfcfcfcfcfcfcfcfcfcf'), // <- PRICE CUSTOM
          value: '349.99'
        },{
          custom_id: new ObjectId('afafafafafafafafafafafaf'),
          value: 'ffaaffaaffaaffaaffaaffaa'
        }]
      }

      uModels.createOrdercode = jest.fn(() => 'heybabe')
      Product.findById = jest.fn(_id => ({
        exec: () => new Promise((resolve, reject) => { 
          if (_.isEqual(_id, '0a0a0a0a0a0a0a0a0a0a0a0a'))      resolve(firsProduct)
          else if (_.isEqual(_id, 'a0a0a0a0a0a0a0a0a0a0a0a0')) resolve(secondProduct)
          else                                                 resolve(undefined)
        })
      }))
    })

    test('Should be no error', done => {
      const context = validOrder
      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(err).toBeFalsy()
        done()
      }

      boundMiddleware(next)
    })

    test('Should create a new order code', done => {
      const context = validOrder
      const boundMiddleware = bindMiddleware(context)

      const next = err => {
        expect(err).toBeFalsy()
        expect(uModels.createOrdercode.mock.calls.length).toBe(1)
        const paramDate = uModels.createOrdercode.mock.calls[0][0]
        expect( uValid.isThisMinute(paramDate) ).toBeTruthy()
        expect(context.order_code).toBe('heybabe')
        done()
      }

      boundMiddleware(next)
    })

    test('Should add creation and update dates', done => {
      const context = validOrder
      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(err).toBeFalsy()
        expect(context.created_at).toBeTruthy()
        expect(context.updated_at).toBeTruthy()
        expect( uValid.isThisMinute(context.created_at) ).toBeTruthy()
        expect( uValid.isThisMinute(context.updated_at) ).toBeTruthy()
        done()
      }

      boundMiddleware(next)
    })

    test('Should update update date', done => {
      const lastWeek = moment().subtract('1', 'weeks')
      const context = Object.assign(validOrder, { 
        created_at: lastWeek,
        updated_at: lastWeek
      })
      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(err).toBeFalsy()
        expect(context.created_at).toBe(lastWeek)
        expect( uValid.isThisMinute(context.updated_at) ).toBeTruthy()
        done()
      }

      boundMiddleware(next)
    })

    test('Should call products findById by each product', done => {
      const context = validOrder
      const boundMiddleware = bindMiddleware(context)

      const next = err => {
        expect(err).toBeFalsy()
        expect(Product.findById.mock.calls.length).toBe(2)
        expect(Product.findById.mock.calls[0][0]).toEqual(new ObjectId('0a0a0a0a0a0a0a0a0a0a0a0a'))
        done()
      }

      boundMiddleware(next)
    })

    test('Should correctly populate products fields')    

    test('Should return a not found Product error')

  })

  describe('preUpdate Middleware', () => {
    const bindMiddleware = context => 
      Order.schema._middlewareFuncs.preUpdate(context)
    
    test('Should be no error')

    test('Should prevent code modification')

    test('Should send email on partial shipment')

    test('Should send email on shipment')

    test('Should send email on completed')

    test('Should send email on canceled')

    test('Should prevent products update, send message to use Save method')

  })

  describe('preRemove Error', () => {
    const bindMiddleware = context => 
      Order.schema._middlewareFuncs.preRemove(context)

    beforeEach(() => {
      Client.find = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve([]) })
      }))
      Store.find = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve([]) })
      }))
    })
    
    test('Should be no error')

    test('Should call find on stores and clients')

    test('Should update and save found stores')

    test('Should update and save found clients')

  })

  function setupTest() {
    validOrder = uSchemas.getValidOrder()
  }
})
 