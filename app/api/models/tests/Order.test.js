const Order = require('../Order')

const { getValidOrder } = require('../../utils/models')

describe('Order model', () => {
  let validOrder

  beforeEach(() => { setupTest() })

  test('Should be valid', () => {
    const m = new Order( getValidOrder() )
    const v = m.validateSync()

    expect(v).toBeFalsy()
  })

  test('Should be invalid if no: email, products, status, shipping, shipping_address, billing_address')

  test('Should be invalid if email wrong format')

  test('Should be invalid if wrong address if for billing or shipping')

  test('Should be invalid if malformed product')

  function setupTest() {
    validOrder = getValidOrder()
  }
})
 