const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const customFieldCtrl = require('../../customFieldCtrl')

jest.mock('../../../models/CustomField')
const CustomField = require('../../../models/CustomField')

const uSchemas = require('../../../utils/validSchemas')

describe('CustomFieldCtrl -> create()', () => {
  let fieldToSend, savedField

  beforeEach(() => {
    fieldToSend = uSchemas.getValidNumberCustom()
    savedField  = uSchemas.getValidNumberCustom()
    CustomField.prototype.save = jest.fn(() => new Promise((resolve, reject) => {
      resolve(savedField)
    }))
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


describe('CustomFieldCtrl -> remove()', () => {
  let idToRemove, deletedField

  beforeEach(() => { 
    idToRemove = new ObjectId('ffffffffffffffffffffffff')
    deletedField = uSchemas.getValidNumberCustom()

    CustomField.findByIdAndRemove = jest.fn(() => ({
      exec: () => new Promise((resolve, reject) => { resolve(deletedField) })
    }))
   })

  test('Should call CustomField.findByIdAndRemove() with the sent id', async () => {
    await customFieldCtrl.remove(idToRemove)

    expect(CustomField.findByIdAndRemove.mock.calls.length).toBe(1)
    expect(CustomField.findByIdAndRemove.mock.calls[0][0]).toBe(idToRemove)
  })

  test('Should return the deleted CustomField', async () => {
    const deleted = await customFieldCtrl.remove(idToRemove)

    expect(deleted).toEqual(deletedField)
  })

  test('Should throw an Error with customOrigin == "Product"', async () => {
    CustomField.findByIdAndRemove = jest.fn(() => {
      let prodsErr = new Error('Faked Error')
      prodsErr.customOrigin = 'Product'
      throw prodsErr
    })

    try {
      await customFieldCtrl.remove(idToRemove)
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
      await customFieldCtrl.remove(idToRemove)
    } catch (e) {
      expect(e.customOrigin).toBe('Field')
      expect(e.customMessage).toBe(`CustomField ${idToRemove} not found`)
    }
  })

  test('Should send "Unexpected Error"', async () => {
    CustomField.findByIdAndRemove = jest.fn(() => {throw Error('Faked Error')})

    try {
      await customFieldCtrl.remove(idToRemove)
    } catch (e) {
      expect(e.customOrigin).toBe('Field')
      expect(e.customMessage).toBe('Unexpected Error')
    }
  })

})

describe('CustomFieldCtrl -> update()', () => {
  let idToSend, udpate, foundField, updatedField

  beforeEach(() => { 
    idToSend = new ObjectId('aaaaaaaaaaaaaaaaaaaaaaaa')
    update = {
      name: 'New Name',
      show: true
    }
    foundField = uSchemas.getValidNumberCustom()
    updatedField = Object.assign({}, foundField, update)

    CustomField.findByIdAndUpdate = jest.fn(() => ({
      exec: () => new Promise((resolve, reject) => {
        resolve(updatedField)
      })
    }))
  })

  test('Should call CustomField.findByIdAndUpdate() using the sent id and field and the correct options', async () => {
    const expectedOptions = { new: true }

    await customFieldCtrl.update(idToSend, update)    

    expect(CustomField.findByIdAndUpdate.mock.calls.length).toBe(1)
    expect(CustomField.findByIdAndUpdate.mock.calls[0][0]).toBe(idToSend)
    expect(CustomField.findByIdAndUpdate.mock.calls[0][1]).toBe(update)
    expect(CustomField.findByIdAndUpdate.mock.calls[0][2]).toEqual(expectedOptions)
  })

  test('Should return the updated field', async () => {
    const returnedField = await customFieldCtrl.update(idToSend, update)

    expect(returnedField).toEqual(updatedField)
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

  test('Should throw an "Unexpected Error" Error with custom origin', async () => {
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
