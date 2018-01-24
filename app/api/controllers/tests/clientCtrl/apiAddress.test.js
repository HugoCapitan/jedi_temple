const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const clientCtrl = require('../../clientCtrl')

jest.mock('../../../models/Client')
const Client = require('../../../models/Client')

const uSchemas = require('../../../utils/validSchemas')

describe('clientCtrl -> apiAddress', () => {
  let req, res, foundClient, clientIdToSend

  beforeEach(() => {
    idToSend = new ObjectId('aaafffaaafffaaafffaaafff')
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
        client_id: idToSend
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

    test('Should call Client.findById with the sent id')

    test('Should push sent address to found client\'s addresses array')

    test('Should call foundClient.save')

    test('Should return the saved Client')
    
    test('Should send a NotFoundError')

    test('Should send a ValidationError')

    test('Should send a UnexpectedError')

  })

  describe('-> apiUpdateAddress', () => {})

  describe('-> apiRemoveAddress', () => {})

})