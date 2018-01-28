jest.mock('crypto')
const crypto = require('crypto')
const oldpbkdf2 = crypto.pbkdf2

const models = require('../models')

describe('models utils', () => {

  describe('hashPassword', () => {

    test('Should return an object', async () => {
      const password = 'password123'

      hashObj = await models.hashPassword(password)

      expect( hashObj.hasOwnProperty('salt') ).toBe(true)
      expect( hashObj.hasOwnProperty('hash') ).toBe(true)
    })

    test('Should call crypto.randomBytes and crypto.pbkdf2', async () => {
      const password = 'password123'

      const randomBytes = jest.spyOn(crypto, 'randomBytes')
      const pbkdf2 = jest.spyOn(crypto, 'pbkdf2')

      hashObj = await models.hashPassword(password)

      expect( randomBytes ).toHaveBeenCalled()
      expect( pbkdf2 ).toHaveBeenCalled()
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
        crypto.pbkdf2.mockRestore()
        expect( e.message ).toBe('Hash it babe')
      }
    })

  })

  describe('isPasswordRight', () => {

    test('Should return true', async () => {
      crypto.pbkdf2 = oldpbkdf2
      const hashObj = await models.hashPassword('tecate_light')

      const isRight = await models.isPasswordRight(hashObj.hash, hashObj.salt, 'tecate_light')

      expect( isRight ).toBe(true)
    })

    test('Should return an error', async () => {
      const password = 'tecate_light'

      crypto.pbkdf2 = jest.fn((psw, salt, iters, length, dig, callback) => {
        let error = new Error('Hash it babe')
        callback(error)
      })

      try {
        await models.isPasswordRight(password)
        expect(1).toBe(0)
      } catch (e) {
        expect( e.message ).toBe('Hash it babe')
      }
    })

  })

})

  