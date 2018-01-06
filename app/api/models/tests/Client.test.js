const Client = require('../Client')

describe('Client model', () => {
  let validClient, validAddress, validOrder

  beforeEach(() => { setupTest() })

  test('Should be valid')

  test('Should be invalid if missing: name, email, password')

  test('Should be invalid if malformed address')

  test('Should be invalid if Wishlist Product id missing')
  
  test('Should be invalid if Wishlist Product Malformed')

  function setupTest() {
    validAddress = {
      name: 'Some Name',
      email: 'some@mail.com',
      address_line_1: 'Address number etc',
      address_line_2: 'Appartment number',
      city: 'Maybe a mayor city',
      state: 'Who cares',
      country: 'PR',
      zip: '89231'
    }

    validClient = {
      name: 'Awesome Name',
      mail: 'awesome@mail.com',
      addresses: [validAddress],
      orders: []
    }
  }
})