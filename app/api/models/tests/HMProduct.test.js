const HMProduct = require('../HMProduct')

const { howManyKeys } = require('../../utils')
const { getValidHMProduct } = require('../../utils/validSchemas')

describe('HMProduct Model', () => {
  let validHMProduct

  beforeEach(() => { validHMProduct = getValidHMProduct() })

  test('Should be valid', () => {
    const m = new HMProduct(validHMProduct)
    const v = m.validateSync()

    expect(v).toBeFalsy()
  })

  test('Should be invalid if empty name', () => {
    const m = new HMProduct( Object.assign(validHMProduct, { name: undefined }) )
    const v = m.validateSync()

    expect(howManyKeys(v.errors)).toBe(1)
    expect(v.errors.name).toBeTruthy()
  })

  describe('Material subschema', () => {

    test('Should be invalid if material missing price or name')  

    test('Should be invalid if product missing required customs: hmmodel, material')

    test('Should be invalid if model price different from material price')

  })

})