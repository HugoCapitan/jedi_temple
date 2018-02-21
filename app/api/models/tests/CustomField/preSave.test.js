const moment = require('moment')
const _ = require('lodash')

jest.mock('../../Product')
const Product = require('../../Product')
const CustomField = require('../../CustomField')

const uValid   = require('../../../utils/validators')
const uSchemas = require('../../../utils/validSchemas')

describe('preSave Middleware', () => {
  let validNumberCustom, validStringCustom

  beforeEach(() => {
    validNumberCustom = uSchemas.getValidNumberCustom()
    validStringCustom = uSchemas.getValidStringCustom()

    Product.find = jest.fn(() => ({
      exec: () => new Promise((resolve, reject) => { resolve([]) })
    }))

    Product.prototype.save = jest.fn(() => new Promise((resolve, reject) => { resolve() }))
  })

  function bindMiddleware (context) {
    if (!context.hasOwnProperty('isModified')) context.isModified = jest.fn(() => false)
    if (!context.hasOwnProperty('isNew'))      context.isNew = true
    return CustomField.schema._middlewareFuncs.preSave.bind( context )
  }

  test('Should call next', done => {
    const context = { ...validNumberCustom, isNew: true }
    const boundMiddleware = bindMiddleware(context)

    const next = err => {
      expect(err).toBeFalsy()
      done()
    }

    boundMiddleware(next)
  })

  test('Should sluggify name and add updated and created dates', done => {
    const context = { ...validNumberCustom, isNew: true, isModified: jest.fn(prop => prop === 'name') }
    const boundMiddleware = bindMiddleware(context)
   
    const next = err => {
      expect(context.slug).toBe('kampamocha__number_customfield')
      expect( uValid.isThisMinute(context.created_at) ).toBeTruthy()
      expect( uValid.isThisMinute(context.updated_at) ).toBeTruthy()
      done()
    }

    boundMiddleware(next)
  })

  test('Should slugify new name', done => {
    const context = { ...validNumberCustom, slug: 'previous_slug', isNew: false, isModified: jest.fn(prop => prop === 'name') }
    const boundMiddleware = bindMiddleware(context)
    const next = err => {
      expect(context.slug).toBe('kampamocha__number_customfield')
      done()
    }

    boundMiddleware(next)
  })

  test('Should not update created_at date', done => {
    const yesterday = moment().subtract(1, 'days').toDate()
    const context = { ...validNumberCustom, created_at: yesterday, updated_at: yesterday, isNew: false }
    const boundMiddleware = bindMiddleware(context)

    const next = err => {
      expect(err).toBeFalsy()
      expect(context.created_at).toBe(yesterday)
      expect( uValid.isThisMinute(context.updated_at) ).toBeTruthy()
      done()
    }

    boundMiddleware(next)      
  })

  test('Should add empty array to values')

  test('Should update _values', done => {
    validStringCustom.values.push( { value: 'wazap wazap' } )
    const context = new CustomField( validStringCustom )
    context.isNew = true

    const expectedValues = context.values.map( val => val._id.toString() )
    const boundMiddleware = bindMiddleware(context)

    const next = err => {
      expect(err).toBeFalsy()
      expectedValues.forEach(value => {
        expect( context._values ).toContain(value)
      })
      done()
    }

    boundMiddleware(next)
  })

  test('Should call Product.find with custom query for products with removed value', done => {
    const removedValueCustom = getRemovedValueCustom('heylisten')
    const context = removedValueCustom
    context.isNew = false

    const expectedQuery = { 
      customs: { $elemMatch: { custom_id: removedValueCustom._id, value_id: 'heylisten' } } 
    }

    const boundMiddleware = bindMiddleware(context)
    const next = err => {
      expect(err).toBeFalsy()
      expect( Product.find.mock.calls.length ).toBe(1)
      expect( Product.find.mock.calls[0][0] ).toEqual(expectedQuery)
      done()
    }

    boundMiddleware(next)
  })

  test('Should iterate over found products and remove this custom, and call each product.save', done => {
    const removedValueCustom = getRemovedValueCustom('heylisten')
    const context = removedValueCustom
    context.isNew = false

    const foundProducts = [{ 
        customs: [{ 
        _id: 'ajua', 
        custom_id: removedValueCustom._id, 
        value_id: 'heylisten' 
      }], 
      save: jest.fn(() => new Promise((resolve, reject) => { resolve() })) 
    },{ 
      customs: [{ 
        _id: 'anothernotajua', 
        custom_id: 'someweirdid', 
        value_id: 'huhuhu' 
      },{ 
        _id: 'anothernotajua2', 
        custom_id: removedValueCustom._id, 
        value_id: 'heylisten' 
      }], 
      save: jest.fn(() => new Promise((resolve, reject) => { resolve() })) 
    }]
    foundProducts[0].customs.pull = jest.fn(() => { foundProducts[0].customs.pop() })
    foundProducts[1].customs.pull = jest.fn(() => { foundProducts[1].customs.pop() })
    Product.find = jest.fn(() => ({ 
      exec: () => new Promise((resolve, reject) => { resolve(foundProducts) })
    }))
    
    const boundMiddleware = bindMiddleware(context)
    const next = err => {
      expect(err).toBeFalsy()
      expect( foundProducts[0].customs.length ).toBe(0)
      expect( foundProducts[0].customs.pull.mock.calls.length ).toBe(1)
      expect( foundProducts[0].customs.pull.mock.calls[0][0] ).toEqual({ _id: 'ajua' })
      expect( foundProducts[0].save.mock.calls.length ).toBe(1)

      expect( foundProducts[1].customs.length ).toBe(1)
      expect( foundProducts[1].customs.pull.mock.calls.length ).toBe(1)
      expect( foundProducts[1].customs.pull.mock.calls[0][0] ).toEqual({ _id: 'anothernotajua2' })
      expect( foundProducts[1].save.mock.calls.length ).toBe(1)
      done()
    }

    boundMiddleware(next)
  })

  test('Should call Product.find if max modified', done => {
    const context = { 
      ...validNumberCustom, 
      isNew: false, 
      _id: 'pinacolada',
      min: '500',
      max: '600',
      isModified: jest.fn(p => p === 'min' || p === 'max') 
    }
    const boundMiddleware = bindMiddleware(context)
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

  test('Should not call Product.find if max modified', done => {
    const context = { 
      ...validNumberCustom, 
      isNew: false, 
      _id: 'pinacolada',
      isModified: jest.fn(p => false) 
    }
    const boundMiddleware = bindMiddleware(context)
    const next = err => {
      expect(Product.find.mock.calls.length).toBe(0)
      done()
    }

    boundMiddleware(next)      
  })

  test('Should not call Product.find if max modified', done => {
    const context = { 
      ...validNumberCustom, 
      isNew: true, 
      _id: 'pinacolada',
      isModified: jest.fn(p => false) 
    }
    const boundMiddleware = bindMiddleware(context)
    const next = err => {
      expect(Product.find.mock.calls.length).toBe(0)
      done()
    }

    boundMiddleware(next)      
  })

  test('Should correctly call update and save on necessary products', done => {
    const context = { 
      ...validNumberCustom, 
      isNew: false, 
      _id: 'pinacolada',
      min: '500',
      max: '600',
      isModified: jest.fn(p => p === 'min' || p === 'max') 
    }
    const boundMiddleware = bindMiddleware(context)

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
    const context = { 
      ...validNumberCustom, 
      isNew: false, 
      _id: 'pinacolada',
      min: 'auto',
      max: '600',
      isModified: jest.fn(p => p === 'min' || p === 'max') 
    }
    const boundMiddleware = bindMiddleware(context)

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

  test('Should call next with slug error', done => {
    const context = validNumberCustom
    context.isModified = jest.fn( (prop) => prop === 'slug' )
    context.isNew      = false
    
    const boundMiddleware = bindMiddleware(context)
    const next = err => {
      expect(err.message).toBe('Slug is not updatable')
      expect(err.name).toBe('ValidationError')
      done()
    }

    boundMiddleware(next) 
  })

  test('Should call next with store update error', done => {
    const context = validNumberCustom
    context.isModified = jest.fn(propt => propt == 'store' ? true : false)
    context.isNew      = false

    const boundMiddleware = bindMiddleware(context)
    const next = err => {
      expect(err.message).toBe('Store is not updatable')
      expect(err.name).toBe('ValidationError')
      done()
    }

    boundMiddleware(next)
  })

  test('Should call next with type error', done => {
    const context = validNumberCustom
    context.isModified = jest.fn( (prop) => prop == 'type' ? true : false )
    context.isNew      = false
    
    const boundMiddleware = bindMiddleware(context)
    const next = err => {
      expect( err.message ).toBe('Type is not updatable')
      expect( err.name ).toBe('ValidationError')
      done()
    }
    
    boundMiddleware(next)
  })

  test('Should call next with _values error', done => {
    const context = validStringCustom
    context.isModified = jest.fn( (prop) => prop === '_values' )
    context.isNew      = false
    
    const boundMiddleware = bindMiddleware(context)
    const next = err => {
      expect( err.message ).toBe('_values is not updatable')
      expect( err.name ).toBe('ValidationError')
      done()
    }

    boundMiddleware(next)
  })

  test('Should iterate over customs and call next with a ValidationError if duplications found', done => {
    const context = validStringCustom
    context.values.push({ value: 'A value' })
    context.isNew = true

    const boundMiddleware = bindMiddleware(context)
    const next = err => {
      expect( err.message ).toBe('Duplicated value for CustomField.values')
      expect( err.name ).toBe('ValidationError')
      done()
    }

    boundMiddleware(next)
  })

  test('Should call next with products find error', done => {
    const removedValueCustom = getRemovedValueCustom('heylisten')
    const context = removedValueCustom
    context.isNew = false

    const boundMiddleware = bindMiddleware(context)      
    
    Product.find = jest.fn(() => ({
      exec: () => new Promise((resolve, reject) => { reject(new Error('Test error fetching products')) })
    }))

    const next = err => {
      expect(err.message).toBe('Test error fetching products')
      done()
    }

    boundMiddleware(next)
  })

  test('Should call next with products update error', done => {
    const removedValueCustom = getRemovedValueCustom('heylisten')
    const context = removedValueCustom
    context.isNew = false

    const foundProduct = Object.assign(
      uSchemas.getValidProduct, { 
        customs: [{ 
        _id: 'ajua', 
        custom_id: removedValueCustom._id, 
        value_id: 'heylisten' 
      }],
      save: jest.fn(() => new Promise((resolve, reject) => { reject( new Error('Test Error on product.save') ) }))
    })
    foundProduct.customs.pull = jest.fn(() => { foundProduct.customs.pop() })
    
    Product.find = jest.fn(() => ({
      exec: () => new Promise((resolve, reject) => { resolve([foundProduct]) })
    }))

    const boundMiddleware = bindMiddleware(context)
    const next = err => {
      expect( err.message ).toBe('Test Error on product.save')
      done()
    }

    boundMiddleware(next)
  })

  function getRemovedValueCustom (removedValue) {
    validStringCustom = _.omit(validStringCustom, ['slug'])
    let removedValueCustom = new CustomField( 
      _.cloneDeep(validStringCustom)
    )
    removedValueCustom._values = removedValueCustom.values.map( val => val._id.toString() )
    removedValueCustom._values.push(removedValue)
    removedValueCustom.isModified = jest.fn((prop) => false)

    return removedValueCustom
  }

})