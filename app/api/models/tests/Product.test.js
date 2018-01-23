const moment   = require('moment')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const Product     = require('../Product')
jest.mock('../Client')
const Client = require('../Client')
jest.mock('../Store')
const Store = require('../Store')

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

    test('Should send alert if empty stock')    

  })

  describe('preUpdate Middleware', () => {

    const bindMiddleware = context => 
      Product.schema._middlewareFuncs.preUpdate.bind(context)
    
    test('Should be fine', done => {
      const _update = { name: 'A new name' }
      const boundMiddleware = bindMiddleware({_update})
      const next = err => {
        expect(err).toBeFalsy()
        done()
      }

      boundMiddleware(next)
    })
    
    test('Should slugify name', done => {
      const _update = { name: 'A New Name' }
      const boundMiddleware = bindMiddleware({_update})
      const next = err => {
        expect(err).toBeFalsy()
        expect(_update.slug).toBe('a_new_name')
        done()
      }

      boundMiddleware(next)
    })

    test('Should update updated_at date', done => {
      const _update = { name: 'A New Name' }
      const boundMiddleware = bindMiddleware({_update})
      const next = err => {
        expect(err).toBeFalsy()
        expect(_update.updated_at).toBeTruthy()
        expect( uValid.isThisMinute(_update.updated_at) ).toBe(true)
        done()
      }

      boundMiddleware(next)
    })

    test('Should send error: Slug is not manually updatable', done => {
      const _update = { slug: 'a_slug' }
      const boundMiddleware = bindMiddleware({_update})
      const next = err => {
        expect(err.message).toBe('Slug is read-only')
        expect(err.name).toBe('ValidationError')
        done()
      }

      boundMiddleware(next)
    })

    test('Should send alert if empty stock')    
  
  })


  describe('preRemove Middleware', () => {
    let remove_id
    const bindMiddleware = context => 
      Product.schema._middlewareFuncs.preRemove.bind(context)

    beforeEach(() => {
      remove_id = new ObjectId('0f0f0f0f0f0f0f0f0f0f0f0f')
      Client.find = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve([]) })
      }))
      Store.find = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve([]) })
      }))
    })

    test('Should be fine', done => {
      const _conditions = { _id: remove_id }
      const boundMiddleware = bindMiddleware({_conditions})
      const next = err => {
        expect(err).toBeFalsy()
        done()
      }

      boundMiddleware(next)
    })

    test('Should call Store.find with prod id', done => {
      const _conditions = { _id: remove_id }
      const boundMiddleware = bindMiddleware({_conditions})
      const expectedQuery = { products: remove_id }
      const next = err => {
        expect(err).toBeFalsy()
        expect(Store.find.mock.calls.length).toBe(1)
        expect(Store.find.mock.calls[0][0]).toEqual(expectedQuery)
        done()
      }

      boundMiddleware(next)
    })

    test('Should update and save found stores', done => {
      const _conditions = { _id: remove_id }
      const boundMiddleware = bindMiddleware({_conditions})
      const foundStores = getFoundStores()
      Store.find = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve(foundStores) })
      }))
      const next = err => {
        expect(err).toBeFalsy()
        expect(foundStores[0].products.length).toBe(1)
        expect(foundStores[0].products.pull.mock.calls.length).toBe(1)
        expect(foundStores[0].products.pull.mock.calls[0][0]).toEqual(remove_id)
        expect(foundStores[0].save.mock.calls.length).toBe(1)
        
        expect(foundStores[1].products.length).toBe(0)
        expect(foundStores[1].products.pull.mock.calls.length).toBe(1)
        expect(foundStores[1].products.pull.mock.calls[0][0]).toEqual(remove_id)
        expect(foundStores[1].save.mock.calls.length).toBe(1)
        done()
      }

      boundMiddleware(next)
    })

    test('Should call Client.find with prod id in wishlist', done => {
      const _conditions = { _id: remove_id }
      const boundMiddleware = bindMiddleware({_conditions})
      const expectedQuery = { wishlist: remove_id }
      const next = err => {
        expect(err).toBeFalsy()
        expect(Client.find.mock.calls.length).toBe(1)
        expect(Client.find.mock.calls[0][0]).toEqual(expectedQuery)
        done()
      }

      boundMiddleware(next)
    })

    test('Should update and save found wishlists', done => {
      const _conditions = { _id: remove_id }
      const boundMiddleware = bindMiddleware({_conditions})
      const foundClients = getFoundClients()
      Client.find = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve(foundClients) })
      }))
      const next = err => {
        expect(err).toBeFalsy()
        expect(foundClients[0].wishlist.length).toBe(1)
        expect(foundClients[0].wishlist.pull.mock.calls.length).toBe(1)
        expect(foundClients[0].wishlist.pull.mock.calls[0][0]).toEqual(remove_id)
        expect(foundClients[0].save.mock.calls.length).toBe(1)
        
        expect(foundClients[1].wishlist.length).toBe(0)
        expect(foundClients[1].wishlist.pull.mock.calls.length).toBe(1)
        expect(foundClients[1].wishlist.pull.mock.calls[0][0]).toEqual(remove_id)
        expect(foundClients[1].save.mock.calls.length).toBe(1)
        done()
      }

      boundMiddleware(next)
    })

    test('Should send Store.find error')

    test('Should send Store.update error')

    test('Should send Client.find error')

    test('Should send Client.update error')

    function getFoundStores() {
      const foundStores = [{
        products: [new ObjectId('0a0a0a0a0a0a0a0a0a0a0a0a'), remove_id],
        save: jest.fn(() => new Promise((resolve, reject) => { resolve() }))
      },{
        products: [remove_id],
        save: jest.fn(() => new Promise((resolve, reject) => { resolve() }))        
      }]

      foundStores[0].products.pull = jest.fn(() => foundStores[0].products.pop())
      foundStores[1].products.pull = jest.fn(() => foundStores[1].products.pop())
      
      return foundStores
    }

    function getFoundClients() {
      const foundClients = [{
        wishlist: [new ObjectId('0a0a0a0a0a0a0a0a0a0a0a0a'), remove_id],
        save: jest.fn(() => new Promise((resolve, reject) => { resolve() }))
      },{
        wishlist: [remove_id],
        save: jest.fn(() => new Promise((resolve, reject) => { resolve() }))        
      }]

      foundClients[0].wishlist.pull = jest.fn(() => foundClients[0].wishlist.pop())
      foundClients[1].wishlist.pull = jest.fn(() => foundClients[1].wishlist.pop())
      
      return foundClients
    }

  })

})