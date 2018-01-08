const Client = require('../Client')

const { howManyKeys } = require('../../utils')
const { getValidClient } = require('../../utils/validSchemas')

describe('Client model', () => {
  let validClient

  beforeEach(() => { validClient = getValidClient() })

  test('Should be valid', () => {
    const m = new Client(validClient)
    const v = m.validateSync()

    expect(v).toBeFalsy()
  })

  test('Should be invalid if missing: name, email, password', () => {
    const m = new Client( Object.assign(validClient, { name: undefined, email: undefined, password: undefined }) )
    const v = m.validateSync()

    expect(howManyKeys(v.errors)).toBe(3)
    expect(v.errors.name).toBeTruthy()
    expect(v.errors.email).toBeTruthy()
    expect(v.errors.password).toBeTruthy()
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

  test('Should be invalid if address id is empty', () => {
    const m = new Client( Object.assign(validClient, { addresses: [ '' ] }) )
    const v = m.validateSync()

    expect(howManyKeys(v.errors)).toBe(1)
    expect(v.errors.addresses).toBeTruthy()
  })

  test('Should be invalid if address id is malformed', () => {
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

})