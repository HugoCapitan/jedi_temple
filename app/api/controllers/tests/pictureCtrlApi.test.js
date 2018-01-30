const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const pictureCtrl = require('../pictureCtrl')

jest.mock('../../models/Picture')
const Picture = require('../../models/Picture')

const uSchemas = require('../../utils/validSchemas')

describe('pictureCtrl -> API', () => {
  let req, res

  beforeEach(() => {
    req = {}
    res = {
      send(data) { this.data = data },
      json(data) { this.data = data },
      status(code) {
        this.statusCode = code
        return this
      }
    }
  })

  describe('apiAll', () => {
    let pictures
  
    beforeEach(() => {
      pictures = [
        uSchemas.getValidPicture(),
        uSchemas.getValidPicture()
      ]
  
      Picture.find = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(pictures)
        })
      }))
    })
  
    test('Should call Picture.find', async () => {
      await pictureCtrl.apiAll(req, res)
      expect(Picture.find.mock.calls.length).toBe(1)
    })
  
    test('Should send the returned pictures', async () => {
      await pictureCtrl.apiAll(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(pictures)
    })
  
    test('Should throw a UnexpectedError', async () => {
      Picture.find = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          reject(new Error('Faked Error'))
        })
      }))
      await pictureCtrl.apiAll(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })
  
  })

  describe('apiCreate', () => {
    let pictureToSend, savedPicture

    beforeEach(() => {
      pictureToSend = uSchemas.getValidPicture()
      savedPicture  = uSchemas.getValidPicture()
      req.body = pictureToSend
      Picture.prototype.save = jest.fn(() => new Promise((resolve, reject) => {
        resolve(savedPicture)
      }))
    })

    test('Should instantiate a Picture with the sent body', async () => {
      await pictureCtrl.apiCreate(req, res)

      expect(Picture.mock.calls.length).toBe(1)
      expect(Picture.mock.calls[0][0]).toBe(pictureToSend)
    })

    test('Should call Picture.prototype.save', async () => {
      await pictureCtrl.apiCreate(req, res)
      expect(Picture.prototype.save.mock.calls.length).toBe(1)
    })

    test('Should send back the saved Picture', async () => {
      await pictureCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toEqual(savedPicture)
    })

    test('Should send a ValidationError', async () => {
      Picture.prototype.save = jest.fn(prod => new Promise((resolve, reject) => {
        const valError = new Error('Faked Error')
        valError.name = "ValidationError"
        reject(valError)
      }))
  
      await pictureCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(403)
      expect(res.data).toBe("Validation Error")
    })

    test('Should send a DuplicationError', async () => {
      Picture.prototype.save = jest.fn(prod => new Promise((resolve, reject) => {
        const dupError = new Error('Faked Error')
        dupError.code = 11000
        reject(dupError)
      }))
  
      await pictureCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(409)
      expect(res.data).toBe('Duplicated Name')
    })

    test('Should send a UnexpectedError', async () => {
      Picture.prototype.save = jest.fn(prod => new Promise((resolve, reject) => {
        reject(new Error('Faked Error'))
      }))
  
      await pictureCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

  describe('apiRead', () => {
    let idToSend, pictureToReturn

    beforeEach(() => {
      idToSend = new ObjectId('aaafffaaafffaaafffaaafff')
      pictureToReturn = uSchemas.getValidPicture()
      req.params = {
        id: idToSend
      }

      Picture.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(pictureToReturn)
        })
      }))
    })

    test('Should call Picture.findById with the id in req.params.id', async () => {
      await pictureCtrl.apiRead(req, res)
  
      expect(Picture.findById.mock.calls.length).toBe(1)
      expect(Picture.findById.mock.calls[0][0]).toBe(req.params.id)
    })
  
    test('Should send the retrieved Picture', async () => {
      await pictureCtrl.apiRead(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(pictureToReturn)
    })
  
    test('Should send "Picture with: <recieved_id>, not found"', async () => {
      Picture.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve(null) })
      }))
  
      await pictureCtrl.apiRead(req, res)
  
      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Picture with id: ${idToSend}, not found`)
    })
  
    test('Should send "Unexpected Error"', async () => {
      Picture.findById = jest.fn(id => {throw new Error('Faked Error')})
  
      await pictureCtrl.apiRead(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

  describe('apiRemove', () => {
    let idToSend, removedPicture

    beforeEach(() => {
      idToSend = new ObjectId('fffaaafffaaafffaaafffaaa')
      removedPicture = uSchemas.getValidPicture()
      req.params = {
        id: idToSend
      }

      Picture.findByIdAndRemove = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(removedPicture)
        })
      }))
    })

    test('Should call Picture.findByIdAndRemove() with the sent id', async () => {
      await pictureCtrl.apiRemove(req, res)
  
      expect(Picture.findByIdAndRemove.mock.calls.length).toBe(1)
      expect(Picture.findByIdAndRemove.mock.calls[0][0]).toBe(req.params.id)
    })
  
    test('Should send the removed Picture', async () => {
      await pictureCtrl.apiRemove(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(removedPicture)
    })    
  
    test('Should send 404 "Picture with id: <sent_id>, not found', async () => {
      Picture.findByIdAndRemove = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          let castErr = new Error('Faked Error')
          castErr.name = "CastError"
          reject(castErr)
        })
      }))
  
      await pictureCtrl.apiRemove(req, res)
  
      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Picture with id: ${idToSend}, not found`)
    })
  
    test('Should send "Unexpected Error"', async () => {
      Picture.findByIdAndRemove = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          reject(new Error('Faked Error'))
        })
      }))
  
      await pictureCtrl.apiRemove(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

  describe('apiUpdate', () => {
    let idToSend, update, updateReturn

    beforeEach(() => {
      idToSend     = new ObjectId('fffaaafffaaafffaaafffaaa')
      update = JSON.stringify({ tracking: 'omg' })
      updateReturn = Object.assign(uSchemas.getValidPicture(), update)
      req.params = {
        id: idToSend
      }
      req.body = update

      Picture.findByIdAndUpdate = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(updateReturn)
        })
      }))
    })

    test('Should call Picture.findByIdAndUpdate with sent id and options new: true', async () => {
      await pictureCtrl.apiUpdate(req, res)

      expect(Picture.findByIdAndUpdate.mock.calls.length).toBe(1)
      expect(Picture.findByIdAndUpdate.mock.calls[0][0]).toBe(idToSend)
      expect(Picture.findByIdAndUpdate.mock.calls[0][1]).toBe(update)
      expect(Picture.findByIdAndUpdate.mock.calls[0][2]).toEqual({new: true})
    })

    test('Should send the updated Picture', async () => {
      await pictureCtrl.apiUpdate(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toEqual(updateReturn)
    })

    test('Should send 404 "Picture <sent_id> not found"', async () => {
      Picture.findByIdAndUpdate = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          const notFoundErr = new Error('Faked Error')
          notFoundErr.name = "CastError"
          reject(notFoundErr)
        })
      }))
  
      await pictureCtrl.apiUpdate(req, res)
  
      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Picture with id: ${idToSend}, not found`)
    })
  
    test('Should send 403 "Validation Error"', async () => {
      Picture.findByIdAndUpdate = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          const valErr = new Error('Faked Error')
          valErr.name = "ValidationError"
          reject(valErr)
        })
      }))
  
      await pictureCtrl.apiUpdate(req, res)
  
      expect(res.statusCode).toBe(403)
      expect(res.data).toBe('Validation Error')
    })
  
    test('Should send 409 "Duplicated Name"', async () => {
      Picture.findByIdAndUpdate = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          const dupErr = new Error('Faked Error')
          dupErr.code = 11000
          reject(dupErr)
        })
      }))
  
      await pictureCtrl.apiUpdate(req, res)
  
      expect(res.statusCode).toBe(409)
      expect(res.data).toBe("Duplicated Name")
    })
  
    test('Should send 500 "Unexpected Error"', async () => {
      Picture.findByIdAndUpdate = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {reject(new Error('Faked Error'))})
      }))
  
      await pictureCtrl.apiUpdate(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe("Unexpected Error")
    })

  })


})