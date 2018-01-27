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

  test('Should throw "Validation Error"', done => {
    CustomField.prototype.save = jest.fn(prod => new Promise((resolve, reject) => {
      let valError = new Error('Faked Error')
      valError.name = "ValidationError"
      reject(valError)
    }))

    customFieldCtrl.create(fieldToSend).then(() => { expect(1).toBe(0) }) // Failing
    .catch(e => {
      expect(e.message).toBe('Faked Error')
      expect(e.name).toBe('ValidationError')
      expect(e.customOrigin).toBe('Field')
      expect(e.customMessage).toBe('Validation Error')
      done()
    })
  })

  test('Should throw "Duplicated Name"', done => {
    CustomField.prototype.save = jest.fn(prod => new Promise((resolve, reject) => {
      let dupError = new Error('Faked Error')
      dupError.code = 11000
      reject(dupError)
    }))

    customFieldCtrl.create(fieldToSend).then(() => { expect(1).toBe(0) })
    .catch(e => {
      expect(e.message).toBe('Faked Error')
      expect(e.name).toBe('DuplicationError')
      expect(e.customOrigin).toBe('Field')
      expect(e.customMessage).toBe('Duplicated Name')
      done()
    })
  })

  test('Should send "Unexpected Error"', done => {
    CustomField.prototype.save = jest.fn(() => new Promise((resolve, reject) => {
      const err = new Error('Faked Error')
      err.name = 'WhatAnError'
      reject(err)
    }))

    customFieldCtrl.create(fieldToSend).then(() => { expect(1).toBe(0) })
    .catch(err => {
      expect(err.message).toBe('Faked Error')
      expect(err.name).toBe('WhatAnError')
      expect(err.customMessage).toBe('Unexpected Error')
      expect(err.customOrigin).toBe('Field')
      done()
    })
  })

  test('Should send a CustomOrigin error without modifying it', done => {
    CustomField.prototype.save = jest.fn(() => new Promise((resolve, reject) => {
      const err = new Error('Faked Error')
      err.name = 'WhatAnError'
      err.customOrigin = 'SUPSUP'
      err.customMessage = 'JERUR'
      reject(err)
    }))

    customFieldCtrl.create(fieldToSend).then(() => { expect(1).toBe(0) })
    .catch(err => {
      expect(err.message).toBe('Faked Error')
      expect(err.name).toBe('WhatAnError')
      expect(err.customMessage).toBe('JERUR')
      expect(err.customOrigin).toBe('SUPSUP')
      done()
    })
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

  test('Should throw a "CustomField <sent_id> not found" Error with customOrigin', done => {
    CustomField.findByIdAndRemove = jest.fn(() => ({
      exec: () => new Promise((resolve, reject) => {
        let castErr = new Error('Faked Error')
        castErr.name = "CastError"
        reject(castErr)
      })
    }))

    customFieldCtrl.remove(idToRemove).then(() => { expect(1).toBe(0) })
    .catch(e => {
      expect(e.message).toBe('Faked Error')
      expect(e.name).toBe('CastError')
      expect(e.customOrigin).toBe('Field')
      expect(e.customMessage).toBe(`CustomField with id: ${idToRemove}, not found`)
      done()
    })
  })

  test('Should send "Unexpected Error"', done => {
    CustomField.findByIdAndRemove = jest.fn(() => ({
      exec: () => new Promise((resolve, reject) => {
        const err = new Error('Faked Error')
        err.name = 'WhatAnError'
        reject(err)
      })
    }))

    customFieldCtrl.remove(idToRemove).then(() => { expect(1).toBe(0) })
    .catch(e => {
      expect(e.message).toBe('Faked Error')
      expect(e.name).toBe('WhatAnError')
      expect(e.customOrigin).toBe('Field')
      expect(e.customMessage).toBe('Unexpected Error')
      done()
    })
  })

  test('Should send a CustomOrigin error without modifying it', done => {
    CustomField.findByIdAndRemove = jest.fn(() => ({
      exec: () => new Promise((resolve, reject) => {
        const err = new Error('Faked Error')
        err.name = 'WhatAnError'
        err.customOrigin = 'SUPSUP'
        err.customMessage = 'JERUR'
        reject(err)
      })
    }))

    customFieldCtrl.remove(idToRemove).then(() => { expect(1).toBe(0) })
    .catch(err => {
      expect(err.message).toBe('Faked Error')
      expect(err.name).toBe('WhatAnError')
      expect(err.customMessage).toBe('JERUR')
      expect(err.customOrigin).toBe('SUPSUP')
      done()
    })
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
  
  test('Should throw a "CustomField <sent_id> not found" Error with customOrigin', done => {
    CustomField.findByIdAndUpdate = jest.fn(() => ({
      exec: () => new Promise((resolve, reject) => {
        let notFoundErr = new Error('Faked Error')
        notFoundErr.name = "CastError"
        reject(notFoundErr)
      })
    }))

    customFieldCtrl.update(idToSend, fieldToSend).then(() => { expect(1).toBe(0) })
    .catch(e => {
      expect(e.message).toBe('Faked Error')
      expect(e.name).toBe('CastError')
      expect(e.customOrigin).toBe('Field')
      expect(e.customMessage).toBe(`CustomField with id: ${idToSend}, not found`)
      done()
    })
  })

  test('Should throw a "Validation Error"', done => {
    CustomField.findByIdAndUpdate = jest.fn(() => ({
      exec: () => new Promise((resolve, reject) => {
        let valErr = new Error('Faked Error')
        valErr.name = "ValidationError"
        reject(valErr)
      })
    }))

    customFieldCtrl.update(idToSend, fieldToSend).then(() => { expect(1).toBe(0) })
    .catch(e => {
      expect(e.message).toBe('Faked Error')
      expect(e.name).toBe('ValidationError')
      expect(e.customOrigin).toBe('Field')
      expect(e.customMessage).toBe('Validation Error')
      done()
    })
  })

  test('Should throw a "Duplicated Name" Error', done => {
    CustomField.findByIdAndUpdate = jest.fn(() => ({
      exec: () => new Promise((resolve, reject) => {
        let dupErr = new Error('Faked Error')
        dupErr.code = 11000
        rejectdupErr
      })
    }))

    customFieldCtrl.update(idToSend, fieldToSend).then(() => { expect(1).toBe(0) })
    .catch(e => {
      expect(e.message).toBe('Faked Error')
      expect(e.name).toBe('DuplicationError')
      expect(e.customOrigin).toBe('Field')
      expect(e.customMessage).toBe('Duplicated Name')
      done()
    })
  })

  test('Should throw an "Unexpected Error" Error with custom origin', done => {
    CustomField.findByIdAndUpdate = jest.fn(() => ({
      exec: () => new Promise((resolve, reject) => {
        const err = new Error('Faked Error')
        err.name = 'WhatAnError'
        err.customOrigin = 'AHAAA'
        reject(err)
      })
    }))

    customFieldCtrl.update(idToSend, fieldToSend).then(() => { expect(1).toBe(0) })
    .catch(e => {
      expect(e.message).toBe('Faked Error')
      expect(e.name).toBe('WhatAnError')
      expect(e.customOrigin).toBe('AHAAA')
      expect(e.customMessage).toBe('Unexpected Error')
      done()
    })
  })

})
