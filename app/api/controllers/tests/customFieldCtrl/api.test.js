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

  describe('apiCreate', () => {
    let customFieldToSend, savedCustomField

    beforeEach(() => {
      customFieldToSend = uSchemas.getValidNumberCustom()
      savedCustomField  = uSchemas.getValidNumberCustom()
      req.body = customFieldToSend
      CustomField.prototype.save = jest.fn(() => new Promise((resolve, reject) => {
        resolve(savedCustomField)
      }))
    })

    test('Should instantiate a CustomField with the sent body', async () => {
      await customFieldCtrl.apiCreate(req, res)

      expect(CustomField.mock.calls.length).toBe(1)
      expect(CustomField.mock.calls[0][0]).toBe(customFieldToSend)
    })

    test('Should call CustomField.prototype.save', async () => {
      await customFieldCtrl.apiCreate(req, res)
      expect(CustomField.prototype.save.mock.calls.length).toBe(1)
    })

    test('Should send back the saved CustomField', async () => {
      await customFieldCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toEqual(savedCustomField)
    })

    test('Should send a ValidationError', async () => {
      CustomField.prototype.save = jest.fn(prod => new Promise((resolve, reject) => {
        const valError = new Error('Faked Error')
        valError.name = "ValidationError"
        reject(valError)
      }))
  
      await customFieldCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(403)
      expect(res.data).toBe("Validation Error")
    })

    test('Should send a DuplicationError', async () => {
      CustomField.prototype.save = jest.fn(prod => new Promise((resolve, reject) => {
        const dupError = new Error('Faked Error')
        dupError.code = 11000
        reject(dupError)
      }))
  
      await customFieldCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(409)
      expect(res.data).toBe('Duplicated Name')
    })

    test('Should send a UnexpectedError', async () => {
      CustomField.prototype.save = jest.fn(prod => new Promise((resolve, reject) => {
        reject(new Error('Faked Error'))
      }))
  
      await customFieldCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

  describe('apiRead', () => {
    let idToSend, customFieldToReturn

    beforeEach(() => {
      idToSend = new ObjectId('aaafffaaafffaaafffaaafff')
      customFieldToReturn = uSchemas.getValidNumberCustom()
      req.params = {
        id: idToSend
      }

      CustomField.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(customFieldToReturn)
        })
      }))
    })

    test('Should call CustomField.findById with the id in req.params.id', async () => {
      await customFieldCtrl.apiRead(req, res)
  
      expect(CustomField.findById.mock.calls.length).toBe(1)
      expect(CustomField.findById.mock.calls[0][0]).toBe(req.params.id)
    })
  
    test('Should send the retrieved CustomField', async () => {
      await customFieldCtrl.apiRead(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(customFieldToReturn)
    })
  
    test('Should send "CustomField with: <recieved_id>, not found"', async () => {
      CustomField.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve(null) })
      }))
  
      await customFieldCtrl.apiRead(req, res)
  
      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`CustomField with id: ${idToSend}, not found`)
    })
  
    test('Should send "Unexpected Error"', async () => {
      CustomField.findById = jest.fn(id => {throw new Error('Faked Error')})
  
      await customFieldCtrl.apiRead(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

})
