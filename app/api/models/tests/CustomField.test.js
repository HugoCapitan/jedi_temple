const moment = require('moment')

const CustomField = require('../CustomField')
const howManyKeys = require('../../utils').howManyKeys

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

  test('String should be invalid if values empty or empty string as value', () => {
    const emptyVals = Object.assign({}, validStringCustom, { values: [] })
    const emptyString = Object.assign({}, validStringCustom, { values: [''] })

    const mv = new CustomField(emptyVals)
    const ms = new CustomField(emptyString)
    const vv = mv.validateSync()
    const vs = ms.validateSync()

    expect(howManyKeys(vv['errors'])).toBe(1)
    expect(howManyKeys(vs['errors'])).toBe(1)

    expect(vv.errors.values).toBeTruthy()
    expect(vs.errors['values.0']).toBeTruthy()
  })

  describe('preSave Middleware', () => {

    test('Should call next', () => {

    })
    
    test('Should sluggify name and add updated and created dates', () => {
      const context = validNumberCustom

      const boundMiddlewareFunc = CustomField.schema._middlewareFuncs.preSave.bind(context)
      const next = jest.fn()

      boundMiddlewareFunc(next)

      expect(validNumberCustom.slug).toBe('number_customfield')
      expect( isThisMinute(validNumberCustom.created_at) ).toBeTruthy()
      expect( isThisMinute(validNumberCustom.updated_at) ).toBeTruthy()
    })

    test('Should not update created_at date', () => {
      const yesterday = moment().subtract(1, 'days').toDate()
      const context = Object.assign(validNumberCustom, { created_at: yesterday })

      const boundMiddlewareFunc = CustomField.schema._middlewareFuncs.preSave.bind(context)
      const next = jest.fn()

      boundMiddlewareFunc(next)

      expect(validNumberCustom.slug).toBe('number_customfield')
      expect(validNumberCustom.created_at).toBe(yesterday)
      expect( isThisMinute(validNumberCustom.updated_at) ).toBeTruthy()
    })

  })

  describe('preUpdate Middleware', () => {
    
    test('Should call next')

    test('Should update the slug if name is passed')

    test('Should prevent modification of the slug and return a ValidationError')

    test('Should prevent modification of type and return a ValidationError')

    test('Should update updated_at date')

    test('Should iterate and update products if values modified')

    test('Should iterate and update products if min or max modified')

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