const moment = require('moment')

const CustomField = require('../CustomField')

const { howManyKeys } = require('../../utils')
const { isThisMinute } = require('../../utils/validators')
const { getValidNumberCustom, getValidStringCustom } = require('../../utils/validSchemas')

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
    console.log(v.errors)

    expect(v.errors['values.0.value']).toBeTruthy()
  })

  test('Number should be invalid if values', () => {
    const invalidNumber = Object.assign( validNumberCustom, { values: ['avalue'] } )

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

    test('Should call next', () => {
      const context = validNumberCustom

      const boundMiddleware = CustomField.schema._middlewareFuncs.preSave.bind(context)
      const next = jest.fn()

      boundMiddleware(next)

      expect( next.mock.calls.length ).toBe(1)
    })
    
    test('Should sluggify name and add updated and created dates', () => {
      const context = validNumberCustom

      const boundMiddleware = CustomField.schema._middlewareFuncs.preSave.bind(context)
      const next = jest.fn()

      boundMiddleware(next)

      expect( validNumberCustom.slug ).toBe('number_customfield')
      expect( isThisMinute(validNumberCustom.created_at) ).toBeTruthy()
      expect( isThisMinute(validNumberCustom.updated_at) ).toBeTruthy()
    })

    test('Should not update created_at date', () => {
      const yesterday = moment().subtract(1, 'days').toDate()
      const context = Object.assign(validNumberCustom, { created_at: yesterday })

      const boundMiddleware = CustomField.schema._middlewareFuncs.preSave.bind(context)
      const next = jest.fn()

      boundMiddleware(next)

      expect(validNumberCustom.slug).toBe('number_customfield')
      expect(validNumberCustom.created_at).toBe(yesterday)
      expect( isThisMinute(validNumberCustom.updated_at) ).toBeTruthy()
    })

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

    test('Should query and update necessary prodycts if min or max are updated', () => {

    })

  })

  describe('preRemove Middleware', () => {
    
    test('Should call next')

    test('Should iterate and update products')

  })

  function setupTest () {
    validNumberCustom = getValidNumberCustom()
    validStringCustom = getValidStringCustom()
  }
})