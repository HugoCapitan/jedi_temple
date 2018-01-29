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

  describe('-> apiRemoveModel', () => {
    let modelIdToSend, updatedHMProduct

    beforeEach(() => {
      modelIdToSend = new ObjectId('aaa000aaa000aaa000aaa000')
      updatedHMProduct = Object.assign({}, foundHMProduct, { models: [] })
      req.params.model_id = modelIdToSend
      foundHMProduct.models.pull = jest.fn(() => { foundHMProduct.models.pop() })
    }) 

    test('Should call HMProduct.findById with sent hmproduct_id', async () => {
      await hmProductCtrl.apiRemoveModel(req, res)

      expect(HMProduct.findById.mock.calls.length).toBe(1)
      expect(HMProduct.findById.mock.calls[0][0]).toBe(hmProductIdToSend)
    })

    test('Should call foundHMProduct.models.pull with sent model_id', async () => {
      const expectedQuery = { _id: modelIdToSend }
      
      await hmProductCtrl.apiRemoveModel(req, res)

      expect(foundHMProduct.models.pull.mock.calls.length).toBe(1)
      expect(foundHMProduct.models.pull.mock.calls[0][0]).toEqual(expectedQuery)
    })

    test('Should call save on foundHMProduct', async () => {
      await hmProductCtrl.apiRemoveModel(req, res)

      expect(foundHMProduct.models.length).toBe(0)
      expect(foundHMProduct.save.mock.calls.length).toBe(1)
    })
    
    test('Should return the updated HMProduct', async () => {
      await hmProductCtrl.apiRemoveModel(req, res)

      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(foundHMProduct)
    })

    test('Should return HMProduct NotFound Error', async () => {
      HMProduct.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve(null) })
      }))

      await hmProductCtrl.apiRemoveModel(req, res)

      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`HMProduct with id: ${hmProductIdToSend}, not found`)
    })

    test('Should return UnexpectedError', async () => {
      foundHMProduct.save = jest.fn(() => new Promise((resolve, reject) => { 
        reject(new Error('Faked Error')) 
      }))

      await hmProductCtrl.apiRemoveModel(req, res)

      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

  describe('-> apiUpdateModel', () => {
    let modelIdToSend, foundModel, modelUpdate, updatedModel

    beforeEach(() => {
      modelIdToSend = new ObjectId('fff000fff000fff000fff000')
      foundModel = { _id: modelIdToSend, model_name: 'waaaat', model_price: 788 }
      modelUpdate = { model_name: 'newwaaaat' }
      updatedModel = Object.assign({}, foundModel, modelUpdate)

      foundHMProduct.models = [...foundHMProduct.models, foundModel]
      foundHMProduct.models.id = jest.fn(() => foundModel)

      req.params.model_id = modelIdToSend
      req.body = modelUpdate
    })

    test('Should call HMProduct.findById with the sent hmproduct_id', async () => {
      await hmProductCtrl.apiUpdateModel(req, res)

      expect(HMProduct.findById.mock.calls.length).toBe(1)
      expect(HMProduct.findById.mock.calls[0][0]).toBe(hmProductIdToSend)
    })
  
    test('Should call foundHMProduct.models.id with the sent model_id', async() => {
      await hmProductCtrl.apiUpdateModel(req, res)

      expect(foundHMProduct.models.id.mock.calls.length).toBe(1)
      expect(foundHMProduct.models.id.mock.calls[0][0]).toBe(modelIdToSend)
    })

    test('Should update the desired model', async () => {
      await hmProductCtrl.apiUpdateModel(req, res)

      expect(foundModel).toEqual(updatedModel)
      expect(foundHMProduct.models.length).toBe(2)
      expect(foundHMProduct.models[1]).toEqual(updatedModel)
    })

    test('Should call save on the foundHMProduct', async () => {
      await hmProductCtrl.apiUpdateModel(req, res)
      
      expect(foundHMProduct.save.mock.calls.length).toBe(1)
    })

    test('Should return the saved HMProduct', async () => {
      await hmProductCtrl.apiUpdateModel(req, res)
      
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(foundHMProduct)
    })

    test('Should send a HMProduct NotFoundError', async () => {
      HMProduct.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve(null) })
      }))

      await hmProductCtrl.apiUpdateModel(req, res)

      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`HMProduct with id: ${hmProductIdToSend}, not found`)
    })

    test('Should send a model NotFoundError', async () => {
      foundHMProduct.models.id = jest.fn(() => null)

      await hmProductCtrl.apiUpdateModel(req, res)

      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Value with id: ${modelIdToSend}, not found for HMProduct with id: ${hmProductIdToSend}`)
    })

    test('Should throw a ValidationError', async () => {
      foundHMProduct.save = jest.fn(() => new Promise((resolve, reject) => {
        const err = new Error('Faked Error')
        err.name = 'ValidationError'
        reject(err)
      }))

      await hmProductCtrl.apiUpdateModel(req, res)

      expect(res.statusCode).toBe(403)
      expect(res.data).toBe('Validation Error')
    })

    test('Should send a UnexpectedError', async () => {
      foundHMProduct.save = jest.fn(() => new Promise((resolve, reject) => { 
        reject(new Error('Faked Error')) 
      }))

      await hmProductCtrl.apiUpdateModel(req, res)

      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

})
