const moment = require('moment')
const _ = require('lodash')
const { ObjectId } = require('mongoose').Schema.Types

jest.mock('../Product')
jest.mock('../Store')
const Product = require('../Product')
const Store = require('../Store')
const CustomField = require('../CustomField')

const { howManyKeys } = require('../../utils')
const { isThisMinute } = require('../../utils/validators')
const { getValidNumberCustom, getValidStringCustom, getValidProduct } = require('../../utils/validSchemas')

describe('CustomField Model', () => {
  let validNumberCustom, validStringCustom

  beforeEach(() => { setupTest() })

  test('Should be fine', () => {
    const mn = new CustomField(validNumberCustom)
    const ms = new CustomField(validStringCustom)
    const vn = mn.validateSync()
    const vs = ms.validateSync()

    expect(vn).toBeFalsy()
    expect(vs).toBeFalsy()
  })

  test('Should be invalid if empty: name, type, show', () => {
    const m = new CustomField({ })
    const v = m.validateSync()

    expect(howManyKeys(v['errors'])).toBe(3)

    expect(v.errors.name).toBeTruthy()
    expect(v.errors.type).toBeTruthy()
    expect(v.errors.show).toBeTruthy()
  })

  test('Number should be invalid if empty: min, max, unit, unit_place', () => {
    const m = new CustomField({ name: 'Some name', type: 'number', show: false })
    const v = m.validateSync()

    expect(howManyKeys(v['errors'])).toBe(4)

    expect(v.errors.min).toBeTruthy()
    expect(v.errors.max).toBeTruthy()
    expect(v.errors.unit).toBeTruthy()
    expect(v.errors.unit_place).toBeTruthy()
  })

  test('Number should be invalid if wrong values for: min, max, unit_place', () => {
    const m = new CustomField( 
      Object.assign(
        validNumberCustom, 
        {
          min: 'something else',
          max: 'heyhey',
          unit_place: 'whaaat'
        }
      )
    ) 
    const v = m.validateSync()

    expect(howManyKeys(v['errors'])).toBe(3)

    expect(v.errors.min).toBeTruthy()
    expect(v.errors.max).toBeTruthy()
    expect(v.errors.unit_place).toBeTruthy()
  })

  test('Number should be invalid if min > max', () => {
    const wrongMaxMinCF = Object.assign(validNumberCustom, { min: '500', max: '400' })
    
    const m = new CustomField(wrongMaxMinCF)
    const v = m.validateSync()

    expect(howManyKeys(v['errors'])).toBe(2)

    expect(v.errors.min).toBeTruthy()
    expect(v.errors.max).toBeTruthy()
  })

  test('Number should be valid if max > min', () => {
    const wrongMaxMinCF = Object.assign(validNumberCustom, { min: '-500', max: '-400' })
    
    const m = new CustomField(wrongMaxMinCF)
    const v = m.validateSync()

    expect(v).toBeFalsy()
  }) 

  test('String should be invalid if empty string as value', () => {
    const emptyString = Object.assign({}, validStringCustom, { values: [ { value: '' } ] })

    const m = new CustomField(emptyString)
    const v = m.validateSync()

    expect(howManyKeys(v['errors'])).toBe(1)

    expect(v.errors['values.0.value']).toBeTruthy()
  })

  test('String should be invald if malformed values', () => {
    const invalidString = Object.assign( validStringCustom, { values: [ { value: 'fine' }, 'wrongval1' ] } )

    const m = new CustomField( invalidString )
    const v = m.validateSync()

    expect( howManyKeys(v.errors) ).toBe(1)
    expect( v.errors.values ).toBeTruthy()
  })

  test('Number should be invalid if values sent', () => {
    const invalidNumber = Object.assign( validNumberCustom, { values: validStringCustom.values } )

    const m = new CustomField(invalidNumber)
    const v = m.validateSync()

    expect( howManyKeys(v.errors) ).toBe(1)
    expect( v.errors.values ).toBeTruthy()
  })

  test('String should be invalid if: min, max, unit, unit_place', () => {
    const invalidString = 
      Object.assign(
        validStringCustom, 
        {
          min: 'auto',
          max: 'auto',
          unit: 'US $',
          unit_place: 'before'
        } )

    const m = new CustomField( invalidString )
    const v = m.validateSync()

    expect( howManyKeys(v.errors) ).toBe(4)
    expect( v.errors.min ).toBeTruthy()
    expect( v.errors.max ).toBeTruthy()
    expect( v.errors.unit ).toBeTruthy()
    expect( v.errors.unit_place ).toBeTruthy()
  })

  describe('preSave Middleware', () => {
    beforeEach(() => {
      Product.find = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve([]) })
      }))

      Product.prototype.save = jest.fn(() => new Promise((resolve, reject) => { resolve() }))
    })

    test('Should call next', done => {
      const context = validNumberCustom
      context.isNew = true
      
      const boundMiddleware = bindMiddleware(context)

      const next = err => {
        expect(err).toBeFalsy()
        done()
      }

      boundMiddleware(next)
    })

    test('Should sluggify name and add updated and created dates', done => {
      const context = validNumberCustom
      context.isNew = true

      const boundMiddleware = bindMiddleware(context)
     
      const next = err => {
        expect( err ).toBeFalsy()
        expect( validNumberCustom.slug ).toBe('number_customfield')
        expect( isThisMinute(validNumberCustom.created_at) ).toBeTruthy()
        expect( isThisMinute(validNumberCustom.updated_at) ).toBeTruthy()
        done()
      }

      boundMiddleware(next)
    })

    test('Should not update created_at date', done => {
      const yesterday = moment().subtract(1, 'days').toDate()
      const context = Object.assign(validNumberCustom, { created_at: yesterday })
      context.isNew = true

      const boundMiddleware = bindMiddleware(context)

      const next = err => {
        expect(err).toBeFalsy()
        expect(validNumberCustom.created_at).toBe(yesterday)
        expect( isThisMinute(validNumberCustom.updated_at) ).toBeTruthy()
        done()
      }

      boundMiddleware(next)      
    })

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

    test('Should call next with slug error', done => {
      const context = validNumberCustom
      context.isModified = jest.fn( (prop) => prop === 'slug' )
      context.isNew      = false
      
      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(err.name).toBe('ValidationError')
        expect(err.message).toBe('Slug is not updatable')
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
        expect( err.name ).toBe('ValidationError')
        expect( err.message ).toBe('Type is not updatable')
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
        expect( err.name ).toBe('ValidationError')
        expect( err.message ).toBe('Duplicated value for CustomField.values')
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
        // console.log('holadios')
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
        getValidProduct, { 
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

    test('Should call next with _values error', done => {
      const context = validStringCustom
      context.isModified = jest.fn( (prop) => prop === '_values' )
      context.isNew      = false
      
      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect( err.name ).toBe('ValidationError')
        expect( err.message ).toBe('_values is not updatable')
        done()
      }

      boundMiddleware(next)
    })

    function bindMiddleware (context) {
      if (!context.isModified) context.isModified = jest.fn((prop) => false)
      return CustomField.schema._middlewareFuncs.preSave.bind( context )
    }

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

  describe('preUpdate Middleware', () => {
    const bindMiddleware = (context) => 
      CustomField.schema._middlewareFuncs.preUpdate.bind(context) 

    beforeEach(() => {
      Product.find = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve([]) })
      }))
      Product.prototype.save = jest.fn(() => new Promise((resolve, reject) => { resolve() }))
    })
    
    test('Should call next', done => {
      const _update = { name: 'new name' }
      const boundMiddleware = bindMiddleware({ _update })
      const next = err => {
        expect(err).toBeFalsy()
        done()
      }

      boundMiddleware(next)
    })

    test('Should update the slug if name is passed', done => {
      const newField = { name: 'New Name' }
      const _update = newField
      const boundMiddleware = bindMiddleware({ _update })
      const next = err => {
        expect(err).toBeFalsy()
        expect(newField.slug).toBe('new_name')
        done()
      }
      
      boundMiddleware(next)
    })

    test('Should update updated_at date', done => {
      const newField = { name: 'new name' }
      const _update = newField
      const boundMiddleware = bindMiddleware({ _update })
      const next = err => {
        expect(err).toBeFalsy()
        expect( isThisMinute(newField.updated_at) ).toBeTruthy()
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
        console.log(err)
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

  // describe('preRemove Middleware', () => {
  //   let next

  //   const bindMiddleware = (context) => 
  //     CustomField.schema._middlewareFuncs.preRemove.bind(context) 

  //   beforeEach(() => {
  //     Product.find = jest.fn(() => new Promise((resolve, reject) => { resolve([]) }))
  //     Store.find = jest.fn(() => new Promise((resolve, reject) => { resolve([]) }))

  //     Product.prototype.save = jest.fn(() => new Promise((resolve, reject) => { resolve() }))
  //     Store.prototype.save = jest.fn(() => new Promise((resolve, reject) => { resolve() }))

  //     next = jest.fn((err) => {
  //       if (err) throw err
  //     })
  //   })
    
  //   test('Should call next', async () => {
  //     const _conditions = { _id: 'chocobanana' }
  //     const boundMiddleware = bindMiddleware({ _conditions })

  //     await boundMiddleware(next)

  //     expect( next.mock.calls.length ).toBe(1)
  //   })

  //   test('Should call product.find with the custom id', async () => {
  //     const _conditions = { _id: 'chocobanana' }
  //     const boundMiddleware = bindMiddleware({ _conditions })
  //     const expectedQuery = { customs: { $elemMatch: { custom_id: 'chocobanana' } } }

  //     await boundMiddleware(next)

  //     expect( Product.find.mock.calls.length ).toBe(1)
  //     expect( Product.find.mock.calls[0][0] ).toEqual(expectedQuery)
  //   }) 

  //   test('Should iterate and update products', async () => {
  //     const _conditions = { _id: 'chocobanana' }
  //     const boundMiddleware = bindMiddleware({ _conditions })

  //     const foundProduct = { 
  //       customs: [{ _id: 'smoothie', custom_id: 'chocobanana' }],
  //       save: jest.fn(() => new Promise((resolve, reject) => { resolve() }))
  //     }
  //     foundProduct.customs.pull = jest.fn(() => { foundProduct.customs.pop() })

  //     Product.find = jest.fn(() => new Promise((resolve, reject) => { resolve([foundProduct]) }))

  //     await boundMiddleware(next)

  //     expect( foundProduct.customs.length ).toBe(0)
  //     expect( foundProduct.customs.pull.mock.calls.length ).toBe(1)
  //     expect( foundProduct.customs.pull.mock.calls[0][0] ).toEqual({ _id: 'smoothie' })
  //     expect( foundProduct.save.mock.calls.length ).toBe(1)
  //   })

  //   test('Should call store.find with the custom id', async () => {
  //     const _conditions = { _id: 'chocobanana' }
  //     const boundMiddleware = bindMiddleware({ _conditions })
  //     const expectedQuery = { customs: 'chocobanana' }

  //     await boundMiddleware(next)

  //     expect( Store.find.mock.calls.length ).toBe(1)
  //     expect( Store.find.mock.calls[0][0] ).toEqual(expectedQuery)
  //   })

  //   test('Should iterate and update stores', async () => {
  //     const _conditions = { _id: 'chocobanana' }
  //     const boundMiddleware = bindMiddleware({ _conditions })
  //     const foundStores = [{
  //       customs: ['anotherthing', 'chocobanana'],
  //       save: jest.fn(() => new Promise((resolve, reject) => { resolve() }))
  //     }, {
  //       customs: ['shomething', 'chocobanana'],
  //       save: jest.fn(() => new Promise((resolve, reject) => { resolve() }))
  //     }]
  //     foundStores[0].customs.pull = jest.fn(() => { foundStores[0].customs.pop() })
  //     foundStores[1].customs.pull = jest.fn(() => { foundStores[1].customs.pop() })
  //     Store.find = jest.fn(() => new Promise((resolve, reject) => { resolve(foundStores) }))

  //     await boundMiddleware(next)

  //     expect( foundStores[0].customs.length ).toBe(1)
  //     expect( foundStores[0].customs.pull.mock.calls.length ).toBe(1)
  //     expect( foundStores[0].customs.pull.mock.calls[0][0] ).toBe('chocobanana')
  //     expect( foundStores[0].save.mock.calls.length ).toBe(1)

  //     expect( foundStores[1].customs.length ).toBe(1)
  //     expect( foundStores[1].customs.pull.mock.calls.length ).toBe(1)
  //     expect( foundStores[1].customs.pull.mock.calls[0][0] ).toBe('chocobanana')
  //     expect( foundStores[1].save.mock.calls.length ).toBe(1)
  //   })

  //   test('Should call next with products error', async () => {
  //     const _conditions = { _id: 'chocobanana' }
  //     const boundMiddleware = bindMiddleware({ _conditions })

  //     const foundProduct = { 
  //       customs: [{ _id: 'smoothie', custom_id: 'chocobanana' }],
  //       save: jest.fn(() => new Promise((resolve, reject) => { reject(new Error('Smoothie Error')) }))
  //     }
  //     foundProduct.customs.pull = jest.fn(() => { foundProduct.customs.pop() })

  //     Product.find = jest.fn(() => new Promise((resolve, reject) => { resolve([foundProduct]) }))

  //     try {
  //       await boundMiddleware(next)
  //       expect(0).toBe(1)
  //     } catch (e) {
  //       expect( next.mock.calls.length ).toBe(1)
  //       expect( next.mock.calls[0][0].message ).toBe('Smoothie Error')
  //     }
  //   })

  //   test('Should call next with stores error', async () => {
  //     const _conditions = { _id: 'chocobanana' }
  //     const boundMiddleware = bindMiddleware({ _conditions })

  //     const foundStore = { 
  //       customs: ['chocobanana'],
  //       save: jest.fn(() => new Promise((resolve, reject) => { reject(new Error('Smoothie Error')) }))
  //     }
  //     foundStore.customs.pull = jest.fn(() => { foundStore.customs.pop() })

  //     Store.find = jest.fn(() => new Promise((resolve, reject) => { resolve([foundStore]) }))

  //     try {
  //       await boundMiddleware(next)
  //       expect(0).toBe(1)
  //     } catch (e) {
  //       expect( next.mock.calls.length ).toBe(1)
  //       expect( next.mock.calls[0][0].message ).toBe('Smoothie Error')
  //     }
  //   }) 

  // })

  function setupTest () {
    validNumberCustom = getValidNumberCustom()
    validStringCustom = getValidStringCustom()
  }
})