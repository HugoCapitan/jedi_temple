const _ = require('lodash')

jest.mock('../../../models/CustomField')
const CustomField = require('../../../models/CustomField')
const customFieldCtrl = require('../../customFieldCtrl')

const productCtrl = require('../../productCtrl')
const utils = require('../../../utils')

describe('CustomFieldCtrl -> updateNameOrType()', () => {
  let fieldToSend
  let updatedField
  let expectedField
  let slugToSend

  beforeEach(() => {setupTest()})

  test('Should add a slug to the sent field', async () => {
    await customFieldCtrl.updateNameOrType(slugToSend, fieldToSend)

    expect(utils.slugify).toHaveBeenCalled()
    expect(fieldToSend.slug).toBe('new_name')
  })

  test('Should call CustomField.findByOneAndUpdate() using the sent id and field', async () => {
    expectedField = _.clone(fieldToSend)
    expectedField.slug = 'new_name'

    await customFieldCtrl.updateNameOrType(slugToSend, fieldToSend)    

    expect(CustomField.findOneAndUpdate.mock.calls.length).toBe(1)
    expect(CustomField.findOneAndUpdate.mock.calls[0][0]).toEqual({slug: slugToSend})
    expect(CustomField.findOneAndUpdate.mock.calls[0][1]).toEqual(expectedField)
  })

  test('Should call productCtrl.updateAllProductsCustom using the old field slug', async () => {
    await customFieldCtrl.updateNameOrType(slugToSend, fieldToSend)

    expect(productCtrl.updateAllProductsCustom.mock.calls.length).toBe(1)
    expect(productCtrl.updateAllProductsCustom.mock.calls[0][0]).toBe('old_name')
  })

  test('Should return the updated field', async () => {
    const returnedField = await customFieldCtrl.updateNameOrType(slugToSend, fieldToSend)
    expect(returnedField).toEqual(expectedField)
  })

  test('Should throw a Error with customOrigin == "Product"', async () => {
    productCtrl.updateAllProductsCustom = jest.fn(() => {
      let prodErr = new Error('Faked Error')
      prodErr.customOrigin = 'Product'
      throw prodErr
    })

    try {
      await customFieldCtrl.updateNameOrType(slugToSend, fieldToSend)
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
      await customFieldCtrl.updateNameOrType(slugToSend, fieldToSend)
    } catch (e) {
      expect(e.customOrigin).toBe('Field')
      expect(e.customMessage).toBe(`CustomField ${slugToSend} not found`)
    }
  })

  test('Should throw a "Validation Error"', async () => {
    CustomField.findByIdAndUpdate = jest.fn(() => {
      let valErr = new Error('Faked Error')
      valErr.name = "ValidationError"
      throw valErr
    })

    try {
      await customFieldCtrl.updateNameOrType(slugToSend, fieldToSend)
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
      await customFieldCtrl.updateNameOrType(slugToSend, fieldToSend)
    } catch (e) {
      expect(e.customOrigin).toBe('Field')
      expect(e.customMessage).toBe('Duplicated Name')
    }
  })

  test('Should throw an "Unexpected Error" Error', async () => {
    CustomField.findByIdAndUpdate = jest.fn(() => {throw new Error('Faked Error')})

    try {
      await customFieldCtrl.updateNameOrType(slugToSend, fieldToSend)
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
    updatedField = {
      name: 'Old Name',
      slug: 'old_name',
      show: false
    }
    expectedField = {
      name: 'New Name',
      slug: 'new_name',
      show: true
    }

    slugToSend = 'expected_id'

    CustomField.findOneAndUpdate = jest.fn(() => _.clone(updatedField))

    productCtrl.updateAllProductsCustom = jest.fn(() => {
      return new Promise((resolve, reject) => {
        resolve()
      })
    })

    jest.spyOn(utils, 'slugify')
  }

})