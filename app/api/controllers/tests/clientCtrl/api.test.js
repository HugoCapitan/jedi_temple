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

    beforeEach(() => {
      Client.find = jest.fn(() => ({
        resolve
      }))
    })
    
    test('Should call Client.find')
  
    test('Should send the returned clients')
  
    test('Should throw a UnexpectedError')
  
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
