jest.mock('crypto')
const crypto = require('crypto')

const models = require('../models')

describe('hashPassword', () => {

  test('Should return an object', async () => {
    const password = 'password123'

    hashObj = await models.hashPassword(password)

    expect( hashObj.hasOwnProperty('salt') ).toBe(true)
    expect( hashObj.hasOwnProperty('hashedPassword') ).toBe(true)
  })

  test('Should throw an error', async () => {
    const password = 'password123'

    crypto.pbkdf2 = jest.fn((psw, salt, iters, length, dig, callback) => { 
      let error = new Error('Hash it babe')
      callback(error) 
    })

    try {
      hashObj = await models.hashPassword(password)
      expect(1).toBe(0)
    } catch (e) {
      expect( e.message ).toBe('Hash it babe')
    }
  })

})