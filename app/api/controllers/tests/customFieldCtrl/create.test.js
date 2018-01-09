const _ = require('lodash')

jest.mock('../../../models/CustomField')
const CustomField     = require('../../../models/CustomField')
const customFieldCtrl = require('../../customFieldCtrl')

describe('CustomFieldCtrl -> create()', () => {
  let fieldToSend
  let savedField

  beforeEach(() => {
    fieldToSend = {
      name: 'Field Name'
    }
    savedField = _.clone(fieldToSend)
    CustomField.prototype.save = jest.fn(() => savedField)
  })

  test('Should instantiate a CustomField with the sent req.body', async () => {
    await customFieldCtrl.create(fieldToSend)

    expect(CustomField.mock.calls.length).toBe(1)
    expect(CustomField.mock.calls[0][0]).toEqual(fieldToSend)
  })

  test('Should call CustomField.prototype.save()', async () => {
    await customFieldCtrl.create(fieldToSend)
    expect(CustomField.prototype.save.mock.calls.length).toBe(1)
  })

  test('Should return the new customField', async () => {
    const returnedField = await customFieldCtrl.create(fieldToSend)
    expect(returnedField).toEqual(fieldToSend)
  })

  test('Should throw "Validation Error"', async () => {
    CustomField.prototype.save = jest.fn(prod => {
      let valError = new Error('Faked Error')
      valError.name = "ValidationError"
      throw valError
    })

    try {
      await customFieldCtrl.create(fieldToSend)
    } catch(e) {
      expect(e.customOrigin).toBe('Field')
      expect(e.customMessage).toBe('Validation Error')
    }
  })

  test('Should throw "Duplicated Name"', async () => {
    CustomField.prototype.save = jest.fn(prod => {
      let dupError = new Error('Faked Error')
      dupError.code = 11000
      throw dupError
    })

    try {
      await customFieldCtrl.create(fieldToSend)      
    } catch (e) {
      expect(e.customOrigin).toBe('Field')
      expect(e.customMessage).toBe('Duplicated Name')
    }
  })

  test('Should send "Unexpected Error"', async () => {
    CustomField.prototype.save = jest.fn(prod => {throw new Error('Faked Error')})

    try {
      await customFieldCtrl.create(fieldToSend)      
    } catch (e) {
      expect(e.customOrigin).toBe('Field')
      expect(e.customMessage).toBe('Unexpected Error')
    }    
  })

})