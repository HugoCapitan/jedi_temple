const Order = require('../Order')

const { howManyKeys } = require('../../utils')
const { getValidOrder } = require('../../utils/models')

describe('Order model', () => {
  let validOrder

  beforeEach(() => { setupTest() })

  test('Should be valid', () => {
    const m = new Order( validOrder )
    const v = m.validateSync()

    expect(v).toBeFalsy()
  })

  test('Should be invalid if no: email, status, products, shipping, shipping_address, billing_address', () => {
    const m = new Order({ })
    const v = m.validateSync()

    expect(howManyKeys(v.errors)).toBe(6)
    expect(v.errors.email).toBeTruthy()
    expect(v.errors.status).toBeTruthy()
    expect(v.errors.products).toBeTruthy()
    expect(v.errors.shipping).toBeTruthy()
    expect(v.errors.billing_address).toBeTruthy()
    expect(v.errors.shipping_address).toBeTruthy()
  })

  test('Should be invalid if email wrong format', () => {
    const m = new Order( Object.assign( validOrder, { email: 'thisaintanemail' } ) )
    const v = m.validateSync()

    expect(howManyKeys(v.errors)).toBe(1)
    expect(v.errors.email).toBeTruthy()
  })

  test('Should be invalid if wrong address id if for billing or shipping', () => {
    const m = new Order( Object.assign( validOrder, { shipping_address: 'wrong id babe', billing_address: 'haha' } ) )
    const v = m.validateSync()

    expect(howManyKeys(v.errors)).toBe(2)
    expect(v.errors.billing_address).toBeTruthy()
    expect(v.errors.shipping_address).toBeTruthy()
  })

  test('Should be invalid if wrong quantity in product', () => {
    const malformed = getValidOrder()
    malformed.products[0].quantity = 'whatup'

    const m = new Order(malformed)
    const v = m.validateSync()

    expect(howManyKeys(v.errors)).toBe(1)
    expect(v.errors['products.0.quantity']).toBeTruthy()
  })

  test('Should be invalid if wrong product_id in product', () => {
    const malformed = getValidOrder()
    malformed.products[0].product_id = 'heyhey'

    const m = new Order(malformed)
    const v = m.validateSync()

    expect(howManyKeys(v.errors)).toBe(1)
    expect(v.errors['products.0.product_id']).toBeTruthy()
  })

  function setupTest() {
    validOrder = getValidOrder()
  }
})
 