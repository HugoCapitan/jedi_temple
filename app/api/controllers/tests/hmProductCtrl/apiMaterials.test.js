const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const hmProductCtrl = require('../../hmProductCtrl')

jest.mock('../../../models/HMProduct')
const HMProduct = require('../../../models/HMProduct')

const uSchemas = require('../../../utils/validSchemas')

describe('hmProductCtrl -> apiMaterials', () => {
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

  describe('-> apiCreateMaterial', () => {
    let materialToSend, updatedHMProduct

    beforeEach(() => {
      materialToSend = { material_name: 'hey this is the new material' }
      
      updatedHMProduct = Object.assign({}, foundHMProduct, { 
        materials: [...foundHMProduct.materials, materialToSend]
      })

      req.body = materialToSend
    })

    test('Should call HMProduct.findById with the sent hmproduct_id', async () => {
      await hmProductCtrl.apiCreateMaterial(req, res)

      expect(HMProduct.findById.mock.calls.length).toBe(1)
      expect(HMProduct.findById.mock.calls[0][0]).toBe(hmProductIdToSend)
    })

    test('Should push sent material to found HMProduct\'s materials array', async () => {
      await hmProductCtrl.apiCreateMaterial(req, res)

      expect(foundHMProduct.materials.length).toBe(2)
      expect(foundHMProduct.materials).toEqual(updatedHMProduct.materials)
    })

    test('Should call foundHMProduct.save', async () => {
      await hmProductCtrl.apiCreateMaterial(req, res)

      expect(foundHMProduct.save.mock.calls.length).toBe(1)
    })

    test('Should return the saved HMProduct', async () => {
      Object.assign(updatedHMProduct, {password: undefined, salt: undefined})
      await hmProductCtrl.apiCreateMaterial(req, res)
      
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(foundHMProduct)
      expect(res.data).toEqual(updatedHMProduct)
      expect(res.data.password).toBeFalsy()
      expect(res.data.salt).toBeFalsy()
    })
    
    test('Should send a NotFoundError', async () => {
      HMProduct.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve(null) })
      }))

      await hmProductCtrl.apiCreateMaterial(req, res)

      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`HMProduct with id: ${hmProductIdToSend}, not found`)
    })

    test('Should send a ValidationError', async () => {
      foundHMProduct.save = jest.fn(() => new Promise((resolve, reject) => {
        const err = new Error('Faked Error')
        err.name = 'ValidationError'
        reject(err)
      }))

      await hmProductCtrl.apiCreateMaterial(req, res)

      expect(res.statusCode).toBe(403)
      expect(res.data).toBe('Validation Error')
    }) 

    test('Should send a UnexpectedError', async () => {
      foundHMProduct.save = jest.fn(() => new Promise((resolve, reject) => { 
        reject(new Error('Faked Error')) 
      }))

      await hmProductCtrl.apiCreateMaterial(req, res)

      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })


})
