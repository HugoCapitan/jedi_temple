const moment = require('moment')

jest.mock('../Store')
const Store = require('../Store')
const HMProduct = require('../HMProduct')

const uCommon = require('../../utils')
const valid = require('../../utils/validators')
const uSchemas = require('../../utils/validSchemas')

describe('HMProduct Model', () => {
  let validHMProduct

  beforeEach(() => { validHMProduct = uSchemas.getValidHMProduct() })

  test('Should be valid', () => {
    const m = new HMProduct(validHMProduct)
    const v = m.validateSync()

    expect(v).toBeFalsy()
  })

  test('Should be invalid if empty name', () => {
    const m = new HMProduct( Object.assign(validHMProduct, { name: undefined }) )
    const v = m.validateSync()

    expect(uCommon.howManyKeys(v.errors)).toBe(1)
    expect(v.errors.name).toBeTruthy()
  })

  describe('Material subschema', () => {

    test('Should be invalid if material missing price or material', () => {
      const malformedMaterial = uSchemas.getValidHMProduct()
      malformedMaterial.materials[0].price = undefined
      malformedMaterial.materials[0].material = undefined

      const m = new HMProduct( malformedMaterial )
      const v = m.validateSync()

      expect(uCommon.howManyKeys(v.errors)).toBe(2)
      expect(v.errors['materials.0.material']).toBeTruthy()
      expect(v.errors['materials.0.price']).toBeTruthy()
    })

  })

  describe('preSave Middleware', () => {
    let next
    const bindMiddleware = context => 
      HMProduct.schema._middlewareFuncs.preSave.bind(context)

    beforeEach(() => { 
      next = jest.fn(err => { if (err) throw err })
    })

    test('Should call next', () => {
      const context = { name: 'bracelet' }

      const boundMiddlewareFunc = bindMiddleware(context)

      boundMiddlewareFunc(next)

      expect( next.mock.calls.length ).toBe(1)
    })

    test('Should add created_at and updated_at', async () => {
      const context = { name: 'bracelet' }

      const boundMiddlewareFunc = bindMiddleware(context)

      boundMiddlewareFunc(next)

      expect( valid.isThisMinute(context.created_at) ).toBeTruthy()
      expect( valid.isThisMinute(context.updated_at) ).toBeTruthy()
    })

    test('Should modify updated_at but not created_at', async () => {
      const creationDate = moment().subtract(1, 'weeks').toDate()
      const context = { name: 'bracelet', created_at: creationDate, updated_at: creationDate }

      const boundMiddlewareFunc = bindMiddleware(context)

      boundMiddlewareFunc(next)
      
      expect( context.created_at ).toBe(creationDate)
      expect( valid.isThisMinute(context.updated_at) ).toBeTruthy()
    })

    test('Materials should iterate materials for duplicates and call next with error', () => {
      const context = { 
        name: 'canastita', 
        materials: [{ 
          name: 'olakease',
          models: []
        }, { 
          name: 'hola que haces',
          models: [] 
        }, { 
          name: 'olakease',
          models: []
        }] 
      }

      const boundMiddlewareFunc = bindMiddleware(context)

      try {
        boundMiddlewareFunc(next)
      } catch (e) {
        expect( next.mock.calls.length ).toBe(1)
        expect( next.mock.calls[0][0].name ).toBe('ValidationError')
        expect( next.mock.calls[0][0].message ).toBe('Duplicated value for materials in canastita HMProduct')
      }
    })

    test('Should iterate on every material\'s models for duplicates and call next with error', () => {
      const context = { 
        name: 'canastita', 
        materials: [{ 
          name: 'olakease',
          models: ['nadanada', 'mucho', 'nadanada']
        }, { 
          name: 'hola que haces',
          models: [] 
        }] 
      }

      const boundMiddlewareFunc = bindMiddleware(context)

      try {
        boundMiddlewareFunc(next)
      } catch (e) {
        expect( next.mock.calls.length ).toBe(1)
        expect( next.mock.calls[0][0].name ).toBe('ValidationError')
        expect( next.mock.calls[0][0].message ).toBe('Duplicated value for models in material olakease in canastita HMProduct')
      }
    })

  })

  describe('preUpdate Middleware', () => {
    let next
    const bindMiddleware = context => 
      HMProduct.schema._middlewareFuncs.preUpdate.bind(context)

    beforeEach(() => { 
      next = jest.fn(err => { if (err) throw err })
    })

    test('Should call next', () => {
      const context = { name: 'bracelet' }

      const boundMiddlewareFunc = bindMiddleware({ _update: context })

      boundMiddlewareFunc(next)

      expect( next.mock.calls.length ).toBe(1)
    })

    test('Should update updated_at date', () => {
      const context = {  }

      const boundMiddlewareFunc = bindMiddleware({ _update: context })

      boundMiddlewareFunc(next)

      expect( context.hasOwnProperty('created_at') ).toBe(false)
      expect( valid.isThisMinute(context.updated_at) ).toBe(true)
    })    

    test('Should throw error if materials', () => {
      const context = { materials: [] }

      const boundMiddlewareFunc = bindMiddleware({ _update: context })

      try {
        boundMiddlewareFunc(next)
        expect(0).toBe(1)
      } catch (e) {
        expect( next.mock.calls.length ).toBe(1)
        expect( next.mock.calls[0][0].name ).toBe('ValidationError')
        expect( next.mock.calls[0][0].message ).toBe('Materials should be updated via HMProduct.save')
      }
    })    

  })

  describe('preRemove Middleware', () => {
    let next
    const bindMiddleware = context => 
      HMProduct.schema._middlewareFuncs.preRemove.bind(context)

    beforeEach(() => { 
      Store.find = jest.fn(() => new Promise((resolve, reject) => { resolve([]) }))
      next = jest.fn(err => { if (err) throw err })
    })

    test('Should call next', async () => {
      const _conditions = { _id: 'cafe_lechero' }
      const boundMiddlewareFunc = bindMiddleware({ _conditions })

      await boundMiddlewareFunc(next)

      expect( next.mock.calls.length ).toBe(1)
    })

    test('Should call Store.find with the hmproduct id', async () => {
      const _conditions = { _id: 'cafe_lechero' }
      const boundMiddleware = bindMiddleware({ _conditions })
      const expectedQuery = { hm_products: 'cafe_lechero' }

      await boundMiddleware(next)

      expect( Store.find.mock.calls.length ).toBe(1)
      expect( Store.find.mock.calls[0][0] ).toEqual(expectedQuery)
    })

    test('Should update and save found stores', async () => {
      const _conditions = { _id: 'cafe_lechero' }
      const boundMiddleware = bindMiddleware({ _conditions })
      const foundStores = [{
        hm_products: ['cafe_lechero'],
        save: jest.fn()
      },{
        hm_products: ['a_hmprod', 'cafe_lechero'],
        save: jest.fn()
      }]
      foundStores[0].hm_products.pull = jest.fn(() => { foundStores[0].hm_products.pop() })
      foundStores[1].hm_products.pull = jest.fn(() => { foundStores[1].hm_products.pop() })

      Store.find = jest.fn(() => foundStores)

      await boundMiddleware(next)

      expect( foundStores[0].hm_products.length ).toBe(0)
      expect( foundStores[0].hm_products.pull.mock.calls.length ).toBe(1)
      expect( foundStores[0].hm_products.pull.mock.calls[0][0] ).toBe('cafe_lechero')
      expect( foundStores[0].save.mock.calls.length ).toBe(1)

      expect( foundStores[1].hm_products.length ).toBe(1)
      expect( foundStores[1].hm_products.pull.mock.calls.length ).toBe(1)
      expect( foundStores[1].hm_products.pull.mock.calls[0][0] ).toBe('cafe_lechero')
      expect( foundStores[1].save.mock.calls.length ).toBe(1)
    })

    test('Should call next with store update error', async () => {
      const _conditions = { _id: 'cafe_lechero' }
      const boundMiddleware = bindMiddleware({ _conditions })
      const foundStores = [{
        hm_products: ['cafe_lechero'],
        save: jest.fn(() => { throw new Error('Se enfrio el cafe :c') })
      },{
        hm_products: ['a_client', 'cafe_lechero'],
        save: jest.fn(() => { throw new Error('Se enfrio el cafe :c') })
      }]
      foundStores[0].hm_products.pull = jest.fn(() => { foundStores[0].hm_products.pop() })
      foundStores[1].hm_products.pull = jest.fn(() => { foundStores[1].hm_products.pop() })

      Store.find = jest.fn(() => foundStores)

      try {
        await boundMiddleware(next)
      } catch (e) {
        expect( next.mock.calls.length ).toBe(1)
        expect( next.mock.calls[0][0].message ).toBe('Se enfrio el cafe :c')
      }
    })

  })

})