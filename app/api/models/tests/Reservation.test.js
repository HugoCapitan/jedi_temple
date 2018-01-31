const Reservation = require('../Reservation')
const moment = require('moment')

const { howManyKeys } = require('../../utils')
const { getValidReservation } = require('../../utils/validSchemas')

describe('Reservation model', () => {

  test('Should be valid', () => {
    const m = new Reservation( getValidReservation() )
    const v = m.validateSync()

    expect(v).toBeFalsy()
  })

  test('Should be invalid if any missing field', () => {
    const m = new Reservation({ })
    const v = m.validateSync()

    expect( howManyKeys(v.errors) ).toBe(4)
    expect(v.errors.email).toBeTruthy()
    expect(v.errors.status).toBeTruthy()
    expect(v.errors.arrive_date).toBeTruthy()
    expect(v.errors.departure_date).toBeTruthy()
  })

  test('Should be invalid if arriving or departure not dates', () => {
    const m = new Reservation( Object.assign( getValidReservation(), { arrive_date: 'wrong', departure_date: 'alsowrong' } ) )
    const v = m.validateSync()

    expect( howManyKeys(v.errors) ).toBe(2)
    expect(v.errors.arrive_date).toBeTruthy()
    expect(v.errors.departure_date).toBeTruthy()
  })

  test('Should be invalid if arriving after departure', () => {
    const m = new Reservation( Object.assign( 
      getValidReservation(), { 
        arrive_date: moment().add('1', 'weeks').toDate(),
        departure_date: moment().add('1', 'days').toDate()
      })
    )
    const v = m.validateSync()

    expect( howManyKeys(v.errors) ).toBe(2)
    expect(v.errors.arrive_date).toBeTruthy()
    expect(v.errors.departure_date).toBeTruthy()
  })

  test('Should be invalid if email is not an email', () => {
    const m = new Reservation( Object.assign( getValidReservation(), { email: 'whatwhat' } ) )
    const v = m.validateSync()

    expect( howManyKeys(v.errors) ).toBe(1)
    expect(v.errors.email).toBeTruthy()
  })

  describe('preSave Middleware', () => {

    const boundMiddleware = context => {
      if (!context.isModified) context.isModified = prop => false
      return Reservation._middlewareFuncs.preSave.bind(context)
    }

    test('Should call next')

    test('Should add dates')

    test('Should update update date')

    test('Should calculate total')

    test('Should call next with UnexpectedError')

  })

  describe('preUpdate Middleware', () => {
    const boundMiddleware = context => {
      return Reservation._middlewareFuncs.preUpdate.bind(context)
    }

    test('Should call next')

    test('Should update update date')

    test('Should prevent modification of arriving')

    test('Should prevent modification of departure')

    test('Should prevent modification of price')

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