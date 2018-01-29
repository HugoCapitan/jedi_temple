const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const customFieldCtrl = require('../../customFieldCtrl')

jest.mock('../../../models/CustomField')
const CustomField = require('../../../models/CustomField')

const uSchemas = require('../../../utils/validSchemas')

describe('customFieldCtrl -> apiValues', () => {
  let req, res, foundCustomField, customFieldIdToSend

  beforeEach(() => {
    customFieldIdToSend = new ObjectId('aaafffaaafffaaafffaaafff')
    foundCustomField = Object.assign(uSchemas.getValidStringCustom(), {
      save: jest.fn(() => new Promise((resolve, reject) => { resolve() }))
    })

    CustomField.findById = jest.fn(() => ({
      exec: () => new Promise((resolve, reject) => {
        resolve(foundCustomField)
      })
    }))

    req = {
      params: {
        custom_id: customFieldIdToSend
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

  describe('-> apiCreateValue', () => {
    let valueToSend, updatedCustomField

    beforeEach(() => {
      valueToSend = { value: 'hey this is the new value' }
      
      updatedCustomField = Object.assign({}, foundCustomField, { 
        values: [...foundCustomField.values , valueToSend]
      })

      req.body = valueToSend
    })

    test('Should call CustomField.findById with the sent id', async () => {
      await customFieldCtrl.apiCreateValue(req, res)

      expect(CustomField.findById.mock.calls.length).toBe(1)
      expect(CustomField.findById.mock.calls[0][0]).toBe(customFieldIdToSend)
    })

    test('Should push sent value to found CustomField\'s values array', async () => {
      await customFieldCtrl.apiCreateValue(req, res)

      expect(foundCustomField.values.length).toBe(3)
      expect(foundCustomField.values).toEqual(updatedCustomField.values)
    })

    test('Should call foundCustomField.save', async () => {
      await customFieldCtrl.apiCreateValue(req, res)

      expect(foundCustomField.save.mock.calls.length).toBe(1)
    })

    test('Should return the saved CustomField', async () => {
      Object.assign(updatedCustomField, {password: undefined, salt: undefined})
      await customFieldCtrl.apiCreateValue(req, res)
      
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(foundCustomField)
      expect(res.data).toEqual(updatedCustomField)
      expect(res.data.password).toBeFalsy()
      expect(res.data.salt).toBeFalsy()
    })
    
    test('Should send a NotFoundError', async () => {
      CustomField.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve(null) })
      }))

      await customFieldCtrl.apiCreateValue(req, res)

      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`CustomField with id: ${customFieldIdToSend}, not found`)
    })

    test('Should send a ValidationError', async () => {
      foundCustomField.save = jest.fn(() => new Promise((resolve, reject) => {
        const err = new Error('Faked Error')
        err.name = 'ValidationError'
        reject(err)
      }))

      await customFieldCtrl.apiCreateValue(req, res)

      expect(res.statusCode).toBe(403)
      expect(res.data).toBe('Validation Error')
    }) 

    test('Should send a UnexpectedError', async () => {
      foundCustomField.save = jest.fn(() => new Promise((resolve, reject) => { 
        reject(new Error('Faked Error')) 
      }))

      await customFieldCtrl.apiCreateValue(req, res)

      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

  describe('-> apiRemoveValue', () => {
    let valueIdToSend, updatedCustomField

    beforeEach(() => {
      valueIdToSend = new ObjectId('aaa000aaa000aaa000aaa000')
      updatedCustomField = Object.assign({}, foundCustomField, { values: [ foundCustomField.values[0] ] })
      req.params.value_id = valueIdToSend
      foundCustomField.values.pull = jest.fn(() => { foundCustomField.values.pop() })
    }) 

    test('Should call CustomField.findById with sent CustomField_id', async () => {
      await customFieldCtrl.apiRemoveValue(req, res)

      expect(CustomField.findById.mock.calls.length).toBe(1)
      expect(CustomField.findById.mock.calls[0][0]).toBe(customFieldIdToSend)
    })

    test('Should call foundCustomField.values.pull with sent value_id', async () => {
      const expectedQuery = { _id: valueIdToSend }
      
      await customFieldCtrl.apiRemoveValue(req, res)

      expect(foundCustomField.values.pull.mock.calls.length).toBe(1)
      expect(foundCustomField.values.pull.mock.calls[0][0]).toEqual(expectedQuery)
    })

    test('Should call save on foundCustomField', async () => {
      await customFieldCtrl.apiRemoveValue(req, res)

      expect(foundCustomField.values.length).toBe(1)
      expect(foundCustomField.save.mock.calls.length).toBe(1)
    })
    
    test('Should return the updated CustomField', async () => {
      await customFieldCtrl.apiRemoveValue(req, res)

      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(foundCustomField)
    })

    test('Should return CustomField NotFound Error', async () => {
      CustomField.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve(null) })
      }))

      await customFieldCtrl.apiRemoveValue(req, res)

      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`CustomField with id: ${customFieldIdToSend}, not found`)
    })

    test('Should return UnexpectedError', async () => {
      foundCustomField.save = jest.fn(() => new Promise((resolve, reject) => { 
        reject(new Error('Faked Error')) 
      }))

      await customFieldCtrl.apiRemoveValue(req, res)

      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

  describe('-> apiUpdateValue', () => {
    let valueIdToSend, foundValue, valueUpdate, updatedValue

    beforeEach(() => {
      valueIdToSend = new ObjectId('fff000fff000fff000fff000')
      foundValue = { _id: valueIdToSend, value: 'waaaat' }
      valueUpdate = { value: 'newwaaaat' }
      updatedValue = Object.assign({}, foundValue, valueUpdate)

      foundCustomField.values = [...foundCustomField.values, foundValue]
      foundCustomField.values.id = jest.fn(() => foundValue)

      req.params.value_id = valueIdToSend
      req.body = valueUpdate
    })

    test('Should call CustomField.findById with the sent custom_id', async () => {
      await customFieldCtrl.apiUpdateValue(req, res)

      expect(CustomField.findById.mock.calls.length).toBe(1)
      expect(CustomField.findById.mock.calls[0][0]).toBe(customFieldIdToSend)
    })
  
    test('Should call foundCustomField.values.id with the sent value_id', async() => {
      await customFieldCtrl.apiUpdateValue(req, res)

      expect(foundCustomField.values.id.mock.calls.length).toBe(1)
      expect(foundCustomField.values.id.mock.calls[0][0]).toBe(valueIdToSend)
    })

    test('Should update the desired value', async () => {
      await customFieldCtrl.apiUpdateValue(req, res)

      expect(foundValue).toEqual(updatedValue)
      expect(foundCustomField.values.length).toBe(3)
      expect(foundCustomField.values[2]).toEqual(updatedValue)
    })

    test('Should call save on the foundCustomField', async () => {
      await customFieldCtrl.apiUpdateValue(req, res)
      
      expect(foundCustomField.save.mock.calls.length).toBe(1)
    })

    test('Should return the saved CustomField', async () => {
      await customFieldCtrl.apiUpdateValue(req, res)
      
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(foundCustomField)
      expect(res.data.password).toBeFalsy()
      expect(res.data.salt).toBeFalsy()      
    })

    test('Should send a CustomField NotFoundError', async () => {
      CustomField.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve(null) })
      }))

      await customFieldCtrl.apiUpdateValue(req, res)

      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`CustomField with id: ${customFieldIdToSend}, not found`)
    })

    test('Should send a value NotFoundError', async () => {
      foundCustomField.values.id = jest.fn(() => null)

      await customFieldCtrl.apiUpdateValue(req, res)

      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Value with id: ${valueIdToSend}, not found for CustomField with id: ${customFieldIdToSend}`)
    })

    test('Should throw a ValidationError', async () => {
      foundCustomField.save = jest.fn(() => new Promise((resolve, reject) => {
        const err = new Error('Faked Error')
        err.name = 'ValidationError'
        reject(err)
      }))

      await customFieldCtrl.apiUpdateValue(req, res)

      expect(res.statusCode).toBe(403)
      expect(res.data).toBe('Validation Error')
    })

    test('Should send a UnexpectedError', async () => {
      foundCustomField.save = jest.fn(() => new Promise((resolve, reject) => { 
        reject(new Error('Faked Error')) 
      }))

      await customFieldCtrl.apiUpdateValue(req, res)

      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

})
