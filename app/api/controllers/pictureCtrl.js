const Picture = require('../models/Picture')

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
    let all = await Picture.find().exec()
    res.status(200).json(all)
  } catch (e) {
    sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiCreate(req, res) {
  try {
    let newPicture = await new Picture(req.body).save()
    res.status(200).json(newPicture)
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
    const foundPicture = await Picture.findById(req.params.id).exec()
    if (!foundPicture) {
      let notFoundError = new Error(`Picture with id: ${req.params.id}, not found`)
      notFoundError.name = 'NotFoundError'
      throw notFoundError
    }

    res.status(200).json(foundPicture)
  } catch(e) {
    if (e.name === 'NotFoundError')
      sendError(404, e.message, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiRemove(req, res) {
  try {
    const removedPicture = await Picture.findByIdAndRemove(req.params.id).exec()

    if (!removedPicture) {
      let notFoundError = new Error(`Picture with id: ${req.params.id}, not found`)
      notFoundError.name = "NotFoundError"
      throw notFoundError
    }

    res.status(200).send(removedPicture)
  } catch (e) {
    if (e.name === 'CastError' || e.name === 'NotFoundError')
      sendError(404, `Picture with id: ${req.params.id}, not found`, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiUpdate(req, res) {
  try {
    const updatedPicture = await Picture.findByIdAndUpdate(req.params.id, req.body, {new: true}).exec()

    res.status(200).json(updatedPicture)
  } catch (e) {
    if (e.name === 'ValidationError')
      sendError(403, 'Validation Error', e, res)
    else if (e.name === 'CastError')
      sendError(404, `Picture with id: ${req.params.id}, not found`, e, res)
    else if (e.code === 11000)
      sendError(409, 'Duplicated Name', e, res)
    else
      sendError(500, 'Unexpected Error', e, res)

  }
}
