const Product     = require('../Product')

const { howManyKeys } = require('../../utils')
const { getValidProduct } = require('../../utils/models')

describe('Normal Product Model', () => {
  let validProduct

  beforeEach(() => { setupTest() })

  test('Should be fine', () => {
    const m = new Product(validProduct)
    const v = m.validateSync()

    expect(v).toBeFalsy()
  })

  test('Should be invalid if empty: name, stock', () => {
    const wrongProduct = Object.assign({}, validProduct, {name: undefined, stock: undefined})

    const m = new Product(wrongProduct)
    const v = m.validateSync()

    expect(howManyKeys(v.errors)).toBe(2)

    expect(v.errors.name).toBeTruthy()
    expect(v.errors.stock).toBeTruthy()
  })


  test('Should be invalid if wrong images', () => {
    const malformedImage = {
      url: 999.99,
      x: 50,
      y: 50
    }
    const malformedProduct = Object.assign({}, validProduct, { images: [malformedImage] })

    const m = new Product(malformedProduct)
    const v = m.validateSync()

    expect(howManyKeys(v.errors)).toBe(3)
    expect(v.errors['images.0.url']).toBeTruthy()
    expect(v.errors['images.0.x']).toBeTruthy()
    expect(v.errors['images.0.y']).toBeTruthy()
  })

  test('Should be invalid if required customs missing: price, description')

  function setupTest() {

    validProduct = getValidProduct()

  }
})