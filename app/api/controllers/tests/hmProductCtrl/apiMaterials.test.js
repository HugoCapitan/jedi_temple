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
      await hmProductCtrl.apiCreateMaterial(req, res)
      
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(foundHMProduct)
      expect(res.data).toEqual(updatedHMProduct)
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

  describe('-> apiRemoveMaterial', () => {
    let materialIdToSend, updatedHMProduct

    beforeEach(() => {
      materialIdToSend = new ObjectId('aaa000aaa000aaa000aaa000')
      updatedHMProduct = Object.assign({}, foundHMProduct, { materials: [] })
      req.params.material_id = materialIdToSend
      foundHMProduct.materials.pull = jest.fn(() => { foundHMProduct.materials.pop() })
    }) 

    test('Should call HMProduct.findById with sent hmproduct_id', async () => {
      await hmProductCtrl.apiRemoveMaterial(req, res)

      expect(HMProduct.findById.mock.calls.length).toBe(1)
      expect(HMProduct.findById.mock.calls[0][0]).toBe(hmProductIdToSend)
    })

    test('Should call foundHMProduct.materials.pull with sent material_id', async () => {
      const expectedQuery = { _id: materialIdToSend }
      
      await hmProductCtrl.apiRemoveMaterial(req, res)

      expect(foundHMProduct.materials.pull.mock.calls.length).toBe(1)
      expect(foundHMProduct.materials.pull.mock.calls[0][0]).toEqual(expectedQuery)
    })

    test('Should call save on foundHMProduct', async () => {
      await hmProductCtrl.apiRemoveMaterial(req, res)

      expect(foundHMProduct.materials.length).toBe(0)
      expect(foundHMProduct.save.mock.calls.length).toBe(1)
    })
    
    test('Should return the updated HMProduct', async () => {
      await hmProductCtrl.apiRemoveMaterial(req, res)

      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(foundHMProduct)
    })

    test('Should return HMProduct NotFound Error', async () => {
      HMProduct.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve(null) })
      }))

      await hmProductCtrl.apiRemoveMaterial(req, res)

      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`HMProduct with id: ${hmProductIdToSend}, not found`)
    })

    test('Should return UnexpectedError', async () => {
      foundHMProduct.save = jest.fn(() => new Promise((resolve, reject) => { 
        reject(new Error('Faked Error')) 
      }))

      await hmProductCtrl.apiRemoveMaterial(req, res)

      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

  describe('-> apiUpdateMaterial', () => {
    let materialIdToSend, foundMaterial, materialUpdate, updatedMaterial

    beforeEach(() => {
      materialIdToSend = new ObjectId('fff000fff000fff000fff000')
      foundMaterial = { _id: materialIdToSend, material_name: 'waaaat', material_price: 788 }
      materialUpdate = { material_name: 'newwaaaat' }
      updatedMaterial = Object.assign({}, foundMaterial, materialUpdate)

      foundHMProduct.materials = [...foundHMProduct.materials, foundMaterial]
      foundHMProduct.materials.id = jest.fn(() => foundMaterial)

      req.params.material_id = materialIdToSend
      req.body = materialUpdate
    })

    test('Should call HMProduct.findById with the sent hmproduct_id', async () => {
      await hmProductCtrl.apiUpdateMaterial(req, res)

      expect(HMProduct.findById.mock.calls.length).toBe(1)
      expect(HMProduct.findById.mock.calls[0][0]).toBe(hmProductIdToSend)
    })
  
    test('Should call foundHMProduct.materials.id with the sent material_id', async() => {
      await hmProductCtrl.apiUpdateMaterial(req, res)

      expect(foundHMProduct.materials.id.mock.calls.length).toBe(1)
      expect(foundHMProduct.materials.id.mock.calls[0][0]).toBe(materialIdToSend)
    })

    test('Should update the desired material', async () => {
      await hmProductCtrl.apiUpdateMaterial(req, res)

      expect(foundMaterial).toEqual(updatedMaterial)
      expect(foundHMProduct.materials.length).toBe(2)
      expect(foundHMProduct.materials[1]).toEqual(updatedMaterial)
    })

    test('Should call save on the foundHMProduct', async () => {
      await hmProductCtrl.apiUpdateMaterial(req, res)
      
      expect(foundHMProduct.save.mock.calls.length).toBe(1)
    })

    test('Should return the saved HMProduct', async () => {
      await hmProductCtrl.apiUpdateMaterial(req, res)
      
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(foundHMProduct)
    })

    test('Should send a HMProduct NotFoundError', async () => {
      HMProduct.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve(null) })
      }))

      await hmProductCtrl.apiUpdateMaterial(req, res)

      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`HMProduct with id: ${hmProductIdToSend}, not found`)
    })

    test('Should send a material NotFoundError', async () => {
      foundHMProduct.materials.id = jest.fn(() => null)

      await hmProductCtrl.apiUpdateMaterial(req, res)

      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Value with id: ${materialIdToSend}, not found for HMProduct with id: ${hmProductIdToSend}`)
    })

    test('Should throw a ValidationError', async () => {
      foundHMProduct.save = jest.fn(() => new Promise((resolve, reject) => {
        const err = new Error('Faked Error')
        err.name = 'ValidationError'
        reject(err)
      }))

      await hmProductCtrl.apiUpdateMaterial(req, res)

      expect(res.statusCode).toBe(403)
      expect(res.data).toBe('Validation Error')
    })

    test('Should send a UnexpectedError', async () => {
      foundHMProduct.save = jest.fn(() => new Promise((resolve, reject) => { 
        reject(new Error('Faked Error')) 
      }))

      await hmProductCtrl.apiUpdateMaterial(req, res)

      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

})
