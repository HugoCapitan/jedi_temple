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
      clients[0].salt = 'heyhey'
      clients[1].salt = 'aloalo'
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
  
    test('Should send the returned clients without salt or pswd', async () => {
      clients = clients.map(client => Object.assign(client, {
        password: undefined, salt: undefined
      }))
      await clientCtrl.apiAll(req, res)

      expect(res.statusCode).toBe(200)
      expect(res.data).toEqual(clients)
    })

    test('None of the clients should have password nor salt', async () => {
      await clientCtrl.apiAll(req, res)

      expect(res.statusCode).toBe(200)
      for (const client of res.data) {
        expect(client.salt).toBeFalsy()
        expect(client.password).toBeFalsy()
      }
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

    test('Should send back the saved Client without password nor salt', async () => {
      await clientCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toEqual(savedClient)
      expect(res.data.password).toBeFalsy()
      expect(res.data.salt).toBeFalsy()
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
  
    test('Should send the retrieved client formatted without password nor salt', async () => {
      clientToReturn.salt = 'heyhey'

      await clientCtrl.apiRead(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(clientToReturn)
      expect(res.data.salt).toBeFalsy()
      expect(res.data.password).toBeFalsy()
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
  
  describe('apiUpdate', () => {
    let idToSend, update, updateReturn

    beforeEach(() => {
      idToSend     = new ObjectId('fffaaafffaaafffaaafffaaa')
      update = JSON.stringify({ name: 'John Doe' })
      updateReturn = Object.assign(uSchemas.getValidClient(), update)
      req.params = {
        id: idToSend
      }
      req.body = update

      Client.findByIdAndUpdate = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(updateReturn)
        })
      }))
    })

    test('Should call Client.findByIdAndUpdate with sent id and options new: true', async () => {
      await clientCtrl.apiUpdate(req, res)

      expect(Client.findByIdAndUpdate.mock.calls.length).toBe(1)
      expect(Client.findByIdAndUpdate.mock.calls[0][0]).toBe(idToSend)
      expect(Client.findByIdAndUpdate.mock.calls[0][1]).toBe(update)
      expect(Client.findByIdAndUpdate.mock.calls[0][2]).toEqual({new: true})
    })

    test('Should send the updated client without password nor salt', async () => {
      await clientCtrl.apiUpdate(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toEqual(updateReturn)
      expect(res.data.password).toBeFalsy()      
      expect(res.data.salt).toBeFalsy()      
    })

    test('Should send 404 "CustomField <sent_id> not found"', async () => {
      Client.findByIdAndUpdate = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          const notFoundErr = new Error('Faked Error')
          notFoundErr.name = "CastError"
          reject(notFoundErr)
        })
      }))
  
      await clientCtrl.apiUpdate(req, res)
  
      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Client with id: ${idToSend}, not found`)
    })
  
    test('Should send 403 "Validation Error"', async () => {
      Client.findByIdAndUpdate = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          const valErr = new Error('Faked Error')
          valErr.name = "ValidationError"
          reject(valErr)
        })
      }))
  
      await clientCtrl.apiUpdate(req, res)
  
      expect(res.statusCode).toBe(403)
      expect(res.data).toBe('Validation Error')
    })
  
    test('Should send 409 "Duplicated Name"', async () => {
      Client.findByIdAndUpdate = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          const dupErr = new Error('Faked Error')
          dupErr.code = 11000
          reject(dupErr)
        })
      }))
  
      await clientCtrl.apiUpdate(req, res)
  
      expect(res.statusCode).toBe(409)
      expect(res.data).toBe("Duplicated Name")
    })
  
    test('Should send 500 "Unexpected Error"', async () => {
      Client.findByIdAndUpdate = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {reject(new Error('Faked Error'))})
      }))
  
      await clientCtrl.apiUpdate(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe("Unexpected Error")
    })

  })

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
