const moment = require('moment')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const Text = require('../Text')

const uCommon = require('../../utils')
const uSchemas = require('../../utils/validSchemas')
const uValid = require('../../utils/validators')

describe('Text model', () => {

  test('Should be valid', () => {
    const m = new Text( uSchemas.getValidText() )
    const v = m.validateSync()

    expect(v).toBeFalsy()
  })

  test('Should be invalid if no text', () => {
    const m = new Text({ })
    const v = m.validateSync()

    expect(uCommon.howManyKeys(v.errors)).toBe(2)
    expect(v.errors.text).toBeTruthy()
    expect(v.errors.store).toBeTruthy()
  })

  test('Should be invalid if empty text', () => {
    const m = new Text({ text: '', store: 'Kampamocha' })
    const v = m.validateSync()

    expect(uCommon.howManyKeys(v.errors)).toBe(1)
    expect(v.errors.text).toBeTruthy()
  })

  describe('preSave Middleware', () => {
    const bindMiddleware = context => 
      Text.schema._middlewareFuncs.preSave.bind(context)

    test('Shoul call next', done => {
      const context = uSchemas.getValidText()
      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(err).toBeFalsy()
        done()
      }

      boundMiddleware(next)
    })

    test('Should add dates', done => {
      const context = uSchemas.getValidText()
      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(err).toBeFalsy()
        expect( uValid.isThisMinute(context.created_at) ).toBeTruthy()
        expect( uValid.isThisMinute(context.updated_at) ).toBeTruthy()
        done()
      }

      boundMiddleware(next)
    })

    test('Should modify update date', done => {
      const lastWeek = moment().subtract(1, 'weeks').toDate()
      const context = Object.assign(uSchemas.getValidText(), {
        created_at: lastWeek, updated_at: lastWeek
      })
      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(err).toBeFalsy()
        expect( uValid.isThisMinute(context.updated_at) ).toBeTruthy()
        expect(context.created_at).toBe(lastWeek)
        done()
      }

      boundMiddleware(next)
    })

  })

  describe('preUpdate Middleware', () => {
    const bindMiddleware = context => 
      Text.schema._middlewareFuncs.preUpdate.bind(context)

    test('Should be fine', done => {
      const _update = { text: 'sudoasnd' }
      const boundMiddleware = bindMiddleware({_update})
      const next = err => {
        expect(err).toBeFalsy()
        done()
      }

      boundMiddleware(next)
    })

    test('Should update update date', done => {
      const _update = { text: 'sajbsakj' }
      const boundMiddleware = bindMiddleware({_update})
      const next = err => {
        expect(err).toBeFalsy()
        expect( uValid.isThisMinute(_update.updated_at) ).toBeTruthy()
        done()
      }

      boundMiddleware(next)
    })

  })

})