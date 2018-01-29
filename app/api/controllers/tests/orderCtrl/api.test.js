const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const orderCtrl = require('../../orderCtrl')

jest.mock('../../../models/Order')
const Order = require('../../../models/Order')

const uSchemas = require('../../../utils/validSchemas')

describe('orderCtrl -> API', () => {
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
    let orders
  
    beforeEach(() => {
      orders = [
        uSchemas.getValidOrder(),
        uSchemas.getValidOrder()
      ]
  
      Order.find = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(orders)
        })
      }))
    })
  
    test('Should call Order.find', async () => {
      await orderCtrl.apiAll(req, res)
      expect(Order.find.mock.calls.length).toBe(1)
    })
  
    test('Should send the returned orders', async () => {
      await orderCtrl.apiAll(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(orders)
    })
  
    test('Should throw a UnexpectedError', async () => {
      Order.find = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          reject(new Error('Faked Error'))
        })
      }))
      await orderCtrl.apiAll(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })
  
  })

  describe('apiCreate', () => {
    let orderToSend, savedOrder

    beforeEach(() => {
      orderToSend = uSchemas.getValidOrder()
      savedOrder  = uSchemas.getValidOrder()
      req.body = orderToSend
      Order.prototype.save = jest.fn(() => new Promise((resolve, reject) => {
        resolve(savedOrder)
      }))
    })

    test('Should instantiate a Order with the sent body', async () => {
      await orderCtrl.apiCreate(req, res)

      expect(Order.mock.calls.length).toBe(1)
      expect(Order.mock.calls[0][0]).toBe(orderToSend)
    })

    test('Should call Order.prototype.save', async () => {
      await orderCtrl.apiCreate(req, res)
      expect(Order.prototype.save.mock.calls.length).toBe(1)
    })

    test('Should send back the saved Order', async () => {
      await orderCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toEqual(savedOrder)
    })

    test('Should send a ValidationError', async () => {
      Order.prototype.save = jest.fn(prod => new Promise((resolve, reject) => {
        const valError = new Error('Faked Error')
        valError.name = "ValidationError"
        reject(valError)
      }))
  
      await orderCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(403)
      expect(res.data).toBe("Validation Error")
    })

    test('Should send a DuplicationError', async () => {
      Order.prototype.save = jest.fn(prod => new Promise((resolve, reject) => {
        const dupError = new Error('Faked Error')
        dupError.code = 11000
        reject(dupError)
      }))
  
      await orderCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(409)
      expect(res.data).toBe('Duplicated Name')
    })

    test('Should send a UnexpectedError', async () => {
      Order.prototype.save = jest.fn(prod => new Promise((resolve, reject) => {
        reject(new Error('Faked Error'))
      }))
  
      await orderCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

  describe('apiRead', () => {
    let idToSend, orderToReturn

    beforeEach(() => {
      idToSend = new ObjectId('aaafffaaafffaaafffaaafff')
      orderToReturn = uSchemas.getValidOrder()
      req.params = {
        id: idToSend
      }

      Order.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(orderToReturn)
        })
      }))
    })

    test('Should call Order.findById with the id in req.params.id', async () => {
      await orderCtrl.apiRead(req, res)
  
      expect(Order.findById.mock.calls.length).toBe(1)
      expect(Order.findById.mock.calls[0][0]).toBe(req.params.id)
    })
  
    test('Should send the retrieved Order', async () => {
      await orderCtrl.apiRead(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(orderToReturn)
    })
  
    test('Should send "Order with: <recieved_id>, not found"', async () => {
      Order.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve(null) })
      }))
  
      await orderCtrl.apiRead(req, res)
  
      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Order with id: ${idToSend}, not found`)
    })
  
    test('Should send "Unexpected Error"', async () => {
      Order.findById = jest.fn(id => {throw new Error('Faked Error')})
  
      await orderCtrl.apiRead(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

  describe('apiRemove', () => {
    let idToSend, removedOrder

    beforeEach(() => {
      idToSend = new ObjectId('fffaaafffaaafffaaafffaaa')
      removedOrder = uSchemas.getValidOrder()
      req.params = {
        id: idToSend
      }

      Order.findByIdAndRemove = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(removedOrder)
        })
      }))
    })

    test('Should call Order.findByIdAndRemove() with the sent id', async () => {
      await orderCtrl.apiRemove(req, res)
  
      expect(Order.findByIdAndRemove.mock.calls.length).toBe(1)
      expect(Order.findByIdAndRemove.mock.calls[0][0]).toBe(req.params.id)
    })
  
    test('Should send the removed Order', async () => {
      await orderCtrl.apiRemove(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(removedOrder)
    })    
  
    test('Should send 404 "Order with id: <sent_id>, not found', async () => {
      Order.findByIdAndRemove = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          let castErr = new Error('Faked Error')
          castErr.name = "CastError"
          reject(castErr)
        })
      }))
  
      await orderCtrl.apiRemove(req, res)
  
      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Order with id: ${idToSend}, not found`)
    })
  
    test('Should send "Unexpected Error"', async () => {
      Order.findByIdAndRemove = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          reject(new Error('Faked Error'))
        })
      }))
  
      await orderCtrl.apiRemove(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

  describe('apiUpdate', () => {
    let idToSend, update, updateReturn

    beforeEach(() => {
      idToSend     = new ObjectId('fffaaafffaaafffaaafffaaa')
      update = JSON.stringify({ tracking: 'omg' })
      updateReturn = Object.assign(uSchemas.getValidOrder(), update)
      req.params = {
        id: idToSend
      }
      req.body = update

      Order.findByIdAndUpdate = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(updateReturn)
        })
      }))
    })

    test('Should call Order.findByIdAndUpdate with sent id and options new: true', async () => {
      await orderCtrl.apiUpdate(req, res)

      expect(Order.findByIdAndUpdate.mock.calls.length).toBe(1)
      expect(Order.findByIdAndUpdate.mock.calls[0][0]).toBe(idToSend)
      expect(Order.findByIdAndUpdate.mock.calls[0][1]).toBe(update)
      expect(Order.findByIdAndUpdate.mock.calls[0][2]).toEqual({new: true})
    })

    test('Should send the updated Order', async () => {
      await orderCtrl.apiUpdate(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toEqual(updateReturn)
    })

    test('Should send 404 "Order <sent_id> not found"', async () => {
      Order.findByIdAndUpdate = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          const notFoundErr = new Error('Faked Error')
          notFoundErr.name = "CastError"
          reject(notFoundErr)
        })
      }))
  
      await orderCtrl.apiUpdate(req, res)
  
      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Order with id: ${idToSend}, not found`)
    })
  
    test('Should send 403 "Validation Error"', async () => {
      Order.findByIdAndUpdate = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          const valErr = new Error('Faked Error')
          valErr.name = "ValidationError"
          reject(valErr)
        })
      }))
  
      await orderCtrl.apiUpdate(req, res)
  
      expect(res.statusCode).toBe(403)
      expect(res.data).toBe('Validation Error')
    })
  
    test('Should send 409 "Duplicated Name"', async () => {
      Order.findByIdAndUpdate = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          const dupErr = new Error('Faked Error')
          dupErr.code = 11000
          reject(dupErr)
        })
      }))
  
      await orderCtrl.apiUpdate(req, res)
  
      expect(res.statusCode).toBe(409)
      expect(res.data).toBe("Duplicated Name")
    })
  
    test('Should send 500 "Unexpected Error"', async () => {
      Order.findByIdAndUpdate = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {reject(new Error('Faked Error'))})
      }))
  
      await orderCtrl.apiUpdate(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe("Unexpected Error")
    })

  })


})