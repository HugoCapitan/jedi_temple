const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const productCtrl = require('../../productCtrl')

jest.mock('../../../models/Product')
const Product = require('../../../models/Product')

const uSchemas = require('../../../utils/validSchemas')

describe('productCtrl -> apiCustoms', () => {
  let req, res, foundProduct, productIdToSend

  beforeEach(() => {
    productIdToSend = new ObjectId('aaafffaaafffaaafffaaafff')
    foundProduct = Object.assign(uSchemas.getValidProduct(), {
      save: jest.fn(() => new Promise((resolve, reject) => { resolve() }))
    })

    Product.findById = jest.fn(() => ({
      exec: () => new Promise((resolve, reject) => {
        resolve(foundProduct)
      })
    }))

    req = {
      params: {
        hmproduct_id: productIdToSend
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

  describe('apiAddCustom', () => {})

  describe('apiRemoveCustom', () => {})

  describe('apiUpdateCustom', () => {})

})