const CustomField = require('../CustomField')
const howManyKeys = require('../../utils').howManyKeys

const { getValidNumberCustom, getValidStringCustom } = require('../../utils/models')

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
    const m = new CustomField({ 
      name: 'Some name', 
      type: 'number',
      show: false,
      min: 'something else',
      max: 'heyhey',
      unit: 'cm',
      unit_place: 'whaaat'
    })
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

  function setupTest () {
    validNumberCustom = getValidNumberCustom()
    validStringCustom = getValidStringCustom()
  }
})