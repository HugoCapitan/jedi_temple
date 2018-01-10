const _ = require('lodash')

jest.mock('../../../../models/CustomField')
const CustomField = require('../../../../models/CustomField')
const customFieldCtrl = require('../../../customFieldCtrl')

describe('CustomField Controller -> apiAll()', () => {
  let req, res, fields

  beforeEach(() => {setupTest()})

  test('Should call CustomField.find()', async () => {
    await customFieldCtrl.apiAll(req, res)
    expect(CustomField.find.mock.calls.length).toBe(1)
  })

  test('Should send the retrieved fields', async () => {
    await customFieldCtrl.apiAll(req, res)
    
    expect(res.statusCode).toBe(200)
    expect(res.data).toEqual(fields)
  })

  test('Should send "Unexpected Error"', async () => {
    CustomField.find = jest.fn(() => {throw new Error('Faked Error')})

    await customFieldCtrl.apiAll(req, res)

    expect(res.statusCode).toBe(500)
    expect(res.data).toBe('Unexpected Error')
  })

  function setupTest () {
    req = {}
    res = {
      send(data) { this.data = data },
      json(data) { this.data = data },
      status(code) {
        this.statusCode = code
        return this
      }
    }

    fields = [{name: 'Some Name'}, {name: 'Another Name'}]

    CustomField.find = jest.fn(() => _.cloneDeep(fields))    
  }
})