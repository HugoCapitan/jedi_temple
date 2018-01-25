const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const clientCtrl = require('../../clientCtrl')

jest.mock('../../../models/Client')
const Client = require('../../../models/Client')

const uSchemas = require('../../../utils/validSchemas')

describe('clientCtrl api ids collections', () => {
  let req, res, clientIdToSend, collectionObjIdToSend, foundClient

  beforeEach(() => {
    clientIdToSend = new ObjectId('0000aaaa0000aaaa0000aaaa')
    collectionObjIdToSend = new ObjectId('aaaa0000aaaa0000aaaa0000')
    foundClient = Object.assign(uSchemas.getValidClient(), {
      save: jest.fn(() => new Promise((resolve, reject) => { resolve() }))
    })

    Client.findById = jest.fn(() => ({
      exec: () => new Promise((resolve, reject) => {
        resolve(foundClient)
      })
    }))

    foundClient.orders.pull = jest.fn(() => { foundClient.orders.pop() })
    foundClient.wishlist.pull = jest.fn(() => { foundClient.wishlist.pop() })
    foundClient.reservations.pull = jest.fn(() => { foundClient.reservations.pop() })

    req = {
      params: {
        client_id: clientIdToSend
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
  
  describe('-> addOrder', () => {

    beforeEach(() => {
      req.params.order_id = collectionObjIdToSend
    })
    
    test('Should call Client.findById', async () => {
      await clientCtrl.apiAddOrder(req, res)

      expect(Client.findById.mock.calls.length).toBe(1)
      expect(Client.findById.mock.calls[0][0]).toBe(clientIdToSend)
    })

    test('Should push order to foundClient.orders', async () => {
      await clientCtrl.apiAddOrder(req, res)

      expect(foundClient.orders.length).toBe(2)
      expect(foundClient.orders.find(id => id === collectionObjIdToSend)).toBeTruthy()
    })

    test('Should call foundClient.save', async () => {
      await clientCtrl.apiAddOrder(req, res)

      expect(foundClient.save.mock.calls.length).toBe(1)
    })

    test('Should return the foundClient updated', async () => {
      await clientCtrl.apiAddOrder(req, res)

      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(foundClient)
    })

    test('Should return NotFoundError', async () => {
      Client.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(null)
        })
      }))

      await clientCtrl.apiAddOrder(req, res)

      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Client with id: ${clientIdToSend}, not found`)
    })

    test('Should return ValidationError', async () => {
      foundClient.save = jest.fn(() => new Promise((resolve, reject) => {
        const err = new Error('Faked Error')
        err.name = 'ValidationError'
        reject(err)
      }))

      await clientCtrl.apiAddOrder(req, res)

      expect(res.statusCode).toBe(403)
      expect(res.data).toBe('Validation Error')
    })

    test('Should return UnexpectedError', async () => {
      foundClient.save = jest.fn(() => new Promise((resolve, reject) => {
        reject(new Error('Faked Error'))
      }))

      await clientCtrl.apiAddOrder(req, res)

      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

  describe('-> removeOrder', () => {

    beforeEach(() => {
      req.params.order_id = collectionObjIdToSend
    })

    test('Should call Client.findById', async () => {
      await clientCtrl.apiRemoveOrder(req, res)

      expect(Client.findById.mock.calls.length).toBe(1)
      expect(Client.findById.mock.calls[0][0]).toBe(clientIdToSend)
    })

    test('Should pull order from foundClient.orders', async () => {
      await clientCtrl.apiRemoveOrder(req, res)

      expect(foundClient.orders.pull.mock.calls.length).toBe(1)
      expect(foundClient.orders.pull.mock.calls[0][0]).toEqual(collectionObjIdToSend)
      expect(foundClient.orders.length).toBe(0)
    })

    test('Should call foundClient.save', async () => {
      await clientCtrl.apiRemoveOrder(req, res)

      expect(foundClient.save.mock.calls.length).toBe(1)
    })

    test('Should return the foundClient updated', async () => {
      await clientCtrl.apiRemoveOrder(req, res)

      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(foundClient)
    })

    test('Should return NotFoundError', async () => {
      Client.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(null)
        })
      }))

      await clientCtrl.apiRemoveOrder(req, res)

      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Client with id: ${clientIdToSend}, not found`)
    })

    test('Should return UnexpectedError', async () => {
      foundClient.save = jest.fn(() => new Promise((resolve, reject) => {
        reject(new Error('Faked Error'))
      }))

      await clientCtrl.apiRemoveOrder(req, res)

      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })
  }) 

  describe('-> addReservation', () => {

  })

  describe('-> removeReservation', () => {

  })

  describe('-> addWish', () => {

  })

  describe('-> removeWish', () => {

  })

})