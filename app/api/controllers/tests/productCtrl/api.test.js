const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const productCtrl = require('../../productCtrl')

jest.mock('../../../models/Product')
const Product = require('../../../models/Product')

const uSchemas = require('../../../utils/validSchemas')

describe('productCtrl -> API', () => {
  let req, res

  beforeEach(() => {
    req = {}
    res = {
      send(data) { this.data = data },
      json(data) { this.data = data },
      status(code) {
        this.statusCode = code
        return this
      }
    }
  })

  describe('apiAll', () => {
    let products
  
    beforeEach(() => {
      products = [
        uSchemas.getValidProduct(),
        uSchemas.getValidProduct()
      ]
  
      Product.find = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(products)
        })
      }))
    })
  
    test('Should call Product.find', async () => {
      await productCtrl.apiAll(req, res)
      expect(Product.find.mock.calls.length).toBe(1)
    })
  
    test('Should send the returned products', async () => {
      await productCtrl.apiAll(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(products)
    })
  
    test('Should throw a UnexpectedError', async () => {
      Product.find = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          reject(new Error('Faked Error'))
        })
      }))
      await productCtrl.apiAll(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })
  
  })

  describe('apiCreate', () => {
    let productToSend, savedProduct

    beforeEach(() => {
      productToSend = uSchemas.getValidProduct()
      savedProduct  = uSchemas.getValidProduct()
      req.body = productToSend
      Product.prototype.save = jest.fn(() => new Promise((resolve, reject) => {
        resolve(savedProduct)
      }))
    })

    test('Should instantiate a Product with the sent body', async () => {
      await productCtrl.apiCreate(req, res)

      expect(Product.mock.calls.length).toBe(1)
      expect(Product.mock.calls[0][0]).toBe(productToSend)
    })

    test('Should call Product.prototype.save', async () => {
      await productCtrl.apiCreate(req, res)
      expect(Product.prototype.save.mock.calls.length).toBe(1)
    })

    test('Should send back the saved Product', async () => {
      await productCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toEqual(savedProduct)
    })

    test('Should send a ValidationError', async () => {
      Product.prototype.save = jest.fn(prod => new Promise((resolve, reject) => {
        const valError = new Error('Faked Error')
        valError.name = "ValidationError"
        reject(valError)
      }))
  
      await productCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(403)
      expect(res.data).toBe("Validation Error")
    })

    test('Should send a DuplicationError', async () => {
      Product.prototype.save = jest.fn(prod => new Promise((resolve, reject) => {
        const dupError = new Error('Faked Error')
        dupError.code = 11000
        reject(dupError)
      }))
  
      await productCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(409)
      expect(res.data).toBe('Duplicated Name')
    })

    test('Should send a UnexpectedError', async () => {
      Product.prototype.save = jest.fn(prod => new Promise((resolve, reject) => {
        reject(new Error('Faked Error'))
      }))
  
      await productCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

  describe('apiRead', () => {
    let idToSend, productToReturn

    beforeEach(() => {
      idToSend = new ObjectId('aaafffaaafffaaafffaaafff')
      productToReturn = uSchemas.getValidProduct()
      req.params = {
        id: idToSend
      }

      Product.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(productToReturn)
        })
      }))
    })

    test('Should call Product.findById with the id in req.params.id', async () => {
      await productCtrl.apiRead(req, res)
  
      expect(Product.findById.mock.calls.length).toBe(1)
      expect(Product.findById.mock.calls[0][0]).toBe(req.params.id)
    })
  
    test('Should send the retrieved Product', async () => {
      await productCtrl.apiRead(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(productToReturn)
    })
  
    test('Should send "Product with: <recieved_id>, not found"', async () => {
      Product.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve(null) })
      }))
  
      await productCtrl.apiRead(req, res)
  
      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Product with id: ${idToSend}, not found`)
    })
  
    test('Should send "Unexpected Error"', async () => {
      Product.findById = jest.fn(id => {throw new Error('Faked Error')})
  
      await productCtrl.apiRead(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

  describe('apiRemove', () => {
    let idToSend, removedProduct

    beforeEach(() => {
      idToSend = new ObjectId('fffaaafffaaafffaaafffaaa')
      removedProduct = uSchemas.getValidProduct()
      req.params = {
        id: idToSend
      }

      Product.findByIdAndRemove = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(removedProduct)
        })
      }))
    })

    test('Should call Product.findByIdAndRemove() with the sent id', async () => {
      await productCtrl.apiRemove(req, res)
  
      expect(Product.findByIdAndRemove.mock.calls.length).toBe(1)
      expect(Product.findByIdAndRemove.mock.calls[0][0]).toBe(req.params.id)
    })
  
    test('Should send the removed Product', async () => {
      await productCtrl.apiRemove(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(removedProduct)
    })    
  
    test('Should send 404 "Product with id: <sent_id>, not found', async () => {
      Product.findByIdAndRemove = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          let castErr = new Error('Faked Error')
          castErr.name = "CastError"
          reject(castErr)
        })
      }))
  
      await productCtrl.apiRemove(req, res)
  
      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Product with id: ${idToSend}, not found`)
    })
  
    test('Should send "Unexpected Error"', async () => {
      Product.findByIdAndRemove = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          reject(new Error('Faked Error'))
        })
      }))
  
      await productCtrl.apiRemove(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

  describe('apiUpdate', () => {
    let idToSend, update, updateReturn

    beforeEach(() => {
      idToSend     = new ObjectId('fffaaafffaaafffaaafffaaa')
      update = JSON.stringify({ tracking: 'omg' })
      updateReturn = Object.assign(uSchemas.getValidProduct(), update)
      req.params = {
        id: idToSend
      }
      req.body = update

      Product.findByIdAndUpdate = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(updateReturn)
        })
      }))
    })

    test('Should call Product.findByIdAndUpdate with sent id and options new: true', async () => {
      await productCtrl.apiUpdate(req, res)

      expect(Product.findByIdAndUpdate.mock.calls.length).toBe(1)
      expect(Product.findByIdAndUpdate.mock.calls[0][0]).toBe(idToSend)
      expect(Product.findByIdAndUpdate.mock.calls[0][1]).toBe(update)
      expect(Product.findByIdAndUpdate.mock.calls[0][2]).toEqual({new: true})
    })

    test('Should send the updated Product', async () => {
      await productCtrl.apiUpdate(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toEqual(updateReturn)
    })

    test('Should send 404 "Product <sent_id> not found"', async () => {
      Product.findByIdAndUpdate = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          const notFoundErr = new Error('Faked Error')
          notFoundErr.name = "CastError"
          reject(notFoundErr)
        })
      }))
  
      await productCtrl.apiUpdate(req, res)
  
      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Product with id: ${idToSend}, not found`)
    })
  
    test('Should send 403 "Validation Error"', async () => {
      Product.findByIdAndUpdate = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          const valErr = new Error('Faked Error')
          valErr.name = "ValidationError"
          reject(valErr)
        })
      }))
  
      await productCtrl.apiUpdate(req, res)
  
      expect(res.statusCode).toBe(403)
      expect(res.data).toBe('Validation Error')
    })
  
    test('Should send 409 "Duplicated Name"', async () => {
      Product.findByIdAndUpdate = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          const dupErr = new Error('Faked Error')
          dupErr.code = 11000
          reject(dupErr)
        })
      }))
  
      await productCtrl.apiUpdate(req, res)
  
      expect(res.statusCode).toBe(409)
      expect(res.data).toBe("Duplicated Name")
    })
  
    test('Should send 500 "Unexpected Error"', async () => {
      Product.findByIdAndUpdate = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {reject(new Error('Faked Error'))})
      }))
  
      await productCtrl.apiUpdate(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe("Unexpected Error")
    })

  })


})