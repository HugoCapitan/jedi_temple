const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const hmProductCtrl = require('../../hmProductCtrl')

jest.mock('../../../models/HMProduct')
const HMProduct = require('../../../models/HMProduct')

const uSchemas = require('../../../utils/validSchemas')

describe('hmProductCtrl -> apiModels', () => {
  let req, res, foundHMProduct, hmProductIdToSend

  beforeEach(() => {
    hmProductIdToSend = new ObjectId('aaafffaaafffaaafffaaafff')
    foundHMProduct = Object.assign(uSchemas.getValidHMProduct(), {
      save: jest.fn(() => new Promise((resolve, reject) => { resolve() }))
    })

    HMProduct.findById = jest.fn(() => ({
      exec: () => new Promise((resolve, reject) => {
        resolve(foundHMProduct)
      })
    }))

    req = {
      params: {
        hmproduct_id: hmProductIdToSend
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

  describe('-> apiCreateModel', () => {
    let modelToSend, updatedHMProduct

    beforeEach(() => {
      modelToSend = { model_name: 'hey this is the new model' }
      
      updatedHMProduct = Object.assign({}, foundHMProduct, { 
        models: [...foundHMProduct.models, modelToSend]
      })

      req.body = modelToSend
    })

    test('Should call HMProduct.findById with the sent hmproduct_id', async () => {
      await hmProductCtrl.apiCreateModel(req, res)

      expect(HMProduct.findById.mock.calls.length).toBe(1)
      expect(HMProduct.findById.mock.calls[0][0]).toBe(hmProductIdToSend)
    })

    test('Should push sent model to found HMProduct\'s models array', async () => {
      await hmProductCtrl.apiCreateModel(req, res)

      expect(foundHMProduct.models.length).toBe(2)
      expect(foundHMProduct.models).toEqual(updatedHMProduct.models)
    })

    test('Should call foundHMProduct.save', async () => {
      await hmProductCtrl.apiCreateModel(req, res)

      expect(foundHMProduct.save.mock.calls.length).toBe(1)
    })

    test('Should return the saved HMProduct', async () => {
      await hmProductCtrl.apiCreateModel(req, res)
      
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(foundHMProduct)
      expect(res.data).toEqual(updatedHMProduct)
    })
    
    test('Should send a NotFoundError', async () => {
      HMProduct.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve(null) })
      }))

      await hmProductCtrl.apiCreateModel(req, res)

      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`HMProduct with id: ${hmProductIdToSend}, not found`)
    })

    test('Should send a ValidationError', async () => {
      foundHMProduct.save = jest.fn(() => new Promise((resolve, reject) => {
        const err = new Error('Faked Error')
        err.name = 'ValidationError'
        reject(err)
      }))

      await hmProductCtrl.apiCreateModel(req, res)

      expect(res.statusCode).toBe(403)
      expect(res.data).toBe('Validation Error')
    }) 

    test('Should send a UnexpectedError', async () => {
      foundHMProduct.save = jest.fn(() => new Promise((resolve, reject) => { 
        reject(new Error('Faked Error')) 
      }))

      await hmProductCtrl.apiCreateModel(req, res)

      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

})
