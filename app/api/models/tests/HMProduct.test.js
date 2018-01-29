const moment = require('moment')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const HMProduct = require('../HMProduct')
jest.mock('../Store')
const Store = require('../Store')

const uCommon = require('../../utils')
const uValid = require('../../utils/validators')
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

    test('Should be invalid if material missing price or name', () => {
      const malformedMaterial = uSchemas.getValidHMProduct()
      malformedMaterial.materials[0].material_name = undefined
      malformedMaterial.materials[0].material_price = undefined

      const m = new HMProduct( malformedMaterial )
      const v = m.validateSync()

      expect(uCommon.howManyKeys(v.errors)).toBe(2)
      expect(v.errors['materials.0.material_name']).toBeTruthy()
      expect(v.errors['materials.0.material_price']).toBeTruthy()
    })

  })

  describe('Model Subschema', () => {
  
    test('Should be invalid if missing model_name or material_id', () => {
      const malformedModel = Object.assign(uSchemas.getValidHMProduct(), { models: [ {} ] })

      const m = new HMProduct(malformedModel)
      const v = m.validateSync()

      expect( uCommon.howManyKeys(v.errors) ).toBe(2)
      expect(v.errors['models.0.model_name']).toBeTruthy()
      expect(v.errors['models.0.material_id']).toBeTruthy()
    })

  })

  describe('preSave Middleware', () => {
    let validHMProduct
    const bindMiddleware = context => 
      HMProduct.schema._middlewareFuncs.preSave.bind(context)

    beforeEach(() => {
      validHMProduct = uSchemas.getValidHMProduct()
    })

    test('Should call next', done => {
      const context = validHMProduct
      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(err).toBeFalsy()
        done()
      }

      boundMiddleware(next)
    })

    test('Should add created_at and updated_at', done => {
      const context = validHMProduct
      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(err).toBeFalsy()
        expect( uValid.isThisMinute(context.created_at) ).toBeTruthy()
        expect( uValid.isThisMinute(context.updated_at) ).toBeTruthy()
        done()
      }

      boundMiddleware(next)
    })

    test('Should modify updated_at but not created_at', done => {
      const creationDate = moment().subtract(1, 'weeks').toDate()
      const context = { ...validHMProduct, created_at: creationDate, updated_at: creationDate }
      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(err).toBeFalsy()
        expect(context.created_at).toBe(creationDate)
        expect( uValid.isThisMinute(context.updated_at) ).toBeTruthy()
        done()
      }

      boundMiddleware(next)
    })

    test('Should iterate materials for duplicates and call next with error', done => {
      const context = { 
        ...validHMProduct, 
        materials: [{ 
          material_name: 'olakease'
        }, { 
          material_name: 'hola que haces'
        }, { 
          material_name: 'olakease'
        }] 
      }
      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(err.message).toBe(`Duplicated value for materials in ${validHMProduct.name} HMProduct`)
        expect(err.name).toBe('ValidationError')
        done()
      }
      
      boundMiddleware(next)
    })

    test('Should iterate models and remove model if wrong material_id', done => {
      const context = validHMProduct
      context.materials[0]._id = new ObjectId('ffffffffffffffffffffffff')

      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(err).toBeFalsy()
        expect(context.models.length).toBe(0)
        done()
      }

      boundMiddleware(next)
    })

    test('Should iterate models and remove model if wrong material_id', done => {
      const context = validHMProduct
      context.materials[0]._id = new ObjectId('ffffffffffffffffffffffff')
      context.models.push({ model_name: 'hehe modelo rarito', material_id: context.materials[0]._id })
      context.models.push({ model_name: 'hehe otro rarito', material_id: new ObjectId('a0a0a0a0a0a0a0a0a00a0a0a') })

      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(err).toBeFalsy()
        expect(context.models.length).toBe(1)
        expect(context.models[0].model_name).toBe('hehe otro rarito')
        done()
      }

      boundMiddleware(next)
    })

    test('Should iterate models and return error if duplications for same material', done => {
      newMatId = new ObjectId('affaffaffaffaffaffaffaff')
      validHMProduct.materials.push({ 
        _id: newMatId,
        material_name: 'some fcking name',
        material_price: 459.99 
      })
      const context = {
        ...validHMProduct,
        models: [{
          model_name: 'superduper', material_id: validHMProduct.materials[0]._id
        },{
          model_name: 'superduper', material_id: validHMProduct.materials[1]._id
        },{
          model_name: 'hehehe', material_id: validHMProduct.materials[0]._id
        },{
          model_name: 'superduper', material_id: validHMProduct.materials[0]._id // <- Duplication 
        }]
      }
      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(err.message).toBe(`Duplicated value for model in ${validHMProduct.name} HMProduct`)
        expect(err.name).toBe('ValidationError')
        done()
      }

      boundMiddleware(next)
    })

  })

  describe('preUpdate Middleware', () => {
    const bindMiddleware = context => 
      HMProduct.schema._middlewareFuncs.preUpdate.bind(context)

    test('Should call next', done => {
      const context = { name: 'bracelet' }
      const boundMiddlewareFunc = bindMiddleware({ _update: context })
      const next = err => {
        expect(err).toBeFalsy()
        done()
      }

      boundMiddlewareFunc(next)
    })

    test('Should update updated_at date', done => {
      const context = {  }
      const boundMiddlewareFunc = bindMiddleware({ _update: context })
      const next = err => {
        expect(err).toBeFalsy()
        expect( context.hasOwnProperty('created_at') ).toBe(false)
        expect( uValid.isThisMinute(context.updated_at) ).toBe(true)
        done()
      }

      boundMiddlewareFunc(next)
    })    

    test('Should throw error if materials', done => {
      const context = { materials: [] }
      const boundMiddlewareFunc = bindMiddleware({ _update: context })
      const next = err => {
        expect(err.name).toBe('ValidationError')
        expect(err.message).toBe('Materials should be updated via HMProduct.save')
        done()
      }

      boundMiddlewareFunc(next)
    })    

  })

  describe('preRemove Middleware', () => {
    const bindMiddleware = context => 
      HMProduct.schema._middlewareFuncs.preRemove.bind(context)

    beforeEach(() => { 
      Store.find = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve([]) })
      }))
    })

    test('Should call next', done => {
      const _conditions = { _id: 'cafe_lechero' }
      const boundMiddlewareFunc = bindMiddleware({ _conditions })
      const next = err => {
        expect(err).toBeFalsy()
        done()
      }

      boundMiddlewareFunc(next)
    })

    test('Should call Store.find with the hmproduct id', done => {
      const _conditions = { _id: 'cafe_lechero' }
      const boundMiddleware = bindMiddleware({ _conditions })
      const expectedQuery = { hm_products: 'cafe_lechero' }
      const next = err => {
        expect(err).toBeFalsy()
        expect(Store.find.mock.calls.length).toBe(1)
        expect(Store.find.mock.calls[0][0]).toEqual(expectedQuery)
        done()
      } 

      boundMiddleware(next)
    })

    test('Should update and save found stores', done => {
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

      Store.find = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve(foundStores) })
      }))

      const next = err => {
        expect(err).toBeFalsy()

        expect( foundStores[0].hm_products.length ).toBe(0)
        expect( foundStores[0].hm_products.pull.mock.calls.length ).toBe(1)
        expect( foundStores[0].hm_products.pull.mock.calls[0][0] ).toBe('cafe_lechero')
        expect( foundStores[0].save.mock.calls.length ).toBe(1)

        expect( foundStores[1].hm_products.length ).toBe(1)
        expect( foundStores[1].hm_products.pull.mock.calls.length ).toBe(1)
        expect( foundStores[1].hm_products.pull.mock.calls[0][0] ).toBe('cafe_lechero')
        expect( foundStores[1].save.mock.calls.length ).toBe(1)

        done()
      }

      boundMiddleware(next)
    })

    test('Should call next with store find error', done => {
      const _conditions = { _id: 'cafe_lechero' }
      const boundMiddleware = bindMiddleware({ _conditions })

      Store.find = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { reject(new Error('Test error fetching stores')) })
      }))

      const next = err => {
        expect(err.message).toBe('Test error fetching stores')
        done()      
      }

      boundMiddleware(next)
    })

    test('Should call next with store update error', done => {
      const _conditions = { _id: 'cafe_lechero' }
      const boundMiddleware = bindMiddleware({ _conditions })
      const foundStores = [{
        hm_products: ['cafe_lechero'],
        save: jest.fn(() => new Promise((resolve, reject) => { resolve() }))
      },{
        hm_products: ['a_client', 'cafe_lechero'],
        save: jest.fn(() => new Promise((resolve, reject) => { reject(new Error('Se enfrio el cafe :c')) }))
      }]
      foundStores[0].hm_products.pull = jest.fn(() => { foundStores[0].hm_products.pop() })
      foundStores[1].hm_products.pull = jest.fn(() => { foundStores[1].hm_products.pop() })

      Store.find = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve(foundStores) })
      }))

      const next = err => {
        expect( err.message ).toBe('Se enfrio el cafe :c')
        done()      
      }

      boundMiddleware(next)
    })

  })

})