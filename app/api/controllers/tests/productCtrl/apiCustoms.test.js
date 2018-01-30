const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const productCtrl = require('../../productCtrl')

jest.mock('../../../models/Product')
const Product = require('../../../models/Product')

const uSchemas = require('../../../utils/validSchemas')

describe('productCtrl -> apiCustoms', () => {
  let req, res, foundProduct, productIdToSend

  beforeEach(() => {
    productIdToSend = new ObjectId('aaafffaaafffaaafffaaafff')
    foundProduct = Object.assign(uSchemas.getValidProduct(), {
      save: jest.fn(() => new Promise((resolve, reject) => { resolve() }))
    })

    Product.findById = jest.fn(() => ({
      exec: () => new Promise((resolve, reject) => {
        resolve(foundProduct)
      })
    }))

    req = {
      params: {
        product_id: productIdToSend
      }
    }
    res = {
      send(data) { this.data = data },
      json(data) { this.data = data },
      status(code) {
        this.statusCode = code
        return this
      }
    }
  })

  describe('apiAddCustom', () => {
    let customToSend, updatedProduct

    beforeEach(() => {
      customToSend = { custom_id: new ObjectId('fffaaaffaaaafffaaaffffaa') , value: 99 }
      
      updatedProduct = Object.assign({}, foundProduct, { 
        customs: [...foundProduct.customs, customToSend]
      })

      req.body = customToSend
    })

    test('Should call Product.findById with the sent hmproduct_id', async () => {
      await productCtrl.apiAddCustom(req, res)

      expect(Product.findById.mock.calls.length).toBe(1)
      expect(Product.findById.mock.calls[0][0]).toBe(productIdToSend)
    })

    test('Should push sent custom to found Product\'s customs array', async () => {
      await productCtrl.apiAddCustom(req, res)

      expect(foundProduct.customs.length).toBe(2)
      expect(foundProduct.customs).toEqual(updatedProduct.customs)
    })

    test('Should call foundProduct.save', async () => {
      await productCtrl.apiAddCustom(req, res)

      expect(foundProduct.save.mock.calls.length).toBe(1)
    })

    test('Should return the saved Product', async () => {
      await productCtrl.apiAddCustom(req, res)
      
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(foundProduct)
      expect(res.data).toEqual(updatedProduct)
    })
    
    test('Should send a NotFoundError', async () => {
      Product.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve(null) })
      }))

      await productCtrl.apiAddCustom(req, res)

      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Product with id: ${productIdToSend}, not found`)
    })

    test('Should send a ValidationError', async () => {
      foundProduct.save = jest.fn(() => new Promise((resolve, reject) => {
        const err = new Error('Faked Error')
        err.name = 'ValidationError'
        reject(err)
      }))

      await productCtrl.apiAddCustom(req, res)

      expect(res.statusCode).toBe(403)
      expect(res.data).toBe('Validation Error')
    }) 

    test('Should send a UnexpectedError', async () => {
      foundProduct.save = jest.fn(() => new Promise((resolve, reject) => { 
        reject(new Error('Faked Error')) 
      }))

      await productCtrl.apiAddCustom(req, res)

      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

  describe('apiRemoveCustom', () => {})

  describe('apiUpdateCustom', () => {})

})