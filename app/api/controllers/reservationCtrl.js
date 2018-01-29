const Reservation = require('../models/Reservation')

const { sendError } = require('../utils/http')

module.exports = {
  apiAll, 
  apiCreate, 
  apiRead, 
  apiRemove, 
  apiUpdate
}

async function apiAll(req, res) {
  try {
    let all = await Reservation.find()
    res.status(200).json(all)
  } catch (e) {
    sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiCreate(req, res) {
  try {
    let newReservation = await new Reservation(req.body).save()
    res.status(200).json(newReservation)
  } catch (e) {
    if (e.name === 'ValidationError')
      sendError(403, 'Validation Error', e, res)
    else if (e.code === 11000)
      sendError(409, 'Duplicated Name', e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiRead(req, res) {
  try {
    const foundReservation = await Reservation.findById(req.params.id)
    if (!foundReservation) {
      let notFoundError = new Error(`Reservation ${req.params.id} not found`)
      notFoundError.name = 'NotFoundError'
      throw notFoundError
    }

    res.status(200).json(foundReservation)
  } catch(e) {
    if (e.name === 'NotFoundError')
      sendError(404, `Reservation ${req.params.id} not found`, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiRemove(req, res) {
  try {
    const removedReservation = await Reservation.findByIdAndRemove(req.params.id)

    if (!removedReservation) {
      let notFoundError = new Error(`Reservation ${req.params.id} not found`)
      notFoundError.name = "NotFoundError"
      throw notFoundError
    }

    res.status(200).send(`Reservation ${removedReservation._id} deleted`)
  } catch (e) {
    if (e.name === 'CastError' || e.name === 'NotFoundError')
      sendError(404, `Reservation ${req.params.id} not found`, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiUpdate(req, res) {
  try {
    await Reservation.findByIdAndUpdate(req.params.id, req.body)
    const updatedReservation = await Reservation.findById(req.params.id)

    res.status(200).json(updatedReservation)
  } catch (e) {
    if (e.name === 'ValidationError')
      sendError(403, 'Validation Error', e, res)
    else if (e.name === 'CastError')
      sendError(404, `Reservation ${req.params.id} not found`, e, res)
    else if (e.code === 11000)
      sendError(409, 'Duplicated Name', e, res)
    else
      sendError(500, 'Unexpected Error', e, res)

  }
}
