const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const productCtrl = require('../../productCtrl')

jest.mock('../../../models/Product')
const Product = require('../../../models/Product')

const uSchemas = require('../../../utils/validSchemas')

describe('productCtrl -> apiImages', () => {
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
        product_id: productIdToSend
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

  describe('apiAddImage', () => {
    let imageToSend, updatedProduct

    beforeEach(() => {
      imageToSend = { url: 'someurl.png' , x: '99px', y: '100px' }
      
      updatedProduct = Object.assign({}, foundProduct, { 
        images: [...foundProduct.images, imageToSend]
      })

      req.body = imageToSend
    })

    test('Should call Product.findById with the sent product_id', async () => {
      await productCtrl.apiAddImage(req, res)

      expect(Product.findById.mock.calls.length).toBe(1)
      expect(Product.findById.mock.calls[0][0]).toBe(productIdToSend)
    })

    test('Should push sent image to found Product\'s images array', async () => {
      await productCtrl.apiAddImage(req, res)

      expect(foundProduct.images.length).toBe(2)
      expect(foundProduct.images).toEqual(updatedProduct.images)
    })

    test('Should call foundProduct.save', async () => {
      await productCtrl.apiAddImage(req, res)

      expect(foundProduct.save.mock.calls.length).toBe(1)
    })

    test('Should return the saved Product', async () => {
      await productCtrl.apiAddImage(req, res)
      
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(foundProduct)
      expect(res.data).toEqual(updatedProduct)
    })
    
    test('Should send a NotFoundError', async () => {
      Product.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve(null) })
      }))

      await productCtrl.apiAddImage(req, res)

      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Product with id: ${productIdToSend}, not found`)
    })

    test('Should send a ValidationError', async () => {
      foundProduct.save = jest.fn(() => new Promise((resolve, reject) => {
        const err = new Error('Faked Error')
        err.name = 'ValidationError'
        reject(err)
      }))

      await productCtrl.apiAddImage(req, res)

      expect(res.statusCode).toBe(403)
      expect(res.data).toBe('Validation Error')
    }) 

    test('Should send a UnexpectedError', async () => {
      foundProduct.save = jest.fn(() => new Promise((resolve, reject) => { 
        reject(new Error('Faked Error')) 
      }))

      await productCtrl.apiAddImage(req, res)

      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

  describe('apiRemoveImage', () => {
    let imageIdToSend, updatedProduct

    beforeEach(() => {
      imageIdToSend = new ObjectId('aaa000aaa000aaa000aaa000')
      updatedProduct = Object.assign({}, foundProduct, { images: [] })
      req.params.image_id = imageIdToSend
      foundProduct.images.pull = jest.fn(() => { foundProduct.images.pop() })
    }) 

    test('Should call Product.findById with sent product_id', async () => {
      await productCtrl.apiRemoveImage(req, res)

      expect(Product.findById.mock.calls.length).toBe(1)
      expect(Product.findById.mock.calls[0][0]).toBe(productIdToSend)
    })

    test('Should call foundProduct.images.pull with sent image_id', async () => {
      const expectedQuery = { _id: imageIdToSend }
      
      await productCtrl.apiRemoveImage(req, res)

      expect(foundProduct.images.pull.mock.calls.length).toBe(1)
      expect(foundProduct.images.pull.mock.calls[0][0]).toEqual(expectedQuery)
    })

    test('Should call save on foundProduct', async () => {
      await productCtrl.apiRemoveImage(req, res)

      expect(foundProduct.images.length).toBe(0)
      expect(foundProduct.save.mock.calls.length).toBe(1)
    })
    
    test('Should return the updated Product', async () => {
      await productCtrl.apiRemoveImage(req, res)

      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(foundProduct)
    })

    test('Should return Product NotFound Error', async () => {
      Product.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve(null) })
      }))

      await productCtrl.apiRemoveImage(req, res)

      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Product with id: ${productIdToSend}, not found`)
    })

    test('Should return UnexpectedError', async () => {
      foundProduct.save = jest.fn(() => new Promise((resolve, reject) => { 
        reject(new Error('Faked Error')) 
      }))

      await productCtrl.apiRemoveImage(req, res)

      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })
  })

  describe('apiUpdateImage', () => {
    let imageIdToSend, foundImage, imageUpdate, updatedImage

    beforeEach(() => {
      imageIdToSend = new ObjectId('fff000fff000fff000fff000')
      foundImage = { _id: imageIdToSend, url: 'whatwhat.png', x: '788px', y: '50%' }
      imageUpdate = { x: '50%' }
      updatedImage = Object.assign({}, foundImage, imageUpdate)

      foundProduct.images = [...foundProduct.images, foundImage]
      foundProduct.images.id = jest.fn(() => foundImage)

      req.params.image_id = imageIdToSend
      req.body = imageUpdate
    })

    test('Should call Product.findById with the sent product_id', async () => {
      await productCtrl.apiUpdateImage(req, res)

      expect(Product.findById.mock.calls.length).toBe(1)
      expect(Product.findById.mock.calls[0][0]).toBe(productIdToSend)
    })
  
    test('Should call foundProduct.images.id with the sent image_id', async() => {
      await productCtrl.apiUpdateImage(req, res)

      expect(foundProduct.images.id.mock.calls.length).toBe(1)
      expect(foundProduct.images.id.mock.calls[0][0]).toBe(imageIdToSend)
    })

    test('Should update the desired image', async () => {
      await productCtrl.apiUpdateImage(req, res)

      expect(foundImage).toEqual(updatedImage)
      expect(foundProduct.images.length).toBe(2)
      expect(foundProduct.images[1]).toEqual(updatedImage)
    })

    test('Should call save on the foundProduct', async () => {
      await productCtrl.apiUpdateImage(req, res)
      
      expect(foundProduct.save.mock.calls.length).toBe(1)
    })

    test('Should return the saved Product', async () => {
      await productCtrl.apiUpdateImage(req, res)
      
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(foundProduct)
    })

    test('Should send a Product NotFoundError', async () => {
      Product.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve(null) })
      }))

      await productCtrl.apiUpdateImage(req, res)

      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Product with id: ${productIdToSend}, not found`)
    })

    test('Should send a image NotFoundError', async () => {
      foundProduct.images.id = jest.fn(() => null)

      await productCtrl.apiUpdateImage(req, res)

      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Image with id: ${imageIdToSend}, not found for Product with id: ${productIdToSend}`)
    })

    test('Should throw a ValidationError', async () => {
      foundProduct.save = jest.fn(() => new Promise((resolve, reject) => {
        const err = new Error('Faked Error')
        err.name = 'ValidationError'
        reject(err)
      }))

      await productCtrl.apiUpdateImage(req, res)

      expect(res.statusCode).toBe(403)
      expect(res.data).toBe('Validation Error')
    })

    test('Should send a UnexpectedError', async () => {
      foundProduct.save = jest.fn(() => new Promise((resolve, reject) => { 
        reject(new Error('Faked Error')) 
      }))

      await productCtrl.apiUpdateImage(req, res)

      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })
  })

})