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
  
  describe('apiCreate', () => {})
  
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
