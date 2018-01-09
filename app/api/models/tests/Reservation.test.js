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

    expect( howManyKeys(v.errors) ).toBe(5)
    expect(v.errors.email).toBeTruthy()
    expect(v.errors.plan).toBeTruthy()
    expect(v.errors.status).toBeTruthy()
    expect(v.errors.arrive_date).toBeTruthy()
    expect(v.errors.departure_date).toBeTruthy()
  })

  test('Should be invalid if arriving or departure not dates', () => {
    const m = new Reservation( Object.assign( getValidReservation(), { arrive_date: 'what', departure_date: 99 } ) )
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

  test('Should be invalid if wrong plan', () => {
    const m = new Reservation( Object.assign( getValidReservation(), { plan: 'somethingwrong' } ) )
    const v = m.validateSync()

    expect( howManyKeys(v.errors) ).toBe(1)
    expect(v.errors.plan).toBeTruthy()
  })

  test('Should be invalid if email is not an email', () => {
    const m = new Reservation( Object.assign( getValidReservation(), { email: 'whatwhat' } ) )
    const v = m.validateSync()

    expect( howManyKeys(v.errors) ).toBe(1)
    expect(v.errors.email).toBeTruthy()
  })

})