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

  })

  describe('preSave Middleware', () => {

    test('Should call next')

    test('Materials should iterate materials for duplicates and call next with error')

    test('Should iterate on every material\'s models for duplicates and call next with error')

  })

  describe('preUpdate Middleware', () => {

    test('Should call next')

    test('Materials should iterate materials for duplicates and call next with error')

    test('Should iterate on every material\'s models for duplicates and call next with error')

  })

  describe('preRemove Middleware', () => {

    test('Should call next')

    test('Should call stores find with the id')

    test('Should update found stores and call save')

  })

})