const Client = require('../Client')

describe('Client model', () => {
  let validClient, validAddress, validOrder

  beforeEach(() => { setupTest() })

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