const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

jest.mock('../../models/Store')
const Store = require('../../models/Store')

const storeCtrl = require('../storeCtrl')

const uSchemas = require('../../utils/validSchemas')

describe('storeCtrl', () => {
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
    let stores
  
    beforeEach(() => {
      stores = [
        uSchemas.getValidStore(),
        uSchemas.getValidStore()
      ]
  
      Store.find = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(stores)
        })
      }))
    })

    test('Should call Store.find', async () => {
      await storeCtrl.apiAll(req, res)
      expect(Store.find.mock.calls.length).toBe(1)
    })
  
    test('Should send the returned stores', async () => {
      await storeCtrl.apiAll(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(stores)
    })
  
    test('Should throw a UnexpectedError', async () => {
      Store.find = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          reject(new Error('Faked Error'))
        })
      }))
      await storeCtrl.apiAll(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

  describe('apiCreate', () => {
    let storeToSend, savedStore

    beforeEach(() => {
      storeToSend = uSchemas.getValidStore()
      savedStore  = uSchemas.getValidStore()
      req.body = storeToSend
      Store.prototype.save = jest.fn(() => new Promise((resolve, reject) => {
        resolve(savedStore)
      }))
    })

    test('Should instantiate a Store with the sent body', async () => {
      await storeCtrl.apiCreate(req, res)

      expect(Store.mock.calls.length).toBe(1)
      expect(Store.mock.calls[0][0]).toBe(storeToSend)
    })

    test('Should call Store.prototype.save', async () => {
      await storeCtrl.apiCreate(req, res)
      expect(Store.prototype.save.mock.calls.length).toBe(1)
    })

    test('Should send back the saved Store', async () => {
      await storeCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toEqual(savedStore)
    })

    test('Should send a ValidationError', async () => {
      Store.prototype.save = jest.fn(prod => new Promise((resolve, reject) => {
        const valError = new Error('Faked Error')
        valError.name = "ValidationError"
        reject(valError)
      }))
  
      await storeCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(403)
      expect(res.data).toBe("Validation Error")
    })

    test('Should send a DuplicationError', async () => {
      Store.prototype.save = jest.fn(prod => new Promise((resolve, reject) => {
        const dupError = new Error('Faked Error')
        dupError.code = 11000
        reject(dupError)
      }))
  
      await storeCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(409)
      expect(res.data).toBe('Duplicated Name')
    })

    test('Should send a UnexpectedError', async () => {
      Store.prototype.save = jest.fn(prod => new Promise((resolve, reject) => {
        reject(new Error('Faked Error'))
      }))
  
      await storeCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

  describe('apiRead', () => {
    let idToSend, storeToReturn

    beforeEach(() => {
      idToSend = new ObjectId('aaafffaaafffaaafffaaafff')
      storeToReturn = uSchemas.getValidStore()
      req.params = {
        id: idToSend
      }

      Store.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(storeToReturn)
        })
      }))
    })

    test('Should call Store.findById with the id in req.params.id', async () => {
      await storeCtrl.apiRead(req, res)
  
      expect(Store.findById.mock.calls.length).toBe(1)
      expect(Store.findById.mock.calls[0][0]).toBe(req.params.id)
    })
  
    test('Should send the retrieved Store', async () => {
      await storeCtrl.apiRead(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(storeToReturn)
    })
  
    test('Should send "Store with: <recieved_id>, not found"', async () => {
      Store.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve(null) })
      }))
  
      await storeCtrl.apiRead(req, res)
  
      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Store with id: ${idToSend}, not found`)
    })
  
    test('Should send "Unexpected Error"', async () => {
      Store.findById = jest.fn(id => {throw new Error('Faked Error')})
  
      await storeCtrl.apiRead(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

  describe('apiRemove', () => {
    let idToSend, removedStore

    beforeEach(() => {
      idToSend = new ObjectId('fffaaafffaaafffaaafffaaa')
      removedStore = uSchemas.getValidStore()
      req.params = {
        id: idToSend
      }

      Store.findByIdAndRemove = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(removedStore)
        })
      }))
    })

    test('Should call Store.findByIdAndRemove() with the sent id', async () => {
      await storeCtrl.apiRemove(req, res)
  
      expect(Store.findByIdAndRemove.mock.calls.length).toBe(1)
      expect(Store.findByIdAndRemove.mock.calls[0][0]).toBe(req.params.id)
    })
  
    test('Should send the removed Store', async () => {
      await storeCtrl.apiRemove(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(removedStore)
    })    
  
    test('Should send 404 "Store with id: <sent_id>, not found', async () => {
      Store.findByIdAndRemove = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          let castErr = new Error('Faked Error')
          castErr.name = "CastError"
          reject(castErr)
        })
      }))
  
      await storeCtrl.apiRemove(req, res)
  
      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Store with id: ${idToSend}, not found`)
    })
  
    test('Should send "Unexpected Error"', async () => {
      Store.findByIdAndRemove = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          reject(new Error('Faked Error'))
        })
      }))
  
      await storeCtrl.apiRemove(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })
  
  describe('apiUpdate', () => {
    let idToSend, update, updateReturn

    beforeEach(() => {
      idToSend     = new ObjectId('fffaaafffaaafffaaafffaaa')
      update = JSON.stringify({ tracking: 'omg' })
      updateReturn = Object.assign(uSchemas.getValidStore(), update)
      req.params = {
        id: idToSend
      }
      req.body = update

      Store.findByIdAndUpdate = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(updateReturn)
        })
      }))
    })

    test('Should call Store.findByIdAndUpdate with sent id and options new: true', async () => {
      await storeCtrl.apiUpdate(req, res)

      expect(Store.findByIdAndUpdate.mock.calls.length).toBe(1)
      expect(Store.findByIdAndUpdate.mock.calls[0][0]).toBe(idToSend)
      expect(Store.findByIdAndUpdate.mock.calls[0][1]).toBe(update)
      expect(Store.findByIdAndUpdate.mock.calls[0][2]).toEqual({new: true})
    })

    test('Should send the updated Store', async () => {
      await storeCtrl.apiUpdate(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toEqual(updateReturn)
    })

    test('Should send 404 "Store <sent_id> not found"', async () => {
      Store.findByIdAndUpdate = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          const notFoundErr = new Error('Faked Error')
          notFoundErr.name = "CastError"
          reject(notFoundErr)
        })
      }))
  
      await storeCtrl.apiUpdate(req, res)
  
      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Store with id: ${idToSend}, not found`)
    })
  
    test('Should send 403 "Validation Error"', async () => {
      Store.findByIdAndUpdate = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          const valErr = new Error('Faked Error')
          valErr.name = "ValidationError"
          reject(valErr)
        })
      }))
  
      await storeCtrl.apiUpdate(req, res)
  
      expect(res.statusCode).toBe(403)
      expect(res.data).toBe('Validation Error')
    })
  
    test('Should send 409 "Duplicated Name"', async () => {
      Store.findByIdAndUpdate = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          const dupErr = new Error('Faked Error')
          dupErr.code = 11000
          reject(dupErr)
        })
      }))
  
      await storeCtrl.apiUpdate(req, res)
  
      expect(res.statusCode).toBe(409)
      expect(res.data).toBe("Duplicated Name")
    })
  
    test('Should send 500 "Unexpected Error"', async () => {
      Store.findByIdAndUpdate = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {reject(new Error('Faked Error'))})
      }))
  
      await storeCtrl.apiUpdate(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe("Unexpected Error")
    })

  })
    
})
