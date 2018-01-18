const moment = require('moment')
const HMProduct = require('../HMProduct')
const Product = require('../Product')

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

      const boundMiddlewareFunc = bindMiddleware({ _udpate: context })

      boundMiddlewareFunc(next)

      expect( next.mock.calls.length ).toBe(1)
    })

    // test('Should add created_at and updated_at', async () => {
    //   const context = validClient

    //   const boundMiddlewareFunc = Client.schema._middlewareFuncs.preSave.bind(context)
    //   const next = jest.fn()

    //   await boundMiddlewareFunc(next)

    //   expect( isThisMinute(validClient.created_at) ).toBeTruthy()
    //   expect( isThisMinute(validClient.updated_at) ).toBeTruthy()
    // })

    // test('Should modify updated_at but not created_at', async () => {
    //   const creationDate = moment().subtract(1, 'weeks').toDate()
    //   Object.assign( validClient, { created_at: creationDate, updated_at: creationDate } )

    //   const context = validClient

    //   const boundMiddlewareFunc = Client.schema._middlewareFuncs.preSave.bind(context)
    //   const next = jest.fn()

    //   await boundMiddlewareFunc(next)
      
    //   expect( validClient.created_at ).toBe(creationDate)
    //   expect( isThisMinute(validClient.updated_at) ).toBeTruthy()
    // })

    test('Should update updated_at date')

    test('Materials should iterate materials for duplicates and call next with error')

    test('Should iterate on every material\'s models for duplicates and call next with error')

  })

  describe('preRemove Middleware', () => {

    test('Should call next')

    test('Should call stores find with the id')

    test('Should update found stores and call save')

  })

})