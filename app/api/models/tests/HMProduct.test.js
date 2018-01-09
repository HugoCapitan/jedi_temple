const HMProduct = require('../HMProduct')
const Product = require('../Product')

const { howManyKeys } = require('../../utils')
const { getValidHMProduct, getValidProduct } = require('../../utils/validSchemas')

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

    test('Should be invalid if material missing price or material', () => {
      const malformedMaterial = getValidHMProduct()
      malformedMaterial.materials[0].price = undefined
      malformedMaterial.materials[0].material = undefined

      const m = new HMProduct( malformedMaterial )
      const v = m.validateSync()

      expect(howManyKeys(v.errors)).toBe(2)
      expect(v.errors['materials.0.material']).toBeTruthy()
      expect(v.errors['materials.0.price']).toBeTruthy()
    })  

    // test('Should be invalid if product missing required customs: hmmodel, material', () => {
    //   const malformedProduct = new Product( getValidProduct() ) // <- returns product without material neither hmmodel schemas
    //   const malformedHMProduct = getValidHMProduct()
    //   malformedHMProduct.materials[0].models[0] = malformedProduct._id

    //   const m = new HMProduct( malformedHMProduct )
    //   const v = m.validateSync()

    //   console.log(v.errors)
    //   // expect()
    // })

    // test('Should be invalid if model price different from material price')

  })

})