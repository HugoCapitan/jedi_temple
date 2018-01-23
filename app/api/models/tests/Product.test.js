const Product     = require('../Product')
const CustomField = require('../CustomField')

const { howManyKeys } = require('../../utils')
const { getValidProduct, getValidNumberCustom } = require('../../utils/validSchemas')

describe('Normal Product Model', () => {
  let validProduct

  beforeEach(() => { validProduct = getValidProduct() })

  test('Should be fine', () => {
    const m = new Product(validProduct)
    const v = m.validateSync()

    expect(v).toBeFalsy()
  })

  test('Should be invalid if empty: name, price, stock', () => {
    const wrongProduct = Object.assign({}, validProduct, {name: undefined, stock: undefined, price: undefined})

    const m = new Product(wrongProduct)
    const v = m.validateSync()

    expect(howManyKeys(v.errors)).toBe(3)

    expect(v.errors.name).toBeTruthy()
    expect(v.errors.stock).toBeTruthy()
    expect(v.errors.price).toBeTruthy()
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

  describe('preSave Middleware', () => {

    test('Should be fine')

    test('Should slugify name')

    test('Should add creation and update dates')

    test('Shold update updated_at date')

    test('Should ')

    test('Should send error: Slug is not manually updatable')

  })

  describe('preUpdate Middleware', () => {
    
    test('Should be fine')
    
    test('Should slugify name')

    test('Should update updated_at date')

    test('Should send alert if empty stock')

    test('Should send error: Slug is not manually updatable')
  
  })


  describe('preRemove Middleware', () => {

    test('Should be fine')

    test('Should call Store.find with prod id')

    test('Should update and save found stores')

    test('Should call Client.find with prod id in wishlist')

    test('Should update and save found wishlists')

    test('Should send Store.find error')

    test('Should send Store.update error')

    test('Should send Client.find error')

    test('Should send Client.update error')

  })

})