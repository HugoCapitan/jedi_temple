const moment = require('moment')

const Product     = require('../Product')
const CustomField = require('../CustomField')

const uCommon  = require('../../utils')
const uSchemas = require('../../utils/validSchemas')
const uValid   = require('../../utils/validators')

describe('Normal Product Model', () => {
  let validProduct

  beforeEach(() => { validProduct = uSchemas.getValidProduct() })

  test('Should be fine', () => {
    const m = new Product(validProduct)
    const v = m.validateSync()

    expect(v).toBeFalsy()
  })

  test('Should be invalid if empty: name, price, stock', () => {
    const wrongProduct = Object.assign({}, validProduct, {name: undefined, stock: undefined, price: undefined})

    const m = new Product(wrongProduct)
    const v = m.validateSync()

    expect(uCommon.howManyKeys(v.errors)).toBe(3)

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

    expect(uCommon.howManyKeys(v.errors)).toBe(3)
    expect(v.errors['images.0.url']).toBeTruthy()
    expect(v.errors['images.0.x']).toBeTruthy()
    expect(v.errors['images.0.y']).toBeTruthy()
  })

  describe('preSave Middleware', () => {

    const bindMiddleware = context => { 
      if (!context.isModified) context.isModified = prop => false
      return Product.schema._middlewareFuncs.preSave.bind(context)
    }

    test('Should be fine', done => {
      const context = validProduct
      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(err).toBeFalsy()
        done()
      }

      boundMiddleware(next)
    })

    test('Should slugify name', done => {
      const context = Object.assign(validProduct, { name: 'The Name' })
      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(err).toBeFalsy()
        expect(context.slug).toBe('the_name')
        done()
      }

      boundMiddleware(next)
    })

    test('Should add creation and update dates', done => {
      const context = validProduct
      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(err).toBeFalsy()
        expect( context.hasOwnProperty('created_at') ).toBe(true)
        expect( context.hasOwnProperty('updated_at') ).toBe(true)
        expect( uValid.isThisMinute(context.created_at) ).toBe(true)
        expect( uValid.isThisMinute(context.updated_at) ).toBe(true)
        done()
      }

      boundMiddleware(next)
    })

    test('Shold update updated_at date', done => {
      const lastWeek = moment().subtract(1, 'weeks')
      const context = Object.assign(validProduct, {created_at: lastWeek.toDate(), updated_at: lastWeek.toDate()})
      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(err).toBeFalsy()
        expect( lastWeek.isSame(moment(context.created_at)) )
        expect( uValid.isThisMinute(context.updated_at) ).toBeTruthy()
        done()
      }

      boundMiddleware(next)
    })

    test('Should send alert if empty stock')

    test('Should send error: Slug is not manually updatable', done => {
      const context = Object.assign(validProduct, { slug: 'yoyo' })
      context.isModified = prop => prop === 'slug'
      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(err.message).toBe('Slug is read-only')
        expect(err.name).toBe('ValidationError')
        done()
      }

      boundMiddleware(next)
    })

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