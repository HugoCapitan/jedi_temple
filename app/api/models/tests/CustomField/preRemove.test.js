const CustomField = require('../../CustomField')
jest.mock('../../Product')
const Product = require('../../Product')

const uSchemas = require('../../../utils/validSchemas')

describe('preRemove Middleware', () => {
  let validNumberCustom, validStringCustom

  const bindMiddleware = (context) => 
    CustomField.schema._middlewareFuncs.preRemove.bind(context) 

  beforeEach(() => {
    validNumberCustom = uSchemas.getValidNumberCustom()
    validStringCustom = uSchemas.getValidStringCustom()

    Product.find = jest.fn(() => ({
      exec: () => new Promise((resolve, reject) => { resolve([]) })
    }))

    Product.prototype.save = jest.fn(() => new Promise((resolve, reject) => { resolve() }))
  })
  
  test('Should call next', done => {
    const _conditions = { _id: 'chocobanana' }
    const boundMiddleware = bindMiddleware({ _conditions })
    const next = err => {
      expect(err).toBeFalsy()
      done()
    }

    boundMiddleware(next)
  })

  test('Should call product.find with the custom id', done => {
    const _conditions = { _id: 'chocobanana' }
    const boundMiddleware = bindMiddleware({ _conditions })
    const expectedQuery = { customs: { $elemMatch: { custom_id: 'chocobanana' } } }
    const next = err => {
      expect(err).toBeFalsy()
      expect( Product.find.mock.calls.length ).toBe(1)
      expect( Product.find.mock.calls[0][0] ).toEqual(expectedQuery)
      done()
    }

    boundMiddleware(next)
  }) 

  test('Should iterate and update products', done=> {
    const _conditions = { _id: 'chocobanana' }
    const boundMiddleware = bindMiddleware({ _conditions })

    const foundProducts = [{ 
      customs: [{ _id: 'milkshake', custom_id: 'vanilla' }, { _id: 'smoothie', custom_id: 'chocobanana' }],
      save: jest.fn(() => new Promise((resolve, reject) => { resolve() }))
    },{ 
      customs: [{ _id: 'frapuccino', custom_id: 'chocobanana' }],
      save: jest.fn(() => new Promise((resolve, reject) => { resolve() }))
    }]
    foundProducts[0].customs.pull = jest.fn(() => { foundProducts[0].customs.pop() })
    foundProducts[1].customs.pull = jest.fn(() => { foundProducts[1].customs.pop() })
    Product.find = jest.fn(() => ({
      exec: () => new Promise((resolve, reject) => { resolve(foundProducts) })
    }))

    const next = err => {
      expect(err).toBeFalsy()
      expect( foundProducts[0].customs.length ).toBe(1)
      expect( foundProducts[0].customs.pull.mock.calls.length ).toBe(1)
      expect( foundProducts[0].customs.pull.mock.calls[0][0] ).toEqual({ _id: 'smoothie' })
      expect( foundProducts[0].save.mock.calls.length ).toBe(1)

      expect( foundProducts[1].customs.length ).toBe(0)
      expect( foundProducts[1].customs.pull.mock.calls.length ).toBe(1)
      expect( foundProducts[1].customs.pull.mock.calls[0][0] ).toEqual({ _id: 'frapuccino' })
      expect( foundProducts[1].save.mock.calls.length ).toBe(1)
      done()
    }

    boundMiddleware(next)     
  })

  test('Should call next with Product.find Error', done => {
    const _conditions = { _id: 'chocobanana' }
    const boundMiddleware = bindMiddleware({ _conditions })
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
    const _conditions = { _id: 'chocobanana' }
    const boundMiddleware = bindMiddleware({ _conditions })

    const foundProduct = { 
      customs: [{ _id: 'smoothie', custom_id: 'chocobanana' }],
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

})
