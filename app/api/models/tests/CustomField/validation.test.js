const moment = require('moment')
const _ = require('lodash')
const { ObjectId } = require('mongoose').Schema.Types

jest.mock('../../Product')
jest.mock('../../Store')
const Product = require('../../Product')
const Store = require('../../Store')
const CustomField = require('../../CustomField')

const uCommon  = require('../../../utils')
const uValid   = require('../../../utils/validators')
const uSchemas = require('../../../utils/validSchemas')

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

    expect(uCommon.howManyKeys(v['errors'])).toBe(3)

    expect(v.errors.name).toBeTruthy()
    expect(v.errors.type).toBeTruthy()
    expect(v.errors.show).toBeTruthy()
  })

  test('Number should be invalid if empty: min, max, unit, unit_place', () => {
    const m = new CustomField({ name: 'Some name', type: 'number', show: false })
    const v = m.validateSync()

    expect(uCommon.howManyKeys(v['errors'])).toBe(4)

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

    expect(uCommon.howManyKeys(v['errors'])).toBe(3)

    expect(v.errors.min).toBeTruthy()
    expect(v.errors.max).toBeTruthy()
    expect(v.errors.unit_place).toBeTruthy()
  })

  test('Number should be invalid if min > max', () => {
    const wrongMaxMinCF = Object.assign(validNumberCustom, { min: '500', max: '400' })
    
    const m = new CustomField(wrongMaxMinCF)
    const v = m.validateSync()

    expect(uCommon.howManyKeys(v['errors'])).toBe(2)

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

    expect(uCommon.howManyKeys(v['errors'])).toBe(1)

    expect(v.errors['values.0.value']).toBeTruthy()
  })

  test('String should be invald if malformed values', () => {
    const invalidString = Object.assign( validStringCustom, { values: [ { value: 'fine' }, 'wrongval1' ] } )

    const m = new CustomField( invalidString )
    const v = m.validateSync()

    expect( uCommon.howManyKeys(v.errors) ).toBe(1)
    expect( v.errors.values ).toBeTruthy()
  })

  test('Number should be invalid if values sent', () => {
    const invalidNumber = Object.assign( validNumberCustom, { values: validStringCustom.values } )

    const m = new CustomField(invalidNumber)
    const v = m.validateSync()

    expect( uCommon.howManyKeys(v.errors) ).toBe(1)
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

    expect( uCommon.howManyKeys(v.errors) ).toBe(4)
    expect( v.errors.min ).toBeTruthy()
    expect( v.errors.max ).toBeTruthy()
    expect( v.errors.unit ).toBeTruthy()
    expect( v.errors.unit_place ).toBeTruthy()
  })

  function setupTest () {
    validNumberCustom = uSchemas.getValidNumberCustom()
    validStringCustom = uSchemas.getValidStringCustom()
  }
})