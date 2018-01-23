const Store = require('../Store')

const { howManyKeys } = require('../../utils')
const { getValidStore } = require('../../utils/validSchemas')

describe('Store model', () => {

  test('Should be valid', () => {
    const m = new Store( getValidStore() )
    const v = m.validateSync()

    expect(v).toBeFalsy()
  })

  test('Should be invalid if missing: name', () => {
    const m = new Store( Object.assign( getValidStore(), { name: undefined } ) )
    const v = m.validateSync()

    expect( howManyKeys(v.errors) ).toBe(1)
    expect(v.errors.name).toBeTruthy()
  })

  test('Should be invalid if empty name', () => {
    const m = new Store( Object.assign( getValidStore(), { name: '' } ) )
    const v = m.validateSync()

    expect( howManyKeys(v.errors) ).toBe(1)
    expect(v.errors.name).toBeTruthy()
  })

  test('Should be invalid if any array has a wrong id', () => {
    const m = new Store( getMalformedIdsStore() )
    const v = m.validateSync()

    expect( howManyKeys(v.errors) ).toBe(7)
    expect(v.errors.products).toBeTruthy()
    expect(v.errors.texts).toBeTruthy()
    expect(v.errors.pictures).toBeTruthy()
    expect(v.errors.customs).toBeTruthy()
    expect(v.errors.orders).toBeTruthy()
    expect(v.errors.clients).toBeTruthy()
    expect(v.errors.reservations).toBeTruthy()
  })

  test('Should be invalid if any array has an empty id', () => {
    const m = new Store( getEmptyIdsStore() )
    const v = m.validateSync()

    expect( howManyKeys(v.errors) ).toBe(7)
    expect(v.errors.products).toBeTruthy()
    expect(v.errors.texts).toBeTruthy()
    expect(v.errors.pictures).toBeTruthy()
    expect(v.errors.customs).toBeTruthy()
    expect(v.errors.orders).toBeTruthy()
    expect(v.errors.clients).toBeTruthy()
    expect(v.errors.reservations).toBeTruthy()
  })

  describe('Calendar configuration', () => {

    test('Should be invalid if furthest_date < nearest_date', () => {
      const m = new Store( Object.assign( 
        getValidStore(), { 
          calendar: { 
            nearest_available_date: 40,
            furthest_available_date: 30,
            maximum_reservation: 10
          } 
        }) 
      )
      const v = m.validateSync()

      expect( howManyKeys(v.errors) ).toBe(4)
      expect(v.errors.calendar).toBeTruthy()
      expect(v.errors['calendar.nearest_available_date']).toBeTruthy()
      expect(v.errors['calendar.furthest_available_date']).toBeTruthy()
      expect(v.errors['calendar.maximum_reservation']).toBeTruthy()      
    })

    test('Should be valid if calendar: max_reservation = furthest_date - nearest_date', () => {
      const m = new Store( Object.assign( 
        getValidStore(), { 
          calendar: { 
            nearest_available_date: 10,
            furthest_available_date: 50,
            maximum_reservation: 40
          } 
        }) 
      )
      const v = m.validateSync()

      expect(v).toBeFalsy
    })

    test('Should be invalid if calendar: max_reservation > furthest_date - nearest_date', () => {
      const m = new Store( Object.assign( 
        getValidStore(), { 
          calendar: { 
            nearest_available_date: 10,
            furthest_available_date: 50,
            maximum_reservation: 90
          } 
        }) 
      )
      const v = m.validateSync()

      expect( howManyKeys(v.errors) ).toBe(2)
      expect(v.errors.calendar).toBeTruthy()
      expect(v.errors['calendar.maximum_reservation']).toBeTruthy()
    })

  })

  function getMalformedIdsStore() {
    return {
      name: 'Super name for a store',
      products: [ 'product._id' ],
      texts: [ 'text._id' ],
      pictures: [ 'picture._id' ],
      customs: [ 'customField._id' ],
      filters: [ 'filter._id' ],
      orders: [ 'order._id' ],
      clients: [ 'client._id' ],
      reservations: [ 'reservation._id' ],
      calendar: {
        nearest_available_date: 7,
        furthest_available_date: 120,
        maximum_reservation: 45
      }
    }
  }

  function getEmptyIdsStore() {
    return {
      name: 'Super name for a store',
      products: [ '' ],
      texts: [ '' ],
      pictures: [ '' ],
      customs: [ '' ],
      filters: [ '' ],
      orders: [ '' ],
      clients: [ '' ],
      reservations: [ '' ],
      calendar: {
        nearest_available_date: 7,
        furthest_available_date: 120,
        maximum_reservation: 45
      }
    }
  }

})