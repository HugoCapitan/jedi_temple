const clientCtrl = require('../../clientCtrl')

jest.mock('../../../models/Client')
let Client = require('../../../models/Client')

const uSchemas = require('../../../utils/validSchemas')

describe('clientCtrl -> create', () => {
  let clientToSend, savedClient

  beforeEach(() => {
    clientToSend = uSchemas.getValidClient()
    savedClient  = uSchemas.getValidClient()

    Client.prototype.save = jest.fn(() => new Promise((resolve, reject) => { resolve(savedClient) }))
  })

  test('Should instantiate new Client with received body', async () => {
    await clientCtrl.create(clientToSend)

    expect(Client.mock.calls.length).toBe(1)
    expect(Client.mock.calls[0][0]).toBe(clientToSend)
  })

  test('Should call save on the new Client', async () => {
    await clientCtrl.create(clientToSend)
    expect(Client.prototype.save.mock.calls.length).toBe(1)
  })

  test('Should return the new Client after saved', async () => {
    const received = await clientCtrl.create(clientToSend)

    expect(received).toBe(savedClient)
  })

  test('Should throw a ValidationError', done => {
    Client.prototype.save = jest.fn(() => new Promise((resolve, reject) => {
      const err = new Error('Faked Error')
      err.name = 'ValidationError'
      reject(err)
    }))

    clientCtrl.create(clientToSend).catch(err => {
      expect(err.message).toBe('Faked Error')
      expect(err.name).toBe('ValidationError')
      expect(err.customMessage).toBe('Validation Error')
      expect(err.customOrigin).toBe('Client')
      done()
    })
  })

  test('Should throw a DuplicatedError', done => {
    Client.prototype.save = jest.fn(() => new Promise((resolve, reject) => {
      const err = new Error('Faked Error')
      err.code = 11000
      reject(err)
    }))

    clientCtrl.create(clientToSend).catch(err => {
      expect(err.message).toBe('Faked Error')
      expect(err.name).toBe('DuplicationError')
      expect(err.customMessage).toBe('Duplicated Email')
      expect(err.customOrigin).toBe('Client')
      done()
    })
  })

  test('Should throw a UnexpectedError', done => {
    Client.prototype.save = jest.fn(() => new Promise((resolve, reject) => {
      const err = new Error('Faked Error')
      err.customOrigin = 'ACustomOrigin'
      err.name = 'WhatAnError'
      reject(err)
    }))

    clientCtrl.create(clientToSend).catch(err => {
      expect(err.message).toBe('Faked Error')
      expect(err.name).toBe('WhatAnError')
      expect(err.customMessage).toBe('Unexpected Error')
      expect(err.customOrigin).toBe('ACustomOrigin')
      done()
    })
  })

})

describe('clientCtrl -> remove', () => {
  
  test('Should call Client.findByIdAndRemove')

  test('Should return the deleted Client')

  test('Should throw a NotFoundError')

  test('Should throw a UnexpectedError')

})

describe('clientCtrl -> update', () => {

  test('Should call Client.findByIdAndUpdate')

  test('Should call Client.findById and return the found document')

  test('Should throw a ValidationError')

  test('Should throw a DuplicatedError')
  
  test('Should throw a NotFoundError')

  test('Should throw a UnexpectedError')

}) 