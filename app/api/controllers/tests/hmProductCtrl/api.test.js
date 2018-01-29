const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const hmProductCtrl = require('../../hmProductCtrl')

jest.mock('../../../models/HMProduct')
const HMProduct = require('../../../models/HMProduct')

const uSchemas = require('../../../utils/validSchemas')

describe('hmProductCtrl -> API', () => {
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
    let hmProducts
  
    beforeEach(() => {
      hmProducts = [
        uSchemas.getValidHMProduct(),
        uSchemas.getValidHMProduct()
      ]
  
      HMProduct.find = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(hmProducts)
        })
      }))
    })
  
    test('Should call HMProduct.find', async () => {
      await hmProductCtrl.apiAll(req, res)
      expect(HMProduct.find.mock.calls.length).toBe(1)
    })
  
    test('Should send the returned hmProducts', async () => {
      await hmProductCtrl.apiAll(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(hmProducts)
    })
  
    test('Should throw a UnexpectedError', async () => {
      HMProduct.find = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          reject(new Error('Faked Error'))
        })
      }))
      await hmProductCtrl.apiAll(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })
  
  })

  describe('apiCreate', () => {
    let hmProductToSend, savedHMProduct

    beforeEach(() => {
      hmProductToSend = uSchemas.getValidHMProduct()
      savedHMProduct  = uSchemas.getValidHMProduct()
      req.body = hmProductToSend
      HMProduct.prototype.save = jest.fn(() => new Promise((resolve, reject) => {
        resolve(savedHMProduct)
      }))
    })

    test('Should instantiate a HMProduct with the sent body', async () => {
      await hmProductCtrl.apiCreate(req, res)

      expect(HMProduct.mock.calls.length).toBe(1)
      expect(HMProduct.mock.calls[0][0]).toBe(hmProductToSend)
    })

    test('Should call HMProduct.prototype.save', async () => {
      await hmProductCtrl.apiCreate(req, res)
      expect(HMProduct.prototype.save.mock.calls.length).toBe(1)
    })

    test('Should send back the saved HMProduct', async () => {
      await hmProductCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toEqual(savedHMProduct)
    })

    test('Should send a ValidationError', async () => {
      HMProduct.prototype.save = jest.fn(prod => new Promise((resolve, reject) => {
        const valError = new Error('Faked Error')
        valError.name = "ValidationError"
        reject(valError)
      }))
  
      await hmProductCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(403)
      expect(res.data).toBe("Validation Error")
    })

    test('Should send a DuplicationError', async () => {
      HMProduct.prototype.save = jest.fn(prod => new Promise((resolve, reject) => {
        const dupError = new Error('Faked Error')
        dupError.code = 11000
        reject(dupError)
      }))
  
      await hmProductCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(409)
      expect(res.data).toBe('Duplicated Name')
    })

    test('Should send a UnexpectedError', async () => {
      HMProduct.prototype.save = jest.fn(prod => new Promise((resolve, reject) => {
        reject(new Error('Faked Error'))
      }))
  
      await hmProductCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

  describe('apiRead', () => {
    let idToSend, hmProductToReturn

    beforeEach(() => {
      idToSend = new ObjectId('aaafffaaafffaaafffaaafff')
      hmProductToReturn = uSchemas.getValidHMProduct()
      req.params = {
        id: idToSend
      }

      HMProduct.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(hmProductToReturn)
        })
      }))
    })

    test('Should call HMProduct.findById with the id in req.params.id', async () => {
      await hmProductCtrl.apiRead(req, res)
  
      expect(HMProduct.findById.mock.calls.length).toBe(1)
      expect(HMProduct.findById.mock.calls[0][0]).toBe(req.params.id)
    })
  
    test('Should send the retrieved HMProduct', async () => {
      await hmProductCtrl.apiRead(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(hmProductToReturn)
    })
  
    test('Should send "HMProduct with: <recieved_id>, not found"', async () => {
      HMProduct.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve(null) })
      }))
  
      await hmProductCtrl.apiRead(req, res)
  
      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`HMProduct with id: ${idToSend}, not found`)
    })
  
    test('Should send "Unexpected Error"', async () => {
      HMProduct.findById = jest.fn(id => {throw new Error('Faked Error')})
  
      await hmProductCtrl.apiRead(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

  describe('apiRemove', () => {
    let idToSend, removedHMProduct

    beforeEach(() => {
      idToSend = new ObjectId('fffaaafffaaafffaaafffaaa')
      removedHMProduct = uSchemas.getValidHMProduct()
      req.params = {
        id: idToSend
      }

      HMProduct.findByIdAndRemove = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(removedHMProduct)
        })
      }))
    })

    test('Should call HMProduct.findByIdAndRemove() with the sent id', async () => {
      await hmProductCtrl.apiRemove(req, res)
  
      expect(HMProduct.findByIdAndRemove.mock.calls.length).toBe(1)
      expect(HMProduct.findByIdAndRemove.mock.calls[0][0]).toBe(req.params.id)
    })
  
    test('Should send the removed HMProduct', async () => {
      await hmProductCtrl.apiRemove(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(removedHMProduct)
    })    
  
    test('Should send 404 "HMProduct with id: <sent_id>, not found', async () => {
      HMProduct.findByIdAndRemove = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          let castErr = new Error('Faked Error')
          castErr.name = "CastError"
          reject(castErr)
        })
      }))
  
      await hmProductCtrl.apiRemove(req, res)
  
      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`HMProduct with id: ${idToSend}, not found`)
    })
  
    test('Should send "Unexpected Error"', async () => {
      HMProduct.findByIdAndRemove = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          reject(new Error('Faked Error'))
        })
      }))
  
      await hmProductCtrl.apiRemove(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

})