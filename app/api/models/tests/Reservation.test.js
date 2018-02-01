const moment = require('moment')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const Reservation = require('../Reservation')

const uCommon = require('../../utils')
const uSchemas = require('../../utils/validSchemas')
const uValid = require('../../utils/validators')

describe('Reservation model', () => {

  test('Should be valid', () => {
    const m = new Reservation( uSchemas.getValidReservation() )
    const v = m.validateSync()

    expect(v).toBeFalsy()
  })

  test('Should be invalid if any missing field', () => {
    const m = new Reservation({ })
    const v = m.validateSync()

    expect( uCommon.howManyKeys(v.errors) ).toBe(5)
    expect(v.errors.email).toBeTruthy()
    expect(v.errors.status).toBeTruthy()
    expect(v.errors.arrive_date).toBeTruthy()
    expect(v.errors.departure_date).toBeTruthy()
    expect(v.errors.night_price).toBeTruthy()
  })

  test('Should be invalid if arriving or departure not dates', () => {
    const m = new Reservation( Object.assign( uSchemas.getValidReservation(), { arrive_date: 'wrong', departure_date: 'alsowrong' } ) )
    const v = m.validateSync()

    expect( uCommon.howManyKeys(v.errors) ).toBe(2)
    expect(v.errors.arrive_date).toBeTruthy()
    expect(v.errors.departure_date).toBeTruthy()
  })

  test('Should be invalid if arriving after departure', () => {
    const m = new Reservation( Object.assign( 
      uSchemas.getValidReservation(), { 
        arrive_date: moment().add('1', 'weeks').toDate(),
        departure_date: moment().add('1', 'days').toDate()
      })
    )
    const v = m.validateSync()

    expect( uCommon.howManyKeys(v.errors) ).toBe(2)
    expect(v.errors.arrive_date).toBeTruthy()
    expect(v.errors.departure_date).toBeTruthy()
  })

  test('Should be invalid if email is not an email', () => {
    const m = new Reservation( Object.assign( uSchemas.getValidReservation(), { email: 'whatwhat' } ) )
    const v = m.validateSync()

    expect( uCommon.howManyKeys(v.errors) ).toBe(1)
    expect(v.errors.email).toBeTruthy()
  })

  describe('preSave Middleware', () => {

    const bindMiddleware = context => {
      if (!context.isModified) context.isModified = prop => false
      return Reservation.schema._middlewareFuncs.preSave.bind(context)
    }

    test('Should call next', done => {
      const context = uSchemas.getValidReservation()
      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(err).toBeFalsy()
        done()
      }

      boundMiddleware(next)
    })

    test('Should add dates', done => {
      const context = uSchemas.getValidReservation()
      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(err).toBeFalsy()
        expect( uValid.isThisMinute(context.created_at) ).toBeTruthy()
        expect( uValid.isThisMinute(context.updated_at) ).toBeTruthy()
        done()
      }

      boundMiddleware(next)
    })

    test('Should update update date', done => {
      const lastWeek = moment().subtract(1, 'weeks').toDate()
      const context = Object.assign(uSchemas.getValidReservation(), {
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

    test('Should calculate total', done => {
      const context = uSchemas.getValidReservation()
      const total = moment(context.departure_date).diff(context.arrive_date, 'days') * context.night_price
      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(err).toBeFalsy()
        expect(context.total).toBe(total)
        done()
      }

      boundMiddleware(next)      
    })

  })

  describe('preUpdate Middleware', () => {
    const bindMiddleware = context => {
      return Reservation.schema._middlewareFuncs.preUpdate.bind(context)
    }

    test('Should call next', done => {
      const _update = { status: 2 }
      const boundMiddleware = bindMiddleware({_update})
      const next = err => {
        expect(err).toBeFalsy()
        done()
      }

      boundMiddleware(next)
    })

    test('Should update update date', done => {
      const _update = { status: 2 }
      const boundMiddleware = bindMiddleware({_update})
      const next = err => {
        expect(err).toBeFalsy()
        expect( uValid.isThisMinute(_update.updated_at) ).toBeTruthy()
        done()
      }

      boundMiddleware(next)
    })

    test('Should prevent modification of arriving', done => {
      const _update = { arrive_date: new Date() }
      const boundMiddleware = bindMiddleware({_update})
      const next = err => {
        expect(err.message).toBe('arrive_date should be updated via Save')
        expect(err.name).toBe('ValidationError')
        done()
      }

      boundMiddleware()
    })

    test('Should prevent modification of departure', done => {
      const _update = { departure_date: new Date() }
      const boundMiddleware = bindMiddleware({_update})
      const next = err => {
        expect(err.message).toBe('departure_date should be updated via Save')
        expect(err.name).toBe('ValidationError')
        done()
      }
      
      boundMiddleware()      
    })

    test('Should prevent modification of price', done => {
      const _update = { arrnight_priceive_date: 0 }
      const boundMiddleware = bindMiddleware({_update})
      const next = err => {
        expect(err.message).toBe('night_price should be updated via Save')
        expect(err.name).toBe('ValidationError')
        done()
      }

      boundMiddleware()      
    })

  })

  describe('preRemove Middleware', () => {
    const boundMiddleware = context => {
      return Reservation._middlewareFuncs.preRemove.bind(context)
    }

    test('Should call next')

    test('Should call Store.find with reservation id')

    test('Should update and save stores')

    test('Should call next with Store.find error')

    test('Should call next with Store.update error')

  })

})