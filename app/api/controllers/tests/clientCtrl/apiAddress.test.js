const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const clientCtrl = require('../../clientCtrl')

jest.mock('../../../models/Client')
const Client = require('../../../models/Client')

const uSchemas = require('../../../utils/validSchemas')

describe('clientCtrl -> apiAddress', () => {
  let req, res, foundClient, clientIdToSend

  beforeEach(() => {
    clientIdToSend = new ObjectId('aaafffaaafffaaafffaaafff')
    foundClient = Object.assign(uSchemas.getValidClient(), {
      save: jest.fn(() => new Promise((resolve, reject) => { resolve() }))
    })

    Client.findById = jest.fn(() => ({
      exec: () => new Promise((resolve, reject) => {
        resolve(foundClient)
      })
    }))

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

  describe('-> apiCreateAddress', () => {
    let addressToSend, updatedClient

    beforeEach(() => {
      addressToSend = uSchemas.getValidAddress()
      
      updatedClient = Object.assign({}, foundClient, { 
        addresses: [...foundClient.addresses , addressToSend]
      })

      req.body = addressToSend
    })

    test('Should call Client.findById with the sent id', async () => {
      await clientCtrl.apiCreateAddress(req, res)

      expect(Client.findById.mock.calls.length).toBe(1)
      expect(Client.findById.mock.calls[0][0]).toBe(clientIdToSend)
    })

    test('Should push sent address to found client\'s addresses array', async () => {
      await clientCtrl.apiCreateAddress(req, res)

      expect(foundClient.addresses.length).toBe(2)
      expect(foundClient.addresses).toEqual(updatedClient.addresses)
    })

    test('Should call foundClient.save', async () => {
      await clientCtrl.apiCreateAddress(req, res)

      expect(foundClient.save.mock.calls.length).toBe(1)
    })

    test('Should return the saved Client', async () => {
      await clientCtrl.apiCreateAddress(req, res)
      
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(foundClient)
      expect(res.data).toEqual(updatedClient)
    })
    
    test('Should send a NotFoundError', async () => {
      Client.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve(null) })
      }))

      await clientCtrl.apiCreateAddress(req, res)

      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Client with id: ${clientIdToSend}, not found`)
    })

    test('Should send a ValidationError', async () => {
      foundClient.save = jest.fn(() => new Promise((resolve, reject) => {
        const err = new Error('Faked Error')
        err.name = 'ValidationError'
        reject(err)
      }))

      await clientCtrl.apiCreateAddress(req, res)

      expect(res.statusCode).toBe(403)
      expect(res.data).toBe('Validation Error')
    }) 

    test('Should send a UnexpectedError', async () => {
      foundClient.save = jest.fn(() => new Promise((resolve, reject) => { 
        reject(new Error('Faked Error')) 
      }))

      await clientCtrl.apiCreateAddress(req, res)

      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

  describe('-> apiUpdateAddress', () => {
    let addressIdToSend, foundAddress, addressUpdate, updatedAddress

    beforeEach(() => {
      addressIdToSend = new ObjectId('fff000fff000fff000fff000')
      foundAddress = uSchemas.getValidAddress()
      addressUpdate = { email: 'new@email.com' }
      updatedAddress = Object.assign({}, foundAddress, addressUpdate)

      foundClient.addresses = [...foundClient.addresses, foundAddress]
      foundClient.addresses.find = jest.fn(() => foundAddress)

      req.params.address_id = addressIdToSend
      req.body = addressUpdate
    })

    test('Should call Client.findById with the sent client_id', async () => {
      await clientCtrl.apiUpdateAddress(req, res)

      expect(Client.findById.mock.calls.length).toBe(1)
      expect(Client.findById.mock.calls[0][0]).toBe(clientIdToSend)
    })
  
    test('Should call find on foundClient.addresses with the sent address_id', async() => {
      const expectedQuery = { _id: addressIdToSend }

      await clientCtrl.apiUpdateAddress(req, res)

      expect(foundClient.addresses.find.mock.calls.length).toBe(1)
      expect(foundClient.addresses.find.mock.calls[0][0]).toEqual(expectedQuery)
    })

    test('Should update the desired address', async () => {
      await clientCtrl.apiUpdateAddress(req, res)

      expect(foundAddress).toEqual(updatedAddress)
    })

    test('Should call save on the foundClient', async () => {
      await clientCtrl.apiUpdateAddress(req, res)
      
      expect(foundClient.save.mock.calls.length).toBe(1)
    })

    test('Should return the saved client', async () => {
      await clientCtrl.apiUpdateAddress(req, res)
      
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(foundClient)
    })

    test('Should send a Client NotFoundError', async () => {
      Client.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve(null) })
      }))

      await clientCtrl.apiUpdateAddress(req, res)

      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Client with id: ${clientIdToSend}, not found`)
    })

    test('Should send a Address NotFoundError', async () => {
      foundClient.addresses.find = jest.fn(() => null)

      await clientCtrl.apiUpdateAddress(req, res)

      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Address with id: ${addressIdToSend}, not found for client with id: ${clientIdToSend}`)
    })

    test('Should throw a ValidationError', async () => {
      foundClient.save = jest.fn(() => new Promise((resolve, reject) => {
        const err = new Error('Faked Error')
        err.name = 'ValidationError'
        reject(err)
      }))

      await clientCtrl.apiUpdateAddress(req, res)

      expect(res.statusCode).toBe(403)
      expect(res.data).toBe('Validation Error')
    })

    test('Should send a UnexpectedError', async () => {
      foundClient.save = jest.fn(() => new Promise((resolve, reject) => { 
        reject(new Error('Faked Error')) 
      }))

      await clientCtrl.apiUpdateAddress(req, res)

      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

  describe('-> apiRemoveAddress', () => {
    let addressIdToSend, updatedClient

    beforeEach(() => {
      addressIdToSend = new ObjectId('aaa000aaa000aaa000aaa000')
      updatedClient = Object.assign({}, foundClient, { addresses: [] })
      req.params.address_id = addressIdToSend
      foundClient.addresses.pull = jest.fn(() => { foundClient.addresses.pop() })
    }) 

    test('Should call client.findById with sent client_id', async () => {
      await clientCtrl.apiRemoveAddress(req, res)

      expect(Client.findById.mock.calls.length).toBe(1)
      expect(Client.findById.mock.calls[0][0]).toBe(clientIdToSend)
    })

    test('Should call foundClient.addresses.pull with sent addresd_id', async () => {
      const expectedQuery = { _id: addressIdToSend }
      
      await clientCtrl.apiRemoveAddress(req, res)

      expect(foundClient.addresses.pull.mock.calls.length).toBe(1)
      expect(foundClient.addresses.pull.mock.calls[0][0]).toEqual(expectedQuery)
    })

    test('Should call save on foundClient', async () => {
      await clientCtrl.apiRemoveAddress(req, res)

      expect(foundClient.addresses.length).toBe(0)
      expect(foundClient.save.mock.calls.length).toBe(1)
    })
    
    test('Should return the updated client', async () => {
      await clientCtrl.apiRemoveAddress(req, res)

      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(foundClient)
    })

    test('Should return client NotFound Error', async () => {
      Client.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve(null) })
      }))

      await clientCtrl.apiRemoveAddress(req, res)

      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Client with id: ${clientIdToSend}, not found`)
    })

    test('Should return UnexpectedError', async () => {
      foundClient.save = jest.fn(() => new Promise((resolve, reject) => { 
        reject(new Error('Faked Error')) 
      }))

      await clientCtrl.apiRemoveAddress(req, res)

      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

})