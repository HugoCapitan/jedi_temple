const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

jest.mock('../../models/Text')
const Text = require('../../models/Text')

const textCtrl = require('../textCtrl')

const uSchemas = require('../../utils/validSchemas')

describe('textCtrl', () => {
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
    let texts
  
    beforeEach(() => {
      texts = [
        uSchemas.getValidText(),
        uSchemas.getValidText()
      ]
  
      Text.find = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(texts)
        })
      }))
    })

    test('Should call Text.find', async () => {
      await textCtrl.apiAll(req, res)
      expect(Text.find.mock.calls.length).toBe(1)
    })
  
    test('Should send the returned texts', async () => {
      await textCtrl.apiAll(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(texts)
    })
  
    test('Should throw a UnexpectedError', async () => {
      Text.find = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          reject(new Error('Faked Error'))
        })
      }))
      await textCtrl.apiAll(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

  describe('apiCreate', () => {
    let textToSend, savedText

    beforeEach(() => {
      textToSend = uSchemas.getValidText()
      savedText  = uSchemas.getValidText()
      req.body = textToSend
      Text.prototype.save = jest.fn(() => new Promise((resolve, reject) => {
        resolve(savedText)
      }))
    })

    test('Should instantiate a Text with the sent body', async () => {
      await textCtrl.apiCreate(req, res)

      expect(Text.mock.calls.length).toBe(1)
      expect(Text.mock.calls[0][0]).toBe(textToSend)
    })

    test('Should call Text.prototype.save', async () => {
      await textCtrl.apiCreate(req, res)
      expect(Text.prototype.save.mock.calls.length).toBe(1)
    })

    test('Should send back the saved Text', async () => {
      await textCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toEqual(savedText)
    })

    test('Should send a ValidationError', async () => {
      Text.prototype.save = jest.fn(prod => new Promise((resolve, reject) => {
        const valError = new Error('Faked Error')
        valError.name = "ValidationError"
        reject(valError)
      }))
  
      await textCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(403)
      expect(res.data).toBe("Validation Error")
    })

    test('Should send a DuplicationError', async () => {
      Text.prototype.save = jest.fn(prod => new Promise((resolve, reject) => {
        const dupError = new Error('Faked Error')
        dupError.code = 11000
        reject(dupError)
      }))
  
      await textCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(409)
      expect(res.data).toBe('Duplicated Name')
    })

    test('Should send a UnexpectedError', async () => {
      Text.prototype.save = jest.fn(prod => new Promise((resolve, reject) => {
        reject(new Error('Faked Error'))
      }))
  
      await textCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

  describe('apiRead', () => {
    let idToSend, textToReturn

    beforeEach(() => {
      idToSend = new ObjectId('aaafffaaafffaaafffaaafff')
      textToReturn = uSchemas.getValidText()
      req.params = {
        id: idToSend
      }

      Text.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(textToReturn)
        })
      }))
    })

    test('Should call Text.findById with the id in req.params.id', async () => {
      await textCtrl.apiRead(req, res)
  
      expect(Text.findById.mock.calls.length).toBe(1)
      expect(Text.findById.mock.calls[0][0]).toBe(req.params.id)
    })
  
    test('Should send the retrieved Text', async () => {
      await textCtrl.apiRead(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(textToReturn)
    })
  
    test('Should send "Text with: <recieved_id>, not found"', async () => {
      Text.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve(null) })
      }))
  
      await textCtrl.apiRead(req, res)
  
      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Text with id: ${idToSend}, not found`)
    })
  
    test('Should send "Unexpected Error"', async () => {
      Text.findById = jest.fn(id => {throw new Error('Faked Error')})
  
      await textCtrl.apiRead(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

  describe('apiRemove', () => {
    let idToSend, removedText

    beforeEach(() => {
      idToSend = new ObjectId('fffaaafffaaafffaaafffaaa')
      removedText = uSchemas.getValidText()
      req.params = {
        id: idToSend
      }

      Text.findByIdAndRemove = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(removedText)
        })
      }))
    })

    test('Should call Text.findByIdAndRemove() with the sent id', async () => {
      await textCtrl.apiRemove(req, res)
  
      expect(Text.findByIdAndRemove.mock.calls.length).toBe(1)
      expect(Text.findByIdAndRemove.mock.calls[0][0]).toBe(req.params.id)
    })
  
    test('Should send the removed Text', async () => {
      await textCtrl.apiRemove(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(removedText)
    })    
  
    test('Should send 404 "Text with id: <sent_id>, not found', async () => {
      Text.findByIdAndRemove = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          let castErr = new Error('Faked Error')
          castErr.name = "CastError"
          reject(castErr)
        })
      }))
  
      await textCtrl.apiRemove(req, res)
  
      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Text with id: ${idToSend}, not found`)
    })
  
    test('Should send "Unexpected Error"', async () => {
      Text.findByIdAndRemove = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          reject(new Error('Faked Error'))
        })
      }))
  
      await textCtrl.apiRemove(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })
  
  describe('apiUpdate', () => {
    let idToSend, update, updateReturn

    beforeEach(() => {
      idToSend     = new ObjectId('fffaaafffaaafffaaafffaaa')
      update = JSON.stringify({ tracking: 'omg' })
      updateReturn = Object.assign(uSchemas.getValidText(), update)
      req.params = {
        id: idToSend
      }
      req.body = update

      Text.findByIdAndUpdate = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(updateReturn)
        })
      }))
    })

    test('Should call Text.findByIdAndUpdate with sent id and options new: true', async () => {
      await textCtrl.apiUpdate(req, res)

      expect(Text.findByIdAndUpdate.mock.calls.length).toBe(1)
      expect(Text.findByIdAndUpdate.mock.calls[0][0]).toBe(idToSend)
      expect(Text.findByIdAndUpdate.mock.calls[0][1]).toBe(update)
      expect(Text.findByIdAndUpdate.mock.calls[0][2]).toEqual({new: true})
    })

    test('Should send the updated Text', async () => {
      await textCtrl.apiUpdate(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toEqual(updateReturn)
    })

    test('Should send 404 "Text <sent_id> not found"', async () => {
      Text.findByIdAndUpdate = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          const notFoundErr = new Error('Faked Error')
          notFoundErr.name = "CastError"
          reject(notFoundErr)
        })
      }))
  
      await textCtrl.apiUpdate(req, res)
  
      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Text with id: ${idToSend}, not found`)
    })
  
    test('Should send 403 "Validation Error"', async () => {
      Text.findByIdAndUpdate = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          const valErr = new Error('Faked Error')
          valErr.name = "ValidationError"
          reject(valErr)
        })
      }))
  
      await textCtrl.apiUpdate(req, res)
  
      expect(res.statusCode).toBe(403)
      expect(res.data).toBe('Validation Error')
    })
  
    test('Should send 409 "Duplicated Name"', async () => {
      Text.findByIdAndUpdate = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          const dupErr = new Error('Faked Error')
          dupErr.code = 11000
          reject(dupErr)
        })
      }))
  
      await textCtrl.apiUpdate(req, res)
  
      expect(res.statusCode).toBe(409)
      expect(res.data).toBe("Duplicated Name")
    })
  
    test('Should send 500 "Unexpected Error"', async () => {
      ext.findByIdAndUpdate = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {reject(new Error('Faked Error'))})
      }))
  
      await textCtrl.apiUpdate(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe("Unexpected Error")
    })

  }) 
    
})
