const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const customFieldCtrl = require('../../customFieldCtrl')

jest.mock('../../../models/CustomField')
const CustomField = require('../../../models/CustomField')

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
    let customFields

    beforeEach(() => {
      customFields = [
        uSchemas.getValidNumberCustom(),
        uSchemas.getValidStringCustom()
      ]

      CustomField.find = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(customFields)
        })
      }))
    })

    test('Should call CustomField.find', async () => {
      await customFieldCtrl.apiAll(req, res)
      expect(CustomField.find.mock.calls.length).toBe(1)
    })
  
    test('Should send the returned customFields', async () => {
      await customFieldCtrl.apiAll(req, res)

      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(customFields)
    })
  
    test('Should throw a UnexpectedError', async () => {
      CustomField.find = jest.fn(() => ({
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
