const _ = require('lodash')

jest.mock('../../../models/CustomField')
const CustomField = require('../../../models/CustomField')
const customFieldCtrl = require('../../customFieldCtrl')

const productCtrl = require('../../productCtrl')

describe('CustomFieldCtrl -> remove()', () => {
  let expectedId
  let deletedField

  beforeEach(() => { setupTest() })

  test('Should call CustomField.findByIdAndRemove() with the sent id', async () => {
    await customFieldCtrl.remove(expectedId)

    expect(CustomField.findByIdAndRemove.mock.calls.length).toBe(1)
    expect(CustomField.findByIdAndRemove.mock.calls[0][0]).toBe(expectedId)
  })

  test('Should return the deleted CustomField', async () => {
    const deleted = await customFieldCtrl.remove(expectedId)

    expect(deleted).toEqual(deletedField)
  })

  test('Should throw an Error with customOrigin == "Product"', async () => {
    CustomField.findByIdAndRemove = jest.fn(() => {
      let prodsErr = new Error('Faked Error')
      prodsErr.customOrigin = 'Product'
      throw prodsErr
    })

    try {
      await customFieldCtrl.remove(expectedId)
    } catch (e) {
      expect(e.customOrigin).toBe('Product')
    }
  })

  test('Should throw a "CustomField <sent_id> not found" Error with customOrigin', async () => {
    CustomField.findByIdAndRemove = jest.fn(() => {
      let castErr = new Error('Faked Error')
      castErr.name = "CastError"
      throw castErr
    })

    try {
      await customFieldCtrl.remove(expectedId)
    } catch (e) {
      expect(e.customOrigin).toBe('Field')
      expect(e.customMessage).toBe(`CustomField ${expectedId} not found`)
    }
  })

  test('Should send "Unexpected Error"', async () => {
    CustomField.findByIdAndRemove = jest.fn(() => {throw Error('Faked Error')})

    try {
      await customFieldCtrl.remove(expectedId)
    } catch (e) {
      expect(e.customOrigin).toBe('Field')
      expect(e.customMessage).toBe('Unexpected Error')
    }
  })

  function setupTest() {
    expectedId = 'expected_id'
    deletedField = {
      _id: 'expected_id',
      slug: 'some_slug'
    }

    CustomField.findByIdAndRemove = jest.fn(id => _.clone(deletedField))
  }

})
