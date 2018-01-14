const moment = require('moment')
const _ = require('lodash')

jest.mock('../Product')
const Product = require('../Product')
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

    let next
    beforeEach(() => {
      Product.find = jest.fn(() => [])

      Product.prototype.save = jest.fn(() => true)

      next = jest.fn((err) => {
        if (err) throw err
      })
    })

    test('Should call next', async () => {
      const context = validNumberCustom
      context.isNew = true
      
      const boundMiddleware = bindMiddleware(context)

      await boundMiddleware(next)

      expect( next.mock.calls.length ).toBe(1)
      expect( next.mock.calls[0][0] ).toBeFalsy()
    })

    test('Should sluggify name and add updated and created dates', async () => {
      const context = validNumberCustom
      context.isNew = true

      const boundMiddleware = bindMiddleware(context)

      await boundMiddleware(next)

      expect( validNumberCustom.slug ).toBe('number_customfield')
      expect( isThisMinute(validNumberCustom.created_at) ).toBeTruthy()
      expect( isThisMinute(validNumberCustom.updated_at) ).toBeTruthy()
    })

    test('Should not update created_at date', async () => {
      const yesterday = moment().subtract(1, 'days').toDate()
      const context = Object.assign(validNumberCustom, { created_at: yesterday })
      context.isNew = true

      const boundMiddleware = bindMiddleware(context)
      const next = jest.fn()

      await boundMiddleware(next)

      expect(validNumberCustom.created_at).toBe(yesterday)
      expect( isThisMinute(validNumberCustom.updated_at) ).toBeTruthy()
    })

    test('Should update _values', async () => {
      validStringCustom.values.push( { value: 'wazap wazap' } )
      const context = new CustomField( validStringCustom )
      context.isNew = true

      const expectedValues = context.values.map( val => val._id.toString() )
      const boundMiddleware = bindMiddleware(context)

      await boundMiddleware(next)

      expectedValues.forEach(value => {
        expect( context._values ).toContain(value)
      })

    })    

    test('Should call Product.find with custom query for products with removed value', async () => {
      const removedValueCustom = getRemovedValueCustom('heylisten')
      const context = removedValueCustom
      context.isNew = false

      const expectedQuery = { 
        customs: { $elemMatch: { custom_id: removedValueCustom._id, value_id: 'heylisten' } } 
      }

      const boundMiddleware = bindMiddleware(context)

      await boundMiddleware(next)

      expect( Product.find.mock.calls.length ).toBe(1)
      expect( Product.find.mock.calls[0][0] ).toEqual(expectedQuery)
    })

    test('Should iterate over found products and remove this custom, and call each product.save', async () => {
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
        save: jest.fn() 
      })
      foundProduct.customs.pull = jest.fn(() => { foundProduct.customs.pop() })
      Product.find = jest.fn(() => [foundProduct])
      
      const boundMiddleware = bindMiddleware(context)

      await boundMiddleware(next)

      expect( foundProduct.customs.length ).toBe(0)
      expect( foundProduct.customs.pull.mock.calls.length ).toBe(1)
      expect( foundProduct.customs.pull.mock.calls[0][0] ).toEqual({ _id: 'ajua' })
      expect( foundProduct.save.mock.calls.length ).toBe(1)
    })

    test('Should call next with slug error', async () => {
      const context = validNumberCustom
      context.isModified = jest.fn( (prop) => prop === 'slug' )
      context.isNew      = false
      
      const boundMiddleware = bindMiddleware(context)

      try {
        await boundMiddleware(next) 
      } catch(e) {
        expect( next.mock.calls.length ).toBe(1)
        expect( next.mock.calls[0][0].name ).toBe('ValidationError')
        expect( next.mock.calls[0][0].message ).toBe('Slug is not updatable')
      }
    })

    test('Should call next with type error', async () => {
      const context = validNumberCustom
      context.isModified = jest.fn( (prop) => prop == 'type' ? true : false )
      context.isNew      = false
      
      const boundMiddleware = bindMiddleware(context)

      try {
        await boundMiddleware(next)      
      } catch (e) {
        expect( next.mock.calls.length ).toBe(1)
        expect( next.mock.calls[0][0].name ).toBe('ValidationError')
        expect( next.mock.calls[0][0].message ).toBe('Type is not updatable')
      }
    })

    test('Should iterate over customs and call next with a ValidationError if duplications found', async () => {
      const context = validStringCustom
      context.values.push({ value: 'A value' })
      context.isNew = true

      const boundMiddleware = bindMiddleware(context)

      try {
        await boundMiddleware(next)
      } catch (e) {
        expect( next.mock.calls.length ).toBe(1)
        expect( next.mock.calls[0][0].name ).toBe('ValidationError')
        expect( next.mock.calls[0][0].message ).toBe('Duplicated value for CustomField.values')
      }
    })

    test('Should call next with min error', async () => {
      const context = { min: 'auto' }
      context.isNew = false
      context.isModified = jest.fn((prop) => prop === 'min')

      const boundMiddleware = bindMiddleware(context)
      const next = jest.fn()

      try {
        await boundMiddleware(next)
      } catch (e) {
        expect( next.mock.calls.length ).toBe(1)
        expect( next.mock.calls[0][0].name ).toBe('ValidationError')
        expect( next.mock.calls[0][0].message ).toBe('Min should be modified via update, not save.')
      }
    })

    test('Should call next with max error', async () => {
      const context = { max: 'auto' }
      context.isNew = false
      context.isModified = jest.fn((prop) => prop === 'max')

      const boundMiddleware = bindMiddleware(context)
      const next = jest.fn()

      try {
        await boundMiddleware(next)
      } catch (e) {
        expect( next.mock.calls.length ).toBe(1)
        expect( next.mock.calls[0][0].name ).toBe('ValidationError')
        expect( next.mock.calls[0][0].message ).toBe('Max should be modified via update, not save.')
      }
    })

    test('Should call next with products update error')

    test('Should call next with _values error')

    function bindMiddleware (context) {
      if (!context.isModified) context.isModified = jest.fn((prop) => false)
      return CustomField.schema._middlewareFuncs.preSave.bind( context )
    }

    function getRemovedValueCustom (removedValue) {
      validStringCustom = _.omit(validStringCustom, ['type', 'slug'])
      let removedValueCustom = new CustomField( 
        _.cloneDeep(validStringCustom)
      )
      removedValueCustom._values = removedValueCustom.values.map( val => val._id.toString() )
      removedValueCustom._values.push(removedValue)

      return removedValueCustom
    }

  })

  describe('preUpdate Middleware', () => {
    let next
    const bindMiddleware = (context) => 
      CustomField.schema._middlewareFuncs.preUpdate.bind(context) 

    beforeEach(() => { next = jest.fn() })
    
    test('Should call next', () => {
      const _update = { name: 'new name' }

      const boundMiddleware = bindMiddleware({ _update })

      boundMiddleware(next)

      expect( next.mock.calls.length ).toBe(1)
    })

    test('Should call next with values error')

    test('Should call next with _values error')

    test('Should update the slug if name is passed', () => {
      const newField = { name: 'New Name' }
      const _update = newField

      const boundMiddleware = bindMiddleware({ _update })
      
      boundMiddleware(next)

      expect( newField.slug ).toBe('new_name')
    })

    test('Should prevent modification of the slug and return a ValidationError', () => {
      const newField  = { slug: 'what_a_slug' }
      const _update = newField

      const boundMiddleware = bindMiddleware({ _update })

      boundMiddleware(next)

      expect( next.mock.calls.length ).toBe(2)
      expect( next.mock.calls[0][0].name ).toBe('ValidationError')
      expect( next.mock.calls[0][0].message ).toBe('Slug is not updatable')
    })

    test('Should prevent modification of the slug if undefined sent and return a ValidationError', () => {
      const newField  = { slug: undefined }
      const _update = newField

      const boundMiddleware = bindMiddleware({ _update })

      boundMiddleware(next)

      expect( next.mock.calls.length ).toBe(2)
      expect( next.mock.calls[0][0].name ).toBe('ValidationError')
      expect( next.mock.calls[0][0].message ).toBe('Slug is not updatable')
    })

    test('Should prevent modification of the slug if null sent and return a ValidationError', () => {
      const newField  = { slug: null }
      const _update = newField

      const boundMiddleware = bindMiddleware({ _update })

      boundMiddleware(next)

      expect( next.mock.calls.length ).toBe(2)
      expect( next.mock.calls[0][0].name ).toBe('ValidationError')
      expect( next.mock.calls[0][0].message ).toBe('Slug is not updatable')
    })

    test('Should prevent modification of the slug if false sent and return a ValidationError', () => {
      const newField  = { slug: false }
      const _update = newField

      const boundMiddleware = bindMiddleware({ _update })

      boundMiddleware(next)

      expect( next.mock.calls.length ).toBe(2)
      expect( next.mock.calls[0][0].name ).toBe('ValidationError')
      expect( next.mock.calls[0][0].message ).toBe('Slug is not updatable')
    })

    test('Should prevent modification of type and return a ValidationError', () => {
      const newField  = { type: 'string' }
      const _update = newField

      const boundMiddleware = bindMiddleware({ _update })

      boundMiddleware(next)

      expect( next.mock.calls.length ).toBe(2)
      expect( next.mock.calls[0][0].name ).toBe('ValidationError')
      expect( next.mock.calls[0][0].message ).toBe('Type is not updatable')
    })

    test('Should prevent modification of type if undefined sent and return a ValidationError', () => {
      const newField  = { type: undefined }
      const _update = newField

      const boundMiddleware = bindMiddleware({ _update })

      boundMiddleware(next)

      expect( next.mock.calls.length ).toBe(2)
      expect( next.mock.calls[0][0].name ).toBe('ValidationError')
      expect( next.mock.calls[0][0].message ).toBe('Type is not updatable')
    })

    test('Should prevent modification of type if null sent and return a ValidationError', () => {
      const newField  = { type: null }
      const _update = newField

      const boundMiddleware = bindMiddleware({ _update })

      boundMiddleware(next)

      expect( next.mock.calls.length ).toBe(2)
      expect( next.mock.calls[0][0].name ).toBe('ValidationError')
      expect( next.mock.calls[0][0].message ).toBe('Type is not updatable')
    })

    test('Should prevent modification of type if false sent and return a ValidationError', () => {
      const newField  = { type: false }
      const _update = newField

      const boundMiddleware = bindMiddleware({ _update })

      boundMiddleware(next)

      expect( next.mock.calls.length ).toBe(2)
      expect( next.mock.calls[0][0].name ).toBe('ValidationError')
      expect( next.mock.calls[0][0].message ).toBe('Type is not updatable')
    })

    test('Should update updated_at date', () => {
      const newField = { name: 'new name' }
      const _update = newField

      const boundMiddleware = bindMiddleware({ _update })

      boundMiddleware(next)

      expect( isThisMinute(newField.updated_at) ).toBeTruthy()
    })

  })

  describe('preRemove Middleware', () => {
    
    test('Should call next')

    test('Should iterate and update products')

    test('Should iterate and update stores')

    test('Should call next with products error')

    test('Should call next with stores error')

  })

  function setupTest () {
    validNumberCustom = getValidNumberCustom()
    validStringCustom = getValidStringCustom()
  }
})