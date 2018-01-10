const _ = require('lodash')

jest.mock('../../../../models/CustomField')
const CustomField = require('../../../../models/CustomField')
const customFieldCtrl = require('../../../customFieldCtrl')

describe('CustomFieldCtrl -> apiCreate()', () => {
  let req, res, fieldToSend, savedField

  beforeEach(() => { setupTest() })

  test('Should instantiate a CustomField with the sent req.body', async () => {
    await customFieldCtrl.apiCreate(req, res)

    expect(CustomField.mock.calls.length).toBe(1)
    expect(CustomField.mock.calls[0][0]).toEqual(fieldToSend)
  })

  test('Should call CustomField.prototype.save()', async () => {
    await customFieldCtrl.apiCreate(req, res)
    expect(CustomField.prototype.save.mock.calls.length).toBe(1)
  })

  test('Should send back the new customField', async () => {
    await customFieldCtrl.apiCreate(req, res)

    expect(res.statusCode).toBe(200)
    expect(res.data).toEqual(savedField)
  })

  test('Should send "Validation Error"', async () => {
    CustomField.prototype.save = jest.fn(prod => {
      let valError = new Error('Faked Error')
      valError.name = "ValidationError"
      throw valError
    })

    await customFieldCtrl.apiCreate(req, res)

    expect(res.statusCode).toBe(403)
    expect(res.data).toBe("Validation Error")
  })

  test('Should send "Duplicated Name"', async () => {
    CustomField.prototype.save = jest.fn(prod => {
      let dupError = new Error('Faked Error')
      dupError.code = 11000
      throw dupError
    })

    await customFieldCtrl.apiCreate(req, res)

    expect(res.statusCode).toBe(409)
    expect(res.data).toBe('Duplicated Name')
  })

  test('Should send "Unexpected Error"', async () => {
    CustomField.prototype.save = jest.fn(prod => {throw new Error('Faked Error')})

    await customFieldCtrl.apiCreate(req, res)

    expect(res.statusCode).toBe(500)
    expect(res.data).toBe('Unexpected Error')
  })
  
  function setupTest() {
    req = {}
    res = {
      send(data) { this.data = data },
      json(data) { this.data = data },
      status(code) {
        this.statusCode = code
        return this
      }
    }

    fieldToSend = { name: 'Field Name' }

    savedField = _.cloneDeep(fieldToSend)
    req.body = _.cloneDeep(fieldToSend)    

    CustomField.prototype.save = jest.fn(() => savedField)
  }

})