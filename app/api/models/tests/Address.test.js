const Address = require('../Address')

const { howManyKeys } = require('../../utils')
const { getValidAddress } = require('../../utils/validSchemas')

describe('Address model', () => {
  
  test('Should be valid', () => {
    const m = new Address( getValidAddress() )
    const v = m.validateSync()

    expect(v).toBeFalsy()
  })

  test('Should be invalid if missing: name, email, country, city, state, zip, address_line_1', () => {
    const m = new Address( { address_line_2: 'something ' } )
    const v = m.validateSync()

    expect(howManyKeys(v.errors)).toBe(7)
    expect(v.errors.name).toBeTruthy()
    expect(v.errors.email).toBeTruthy()
    expect(v.errors.address_line_1).toBeTruthy()
    expect(v.errors.city).toBeTruthy()
    expect(v.errors.state).toBeTruthy()
    expect(v.errors.country).toBeTruthy()
    expect(v.errors.zip).toBeTruthy()
  })

  test('Should be invalid if email format is wrong', () => {
    const m = new Address( Object.assign(getValidAddress(), { email: 'thisisntanemail' }) )
    const v = m.validateSync()

    expect(howManyKeys(v.errors)).toBe(1)
    expect(v.errors.email).toBeTruthy()
  })

})