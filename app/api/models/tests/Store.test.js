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

  function getEmptyIdsStore() {
    return {
      name: 'Super name for a store',
      calendar: {
        nearest_available_date: 7,
        furthest_available_date: 120,
        maximum_reservation: 45
      }
    }
  }

})