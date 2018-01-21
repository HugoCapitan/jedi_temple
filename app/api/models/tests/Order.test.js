const Order = require('../Order')

jest.mock('../Store')
jest.mock('../Client')
const Store = require('../Store')
const Client = require('../Client')

const uCommon = require('../../utils')
const uSchemas = require('../../utils/validSchemas')

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

    expect(uCommon.howManyKeys(v.errors)).toBe(6)
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

    expect(uCommon.howManyKeys(v.errors)).toBe(1)
    expect(v.errors.email).toBeTruthy()
  })

  test('Should be invalid if wrong address id if for billing or shipping', () => {
    const m = new Order( Object.assign( validOrder, { shipping_address: 'wrong id babe', billing_address: 'haha' } ) )
    const v = m.validateSync()

    expect(uCommon.howManyKeys(v.errors)).toBe(2)
    expect(v.errors.billing_address).toBeTruthy()
    expect(v.errors.shipping_address).toBeTruthy()
  })

  test('Should be invalid if wrong quantity in product', () => {
    const malformed = uSchemas.getValidOrder()
    malformed.products[0].quantity = 'whatup'

    const m = new Order(malformed)
    const v = m.validateSync()

    // expect(uCommon.howManyKeys(v.errors)).toBe(1)
    expect(v.errors['products.0.quantity']).toBeTruthy()
  })

  test('Should be invalid if wrong product_id in product', () => {
    const malformed = uSchemas.getValidOrder()
    malformed.products[0].product_id = 'heyhey'

    const m = new Order(malformed)
    const v = m.validateSync()

    // expect(uCommon.howManyKeys(v.errors)).toBe(1)
    expect(v.errors['products.0.product_id']).toBeTruthy()
  })

  describe('preSave Middleware', () => {
    const bindMiddleware = context => 
      Order.schema._middlewareFuncs.preSave(context)

    test('Should be no error', done => {
      const context = validOrder
      const boundMiddleware = bindMiddleware(context)
      const next = err => {
        expect(err).toBeFalsy()
        done()
      }

      boundMiddleware(next)
    })

    test('Should create a new order code')

    test('Should add creation and update dates')

    test('Should update update date')

  })

  describe('preUpdate Middleware', () => {
    const bindMiddleware = context => 
      Order.schema._middlewareFuncs.preUpdate(context)
    
    test('Should be no error')

    test('Should prevent code modification')

    test('Should send email on partial shipment')

    test('Should send email on shipment')

    test('Should send email on completed')

    test('Should send email on canceled')

  })

  describe('preRemove Error', () => {
    const bindMiddleware = context => 
      Order.schema._middlewareFuncs.preRemove(context)

    beforeEach(() => {
      Client.find = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve([]) })
      }))
      Store.find = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve([]) })
      }))
    })
    
    test('Should be no error')

    test('Should call find on stores and clients')

    test('Should update and save found stores')

    test('Should update and save found clients')

  })

  function setupTest() {
    validOrder = uSchemas.getValidOrder()
  }
})
 