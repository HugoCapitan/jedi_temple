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

  describe('-> apiUpdateAddress', () => {})

  describe('-> apiRemoveAddress', () => {})

})