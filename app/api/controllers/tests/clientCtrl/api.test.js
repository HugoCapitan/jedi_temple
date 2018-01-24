const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const clientCtrl = require('../../clientCtrl')

jest.mock('../../../models/Client')
const Client = require('../../../models/Client')

const uSchemas = require('../../../utils/validSchemas')

describe('API', () => {
  let req, res

  beforeEach(() => {setupTests()})

  describe('apiAll', () => {
    let clients

    beforeEach(() => {
      clients = [ uSchemas.getValidClient(), uSchemas.getValidClient() ]
      Client.find = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(clients)
        })
      }))
    })
    
    test('Should call Client.find', async () => {
      await clientCtrl.apiAll(req, res)
      expect(Client.find.mock.calls.length).toBe(1)
    })
  
    test('Should send the returned clients', async () => {
      await clientCtrl.apiAll(req, res)

      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(clients)
    })
  
    test('Should throw a UnexpectedError', async () => {
      Client.find = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          const err = 'Faked Error'
          reject(err)
        })
      }))
      await clientCtrl.apiAll(req, res)

      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })
  
  })
  
  describe('apiCreate', () => {
    let clientToSend, savedClient

    beforeEach(() => {
      clientToSend = uSchemas.getValidClient()
      savedClient  = uSchemas.getValidClient()
      req.body = clientToSend
      Client.prototype.save = jest.fn(() => new Promise((resolve, reject) => {
        resolve(savedClient)
      }))
    })

    test('Should instantiate a Client with the sent body', async () => {
      await clientCtrl.apiCreate(req, res)

      expect(Client.mock.calls.length).toBe(1)
      expect(Client.mock.calls[0][0]).toBe(clientToSend)
    })

    test('Should call Client.prototype.save', async () => {
      await clientCtrl.apiCreate(req, res)
      expect(Client.prototype.save.mock.calls.length).toBe(1)
    })

    test('Should send back the saved Client', async () => {
      await clientCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toEqual(savedClient)
    })

    test('Should send a ValidationError', async () => {
      Client.prototype.save = jest.fn(prod => new Promise((resolve, reject) => {
        const valError = new Error('Faked Error')
        valError.name = "ValidationError"
        reject(valError)
      }))
  
      await clientCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(403)
      expect(res.data).toBe("Validation Error")
    })

    test('Should send a DuplocationError', async () => {
      Client.prototype.save = jest.fn(prod => new Promise((resolve, reject) => {
        const dupError = new Error('Faked Error')
        dupError.code = 11000
        reject(dupError)
      }))
  
      await clientCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(409)
      expect(res.data).toBe('Duplicated Email')
    })

    test('Should send a UnexpectedError', async () => {
      Client.prototype.save = jest.fn(prod => new Promise((resolve, reject) => {
        reject(new Error('Faked Error'))
      }))
  
      await clientCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })
  
  describe('apiRead', () => {})
  
  describe('apiRemove', () => {})
  
  describe('apiUpdate', () => {})

  function setupTests() {
    req = {}
    res = {
      send(data) { this.data = data },
      json(data) { this.data = data },
      status(code) {
        this.statusCode = code
        return this
      }
    }
  }
})
