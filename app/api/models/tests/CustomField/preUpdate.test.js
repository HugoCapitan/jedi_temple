const moment = require('moment')
const _ = require('lodash')
const { ObjectId } = require('mongoose').Schema.Types

jest.mock('../../Product')
jest.mock('../../Store')
const Product = require('../../Product')
const Store = require('../../Store')
const CustomField = require('../../CustomField')

const uCommon  = require('../../../utils')
const uValid   = require('../../../utils/validators')
const uSchemas = require('../../../utils/validSchemas')

describe('preUpdate Middleware', () => {
  let validNumberCustom, validStringCustom
  const bindMiddleware = (context) => 
    CustomField.schema._middlewareFuncs.preUpdate.bind(context) 

  beforeEach(() => {
    validNumberCustom = uSchemas.getValidNumberCustom()
    validStringCustom = uSchemas.getValidStringCustom()

    Product.find = jest.fn(() => ({
      exec: () => new Promise((resolve, reject) => { resolve([]) })
    }))
    Product.prototype.save = jest.fn(() => new Promise((resolve, reject) => { resolve() }))
  })
  
  test('Should call next', done => {
    const _update = { show: false }
    const _conditions = { _id: 'stereoband' }
    const boundMiddleware = bindMiddleware({ _update, _conditions })
    const next = err => {
      expect(err).toBeFalsy()
      done()
    }

    boundMiddleware(next)
  })

  test('Should update updated_at date', done => {
    const newField = { show: false }
    const _update = newField
    const _conditions = { _id: 'stereoband' }
    const boundMiddleware = bindMiddleware({ _update, _conditions })
    const next = err => {
      expect(err).toBeFalsy()
      expect( uValid.isThisMinute(newField.updated_at) ).toBeTruthy()
      done()
    }

    boundMiddleware(next)
  })

  test('Should call Product.find if min modified', done => {
    const minUpdated = { min: 500 }
    const _update = minUpdated
    const boundMiddleware = bindMiddleware({ _conditions: { _id: 'pinacolada' }, _update })
    const expectedQuery = { 
      customs: { $elemMatch: { custom_id: 'pinacolada' } } 
    }
    const next = err => {
      expect(err).toBeFalsy()
      expect(Product.find.mock.calls.length).toBe(1)
      expect(Product.find.mock.calls[0][0]).toEqual(expectedQuery)
      done()
    }

    boundMiddleware(next)
  })

  test('Should call Product.find if max modified', done => {
    const maxUpdated = { max: 500 }
    const _update = maxUpdated
    const boundMiddleware = bindMiddleware({ _conditions: { _id: 'pinacolada' }, _update })
    const expectedQuery = { 
      customs: { $elemMatch: { custom_id: 'pinacolada' } } 
    }
    const next = err => {
      expect(err).toBeFalsy()
      expect(Product.find.mock.calls.length).toBe(1)
      expect(Product.find.mock.calls[0][0]).toEqual(expectedQuery)
      done()
    }

    boundMiddleware(next)      
  })

  test('Should correctly call update and save on necessary products', done => {
    const maxUpdated = { min: '450', max: '500' }
    const _update = maxUpdated

    const boundMiddleware = bindMiddleware({ _conditions: { _id: 'pinacolada' }, _update })

    const foundProducts = [{ 
        customs: [{ 
        _id: 'ajua', 
        custom_id: 'pinacolada', 
        value: '900' 
      }], 
      save: jest.fn(() => new Promise((resolve, reject) => { resolve() }))
    }, { 
      customs: [{ 
        _id: 'notajua', 
        custom_id: 'pinacolada', 
        value: '400' 
      }], 
      save: jest.fn(() => new Promise((resolve, reject) => { resolve() }))
    }]
    foundProducts[0].customs.pull = jest.fn(() => { foundProducts[0].customs.pop() })
    foundProducts[1].customs.pull = jest.fn(() => { foundProducts[1].customs.pop() })
    Product.find = jest.fn(() => ({
      exec: () => new Promise((resolve, reject) => { resolve(foundProducts) })
    }))
    
    const next = err => {
      expect(err).toBeFalsy()

      expect(foundProducts[0].customs.length).toBe(0)
      expect(foundProducts[0].customs.pull.mock.calls.length).toBe(1)
      expect(foundProducts[0].customs.pull.mock.calls[0][0]).toEqual({ _id: 'ajua' })
      expect(foundProducts[0].save.mock.calls.length).toBe(1)

      expect(foundProducts[1].customs.length).toBe(0)
      expect(foundProducts[1].customs.pull.mock.calls.length).toBe(1)
      expect(foundProducts[1].customs.pull.mock.calls[0][0]).toEqual({ _id: 'notajua' })
      expect(foundProducts[1].save.mock.calls.length).toBe(1)
      done()
    }

    boundMiddleware(next)
  })

  test('Should correctly call update and save on necessary products', done => {
    const maxUpdated = { min: 'auto', max: '500' }
    const _update = maxUpdated

    const boundMiddleware = bindMiddleware({ _conditions: { _id: 'pinacolada' }, _update })

    const foundProducts = [{ 
        customs: [{ 
        _id: 'ajua', 
        custom_id: 'pinacolada', 
        value: '900' 
      }], 
      save: jest.fn(() => new Promise((resolve, reject) => { resolve() }))
    }, { 
      customs: [{ 
        _id: 'notajua', 
        custom_id: 'pinacolada', 
        value: '400' 
      }], 
      save: jest.fn(() => new Promise((resolve, reject) => { resolve() }))
    }]
    foundProducts[0].customs.pull = jest.fn(() => { foundProducts[0].customs.pop() })
    foundProducts[1].customs.pull = jest.fn(() => { foundProducts[1].customs.pop() })
    Product.find = jest.fn(() => ({
      exec: () => new Promise((resolve, reject) => { resolve(foundProducts) })
    }))
    
    const next = err => {
      expect(err).toBeFalsy()

      expect(foundProducts[0].customs.length).toBe(0)
      expect(foundProducts[0].customs.pull.mock.calls.length).toBe(1)
      expect(foundProducts[0].customs.pull.mock.calls[0][0]).toEqual({ _id: 'ajua' })
      expect(foundProducts[0].save.mock.calls.length).toBe(1)

      expect(foundProducts[1].customs.length).toBe(1)
      expect(foundProducts[1].customs.pull.mock.calls.length).toBe(0)
      expect(foundProducts[1].save.mock.calls.length).toBe(0)
      done()
    }

    boundMiddleware(next)
  })

  test('Should call next with Product.find Error', done => {
    const maxUpdated = { min: '450', max: '500' }
    const _update = maxUpdated

    const boundMiddleware = bindMiddleware({ _conditions: { _id: 'pinacolada' }, _update })
    Product.find = jest.fn(() => ({
      exec: () => new Promise((resolve, reject) => { reject(new Error('Test error fetching products')) })
    }))
    const next = err => {
      expect( err.message ).toBe('Test error fetching products')
      done()
    }

    boundMiddleware(next)
  })

  test('Should call next with products error', done => {
    const maxUpdated = { min: '450', max: '500' }
    const _update = maxUpdated

    const boundMiddleware = bindMiddleware({ _conditions: { _id: 'pinacolada' }, _update })

    const foundProduct = { 
      customs: [{ 
        _id: 'ajua', 
        custom_id: 'pinacolada', 
        value: '900' 
      }], 
      save: jest.fn(() => new Promise((resolve, reject) => { reject(new Error('Smoothie Error')) }))
    }
    foundProduct.customs.pull = jest.fn(() => { foundProduct.customs.pop() })

    Product.find = jest.fn(() => ({
      exec: () => new Promise((resolve, reject) => { resolve([foundProduct]) })
    }))
    const next = err => {
      expect( err.message ).toBe('Smoothie Error')
      done()
    }

    boundMiddleware(next)
  })

  test('Should prevent modification of the store and return a ValidationError', done => {
    const newField  = { store: 'what_a_slug' }
    const _update = newField
    const boundMiddleware = bindMiddleware({ _update })
    const next = err => {
      expect(err.name).toBe('ValidationError')
      expect(err.message).toBe('Store is not updatable')
      done()
    }

    boundMiddleware(next)
  })

  test('Should prevent modification of the name and return a ValidationError', done => {
    const newField  = { name: 'what_a_slug' }
    const _update = newField
    const boundMiddleware = bindMiddleware({ _update })
    const next = err => {
      expect(err.name).toBe('ValidationError')
      expect(err.message).toBe('Name should be updated via CustomField.save')
      done()
    }

    boundMiddleware(next)
  })

  test('Should prevent modification of the slug and return a ValidationError', done => {
    const newField  = { slug: 'what_a_slug' }
    const _update = newField
    const boundMiddleware = bindMiddleware({ _update })
    const next = err => {
      expect(err.name).toBe('ValidationError')
      expect(err.message).toBe('Slug is not updatable')
      done()
    }

    boundMiddleware(next)
  })

  test('Should prevent modification of type and return a ValidationError', done => {
    const newField  = { type: 'string' }
    const _update = newField
    const boundMiddleware = bindMiddleware({ _update })
    const next = err => {
      expect(err.name).toBe('ValidationError')
      expect(err.message).toBe('Type is not updatable')
      done()
    }

    boundMiddleware(next)
  })

  test('Should call next with values error', done => {
    const newField  = { values: [{ value: 'heyhey' }] }
    const _update = newField
    const boundMiddleware = bindMiddleware({ _update })
    const next = err => {
      expect(err.name).toBe('ValidationError')
      expect(err.message).toBe('Values should be updated via CustomField.save')
      done()
    }

    boundMiddleware(next)
  })

  test('Should call next with _values error', done => {
    const newField  = { _values: ['something'] }
    const _update = newField
    const boundMiddleware = bindMiddleware({ _update })
    const next = err => {
      expect(err.name).toBe('ValidationError')
      expect(err.message).toBe('_values is not updatable')
      done()
    }

    boundMiddleware(next)
  })

})