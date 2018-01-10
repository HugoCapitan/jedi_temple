const _ = require('lodash')

jest.mock('../../../models/CustomField')
const CustomField = require('../../../models/CustomField')
const customFieldCtrl = require('../../customFieldCtrl')

const productCtrl = require('../../productCtrl')
const utils = require('../../../utils')

describe('CustomFieldCtrl -> update()', () => {
  let fieldToSend, oldField, updatedField,
      idToSend

  beforeEach(() => { setupTest() })

  test('Should call CustomField.findByIdAndUpdate() using the sent id and field', async () => {
    updatedField = _.clone(fieldToSend)

    await customFieldCtrl.update(idToSend, fieldToSend)    

    expect(CustomField.findByIdAndUpdate.mock.calls.length).toBe(1)
    expect(CustomField.findByIdAndUpdate.mock.calls[0][0]).toEqual('expected_id')
    expect(CustomField.findByIdAndUpdate.mock.calls[0][1]).toEqual(updatedField)
  })

  test('Should call CustomField.findById with the sent id', async () => {
    await customFieldCtrl.update(idToSend, fieldToSend)

    expect(CustomField.findById.mock.calls.length).toBe(1)
    expect(CustomField.findById.mock.calls[0][0]).toBe('expected_id')
  })

  test('Should return the updated field', async () => {
    const returnedField = await customFieldCtrl.update(idToSend, fieldToSend)

    expect(returnedField).toEqual(updatedField)
  })

  test('Should throw a Error with customOrigin == "Product"', async () => {
    productCtrl.updateAllProductsCustom = jest.fn(() => {
      let prodErr = new Error('Faked Error')
      prodErr.customOrigin = 'Product'
      throw prodErr
    })

    try {
      await customFieldCtrl.update(idToSend, fieldToSend)
    } catch (e) {
      expect(e.customOrigin).toBe('Product')
    }
  })
  
  test('Should throw a "CustomField <sent_id> not found" Error with customOrigin', async () => {
    CustomField.findByIdAndUpdate = jest.fn(() => {
      let notFoundErr = new Error('Faked Error')
      notFoundErr.name = "CastError"
      throw notFoundErr
    })

    try {
      await customFieldCtrl.update(idToSend, fieldToSend)
    } catch (e) {
      expect(e.customOrigin).toBe('Field')
      expect(e.customMessage).toBe(`CustomField ${idToSend} not found`)
    }
  })

  test('Should throw a "Validation Error"', async () => {
    CustomField.findByIdAndUpdate = jest.fn(() => {
      let valErr = new Error('Faked Error')
      valErr.name = "ValidationError"
      throw valErr
    })

    try {
      await customFieldCtrl.update(idToSend, fieldToSend)
    } catch (e) {
      expect(e.customOrigin).toBe('Field')
      expect(e.customMessage).toBe('Validation Error')
    }
  })

  test('Should throw a "Duplicated Name" Error', async () => {
    CustomField.findByIdAndUpdate = jest.fn(() => {
      let dupErr = new Error('Faked Error')
      dupErr.code = 11000
      throw dupErr
    })

    try {
      await customFieldCtrl.update(idToSend, fieldToSend)
    } catch (e) {
      expect(e.customOrigin).toBe('Field')
      expect(e.customMessage).toBe('Duplicated Name')
    }
  })

  test('Should throw an "Unexpected Error" Error', async () => {
    CustomField.findByIdAndUpdate = jest.fn(() => {throw new Error('Faked Error')})

    try {
      await customFieldCtrl.update(idToSend, fieldToSend)
    } catch (e) {
      expect(e.customOrigin).toBe('Field')
      expect(e.customMessage).toBe('Unexpected Error')
    }
  })

  function setupTest() {
    fieldToSend = {
      name: 'New Name',
      show: true
    }
    oldField = {
      name: 'Old Name',
      slug: 'old_name',
      show: false
    }
    updatedField = {
      name: 'New Name',
      slug: 'new_name',
      show: true
    }

    idToSend = 'expected_id'

    CustomField.findByIdAndUpdate = jest.fn(() => _.clone(oldField))
    CustomField.findById = jest.fn(() => _.clone(updatedField))

    productCtrl.updateAllProductsCustom = jest.fn(() => {
      return new Promise((resolve, reject) => {
        resolve()
      })
    })

    jest.spyOn(utils, 'slugify')
  }

})