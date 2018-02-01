const moment = require('moment')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const Text = require('../Text')
jest.mock('../Store')
const Store = require('../Store')

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

    expect(uCommon.howManyKeys(v.errors)).toBe(1)
    expect(v.errors.text).toBeTruthy()
  })

  test('Should be invalid if empty text', () => {
    const m = new Text({ text: '' })
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


  describe('preRemove Middleware', () => {
    let idToSend, foundStore, anotherStore

    beforeEach(() => { 
      idToSend = new ObjectId('ffffffffffffaaaaaaaaaaaa') 
      foundStore   = Object.assign(uSchemas.getValidStore(), { texts: [idToSend], 
        save: jest.fn(() => new Promise((resolve, reject) => { resolve() })) 
      })
      anotherStore = Object.assign(uSchemas.getValidStore(), { texts: [idToSend], 
        save: jest.fn(() => new Promise((resolve, reject) => { resolve() })) 
      })
      foundStore.texts.pull = jest.fn(() => { foundStore.texts.pop() })
      anotherStore.texts.pull = jest.fn(() => { anotherStore.texts.pop() })
      Store.find = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve([foundStore, anotherStore])
        })
      }))
    })

    const bindMiddleware = context => {
      return Text.schema._middlewareFuncs.preRemove.bind(context)
    }

    test('Should call next', done => {
      const _conditions = { _id: idToSend }
      const boundMiddleware = bindMiddleware({_conditions})
      const next = err => {
        expect(err).toBeFalsy()
        done()
      }

      boundMiddleware(next)
    })

    test('Should call Store.find with reservation id', done => {
      const _conditions = { _id: idToSend }
      const boundMiddleware = bindMiddleware({_conditions})
      const next = err => {
        expect(err).toBeFalsy()
        expect(Store.find.mock.calls.length).toBe(1)
        expect(Store.find.mock.calls[0][0]).toEqual({ texts: idToSend })
        done()
      }

      boundMiddleware(next)
    })

    test('Should update and save stores', done => {
      const _conditions = { _id: idToSend }
      const boundMiddleware = bindMiddleware({_conditions})
      const next = err => {
        expect(err).toBeFalsy()
        expect(foundStore.texts.pull.mock.calls.length).toBe(1)
        expect(anotherStore.texts.pull.mock.calls.length).toBe(1)
        expect(foundStore.texts.pull.mock.calls[0][0]).toEqual(idToSend)
        expect(anotherStore.texts.pull.mock.calls[0][0]).toEqual(idToSend)
        expect(foundStore.texts.length).toBe(0)
        expect(anotherStore.texts.length).toBe(0)
        expect(foundStore.save.mock.calls.length).toBe(1)
        expect(anotherStore.save.mock.calls.length).toBe(1)
        done()
      }

      boundMiddleware(next)
    })

    test('Should call next with Store.find error', done => {
      const _conditions = { _id: idToSend }
      const boundMiddleware = bindMiddleware({_conditions})
      Store.find = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          const err = new Error('Faked Error')
          err.name = 'QueryError'
          reject(err)
        })
      }))
      const next = err => {
        expect(err.message).toBe('Faked Error')
        expect(err.name).toBe('QueryError')
        done()
      }

      boundMiddleware(next)
    })

    test('Should call next with Store.update error', done => {
      const _conditions = {_id: idToSend}
      const boundMiddleware = bindMiddleware({_conditions})
      anotherStore.save = jest.fn(() => new Promise((resolve, reject) => {
        const err = new Error('Faked Error')
        err.name = 'ValidationError'
        reject(err)
      }))
      const next = err => {
        expect(err.message).toBe('Faked Error')
        expect(err.name).toBe('ValidationError')
        done()
      }

      boundMiddleware(next)
    })

  })

})