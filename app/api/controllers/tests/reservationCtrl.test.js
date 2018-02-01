const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

jest.mock('../../models/Reservation')
const Reservation = require('../../models/Reservation')

const reservationCtrl = require('../reservationCtrl')

const uSchemas = require('../../utils/validSchemas')

describe('reservationCtrl', () => {
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
    let reservations
  
    beforeEach(() => {
      reservations = [
        uSchemas.getValidReservation(),
        uSchemas.getValidReservation()
      ]
  
      Reservation.find = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(reservations)
        })
      }))
    })

    test('Should call Reservation.find', async () => {
      await reservationCtrl.apiAll(req, res)
      expect(Reservation.find.mock.calls.length).toBe(1)
    })
  
    test('Should send the returned reservations', async () => {
      await reservationCtrl.apiAll(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(reservations)
    })
  
    test('Should throw a UnexpectedError', async () => {
      Reservation.find = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          reject(new Error('Faked Error'))
        })
      }))
      await reservationCtrl.apiAll(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

  describe('apiCreate', () => {
    let reservationToSend, savedReservation

    beforeEach(() => {
      reservationToSend = uSchemas.getValidReservation()
      savedReservation  = uSchemas.getValidReservation()
      req.body = reservationToSend
      Reservation.prototype.save = jest.fn(() => new Promise((resolve, reject) => {
        resolve(savedReservation)
      }))
    })

    test('Should instantiate a Reservation with the sent body', async () => {
      await reservationCtrl.apiCreate(req, res)

      expect(Reservation.mock.calls.length).toBe(1)
      expect(Reservation.mock.calls[0][0]).toBe(reservationToSend)
    })

    test('Should call Reservation.prototype.save', async () => {
      await reservationCtrl.apiCreate(req, res)
      expect(Reservation.prototype.save.mock.calls.length).toBe(1)
    })

    test('Should send back the saved Reservation', async () => {
      await reservationCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toEqual(savedReservation)
    })

    test('Should send a ValidationError', async () => {
      Reservation.prototype.save = jest.fn(prod => new Promise((resolve, reject) => {
        const valError = new Error('Faked Error')
        valError.name = "ValidationError"
        reject(valError)
      }))
  
      await reservationCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(403)
      expect(res.data).toBe("Validation Error")
    })

    test('Should send a DuplicationError', async () => {
      Reservation.prototype.save = jest.fn(prod => new Promise((resolve, reject) => {
        const dupError = new Error('Faked Error')
        dupError.code = 11000
        reject(dupError)
      }))
  
      await reservationCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(409)
      expect(res.data).toBe('Duplicated Name')
    })

    test('Should send a UnexpectedError', async () => {
      Reservation.prototype.save = jest.fn(prod => new Promise((resolve, reject) => {
        reject(new Error('Faked Error'))
      }))
  
      await reservationCtrl.apiCreate(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

  describe('apiRead', () => {
    let idToSend, reservationToReturn

    beforeEach(() => {
      idToSend = new ObjectId('aaafffaaafffaaafffaaafff')
      reservationToReturn = uSchemas.getValidReservation()
      req.params = {
        id: idToSend
      }

      Reservation.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(reservationToReturn)
        })
      }))
    })

    test('Should call Reservation.findById with the id in req.params.id', async () => {
      await reservationCtrl.apiRead(req, res)
  
      expect(Reservation.findById.mock.calls.length).toBe(1)
      expect(Reservation.findById.mock.calls[0][0]).toBe(req.params.id)
    })
  
    test('Should send the retrieved Reservation', async () => {
      await reservationCtrl.apiRead(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(reservationToReturn)
    })
  
    test('Should send "Reservation with: <recieved_id>, not found"', async () => {
      Reservation.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve(null) })
      }))
  
      await reservationCtrl.apiRead(req, res)
  
      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Reservation with id: ${idToSend}, not found`)
    })
  
    test('Should send "Unexpected Error"', async () => {
      Reservation.findById = jest.fn(id => {throw new Error('Faked Error')})
  
      await reservationCtrl.apiRead(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })

  describe('apiRemove', () => {
    let idToSend, removedReservation

    beforeEach(() => {
      idToSend = new ObjectId('fffaaafffaaafffaaafffaaa')
      removedReservation = uSchemas.getValidReservation()
      req.params = {
        id: idToSend
      }

      Reservation.findByIdAndRemove = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(removedReservation)
        })
      }))
    })

    test('Should call Reservation.findByIdAndRemove() with the sent id', async () => {
      await reservationCtrl.apiRemove(req, res)
  
      expect(Reservation.findByIdAndRemove.mock.calls.length).toBe(1)
      expect(Reservation.findByIdAndRemove.mock.calls[0][0]).toBe(req.params.id)
    })
  
    test('Should send the removed Reservation', async () => {
      await reservationCtrl.apiRemove(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(removedReservation)
    })    
  
    test('Should send 404 "Reservation with id: <sent_id>, not found', async () => {
      Reservation.findByIdAndRemove = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          let castErr = new Error('Faked Error')
          castErr.name = "CastError"
          reject(castErr)
        })
      }))
  
      await reservationCtrl.apiRemove(req, res)
  
      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Reservation with id: ${idToSend}, not found`)
    })
  
    test('Should send "Unexpected Error"', async () => {
      Reservation.findByIdAndRemove = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          reject(new Error('Faked Error'))
        })
      }))
  
      await reservationCtrl.apiRemove(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })
  
  describe('apiUpdate', () => {
    let idToSend, update, updateReturn

    beforeEach(() => {
      idToSend     = new ObjectId('fffaaafffaaafffaaafffaaa')
      update = JSON.stringify({ tracking: 'omg' })
      updateReturn = Object.assign(uSchemas.getValidReservation(), update)
      req.params = {
        id: idToSend
      }
      req.body = update

      Reservation.findByIdAndUpdate = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(updateReturn)
        })
      }))
    })

    test('Should call Reservation.findByIdAndUpdate with sent id and options new: true', async () => {
      await reservationCtrl.apiUpdate(req, res)

      expect(Reservation.findByIdAndUpdate.mock.calls.length).toBe(1)
      expect(Reservation.findByIdAndUpdate.mock.calls[0][0]).toBe(idToSend)
      expect(Reservation.findByIdAndUpdate.mock.calls[0][1]).toBe(update)
      expect(Reservation.findByIdAndUpdate.mock.calls[0][2]).toEqual({new: true})
    })

    test('Should send the updated Reservation', async () => {
      await reservationCtrl.apiUpdate(req, res)
  
      expect(res.statusCode).toBe(200)
      expect(res.data).toEqual(updateReturn)
    })

    test('Should send 404 "Reservation <sent_id> not found"', async () => {
      Reservation.findByIdAndUpdate = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          const notFoundErr = new Error('Faked Error')
          notFoundErr.name = "CastError"
          reject(notFoundErr)
        })
      }))
  
      await reservationCtrl.apiUpdate(req, res)
  
      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Reservation with id: ${idToSend}, not found`)
    })
  
    test('Should send 403 "Validation Error"', async () => {
      Reservation.findByIdAndUpdate = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          const valErr = new Error('Faked Error')
          valErr.name = "ValidationError"
          reject(valErr)
        })
      }))
  
      await reservationCtrl.apiUpdate(req, res)
  
      expect(res.statusCode).toBe(403)
      expect(res.data).toBe('Validation Error')
    })
  
    test('Should send 409 "Duplicated Name"', async () => {
      Reservation.findByIdAndUpdate = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          const dupErr = new Error('Faked Error')
          dupErr.code = 11000
          reject(dupErr)
        })
      }))
  
      await reservationCtrl.apiUpdate(req, res)
  
      expect(res.statusCode).toBe(409)
      expect(res.data).toBe("Duplicated Name")
    })
  
    test('Should send 500 "Unexpected Error"', async () => {
      Reservation.findByIdAndUpdate = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {reject(new Error('Faked Error'))})
      }))
  
      await reservationCtrl.apiUpdate(req, res)
  
      expect(res.statusCode).toBe(500)
      expect(res.data).toBe("Unexpected Error")
    })

  })

  describe('apiUpdateDatesPrice', () => {
    let idToSend, foundReservation, update, updatedReservation

    beforeEach(() => {
      idToSend = new ObjectId('aaafffaaafffaaafffaaafff')
      foundReservation = Object.assign(uSchemas.getValidReservation(), {
        save: jest.fn(() => new Promise((resolve, reject) => { resolve() }))
      })
      update = { night_price: 8080 }

      updatedReservation = Object.assign({}, foundReservation, update)

      Reservation.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => {
          resolve(foundReservation)
        })
      }))

      req = {
        params: {
          id: idToSend
        },
        body: update
      }
    })

    test('Should call reservation.findById', async () => {
      await reservationCtrl.apiUpdateDatesPrice(req, res)

      expect(Reservation.findById.mock.calls.length).toBe(1)
      expect(Reservation.findById.mock.calls[0][0]).toBe(idToSend)
    })

    test('Should update found reservation', async () => {
      await reservationCtrl.apiUpdateDatesPrice(req, res)

      expect(foundReservation).toEqual(updatedReservation)
    })

    test('Should call save on found Reservation', async () => {
      await reservationCtrl.apiUpdateDatesPrice(req, res)

      expect(foundReservation.save.mock.calls.length).toBe(1)
    })

    test('Should return the updated reservation', async () => {
      await reservationCtrl.apiUpdateDatesPrice(req, res)

      expect(res.statusCode).toBe(200)
      expect(res.data).toBe(foundReservation)
      expect(res.data).toEqual(updatedReservation)
    })

    test('Should send NotFoundError', async () => {
      Reservation.findById = jest.fn(() => ({
        exec: () => new Promise((resolve, reject) => { resolve(null) })
      }))

      await reservationCtrl.apiUpdateDatesPrice(req, res)

      expect(res.statusCode).toBe(404)
      expect(res.data).toBe(`Reservation with id: ${idToSend}, not found`)
    })

    test('Should send ValidationError', async () => {
      foundReservation.save = jest.fn(() => new Promise((resolve, reject) => {
        const err = new Error('Faked Error')
        err.name = 'ValidationError'
        reject(err)
      }))

      await reservationCtrl.apiUpdateDatesPrice(req, res)

      expect(res.statusCode).toBe(403)
      expect(res.data).toBe('Validation Error')
    })

    test('Should send UnexpectedError', async () => {
      foundReservation.save = jest.fn(() => new Promise((resolve, reject) => { 
        reject(new Error('Faked Error')) 
      }))

      await reservationCtrl.apiUpdateDatesPrice(req, res)

      expect(res.statusCode).toBe(500)
      expect(res.data).toBe('Unexpected Error')
    })

  })  
    
})
