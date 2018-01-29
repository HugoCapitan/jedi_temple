const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const customFieldCtrl = require('../../hmProductCtrl')

jest.mock('../../../models/HMProduct')
const HMProduct = require('../../../models/HMProduct')

const uSchemas = require('../../../utils/validSchemas')

describe('customFieldCtrl -> API', () => {
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
    let hmProducts
  
    beforeEach(() => {
      hmProducts = [
        uSchemas.getValidNumberCustom(),
        uSchemas.getValidStringCustom()
      ]
  
      HMProduct.find = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(hmProducts)
        })
      }))
    })
  
    test('Should call HMProduct.find', async () => {
      await customFieldCtrl.apiAll(req, res)
      expect(HMProduct.find.mock.calls.length).toBe(1)
    })
  
    test('Should send the returned hmProducts', async () => {
      await customFieldCtrl.apiAll(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(hmProducts)
    })
  
    test('Should throw a UnexpectedError', async () => {
      HMProduct.find = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          reject(new Error('Faked Error'))
        })
      }))
      await customFieldCtrl.apiAll(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })
  
  })

})