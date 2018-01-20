const moment = require('moment')

jest.mock('../Store')
const Store = require('../Store')
const Client = require('../Client')

const models = require('../../utils/models')
const { howManyKeys } = require('../../utils')
const { isThisMinute } = require('../../utils/validators')
const { getValidClient } = require('../../utils/validSchemas')

describe('Client model', () => {
  let validClient

  beforeEach(() => { validClient = getValidClient() })

  test('Should be valid', () => {
    const m = new Client(validClient)
    const v = m.validateSync()

    expect(v).toBeFalsy()
  })

  test('Should be invalid if missing: name, email', () => {
    const m = new Client( Object.assign(validClient, { name: undefined, email: undefined, password: undefined }) )
    const v = m.validateSync()

    expect(howManyKeys(v.errors)).toBe(2)
    expect(v.errors.name).toBeTruthy()
    expect(v.errors.email).toBeTruthy()
  })

  test('Should be invalid if Wishlist Product id is empty', () => {
    const m = new Client( Object.assign(validClient, { wishlist: [ '' ] }) )
    const v = m.validateSync()

    expect(howManyKeys(v.errors)).toBe(1)
    expect(v.errors['wishlist']).toBeTruthy()
  })
  
  test('Should be invalid if Wishlist Product id is wrong', () => {
    const m = new Client( Object.assign(validClient, { wishlist: [ 'somewrongid' ] }) )
    const v = m.validateSync()

    expect(howManyKeys(v.errors)).toBe(1)
    expect(v.errors['wishlist']).toBeTruthy()
  })

  test('Should be invalid if address is malformed', () => {
    const m = new Client( Object.assign(validClient, { addresses: [ 'supbabe' ] }) )
    const v = m.validateSync()

    expect(howManyKeys(v.errors)).toBe(1)
    expect(v.errors.addresses).toBeTruthy()
  })

  test('Should be invalid if order id is empty', () => {
    const m = new Client( Object.assign(validClient, { orders: [ '' ] }) )
    const v = m.validateSync()

    expect(howManyKeys(v.errors)).toBe(1)
    expect(v.errors.orders).toBeTruthy()
  })

  test('Should be invalid if order id is malformed', () => {
    const m = new Client( Object.assign(validClient, { orders: [ 'supbabe' ] }) )
    const v = m.validateSync()

    expect(howManyKeys(v.errors)).toBe(1)
    expect(v.errors.orders).toBeTruthy()
  })

  describe('preSave Middleware', () => {
    const bindMiddleware = context => 
      Client.schema._middlewareFuncs.preSave.bind(context)

    test('Should call next', done => {
      const context = validClient

      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(err).toBeFalsy()
        done()
      }

      boundMiddleware(next)
    })

    test('Should add created_at and updated_at', done => {
      const context = validClient

      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(err).toBeFalsy()        
        expect( isThisMinute(validClient.created_at) ).toBeTruthy()
        expect( isThisMinute(validClient.updated_at) ).toBeTruthy()
        done()
      }

      boundMiddleware(next)
    })

    test('Should modify updated_at but not created_at', done => {
      const creationDate = moment().subtract(1, 'weeks').toDate()
      Object.assign( validClient, { created_at: creationDate, updated_at: creationDate } )
      const context = validClient

      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(err).toBeFalsy()
        expect( validClient.created_at ).toBe(creationDate)
        expect( isThisMinute(validClient.updated_at) ).toBeTruthy()
        done()
      }

      boundMiddleware(next)
    })

    test('Should encrypt password before saving it', done => {
      hashSpy = jest.spyOn(models, 'hashPassword')

      const context = validClient

      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(err).toBeFalsy()
        expect( hashSpy ).toHaveBeenCalled()
        expect( context.password ).toBeTruthy()
        expect( context.salt ).toBeTruthy()
        models.hashPassword.mockRestore()      
        done()
      }

      boundMiddleware(next)
    })

    test('Shoul call next with no password error', done => {
      delete validClient.password
      const context = validClient
      context.isNew = true

      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(err.name).toBe('ValidationError')
        expect(err.message).toBe('Password Required')
        done()
      }

      boundMiddleware(next)
    })

    test('Should call next with encryption error', async () => {
      const oldHashPswd = models.hashPassword
      const context = validClient
      models.hashPassword = jest.fn( () => new Promise((resolve, reject) => { reject(new Error('hola_amigo')) }) )

      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect( err.message ).toBe('hola_amigo')
        models.hashPassword = oldHashPswd
      }

      boundMiddleware(next)
    })

  })

  describe('preUpdate Middleware', () => {

    test('Should call next', async () => {
      const boundMiddlewareFunc = Client.schema._middlewareFuncs.preUpdate
      .bind({ _update: validClient })
      const next = jest.fn()

      await boundMiddlewareFunc(next)

      expect( next.mock.calls.length ).toBe(1)
    })

    test('Should update updated_at date', async () => {
      const creationDate = moment().subtract(1, 'weeks').toDate()
      Object.assign( validClient, { created_at: creationDate, updated_at: creationDate } )

      const updateObj = validClient

      const boundMiddlewareFunc = Client.schema._middlewareFuncs.preUpdate
      .bind({ _update: updateObj })
      const next = jest.fn()

      await boundMiddlewareFunc(next)

      expect( validClient.created_at ).toBe(creationDate)
      expect( isThisMinute(validClient.updated_at) ).toBeTruthy()
    })  

    test('Should encrypt password before saving', async () => {
      hashSpy = jest.spyOn(models, 'hashPassword')

      const context = { password: 'newpas' }

      const boundMiddlewareFunc = Client.schema._middlewareFuncs.preUpdate.bind({ _update: context })
      const next = jest.fn()

      await boundMiddlewareFunc(next)

      expect( hashSpy ).toHaveBeenCalled()
      expect( context.password ).toBeTruthy()
      expect( context.salt ).toBeTruthy()
      models.hashPassword.mockRestore()
    })

    test('Should call next with encryption error', async () => {
      const oldHashPswd = models.hashPassword
      const context = { password: 'newpas' }
      models.hashPassword = jest.fn( () => new Promise((resolve, reject) => { reject(new Error('hola_amigo')) }) )

      const boundMiddleware = Client.schema._middlewareFuncs.preUpdate.bind({ _update: context })
      const next = jest.fn(err => { if (err) throw err })

      try {
        await boundMiddleware(next)
        expect(1).toBe(0)
      } catch (e) {
        expect( next.mock.calls.length ).toBe(1)
        expect( next.mock.calls[0][0].message ).toBe('hola_amigo')
        models.hashPassword = oldHashPswd
      }
    })

  })

  describe('preRemove Middleware', () => {
    let next

    beforeEach(() => {
      Store.find = jest.fn(() => new Promise((resolve, reject) => { resolve([]) }))
      next = jest.fn((err) => { if (err) throw err })
    })

    const bindMiddleware = context => 
      Client.schema._middlewareFuncs.preRemove.bind(context)

    test('Should call next', async () => {
      const _conditions = { _id: 'jarrito_loco' }
      const boundMiddleware = bindMiddleware({ _conditions })

      await boundMiddleware(next)

      expect( next.mock.calls.length ).toBe(1)
    })

    test('Should call Store.find with the client id', async () => {
      const _conditions = { _id: 'jarrito_loco' }
      const boundMiddleware = bindMiddleware({ _conditions })
      const expectedQuery = { clients: 'jarrito_loco' }

      await boundMiddleware(next)

      expect( Store.find.mock.calls.length ).toBe(1)
      expect( Store.find.mock.calls[0][0] ).toEqual(expectedQuery)
    })

    test('Should update and save found stores', async () => {
      const _conditions = { _id: 'jarrito_loco' }
      const boundMiddleware = bindMiddleware({ _conditions })
      const foundStores = [{
        clients: ['jarrito_loco'],
        save: jest.fn()
      },{
        clients: ['a_client', 'jarrito_loco'],
        save: jest.fn()
      }]
      foundStores[0].clients.pull = jest.fn(() => { foundStores[0].clients.pop() })
      foundStores[1].clients.pull = jest.fn(() => { foundStores[1].clients.pop() })

      Store.find = jest.fn(() => new Promise((resolve, reject) => { resolve(foundStores) }))

      await boundMiddleware(next)

      expect( foundStores[0].clients.length ).toBe(0)
      expect( foundStores[0].clients.pull.mock.calls.length ).toBe(1)
      expect( foundStores[0].clients.pull.mock.calls[0][0] ).toBe('jarrito_loco')
      expect( foundStores[0].save.mock.calls.length ).toBe(1)

      expect( foundStores[1].clients.length ).toBe(1)
      expect( foundStores[1].clients.pull.mock.calls.length ).toBe(1)
      expect( foundStores[1].clients.pull.mock.calls[0][0] ).toBe('jarrito_loco')
      expect( foundStores[1].save.mock.calls.length ).toBe(1)
    })

    test('Should call next with store update error', async () => {
      const _conditions = { _id: 'jarrito_loco' }
      const boundMiddleware = bindMiddleware({ _conditions })
      const foundStores = [{
        clients: ['jarrito_loco'],
        save: jest.fn(() => { throw new Error('Se rompio el jarrito :c') })
      },{
        clients: ['a_client', 'jarrito_loco'],
        save: jest.fn(() => { throw new Error('Se rompio el jarrito :c') })
      }]
      foundStores[0].clients.pull = jest.fn(() => { foundStores[0].clients.pop() })
      foundStores[1].clients.pull = jest.fn(() => { foundStores[1].clients.pop() })

      Store.find = jest.fn(() => new Promise((resolve, reject) => { resolve(foundStores) }))      

      try {
        await boundMiddleware(next)
      } catch (e) {
        expect( next.mock.calls.length ).toBe(1)
        expect( next.mock.calls[0][0].message ).toBe('Se rompio el jarrito :c')
      }
    })

  })

})