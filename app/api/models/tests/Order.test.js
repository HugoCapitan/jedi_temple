const _        = require('lodash')
const moment   = require('moment')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const Order = require('../Order')

jest.mock('../Client')
const Client = require('../Client')
jest.mock('../CustomField')
const CustomField = require('../CustomField')
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
    let priceCustom, otherCustom, firstProduct, secondProduct
    const bindMiddleware = context => 
      Order.schema._middlewareFuncs.preSave.bind(context)

    beforeEach(() => {
      setupProductsAndCustoms()
      uModels.createOrdercode = jest.fn(() => 'heybabe')

      Product.findById = jest.fn(_id => ({
        exec: () => new Promise((resolve, reject) => {
          if (_.isEqual(_id, firstProduct._id))       resolve(firstProduct)
          else if (_.isEqual(_id, secondProduct._id)) resolve(secondProduct)
          else                                        resolve(undefined)
        })
      }))

      CustomField.findById = jest.fn(_id => ({
        exec: () => new Promise((resolve, reject) => {
          if (_.isEqual(_id, numberCustom._id))     resolve(numberCustom)
          else if (_.isEqual(_id, otherCustom._id)) resolve(otherCustom)
          else                                      resolve(undefined)
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
        expect(Product.findById.mock.calls[1][0]).toEqual(new ObjectId('a0a0a0a0a0a0a0a0a0a0a0a0'))
        done()
      }

      boundMiddleware(next)
    })

    test('Should correctly populate products fields', done => {
      const context = validOrder
      const boundMiddleware = bindMiddleware(context)
      const expectedFirstProduct = {
        code: new ObjectId('0a0a0a0a0a0a0a0a0a0a0a0a'),
        name: 'The great product',
        price: 549.99,
        quantity: 2,
        customs: [{
          key: 'Weight', // <- NUMBER CUSTOM
          value: '200g'
        },{
          key: 'Sabores',
          value: 'chocomilk'
        }],
        is_populated: true
      }
      const expectedSecondProduct = {
        code: new ObjectId('a0a0a0a0a0a0a0a0a0a0a0a0'),
        name: 'The also great product',
        price: 209.99,
        quantity: 1,
        customs: [{
          key: 'Weight', // <- NUMBER CUSTOM
          value: '49g'
        },{
          key: 'Sabores',
          value: 'chocomilk'
        }],
        is_populated: true
      }

      const next = err => {
        expect(err).toBeFalsy()
        expect(context.products[0]).toEqual(expectedFirstProduct)
        expect(context.products[1]).toEqual(expectedSecondProduct)
        done()
      }

      boundMiddleware(next)
    })

    test('Shouldnt modify a product if already populated', done => {
      const context = Object.assign(validOrder, { products: [{is_populated: true}] })
      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(err).toBeFalsy()
        expect(context.products[0]).toEqual({ is_populated: true })
        done()
      }

      boundMiddleware(next)
    })

    test('Should return a Product not found error', done => {
      const context = validOrder
      const boundMiddleware = bindMiddleware(context)
      Product.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve(undefined) }) 
      }))
      const next = err => {
        expect(err.message).toBe('Product not found')
        done()
      }

      boundMiddleware(next)
    })

    test('Should return a findById Product error', done => {
      const context = validOrder
      const boundMiddleware = bindMiddleware(context)
      Product.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { reject(new Error('Test error 12345')) }) 
      }))
      const next = err => {
        expect(err.message).toBe('Test error 12345')
        done()
      }

      boundMiddleware(next)
    })

    test('Should return a findById CustomField error', done => {
      const context = validOrder
      const boundMiddleware = bindMiddleware(context)
      CustomField.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { reject(new Error('Test error 123456')) }) 
      }))
      const next = err => {
        expect(err.message).toBe('Test error 123456')
        done()
      }

      boundMiddleware(next)
    })

    test('Should prevent code modification')

    test('Should handle status modification')

    function setupProductsAndCustoms() {
      numberCustom = {
        _id: new ObjectId('cfcfcfcfcfcfcfcfcfcfcfcf'),
        name: 'Weight',
        type: 'number',
        unit: 'g',
        unit_place: 'after'
      }
      otherCustom = {
        _id: new ObjectId('afafafafafafafafafafafaf'),
        name: 'Sabores',
        type: 'string',
        values: [{
          _id: new ObjectId('ffaaffaaffaaffaaffaaffaa'),
          value: 'chocomilk'
        }]
      }
      otherCustom.values.find = jest.fn(_conditions => 
        otherCustom.values[0]
      )

      firstProduct = {
        _id: new ObjectId('0a0a0a0a0a0a0a0a0a0a0a0a'),
        name: 'The great product',
        price: 549.99,
        customs: [{
          custom_id: numberCustom._id, // <- NUMBER CUSTOM
          value: '200'
        },{
          custom_id: otherCustom._id,
          value: 'ffaaffaaffaaffaaffaaffaa'
        }]
      }
      firstProduct.customs.find = jest.fn(_conditions => {
        if (_.isEqual(_conditions.custom_id, firstProduct.customs[0].custom_id))      return firstProduct.customs[0]
        else if (_.isEqual(_conditions.custom_id, firstProduct.customs[1].custom_id)) return firstProduct.customs[1]
      })

      secondProduct = {
        _id: new ObjectId('a0a0a0a0a0a0a0a0a0a0a0a0'),
        name: 'The also great product',
        price: 209.99,
        customs: [{
          custom_id: numberCustom._id, // <- NUMBER CUSTOM
          value: '49'
        },{
          custom_id: otherCustom._id,
          value: 'ffaaffaaffaaffaaffaaffaa'
        }]
      }
      secondProduct.customs.find = jest.fn(_conditions => {
        if (_.isEqual(_conditions.custom_id, secondProduct.customs[0].custom_id))      return secondProduct.customs[0]
        else if (_.isEqual(_conditions.custom_id, secondProduct.customs[1].custom_id)) return secondProduct.customs[1]
      })
    }

  })

  describe('preUpdate Middleware', () => {
    const bindMiddleware = context => 
      Order.schema._middlewareFuncs.preUpdate.bind(context)
    
    test('Should be no error', done => {
      const _update = { status: 2 }
      const boundMiddleware = bindMiddleware({ _update })
      const next = err => {
        expect(err).toBeFalsy()
        done()
      }

      boundMiddleware(next)
    })

    test('Should prevent code modification', () => {

    })

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
 