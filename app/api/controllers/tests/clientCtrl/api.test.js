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
          reject(new Error('Faked Error'))
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

    test('Should send a DuplicationError', async () => {
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
  
  describe('apiRead', () => {
    let idToSend, clientToReturn

    beforeEach(() => {
      idToSend = new ObjectId('aaafffaaafffaaafffaaafff')
      clientToReturn = uSchemas.getValidClient()
      req.params = {
        id: idToSend
      }

      Client.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(clientToReturn)
        })
      }))
    })

    test('Should call Client.findById with the id in req.params.id', async () => {
      await clientCtrl.apiRead(req, res)
  
      expect(Client.findById.mock.calls.length).toBe(1)
      expect(Client.findById.mock.calls[0][0]).toBe(req.params.id)
    })
  
    test('Should send the retrieved client formatted', async () => {
      await clientCtrl.apiRead(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(clientToReturn)
    })
  
    test('Should send "Client with: <recieved_id>, not found"', async () => {
      Client.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve(null) })
      }))
  
      await clientCtrl.apiRead(req, res)
  
      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Client with id: ${idToSend}, not found`)
    })
  
    test('Should send "Unexpected Error"', async () => {
      Client.findById = jest.fn(id => {throw new Error('Faked Error')})
  
      await clientCtrl.apiRead(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })
  
  describe('apiRemove', () => {
    let idToSend, removedClient

    beforeEach(() => {
      idToSend = new ObjectId('fffaaafffaaafffaaafffaaa')
      removedClient =  uSchemas.getValidClient()
      req.params = {
        id: idToSend
      }

      Client.findByIdAndRemove = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(removedClient)
        })
      }))
    })

    test('Should call Client.findByIdAndRemove() with the sent id', async () => {
      await clientCtrl.apiRemove(req, res)
  
      expect(Client.findByIdAndRemove.mock.calls.length).toBe(1)
      expect(Client.findByIdAndRemove.mock.calls[0][0]).toBe(req.params.id)
    })
  
    test('Should send the removed Client', async () => {
      await clientCtrl.apiRemove(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(removedClient)
    })    
  
    test('Should send 404 "Client with id: <sent_id>, not found', async () => {
      Client.findByIdAndRemove = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          let castErr = new Error('Faked Error')
          castErr.name = "CastError"
          reject(castErr)
        })
      }))
  
      await clientCtrl.apiRemove(req, res)
  
      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Client with id: ${idToSend}, not found`)
    })
  
    test('Should send "Unexpected Error"', async () => {
      Client.findByIdAndRemove = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          reject(new Error('Faked Error'))
        })
      }))
  
      await clientCtrl.apiRemove(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })
  
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
