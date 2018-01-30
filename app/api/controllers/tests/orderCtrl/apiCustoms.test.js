const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const orderCtrl = require('../../orderCtrl')

jest.mock('../../../models/Order')
const Order = require('../../../models/Order')

const uSchemas = require('../../../utils/validSchemas')

describe('orderCtrl -> api custom methods', () => {
  let req, res, orderIdToSend, foundOrder

  beforeEach(() => {
    orderIdToSend = new ObjectId('aaafffaaafffaaafffaaafff')
    foundOrder = Object.assign(uSchemas.getValidOrder(), {
      save: jest.fn(() => new Promise((resolve, reject) => { resolve() }))
    })

    Order.findById = jest.fn(() => ({
      exec: () => new Promise((resolve, reject) => {
        resolve(foundOrder)
      })
    }))

    req = { params: {
        order_id: orderIdToSend
      }
    }
    res = {
      send(data) { this.data = data },
      json(data) { this.data = data },
      status(code) {
        this.statusCode = code
        return this
      }
    }
  })

  describe('updateBillingAddress', () => {
    let update, updatedAddress

    beforeEach(() => {
      update = { address_line_1: 'Something new for the line' }
      updatedAddress = Object.assign({}, foundOrder.billing_address, update)
      req.body = update
    })
 
    test('Should call Order.findById with sent order_id', async () => {
      await orderCtrl.apiUpdateBillingAddress(req, res)

      expect(Order.findById.mock.calls.length).toBe(1)
      expect(Order.findById.mock.calls[0][0]).toBe(orderIdToSend)
    })

    test('Should update foundOrder.billingAddress', async () => {
      await orderCtrl.apiUpdateBillingAddress(req, res)

      expect(foundOrder.billing_address).toEqual(updatedAddress)
    })

    test('Should call foundOrder.save', async () => {
      await orderCtrl.apiUpdateBillingAddress(req, res)
      
      expect(foundOrder.save.mock.calls.length).toBe(1)
    })

    test('Should return updated Order', async () => {
      await orderCtrl.apiUpdateBillingAddress(req, res)

      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(foundOrder)
      expect(res.data.billing_address).toEqual(updatedAddress)
    })

    test('Should return NotFoundError', async () => {
      Order.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => resolve(null))
      }))

      await orderCtrl.apiUpdateBillingAddress(req, res)
      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Order with id: ${orderIdToSend}, not found`)
    })

    test('Should return ValidationError', async () => {
     foundOrder.save = jest.fn(() => new Promise((resole, reject) => { 
        const err = new Error('Faked Error')
        err.name = 'ValidationError'
        reject(err)
      }))

      await orderCtrl.apiUpdateBillingAddress(req, res)

      expect(res.statusCode).toBe(403)
      expect(res.data).toBe('Validation Error')
    })

    test('Should return UnexpectedError', async () => {
      foundOrder.save = jest.fn(() => new Promise((resole, reject) => { 
        const err = new Error('Faked Error')
        err.name = 'WHATATATA'
        reject(err)
      }))

      await orderCtrl.apiUpdateBillingAddress(req, res)

      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

  describe('updateShippingAddress', () => {
    let update, updatedAddress

    beforeEach(() => {
      update = { address_line_1: 'Something new for the line' }
      updatedAddress = Object.assign({}, foundOrder.shipping_address, update)
      req.body = update
    })

    test('Should call Order.findById with sent order_id', async () => {
      await orderCtrl.apiUpdateShippingAddress(req, res)

      expect(Order.findById.mock.calls.length).toBe(1)
      expect(Order.findById.mock.calls[0][0]).toBe(orderIdToSend)
    })

    test('Should update foundOrder.shippingAddress', async () => {
      await orderCtrl.apiUpdateShippingAddress(req, res)

      expect(foundOrder.shipping_address).toEqual(updatedAddress)
    })

    test('Should call foundOrder.save', async () => {
      await orderCtrl.apiUpdateShippingAddress(req, res)
      
      expect(foundOrder.save.mock.calls.length).toBe(1)
    })

    test('Should return updated Order', async () => {
      await orderCtrl.apiUpdateShippingAddress(req, res)

      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(foundOrder)
      expect(res.data.shipping_address).toEqual(updatedAddress)
    })

    test('Should return NotFoundError', async () => {
      Order.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => resolve(null))
      }))

      await orderCtrl.apiUpdateShippingAddress(req, res)
      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Order with id: ${orderIdToSend}, not found`)
    })

    test('Should return ValidationError', async () => {
      foundOrder.save = jest.fn(() => new Promise((resole, reject) => { 
         const err = new Error('Faked Error')
         err.name = 'ValidationError'
         reject(err)
       }))
 
       await orderCtrl.apiUpdateShippingAddress(req, res)
 
       expect(res.statusCode).toBe(403)
       expect(res.data).toBe('Validation Error')
     })

    
     test('Should return UnexpectedError', async () => {
      foundOrder.save = jest.fn(() => new Promise((resole, reject) => { 
        const err = new Error('Faked Error')
        err.name = 'WHATATATA'
        reject(err)
      }))

      await orderCtrl.apiUpdateShippingAddress(req, res)

      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })


  describe('addProduct', () => {

    test('Should call Order.findById')

    test('Should push product id to foundOrder.products')

    test('Should call foundOrder.save')

    test('Should return updated Order')

    test('Should return NotFoundError')

    test('Should return ValidationError')

    test('Should return UnexpectedError')

  })

  describe('removeProduct', () => {

    test('Should call Order.findById')

    test('Should pull product id from foundOrder.products')

    test('Should call foundOrder.save')

    test('Should return updated Order')

    test('Should return NotFoundError')

    test('Should return UnexpectedError')

  })

})