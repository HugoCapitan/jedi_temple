const moment = require('moment')

const Client = require('../Client')

const models = require('../../utils/models')
const uCommon = require('../../utils')
const uValid = require('../../utils/validators')
const uSchemas = require('../../utils/validSchemas')

describe('Client model', () => {
  let validClient

  beforeEach(() => { validClient = uSchemas.getValidClient() })

  test('Should be valid', () => {
    const m = new Client(validClient)
    const v = m.validateSync()

    expect(v).toBeFalsy()
  })

  test('Should be invalid if missing: name, email', () => {
    const m = new Client( Object.assign(validClient, { name: undefined, email: undefined, password: undefined, store: undefined }) )
    const v = m.validateSync()

    expect(uCommon.howManyKeys(v.errors)).toBe(4)
    expect(v.errors.name).toBeTruthy()
    expect(v.errors.email).toBeTruthy()
    expect(v.errors.password).toBeTruthy()
    expect(v.errors.store).toBeTruthy()
  })

  test('Should be invalid if Wishlist Product id is empty', () => {
    const m = new Client( Object.assign(validClient, { wishlist: [ '' ] }) )
    const v = m.validateSync()

    expect(uCommon.howManyKeys(v.errors)).toBe(1)
    expect(v.errors['wishlist']).toBeTruthy()
  })
  
  test('Should be invalid if Wishlist Product id is wrong', () => {
    const m = new Client( Object.assign(validClient, { wishlist: [ 'somewrongid' ] }) )
    const v = m.validateSync()

    expect(uCommon.howManyKeys(v.errors)).toBe(1)
    expect(v.errors['wishlist']).toBeTruthy()
  })

  test('Should be invalid if address is malformed', () => {
    const m = new Client( Object.assign(validClient, { addresses: [ 'supbabe' ] }) )
    const v = m.validateSync()

    expect(uCommon.howManyKeys(v.errors)).toBe(1)
    expect(v.errors.addresses).toBeTruthy()
  })

  test('Should be invalid if order id is empty', () => {
    const m = new Client( Object.assign(validClient, { orders: [ '' ] }) )
    const v = m.validateSync()

    expect(uCommon.howManyKeys(v.errors)).toBe(1)
    expect(v.errors.orders).toBeTruthy()
  })

  test('Should be invalid if order id is malformed', () => {
    const m = new Client( Object.assign(validClient, { orders: [ 'supbabe' ] }) )
    const v = m.validateSync()

    expect(uCommon.howManyKeys(v.errors)).toBe(1)
    expect(v.errors.orders).toBeTruthy()
  })

  describe('preSave Middleware', () => {
    const bindMiddleware = context => {
      if (!context.hasOwnProperty('isModified')) context.isModified = jest.fn(() => false)
      if (!context.hasOwnProperty('isNew'))      context.isNew = true
      return Client.schema._middlewareFuncs.preSave.bind(context)
    }

    test('Should call next', done => {
      const context = validClient
      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(err).toBeFalsy()
        done()
      }

      boundMiddleware(next)
    })

    test('Should add uniqueness', done => {
      const context = validClient
      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(context.uniqueness).toBe('kampamocha__some@email.com')
        done()
      }

      boundMiddleware(next)
    })

    test('Should add created_at and updated_at', done => {
      const context = validClient

      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(err).toBeFalsy()        
        expect( uValid.isThisMinute(validClient.created_at) ).toBeTruthy()
        expect( uValid.isThisMinute(validClient.updated_at) ).toBeTruthy()
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
        expect( uValid.isThisMinute(validClient.updated_at) ).toBeTruthy()
        done()
      }

      boundMiddleware(next)
    })

    test('Should encrypt password before saving it', done => {
      hashSpy = jest.spyOn(models, 'hashPassword')

      const context = validClient

      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect( hashSpy ).toHaveBeenCalled()
        expect( context.password ).toBeTruthy()
        expect( context.salt ).toBeTruthy()
        models.hashPassword.mockRestore()      
        done()
      }

      boundMiddleware(next)
    })

    test('Should leave password untouched', done => {
      const hashSpy = jest.spyOn(models, 'hashPassword')
      const expectedPswd = validClient.password    
      const context = { ...validClient, salt: 'somesalt', isNew: false }
      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(hashSpy).toHaveBeenCalledTimes(0)
        expect(context.password).toBe(expectedPswd)
        expect(context.salt).toBe('somesalt')
        models.hashPassword.mockRestore()
        done()
      }

      boundMiddleware(next)
    })

    test('Should call next with salt error', done => {
      const context = { isModified: jest.fn(prop => prop === 'salt') }
      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(err.message).toBe('Salt is not updatable')
        expect(err.name).toBe('ValidationError')
        done()
      }

      boundMiddleware(next)
    })

    test('Should call next with uniqueness error', done => {
      const context = { isModified: jest.fn(prop => prop === 'uniqueness') }
      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(err.message).toBe('Uniqueness is not updatable')
        expect(err.name).toBe('ValidationError')
        done()
      }

      boundMiddleware(next)
    })

    test('Should call next with store modification error', done => {
      const context = { isNew: false, isModified: jest.fn(prop => prop == 'store' ? true : false) }
      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(err.message).toBe('Store is not updatable')
        expect(err.name).toBe('ValidationError')
        done()
      }

      boundMiddleware(next)
    })

    test('Should call next with email modification error', done => {
      const context = { isNew: false, isModified: jest.fn(prop => prop == 'email' ? true : false) }

      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(err.message).toBe('Email is not updatable')
        expect(err.name).toBe('ValidationError')
        done()
      }

      boundMiddleware(next)
    })

    test('Shoul call next with no password error', done => {
      delete validClient.password
      const context = validClient

      const boundMiddleware = bindMiddleware(context)
      const next = err => {        
        expect(err.message).toBe('Password Required')
        expect(err.name).toBe('ValidationError')
        done()
      }

      boundMiddleware(next)
    })

    test('Should call next with encryption error', done => {
      const oldHashPswd = models.hashPassword
      const context = validClient
      models.hashPassword = jest.fn( () => new Promise((resolve, reject) => { reject(new Error('hola_amigo')) }) )

      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect( err.message ).toBe('hola_amigo')
        models.hashPassword = oldHashPswd
        done()
      }

      boundMiddleware(next)
    })

  })

  describe('preUpdate Middleware', () => {
    const bindMiddleware = context => 
      Client.schema._middlewareFuncs.preUpdate.bind(context)

    beforeEach(() => {
      delete validClient.email
      delete validClient.store
    })

    test('Should call next', done => {
      const boundMiddleware = bindMiddleware({ _update: validClient })
      const next = err => {
        expect(err).toBeFalsy()
        done()
      }

      boundMiddleware(next)
    })

    test('Should update updated_at date', done => {
      const creationDate = moment().subtract(1, 'weeks').toDate()
      Object.assign( validClient, { created_at: creationDate, updated_at: creationDate } )

      const updateObj = validClient

      const boundMiddleware = bindMiddleware({ _update: updateObj })
      const next = err => {
        expect(err).toBeFalsy()
        expect( validClient.created_at ).toBe(creationDate)
        expect( uValid.isThisMinute(validClient.updated_at) ).toBeTruthy()
        done()
      }

      boundMiddleware(next)
    })  

    test('Should encrypt password before saving', done => {
      hashSpy = jest.spyOn(models, 'hashPassword')

      const context = { password: 'newpas' }

      const boundMiddleware = bindMiddleware({ _update: context })
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

    test('Should leave password untouched', done => {
      hashSpy = jest.spyOn(models, 'hashPassword')
      const _update = { name: 'someshit' }
      const boundMiddleware = bindMiddleware({_update})
      const next = err => {
        expect(hashSpy).toHaveBeenCalledTimes(0)
        expect(_update.password).toBeFalsy()
        expect(_update.salt).toBeFalsy()
        done()
      }

      boundMiddleware(next)
    })

    test('Should throw validation error if modified store', done => {
      const _update = {store: 'kampamocha'}
      const boundMiddleware = bindMiddleware({_update})
      const next = err => {
        expect(err.message).toBe('Store is not updatable')
        expect(err.name).toBe('ValidationError')
        done()
      }

      boundMiddleware(next)
    })
    test('Should throw validation error if modified salt', done => {
      const _update = {salt: 'kampamocha'}
      const boundMiddleware = bindMiddleware({_update})
      const next = err => {
        expect(err.message).toBe('Salt is not updatable')
        expect(err.name).toBe('ValidationError')
        done()
      }

      boundMiddleware(next)
    })

    test('Should throw validation error if modified uniqueness', done => {
      const _update = {uniqueness: 'kampamocha'}
      const boundMiddleware = bindMiddleware({_update})
      const next = err => {
        expect(err.message).toBe('Uniqueness is not updatable')
        expect(err.name).toBe('ValidationError')
        done()
      }

      boundMiddleware(next)
    })

    test('Should throw validation error if modified email', done => {
      const _update = {email: 'email@maol.com'}
      const boundMiddleware = bindMiddleware({_update})
      const next = err => {
        expect(err.message).toBe('Email is not updatable')
        expect(err.name).toBe('ValidationError')
        done()
      }

      boundMiddleware(next)
    })

    test('Should call next with encryption error', done => {
      const oldHashPswd = models.hashPassword
      const context = { password: 'newpas' }
      models.hashPassword = jest.fn(() => new Promise((resolve, reject) => { reject(new Error('hola_amigo')) }))

      const boundMiddleware = bindMiddleware({ _update: context })
      const next = err => {
        expect( err.message ).toBe('hola_amigo')
        models.hashPassword = oldHashPswd
        done()
      }

      boundMiddleware(next)
    })

  })

})
